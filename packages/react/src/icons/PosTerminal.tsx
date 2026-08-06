// AUTO-GENERATED FILE — DO NOT EDIT BY HAND.
// Run `npm run generate` after changing the SVG assets or the metadata JSON.
// `npm run verify:generated` fails the build if this file has drifted.

import { forwardRef, type ReactNode } from 'react';

import { IconBase, type IconProps, type IconWeight } from '../icon-base.js';

const geometry: Partial<Record<IconWeight, ReactNode>> = {
  regular: (
    <>
      <path d="M8.75 3.5V2.25h6.5V3.5" />
      <rect width={11.5} height={17} x={6.25} y={3.5} rx={2} />
      <rect width={7} height={4} x={8.5} y={6} rx={0.75} />
      <circle cx={9.5} cy={13.25} r={0.6} />
      <circle cx={12} cy={13.25} r={0.6} />
      <circle cx={14.5} cy={13.25} r={0.6} />
      <circle cx={9.5} cy={16.5} r={0.6} />
      <circle cx={12} cy={16.5} r={0.6} />
      <circle cx={14.5} cy={16.5} r={0.6} />
    </>
  ),
};

/** POS terminal — A card payment terminal with a card seated in the top slot. */
export const PosTerminal = forwardRef<SVGSVGElement, IconProps>(function PosTerminal(
  { weight = 'regular', ...props },
  ref,
) {
  return (
    <IconBase ref={ref} name="POS terminal" {...props}>
      {geometry[weight] ?? geometry.regular}
    </IconBase>
  );
});
