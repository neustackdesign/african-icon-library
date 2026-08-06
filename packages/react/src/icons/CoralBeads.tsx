// AUTO-GENERATED FILE — DO NOT EDIT BY HAND.
// Run `npm run generate` after changing the SVG assets or the metadata JSON.
// `npm run verify:generated` fails the build if this file has drifted.

import { forwardRef, type ReactNode } from 'react';

import { IconBase, type IconProps, type IconWeight } from '../icon-base.js';

const geometry: Partial<Record<IconWeight, ReactNode>> = {
  regular: (
    <>
      <path d="M4.01 8.59a9.75 9.75 0 0 0 15.98 0" />
      <circle cx={4.01} cy={8.59} r={1.3} />
      <circle cx={7.88} cy={11.84} r={1.3} />
      <circle cx={12} cy={12.75} r={1.3} />
      <circle cx={16.12} cy={11.84} r={1.3} />
      <circle cx={19.99} cy={8.59} r={1.3} />
      <ellipse cx={12} cy={16.9} rx={1.6} ry={2.3} />
    </>
  ),
};

/** Coral beads — A strand of coral beads with a hanging pendant. */
export const CoralBeads = forwardRef<SVGSVGElement, IconProps>(function CoralBeads(
  { weight = 'regular', ...props },
  ref,
) {
  return (
    <IconBase ref={ref} name="Coral beads" {...props}>
      {geometry[weight] ?? geometry.regular}
    </IconBase>
  );
});
