// AUTO-GENERATED FILE — DO NOT EDIT BY HAND.
// Run `npm run generate` after changing the SVG assets or the metadata JSON.
// `npm run verify:generated` fails the build if this file has drifted.

import { forwardRef, type ReactNode } from 'react';

import { IconBase, type IconProps, type IconWeight } from '../icon-base.js';

const geometry: Partial<Record<IconWeight, ReactNode>> = {
  regular: (
    <>
      <path d="M3.75 10.75h16.5a8.25 7.25 0 0 1-5.5 6.85v1.65h-5.5V17.6a8.25 7.25 0 0 1-5.5-6.85" />
      <path d="M9.75 4c-.6 1.1.6 1.7 0 2.8m4.5-2.8c-.6 1.1.6 1.7 0 2.8" />
    </>
  ),
};

/** Pepper soup — A wide bowl of pepper soup with rising steam. */
export const PepperSoup = forwardRef<SVGSVGElement, IconProps>(function PepperSoup(
  { weight = 'regular', ...props },
  ref,
) {
  return (
    <IconBase ref={ref} name="Pepper soup" {...props}>
      {geometry[weight] ?? geometry.regular}
    </IconBase>
  );
});
