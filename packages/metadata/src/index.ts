/**
 * Public metadata for the African Icon Library.
 *
 * Everything this package exports follows the public contract in
 * `./public.ts`: released icons, categories, regions, country maps, AIL map
 * regions and a release summary. Internal maintenance records (audit
 * provenance, reviewer notes, audit cross-references, pipeline counts) live
 * only in the repository and are not part of this package. See
 * docs/metadata-schema.md.
 *
 * Search is also available on its own, without loading any records, as
 * `@african-icon-library/metadata/search`.
 */

export type {
  Category,
  CountryMap,
  Icon,
  LibrarySummary,
  LocalName,
  MapRegion,
  MapStatus,
  Region,
  Tier,
  Weight,
} from './public.js';
export {
  BASELINE_WEIGHT,
  MAP_STATUSES,
  PUBLIC_CATEGORY_FIELDS,
  PUBLIC_ICON_FIELDS,
  TIERS,
  WEIGHTS,
} from './public.js';

export type {
  MapSearchOptions,
  MapSearchResult,
  SearchableIcon,
  SearchableMap,
  SearchOptions,
  SearchResult,
} from './search.js';
export { searchIcons, searchMaps } from './search.js';

import type { Category, CountryMap, Icon, MapRegion } from './public.js';
import { categories, icons, library, mapRegions, maps, regions } from './generated/data.js';

export { categories, icons, library, mapRegions, maps, regions };

const mapsById = new Map<string, CountryMap>(maps.map((map) => [map.id, map]));
const mapRegionsById = new Map<string, MapRegion>(mapRegions.map((region) => [region.id, region]));

/** Returns the country map with this id, or `undefined`. */
export function getMap(id: string): CountryMap | undefined {
  return mapsById.get(id);
}

/** Returns an AIL map region by id, or `undefined`. */
export function getMapRegion(id: string): MapRegion | undefined {
  return mapRegionsById.get(id);
}

/** `{ 'west-africa': 'West Africa', … }`, for search and labels. */
export function mapRegionLabels(): Record<string, string> {
  return Object.fromEntries(mapRegions.map((region) => [region.id, region.label]));
}

const iconsById = new Map<string, Icon>(icons.map((icon) => [icon.id, icon]));
const categoriesById = new Map<string, Category>(
  categories.map((category) => [category.id, category]),
);

/** Returns the released icon with this id, or `undefined`. */
export function getIcon(id: string): Icon | undefined {
  return iconsById.get(id);
}

/** Returns the category with this id, or `undefined`. */
export function getCategory(id: string): Category | undefined {
  return categoriesById.get(id);
}

/** Released icons in a category, in stable id order. */
export function getIconsByCategory(categoryId: string): Icon[] {
  return icons.filter((icon) => icon.category === categoryId);
}

/** Categories that actually contain at least one released icon. */
export function getPopulatedCategories(): Array<Category & { count: number }> {
  return categories
    .map((category) => ({
      ...category,
      count: icons.filter((icon) => icon.category === category.id).length,
    }))
    .filter((category) => category.count > 0);
}

/** Local names a speaker of the language has confirmed. Pending names are withheld. */
export function getConfirmedLocalNames(icon: Icon): Icon['localNames'] {
  return icon.localNames.filter((localName) => localName.review === 'confirmed');
}
