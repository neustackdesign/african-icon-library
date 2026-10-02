import { ImageResponse } from 'next/og';

import { getIconBody } from '@african-icon-library/icons';

import { DARK, categoryColour, oklchToHex, ribbonHeight } from './brand';
import { HEADLINE } from './compositions';
import { browserEntries } from './icons';
import { LIBRARY, SITE } from './site';

export const OG_SIZE = { width: 1200, height: 630 } as const;
export const OG_CONTENT_TYPE = 'image/png';
export const OG_ALT = `${SITE.name} — ${LIBRARY.iconCount} open-source icons for African life`;

/**
 * The released-icon ribbon as one SVG document, embedded as a data URI.
 *
 * The image generator only understands a subset of SVG when written as JSX, so
 * the ribbon is handed over finished — which also means the card shows the
 * real released drawings in their category fields, not an illustration of them.
 */
function ribbonDataUri(width: number, height: number): string {
  const entries = browserEntries();
  const bar = width / entries.length;
  const icon = Math.min(24, bar * 0.6);

  const bars = entries
    .map(({ icon: meta }, index) => {
      const h = (ribbonHeight(index, entries.length) / 100) * height;
      const x = index * bar;
      const y = height - h;
      const body = getIconBody(meta.id) ?? '';
      const scale = icon / 24;
      return (
        `<rect x="${x}" y="${y}" width="${bar}" height="${h}" fill="${oklchToHex(categoryColour(meta.category))}"/>` +
        `<line x1="${x + bar}" y1="0" x2="${x + bar}" y2="${height}" stroke="${DARK.line}" stroke-width="1"/>` +
        `<g transform="translate(${x + (bar - icon) / 2} ${y + 12}) scale(${scale})" fill="none" ` +
        `stroke="${DARK.canvas}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${body}</g>`
      );
    })
    .join('');

  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" ` +
    `viewBox="0 0 ${width} ${height}">${bars}</svg>`;

  return `data:image/svg+xml;base64,${Buffer.from(svg, 'utf8').toString('base64')}`;
}

/** The social card: wordmark, approved headline and the ribbon. Facts only, no claims. */
export function renderOpenGraphImage(): ImageResponse {
  const ribbonHeightPx = 250;

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: DARK.canvas,
        color: DARK.text,
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', padding: '64px 72px 0', gap: 28 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 20,
            letterSpacing: 1.5,
            textTransform: 'uppercase',
            color: DARK.text2,
          }}
        >
          <span>{SITE.name}</span>
          <span>
            v{LIBRARY.version} · {LIBRARY.iconCount} icons · MIT
          </span>
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: 68,
            lineHeight: 1.0,
            letterSpacing: -3,
            maxWidth: 980,
          }}
        >
          {HEADLINE}
        </div>
      </div>
      {/*
        A plain <img> on purpose: this tree is rendered into a PNG by Satori,
        not by a browser, so there is nothing for next/image to optimise.
      */}
      <img
        src={ribbonDataUri(OG_SIZE.width, ribbonHeightPx)}
        width={OG_SIZE.width}
        height={ribbonHeightPx}
        alt=""
      />
    </div>,
    { ...OG_SIZE },
  );
}
