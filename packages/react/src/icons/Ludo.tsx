// AUTO-GENERATED FILE — DO NOT EDIT BY HAND.
// Run `npm run generate` after changing the SVG assets or the metadata JSON.
// `npm run verify:generated` fails the build if this file has drifted.

import { forwardRef, type ReactNode } from 'react';

import { IconBase, type IconProps, type IconWeight } from '../icon-base.js';

const geometry: Partial<Record<IconWeight, ReactNode>> = {
  regular: (
    <>
      <rect width={18} height={18} x={3} y={3} rx={2.5} />
      <path d="M9.75 3v18m4.5-18v18M3 9.75h6.75M3 14.25h6.75m4.5-4.5H21m-6.75 4.5H21" />
      <circle cx={6.4} cy={6.4} r={1.1} />
      <circle cx={17.6} cy={6.4} r={1.1} />
      <circle cx={6.4} cy={17.6} r={1.1} />
      <circle cx={17.6} cy={17.6} r={1.1} />
    </>
  ),
};

/** Ludo board — A ludo board with four home corners and one token in each. */
export const Ludo = forwardRef<SVGSVGElement, IconProps>(function Ludo(
  { weight = 'regular', ...props },
  ref,
) {
  return (
    <IconBase ref={ref} name="Ludo board" {...props}>
      {geometry[weight] ?? geometry.regular}
    </IconBase>
  );
});
