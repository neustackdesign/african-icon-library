import { ImageResponse } from 'next/og';

import { getIconBody } from '@african-icon-library/icons';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

/**
 * The favicon is the talking drum — a real released drawing, rendered at build
 * time from the same asset the library ships, so it can never drift from the set.
 */
export default function Icon() {
  const body = getIconBody('talking-drum') ?? '';

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#16150F',
      }}
    >
      {/*
        A plain <img> on purpose: this tree is rendered into a PNG by Satori,
        not by a browser, so there is nothing for next/image to optimise.
      */}
      <img
        width={22}
        height={22}
        alt=""
        src={`data:image/svg+xml;base64,${Buffer.from(
          `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FAF9F6" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`,
          'utf8',
        ).toString('base64')}`}
      />
    </div>,
    { ...size },
  );
}
