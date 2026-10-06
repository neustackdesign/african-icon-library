/**
 * Canonical SVG country maps for the African Icon Library.
 *
 * Maps are a separate asset type from icons. Each one keeps its real aspect
 * ratio — its own viewBox, never forced into a square — and is drawn in the
 * library's line language: a live 1.5 stroke, round caps and joins, painted
 * with `currentColor`.
 */

import { MAP_BOUNDARY_POLICY, mapBodies, mapIds, mapViewBoxes } from './generated/maps.js';

export { MAP_BOUNDARY_POLICY, mapBodies, mapIds, mapViewBoxes };

export const MAP_STROKE_WIDTH = 1.5;

export interface MapViewBox {
  width: number;
  height: number;
}

export interface MapRenderOptions {
  /**
   * Rendered size of the longest side. The other side follows the map's own
   * aspect ratio, so a map is never stretched to fill a square.
   * Omit to keep the map's native size.
   */
  size?: number;
  /** Overrides the stroke width (optical weight only). */
  strokeWidth?: number | string;
  /**
   * Accessible name. When provided the SVG is exposed as an image with this
   * label; when omitted it is hidden from assistive technology.
   */
  title?: string;
  /** Stable id used to wire `aria-labelledby` to the generated `<title>`. */
  titleId?: string;
}

/** Inner markup for a map, or `undefined` when the id is unknown. */
export function getMapBody(id: string): string | undefined {
  return mapBodies[id];
}

/** The map's native viewBox size, or `undefined` when the id is unknown. */
export function getMapViewBox(id: string): MapViewBox | undefined {
  const box = mapViewBoxes[id];
  return box ? { width: box[0], height: box[1] } : undefined;
}

/**
 * Fits a map's longest side to `size`, keeping its aspect ratio.
 * `fitMapSize('gambia', 128)` → `{ width: 128, height: 39.43 }`.
 */
export function fitMapSize(id: string, size: number): MapViewBox | undefined {
  const box = getMapViewBox(id);
  if (!box) return undefined;
  const scale = size / Math.max(box.width, box.height);
  const round = (value: number) => Math.round(value * 100) / 100;
  return { width: round(box.width * scale), height: round(box.height * scale) };
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Renders a complete, standalone `<svg>` document for a map. */
export function renderMapSvg(id: string, options: MapRenderOptions = {}): string | undefined {
  const body = getMapBody(id);
  const box = getMapViewBox(id);
  if (body === undefined || !box) return undefined;

  const { strokeWidth = MAP_STROKE_WIDTH, title, titleId = `${id}-map-title` } = options;
  const fitted = options.size === undefined ? box : fitMapSize(id, options.size)!;

  const accessibility = title
    ? ` role="img" aria-labelledby="${escapeXml(titleId)}"`
    : ' aria-hidden="true" focusable="false"';
  const titleElement = title ? `<title id="${escapeXml(titleId)}">${escapeXml(title)}</title>` : '';

  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${fitted.width}" height="${fitted.height}" ` +
    `viewBox="0 0 ${box.width} ${box.height}" fill="none" stroke="currentColor" ` +
    `stroke-width="${escapeXml(String(strokeWidth))}" stroke-linecap="round" ` +
    `stroke-linejoin="round"${accessibility}>${titleElement}${body}</svg>`
  );
}
