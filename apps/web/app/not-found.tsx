import Link from 'next/link';

import { PageHead } from '@/components/PageHead';
import { LIBRARY } from '@/lib/site';

export default function NotFound() {
  return (
    <div className="page shell">
      <PageHead label="404" title="That page is not here.">
        If you were looking for an icon, the library ships {LIBRARY.iconCount} of them so far — the
        rest of the audited set is still being drawn.
      </PageHead>
      <div className="actions">
        <Link className="btn btn--primary" href="/#browse">
          Browse the icons
        </Link>
        <Link className="btn btn--secondary" href="/status">
          See what exists
        </Link>
      </div>
    </div>
  );
}
