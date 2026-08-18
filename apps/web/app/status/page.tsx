import type { Metadata } from 'next';
import Link from 'next/link';

import { LIBRARY, SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'V2 release',
  description: 'African Icon Library V2 release details and availability.',
  alternates: { canonical: '/status' },
};

export default function StatusPage() {
  return (
    <div className="section shell">
      <div className="prose">
        <p className="eyebrow">V2 release</p>
        <h1 style={{ fontSize: 'clamp(1.9rem, 1.4rem + 2.4vw, 2.75rem)' }}>
          The current library.
        </h1>
        <p className="lede">
          V2 contains {LIBRARY.iconCount} released icons across {LIBRARY.categoryCount} categories,
          drawn on a 24-pixel grid in the {LIBRARY.weightsShipped.join(', ')} weight.
        </p>

        <h2>Available now</h2>
        <ul>
          <li>Browse and copy SVGs on the website.</li>
          <li>Download the complete SVG bundle or individual category packs.</li>
          <li>Use or contribute to the open-source repository on GitHub.</li>
        </ul>

        <h2>Figma</h2>
        <p>
          The V2 Community file and plugin are part of the release rollout and use the same canonical
          icon set as the website and repository.
        </p>

        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
          <Link className="button" href="/downloads">
            Download V2
          </Link>
          <a className="button button--ghost" href={SITE.repository} rel="noreferrer noopener">
            View GitHub
          </a>
        </div>
      </div>
    </div>
  );
}
