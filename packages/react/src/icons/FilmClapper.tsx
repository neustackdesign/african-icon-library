// AUTO-GENERATED FILE — DO NOT EDIT BY HAND.
// Run `npm run generate` after changing the SVG assets or the metadata JSON.
// `npm run verify:generated` fails the build if this file has drifted.

import { forwardRef, type ReactNode } from 'react';

import { IconBase, type IconProps, type IconWeight } from '../icon-base.js';

const geometry: Partial<Record<IconWeight, ReactNode>> = {
  regular: (
    <>
      <rect width={18} height={9.25} x={3} y={10.25} rx={1.5} />
      <path d="m3.4 9.1 17-5.5.85 2.6-17 5.5Z" />
      <path d="m8.35 7.5.7 2.2m3.8-3.65.7 2.2m3.8-3.65.7 2.2" />
    </>
  ),
};

/** Film clapper — A film clapperboard with the arm raised. */
export const FilmClapper = forwardRef<SVGSVGElement, IconProps>(function FilmClapper(
  { weight = 'regular', ...props },
  ref,
) {
  return (
    <IconBase ref={ref} name="Film clapper" {...props}>
      {geometry[weight] ?? geometry.regular}
    </IconBase>
  );
});
