import type { Icon } from './schema.js';

export interface SearchOptions {
  /** Restrict to a single category id. */
  category?: string | null;
  /** Restrict to icons available in a region (ISO 3166-1 alpha-2). */
  region?: string | null;
  /** Restrict to icons that ship this weight. */
  weight?: string | null;
  /** Maximum number of results. Omit for all matches. */
  limit?: number;
}

export interface SearchResult {
  icon: Icon;
  score: number;
}

function normalise(value: string): string {
  return (
    value
      .toLowerCase()
      .normalize('NFD')
      // Strip combining marks so "dùndún" is reachable by typing "dundun".
      .replace(/[̀-ͯ]/g, '')
      .trim()
  );
}

function tokenize(query: string): string[] {
  return normalise(query)
    .split(/[^a-z0-9]+/)
    .filter(Boolean);
}

/**
 * Scores one icon against one token.
 *
 * The ordering is deliberate: an exact id match must always outrank a keyword
 * brush, otherwise typing "suya" surfaces every skewer-adjacent glyph first.
 */
function scoreToken(icon: Icon, token: string): number {
  const id = normalise(icon.id);
  const name = normalise(icon.name);

  if (id === token || name === token) return 100;
  if (id.startsWith(token) || name.startsWith(token)) return 60;

  const idSegments = id.split('-');
  if (idSegments.some((segment) => segment === token)) return 50;
  if (idSegments.some((segment) => segment.startsWith(token))) return 35;

  for (const keyword of icon.keywords) {
    const value = normalise(keyword);
    if (value === token) return 30;
    if (value.startsWith(token)) return 20;
    if (value.includes(token)) return 10;
  }

  for (const localName of icon.localNames) {
    const value = normalise(localName.value);
    if (value === token) return 28;
    if (value.startsWith(token)) return 18;
  }

  if (normalise(icon.description).includes(token)) return 5;

  return 0;
}

/**
 * Ranked, offline, allocation-light search over icon metadata.
 *
 * Every token must match something, so "jollof rice" cannot be satisfied by an
 * icon that only matches "rice". Ties fall back to alphabetical id order so the
 * output is stable across runs — the Figma plugin and the website must not
 * disagree about ordering.
 */
export function searchIcons(
  icons: readonly Icon[],
  query: string,
  options: SearchOptions = {},
): SearchResult[] {
  const { category = null, region = null, weight = null, limit } = options;

  const pool = icons.filter((icon) => {
    if (category && icon.category !== category) return false;
    if (region && !icon.regions.includes(region)) return false;
    if (weight && !icon.weights.includes(weight as Icon['weights'][number])) return false;
    return true;
  });

  const tokens = tokenize(query);

  const results: SearchResult[] =
    tokens.length === 0
      ? pool.map((icon) => ({ icon, score: 0 }))
      : pool
          .map((icon) => {
            let total = 0;
            for (const token of tokens) {
              const score = scoreToken(icon, token);
              if (score === 0) return null;
              total += score;
            }
            return { icon, score: total };
          })
          .filter((result): result is SearchResult => result !== null);

  results.sort((a, b) => b.score - a.score || a.icon.id.localeCompare(b.icon.id));

  return typeof limit === 'number' ? results.slice(0, Math.max(0, limit)) : results;
}
