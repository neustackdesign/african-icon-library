/**
 * The structure of the Community file, derived entirely from the released data.
 *
 * Nothing in this module touches the Figma API, so the shape of the file — how
 * many pages, which categories get one, which icons are on the cover — can be
 * reasoned about and tested without a Figma runtime.
 *
 * Hard rule: no icon id, icon count or category list is written down here. Every
 * one of them is read from `apps/figma-plugin/src/generated/icon-data.ts`, which
 * `npm run generate` rebuilds from `packages/metadata/src/data/icons.json`. A
 * release that adds icons changes this file's output without changing its text.
 */

import {
  PLUGIN_CATEGORIES,
  PLUGIN_ICONS,
  PLUGIN_SVG,
  PLUGIN_WEIGHTS,
} from '../../figma-plugin/src/generated/icon-data';
import { categories, pipeline, regions, type Icon } from '@african-icon-library/metadata';

export { PLUGIN_CATEGORIES, PLUGIN_ICONS, PLUGIN_SVG, PLUGIN_WEIGHTS };

export const LIBRARY_NAME = 'African Icon Library';

/**
 * Every released icon, in stable id order.
 *
 * `PLUGIN_ICONS` is already sorted by the generator; the copy keeps callers from
 * reordering the shared array in place.
 */
export const releasedIcons: readonly Icon[] = [...PLUGIN_ICONS];

/* ------------------------------------------------------------------ *
 * Weights
 * ------------------------------------------------------------------ */

/**
 * The weights of an icon that have a real drawing behind them.
 *
 * `icon.weights` is the metadata's claim; `PLUGIN_SVG` is the evidence. Only the
 * intersection is treated as drawn, so a metadata edit that runs ahead of the
 * artwork can never produce a variant for a weight nobody has drawn.
 */
export function drawnWeights(icon: Icon): string[] {
  const sources = PLUGIN_SVG[icon.id] ?? {};
  return icon.weights.filter((weight) => typeof sources[weight] === 'string' && sources[weight]);
}

/** Weights the drawing system defines but the library has not drawn yet. */
export function undrawnWeights(): string[] {
  // Taken from the pipeline summary rather than the schema's `WEIGHTS` const:
  // importing a value out of the schema module drags zod into the bundle, and
  // the bundle must contain no absolute URLs (build.ts enforces that).
  const known = [...pipeline.weightsShipped, ...pipeline.weightsPlanned];
  const drawn = new Set(PLUGIN_WEIGHTS);
  return [...new Set(known)].filter((weight) => !drawn.has(weight));
}

/** True when at least one released icon is drawn in more than one weight. */
export function anyIconHasMultipleWeights(): boolean {
  return releasedIcons.some((icon) => drawnWeights(icon).length > 1);
}

/** `Regular`, `Semi Bold`-style casing for a weight id, for variant values. */
export function weightLabel(weight: string): string {
  return weight.charAt(0).toUpperCase() + weight.slice(1);
}

/* ------------------------------------------------------------------ *
 * Names
 * ------------------------------------------------------------------ */

/**
 * The component name Figma's asset panel nests by category, exactly as
 * docs/figma-community-file-spec.md specifies it.
 */
export function componentName(icon: Icon): string {
  return `african-icons/${icon.category}/${icon.id}`;
}

/** Highest `addedIn` across the released set — the version this file represents. */
export function libraryVersion(icons: readonly Icon[] = releasedIcons): string {
  const parse = (value: string): number[] => value.split('.').map((part) => Number(part) || 0);
  let best = '0.0.0';
  for (const icon of icons) {
    const [aMajor, aMinor, aPatch] = parse(icon.addedIn);
    const [bMajor, bMinor, bPatch] = parse(best);
    if (
      aMajor > bMajor ||
      (aMajor === bMajor && aMinor > bMinor) ||
      (aMajor === bMajor && aMinor === bMinor && aPatch > bPatch)
    ) {
      best = icon.addedIn;
    }
  }
  return best;
}

/** `NG` → `Nigeria`, falling back to the code when the region list has no entry. */
export function regionLabel(code: string): string {
  return regions.find((region) => region.code === code)?.label ?? code;
}

/** The prose description of a category, or an empty string when there is none. */
export function categoryDescription(id: string): string {
  return categories.find((category) => category.id === id)?.description ?? '';
}

/* ------------------------------------------------------------------ *
 * Category → page mapping
 * ------------------------------------------------------------------ */

export interface CategoryPageSpec {
  /** Stable key, used for the marker record and for tests. */
  key: string;
  /** The page title, without its number. */
  title: string;
  /** One line under the title. */
  blurb: string;
  /**
   * Metadata category ids folded onto this page, in the order their sections
   * appear. Nine metadata categories, six pages — the mapping is stated in the
   * README so nobody has to reverse-engineer it from here.
   */
  categoryIds: readonly string[];
}

export const CATEGORY_PAGE_SPECS: readonly CategoryPageSpec[] = [
  {
    key: 'identity-state',
    title: 'Identity & State',
    blurb: 'Flags, maps, documents and the marks a country uses to identify itself.',
    // Armed-forces insignia are marks the state makes about itself, so `defence`
    // sits here rather than getting a page of its own.
    categoryIds: ['identity-state', 'defence'],
  },
  {
    key: 'fashion-textiles',
    title: 'Fashion & Textiles',
    blurb: 'Cloth, garments, headwear and the crafts behind them.',
    categoryIds: ['fashion-textiles'],
  },
  {
    key: 'food-drink',
    title: 'Food & Drink',
    blurb: 'Dishes, ingredients, street food and the vessels they are served in.',
    categoryIds: ['food-drink'],
  },
  {
    key: 'music-art-play',
    title: 'Music, Art & Play',
    blurb: 'Instruments, games, film, ceremony and the making of things.',
    // `culture-people` is craft, regalia and ceremony — the same "things people
    // make and play with" idea, so it joins this page instead of splitting it.
    categoryIds: ['music-art-play', 'culture-people'],
  },
  {
    key: 'transport',
    title: 'Transport',
    blurb: 'How people and goods move — road, water and rail.',
    categoryIds: ['transport'],
  },
  {
    key: 'everyday-commerce',
    title: 'Everyday Life & Commerce',
    blurb: 'Money, markets, trade, and the buildings and places daily life happens in.',
    // `places-landmarks` is the built environment ordinary life takes place in,
    // which is nearer to commerce and everyday objects than to anything else.
    categoryIds: ['commerce-industry', 'places-landmarks'],
  },
];

/** A labelled run of icons inside a page. */
export interface Section {
  categoryId: string;
  label: string;
  description: string;
  icons: Icon[];
}

export type PageKind = 'start' | 'all' | 'category' | 'components' | 'names' | 'licence';

export interface PlannedPage {
  /** Page name including its number, e.g. `03 — Food & Drink`. */
  name: string;
  kind: PageKind;
  /** Populated for `category` pages only. */
  spec?: CategoryPageSpec;
  /** Populated for `category` and `all` pages. */
  sections?: Section[];
}

function iconsIn(categoryId: string, icons: readonly Icon[]): Icon[] {
  return icons.filter((icon) => icon.category === categoryId);
}

function sectionFor(categoryId: string, icons: readonly Icon[]): Section | null {
  const members = iconsIn(categoryId, icons);
  if (members.length === 0) return null;
  const known = PLUGIN_CATEGORIES.find((category) => category.id === categoryId);
  return {
    categoryId,
    label: known?.label ?? categoryId,
    description: categoryDescription(categoryId),
    icons: members,
  };
}

/**
 * Every populated category, in the order `categories.json` lists them.
 *
 * This is the order the `01 — All Icons` page and the first carousel slide use;
 * an empty category never appears, because `PLUGIN_CATEGORIES` is already
 * filtered to categories that contain a released icon.
 */
export function allIconSections(icons: readonly Icon[] = releasedIcons): Section[] {
  const sections: Section[] = [];
  for (const category of PLUGIN_CATEGORIES) {
    const section = sectionFor(category.id, icons);
    if (section) sections.push(section);
  }
  return sections;
}

/** Two-digit page number, so Figma sorts the pages the way they read. */
function numbered(index: number, title: string): string {
  return `${String(index).padStart(2, '0')} — ${title}`;
}

/**
 * The whole page list, numbered contiguously.
 *
 * A category page only exists when at least one released icon maps onto it, and
 * the numbers close up behind a category that is empty — so `08 — Components`
 * is only `08` while all six category pages are populated.
 */
export function planPages(icons: readonly Icon[] = releasedIcons): PlannedPage[] {
  const pages: PlannedPage[] = [];
  const push = (kind: PageKind, title: string, extra: Partial<PlannedPage> = {}): void => {
    pages.push({ name: numbered(pages.length, title), kind, ...extra });
  };

  push('start', 'Start Here');
  push('all', 'All Icons', { sections: allIconSections(icons) });

  for (const spec of CATEGORY_PAGE_SPECS) {
    const sections = spec.categoryIds
      .map((categoryId) => sectionFor(categoryId, icons))
      .filter((section): section is Section => section !== null);
    if (sections.length === 0) continue;
    push('category', spec.title, { spec, sections });
  }

  push('components', 'Components');
  push('names', 'Names & Cultural Notes');
  push('licence', 'Licence & Contributions');

  return pages;
}

/* ------------------------------------------------------------------ *
 * Cover
 * ------------------------------------------------------------------ */

/**
 * Icons the spec asks for on the cover, in its order.
 *
 * This is a preference, not a promise: any id that is not in this build is
 * skipped, and the row is topped up from the released set. The cover can
 * therefore never show an icon the file does not contain.
 */
const COVER_PREFERENCE = ['talking-drum', 'danfo', 'suya', 'naira-note', 'ludo', 'agogo'];

export function coverIcons(icons: readonly Icon[] = releasedIcons, max = 8): Icon[] {
  const byId = new Map(icons.map((icon) => [icon.id, icon]));
  const chosen: Icon[] = [];
  const take = (icon: Icon | undefined): void => {
    if (icon && chosen.length < max && !chosen.includes(icon)) chosen.push(icon);
  };

  for (const id of COVER_PREFERENCE) take(byId.get(id));
  for (const icon of icons) take(icon);
  return chosen;
}

/** Picks a specific icon when it exists, otherwise the first released one. */
export function preferredIcon(id: string, icons: readonly Icon[] = releasedIcons): Icon | null {
  return icons.find((icon) => icon.id === id) ?? icons[0] ?? null;
}

/**
 * A run of distinct icons for an illustrative UI fragment, preferring the ids
 * given and falling back to whatever else the build contains.
 */
export function fragmentIcons(
  prefer: readonly string[],
  count: number,
  exclude: readonly Icon[] = [],
  icons: readonly Icon[] = releasedIcons,
): Icon[] {
  const used = new Set(exclude.map((icon) => icon.id));
  const chosen: Icon[] = [];
  const take = (icon: Icon | undefined): void => {
    if (icon && chosen.length < count && !used.has(icon.id)) {
      used.add(icon.id);
      chosen.push(icon);
    }
  };

  for (const id of prefer) take(icons.find((icon) => icon.id === id));
  for (const icon of icons) take(icon);
  return chosen;
}
