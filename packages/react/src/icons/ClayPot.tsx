// AUTO-GENERATED FILE — DO NOT EDIT BY HAND.
// Run `npm run generate` after changing the SVG assets or the metadata JSON.
// `npm run verify:generated` fails the build if this file has drifted.

import { forwardRef, type ReactNode } from 'react';

import { IconBase, type IconProps, type IconWeight } from '../icon-base.js';

const geometry: Partial<Record<IconWeight, ReactNode>> = {
  regular: (
    <>
      <ellipse cx={12} cy={4.75} rx={3.25} ry={1.1} />
      <path d="M8.75 5.5c.5 1.1.2 2-.8 2.85a6.85 6.85 0 1 0 8.1 0c-1-.85-1.3-1.75-.8-2.85" />
      <path d="M6.6 13c1.8 1.25 3.6-1.25 5.4 0s3.6 1.25 5.4 0" />
    </>
  ),
};

/** Clay pot — A round-bellied clay water pot with a flared rim and a banded waist. */
export const ClayPot = forwardRef<SVGSVGElement, IconProps>(function ClayPot(
  { weight = 'regular', ...props },
  ref,
) {
  return (
    <IconBase ref={ref} name="Clay pot" {...props}>
      {geometry[weight] ?? geometry.regular}
    </IconBase>
  );
});
