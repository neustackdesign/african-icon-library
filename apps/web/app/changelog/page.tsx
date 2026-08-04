import type { Metadata } from 'next';

import { RepositoryDocument } from '@/lib/markdown';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Changelog',
  description: 'Every release of the African Icon Library, what shipped in it, and what did not.',
  alternates: { canonical: '/changelog' },
};

export default function ChangelogPage() {
  return (
    <div className="section shell">
      <div className="prose" style={{ marginBottom: '1.5rem' }}>
        <p className="eyebrow">Changelog</p>
      </div>

      <RepositoryDocument
        file="CHANGELOG.md"
        fallback="The changelog could not be read for this deployment."
      />

      <div className="prose" style={{ marginTop: '2rem' }}>
        <p className="muted">
          Canonical copy:{' '}
          <a href={`${SITE.repository}/blob/main/CHANGELOG.md`} rel="noreferrer noopener">
            CHANGELOG.md in the repository
          </a>
          .
        </p>
      </div>
    </div>
  );
}
