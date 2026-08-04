import Link from 'next/link';

import { LIBRARY } from '@/lib/site';

export default function NotFound() {
  return (
    <div className="section shell">
      <div className="prose">
        <p className="eyebrow">404</p>
        <h1 style={{ fontSize: 'clamp(1.9rem, 1.4rem + 2.4vw, 2.75rem)' }}>
          That page is not here.
        </h1>
        <p className="lede">
          If you were looking for an icon, the library ships {LIBRARY.iconCount} of them so far —
          the rest of the audited set is still being drawn.
        </p>
        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
          <Link className="button" href="/">
            Browse the icons
          </Link>
          <Link className="button button--ghost" href="/status">
            See what exists
          </Link>
        </div>
      </div>
    </div>
  );
}
