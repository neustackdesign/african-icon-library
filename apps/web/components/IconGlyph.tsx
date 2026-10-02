import type { CSSProperties } from 'react';

interface Props {
  /** Inner markup of a released drawing, from `@african-icon-library/icons`. */
  body: string;
  /** Pixel size, or any CSS length when the glyph scales with its container. */
  size?: number | string;
  /** Accessible name. Omit for decorative use, where the glyph is hidden from assistive tech. */
  label?: string;
  className?: string;
  style?: CSSProperties;
}

/**
 * One released drawing at the library's own stroke settings.
 *
 * Works in server and client components alike. The markup is compiled into
 * the bundle from validated assets: no element outside the allow-list survives
 * `npm run validate`, and none of it comes from user input or a network
 * response.
 */
export function IconGlyph({ body, size = 24, label, className, style }: Props) {
  return (
    <svg
      className={className ? `icon-glyph ${className}` : 'icon-glyph'}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      focusable="false"
      style={style}
      {...(label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true })}
      dangerouslySetInnerHTML={{ __html: body }}
    />
  );
}
