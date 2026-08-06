import { z } from 'zod';

/* ------------------------------------------------------------------ *
 * Primitives
 * ------------------------------------------------------------------ */

/** Every public identifier is lower-case kebab-case, no suffixes, no numbers-only segments. */
export const iconIdSchema = z
  .string()
  .regex(/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/, 'icon ids must be lower-case kebab-case');

/** ISO 3166-1 alpha-2. The library is Africa-wide by design; Nigeria is simply the first region. */
export const regionSchema = z
  .string()
  .regex(/^[A-Z]{2}$/, 'regions must be ISO 3166-1 alpha-2 codes');

/**
 * Weights the drawing system defines. A weight only appears in an icon's
 * `weights` array when a real, separately drawn asset exists for it — a weight
 * is never synthesised by changing `stroke-width` on another weight.
 */
export const WEIGHTS = ['thin', 'regular', 'bold', 'fill'] as const;
export const weightSchema = z.enum(WEIGHTS);
export type Weight = z.infer<typeof weightSchema>;

/** The weight every released icon must ship. */
export const BASELINE_WEIGHT: Weight = 'regular';

export const TIERS = ['icon', 'illustration'] as const;
export const tierSchema = z.enum(TIERS);
export type Tier = z.infer<typeof tierSchema>;

/**
 * Lifecycle of a concept in the library.
 *
 * - `released`              shipped, public, covered by the guarantees in README
 * - `held-cultural-review`  drawn, but a naming or cultural question blocks release
 * - `held-icon-design`      drawn, but the drawing does not meet the icon spec yet
 * - `backlog`               audited concept with no v3 drawing yet
 * - `dropped`               the audit cut the concept
 */
export const ICON_STATUSES = [
  'released',
  'held-cultural-review',
  'held-icon-design',
  'backlog',
  'dropped',
] as const;
export const iconStatusSchema = z.enum(ICON_STATUSES);
export type IconStatus = z.infer<typeof iconStatusSchema>;

/** Verdicts recorded by the August 2026 v3 audit, preserved verbatim. */
export const AUDIT_VERDICTS = [
  'keep',
  'redraw',
  'demote',
  'generic',
  'merge',
  'rework',
  'cut',
] as const;
export const auditVerdictSchema = z.enum(AUDIT_VERDICTS);
export type AuditVerdict = z.infer<typeof auditVerdictSchema>;

/**
 * A name for the concept in a Nigerian/African language.
 *
 * `review` is deliberately part of the data: a name that has not been confirmed
 * by a speaker of the language is never presented as authoritative. The website
 * only renders `confirmed` entries.
 */
export const localNameSchema = z.object({
  language: z.string().regex(/^[a-z]{2,3}$/, 'language must be an ISO 639 code'),
  value: z.string().min(1),
  review: z.enum(['confirmed', 'pending']),
});
export type LocalName = z.infer<typeof localNameSchema>;

export const culturalReviewSchema = z.object({
  required: z.boolean(),
  status: z.enum(['not-required', 'pending', 'approved']),
  /** Free text for reviewers. Present on the internal record, never a public claim. */
  note: z.string().optional(),
});
export type CulturalReview = z.infer<typeof culturalReviewSchema>;

/* ------------------------------------------------------------------ *
 * Categories
 * ------------------------------------------------------------------ */

export const categorySchema = z.object({
  id: iconIdSchema,
  label: z.string().min(1),
  description: z.string().min(1),
  /** Short key used by the v3 audit, kept so audit rows stay traceable. */
  auditKey: z.string().min(1),
});
export type Category = z.infer<typeof categorySchema>;

export const categoriesSchema = z.array(categorySchema).min(1);

/* ------------------------------------------------------------------ *
 * Regions
 * ------------------------------------------------------------------ */

export const regionEntrySchema = z.object({
  code: regionSchema,
  label: z.string().min(1),
  note: z.string().optional(),
});
export type Region = z.infer<typeof regionEntrySchema>;

export const regionsSchema = z.array(regionEntrySchema).min(1);

/* ------------------------------------------------------------------ *
 * Provenance
 * ------------------------------------------------------------------ */

/**
 * Where an icon came from. Three genuinely different histories, kept apart
 * because collapsing them would make a false claim about any of them.
 *
 * `v3-audit-drawing` — descends from one of the eighteen vector drawings the
 * August 2026 audit produced. Carries that audit row's file and verdict.
 * `v2-asset-redrawn` — the audit reviewed a v2 raster asset and issued a
 * verdict, but produced no vector. The released asset is a fresh drawing of
 * that concept to the v3 spec. Carries the audit row it answers.
 * `v3-audit-roadmap` — a concept the audit's expansion roadmap named as a gap
 * and never drew at all. There is no prior asset, so there is no source file.
 */
export const provenanceSchema = z
  .object({
    source: z.enum(['v3-audit-drawing', 'v2-asset-redrawn', 'v3-audit-roadmap']),
    /** Present for `v3-audit-drawing` and `v2-asset-redrawn`. */
    auditSourceFile: z.string().min(1).optional(),
    auditVerdict: auditVerdictSchema.optional(),
    /** Present only for `v3-audit-roadmap`: the roadmap entry that named the gap. */
    roadmapEntry: z.string().min(1).optional(),
    referentConfirmed: z.boolean(),
    /**
     * True when the released asset was drawn after ingestion and supersedes the
     * v3 drawing. The ingest script must not overwrite these.
     */
    redrawnSinceIngest: z.boolean().default(false),
  })
  .refine(
    (value) =>
      value.source === 'v3-audit-roadmap'
        ? Boolean(value.roadmapEntry)
        : Boolean(value.auditSourceFile && value.auditVerdict),
    { message: 'provenance must carry the fields its source implies' },
  );
export type Provenance = z.infer<typeof provenanceSchema>;

/* ------------------------------------------------------------------ *
 * Icons
 * ------------------------------------------------------------------ */

export const iconSchema = z.object({
  id: iconIdSchema,
  /** Display name in English. */
  name: z.string().min(1),
  /** One-line description of what the glyph depicts. */
  description: z.string().min(1),
  category: iconIdSchema,
  tier: tierSchema,
  regions: z.array(regionSchema).min(1),
  /** Weights that exist as drawn assets. Validated against the file system. */
  weights: z.array(weightSchema).min(1),
  /** Search aliases. Plain English search terms, not cultural assertions. */
  keywords: z.array(z.string().min(1)).default([]),
  localNames: z.array(localNameSchema).default([]),
  status: iconStatusSchema,
  /** Library version in which the icon first shipped. */
  addedIn: z.string().regex(/^\d+\.\d+\.\d+$/, 'addedIn must be a semver version'),
  culturalReview: culturalReviewSchema,
  /** Where the concept and the drawing came from. See docs/audit-provenance.md. */
  provenance: provenanceSchema,
});
export type Icon = z.infer<typeof iconSchema>;

/** Public metadata only ever contains released icons. Enforced here, not by convention. */
export const releasedIconSchema = iconSchema.extend({
  status: z.literal('released'),
  culturalReview: culturalReviewSchema.refine(
    (review) => !review.required || review.status === 'approved',
    { message: 'a released icon cannot have an outstanding cultural review' },
  ),
});

export const iconsSchema = z.array(releasedIconSchema);

/* ------------------------------------------------------------------ *
 * Internal audit record
 * ------------------------------------------------------------------ */

export const auditRecordSchema = z.object({
  sourceFile: z.string().min(1),
  proposedId: iconIdSchema,
  referentConfirmed: z.boolean(),
  categoryId: iconIdSchema,
  auditTier: z.enum(['icon', 'illustration', 'removed']),
  verdict: auditVerdictSchema,
  note: z.string().min(1),
  disposition: z.enum(['released', 'held', 'backlog', 'merged', 'dropped']),
  publicIconId: iconIdSchema.nullable(),
  /** Present only on held drawings: why the drawing exists but cannot ship. */
  hold: z
    .object({
      blocker: z.enum(['cultural-review', 'icon-design']),
      reason: z.string().min(1),
    })
    .optional(),
});
export type AuditRecord = z.infer<typeof auditRecordSchema>;

export const auditFileSchema = z.object({
  $comment: z.string(),
  source: z.string(),
  auditedAt: z.string(),
  records: z.array(auditRecordSchema).min(1),
});

/* ------------------------------------------------------------------ *
 * Pipeline summary (aggregate only — no premature names, no held drawings)
 * ------------------------------------------------------------------ */

export const pipelineSummarySchema = z.object({
  /**
   * The release this data describes, taken from the repository version at
   * generation time. Download filenames are built from it, so a hand-typed copy
   * anywhere else is a broken link waiting to happen — which is exactly what it
   * was before this field existed.
   */
  version: z.string().regex(/^\d+\.\d+\.\d+$/),
  auditRecords: z.number().int().nonnegative(),
  drawingsIngested: z.number().int().nonnegative(),
  /** Icons released, counted from the released set — not from audit dispositions. */
  released: z.number().int().nonnegative(),
  /** Released icons that descend from a drawing the audit produced. */
  releasedFromAuditDrawings: z.number().int().nonnegative(),
  /** Released icons drawn for this release from a roadmap gap the audit named. */
  releasedFromRoadmap: z.number().int().nonnegative(),
  heldForCulturalReview: z.number().int().nonnegative(),
  heldForIconDesign: z.number().int().nonnegative(),
  backlogConcepts: z.number().int().nonnegative(),
  mergedByAudit: z.number().int().nonnegative(),
  droppedByAudit: z.number().int().nonnegative(),
  weightsShipped: z.array(weightSchema),
  weightsPlanned: z.array(weightSchema),
});
export type PipelineSummary = z.infer<typeof pipelineSummarySchema>;

/* ------------------------------------------------------------------ *
 * Cross-file invariants
 * ------------------------------------------------------------------ */

export interface MetadataConsistencyIssue {
  code: string;
  message: string;
}

/**
 * Checks the invariants a single-object schema cannot express: unique ids,
 * category references that resolve, and a baseline weight on every icon.
 */
export function checkMetadataConsistency(
  icons: readonly Icon[],
  categories: readonly Category[],
): MetadataConsistencyIssue[] {
  const issues: MetadataConsistencyIssue[] = [];

  const seenIconIds = new Set<string>();
  for (const icon of icons) {
    if (seenIconIds.has(icon.id)) {
      issues.push({ code: 'duplicate-icon-id', message: `duplicate icon id "${icon.id}"` });
    }
    seenIconIds.add(icon.id);
  }

  const seenCategoryIds = new Set<string>();
  for (const category of categories) {
    if (seenCategoryIds.has(category.id)) {
      issues.push({
        code: 'duplicate-category-id',
        message: `duplicate category id "${category.id}"`,
      });
    }
    seenCategoryIds.add(category.id);
  }

  for (const icon of icons) {
    if (!seenCategoryIds.has(icon.category)) {
      issues.push({
        code: 'unknown-category',
        message: `icon "${icon.id}" references unknown category "${icon.category}"`,
      });
    }
    if (!icon.weights.includes(BASELINE_WEIGHT)) {
      issues.push({
        code: 'missing-baseline-weight',
        message: `icon "${icon.id}" does not ship the "${BASELINE_WEIGHT}" weight`,
      });
    }
    if (new Set(icon.weights).size !== icon.weights.length) {
      issues.push({
        code: 'duplicate-weight',
        message: `icon "${icon.id}" lists the same weight more than once`,
      });
    }
  }

  return issues;
}
