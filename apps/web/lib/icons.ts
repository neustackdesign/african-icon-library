import { getIconBody, renderIconSvg } from '@african-icon-library/icons';
import { categories, icons } from '@african-icon-library/metadata';

import type { BrowserIcon } from '@/components/IconBrowser';

/**
 * Assembles the data the browser needs.
 *
 * Only released icons exist in `icons`, so there is no filtering step here and
 * no way for a held drawing to reach a public surface by accident.
 */
export function browserEntries(): BrowserIcon[] {
  return icons.map((icon) => ({
    icon,
    body: getIconBody(icon.id) ?? '',
    svg: renderIconSvg(icon.id, { title: icon.name }) ?? '',
  }));
}

/** Categories that contain at least one released icon — no empty filters. */
export function populatedCategories() {
  return categories.filter((category) => icons.some((icon) => icon.category === category.id));
}
