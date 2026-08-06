/**
 * The one place the Community file's visual constants live.
 *
 * The palette is fixed by docs/figma-community-file-spec.md — paper rather than
 * white, one accent used sparingly — so it is stated once here rather than
 * repeated at every call site where a drift would be invisible.
 */

/** Library paper. Deliberately not `#FFFFFF`: white reads as a default template. */
export const PAPER = '#FAF9F6';
export const INK = '#16150F';
export const ACCENT = '#2E7D4F';

/** Ink at reading weight for secondary copy, and the hairline used for rules. */
export const INK_MUTED = '#6E6A5E';
export const RULE = '#E3DFD4';
/** Background for a card sitting on paper. */
export const CARD = '#F2F0E9';
/** Used only to mark an unconfirmed local name, never as decoration. */
export const WARN = '#8A5A1B';

/**
 * Figma ships Inter, so it is the only family the builder asks for. Every style
 * used anywhere in the file is listed here because `figma.loadFontAsync` has to
 * be awaited for each one *before* any text node is created.
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
