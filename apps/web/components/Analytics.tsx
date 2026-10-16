'use client';

/** GA4 Enhanced Measurement owns SPA history-based page views. Do not emit
 * manual page_view events on top of gtag('config') — that can double-count. */
export function Analytics() {
  return null;
}
