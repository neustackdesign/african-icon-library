// AUTO-GENERATED FILE — DO NOT EDIT BY HAND.
// Run `npm run generate` after changing the SVG assets or the metadata JSON.
// `npm run verify:generated` fails the build if this file has drifted.

import { forwardRef, type ReactNode } from 'react';

import { IconBase, type IconProps, type IconWeight } from '../icon-base.js';

const geometry: Partial<Record<IconWeight, ReactNode>> = {
  regular: (
    <>
      <path d="M12 2.5v2m0 14v3" />
      <rect width={6.5} height={3.6} x={8.75} y={4.5} rx={1.3} />
      <rect width={6.5} height={3.6} x={8.75} y={9.2} rx={1.3} />
      <rect width={6.5} height={3.6} x={8.75} y={13.9} rx={1.3} />
    </>
  ),
};

/** Suya — A suya skewer with three cuts of meat. */
export const Suya = forwardRef<SVGSVGElement, IconProps>(function Suya(
  { weight = 'regular', ...props },
  ref,
) {
  return (
    <IconBase ref={ref} name="Suya" {...props}>
      {geometry[weight] ?? geometry.regular}
    </IconBase>
  );
});
