// AUTO-GENERATED FILE — DO NOT EDIT BY HAND.
// Run `npm run generate` after changing the SVG assets or the metadata JSON.
// `npm run verify:generated` fails the build if this file has drifted.

import { forwardRef, type ReactNode } from 'react';

import { IconBase, type IconProps, type IconWeight } from '../icon-base.js';

const geometry: Partial<Record<IconWeight, ReactNode>> = {
  regular: (
    <>
      <rect width={19} height={9.75} x={2.5} y={6.5} rx={1.75} />
      <path d="M2.5 11.5h19M8 6.5v5m7.5-5v5" />
      <circle cx={7} cy={17.75} r={1.85} />
      <circle cx={17} cy={17.75} r={1.85} />
    </>
  ),
};

/** Danfo — A Lagos danfo minibus with its beltline and two wheels. */
export const Danfo = forwardRef<SVGSVGElement, IconProps>(function Danfo(
  { weight = 'regular', ...props },
  ref,
) {
  return (
    <IconBase ref={ref} name="Danfo" {...props}>
      {geometry[weight] ?? geometry.regular}
    </IconBase>
  );
});
