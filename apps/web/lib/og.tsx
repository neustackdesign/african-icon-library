import { ImageResponse } from 'next/og';

import { getIconBody } from '@african-icon-library/icons';
import { icons } from '@african-icon-library/metadata';

import { LIBRARY, SITE } from './site';

export const OG_SIZE = { width: 1200, height: 630 } as const;
export const OG_CONTENT_TYPE = 'image/png';
export const OG_ALT = `${SITE.name} — ${LIBRARY.iconCount} open-source icons for African life`;

const PAPER = '#FAF9F6';
const INK = '#16150F';
const ACCENT = '#2E7D4F';
const MUTED = '#56524A';

/**
 * Builds the icon strip as one SVG, embedded as a data URI.
 *
 * The image generator only understands a subset of SVG when written as JSX, so
 * the strip is handed over as a finished document instead — which also means the
 * card shows the real released drawings, not an illustration of them.
 */
function iconStripDataUri(count: number): string {
  const chosen = icons.slice(0, count);
  const cell = 96;
  const width = chosen.length * cell;

  const glyphs = chosen
    .map((icon, index) => {
      const body = getIconBody(icon.id) ?? '';
      return `<g transform="translate(${index * cell + (cell - 48) / 2} 0) scale(2)">${body}</g>`;
    })
    .join('');

  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="48" viewBox="0 0 ${width} 48" ` +
    `fill="none" stroke="${INK}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">` +
    `${glyphs}</svg>`;

  return `data:image/svg+xml;base64,${Buffer.from(svg, 'utf8').toString('base64')}`;
}

export function renderOpenGraphImage(): ImageResponse {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: PAPER,
        color: INK,
        padding: '72px 80px',
        fontFamily: 'sans-serif',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div
          style={{
            display: 'flex',
            fontSize: 22,
            letterSpacing: 4,
            textTransform: 'uppercase',
            color: ACCENT,
          }}
        >
          Open source · MIT
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: 76,
            fontWeight: 800,
            letterSpacing: -2,
            lineHeight: 1.05,
          }}
        >
          {SITE.name}
        </div>
        <div
          style={{ display: 'flex', fontSize: 32, color: MUTED, maxWidth: 900, lineHeight: 1.35 }}
        >
          {LIBRARY.iconCount} icons for African life, drawn on one 24-pixel grid. Nigeria first; the
          continent next.
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
        {/*
          A plain <img> on purpose: this tree is rendered into a PNG by Satori,
          not by a browser, so there is nothing for next/image to optimise.
        */}
        <img src={iconStripDataUri(10)} width={960} height={48} alt="" />
        <div style={{ display: 'flex', fontSize: 24, color: MUTED }}>
          icons.neustackstudio.com · v{LIBRARY.version} · {LIBRARY.weightsShipped.join(', ')} weight
        </div>
      </div>
    </div>,
    { ...OG_SIZE },
  );
}
