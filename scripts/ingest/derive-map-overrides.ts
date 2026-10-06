/**
 * Derives the committed country-map overrides from Natural Earth.
 *
 *   npx tsx scripts/ingest/derive-map-overrides.ts --source <ne_10m_admin_0_map_subunits.geojson>
 *
 * A one-off authoring step, not part of `npm run check`: its outputs are the
 * committed `packages/maps/source/overrides/*.svg`, which `maps:ingest` then
 * treats as canonical. Re-running it with the pinned source reproduces them
 * byte for byte. The source file is verified against the SHA-256 recorded in
 * `packages/maps/source/manifest.json` and is never committed itself.
 *
 * Treatments (also recorded per map in the manifest):
 *
 *   morocco            Natural Earth MAR, clipped at 27.661439°N — the
 *                      Morocco–Western Sahara line in the same dataset — so
 *                      Western Sahara is excluded. Redrawn whole from data.
 *   tanzania           The master's mainland outline, unchanged in shape, plus
 *                      Unguja and Pemba (Natural Earth TZZ) placed by fitting
 *                      Natural Earth's mainland to the master's.
 *   equatorial-guinea  The master's Río Muni and Bioko, plus Annobón (GNA),
 *   mauritius          and the master's main island plus Rodrigues (MUS):
 *                      each remote island at true relative scale and true
 *                      bearing, moved in along that bearing to sit just clear
 *                      of the drawing — an inset, so the open sea between
 *                      them does not shrink the mainland to a dot.
 *
 * Geometry is projected equirectangularly with x scaled by cos(mean latitude),
 * the projection the master's outlines match, simplified with
 * Douglas–Peucker, and normalised like every other map: longest side 19.6,
 * padded by half the 1.5 stroke.
 */

import { createHash } from 'node:crypto';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

import { extractMaps, num, parseOutline, renderStandaloneMap } from '../lib/map-ingest.ts';
import { PATHS, loadMaps, relative } from '../lib/repo.ts';

type Point = [number, number];
type Ring = Point[];

const LONGEST = 19.6; // the master's geometry longest side; 21.1 with stroke padding
const PAD = 0.75;
const BOUNDARY_LAT = 27.661439; // Natural Earth's Morocco–Western Sahara boundary

interface Feature {
  properties: Record<string, string>;
  geometry: { type: 'Polygon' | 'MultiPolygon'; coordinates: number[][][] | number[][][][] };
}

function outerRings(feature: Feature): Ring[] {
  const polygons =
    feature.geometry.type === 'Polygon'
      ? [feature.geometry.coordinates as number[][][]]
      : (feature.geometry.coordinates as number[][][][]);
  return polygons.map((polygon) => polygon[0]!.map(([x, y]) => [x!, y!] as Point));
}

function ringBox(rings: readonly Ring[]) {
  const xs = rings.flat().map((p) => p[0]);
  const ys = rings.flat().map((p) => p[1]);
  return {
    minX: Math.min(...xs),
    maxX: Math.max(...xs),
    minY: Math.min(...ys),
    maxY: Math.max(...ys),
  };
}

/** Equirectangular, x scaled by cos(latitude), y down. */
function project(rings: readonly Ring[], cosLat: number): Ring[] {
  return rings.map((ring) => ring.map(([lon, lat]) => [lon * cosLat, -lat] as Point));
}

/** Keeps the part of a ring north of `lat` (Sutherland–Hodgman on one half-plane). */
function clipNorthOf(ring: Ring, lat: number): Ring {
  const out: Ring = [];
  for (let i = 0; i < ring.length; i += 1) {
    const a = ring[i]!;
    const b = ring[(i + 1) % ring.length]!;
    const aIn = a[1] >= lat;
    const bIn = b[1] >= lat;
    if (aIn) out.push(a);
    if (aIn !== bIn) {
      const t = (lat - a[1]) / (b[1] - a[1]);
      out.push([a[0] + t * (b[0] - a[0]), lat]);
    }
  }
  return out;
}

function simplify(ring: Ring, tolerance: number): Ring {
  const open =
    ring[0]![0] === ring.at(-1)![0] && ring[0]![1] === ring.at(-1)![1] ? ring.slice(0, -1) : ring;
  if (open.length <= 4) return open;
  // Split at the vertex farthest from the first, so the closed ring keeps its extent.
  let far = 0;
  let best = -1;
  for (const [i, p] of open.entries()) {
    const d = (p[0] - open[0]![0]) ** 2 + (p[1] - open[0]![1]) ** 2;
    if (d > best) [best, far] = [d, i];
  }
  const dp = (points: Ring): Ring => {
    const [a, b] = [points[0]!, points.at(-1)!];
    let index = 0;
    let max = 0;
    for (let i = 1; i < points.length - 1; i += 1) {
      const p = points[i]!;
      const len = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1e-12;
      const d = Math.abs((b[0] - a[0]) * (a[1] - p[1]) - (a[0] - p[0]) * (b[1] - a[1])) / len;
      if (d > max) [max, index] = [d, i];
    }
    if (max <= tolerance) return [a, b];
    return [...dp(points.slice(0, index + 1)).slice(0, -1), ...dp(points.slice(index))];
  };
  const first = dp(open.slice(0, far + 1));
  const second = dp([...open.slice(far), open[0]!]);
  return [...first.slice(0, -1), ...second.slice(0, -1)];
}

function ringsFromPath(d: string): Ring[] {
  const rings: Ring[] = [];
  for (const segment of parseOutline(d)) {
    if (segment.command === 'M') rings.push([[segment.x, segment.y]]);
    else if (segment.command === 'L') rings.at(-1)!.push([segment.x, segment.y]);
  }
  return rings;
}

/** Uniformly scales to the shared longest side, pads, and renders. */
function normalise(rings: readonly Ring[]): string {
  const box = ringBox(rings);
  const scale = LONGEST / Math.max(box.maxX - box.minX, box.maxY - box.minY);
  const d = rings
    .map(
      (ring) =>
        ring
          .map(
            ([x, y], i) =>
              `${i === 0 ? 'M' : 'L'}${num((x - box.minX) * scale + PAD)} ${num((y - box.minY) * scale + PAD)}`,
          )
          .join('') + 'Z',
    )
    .join('');
  const width = (box.maxX - box.minX) * scale + 2 * PAD;
  const height = (box.maxY - box.minY) * scale + 2 * PAD;
  return renderStandaloneMap(d, Number(num(width)), Number(num(height)));
}

/**
 * Places Natural Earth islands against the master's own mainland outline:
 * fits Natural Earth's projected mainland box to the master mainland box and
 * maps the islands through the same similarity transform.
 */
function placeAgainst(masterMain: Ring, neMain: Ring, islands: Ring[]): Ring[] {
  const m = ringBox([masterMain]);
  const n = ringBox([neMain]);
  const sx = (m.maxX - m.minX) / (n.maxX - n.minX);
  const sy = (m.maxY - m.minY) / (n.maxY - n.minY);
  if (Math.abs(sx / sy - 1) > 0.1) {
    throw new Error(`master and Natural Earth mainland disagree in aspect (${sx} vs ${sy})`);
  }
  const s = (sx + sy) / 2;
  const cx = (m.minX + m.maxX) / 2 - ((n.minX + n.maxX) / 2) * s;
  const cy = (m.minY + m.maxY) / 2 - ((n.minY + n.maxY) / 2) * s;
  return islands.map((ring) => ring.map(([x, y]) => [x * s + cx, y * s + cy] as Point));
}

/**
 * Inset placement for a remote island: keeps its true size and its true
 * bearing from the master drawing's centre, but moves it in along that
 * bearing until it sits one gap clear of the existing drawing.
 */
const INSET_GAP = 2.5; // master units: the 1.5 stroke plus a clear unit
function inset(existing: readonly Ring[], island: Ring): Ring {
  const e = ringBox(existing);
  const i = ringBox([island]);
  const anchor = [(e.minX + e.maxX) / 2, (e.minY + e.maxY) / 2];
  const centre = [(i.minX + i.maxX) / 2, (i.minY + i.maxY) / 2];
  const v = [centre[0]! - anchor[0]!, centre[1]! - anchor[1]!];
  const clear = (t: number) => {
    const dx = (t - 1) * v[0]!;
    const dy = (t - 1) * v[1]!;
    return (
      i.maxX + dx < e.minX - INSET_GAP ||
      i.minX + dx > e.maxX + INSET_GAP ||
      i.maxY + dy < e.minY - INSET_GAP ||
      i.minY + dy > e.maxY + INSET_GAP
    );
  };
  if (!clear(1)) return island; // already close: true position
  let lo = 0;
  let hi = 1;
  for (let step = 0; step < 40; step += 1) {
    const mid = (lo + hi) / 2;
    if (clear(mid)) hi = mid;
    else lo = mid;
  }
  return island.map(([x, y]) => [x + (hi - 1) * v[0]!, y + (hi - 1) * v[1]!] as Point);
}

function largest(rings: readonly Ring[]): Ring {
  const area = (r: Ring) => {
    const b = ringBox([r]);
    return (b.maxX - b.minX) * (b.maxY - b.minY);
  };
  return [...rings].sort((a, b) => area(b) - area(a))[0]!;
}

async function main(): Promise<number> {
  const at = process.argv.indexOf('--source');
  const sourcePath = at > 0 ? process.argv[at + 1] : undefined;
  if (!sourcePath) {
    process.stderr.write(
      'usage: derive-map-overrides --source <ne_10m_admin_0_map_subunits.geojson>\n',
    );
    return 1;
  }
  const manifest = JSON.parse(await readFile(PATHS.mapsSourceManifest, 'utf8')) as {
    naturalEarth: { sha256: string };
  };
  const raw = await readFile(sourcePath);
  const sha = createHash('sha256').update(raw).digest('hex');
  if (sha !== manifest.naturalEarth.sha256) {
    process.stderr.write(
      `source SHA-256 ${sha} does not match the pinned ${manifest.naturalEarth.sha256}\n`,
    );
    return 1;
  }
  const features = (JSON.parse(raw.toString('utf8')) as { features: Feature[] }).features;
  const su = (code: string) => {
    const found = features.filter((f) => f.properties.SU_A3 === code);
    if (found.length !== 1) throw new Error(`expected one Natural Earth subunit ${code}`);
    return outerRings(found[0]!);
  };

  const master = await readFile(PATHS.mapsMaster, 'utf8');
  const fromMaster = new Map(extractMaps(master, await loadMaps()).map((m) => [m.id, m]));
  const masterRings = (id: string) => ringsFromPath(fromMaster.get(id)!.d);
  const out: Record<string, string> = {};

  /* Morocco: Natural Earth MAR north of the Western Sahara line. */
  {
    const ring = clipNorthOf(su('MAR')[0]!, BOUNDARY_LAT);
    const box = ringBox([ring]);
    const cos = Math.cos((((box.minY + box.maxY) / 2) * Math.PI) / 180);
    const projected = project([ring], cos);
    const pb = ringBox(projected);
    const unit = Math.max(pb.maxX - pb.minX, pb.maxY - pb.minY) / LONGEST;
    out.morocco = normalise(projected.map((r) => simplify(r, 0.16 * unit)));
  }

  /* Islands added to the master's own mainland drawing. */
  const withIslands = (
    id: string,
    neMainland: Ring,
    neIslands: Ring[],
    masterMainIndex = 0,
    tweak?: (master: Ring[], islands: Ring[]) => Ring[],
  ) => {
    const rings = masterRings(id);
    const all = [neMainland, ...neIslands];
    const box = ringBox(all);
    const cos = Math.cos((((box.minY + box.maxY) / 2) * Math.PI) / 180);
    const [main, ...islands] = project(all, cos);
    const mainRing = rings[masterMainIndex] ?? largest(rings);
    let placed = placeAgainst(mainRing, main!, islands);
    // Simplify in master units, where the shared stroke is 1.5.
    placed = placed.map((ring) => simplify(ring, 0.08));
    if (tweak) placed = tweak(rings, placed);
    out[id] = normalise([...rings, ...placed]);
  };

  {
    const zanzibar = su('TZZ')
      .sort((a, b) => b.length - a.length)
      .slice(0, 2); // Unguja, Pemba
    const tza = su('TZA');
    withIslands('tanzania', largest(tza), zanzibar, 0);
  }
  {
    const master = masterRings('equatorial-guinea');
    const rioMuni = largest(master);
    withIslands(
      'equatorial-guinea',
      su('GNR')[0]!,
      su('GNA'),
      master.indexOf(rioMuni),
      (rings, islands) => islands.map((island) => inset(rings, island)),
    );
  }
  {
    const mus = su('MUS');
    const main = largest(mus);
    const rodrigues = mus.filter((r) => ringBox([r]).minX > 63)[0]!;
    withIslands('mauritius', main, [rodrigues], 0, (rings, islands) =>
      islands.map((island) => inset(rings, island)),
    );
  }
  await mkdir(PATHS.mapsOverrides, { recursive: true });
  for (const [id, svg] of Object.entries(out)) {
    const file = path.join(PATHS.mapsOverrides, `${id}.svg`);
    await writeFile(file, svg, 'utf8');
    process.stdout.write(`wrote ${relative(file)}\n`);
  }
  return 0;
}

process.exitCode = await main();
