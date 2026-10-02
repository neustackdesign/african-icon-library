import type { Metadata } from 'next';

import { CanonicalCopy, PageHead } from '@/components/PageHead';
import { RepositoryDocument } from '@/lib/markdown';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Changelog',
  description: 'Every release of the African Icon Library, what shipped in it, and what did not.',
  alternates: { canonical: '/changelog' },
};

export default function ChangelogPage() {
  return (
    <div className="page shell">
      <PageHead label="Changelog" />
      <RepositoryDocument
        file="CHANGELOG.md"
        fallback="The changelog could not be read for this deployment."
      />
      <CanonicalCopy
        href={`${SITE.repository}/blob/main/CHANGELOG.md`}
        label="CHANGELOG.md in the repository"
      />
    </div>
  );
}
