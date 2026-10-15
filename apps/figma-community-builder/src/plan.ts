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
import {
  MAP_BOUNDARY_POLICY,
  PLUGIN_MAPS,
  PLUGIN_MAP_BOXES,
  PLUGIN_MAP_REGIONS,
  PLUGIN_MAP_SVG,
} from '../../figma-plugin/src/generated/map-data';
import {
  WEIGHTS,
  categories,
  regions,
  type CountryMap,
  type Icon,
} from '@african-icon-library/metadata';

export { PLUGIN_CATEGORIES, PLUGIN_ICONS, PLUGIN_SVG, PLUGIN_WEIGHTS };
export { MAP_BOUNDARY_POLICY, PLUGIN_MAPS, PLUGIN_MAP_BOXES, PLUGIN_MAP_REGIONS, PLUGIN_MAP_SVG };

export const LIBRARY_NAME = 'African Icon Library';

/**
 * Every released icon, in stable id order.
 *
 * `PLUGIN_ICONS` is already sorted by the generator; the copy keeps callers from
 * reordering the shared array in place.
 */
export const releasedIcons: readonly Icon[] = [...PLUGIN_ICONS];

/**
 * Every released country map, in the master's regional order. Maps are a
 * second asset type, never an icon category: they get their own pages and
 * their own component namespace.
 */
export const releasedMaps: readonly CountryMap[] = [...PLUGIN_MAPS];

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
  // The public `WEIGHTS` constant is dependency-free, so it keeps zod (and its
  // absolute URLs, which build.ts forbids) out of the bundle.
  const drawn = new Set(PLUGIN_WEIGHTS);
  return WEIGHTS.filter((weight) => !drawn.has(weight));
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

/** Map components live under their own namespace, apart from the icons. */
export function mapComponentName(map: CountryMap): string {
  return `ail/maps/${map.id}`;
}

/** Map components are fitted so their longest side matches the icons' 24 px frame. */
export const MAP_COMPONENT_SIZE = 24;

/** Fits a map into a `size` box by its longest side, keeping its proportions. */
export function mapFrame(map: CountryMap, size: number): { width: number; height: number } {
  const [width, height] = PLUGIN_MAP_BOXES[map.id] ?? [size, size];
  const scale = size / Math.max(width, height);
  const round = (value: number) => Math.round(value * 100) / 100;
  return { width: round(width * scale), height: round(height * scale) };
}

/** A labelled run of maps: one AIL region. */
export interface MapSection {
  regionId: string;
  label: string;
  maps: CountryMap[];
}

/** Regions that contain a map, in AIL's order, each with its maps. */
export function mapSections(maps: readonly CountryMap[] = releasedMaps): MapSection[] {
  return PLUGIN_MAP_REGIONS.map((region) => ({
    regionId: region.id,
    label: region.label,
    maps: maps.filter((map) => map.region === region.id),
  })).filter((section) => section.maps.length > 0);
}

/**
 * Highest `addedIn` across the released icons and maps — the version this
 * file represents.
 */
export function libraryVersion(
  icons: readonly Icon[] = releasedIcons,
  maps: readonly { addedIn: string }[] = releasedMaps,
): string {
  const parse = (value: string): number[] => value.split('.').map((part) => Number(part) || 0);
  let best = '0.0.0';
  for (const icon of [...icons, ...maps]) {
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
  /** The group title on the Library page. */
  title: string;
  /** One line under the title. */
  blurb: string;
  /**
   * Metadata category ids folded into this group, in the order their sections
   * appear. Nine metadata categories, six groups — the mapping is stated in the
   * README so nobody has to reverse-engineer it from here.
   */
  categoryIds: readonly string[];
}

export const CATEGORY_PAGE_SPECS: readonly CategoryPageSpec[] = [
  {
    key: 'identity-state',
    title: 'Identity & State',
    blurb: 'Flags, documents and the marks a country uses to identify itself.',
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

/** A labelled run of icons inside a group. */
export interface Section {
  categoryId: string;
  label: string;
  description: string;
  icons: Icon[];
}

/**
 * The Community source file is on Figma's Free plan, which allows three pages.
 * The builder never creates more than this, and never leaves more than this
 * behind.
 */
export const MAX_PAGES = 3;

export type PageKind = 'library' | 'listing' | 'notes';

/**
 * One visual group of icons on the Library page — what used to be a page of
 * its own. Nine metadata categories fold into six groups; a group is still a
 * presentation choice, never a re-classification of the data.
 */
export interface IconGroup {
  key: string;
  title: string;
  blurb: string;
  sections: Section[];
}

export interface PlannedPage {
  /** Page name including its number, e.g. `01 — Library`. */
  name: string;
  kind: PageKind;
  /** Populated for the `library` page. */
  groups?: IconGroup[];
  /** Populated for the `library` page. */
  mapSections?: MapSection[];
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
 * This is the order the first carousel slide and the component sections use;
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

/**
 * The icon groups of the Library page, in `CATEGORY_PAGE_SPECS` order. A group
 * with no released icon is dropped. A populated category that no spec claims
 * still appears, as a group of its own at the end, so nothing released can be
 * missing from the page.
 */
export function iconGroups(icons: readonly Icon[] = releasedIcons): IconGroup[] {
  const groups: IconGroup[] = [];
  const claimed = new Set<string>();
  for (const spec of CATEGORY_PAGE_SPECS) {
    const sections = spec.categoryIds
      .map((categoryId) => sectionFor(categoryId, icons))
      .filter((section): section is Section => section !== null);
    spec.categoryIds.forEach((id) => claimed.add(id));
    if (sections.length > 0) {
      groups.push({ key: spec.key, title: spec.title, blurb: spec.blurb, sections });
    }
  }
  for (const section of allIconSections(icons)) {
    if (claimed.has(section.categoryId)) continue;
    groups.push({
      key: section.categoryId,
      title: section.label,
      blurb: section.description,
      sections: [section],
    });
  }
  return groups;
}

/** Two-digit page number, so Figma sorts the pages the way they read. */
function numbered(index: number, title: string): string {
  return `${String(index).padStart(2, '0')} — ${title}`;
}

/**
 * The page list: always exactly three pages, numbered 01 to 03.
 *
 *   01 — Library              intro, every icon by group, every map by region,
 *                             and the canonical icon and map components
 *   02 — Community Listing    Cover and the Community carousel frames
 *   03 — Notes & Publishing   spec guidance, names, map policy, licence,
 *                             contributions, source of truth, checklist
 */
export function planPages(
  icons: readonly Icon[] = releasedIcons,
  maps: readonly CountryMap[] = releasedMaps,
): PlannedPage[] {
  return [
    {
      name: numbered(1, 'Library'),
      kind: 'library',
      groups: iconGroups(icons),
      mapSections: mapSections(maps),
    },
    { name: numbered(2, 'Community Listing'), kind: 'listing' },
    { name: numbered(3, 'Notes & Publishing'), kind: 'notes' },
  ];
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
