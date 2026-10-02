import Link from 'next/link';

import { LIBRARY, SITE } from '@/lib/site';

import { Icon } from './Icon';
import { SiteNav } from './SiteNav';

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="shell site-header__inner">
        <Link className="brand" href="/">
          <Icon id="talking-drum" size={22} />
          <span>{SITE.name}</span>
        </Link>
        <SiteNav badge={`v${LIBRARY.version} · ${LIBRARY.iconCount} icons`} />
      </div>
    </header>
  );
}
