/** Messages exchanged between the builder's UI iframe and its sandbox thread. */

export interface ReadyRequest {
  type: 'ready';
}

export interface BuildRequest {
  type: 'build';
  /**
   * `fresh` refuses to run when a previous build is already in the document.
   * `rebuild` wipes that build first. The UI only offers `rebuild` after the
   * sandbox has told it a previous build exists.
   */
  mode: 'fresh' | 'rebuild';
}

export interface ResizeRequest {
  type: 'resize';
  height: number;
}

export type UiMessage = ReadyRequest | BuildRequest | ResizeRequest;

export interface StatusMessage {
  type: 'status';
  level: 'info' | 'error';
  text: string;
}

export interface ProgressMessage {
  type: 'progress';
  done: number;
  total: number;
  label: string;
}

/** What the sandbox found in the document, sent on handshake and after a build. */
export interface StateMessage {
  type: 'state';
  existingBuild: { builtAt: string; version: string; pages: number } | null;
  icons: number;
  weights: string[];
}

export interface SummaryMessage {
  type: 'summary';
  pages: number;
  components: number;
  instances: number;
  /** Anything the operator should check by eye before publishing. */
  notes: string[];
}

export type PluginMessage = StatusMessage | ProgressMessage | StateMessage | SummaryMessage;

export function isUiMessage(value: unknown): value is UiMessage {
  if (typeof value !== 'object' || value === null) return false;
  const type = (value as { type?: unknown }).type;
  return type === 'ready' || type === 'build' || type === 'resize';
}
