// AUTO-GENERATED FILE — DO NOT EDIT BY HAND.
// Run `npm run generate` after changing the SVG assets or the metadata JSON.
// `npm run verify:generated` fails the build if this file has drifted.

import { forwardRef, type ReactNode } from 'react';

import { IconBase, type IconProps, type IconWeight } from '../icon-base.js';

const geometry: Partial<Record<IconWeight, ReactNode>> = {
  regular: (
    <>
      <path d="M9 6.5V5.25a3 2.75 0 0 1 6 0V6.5" />
      <path d="M7.75 6.5h8.5l-1 2.25h-6.5Z" />
      <path d="M8.75 8.75c-1.5 2.25-1.5 6 0 8.25h6.5c1.5-2.25 1.5-6 0-8.25Z" />
      <path d="M6.75 17h10.5v3.5H6.75Z" />
    </>
  ),
};

/** Kerosene lantern — A hurricane lantern with a wire handle, a glass globe and a fuel tank. */
export const KeroseneLantern = forwardRef<SVGSVGElement, IconProps>(function KeroseneLantern(
  { weight = 'regular', ...props },
  ref,
) {
  return (
    <IconBase ref={ref} name="Kerosene lantern" {...props}>
      {geometry[weight] ?? geometry.regular}
    </IconBase>
  );
});
