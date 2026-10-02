import type { Metadata } from 'next';

import { CanonicalCopy, PageHead } from '@/components/PageHead';
import { readRepositoryFile } from '@/lib/markdown';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Licence',
  description:
    'The African Icon Library is MIT licensed — free for commercial use, with no attribution ' +
    'requirement. Read the full terms and the scope note.',
  alternates: { canonical: '/licence' },
};

export default function LicencePage() {
  return (
    <div className="page shell">
      <PageHead label="Licence" title="MIT.">
        Use the icons in commercial products. Modify them. Redistribute them. No attribution is
        required, though a link back is always welcome.
      </PageHead>
      <pre className="code-block code-block--wrap prose-width">
        <code>
          {readRepositoryFile('LICENSE') ?? 'The licence file is unavailable in this deployment.'}
        </code>
      </pre>
      <CanonicalCopy
        href={`${SITE.repository}/blob/main/LICENSE`}
        label="LICENSE in the repository"
      />
    </div>
  );
}
