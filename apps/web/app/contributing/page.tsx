import type { Metadata } from 'next';

import { CanonicalCopy, PageHead } from '@/components/PageHead';
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
    <div className="page shell">
      <PageHead label="Contributing" />
      <RepositoryDocument
        file="CONTRIBUTING.md"
        fallback="The contribution guide could not be read for this deployment."
      />
      <CanonicalCopy
        href={`${SITE.repository}/blob/main/CONTRIBUTING.md`}
        label="CONTRIBUTING.md in the repository"
      />
    </div>
  );
}
