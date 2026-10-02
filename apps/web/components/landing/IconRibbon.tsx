'use client';

import type { CSSProperties } from 'react';

import { categoryColour, categoryRank, ribbonHeight } from '@/lib/brand';

import { IconGlyph } from '../IconGlyph';
import { useBrowser, useSpecimen } from './LibraryProvider';

/**
 * One bar per released icon, ordered by category and rising left to right.
 *
 * It navigates: hover or focus names the icon and drives the hero specimen;
 * a click opens it in the browser.
 */
export function IconRibbon() {
  const { entries, openInBrowser } = useBrowser();
  const { index: current, point } = useSpecimen();

  return (
    <div className="ribbon" role="group" aria-label={`The ${entries.length} released icons`}>
      <ul className="ribbon__track">
        {entries.map(({ icon, body }, index) => (
          <li className="ribbon__item" key={icon.id}>
            <button
              type="button"
              className="ribbon__bar"
              aria-label={`${icon.name} — open in browser`}
              data-current={index === current ? '' : undefined}
              onPointerEnter={() => point(index)}
              onFocus={() => point(index)}
              onClick={() => openInBrowser(icon.id)}
              style={
                {
                  '--cat': categoryColour(icon.category),
                  '--h': `${ribbonHeight(index, entries.length)}%`,
                  '--group': categoryRank(icon.category),
                } as CSSProperties
              }
            >
              <span className="ribbon__fill">
                <IconGlyph body={body} size={24} />
              </span>
              <span className="ribbon__name label-tag" aria-hidden="true">
                {icon.id}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
