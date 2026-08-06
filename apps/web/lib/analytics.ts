/**
 * Privacy-respecting analytics contract.
 *
 * The site must work identically with no analytics provider attached, so this
 * module is a thin, total function over an optional global. It sends no
 * personal data, sets no cookie, and reads no identifier — the events below
 * describe what the *library* was asked for, never who asked.
 *
 * To attach a provider, load a script that defines `window.ail` with a
 * `track(name, properties)` method. Plausible and Fathom both fit this shape
 * with a two-line adapter; neither is bundled here, because a library that
 * ships a tracker by default is not privacy-respecting.
 */

export const ANALYTICS_EVENTS = [
  'search',
  'icon_copy',
  'icon_download',
  'category_download',
  'release_download',
  'figma_click',
  'github_click',
] as const;

export type AnalyticsEvent = (typeof ANALYTICS_EVENTS)[number];

export interface AnalyticsProperties {
  /** Icon id, category id or artefact name, depending on the event. */
  target?: string;
  /** Result count for a search. Never the query itself. */
  results?: number;
  /** Where on the site the event fired. */
  surface?: string;
}

interface AnalyticsGlobal {
  track?: (name: string, properties?: Record<string, unknown>) => void;
}

declare global {
  interface Window {
    ail?: AnalyticsGlobal;
  }
}

/**
 * Campaign parameters, read once from the URL.
 *
 * Kept out of the event payload unless present, so an organic visit sends
 * nothing extra. Nothing is persisted — no cookie, no storage — so this is a
 * per-page-load attribution signal and deliberately not a durable identity.
 */
export function campaignProperties(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const params = new URLSearchParams(window.location.search);
  const campaign: Record<string, string> = {};
  for (const key of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content'] as const) {
    const value = params.get(key);
    if (value) campaign[key] = value.slice(0, 64);
  }
  return campaign;
}

/**
 * Records an event if a provider is attached.
 *
 * Never throws: an analytics failure must not break a copy button. Search
 * queries are deliberately not sent — the result count answers "is search
 * working" without recording what anyone typed.
 */
export function track(event: AnalyticsEvent, properties: AnalyticsProperties = {}): void {
  if (typeof window === 'undefined') return;
  try {
    window.ail?.track?.(event, { ...properties, ...campaignProperties() });
  } catch {
    /* analytics must never be load-bearing */
  }
}
