// AUTO-GENERATED FILE — DO NOT EDIT BY HAND.
// Run `npm run generate` after changing the SVG assets or the metadata JSON.
// `npm run verify:generated` fails the build if this file has drifted.

import { forwardRef, type ReactNode } from 'react';

import { IconBase, type IconProps, type IconWeight } from '../icon-base.js';

const geometry: Partial<Record<IconWeight, ReactNode>> = {
  regular: (
    <>
      <path d="m4.5 7.25 2.5-2 2.5 2 2.5-2 2.5 2 2.5-2 2.5 2v9.5l-2.5 2-2.5-2-2.5 2-2.5-2-2.5 2-2.5-2Z" />
      <rect width={2.4} height={2.4} x={8.9} y={10} rx={0.5} />
      <rect width={2.4} height={2.4} x={12.7} y={11.6} rx={0.5} />
    </>
  ),
};

/** Chin chin pack — A crimped snack wrapper with the contents visible through the window. */
export const ChinChinPack = forwardRef<SVGSVGElement, IconProps>(function ChinChinPack(
  { weight = 'regular', ...props },
  ref,
) {
  return (
    <IconBase ref={ref} name="Chin chin pack" {...props}>
      {geometry[weight] ?? geometry.regular}
    </IconBase>
  );
});
