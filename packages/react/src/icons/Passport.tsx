// AUTO-GENERATED FILE — DO NOT EDIT BY HAND.
// Run `npm run generate` after changing the SVG assets or the metadata JSON.
// `npm run verify:generated` fails the build if this file has drifted.

import { forwardRef, type ReactNode } from 'react';

import { IconBase, type IconProps, type IconWeight } from '../icon-base.js';

const geometry: Partial<Record<IconWeight, ReactNode>> = {
  regular: (
    <>
      <rect width={14.5} height={18.5} x={4.75} y={2.75} rx={2} />
      <circle cx={12} cy={10.5} r={3.75} />
      <path d="M12 6.75c-2 2.2-2 5.3 0 7.5m0-7.5c2 2.2 2 5.3 0 7.5M8.25 10.5h7.5" />
      <path d="M8.5 17.5h7" />
    </>
  ),
};

/** Passport — A passport booklet with a globe device on the cover and no lettering. */
export const Passport = forwardRef<SVGSVGElement, IconProps>(function Passport(
  { weight = 'regular', ...props },
  ref,
) {
  return (
    <IconBase ref={ref} name="Passport" {...props}>
      {geometry[weight] ?? geometry.regular}
    </IconBase>
  );
});
