// AUTO-GENERATED FILE — DO NOT EDIT BY HAND.
// Run `npm run generate` after changing the SVG assets or the metadata JSON.
// `npm run verify:generated` fails the build if this file has drifted.

import { forwardRef, type ReactNode } from 'react';

import { IconBase, type IconProps, type IconWeight } from '../icon-base.js';

const geometry: Partial<Record<IconWeight, ReactNode>> = {
  regular: (
    <>
      <path d="M12 8c-3.9 0-6.9 2.5-6.9 5.9 0 3.75 3.1 6.35 6.9 6.35s6.9-2.6 6.9-6.35c0-3.4-3-5.9-6.9-5.9" />
      <path d="M8.6 12.9c-.15 2.75 1.05 4.9 3.4 6.35m3.4-6.35c.15 2.75-1.05 4.9-3.4 6.35" />
      <path d="M12 8V6.4c0-1.6 1.2-2.9 2.8-2.9h1.6" />
    </>
  ),
};

/** Ata rodo — A scotch bonnet pepper with its lobed body and curled stem. */
export const AtaRodo = forwardRef<SVGSVGElement, IconProps>(function AtaRodo(
  { weight = 'regular', ...props },
  ref,
) {
  return (
    <IconBase ref={ref} name="Ata rodo" {...props}>
      {geometry[weight] ?? geometry.regular}
    </IconBase>
  );
});
