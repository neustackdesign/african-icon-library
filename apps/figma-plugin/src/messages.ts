/** Messages exchanged between the plugin's UI iframe and its sandbox thread. */

export interface InsertRequest {
  type: 'insert';
  id: string;
  weight: string;
  /** Rendered size in Figma units. */
  size: number;
}

export interface ReadyRequest {
  type: 'ready';
}

export interface ResizeRequest {
  type: 'resize';
  height: number;
}

export type UiMessage = InsertRequest | ReadyRequest | ResizeRequest;

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
  return type === 'insert' || type === 'ready' || type === 'resize';
}
