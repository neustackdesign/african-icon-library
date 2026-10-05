import type { CSSProperties } from 'react';

interface Props {
  body: string;
  width: number;
  height: number;
  /** Longest side in px, or a CSS length; the other side follows the map's own proportions. */
  size?: number | string;
  label?: string;
  className?: string;
  style?: CSSProperties;
}

/**
 * One country map in the library's line language, at its real aspect ratio.
 *
 * The longest side is set and the other is left to the viewBox, so a map is
 * never stretched into a square. Markup is compiled from validated assets.
 */
export function MapGlyph({ body, width, height, size = 48, label, className, style }: Props) {
  const landscape = width >= height;
  return (
    <svg
      className={className ? `map-glyph ${className}` : 'map-glyph'}
      viewBox={`0 0 ${width} ${height}`}
      width={landscape ? size : undefined}
      height={landscape ? undefined : size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      focusable="false"
      style={{ aspectRatio: `${width} / ${height}`, ...style }}
      {...(label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true })}
      dangerouslySetInnerHTML={{ __html: body }}
    />
  );
}
