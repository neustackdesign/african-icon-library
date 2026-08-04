import type { Metadata } from 'next';

import { RepositoryDocument } from '@/lib/markdown';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Contributing',
  description:
    'How to propose, draw and submit an icon for the African Icon Library, including the checks ' +
    'every asset must pass and the cultural review process.',
  alternates: { canonical: '/contributing' },
};

export default function ContributingPage() {
  return (
    <div className="section shell">
      <div className="prose" style={{ marginBottom: '1.5rem' }}>
        <p className="eyebrow">Contributing</p>
      </div>

      <RepositoryDocument
        file="CONTRIBUTING.md"
        fallback="The contribution guide could not be read for this deployment."
      />

      <div className="prose" style={{ marginTop: '2rem' }}>
        <p className="muted">
          Canonical copy:{' '}
          <a href={`${SITE.repository}/blob/main/CONTRIBUTING.md`} rel="noreferrer noopener">
            CONTRIBUTING.md in the repository
          </a>
          .
        </p>
      </div>
    </div>
  );
}
