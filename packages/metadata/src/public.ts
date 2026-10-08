/**
 * The public metadata contract.
 *
 * Every public distribution surface — this package's root, the website, the
 * Figma plugin, the release ZIPs and the standalone metadata JSON — carries
 * exactly these shapes. The canonical records in `src/data/` hold more:
 * audit provenance, reviewer notes, audit cross-reference keys and pipeline
 * telemetry. Those are maintenance data. They stay in the repository for
 * validation and audit traceability, are read by repository tooling through
 * `src/schema.ts`, and never leave it.
 *
 * This module has no runtime dependencies and holds no data.
 */

export const WEIGHTS = ['thin', 'regular', 'bold', 'fill'] as const;
export type Weight = (typeof WEIGHTS)[number];

/** The weight every released icon ships. */
export const BASELINE_WEIGHT: Weight = 'regular';

export const TIERS = ['icon', 'illustration'] as const;
export type Tier = (typeof TIERS)[number];

/** A name in a local language, with whether a speaker of it has confirmed it. */
export interface LocalName {
  /** ISO 639 code. */
  language: string;
  value: string;
  review: 'confirmed' | 'pending';
}

/** A released icon. */
export interface Icon {
  id: string;
  /** Display name in English. */
  name: string;
  /** One line describing what the glyph depicts. */
  description: string;
  category: string;
  tier: Tier;
  /** ISO 3166-1 alpha-2 codes. */
  regions: readonly string[];
  /** Weights that exist as drawn assets. */
  weights: readonly Weight[];
  /** Plain-English search terms. */
  keywords: readonly string[];
  localNames: readonly LocalName[];
  status: 'released';
  /** Library version in which the icon first shipped. */
  addedIn: string;
}

export interface Category {
  id: string;
  label: string;
  description: string;
}

export interface Region {
  /** ISO 3166-1 alpha-2 code. */
  code: string;
  label: string;
}

export const MAP_STATUSES = ['released'] as const;
export type MapStatus = (typeof MAP_STATUSES)[number];

/** A country map. Maps are a separate asset type, not an icon category. */
export interface CountryMap {
  id: string;
  name: string;
  officialName?: string;
  iso2: string;
  iso3: string;
  /** An AIL map region id. */
  region: string;
  aliases: readonly string[];
  keywords: readonly string[];
  status: MapStatus;
  addedIn: string;
}

/** AIL's regional grouping for browsing maps — not a political classification. */
export interface MapRegion {
  id: string;
  label: string;
}

/** Public facts about the release. Counts of what ships, nothing about how it was made. */
export interface LibrarySummary {
  version: string;
  icons: number;
  /** Categories that contain at least one released icon. */
  categories: number;
  maps: number;
  mapRegions: number;
  /** Weights that are actually drawn. */
  weights: readonly Weight[];
}

/** The exact keys of each public shape, in output order. */
export const PUBLIC_ICON_FIELDS = [
  'id',
  'name',
  'description',
  'category',
  'tier',
  'regions',
  'weights',
  'keywords',
  'localNames',
  'status',
  'addedIn',
] as const satisfies readonly (keyof Icon)[];

export const PUBLIC_CATEGORY_FIELDS = [
  'id',
  'label',
  'description',
] as const satisfies readonly (keyof Category)[];

/** Any record carrying at least the public icon fields, such as a full canonical record. */
export type IconSource = Omit<Icon, 'status'> & { status: string };

/**
 * Projects a record to exactly the public icon shape. Unknown keys are
 * dropped, never copied, and an unreleased record is refused outright.
 */
export function toPublicIcon(icon: IconSource): Icon {
  if (icon.status !== 'released') {
    throw new Error(`"${icon.id}" is ${icon.status}; only released icons are public`);
  }
  return {
    id: icon.id,
    name: icon.name,
    description: icon.description,
    category: icon.category,
    tier: icon.tier,
    regions: [...icon.regions],
    weights: [...icon.weights],
    keywords: [...icon.keywords],
    localNames: icon.localNames.map(({ language, value, review }) => ({ language, value, review })),
    status: 'released',
    addedIn: icon.addedIn,
  };
}

export function toPublicCategory(category: Category): Category {
  return { id: category.id, label: category.label, description: category.description };
}

export function toPublicRegion(region: Region): Region {
  return { code: region.code, label: region.label };
}
