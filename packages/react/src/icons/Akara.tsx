// AUTO-GENERATED FILE — DO NOT EDIT BY HAND.
// Run `npm run generate` after changing the SVG assets or the metadata JSON.
// `npm run verify:generated` fails the build if this file has drifted.

import { forwardRef, type ReactNode } from 'react';

import { IconBase, type IconProps, type IconWeight } from '../icon-base.js';

const geometry: Partial<Record<IconWeight, ReactNode>> = {
  regular: (
    <>
      <path d="M3.5 11.75a8.5 7.5 0 0 0 17 0Z" />
      <circle cx={7.9} cy={9.6} r={1.75} />
      <circle cx={12} cy={9.9} r={1.75} />
      <circle cx={16.1} cy={9.6} r={1.75} />
      <circle cx={9.9} cy={6.5} r={1.75} />
      <circle cx={14.1} cy={6.5} r={1.75} />
    </>
  ),
};

/** Akara — A bowl of akara, the bean fritters piled above the rim. */
export const Akara = forwardRef<SVGSVGElement, IconProps>(function Akara(
  { weight = 'regular', ...props },
  ref,
) {
  return (
    <IconBase ref={ref} name="Akara" {...props}>
      {geometry[weight] ?? geometry.regular}
    </IconBase>
  );
});
