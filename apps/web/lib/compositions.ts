/**
 * Composition data shared by the website and the release-asset generator.
 *
 * Pure data and geometry only — no React, no imports — so `scripts/` can load
 * it directly and every surface draws the same route, the same spec rows and
 * the same facts.
 */

/**
 * "An ordinary day": five released icons on a dashed orthogonal route, in the
 * approved 1120 × 340 composition. Illustrative, never data.
 */
export const ROUTE = [
  { id: 'akara', tag: '07:30 · Breakfast', x: 0, y: 166 },
  { id: 'danfo', tag: '08:10 · Commute', x: 252, y: 26 },
  { id: 'market-umbrella', tag: '09:00 · Market', x: 504, y: 166 },
  { id: 'pos-terminal', tag: '13:00 · Payment', x: 756, y: 26 },
  { id: 'pepper-soup', tag: '19:00 · Dinner', x: 1008, y: 166 },
] as const;

export const ROUTE_FRAME = {
  width: 1120,
  height: 340,
  /** Side of each stop's colour square. */
  stop: 112,
  /** Height of a stop's tag plus its gap above the square. */
  tag: 46,
} as const;

/** Orthogonal polyline through each stop's square centre, in composition units. */
export function routePoints(
  stops: ReadonlyArray<{ x: number; y: number }> = ROUTE,
  frame: { stop: number; tag: number } = ROUTE_FRAME,
): string {
  const centre = (stop: { x: number; y: number }) => ({
    x: stop.x + frame.stop / 2,
    y: stop.y + frame.tag + frame.stop / 2,
  });
  const points: string[] = [];
  stops.forEach((stop, index) => {
    const here = centre(stop);
    const previous = stops[index - 1];
    if (previous) {
      const before = centre(previous);
      const mid = (before.x + here.x) / 2;
      points.push(`${mid},${before.y}`, `${mid},${here.y}`);
    }
    points.push(`${here.x},${here.y}`);
  });
  return points.join(' ');
}

/** The released drawing rules, as enforced by `npm run validate` (docs/icon-spec.md). */
export const SPEC_ROWS = [
  ['canvas', '24 × 24 · live area 2–22'],
  ['stroke', '1.5 · round caps and joins'],
  ['paint', 'currentColor · fill none'],
  ['geometry', 'live strokes · no transforms · no type'],
  ['source', 'validated SVG + typed metadata'],
] as const;

/** UI sizes the system is drawn for. */
export const UI_SIZES = [16, 20, 24, 32, 48] as const;

/** The approved principal headline. */
export const HEADLINE = 'Icons for the things African products actually need.';

/** The four release facts, from counts the caller derives from canonical data. */
export function releaseFacts(iconCount: number, categoryCount: number) {
  return [
    { label: 'Icons in V2', value: String(iconCount) },
    { label: 'Categories', value: String(categoryCount) },
    { label: 'Base grid', value: '24px' },
    { label: 'Licence', value: 'MIT' },
  ];
}
