import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import {
  PATHS,
  listSvgAssets,
  loadAuditRecords,
  loadCategories,
  loadIcons,
} from '../scripts/lib/repo.ts';
import { buildPipelineSummary, pascalCase } from '../scripts/lib/generators.ts';
import {
  BASELINE_WEIGHT,
  checkMetadataConsistency,
  iconSchema,
  regionsSchema,
  releasedIconSchema,
} from '../packages/metadata/src/schema.ts';

const icons = await loadIcons();
const categories = await loadCategories();
const auditRecords = await loadAuditRecords();
const regions = regionsSchema.parse(
  JSON.parse(await readFile(path.join(PATHS.categories, '..', 'regions.json'), 'utf8')),
);

describe('metadata files', () => {
  it('parses against the schema', () => {
    expect(icons.length).toBeGreaterThan(0);
    for (const icon of icons) expect(() => releasedIconSchema.parse(icon)).not.toThrow();
  });

  it('has no cross-file inconsistencies', () => {
    expect(checkMetadataConsistency(icons, categories)).toEqual([]);
  });

  it('only ever contains released icons', () => {
    expect(icons.every((icon) => icon.status === 'released')).toBe(true);
  });

  it('never releases an icon with an outstanding cultural review', () => {
    for (const icon of icons) {
      if (icon.culturalReview.required) {
        expect(icon.culturalReview.status).toBe('approved');
      }
    }
  });

  it('never releases an icon whose referent the audit could not confirm', () => {
    expect(icons.every((icon) => icon.provenance.referentConfirmed)).toBe(true);
  });

  it('references only declared regions', () => {
    const codes = new Set(regions.map((region) => region.code));
    for (const icon of icons) {
      for (const region of icon.regions) expect(codes.has(region)).toBe(true);
    }
  });

  it('ships the baseline weight for every icon', () => {
    for (const icon of icons) expect(icon.weights).toContain(BASELINE_WEIGHT);
  });

  it('does not claim a weight the library has not drawn', () => {
    const shipped = new Set(icons.flatMap((icon) => icon.weights));
    expect([...shipped]).toEqual([BASELINE_WEIGHT]);
  });

  it('presents no unconfirmed local name as authoritative', () => {
    for (const icon of icons) {
      for (const localName of icon.localNames) {
        expect(['confirmed', 'pending']).toContain(localName.review);
      }
    }
  });

  it('rejects an icon id that is not kebab-case', () => {
    expect(() => iconSchema.parse({ ...icons[0], id: 'Talking Drum' })).toThrow();
  });
});

describe('audit provenance', () => {
  it('records every audited asset', () => {
    expect(auditRecords).toHaveLength(86);
  });

  it('matches every released icon back to its audit row', () => {
    const byId = new Map(auditRecords.map((record) => [record.proposedId, record]));
    for (const icon of icons) {
      const record = byId.get(icon.id);
      expect(record, `no audit record for ${icon.id}`).toBeDefined();
      expect(record?.disposition).toBe('released');
      expect(icon.provenance.auditSourceFile).toBe(record?.sourceFile);
      expect(icon.provenance.auditVerdict).toBe(record?.verdict);
      expect(icon.provenance.referentConfirmed).toBe(record?.referentConfirmed);
      expect(icon.category).toBe(record?.categoryId);
    }
  });

  it('gives every held drawing an actionable blocker and reason', () => {
    const held = auditRecords.filter((record) => record.disposition === 'held');
    expect(held.length).toBeGreaterThan(0);
    for (const record of held) {
      expect(record.hold?.blocker).toBeDefined();
      expect(record.hold?.reason.length ?? 0).toBeGreaterThan(20);
      expect(record.publicIconId).toBeNull();
    }
  });

  it('never publishes an icon id the audit left unconfirmed', () => {
    const unconfirmed = auditRecords.filter((record) => !record.referentConfirmed);
    expect(unconfirmed.length).toBeGreaterThan(0);
    for (const record of unconfirmed) expect(record.disposition).not.toBe('released');
  });

  it('agrees with the drawings on disk', async () => {
    const released = await listSvgAssets(PATHS.iconsSvgRoot);
    const staged = await listSvgAssets(PATHS.iconsStagingRoot);

    const releasedIds = new Set(released.map((asset) => asset.id));
    const stagedIds = new Set(staged.map((asset) => asset.id));

    for (const record of auditRecords) {
      if (record.disposition === 'released') expect(releasedIds.has(record.proposedId)).toBe(true);
      if (record.disposition === 'held') expect(stagedIds.has(record.proposedId)).toBe(true);
      if (record.disposition === 'backlog' || record.disposition === 'dropped') {
        expect(releasedIds.has(record.proposedId)).toBe(false);
      }
    }
  });
});

describe('pipeline summary', () => {
  const pipeline = buildPipelineSummary(auditRecords, icons);

  it('adds up to the full audit', () => {
    const total =
      pipeline.released +
      pipeline.heldForCulturalReview +
      pipeline.heldForIconDesign +
      pipeline.backlogConcepts +
      pipeline.mergedByAudit +
      pipeline.droppedByAudit;
    expect(total).toBe(pipeline.auditRecords);
  });

  it('counts the released icons that actually exist', () => {
    expect(pipeline.released).toBe(icons.length);
  });

  it('separates shipped weights from planned ones', () => {
    expect(pipeline.weightsShipped).toEqual([BASELINE_WEIGHT]);
    expect(pipeline.weightsShipped).not.toContain('bold');
    expect(pipeline.weightsPlanned).toContain('bold');
  });
});

describe('generated output', () => {
  it('exposes no held drawing through any generated surface', async () => {
    const heldIds = auditRecords
      .filter((record) => record.disposition === 'held')
      .map((record) => record.proposedId);
    expect(heldIds.length).toBeGreaterThan(0);

    const surfaces = await Promise.all(
      [
        PATHS.metadataGenerated,
        PATHS.iconsGenerated,
        PATHS.pluginGenerated,
        PATHS.reactGeneratedIndex,
      ].map((file) => readFile(file, 'utf8')),
    );

    for (const heldId of heldIds) {
      for (const source of surfaces) {
        expect(source).not.toContain(`"${heldId}"`);
        expect(source).not.toContain(pascalCase(heldId));
      }
    }
  });

  it('has one React component per released icon', async () => {
    const index = await readFile(PATHS.reactGeneratedIndex, 'utf8');
    for (const icon of icons) {
      expect(index).toContain(`export { ${pascalCase(icon.id)} }`);
    }
  });
});
