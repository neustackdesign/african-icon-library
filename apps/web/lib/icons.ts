import { getIconBody, renderIconSvg } from '@african-icon-library/icons';
import { categories, icons, type Category, type Icon } from '@african-icon-library/metadata';

import { CATEGORY_SYSTEM, categoryColour, categoryRank } from './brand';

export interface BrowserIcon {
  icon: Icon;
  /** Inner markup for the regular weight. Injected as SVG, never as HTML. */
  body: string;
  /** The complete, copyable SVG document. */
  svg: string;
}

export interface CategorySummary {
  id: string;
  label: string;
  description: string;
  colour: string;
  /** Representative drawing for the category index and the footer band. */
  hero: string;
  /** Released icon ids in this category, in canonical order. */
  iconIds: string[];
}

/**
 * Every released icon, ordered the way V3 presents the set: by category in
 * the design-system order, then in canonical metadata order within each one.
 *
 * Only released icons exist in `icons`, so there is no filtering step here and
 * no way for a held drawing to reach a public surface by accident.
 */
export function browserEntries(): BrowserIcon[] {
  return icons
    .map((icon, index) => ({ icon, index }))
    .sort(
      (a, b) => categoryRank(a.icon.category) - categoryRank(b.icon.category) || a.index - b.index,
    )
    .map(({ icon }) => ({
      icon,
      body: getIconBody(icon.id) ?? '',
      svg: renderIconSvg(icon.id, { title: icon.name }) ?? '',
    }));
}

/** Categories that contain at least one released icon — no empty filters — in V3 order. */
export function populatedCategories(): Category[] {
  return (
    categories
      .filter((category) => icons.some((icon) => icon.category === category.id))
      .sort((a, b) => categoryRank(a.id) - categoryRank(b.id))
      // Public fields only; `auditKey` is an internal audit cross-reference.
      .map(({ id, label, description }) => ({ id, label, description }))
  );
}

/** The category index: one row per populated category, built from canonical data. */
export function categorySummaries(): CategorySummary[] {
  return populatedCategories().map((category) => {
    const members = icons.filter((icon) => icon.category === category.id).map((icon) => icon.id);
    const system = CATEGORY_SYSTEM.find((entry) => entry.id === category.id);
    return {
      id: category.id,
      label: category.label,
      description: category.description,
      colour: categoryColour(category.id),
      hero: system && members.includes(system.hero) ? system.hero : (members[0] ?? ''),
      iconIds: members,
    };
  });
}

/** Ids drawn as the representative of their category. */
export function heroIconIds(): Set<string> {
  return new Set(categorySummaries().map((summary) => summary.hero));
}

/** Inner SVG markup for one released icon. Throws on an unknown id so a typo fails the build. */
export function iconBody(id: string): string {
  const body = getIconBody(id);
  if (!body || !icons.some((icon) => icon.id === id)) {
    throw new Error(`"${id}" is not a released icon.`);
  }
  return body;
}
