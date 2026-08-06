// AUTO-GENERATED FILE — DO NOT EDIT BY HAND.
// Run `npm run generate` after changing the SVG assets or the metadata JSON.
// `npm run verify:generated` fails the build if this file has drifted.

import { forwardRef, type ReactNode } from 'react';

import { IconBase, type IconProps, type IconWeight } from '../icon-base.js';

const geometry: Partial<Record<IconWeight, ReactNode>> = {
  regular: (
    <>
      <path d="M6.25 18.5v-13l11.5 13v-13" />
      <path d="M3.5 10.25h17m-17 3.5h17" />
    </>
  ),
};

/** Naira sign — The naira mark, drawn as geometry rather than set as type. */
export const NairaSign = forwardRef<SVGSVGElement, IconProps>(function NairaSign(
  { weight = 'regular', ...props },
  ref,
) {
  return (
    <IconBase ref={ref} name="Naira sign" {...props}>
      {geometry[weight] ?? geometry.regular}
    </IconBase>
  );
});
