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
import { readOverrideSvg, resolveMaps } from '../scripts/lib/map-sources.ts';
import {
  PATHS,
  listMapAssets,
  loadMapRegions,
  loadMapSources,
  loadMaps,
} from '../scripts/lib/repo.ts';
import { validateMapAsset, validateMapCollection } from '../scripts/lib/validate.ts';

const master = await readFile(PATHS.mapsMaster, 'utf8');
const records = await loadMaps();
const regions = await loadMapRegions();
const assets = await listMapAssets();
const sources = await loadMapSources();
const resolved = resolveMaps(master, records, sources.manifest, sources.overrides);

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

  it('is deterministic and the committed SVGs match their resolved sources byte for byte', () => {
    expect(extractMaps(master, records)).toEqual(extractMaps(master, records));
    expect(resolveMaps(master, records, sources.manifest, sources.overrides)).toEqual(resolved);
    const committed = new Map(assets.map((asset) => [asset.id, asset.source]));
    for (const map of resolved) expect(committed.get(map.id), map.id).toBe(map.svg);
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

describe('map sources and overrides', () => {
  const OVERRIDES = ['equatorial-guinea', 'mauritius', 'morocco', 'tanzania'];
  const byId = new Map(resolved.map((map) => [map.id, map]));

  it('declares every map exactly once: 50 from the master, four overrides', () => {
    expect(Object.keys(sources.manifest.overrides).sort()).toEqual(OVERRIDES);
    expect(Object.keys(sources.overrides).sort()).toEqual(OVERRIDES);
    expect(sources.manifest.fromMaster).toHaveLength(50);
    expect([...sources.manifest.fromMaster, ...OVERRIDES].sort()).toEqual(
      records.map((map) => map.id).sort(),
    );
    for (const id of OVERRIDES) {
      const entry = sources.manifest.overrides[id]!;
      expect(entry.file).toBe(`overrides/${id}.svg`);
      expect(entry.reason.length).toBeGreaterThan(20);
      expect(entry.sources[0]!.url).toContain('natural-earth-vector/v5.1.2');
    }
  });

  it('ships Morocco from its override, never the master outline that includes Western Sahara', () => {
    const morocco = byId.get('morocco')!;
    expect(morocco.source).toBe('override');
    expect(morocco.svg).not.toBe(morocco.masterSvg);
    expect(assets.find((asset) => asset.id === 'morocco')!.source).toBe(sources.overrides.morocco);
    // The master path survives only as provenance.
    const masterD = /d="([^"]+)"/.exec(morocco.masterSvg)![1]!;
    expect(assets.some((asset) => asset.source.includes(masterD))).toBe(false);
  });

  it('adds the missing national territory to the other three overrides', () => {
    expect(byId.get('tanzania')!.subpaths).toBe(3); // mainland, Unguja, Pemba
    expect(byId.get('mauritius')!.subpaths).toBe(2); // main island, Rodrigues
    expect(byId.get('equatorial-guinea')!.subpaths).toBe(3); // Río Muni, Bioko, Annobón
    for (const id of OVERRIDES) expect(byId.get(id)!.svg).not.toBe(byId.get(id)!.masterSvg);
  });

  it('refuses an override that silently reverts to the master', () => {
    const reverted = { ...sources.overrides, morocco: byId.get('morocco')!.masterSvg };
    expect(() => resolveMaps(master, records, sources.manifest, reverted)).toThrow(MapIngestError);
  });

  it('refuses undeclared, missing or double-declared sources', () => {
    expect(() =>
      resolveMaps(master, records, sources.manifest, { ...sources.overrides, kenya: '' }),
    ).toThrow(/undeclared/);
    const { morocco: _, ...rest } = sources.overrides;
    expect(() => resolveMaps(master, records, sources.manifest, rest)).toThrow(/missing/);
    const doubled = {
      ...sources.manifest,
      fromMaster: [...sources.manifest.fromMaster, 'morocco'],
    };
    expect(() => resolveMaps(master, records, doubled, sources.overrides)).toThrow(/twice|both/);
  });

  it('only accepts overrides in the normalised map form', () => {
    expect(() => readOverrideSvg('morocco', '<svg/>')).toThrow(MapIngestError);
  });

  it('states the cartographic policy', () => {
    expect(sources.manifest.policy).toBe(
      'AIL follows a documented cartographic treatment for disputed territories. Boundary representations do not imply endorsement of territorial claims.',
    );
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
