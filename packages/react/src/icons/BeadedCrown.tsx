// AUTO-GENERATED FILE — DO NOT EDIT BY HAND.
// Run `npm run generate` after changing the SVG assets or the metadata JSON.
// `npm run verify:generated` fails the build if this file has drifted.

import { forwardRef, type ReactNode } from 'react';

import { IconBase, type IconProps, type IconWeight } from '../icon-base.js';

const geometry: Partial<Record<IconWeight, ReactNode>> = {
  regular: (
    <>
      <circle cx={12} cy={3.1} r={0.9} />
      <path d="m12 4-5.5 9h11Z" />
      <path d="M5.25 13h13.5v2.75H5.25Z" />
      <path d="M7.5 15.75v3.5m2.5-3.5V20m2-4.25v4.75m2-4.75V20m2.5-4.25v3.5" />
    </>
  ),
};

/** Beaded crown — A conical beaded crown with a finial and a veil fringe. */
export const BeadedCrown = forwardRef<SVGSVGElement, IconProps>(function BeadedCrown(
  { weight = 'regular', ...props },
  ref,
) {
  return (
    <IconBase ref={ref} name="Beaded crown" {...props}>
      {geometry[weight] ?? geometry.regular}
    </IconBase>
  );
});
