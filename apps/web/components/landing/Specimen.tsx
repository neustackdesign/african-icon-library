'use client';

import { useEffect, useRef, type CSSProperties } from 'react';

import { categoryColour } from '@/lib/brand';

import { IconGlyph } from '../IconGlyph';
import { useBrowser, useSpecimen } from './LibraryProvider';

/** Approved cycle: one released icon every 2.8 seconds. */
export const SPECIMEN_INTERVAL_MS = 2800;

interface Props {
  categoryLabels: Record<string, string>;
}

/**
 * The hero specimen: a live released icon on its 24-unit construction field.
 *
 * Cycles through the set, and pauses while hovered or focused, while the tab
 * is hidden, under reduced motion, and for good once a visitor drives it from
 * the ribbon.
 */
export function Specimen({ categoryLabels }: Props) {
  const { entries, copy, openInBrowser } = useBrowser();
  const { index, pinned, advance, reducedMotion } = useSpecimen();
  const paused = useRef(false);

  useEffect(() => {
    if (reducedMotion || pinned) return;
    const timer = window.setInterval(() => {
      if (paused.current || document.visibilityState !== 'visible') return;
      advance();
    }, SPECIMEN_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [reducedMotion, pinned, advance]);

  const entry = entries[index] ?? entries[0];
  if (!entry) return null;
  const { icon, body } = entry;

  const hold = () => {
    paused.current = true;
  };
  const release = () => {
    paused.current = false;
  };

  return (
    <figure
      className="specimen"
      aria-label="Specimen"
      onPointerEnter={hold}
      onPointerLeave={release}
      onFocus={hold}
      onBlur={release}
    >
      <div
        className="specimen__field field"
        style={{ '--cat': categoryColour(icon.category) } as CSSProperties}
      >
        <span className="grid-overlay" aria-hidden="true" />
        <span className="live-area" aria-hidden="true" />
        <IconGlyph
          key={icon.id}
          body={body}
          size="60%"
          className="specimen__glyph set-in"
          label={icon.name}
        />
      </div>
      <figcaption className="specimen__body">
        <span className="specimen__top">
          <span>Specimen</span>
          <span>
            {String(index + 1).padStart(2, '0')} / {entries.length}
          </span>
        </span>
        <span className="specimen__meta">
          <span className="specimen__id">{icon.id}</span>
          <span className="specimen__category">
            {categoryLabels[icon.category] ?? icon.category}
          </span>
          <span className="specimen__spec">24px · 1.5 stroke</span>
        </span>
        <span className="specimen__actions">
          <button
            type="button"
            className="specimen__btn specimen__btn--copy"
            onClick={() => copy(icon.id, 'hero')}
          >
            Copy SVG
          </button>
          <button
            type="button"
            className="specimen__btn"
            aria-label={`Open ${icon.name} in the browser`}
            onClick={() => openInBrowser(icon.id)}
          >
            →
          </button>
        </span>
      </figcaption>
    </figure>
  );
}
