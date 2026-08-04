import type { Metadata } from 'next';

import { RepositoryDocument } from '@/lib/markdown';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Drawing spec',
  description:
    'The 24-unit grid, stroke logic, geometry and content rules every African Icon Library glyph ' +
    'must obey — and the automated checks that enforce them.',
  alternates: { canonical: '/spec' },
};

export default function SpecPage() {
  return (
    <div className="section shell">
      <div className="prose" style={{ marginBottom: '1.5rem' }}>
        <p className="eyebrow">Drawing spec</p>
      </div>

      <RepositoryDocument
        file="docs/icon-spec.md"
        fallback="The drawing spec could not be read for this deployment."
      />

      <div className="prose" style={{ marginTop: '2rem' }}>
        <p className="muted">
          Canonical copy:{' '}
          <a href={`${SITE.repository}/blob/main/docs/icon-spec.md`} rel="noreferrer noopener">
            docs/icon-spec.md in the repository
          </a>
          .
        </p>
      </div>
    </div>
  );
}
