// AUTO-GENERATED FILE — DO NOT EDIT BY HAND.
// Run `npm run generate` after changing the SVG assets or the metadata JSON.
// `npm run verify:generated` fails the build if this file has drifted.

import { forwardRef, type ReactNode } from 'react';

import { IconBase, type IconProps, type IconWeight } from '../icon-base.js';

const geometry: Partial<Record<IconWeight, ReactNode>> = {
  regular: (
    <>
      <path d="M4 20.25h16" />
      <path d="M7 20.25 10.1 9.4l3.1 10.85" />
      <path d="m4.6 11.6 11.5-4.7" />
      <path d="M16.1 6.9a3.1 3.1 0 0 1 2.5 3.6" />
      <path d="M18.6 10.5v3" />
      <circle cx={5.1} cy={13.5} r={1.6} />
    </>
  ),
};

/** Oil pumpjack — An oil pumpjack with its walking beam and counterweight. */
export const OilPumpjack = forwardRef<SVGSVGElement, IconProps>(function OilPumpjack(
  { weight = 'regular', ...props },
  ref,
) {
  return (
    <IconBase ref={ref} name="Oil pumpjack" {...props}>
      {geometry[weight] ?? geometry.regular}
    </IconBase>
  );
});
