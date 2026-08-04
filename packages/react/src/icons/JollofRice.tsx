// AUTO-GENERATED FILE — DO NOT EDIT BY HAND.
// Run `npm run generate` after changing the SVG assets or the metadata JSON.
// `npm run verify:generated` fails the build if this file has drifted.

import { forwardRef, type ReactNode } from 'react';

import { IconBase, type IconProps, type IconWeight } from '../icon-base.js';

const geometry: Partial<Record<IconWeight, ReactNode>> = {
  regular: (
    <>
      <path d="M5.5 15.5a6.5 6.5 0 0 1 13 0" />
      <path d="M3.25 15.5h17.5" />
      <path d="M6 15.5a6.75 2.4 0 0 0 12 0" />
      <path d="m9.3 12.3 1 .4m3.4-1.7 1 .4m-3.4-1.8 1 .4" />
    </>
  ),
};

/** Jollof rice — A mounded plate of jollof rice on a serving line. */
export const JollofRice = forwardRef<SVGSVGElement, IconProps>(function JollofRice(
  { weight = 'regular', ...props },
  ref,
) {
  return (
    <IconBase ref={ref} name="Jollof rice" {...props}>
      {geometry[weight] ?? geometry.regular}
    </IconBase>
  );
});
