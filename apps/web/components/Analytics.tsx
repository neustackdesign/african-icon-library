'use client';

import { useEffect } from 'react';
import { campaignProperties } from '@/lib/analytics';

/** Record allowlisted UTM context on the initial landing page before the
 * visitor navigates to an icon/map. GA4 Enhanced Measurement owns SPA
 * history pageviews; no manual page_view should be emitted here. */
export function Analytics() {
  useEffect(() => { campaignProperties(); }, []);
  return null;
}
