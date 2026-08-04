// AUTO-GENERATED FILE — DO NOT EDIT BY HAND.
// Run `npm run generate` after changing the SVG assets or the metadata JSON.
// `npm run verify:generated` fails the build if this file has drifted.

import { forwardRef, type ReactNode } from 'react';

import { IconBase, type IconProps, type IconWeight } from '../icon-base.js';

const geometry: Partial<Record<IconWeight, ReactNode>> = {
  regular: (
    <>
      <path d="M2.75 10.75c2.4 4.4 5.9 6.6 9.25 6.6s6.85-2.2 9.25-6.6" />
      <path d="M2.75 10.75c3 1.35 6.1 2 9.25 2s6.25-.65 9.25-2" />
      <path d="M16.25 3.75 9.75 13" />
    </>
  ),
};

/** Canoe — A dugout canoe seen side-on with a paddle across the hull. */
export const Canoe = forwardRef<SVGSVGElement, IconProps>(function Canoe(
  { weight = 'regular', ...props },
  ref,
) {
  return (
    <IconBase ref={ref} name="Canoe" {...props}>
      {geometry[weight] ?? geometry.regular}
    </IconBase>
  );
});
