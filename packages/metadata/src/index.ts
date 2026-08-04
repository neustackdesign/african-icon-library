/**
 * Canonical, typed metadata for the African Icon Library.
 *
 * This module exposes released icons only. Working records from the August 2026
 * v3 audit — verdicts, redraw notes, held drawings — live in
 * `src/data/audit-records.json`, are excluded from the published package, and
 * are never rendered in a public surface. See docs/metadata-schema.md.
 */

export type {
  AuditRecord,
  AuditVerdict,
  Category,
  CulturalReview,
  Icon,
  IconStatus,
  LocalName,
  MetadataConsistencyIssue,
  PipelineSummary,
  Tier,
  Weight,
} from './schema.js';

export {
  AUDIT_VERDICTS,
  BASELINE_WEIGHT,
  ICON_STATUSES,
  TIERS,
  WEIGHTS,
  auditFileSchema,
  auditRecordSchema,
  auditVerdictSchema,
  categoriesSchema,
  categorySchema,
  checkMetadataConsistency,
  culturalReviewSchema,
  iconIdSchema,
  iconSchema,
  iconStatusSchema,
  iconsSchema,
  localNameSchema,
  pipelineSummarySchema,
  regionSchema,
  releasedIconSchema,
  tierSchema,
  weightSchema,
} from './schema.js';

export type { SearchOptions, SearchResult } from './search.js';
export { searchIcons } from './search.js';

import type { Category, Icon } from './schema.js';
import { categories, icons, pipeline, regions } from './generated/data.js';

export { categories, icons, pipeline, regions };

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
