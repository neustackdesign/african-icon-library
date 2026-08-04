// AUTO-GENERATED FILE — DO NOT EDIT BY HAND.
// Run `npm run generate` after changing the SVG assets or the metadata JSON.
// `npm run verify:generated` fails the build if this file has drifted.

import { forwardRef, type ReactNode } from 'react';

import { IconBase, type IconProps, type IconWeight } from '../icon-base.js';

const geometry: Partial<Record<IconWeight, ReactNode>> = {
  regular: (
    <>
      <rect width={18.5} height={12.5} x={2.75} y={5.75} rx={1.5} />
      <path d="M9.5 15.5v-7l5 7v-7" />
      <path d="M7.5 10.75h9m-9 2.5h9" />
    </>
  ),
};

/** Naira note — A banknote carrying the naira mark drawn as geometry rather than type. */
export const NairaNote = forwardRef<SVGSVGElement, IconProps>(function NairaNote(
  { weight = 'regular', ...props },
  ref,
) {
  return (
    <IconBase ref={ref} name="Naira note" {...props}>
      {geometry[weight] ?? geometry.regular}
    </IconBase>
  );
});
