import { icons, pipeline } from '@african-icon-library/metadata';

/** Public release facts derived from the canonical library data. */
export const SITE = {
  name: 'African Icon Library',
  shortName: 'African Icons',
  url: 'https://icons.neustackstudio.com',
  repository: 'https://github.com/neustackdesign/african-icon-library',
  issues: 'https://github.com/neustackdesign/african-icon-library/issues',
  newIssue: 'https://github.com/neustackdesign/african-icon-library/issues/new/choose',
  maintainer: 'Neustack Design',
  contact: 'icons@neustackstudio.com',
  description:
    'A free, open-source SVG icon library for African everyday life — starting with Nigeria.',
  locale: 'en_NG',
} as const;

export const LIBRARY = {
  version: pipeline.version,
  iconCount: icons.length,
  categoryCount: new Set(icons.map((icon) => icon.category)).size,
  weightsShipped: pipeline.weightsShipped,
  // Keep this public contract for icon detail pages without exposing internal pipeline/backlog data.
  weightsPlanned: [] as const,
} as const;

export const DOWNLOADS = {
  icons: `/downloads/african-icon-library-icons-${LIBRARY.version}.zip`,
  metadata: `/downloads/african-icon-library-metadata-${LIBRARY.version}.json`,
  manifest: '/downloads/manifest.json',
} as const;

export const NAV = [
  { href: '/#browse', label: 'Icons' },
  { href: '/downloads', label: 'Downloads' },
  { href: '/spec', label: 'Spec' },
  { href: '/changelog', label: 'Releases' },
] as const;

/** Issue forms in `.github/ISSUE_TEMPLATE`, linked directly so each route lands on its form. */
export const ISSUE_FORMS = {
  iconProposal: `${SITE.repository}/issues/new?template=icon-proposal.yml`,
  localName: `${SITE.repository}/issues/new?template=local-name-contribution.yml`,
  culturalCorrection: `${SITE.repository}/issues/new?template=cultural-correction.yml`,
} as const;

/**
 * Figma Community publication state.
 *
 * The Community file is public. The conventional plugin has its permanent
 * Community URL but remains private while Figma review is in progress.
 */
export const FIGMA = {
  published: true,
  url: 'https://www.figma.com/community/file/1688005719745631513',
  pluginUrl: 'https://www.figma.com/community/plugin/1687997071772751842',
  pluginPublic: false,
} as const;

/** Grammatical helper so copy reads correctly when the set is tiny or large. */
export function plural(count: number, singular: string, pluralForm = `${singular}s`): string {
  return `${count} ${count === 1 ? singular : pluralForm}`;
}
