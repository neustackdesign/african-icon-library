// AUTO-GENERATED FILE — DO NOT EDIT BY HAND.
// Run `npm run generate` after changing the SVG assets or the metadata JSON.
// `npm run verify:generated` fails the build if this file has drifted.

import { forwardRef, type ReactNode } from 'react';

import { IconBase, type IconProps, type IconWeight } from '../icon-base.js';

const geometry: Partial<Record<IconWeight, ReactNode>> = {
  regular: (
    <>
      <ellipse cx={6} cy={12} rx={2.25} ry={6.5} />
      <path d="M6 5.5h11.75a2.25 6.5 0 0 1 0 13H6" />
      <path d="M10 5.75v12.5m4-12.5v12.5" />
    </>
  ),
};

/** Aso oke fabric — A bolt of aso oke cloth, the woven stripe running its length. */
export const AsoOkeFabric = forwardRef<SVGSVGElement, IconProps>(function AsoOkeFabric(
  { weight = 'regular', ...props },
  ref,
) {
  return (
    <IconBase ref={ref} name="Aso oke fabric" {...props}>
      {geometry[weight] ?? geometry.regular}
    </IconBase>
  );
});
