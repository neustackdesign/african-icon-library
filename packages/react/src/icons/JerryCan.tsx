// AUTO-GENERATED FILE — DO NOT EDIT BY HAND.
// Run `npm run generate` after changing the SVG assets or the metadata JSON.
// `npm run verify:generated` fails the build if this file has drifted.

import { forwardRef, type ReactNode } from 'react';

import { IconBase, type IconProps, type IconWeight } from '../icon-base.js';

const geometry: Partial<Record<IconWeight, ReactNode>> = {
  regular: (
    <>
      <rect width={11} height={14.5} x={5} y={6.25} rx={1.25} />
      <path d="M8 6.25V4.5h5v1.75" />
      <path d="M16 9.75h2.25c.7 0 1.25.55 1.25 1.25v1.5" />
      <path d="m7.75 9.75 5.5 7.5m0-7.5-5.5 7.5" />
    </>
  ),
};

/** Jerry can — A fuel can with a carrying handle, a pouring spout and an embossed cross. */
export const JerryCan = forwardRef<SVGSVGElement, IconProps>(function JerryCan(
  { weight = 'regular', ...props },
  ref,
) {
  return (
    <IconBase ref={ref} name="Jerry can" {...props}>
      {geometry[weight] ?? geometry.regular}
    </IconBase>
  );
});
