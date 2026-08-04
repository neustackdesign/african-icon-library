import { icons, pipeline } from '@african-icon-library/metadata';

/**
 * Every claim the site makes about size, weights or availability is derived
 * from the data, never typed by hand. If a number appears in copy, it comes
 * from here.
 */

export const SITE = {
  name: 'African Icon Library',
  shortName: 'African Icons',
  url: 'https://icons.neustackstudio.com',
  repository: 'https://github.com/neustackdesign/african-icon-library',
  issues: 'https://github.com/neustackdesign/african-icon-library/issues',
  maintainer: 'Neustack Design',
  contact: 'icons@neustackstudio.com',
  description:
    'Open-source icons for African life, drawn on one 24-pixel grid. Nigeria first, ' +
    'the continent next.',
  locale: 'en_NG',
} as const;

export const LIBRARY = {
  version: '0.1.0',
  iconCount: icons.length,
  categoryCount: new Set(icons.map((icon) => icon.category)).size,
  weightsShipped: pipeline.weightsShipped,
  weightsPlanned: pipeline.weightsPlanned,
  auditRecords: pipeline.auditRecords,
  drawingsIngested: pipeline.drawingsIngested,
  heldForCulturalReview: pipeline.heldForCulturalReview,
  heldForIconDesign: pipeline.heldForIconDesign,
  backlogConcepts: pipeline.backlogConcepts,
  mergedByAudit: pipeline.mergedByAudit,
  droppedByAudit: pipeline.droppedByAudit,
} as const;

export const DOWNLOADS = {
  icons: `/downloads/african-icon-library-icons-${LIBRARY.version}.zip`,
  metadata: `/downloads/african-icon-library-metadata-${LIBRARY.version}.json`,
  manifest: '/downloads/manifest.json',
} as const;

export const NAV = [
  { href: '/', label: 'Icons' },
  { href: '/spec', label: 'Spec' },
  { href: '/downloads', label: 'Downloads' },
  { href: '/status', label: 'Status' },
  { href: '/changelog', label: 'Changelog' },
] as const;

/** Grammatical helper so copy reads correctly when the set is tiny or large. */
export function plural(count: number, singular: string, pluralForm = `${singular}s`): string {
  return `${count} ${count === 1 ? singular : pluralForm}`;
}
