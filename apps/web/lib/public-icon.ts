import type { Category, Icon } from '@african-icon-library/metadata';

/**
 * The only icon fields a public page may see.
 *
 * Canonical metadata also carries internal maintenance records — `provenance`
 * (audit source filenames, audit verdicts, migration lineage) and
 * `culturalReview` (reviewer notes and workflow state). Those stay in the
 * repository and the published metadata package, but the website renders
 * and serialises only this projection, so they cannot reach a page, its RSC
 * payload or a client bundle. `tests/web-public-metadata.test.ts` holds the
 * line.
 */
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

export type PublicIcon = Pick<Icon, (typeof PUBLIC_ICON_FIELDS)[number]>;

export function toPublicIcon(icon: Icon): PublicIcon {
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
    status: icon.status,
    addedIn: icon.addedIn,
  };
}

/** A category as public pages see it; `auditKey` is an internal audit cross-reference. */
export type PublicCategory = Pick<Category, 'id' | 'label' | 'description'>;
