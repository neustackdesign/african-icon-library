/**
 * Resolves the canonical source of every country map.
 *
 * `packages/maps/source/manifest.json` declares, for each map id, whether its
 * geometry comes straight from the master sheet or from a committed override
 * in `packages/maps/source/overrides/<id>.svg` that supersedes it. The master
 * is never edited: it stays as provenance, and all 54 of its outlines are
 * still extracted and validated on every run, so a changed master still fails
 * loudly. An override always wins, and is itself checked to be a normalised
 * standalone map that really does differ from the outline it replaces.
 */

import {
  MapIngestError,
  extractMaps,
  parseOutline,
  renderStandaloneMap,
  type ExpectedMap,
  type ExtractedMap,
} from './map-ingest.ts';

export interface OverrideProvenance {
  file: string;
  reason: string;
  treatment: string;
  sources: Array<{ dataset: string; features: string[]; url: string; licence: string }>;
}

export interface MapSourceManifest {
  master: { file: string; role: string };
  policy: string;
  fromMaster: string[];
  overrides: Record<string, OverrideProvenance>;
}

export interface ResolvedMap extends ExtractedMap {
  source: 'master' | 'override';
  /** The master's own outline for this id, kept for provenance checks. */
  masterSvg: string;
}

function fail(message: string): never {
  throw new MapIngestError(`map sources: ${message}`);
}

/** Parses an override and proves it is in exactly the normalised form ingest writes. */
export function readOverrideSvg(id: string, svg: string): Omit<ExtractedMap, 'region'> {
  const match =
    /^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg" viewBox="0 0 ([\d.]+) ([\d.]+)"[^>]*>\n {2}<path d="([^"]+)"\/>\n<\/svg>\n$/.exec(
      svg,
    );
  if (!match) fail(`overrides/${id}.svg is not a normalised standalone map`);
  const [, w, h, d] = match as unknown as [string, string, string, string];
  const width = Number(w);
  const height = Number(h);
  if (renderStandaloneMap(d, width, height) !== svg) {
    fail(`overrides/${id}.svg does not use the standard map template`);
  }
  const segments = parseOutline(d);
  const moves = segments.filter((s) => s.command === 'M').length;
  const closes = segments.filter((s) => s.command === 'Z').length;
  if (moves === 0 || moves !== closes) fail(`overrides/${id}.svg has an open sub-path`);
  for (const { x, y } of segments) {
    if (x < 0.75 - 1e-9 || y < 0.75 - 1e-9 || x > width - 0.75 + 1e-9 || y > height - 0.75 + 1e-9)
      fail(`overrides/${id}.svg draws outside its padded viewBox`);
  }
  return { id, d, width, height, subpaths: moves, svg };
}

export function resolveMaps(
  master: string,
  expected: readonly ExpectedMap[],
  manifest: MapSourceManifest,
  overrides: Readonly<Record<string, string>>,
): ResolvedMap[] {
  const ids = expected.map((map) => map.id);
  const declared = [...manifest.fromMaster, ...Object.keys(manifest.overrides)];
  if (new Set(declared).size !== declared.length) {
    fail('a map is declared both from the master and as an override, or twice');
  }
  const missing = ids.filter((id) => !declared.includes(id));
  const unknown = declared.filter((id) => !ids.includes(id));
  if (missing.length > 0) fail(`no declared source for: ${missing.join(', ')}`);
  if (unknown.length > 0) fail(`manifest names maps with no metadata: ${unknown.join(', ')}`);
  const stray = Object.keys(overrides).filter((id) => !(id in manifest.overrides));
  if (stray.length > 0) fail(`undeclared override file(s): ${stray.join(', ')}`);

  return extractMaps(master, expected).map((fromMaster) => {
    const provenance = manifest.overrides[fromMaster.id];
    if (!provenance) return { ...fromMaster, source: 'master', masterSvg: fromMaster.svg };
    const svg = overrides[fromMaster.id];
    if (svg === undefined) fail(`override for ${fromMaster.id} is declared but missing`);
    const override = readOverrideSvg(fromMaster.id, svg);
    if (override.d === fromMaster.d) {
      fail(`override for ${fromMaster.id} is identical to the master outline it supersedes`);
    }
    return {
      ...override,
      region: fromMaster.region,
      source: 'override',
      masterSvg: fromMaster.svg,
    };
  });
}
