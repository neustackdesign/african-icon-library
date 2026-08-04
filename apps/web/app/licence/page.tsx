import type { Metadata } from 'next';

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
    <div className="section shell">
      <div className="prose" style={{ marginBottom: '2rem' }}>
        <p className="eyebrow">Licence</p>
        <h1 style={{ fontSize: 'clamp(1.9rem, 1.4rem + 2.4vw, 2.75rem)' }}>MIT.</h1>
        <p className="lede">
          Use the icons in commercial products. Modify them. Redistribute them. No attribution is
          required, though a link back is always welcome.
        </p>
      </div>

      <div className="prose">
        <pre className="code-block" style={{ whiteSpace: 'pre-wrap' }}>
          <code>
            {readRepositoryFile('LICENSE') ?? 'The licence file is unavailable in this deployment.'}
          </code>
        </pre>
      </div>

      <div className="prose" style={{ marginTop: '2rem' }}>
        <p className="muted">
          Canonical copy:{' '}
          <a href={`${SITE.repository}/blob/main/LICENSE`} rel="noreferrer noopener">
            LICENSE in the repository
          </a>
          .
        </p>
      </div>
    </div>
  );
}
