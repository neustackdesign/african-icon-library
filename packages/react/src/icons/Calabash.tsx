// AUTO-GENERATED FILE — DO NOT EDIT BY HAND.
// Run `npm run generate` after changing the SVG assets or the metadata JSON.
// `npm run verify:generated` fails the build if this file has drifted.

import { forwardRef, type ReactNode } from 'react';

import { IconBase, type IconProps, type IconWeight } from '../icon-base.js';

const geometry: Partial<Record<IconWeight, ReactNode>> = {
  regular: (
    <>
      <ellipse cx={12} cy={14.25} rx={6.25} ry={5.75} />
      <path d="M10.6 3.5h2.8" />
      <path d="M10.6 3.5c0 1.5.5 2.4.5 3.6 0 1.1-.75 1.85-1.35 2.6m3.65-6.2c0 1.5-.5 2.4-.5 3.6 0 1.1.75 1.85 1.35 2.6" />
      <path d="M7 17.5c1.65 1.15 3.35 1.15 5 0s3.35-1.15 5 0" />
    </>
  ),
};

/** Calabash — A bottle gourd with a narrow neck and an incised band. */
export const Calabash = forwardRef<SVGSVGElement, IconProps>(function Calabash(
  { weight = 'regular', ...props },
  ref,
) {
  return (
    <IconBase ref={ref} name="Calabash" {...props}>
      {geometry[weight] ?? geometry.regular}
    </IconBase>
  );
});
