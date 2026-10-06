'use client';

import { useEffect, useRef, useState } from 'react';

import { track, type AnalyticsEvent } from '@/lib/analytics';
import { copyLabel } from '@/lib/browser';

/**
 * Copies an SVG document, with a visible label change and a `role="status"`
 * announcement for success and for a refused clipboard.
 */
export function CopySvgButton({
  svg,
  target,
  event,
  surface,
}: {
  svg: string;
  target: string;
  event: AnalyticsEvent;
  surface: string;
}) {
  const [state, setState] = useState<'idle' | 'copied' | 'failed'>('idle');
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const settle = (next: 'copied' | 'failed') => {
    setState(next);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setState('idle'), next === 'copied' ? 2000 : 3000);
  };

  return (
    <>
      <button
        type="button"
        className="btn btn--primary"
        data-state={state === 'copied' ? 'copied' : undefined}
        onClick={() => {
          if (!navigator.clipboard) return settle('failed');
          navigator.clipboard.writeText(svg).then(
            () => {
              track(event, { target, surface });
              settle('copied');
            },
            () => settle('failed'),
          );
        }}
      >
        {copyLabel(state)}
      </button>
      <span className="visually-hidden" role="status" aria-live="polite">
        {state === 'copied'
          ? `Copied ${target}.svg`
          : state === 'failed'
            ? 'Clipboard blocked — use Download'
            : ''}
      </span>
    </>
  );
}
