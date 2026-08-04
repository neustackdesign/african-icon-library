// AUTO-GENERATED FILE — DO NOT EDIT BY HAND.
// Run `npm run generate` after changing the SVG assets or the metadata JSON.
// `npm run verify:generated` fails the build if this file has drifted.

import { forwardRef, type ReactNode } from 'react';

import { IconBase, type IconProps, type IconWeight } from '../icon-base.js';

const geometry: Partial<Record<IconWeight, ReactNode>> = {
  regular: (
    <>
      <path d="M7.5 6.75 5.4 13.4a2.15.85 0 0 0 4.2 0Z" />
      <path d="M15.5 4.75 12.6 15.4a2.95 1.15 0 0 0 5.9 0Z" />
      <path d="M7.5 6.75c1-2.35 6-3.85 8-2" />
    </>
  ),
};

/** Agogo — Paired agogo bells joined by a sprung handle. */
export const Agogo = forwardRef<SVGSVGElement, IconProps>(function Agogo(
  { weight = 'regular', ...props },
  ref,
) {
  return (
    <IconBase ref={ref} name="Agogo" {...props}>
      {geometry[weight] ?? geometry.regular}
    </IconBase>
  );
});
