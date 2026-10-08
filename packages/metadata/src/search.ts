/**
 * Deterministic, offline search shared by the website and the Figma plugin.
 *
 * Data-free: importable as `@african-icon-library/metadata/search` without
 * loading the library's records. Both functions accept the minimal shape they
 * read, so callers pass whatever records they hold.
 */

/** The fields icon search reads. Any public icon record satisfies it. */
export interface SearchableIcon {
  id: string;
  name: string;
  description: string;
  category: string;
  regions: readonly string[];
  weights: readonly string[];
  keywords: readonly string[];
  localNames: readonly { value: string }[];
}

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

export interface SearchResult<T extends SearchableIcon = SearchableIcon> {
  icon: T;
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
function scoreToken(icon: SearchableIcon, token: string): number {
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
export function searchIcons<T extends SearchableIcon>(
  icons: readonly T[],
  query: string,
  options: SearchOptions = {},
): SearchResult<T>[] {
  const { category = null, region = null, weight = null, limit } = options;

  const pool = icons.filter((icon) => {
    if (category && icon.category !== category) return false;
    if (region && !icon.regions.includes(region)) return false;
    if (weight && !icon.weights.includes(weight)) return false;
    return true;
  });

  const tokens = tokenize(query);

  const results: SearchResult<T>[] =
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
          .filter((result): result is SearchResult<T> => result !== null);

  results.sort((a, b) => b.score - a.score || a.icon.id.localeCompare(b.icon.id));

  return typeof limit === 'number' ? results.slice(0, Math.max(0, limit)) : results;
}

/* ------------------------------------------------------------------ *
 * Country maps
 * ------------------------------------------------------------------ */

export interface MapSearchOptions {
  /** Restrict to one AIL regional group id (`west-africa`). */
  region?: string | null;
  limit?: number;
}

export interface MapSearchResult<T> {
  map: T;
  score: number;
}

export interface SearchableMap {
  id: string;
  name: string;
  officialName?: string;
  iso2: string;
  iso3: string;
  region: string;
  aliases: readonly string[];
  keywords: readonly string[];
}

/** Apostrophes vanish rather than split a word, so "côte d’ivoire" meets "cote divoire" too. */
function mapWords(value: string): string[] {
  return normalise(value.replace(/[’']/g, ' '))
    .split(/[^a-z0-9]+/)
    .filter(Boolean);
}

function scoreMapToken(map: SearchableMap, regionLabel: string, token: string): number {
  const iso = token.toUpperCase();
  if (iso === map.iso2 || iso === map.iso3) return 100;

  const names = [map.name, ...map.aliases, map.officialName ?? ''].filter(Boolean);
  const words = [...new Set([...mapWords(map.id), ...names.flatMap(mapWords)])];
  if (words.some((word) => word === token)) return 60;
  if (words.some((word) => word.startsWith(token))) return 40;

  const regionWords = [...mapWords(map.region), ...mapWords(regionLabel)];
  if (regionWords.some((word) => word === token || word.startsWith(token))) return 15;

  if (map.keywords.some((keyword) => normalise(keyword).startsWith(token))) return 5;
  return 0;
}

/**
 * Ranked, offline search over country maps: name, aliases (`DRC`, `Ivory
 * Coast`), official name, ISO 3166-1 alpha-2 and alpha-3 codes, and region.
 *
 * Every token must match. Ties keep the caller's order — the master's regional
 * order — so the website and the plugin always agree.
 */
export function searchMaps<T extends SearchableMap>(
  maps: readonly T[],
  query: string,
  options: MapSearchOptions & { regionLabels?: Readonly<Record<string, string>> } = {},
): MapSearchResult<T>[] {
  const { region = null, limit, regionLabels = {} } = options;
  const pool = maps
    .map((map, index) => ({ map, index }))
    .filter(({ map }) => !region || map.region === region);
  const tokens = [...new Set(mapWords(query))];

  const scored = pool
    .map(({ map, index }) => {
      let total = 0;
      for (const token of tokens) {
        const score = scoreMapToken(map, regionLabels[map.region] ?? '', token);
        if (score === 0) return null;
        total += score;
      }
      return { map, score: total, index };
    })
    .filter((entry): entry is { map: T; score: number; index: number } => entry !== null)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map(({ map, score }) => ({ map, score }));

  return typeof limit === 'number' ? scored.slice(0, Math.max(0, limit)) : scored;
}
