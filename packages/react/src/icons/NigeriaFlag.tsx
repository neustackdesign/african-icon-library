// AUTO-GENERATED FILE — DO NOT EDIT BY HAND.
// Run `npm run generate` after changing the SVG assets or the metadata JSON.
// `npm run verify:generated` fails the build if this file has drifted.

import { forwardRef, type ReactNode } from 'react';

import { IconBase, type IconProps, type IconWeight } from '../icon-base.js';

const geometry: Partial<Record<IconWeight, ReactNode>> = {
  regular: (
    <>
      <rect width={18.5} height={13.5} x={2.75} y={5.25} rx={1.5} />
      <path d="M8.92 5.25v13.5m6.16-13.5v13.5" />
    </>
  ),
};

/** Nigeria flag — A three-band vertical flag in the Nigerian proportion. */
export const NigeriaFlag = forwardRef<SVGSVGElement, IconProps>(function NigeriaFlag(
  { weight = 'regular', ...props },
  ref,
) {
  return (
    <IconBase ref={ref} name="Nigeria flag" {...props}>
      {geometry[weight] ?? geometry.regular}
    </IconBase>
  );
});
