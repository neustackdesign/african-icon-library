import { describe, expect, it } from 'vitest';

import { loadIcons } from '../scripts/lib/repo.ts';
import { searchIcons } from '../packages/metadata/src/search.ts';

const icons = await loadIcons();
const ids = (query: string, options = {}) =>
  searchIcons(icons, query, options).map((result) => result.icon.id);

describe('searchIcons', () => {
  it('returns everything for an empty query', () => {
    expect(ids('')).toHaveLength(icons.length);
  });

  it('ranks an exact id match first', () => {
    expect(ids('suya')[0]).toBe('suya');
    expect(ids('danfo')[0]).toBe('danfo');
  });

  it('matches on a partial word', () => {
    expect(ids('joll')).toContain('jollof-rice');
  });

  it('matches on a keyword rather than the name', () => {
    expect(ids('minibus')).toContain('danfo');
    expect(ids('banknote')).toContain('naira-note');
  });

  it('requires every token to match', () => {
    expect(ids('jollof rice')).toContain('jollof-rice');
    expect(ids('jollof pumpjack')).toEqual([]);
  });

  it('ignores diacritics so pending local names stay reachable', () => {
    expect(ids('dundun')).toContain('talking-drum');
  });

  it('filters by category', () => {
    const results = ids('', { category: 'food-drink' });
    expect(results.length).toBeGreaterThan(0);
    expect(
      results.every((id) => icons.find((icon) => icon.id === id)?.category === 'food-drink'),
    ).toBe(true);
  });

  it('filters by region', () => {
    expect(ids('', { region: 'NG' })).toHaveLength(icons.length);
    expect(ids('', { region: 'ZZ' })).toEqual([]);
  });

  it('filters by weight', () => {
    expect(ids('', { weight: 'regular' })).toHaveLength(icons.length);
    expect(ids('', { weight: 'bold' })).toEqual([]);
  });

  it('honours the limit', () => {
    expect(ids('', { limit: 3 })).toHaveLength(3);
    expect(ids('', { limit: 0 })).toEqual([]);
  });

  it('is stable for equal scores', () => {
    expect(ids('food')).toEqual(ids('food'));
  });

  it('returns nothing for a query that matches nothing', () => {
    expect(ids('zzzzz')).toEqual([]);
  });
});
