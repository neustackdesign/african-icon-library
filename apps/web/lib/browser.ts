import { searchIcons } from '@african-icon-library/metadata';

import type { BrowserIcon } from './icons';

/**
 * Filters the canonical entries with the canonical metadata search — the same
 * ranking the Figma plugin uses.
 *
 * With no query every score is equal, so the V3 category order the entries
 * arrive in is kept rather than falling back to alphabetical.
 */
export function filterEntries(
  entries: readonly BrowserIcon[],
  query: string,
  category: string,
): BrowserIcon[] {
  const byId = new Map(entries.map((entry) => [entry.icon.id, entry]));
  const results = searchIcons(
    entries.map((entry) => entry.icon),
    query,
    { category: category === 'all' ? null : category },
  );
  if (query.trim() === '') {
    const order = new Map(entries.map((entry, index) => [entry.icon.id, index]));
    results.sort((a, b) => (order.get(a.icon.id) ?? 0) - (order.get(b.icon.id) ?? 0));
  }
  return results.map((result) => byId.get(result.icon.id)!);
}

/** Label for the copy button in each clipboard state. */
export function copyLabel(state: 'idle' | 'copied' | 'failed'): string {
  if (state === 'copied') return 'Copied';
  if (state === 'failed') return 'Copy blocked';
  return 'Copy SVG';
}
