import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import { categories, icons } from '@african-icon-library/metadata';

import {
  CATEGORY_SYSTEM,
  DARK,
  LIGHT,
  categoryColour,
  categoryRank,
  oklchToHex,
  ribbonHeight,
} from '../apps/web/lib/brand.ts';
import { copyLabel, filterEntries } from '../apps/web/lib/browser.ts';
import { browserEntries, categorySummaries, populatedCategories } from '../apps/web/lib/icons.ts';

const WEB = path.resolve(import.meta.dirname, '../apps/web');
const populated = categories.filter((category) =>
  icons.some((icon) => icon.category === category.id),
);

describe('V3 category system', () => {
  it('gives every released category exactly one colour and nothing else', () => {
    const systemIds = CATEGORY_SYSTEM.map((entry) => entry.id).sort();
    expect(systemIds).toEqual(populated.map((category) => category.id).sort());
  });

  it('draws each representative icon from its own category', () => {
    for (const entry of CATEGORY_SYSTEM) {
      const icon = icons.find((candidate) => candidate.id === entry.hero);
      expect(icon, entry.hero).toBeDefined();
      expect(icon?.category).toBe(entry.id);
    }
  });

  it('uses seven distinct colours', () => {
    expect(new Set(CATEGORY_SYSTEM.map((entry) => entry.colour)).size).toBe(CATEGORY_SYSTEM.length);
  });

  it('falls back to a neutral field for a category outside the release', () => {
    expect(categoryColour('places-landmarks')).toBe(DARK.line);
    expect(categoryRank('places-landmarks')).toBe(CATEGORY_SYSTEM.length);
  });
});

describe('oklchToHex', () => {
  it('converts the extremes exactly', () => {
    expect(oklchToHex('oklch(1 0 0)')).toBe('#ffffff');
    expect(oklchToHex('oklch(0 0 0)')).toBe('#000000');
  });

  it('produces hex for every category colour and leaves non-oklch values alone', () => {
    for (const entry of CATEGORY_SYSTEM) expect(oklchToHex(entry.colour)).toMatch(/^#[0-9a-f]{6}$/);
    expect(oklchToHex('#79c79a')).toBe('#79c79a');
  });
});

describe('design tokens', () => {
  const css = readFileSync(path.join(WEB, 'app/globals.css'), 'utf8');
  const token = (name: string) => new RegExp(`--${name}:\\s*([^;]+);`).exec(css)?.[1]?.trim();

  it('keeps globals.css and lib/brand.ts identical', () => {
    const kebab = (key: string) => key.replace(/[A-Z0-9]/g, (char) => `-${char.toLowerCase()}`);
    for (const [key, value] of Object.entries(DARK)) expect(token(kebab(key)), key).toBe(value);
    for (const [key, value] of Object.entries(LIGHT))
      expect(token(`light-${kebab(key)}`), key).toBe(value);
  });

  it('uses square geometry', () => {
    expect(css).not.toMatch(/border-radius:\s*(?!0[;\s])[\d.]+(px|rem|%)/);
  });
});

describe('browser entries', () => {
  const entries = browserEntries();

  it('contains every released icon once, with drawable markup', () => {
    expect(entries).toHaveLength(icons.length);
    expect(new Set(entries.map((entry) => entry.icon.id)).size).toBe(icons.length);
    for (const entry of entries) {
      expect(entry.body.length, entry.icon.id).toBeGreaterThan(0);
      expect(entry.svg).toMatch(/^<svg[^>]+stroke-width="1.5"/);
    }
  });

  it('is ordered by the V3 category order', () => {
    const ranks = entries.map((entry) => categoryRank(entry.icon.category));
    expect(ranks).toEqual([...ranks].sort((a, b) => a - b));
  });

  it('summarises each populated category from canonical data', () => {
    const summaries = categorySummaries();
    expect(summaries.map((summary) => summary.id)).toEqual(populatedCategories().map((c) => c.id));
    expect(summaries.reduce((total, summary) => total + summary.iconIds.length, 0)).toBe(
      icons.length,
    );
    for (const summary of summaries) expect(summary.iconIds).toContain(summary.hero);
  });
});

describe('filterEntries', () => {
  const entries = browserEntries();

  it('returns the whole set in V3 order for an empty query', () => {
    expect(filterEntries(entries, '', 'all')).toEqual(entries);
    expect(filterEntries(entries, '   ', 'all')).toEqual(entries);
  });

  it('ranks an exact id first', () => {
    expect(filterEntries(entries, 'danfo', 'all')[0]?.icon.id).toBe('danfo');
  });

  it('requires every token to match', () => {
    const results = filterEntries(entries, 'jollof rice', 'all').map((entry) => entry.icon.id);
    expect(results).toContain('jollof-rice');
    expect(filterEntries(entries, 'jollof zzzz', 'all')).toEqual([]);
  });

  it('filters by category, keeping V3 order', () => {
    const transport = filterEntries(entries, '', 'transport');
    expect(transport.length).toBe(icons.filter((icon) => icon.category === 'transport').length);
    expect(transport.every((entry) => entry.icon.category === 'transport')).toBe(true);
  });

  it('combines query and category', () => {
    expect(filterEntries(entries, 'danfo', 'food-drink')).toEqual([]);
  });
});

describe('copy feedback', () => {
  it('names every clipboard state', () => {
    expect(copyLabel('idle')).toBe('Copy SVG');
    expect(copyLabel('copied')).toBe('Copied');
    expect(copyLabel('failed')).toBe('Copy blocked');
  });
});

describe('ribbon', () => {
  it('rises from 24% to at most 78%', () => {
    const heights = icons.map((_, index) => ribbonHeight(index, icons.length));
    expect(Math.min(...heights)).toBeGreaterThanOrEqual(19);
    expect(Math.max(...heights)).toBeLessThanOrEqual(78);
    expect(heights[0]).toBe(24);
    expect(heights.at(-1)).toBeGreaterThan(heights[0]!);
  });
});

describe('canonical facts are derived, not typed', () => {
  // The release facts change with the set. A literal count in a component
  // would silently go stale on the next release.
  const sources = [
    'app/page.tsx',
    ...readdirSync(path.join(WEB, 'components/landing')).map(
      (file) => `components/landing/${file}`,
    ),
    'components/IconBrowser.tsx',
    'components/MapBrowser.tsx',
    'components/LibraryBrowser.tsx',
    'app/maps/[id]/page.tsx',
    'components/SiteHeader.tsx',
    'components/SiteFooter.tsx',
  ];

  it.each(sources)('%s has no hard-coded icon or category count', (file) => {
    const source = readFileSync(path.join(WEB, file), 'utf8');
    expect(source).not.toMatch(new RegExp(`\\b${icons.length}\\s+(icons?|components)\\b`, 'i'));
    expect(source).not.toMatch(/\b(?:30|thirty)\s+icons\b/i);
    expect(source).not.toMatch(/\b(?:54|fifty-four)\s+(?:country\s+)?maps\b/i);
    expect(source).not.toMatch(/['"`]v?0\.[23]\.0['"`]/);
  });
});

describe('map routes', () => {
  it('generates the map pages from canonical data and lists them in the sitemap', () => {
    const page = readFileSync(path.join(WEB, 'app/maps/[id]/page.tsx'), 'utf8');
    expect(page).toMatch(
      /generateStaticParams[\s\S]*maps\.map\(\(map\) => \(\{ id: map\.id \}\)\)/,
    );
    expect(page).toContain('dynamicParams = false');
    const sitemap = readFileSync(path.join(WEB, 'app/sitemap.ts'), 'utf8');
    expect(sitemap).toMatch(/\/maps\//);
  });
});
