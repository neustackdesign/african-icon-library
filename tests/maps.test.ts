import { readFile } from 'node:fs/promises';

import { describe, expect, it } from 'vitest';

import { mapRegionLabels, maps, searchMaps } from '@african-icon-library/metadata';

import { fitMapSize, mapIds, renderMapSvg } from '../packages/maps/src/index.ts';
import { filterMaps } from '../apps/web/lib/browser.ts';
import { mapEntries } from '../apps/web/lib/maps.ts';
import {
  EXPECTED_MAP_COUNT,
  EXPECTED_REGION_COUNTS,
  MapIngestError,
  extractMaps,
} from '../scripts/lib/map-ingest.ts';
import { PATHS, listMapAssets, loadMapRegions, loadMaps } from '../scripts/lib/repo.ts';
import { validateMapAsset, validateMapCollection } from '../scripts/lib/validate.ts';

const master = await readFile(PATHS.mapsMaster, 'utf8');
const records = await loadMaps();
const regions = await loadMapRegions();
const assets = await listMapAssets();

describe('map ingest', () => {
  it('extracts exactly 54 maps in the N7 / W15 / C8 / E16 / S8 grouping', () => {
    expect(EXPECTED_MAP_COUNT).toBe(54);
    const extracted = extractMaps(master, records);
    expect(extracted).toHaveLength(54);
    for (const [region, count] of EXPECTED_REGION_COUNTS) {
      expect(
        extracted.filter((map) => map.region === region),
        region,
      ).toHaveLength(count);
    }
  });

  it('is deterministic and matches the committed SVGs byte for byte', () => {
    const first = extractMaps(master, records);
    const second = extractMaps(master, records);
    expect(second).toEqual(first);
    const committed = new Map(assets.map((asset) => [asset.id, asset.source]));
    for (const map of first) expect(committed.get(map.id), map.id).toBe(map.svg);
  });

  it('fails loudly when the master loses a country', () => {
    const broken = master.replace(/<path[^>]*stroke-width="1\.5"[^>]*\/>/, '');
    expect(() => extractMaps(broken, records)).toThrow(MapIngestError);
  });

  it('fails loudly when the metadata does not list every map', () => {
    expect(() => extractMaps(master, records.slice(0, 53))).toThrow(MapIngestError);
  });

  it('keeps islands as separate closed sub-paths', () => {
    const byId = new Map(extractMaps(master, records).map((map) => [map.id, map]));
    expect(byId.get('cabo-verde')!.subpaths).toBeGreaterThan(1);
    expect(byId.get('comoros')!.subpaths).toBeGreaterThan(1);
  });
});

describe('map metadata', () => {
  it('has 54 records with unique ids, ISO2 and ISO3 codes', () => {
    expect(records).toHaveLength(54);
    for (const key of ['id', 'iso2', 'iso3'] as const) {
      expect(new Set(records.map((map) => map[key])).size, key).toBe(54);
    }
    for (const map of records) {
      expect(map.iso2).toMatch(/^[A-Z]{2}$/);
      expect(map.iso3).toMatch(/^[A-Z]{3}$/);
      expect(regions.some((region) => region.id === map.region)).toBe(true);
    }
  });

  it('keeps slugs separate from display names', () => {
    const name = (id: string) => records.find((map) => map.id === id)?.name;
    expect(name('cote-d-ivoire')).toBe('Côte d’Ivoire');
    expect(name('congo-brazzaville')).toBe('Republic of the Congo');
    expect(name('gambia')).toBe('The Gambia');
  });

  it('has one SVG per record and no orphan files', () => {
    expect(assets.map((asset) => asset.id).sort()).toEqual(records.map((map) => map.id).sort());
    expect(validateMapCollection({ maps: records, regions, assets })).toEqual([]);
  });

  it('reports duplicates, orphans and missing assets', () => {
    const findings = validateMapCollection({
      maps: [...records, { ...records[0]!, id: 'ghost' }],
      regions,
      assets: [...assets, { id: 'stray', file: 'stray.svg' }],
    });
    const rules = findings.map((finding) => finding.rule).join(' ');
    expect(findings.length).toBeGreaterThanOrEqual(3);
    expect(rules).toMatch(/iso/);
  });
});

describe('map SVG safety', () => {
  it('passes every committed map', () => {
    for (const asset of assets) expect(validateMapAsset(asset), asset.id).toEqual([]);
  });

  it.each([
    ['a script', (svg: string) => svg.replace('</svg>', '<script>alert(1)</script></svg>')],
    ['text', (svg: string) => svg.replace('</svg>', '<text>Nigeria</text></svg>')],
    ['a transform', (svg: string) => svg.replace('<path ', '<path transform="scale(2)" ')],
    ['a fill', (svg: string) => svg.replace('fill="none"', 'fill="#000"')],
    ['an open path', (svg: string) => svg.replace(/Z"\/>/, '"/>')],
  ])('rejects %s', (_, mutate) => {
    const asset = assets[0]!;
    expect(validateMapAsset({ ...asset, source: mutate(asset.source) }).length).toBeGreaterThan(0);
  });
});

describe('map search', () => {
  const ids = (query: string, region?: string) =>
    searchMaps(maps, query, { regionLabels: mapRegionLabels(), region }).map((r) => r.map.id);

  it.each([
    ['Ivory Coast', 'cote-d-ivoire'],
    ['cote', 'cote-d-ivoire'],
    ['DRC', 'congo-kinshasa'],
    ['Cape Verde', 'cabo-verde'],
    ['Swaziland', 'eswatini'],
    ['NG', 'nigeria'],
    ['NGA', 'nigeria'],
    ['ke', 'kenya'],
  ])('resolves %s to %s first', (query, id) => {
    expect(ids(query)[0]).toBe(id);
  });

  it('matches a region by its label and filters by region', () => {
    expect(ids('west africa')).toHaveLength(15);
    expect(ids('', 'southern-africa')).toHaveLength(8);
    expect(ids('nigeria', 'east-africa')).toEqual([]);
  });

  it('requires every token to match', () => {
    expect(ids('nigeria zzzz')).toEqual([]);
  });
});

describe('maps package and generated data', () => {
  it('exports every map in master order', () => {
    expect([...mapIds]).toEqual(records.map((map) => map.id));
  });

  it('fits the longest side without distortion', () => {
    for (const id of mapIds) {
      const fitted = fitMapSize(id, 512)!;
      expect(Math.max(fitted.width, fitted.height)).toBeCloseTo(512, 5);
    }
    expect(fitMapSize('atlantis', 64)).toBeUndefined();
  });

  it('renders a standalone, titled SVG', () => {
    const svg = renderMapSvg('kenya', { size: 64, title: 'Kenya' })!;
    expect(svg).toMatch(/^<svg[^>]+stroke="currentColor"/);
    expect(svg).toContain('<title');
    expect(renderMapSvg('atlantis')).toBeUndefined();
  });

  it('gives the website one entry per map, searchable through filterMaps', () => {
    const entries = mapEntries();
    expect(entries).toHaveLength(54);
    expect(filterMaps(entries, 'DR Congo', 'all', mapRegionLabels())[0]?.map.id).toBe(
      'congo-kinshasa',
    );
  });
});
