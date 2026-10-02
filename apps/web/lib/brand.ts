/**
 * African Icon Library design-system tokens (Design System v3).
 *
 * One source for every renderer that cannot read CSS custom properties: the
 * Open Graph card and the release-asset generator in `scripts/`. The website
 * itself reads the same values from `app/globals.css`, and a test asserts the
 * two stay identical.
 *
 * This module imports nothing, so the Node scripts can load it directly.
 */

/** Dark is the primary ground. */
export const DARK = {
  canvas: '#12110d',
  sunken: '#0c0b08',
  surface: '#1a1915',
  raised: '#23211b',
  line: '#2a2822',
  lineStrong: '#3a372f',
  text: '#f2f0e9',
  text2: '#a9a395',
  text3: '#7f796c',
  /** Small meta text: --text-3 lifted to clear WCAG AA (5.2:1 on canvas). */
  textMeta: '#8c8679',
  accent: '#79c79a',
  accentHover: '#a3ddbb',
} as const;

/** Ivory is used for whole sections and for cards on colour stages. */
export const LIGHT = {
  canvas: '#efede6',
  card: '#f8f7f2',
  hover: '#e6e3da',
  line: '#d6d2c5',
  ink: '#12110d',
  ink2: '#55514a',
  accentInk: '#2e7d4f',
} as const;

/** The green ground of the System section. */
export const SYSTEM_GROUND = 'oklch(0.38 0.075 155)';

export const FONT_STACK = {
  sans: "Geist, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
  mono: "'Geist Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
} as const;

/**
 * The seven released categories, in the order every V3 surface presents them.
 *
 * Ids are canonical metadata category ids. Colour means category: seven
 * equal-lightness hues used only as fields (bars, blocks, stages, selected
 * tiles), always with an ink icon on top. `hero` is the representative drawing
 * for the category index and the footer band.
 */
export const CATEGORY_SYSTEM = [
  { id: 'food-drink', colour: 'oklch(0.76 0.13 50)', hero: 'jollof-rice' },
  { id: 'transport', colour: 'oklch(0.84 0.13 95)', hero: 'danfo' },
  { id: 'commerce-industry', colour: 'oklch(0.76 0.11 195)', hero: 'naira-note' },
  { id: 'culture-people', colour: 'oklch(0.76 0.11 15)', hero: 'calabash' },
  { id: 'music-art-play', colour: 'oklch(0.72 0.12 300)', hero: 'talking-drum' },
  { id: 'fashion-textiles', colour: 'oklch(0.70 0.12 255)', hero: 'aso-oke-fabric' },
  { id: 'identity-state', colour: 'oklch(0.76 0.12 150)', hero: 'passport' },
] as const;

export type CategorySystemEntry = (typeof CATEGORY_SYSTEM)[number];

const BY_ID = new Map<string, CategorySystemEntry>(
  CATEGORY_SYSTEM.map((entry) => [entry.id, entry]),
);

/** Neutral field for anything outside the seven released categories. */
const FALLBACK_COLOUR = DARK.line;

export function categoryColour(categoryId: string): string {
  return BY_ID.get(categoryId)?.colour ?? FALLBACK_COLOUR;
}

/** Position of a category in the V3 order; unknown categories sort last. */
export function categoryRank(categoryId: string): number {
  const index = CATEGORY_SYSTEM.findIndex((entry) => entry.id === categoryId);
  return index === -1 ? CATEGORY_SYSTEM.length : index;
}

/**
 * Converts a CSS `oklch(L C H)` string to `#rrggbb`.
 *
 * Renderers such as Satori, Figma and most SVG tools do not parse oklch, so
 * every non-browser surface uses the hex equivalent of the same token. Values
 * outside sRGB are clipped per channel; the seven category hues are inside.
 */
export function oklchToHex(value: string): string {
  const match = /^oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*\)$/.exec(value.trim());
  if (!match) return value;
  const [lightness, chroma, hue] = match.slice(1).map(Number) as [number, number, number];
  const radians = (hue * Math.PI) / 180;
  const a = chroma * Math.cos(radians);
  const b = chroma * Math.sin(radians);

  const l = (lightness + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (lightness - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (lightness - 0.0894841775 * a - 1.291485548 * b) ** 3;

  const linear = [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];

  return (
    '#' +
    linear
      .map((channel) => {
        const clipped = Math.min(1, Math.max(0, channel));
        const encoded =
          clipped <= 0.0031308 ? 12.92 * clipped : 1.055 * clipped ** (1 / 2.4) - 0.055;
        return Math.round(encoded * 255)
          .toString(16)
          .padStart(2, '0');
      })
      .join('')
  );
}

/** Ribbon bar heights, in percent of the band: rising left to right with a fixed jitter. */
export function ribbonHeight(index: number, total: number): number {
  const jitter = [0, 5, -3, 3, -2][index % 5] ?? 0;
  const step = total > 1 ? 64 / (total - 1) : 0;
  return Math.min(78, Math.round(24 + index * step + jitter));
}
