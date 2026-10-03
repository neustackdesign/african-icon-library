/**
 * Visual constants for the generated Figma Community file.
 *
 * These mirror the public V3 site rather than inventing a Figma-only identity.
 * Dark is the launch/cover ground; ivory is the editorial/documentation ground;
 * category colour is used as information, never as generic decoration.
 */

/** Primary V3 grounds. */
export const DARK = '#12110D';
export const DARK_SUNKEN = '#0C0B08';
export const DARK_SURFACE = '#1A1915';
export const DARK_RAISED = '#23211B';
export const DARK_LINE = '#3A372F';
export const DARK_TEXT = '#F2F0E9';
export const DARK_MUTED = '#A9A395';
export const ACCENT_LIGHT = '#79C79A';

/** Editorial/light surfaces. */
export const PAPER = '#EFEDE6';
export const INK = '#12110D';
export const ACCENT = '#2E7D4F';
export const INK_MUTED = '#55514A';
export const RULE = '#D6D2C5';
export const CARD = '#F8F7F2';
/** Used only to mark an unconfirmed local name, never as decoration. */
export const WARN = '#8A5A1B';

/** Hex counterparts of the website's seven equal-lightness category fields. */
export const CATEGORY_COLOURS = {
  'food-drink': '#F39762',
  transport: '#E5C95E',
  'commerce-industry': '#47C7C7',
  'culture-people': '#EE939B',
  'music-art-play': '#B093E5',
  'fashion-textiles': '#69A1E8',
  'identity-state': '#76C788',
} as const;

export function categoryColour(id: string): string {
  return CATEGORY_COLOURS[id as keyof typeof CATEGORY_COLOURS] ?? RULE;
}

/**
 * Inter ships with Figma and therefore remains the builder font. The web uses
 * Geist, but requiring a local Geist installation would make a Community build
 * fragile. The visual hierarchy, spacing and mono-like metadata treatment carry
 * the V3 system without turning font availability into a release blocker.
 */
export const FONT_FAMILY = 'Inter';

export const REGULAR: FontName = { family: FONT_FAMILY, style: 'Regular' };
export const MEDIUM: FontName = { family: FONT_FAMILY, style: 'Medium' };
export const SEMIBOLD: FontName = { family: FONT_FAMILY, style: 'Semi Bold' };

export const FONTS: readonly FontName[] = [REGULAR, MEDIUM, SEMIBOLD];

/* ------------------------------------------------------------------ *
 * Geometry
 * ------------------------------------------------------------------ */

/** Community thumbnails and carousel slides are all 2:1 at this size. */
export const SLIDE_WIDTH = 1920;
export const SLIDE_HEIGHT = 960;
/** Community crops the card at several ratios, so nothing sits nearer an edge. */
export const SLIDE_SAFE_AREA = 120;

/** Every icon in the library is drawn on a 24-unit canvas. */
export const ICON_SIZE = 24;

/** Working width of a documentation page's text column. */
export const PAGE_WIDTH = 1440;
export const PAGE_PADDING = 80;
export const CONTENT_WIDTH = PAGE_WIDTH - PAGE_PADDING * 2;

/* ------------------------------------------------------------------ *
 * Colour helpers
 * ------------------------------------------------------------------ */

/** `#RRGGBB` (or `#RGB`) to Figma's 0–1 channels. Unparseable input becomes black. */
export function rgb(hex: string): RGB {
  const value = hex.replace('#', '');
  const full =
    value.length === 3
      ? value
          .split('')
          .map((channel) => channel + channel)
          .join('')
      : value;
  const parsed = Number.parseInt(full, 16);
  if (full.length !== 6 || Number.isNaN(parsed)) return { r: 0, g: 0, b: 0 };
  return {
    r: ((parsed >> 16) & 255) / 255,
    g: ((parsed >> 8) & 255) / 255,
    b: (parsed & 255) / 255,
  };
}

export function solid(hex: string, opacity = 1): SolidPaint {
  return { type: 'SOLID', color: rgb(hex), opacity };
}
