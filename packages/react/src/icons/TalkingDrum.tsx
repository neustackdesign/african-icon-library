// AUTO-GENERATED FILE — DO NOT EDIT BY HAND.
// Run `npm run generate` after changing the SVG assets or the metadata JSON.
// `npm run verify:generated` fails the build if this file has drifted.

import { forwardRef, type ReactNode } from 'react';

import { IconBase, type IconProps, type IconWeight } from '../icon-base.js';

const geometry: Partial<Record<IconWeight, ReactNode>> = {
  regular: (
    <>
      <ellipse cx={12} cy={5.5} rx={5.5} ry={1.75} />
      <path d="M6.5 5.5c1.4 4 1.4 9 0 13m11-13c-1.4 4-1.4 9 0 13" />
      <path d="M6.5 18.5a5.5 1.75 0 0 0 11 0" />
      <path d="m9.3 7 1.3 10m4.1-10-1.3 10M12 7.25V17" />
    </>
  ),
};

/** Talking drum — An hourglass talking drum with tension cords along the waist. */
export const TalkingDrum = forwardRef<SVGSVGElement, IconProps>(function TalkingDrum(
  { weight = 'regular', ...props },
  ref,
) {
  return (
    <IconBase ref={ref} name="Talking drum" {...props}>
      {geometry[weight] ?? geometry.regular}
    </IconBase>
  );
});
