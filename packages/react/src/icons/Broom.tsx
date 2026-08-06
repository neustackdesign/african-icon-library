// AUTO-GENERATED FILE — DO NOT EDIT BY HAND.
// Run `npm run generate` after changing the SVG assets or the metadata JSON.
// `npm run verify:generated` fails the build if this file has drifted.

import { forwardRef, type ReactNode } from 'react';

import { IconBase, type IconProps, type IconWeight } from '../icon-base.js';

const geometry: Partial<Record<IconWeight, ReactNode>> = {
  regular: (
    <>
      <path d="M9.25 3.5h5.5v3.25h-5.5Z" />
      <path d="M9.25 5.25h5.5" />
      <path d="m9.9 6.75-4.15 14m5.55-14-1.8 14m3.2-14 1.8 14m-.4-14 4.15 14" />
    </>
  ),
};

/** Broom — A bound bundle of palm-frond ribs, fanning out from a wrapped grip. */
export const Broom = forwardRef<SVGSVGElement, IconProps>(function Broom(
  { weight = 'regular', ...props },
  ref,
) {
  return (
    <IconBase ref={ref} name="Broom" {...props}>
      {geometry[weight] ?? geometry.regular}
    </IconBase>
  );
});
