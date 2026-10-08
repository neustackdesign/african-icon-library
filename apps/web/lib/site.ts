import { library } from '@african-icon-library/metadata';

import { NAV, REPOSITORY_URL } from './nav';

export { NAV };

/** Public release facts derived from the canonical library data. */
export const SITE = {
  name: 'African Icon Library',
  shortName: 'African Icons',
  url: 'https://icons.neustackstudio.com',
  repository: REPOSITORY_URL,
  issues: 'https://github.com/neustackdesign/african-icon-library/issues',
  newIssue: 'https://github.com/neustackdesign/african-icon-library/issues/new/choose',
  maintainer: 'Neustack Design',
  contact: 'icons@neustackstudio.com',
  description:
    'A free, open-source SVG icon library for African everyday life — starting with Nigeria — ' +
    `with outline maps of ${library.maps} African countries.`,
  locale: 'en_NG',
} as const;

export const LIBRARY = {
  version: library.version,
  iconCount: library.icons,
  categoryCount: library.categories,
  weightsShipped: library.weights,
  mapCount: library.maps,
  mapRegionCount: library.mapRegions,
  // Undrawn weights are not part of the public contract.
  weightsPlanned: [] as const,
} as const;

export const DOWNLOADS = {
  icons: `/downloads/african-icon-library-icons-${LIBRARY.version}.zip`,
  maps: `/downloads/african-icon-library-maps-${LIBRARY.version}.zip`,
  complete: `/downloads/african-icon-library-complete-${LIBRARY.version}.zip`,
  metadata: `/downloads/african-icon-library-metadata-${LIBRARY.version}.json`,
  manifest: '/downloads/manifest.json',
} as const;

/** Issue forms in `.github/ISSUE_TEMPLATE`, linked directly so each route lands on its form. */
export const ISSUE_FORMS = {
  iconProposal: `${SITE.repository}/issues/new?template=icon-proposal.yml`,
  localName: `${SITE.repository}/issues/new?template=local-name-contribution.yml`,
  culturalCorrection: `${SITE.repository}/issues/new?template=cultural-correction.yml`,
} as const;

/**
 * Figma Community publication state.
 *
 * The only place the site decides what to say about Figma. When the Community
 * file is live, set `published: true` and `url` to its Community link: the
 * distribution tree then links to it instead of showing the pending tag.
 */
export const FIGMA: { published: boolean; url: string | null } = {
  published: false,
  url: null,
};

/** Grammatical helper so copy reads correctly when the set is tiny or large. */
export function plural(count: number, singular: string, pluralForm = `${singular}s`): string {
  return `${count} ${count === 1 ? singular : pluralForm}`;
}
