// AUTO-GENERATED FILE — DO NOT EDIT BY HAND.
// Run `npm run generate` after changing the SVG assets or the metadata JSON.
// `npm run verify:generated` fails the build if this file has drifted.

import { forwardRef, type ReactNode } from 'react';

import { IconBase, type IconProps, type IconWeight } from '../icon-base.js';

const geometry: Partial<Record<IconWeight, ReactNode>> = {
  regular: (
    <>
      <circle cx={5.9} cy={16.25} r={3.6} />
      <circle cx={18.1} cy={16.25} r={3.6} />
      <path d="m5.9 16.25 4.35-6h4.25l3.6 6" />
      <path d="M8.5 10.25H15" />
      <path d="M14.5 10.25 16.25 7h2.25" />
    </>
  ),
};

/** Okada — A commercial motorcycle seen side-on, frame and handlebar simplified. */
export const Okada = forwardRef<SVGSVGElement, IconProps>(function Okada(
  { weight = 'regular', ...props },
  ref,
) {
  return (
    <IconBase ref={ref} name="Okada" {...props}>
      {geometry[weight] ?? geometry.regular}
    </IconBase>
  );
});
