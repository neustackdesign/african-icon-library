import Link from 'next/link';

import { TalkingDrum } from '@african-icon-library/react';

import { LIBRARY, NAV, SITE, plural } from '@/lib/site';

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="shell site-header__inner">
        <Link className="brand" href="/">
          <TalkingDrum size={24} strokeWidth={1.8} />
          {SITE.name}
        </Link>

        <nav className="site-nav" aria-label="Primary">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
          <span className="version-badge" title={`${plural(LIBRARY.iconCount, 'released icon')}`}>
            v{LIBRARY.version} · {LIBRARY.iconCount} icons
          </span>
        </nav>
      </div>
    </header>
  );
}
