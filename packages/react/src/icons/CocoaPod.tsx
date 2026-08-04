// AUTO-GENERATED FILE — DO NOT EDIT BY HAND.
// Run `npm run generate` after changing the SVG assets or the metadata JSON.
// `npm run verify:generated` fails the build if this file has drifted.

import { forwardRef, type ReactNode } from 'react';

import { IconBase, type IconProps, type IconWeight } from '../icon-base.js';

const geometry: Partial<Record<IconWeight, ReactNode>> = {
  regular: (
    <>
      <path d="M12 3.25c3.6 2.3 5.6 6.1 5.6 9.6 0 4.1-2.5 7.2-5.6 7.7-3.1-.5-5.6-3.6-5.6-7.7 0-3.5 2-7.3 5.6-9.6" />
      <path d="M12 4.5v15" />
    </>
  ),
};

/** Cocoa pod — A cocoa pod with a single central ridge. */
export const CocoaPod = forwardRef<SVGSVGElement, IconProps>(function CocoaPod(
  { weight = 'regular', ...props },
  ref,
) {
  return (
    <IconBase ref={ref} name="Cocoa pod" {...props}>
      {geometry[weight] ?? geometry.regular}
    </IconBase>
  );
});
