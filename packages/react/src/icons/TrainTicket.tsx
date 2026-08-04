// AUTO-GENERATED FILE — DO NOT EDIT BY HAND.
// Run `npm run generate` after changing the SVG assets or the metadata JSON.
// `npm run verify:generated` fails the build if this file has drifted.

import { forwardRef, type ReactNode } from 'react';

import { IconBase, type IconProps, type IconWeight } from '../icon-base.js';

const geometry: Partial<Record<IconWeight, ReactNode>> = {
  regular: (
    <>
      <path d="M3 7.25c0-.97.78-1.75 1.75-1.75h14.5c.97 0 1.75.78 1.75 1.75v2.5a2.25 2.25 0 0 0 0 4.5v2.5c0 .97-.78 1.75-1.75 1.75H4.75A1.75 1.75 0 0 1 3 16.75v-2.5a2.25 2.25 0 0 0 0-4.5Z" />
      <path d="M15.5 7.75v1.5m0 2v1.5m0 2v1.5" />
    </>
  ),
};

/** Train ticket — A perforated travel ticket with a tear line. */
export const TrainTicket = forwardRef<SVGSVGElement, IconProps>(function TrainTicket(
  { weight = 'regular', ...props },
  ref,
) {
  return (
    <IconBase ref={ref} name="Train ticket" {...props}>
      {geometry[weight] ?? geometry.regular}
    </IconBase>
  );
});
