/**
 * Canonical SVG assets for the African Icon Library.
 *
 * Assets ship as inner markup plus one shared root template, so every icon is
 * guaranteed to use the same viewBox, the same caps and joins, and
 * `stroke="currentColor"` — a consumer restyles an icon with `color`, never by
 * editing the asset.
 */

import type { Weight } from '@african-icon-library/metadata';

import { iconBodies, iconIds } from './generated/icons.js';

export { iconBodies, iconIds };

export const CANVAS_SIZE = 24;
export const DEFAULT_WEIGHT: Weight = 'regular';
export const DEFAULT_STROKE_WIDTH = 1.5;

export interface RenderOptions {
  /** Drawn weight to render. Falls back to `regular` when the weight is not drawn. */
  weight?: Weight;
  /** Rendered pixel size for both axes. */
  size?: number | string;
  /**
   * Overrides the stroke width.
   *
   * This changes optical weight only — it does not turn one weight into
   * another. Real weights are separately drawn assets.
   */
  strokeWidth?: number | string;
  /**
   * Accessible name. When provided the SVG is exposed as an image with this
   * label; when omitted it is hidden from assistive technology, which is the
   * right default for an icon that sits beside its own text label.
   */
  title?: string;
  /** Stable id used to wire `aria-labelledby` to the generated `<title>`. */
  titleId?: string;
}

/** Returns the inner markup for an icon at a weight, or `undefined` if it is not drawn. */
export function getIconBody(id: string, weight: Weight = DEFAULT_WEIGHT): string | undefined {
  const bodies = iconBodies[id];
  if (!bodies) return undefined;
  return bodies[weight] ?? bodies[DEFAULT_WEIGHT];
}

/** Weights actually drawn for an icon. Empty when the id is unknown. */
export function getIconWeights(id: string): Weight[] {
  const bodies = iconBodies[id];
  if (!bodies) return [];
  return (Object.keys(bodies) as Weight[]).sort();
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Renders a complete, standalone `<svg>` document for an icon. */
export function renderIconSvg(id: string, options: RenderOptions = {}): string | undefined {
  const body = getIconBody(id, options.weight);
  if (body === undefined) return undefined;

  const {
    size = CANVAS_SIZE,
    strokeWidth = DEFAULT_STROKE_WIDTH,
    title,
    titleId = `${id}-title`,
  } = options;

  const accessibility = title
    ? ` role="img" aria-labelledby="${escapeXml(titleId)}"`
    : ' aria-hidden="true" focusable="false"';

  const titleElement = title ? `<title id="${escapeXml(titleId)}">${escapeXml(title)}</title>` : '';

  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${escapeXml(String(size))}" ` +
    `height="${escapeXml(String(size))}" viewBox="0 0 ${CANVAS_SIZE} ${CANVAS_SIZE}" fill="none" ` +
    `stroke="currentColor" stroke-width="${escapeXml(String(strokeWidth))}" stroke-linecap="round" ` +
    `stroke-linejoin="round"${accessibility}>${titleElement}${body}</svg>`
  );
}
