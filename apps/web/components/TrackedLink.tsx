'use client';

import type { AnalyticsEvent } from '@/lib/analytics';
import { track } from '@/lib/analytics';

interface Props extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  event: AnalyticsEvent;
  target_?: string;
  surface?: string;
}

/**
 * An anchor that records one event when it is followed.
 *
 * A client component so that server-rendered pages can stay server-rendered:
 * only the links that need a handler ship JavaScript.
 */
export function TrackedLink({ event, target_, surface, children, onClick, ...props }: Props) {
  return (
    <a
      {...props}
      onClick={(nativeEvent) => {
        track(event, { target: target_, surface });
        onClick?.(nativeEvent);
      }}
    >
      {children}
    </a>
  );
}
