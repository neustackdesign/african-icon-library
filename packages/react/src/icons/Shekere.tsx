// AUTO-GENERATED FILE — DO NOT EDIT BY HAND.
// Run `npm run generate` after changing the SVG assets or the metadata JSON.
// `npm run verify:generated` fails the build if this file has drifted.

import { forwardRef, type ReactNode } from 'react';

import { IconBase, type IconProps, type IconWeight } from '../icon-base.js';

const geometry: Partial<Record<IconWeight, ReactNode>> = {
  regular: (
    <>
      <path d="M9.75 3.5h4.5m-4.5 0v3.6m4.5-3.6v3.6m-4.5-1.7h4.5" />
      <ellipse cx={12} cy={13.6} rx={6.6} ry={6.9} />
      <path d="M12 6.75v13.7M5.4 13.6h13.2" />
      <path d="m7.35 8.95 9.3 9.3m0-9.3-9.3 9.3" />
    </>
  ),
};

/** Shekere — A gourd rattle wrapped in a beaded net, with its neck at the top. */
export const Shekere = forwardRef<SVGSVGElement, IconProps>(function Shekere(
  { weight = 'regular', ...props },
  ref,
) {
  return (
    <IconBase ref={ref} name="Shekere" {...props}>
      {geometry[weight] ?? geometry.regular}
    </IconBase>
  );
});
