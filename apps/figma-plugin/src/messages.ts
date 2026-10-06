/** Messages exchanged between the plugin's UI iframe and its sandbox thread. */

export interface InsertRequest {
  type: 'insert';
  id: string;
  weight: string;
  /** Rendered size in Figma units. */
  size: number;
}

/** A country map. `size` is the longest side; the other follows the map's proportions. */
export interface InsertMapRequest {
  type: 'insert-map';
  id: string;
  size: number;
}

export interface ReadyRequest {
  type: 'ready';
}

export interface ResizeRequest {
  type: 'resize';
  height: number;
}

export type UiMessage = InsertRequest | InsertMapRequest | ReadyRequest | ResizeRequest;

export interface StatusMessage {
  type: 'status';
  level: 'info' | 'error';
  text: string;
}

export interface ContextMessage {
  type: 'context';
  /** Where the next insert will land, phrased for a human. */
  destination: string;
  /** True when the document is in a state the plugin cannot insert into. */
  blocked: boolean;
}

export type PluginMessage = StatusMessage | ContextMessage;

export function isUiMessage(value: unknown): value is UiMessage {
  if (typeof value !== 'object' || value === null) return false;
  const type = (value as { type?: unknown }).type;
  return type === 'insert' || type === 'insert-map' || type === 'ready' || type === 'resize';
}

/** Map insertion sizes: the box the map's longest side is fitted into. */
export const MAP_SIZES = [64, 128, 256, 512] as const;
export const DEFAULT_MAP_SIZE = 128;

/**
 * Fits a `width × height` drawing into a square box of `size`, keeping its
 * aspect ratio: the longest side becomes `size`, never both.
 */
export function fitToBox(
  width: number,
  height: number,
  size: number,
): { width: number; height: number } {
  const scale = size / Math.max(width, height);
  const round = (value: number) => Math.round(value * 100) / 100;
  return { width: round(width * scale), height: round(height * scale) };
}
