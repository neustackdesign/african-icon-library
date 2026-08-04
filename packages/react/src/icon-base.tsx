import { forwardRef, type ReactNode, type SVGProps } from 'react';

export type IconWeight = 'thin' | 'regular' | 'bold' | 'fill';

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'children'> {
  /**
   * Drawn weight. Only weights the library actually ships are honoured; an
   * unshipped weight falls back to `regular` rather than faking one by changing
   * the stroke width.
   */
  weight?: IconWeight;
  /** Rendered size for both axes. Defaults to 24. */
  size?: number | string;
  /**
   * Accessible name.
   *
   * Omit it when the icon sits beside its own visible label — the icon is then
   * hidden from assistive technology, which is the correct default. Provide it
   * when the icon is the only thing conveying the meaning.
   */
  title?: string;
}

export interface IconBaseProps extends IconProps {
  /** Display name from metadata. Not rendered; kept for devtools legibility. */
  name?: string;
  children: ReactNode;
}

/**
 * Shared chrome for every generated icon: canvas, paint, caps and joins, plus
 * the accessibility wiring. Generated components supply geometry and nothing else.
 *
 * Deliberately hook-free, so every icon works unchanged in a React Server
 * Component. The accessible name uses `aria-label` rather than a `<title>`
 * element, which would need a unique id and therefore a hook.
 */
export const IconBase = forwardRef<SVGSVGElement, IconBaseProps>(function IconBase(
  { size = 24, strokeWidth = 1.5, title, name: _name, children, ...props },
  ref,
) {
  return (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  );
});
