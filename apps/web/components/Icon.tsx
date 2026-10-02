import { getIcon } from '@african-icon-library/metadata';

import { iconBody } from '@/lib/icons';

import { IconGlyph } from './IconGlyph';

interface Props {
  /** A released icon id. An unknown id fails the build rather than rendering a blank. */
  id: string;
  size?: number | string;
  /** Give the glyph its accessible name (the icon's canonical name). Decorative by default. */
  labelled?: boolean;
  className?: string;
}

/** Server-side convenience: a released icon by id. */
export function Icon({ id, size, labelled = false, className }: Props) {
  return (
    <IconGlyph
      body={iconBody(id)}
      size={size}
      label={labelled ? getIcon(id)?.name : undefined}
      className={className}
    />
  );
}
