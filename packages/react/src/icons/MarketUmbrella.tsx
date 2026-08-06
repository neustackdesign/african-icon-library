// AUTO-GENERATED FILE — DO NOT EDIT BY HAND.
// Run `npm run generate` after changing the SVG assets or the metadata JSON.
// `npm run verify:generated` fails the build if this file has drifted.

import { forwardRef, type ReactNode } from 'react';

import { IconBase, type IconProps, type IconWeight } from '../icon-base.js';

const geometry: Partial<Record<IconWeight, ReactNode>> = {
  regular: (
    <>
      <path d="M2.75 11.5a9.25 7 0 0 1 18.5 0Z" />
      <path d="M12 4.5v7M7 5.75l1.75 5.75M17 5.75l-1.75 5.75" />
      <path d="M12 11.5v9" />
      <path d="M9 20.5h6" />
    </>
  ),
};

/** Market umbrella — A ribbed market parasol on a centre pole with a weighted foot. */
export const MarketUmbrella = forwardRef<SVGSVGElement, IconProps>(function MarketUmbrella(
  { weight = 'regular', ...props },
  ref,
) {
  return (
    <IconBase ref={ref} name="Market umbrella" {...props}>
      {geometry[weight] ?? geometry.regular}
    </IconBase>
  );
});
