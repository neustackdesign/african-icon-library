// AUTO-GENERATED FILE — DO NOT EDIT BY HAND.
// Run `npm run generate` after changing the SVG assets or the metadata JSON.
// `npm run verify:generated` fails the build if this file has drifted.

import { forwardRef, type ReactNode } from 'react';

import { IconBase, type IconProps, type IconWeight } from '../icon-base.js';

const geometry: Partial<Record<IconWeight, ReactNode>> = {
  regular: (
    <>
      <path d="M8.75 4.5H7L3.75 7.75l2 2.25 1.5-1.3v10.05a1 1 0 0 0 1 1h7.5a1 1 0 0 0 1-1V8.7l1.5 1.3 2-2.25L17 4.5h-1.75a3.25 3.25 0 0 1-6.5 0" />
    </>
  ),
};

/** Football jersey — A football jersey with a round collar and set-in sleeves. */
export const FootballJersey = forwardRef<SVGSVGElement, IconProps>(function FootballJersey(
  { weight = 'regular', ...props },
  ref,
) {
  return (
    <IconBase ref={ref} name="Football jersey" {...props}>
      {geometry[weight] ?? geometry.regular}
    </IconBase>
  );
});
