import type { Metadata } from 'next';

import { CanonicalCopy, PageHead } from '@/components/PageHead';
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
    <div className="page shell">
      <PageHead label="Drawing spec" />
      <RepositoryDocument
        file="docs/icon-spec.md"
        fallback="The drawing spec could not be read for this deployment."
      />
      <CanonicalCopy
        href={`${SITE.repository}/blob/main/docs/icon-spec.md`}
        label="docs/icon-spec.md in the repository"
      />
    </div>
  );
}
