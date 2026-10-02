import type { Metadata } from 'next';
import Link from 'next/link';

import { PageHead } from '@/components/PageHead';
import { FIGMA, LIBRARY, SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'V2 release',
  description: 'African Icon Library V2 release details and availability.',
  alternates: { canonical: '/status' },
};

export default function StatusPage() {
  return (
    <div className="page shell">
      <PageHead label="V2 release" title="The current library.">
        V2 contains {LIBRARY.iconCount} released icons across {LIBRARY.categoryCount} categories,
        drawn on a 24-pixel grid in the {LIBRARY.weightsShipped.join(', ')} weight.
      </PageHead>

      <div className="prose">
        <h2>Available now</h2>
        <ul>
          <li>Browse and copy SVGs on the website.</li>
          <li>Download the complete SVG bundle or individual category packs.</li>
          <li>Use or contribute to the open-source repository on GitHub.</li>
        </ul>

        <h2>Figma</h2>
        {FIGMA.published && FIGMA.url ? (
          <p>
            The V2 Community file uses the same canonical icon set as the website and repository.{' '}
            <a href={FIGMA.url} rel="noreferrer noopener">
              Open it in Figma
            </a>
            .
          </p>
        ) : (
          <p>
            The V2 Community file and plugin are generated from the same canonical icon set as the
            website and repository. Community publication is pending.
          </p>
        )}
      </div>

      <div className="actions page-actions">
        <Link className="btn btn--primary" href="/downloads">
          Download V2
        </Link>
        <a className="btn btn--secondary" href={SITE.repository} rel="noreferrer noopener">
          View GitHub
        </a>
      </div>
    </div>
  );
}
