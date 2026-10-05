/**
 * Extracts the 54 country outlines from the country-map master.
 *
 * The master (`packages/maps/source/african-country-maps-4x-master.svg`) is a
 * presentation sheet: a title, five region headings, outlined id labels, card
 * backgrounds and one stroked outline per country. Only the outlines are
 * assets. Everything else is used to *locate* them, and to prove the sheet is
 * still the shape this script was written for — any change in count, schema
 * or order is an error, never a guess.
 *
 * The outlines are never redrawn, traced or rescaled. Each one is translated
 * into its own coordinate space (no `transform`), given a tight viewBox padded
 * by half the stroke so round caps and joins are not clipped, and repainted
 * with `currentColor`. Coordinates keep the master's own precision.
 */

/** The drawing treatment every country outline in the master must carry. */
export const MAP_STROKE_WIDTH = 1.5;
const OUTLINE_ATTRIBUTES = {
  stroke: 'black',
  'stroke-width': '1.5',
  'stroke-linecap': 'round',
  'stroke-linejoin': 'round',
} as const;

/** Countries per region band, top to bottom, exactly as the master lays them out. */
export const EXPECTED_REGION_COUNTS = [
  ['north-africa', 7],
  ['west-africa', 15],
  ['central-africa', 8],
  ['east-africa', 16],
  ['southern-africa', 8],
] as const;

export const EXPECTED_MAP_COUNT = EXPECTED_REGION_COUNTS.reduce((sum, [, n]) => sum + n, 0);

export interface ExpectedMap {
  id: string;
  region: string;
}

export interface ExtractedMap {
  id: string;
  region: string;
  /** Path data in the map's own coordinates. */
  d: string;
  width: number;
  height: number;
  /** Closed sub-paths: the mainland plus any islands. */
  subpaths: number;
  /** The standalone SVG document written to `packages/maps/svg/<id>.svg`. */
  svg: string;
}

export class MapIngestError extends Error {}

function fail(message: string): never {
  throw new MapIngestError(`map ingest: ${message}`);
}

function attributes(tag: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [, name, value] of tag.matchAll(/([\w:-]+)="([^"]*)"/g)) out[name!] = value!;
  return out;
}

/** 3-decimal fixed point with trailing zeros dropped, so output is byte-stable. */
function num(value: number): string {
  const rounded = Math.round(value * 1000) / 1000;
  return (Object.is(rounded, -0) ? 0 : rounded).toString();
}

interface Segment {
  command: 'M' | 'L' | 'Z';
  x: number;
  y: number;
}

/**
 * Parses absolute `M L H V Z` path data — the only commands the master uses —
 * into explicit points. Anything else fails loudly rather than being
 * approximated.
 */
export function parseOutline(d: string): Segment[] {
  const tokens = d.match(/[A-Za-z]|-?\d*\.?\d+(?:e-?\d+)?/g) ?? [];
  const segments: Segment[] = [];
  let x = 0;
  let y = 0;
  let start = { x: 0, y: 0 };
  let index = 0;
  let command = '';
  const next = (): number => {
    const value = Number(tokens[index++]);
    if (!Number.isFinite(value)) fail(`malformed number in path data near token ${index}`);
    return value;
  };
  while (index < tokens.length) {
    const token = tokens[index]!;
    if (/[A-Za-z]/.test(token)) {
      command = token;
      index += 1;
      if (!'MLHVZ'.includes(command)) {
        fail(`outline uses "${command}"; only absolute M, L, H, V and Z are expected`);
      }
      if (command === 'Z') {
        segments.push({ command: 'Z', x: start.x, y: start.y });
        x = start.x;
        y = start.y;
        continue;
      }
    }
    switch (command) {
      case 'M':
        x = next();
        y = next();
        start = { x, y };
        segments.push({ command: 'M', x, y });
        command = 'L'; // implicit lineto after a moveto pair
        break;
      case 'L':
        x = next();
        y = next();
        segments.push({ command: 'L', x, y });
        break;
      case 'H':
        x = next();
        segments.push({ command: 'L', x, y });
        break;
      case 'V':
        y = next();
        segments.push({ command: 'L', x, y });
        break;
      default:
        fail(`path data starts without a command`);
    }
  }
  return segments;
}

function bounds(segments: readonly Segment[]) {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const { x, y } of segments) {
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
  }
  return { minX, minY, maxX, maxY };
}

/** Re-emits the outline with absolute `M L Z` only, translated by (dx, dy). */
function serialise(segments: readonly Segment[], dx: number, dy: number): string {
  return segments
    .map((segment) =>
      segment.command === 'Z'
        ? 'Z'
        : `${segment.command}${num(segment.x + dx)} ${num(segment.y + dy)}`,
    )
    .join('');
}

export function renderStandaloneMap(d: string, width: number, height: number): string {
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${num(width)} ${num(height)}" ` +
    `fill="none" stroke="currentColor" stroke-width="${MAP_STROKE_WIDTH}" ` +
    `stroke-linecap="round" stroke-linejoin="round">\n  <path d="${d}"/>\n</svg>\n`
  );
}

/**
 * Locates, validates and normalises every outline in the master.
 *
 * `expected` is the metadata in master order (region band, then reading
 * order); the n-th card found must belong to the n-th expected map's region.
 */
export function extractMaps(source: string, expected: readonly ExpectedMap[]): ExtractedMap[] {
  if (expected.length !== EXPECTED_MAP_COUNT) {
    fail(`metadata lists ${expected.length} maps; the master holds ${EXPECTED_MAP_COUNT}`);
  }
  if (/<text\b/.test(source)) fail('the master contains live <text>; expected outlined labels');
  if (/\b(transform|matrix)\s*[=(]/.test(source.replace(/<clipPath[\s\S]*?<\/clipPath>/g, ''))) {
    fail('the master applies a transform outside its clip paths; outlines would not be absolute');
  }

  /* outlines */
  const outlineTags = [...source.matchAll(/<path\b[^>]*\bstroke-width="[^"]*"[^>]*\/?>/g)].map(
    (match) => match[0],
  );
  const outlines = outlineTags.map((tag) => {
    const attrs = attributes(tag);
    for (const [name, value] of Object.entries(OUTLINE_ATTRIBUTES)) {
      if (attrs[name] !== value)
        fail(`an outline has ${name}="${attrs[name]}", expected "${value}"`);
    }
    const extra = Object.keys(attrs).filter(
      (name) => name !== 'd' && !(name in OUTLINE_ATTRIBUTES),
    );
    if (extra.length > 0) fail(`an outline carries unexpected attributes: ${extra.join(', ')}`);
    const segments = parseOutline(attrs.d ?? '');
    const moves = segments.filter((segment) => segment.command === 'M').length;
    const closes = segments.filter((segment) => segment.command === 'Z').length;
    if (moves === 0 || moves !== closes) {
      fail(
        `an outline has ${moves} sub-path(s) but ${closes} close(s); every sub-path must be closed`,
      );
    }
    return { segments, box: bounds(segments), subpaths: moves };
  });
  if (outlines.length !== EXPECTED_MAP_COUNT) {
    fail(`found ${outlines.length} stroked outlines; expected exactly ${EXPECTED_MAP_COUNT}`);
  }

  /* cards: one white card per country */
  const cards = [
    ...source.matchAll(
      /<rect x="([\d.]+)" y="([\d.]+)" width="([\d.]+)" height="([\d.]+)" rx="[\d.]+" fill="white"\s*\/>/g,
    ),
  ].map((match) => {
    const [x, y, w, h] = match.slice(1, 5).map(Number) as [number, number, number, number];
    return { x, y, w, h };
  });
  if (cards.length !== EXPECTED_MAP_COUNT) {
    fail(`found ${cards.length} country cards; expected ${EXPECTED_MAP_COUNT}`);
  }

  /* region bands: the full-width rules between region headings */
  const rules = [...source.matchAll(/<line x1="[\d.]+" y1="([\d.]+)" x2="[\d.]+" y2="\1"/g)]
    .map((match) => Number(match[1]))
    .sort((a, b) => a - b);
  if (rules.length !== EXPECTED_REGION_COUNTS.length) {
    fail(`found ${rules.length} region rules; expected ${EXPECTED_REGION_COUNTS.length}`);
  }
  const bandOf = (y: number): number => {
    let band = -1;
    for (const [index, ruleY] of rules.entries()) if (y > ruleY) band = index;
    return band;
  };

  const ordered = cards
    .map((card) => ({ ...card, band: bandOf(card.y) }))
    .sort((a, b) => a.band - b.band || a.y - b.y || a.x - b.x);

  for (const [band, [region, count]] of EXPECTED_REGION_COUNTS.entries()) {
    const found = ordered.filter((card) => card.band === band).length;
    if (found !== count) fail(`${region} has ${found} cards; expected ${count}`);
  }

  /* each card holds exactly one outline */
  const used = new Set<number>();
  return ordered.map((card, index) => {
    const meta = expected[index]!;
    const [region] = EXPECTED_REGION_COUNTS[card.band]!;
    if (meta.region !== region) {
      fail(
        `card ${index + 1} sits in ${region}, but metadata entry ${index + 1} (${meta.id}) is ${meta.region}`,
      );
    }
    const inside = outlines
      .map((outline, outlineIndex) => ({ outline, outlineIndex }))
      .filter(
        ({ outline: { box } }) =>
          box.minX >= card.x &&
          box.maxX <= card.x + card.w &&
          box.minY >= card.y &&
          box.maxY <= card.y + card.h,
      );
    if (inside.length !== 1)
      fail(`card ${index + 1} (${meta.id}) holds ${inside.length} outlines; expected 1`);
    const { outline, outlineIndex } = inside[0]!;
    if (used.has(outlineIndex)) fail(`outline ${outlineIndex} matched two cards`);
    used.add(outlineIndex);

    const pad = MAP_STROKE_WIDTH / 2;
    const { minX, minY, maxX, maxY } = outline.box;
    const width = maxX - minX + MAP_STROKE_WIDTH;
    const height = maxY - minY + MAP_STROKE_WIDTH;
    const d = serialise(outline.segments, pad - minX, pad - minY);
    return {
      id: meta.id,
      region: meta.region,
      d,
      width: Number(num(width)),
      height: Number(num(height)),
      subpaths: outline.subpaths,
      svg: renderStandaloneMap(d, width, height),
    };
  });
}
