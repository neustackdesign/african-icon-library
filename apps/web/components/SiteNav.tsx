'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

import { NAV, SITE } from '@/lib/site';

import { TrackedLink } from './TrackedLink';

function isCurrent(pathname: string, href: string): boolean {
  const path = href.split('#')[0] || '/';
  if (path === '/') return pathname === '/' || pathname.startsWith('/icons/');
  return pathname === path || pathname.startsWith(`${path}/`);
}

/**
 * Primary navigation. Inline from 900px; below that it collapses into a
 * disclosure that works without JavaScript and closes itself on navigation.
 */
export function SiteNav({ badge }: { badge: string }) {
  const pathname = usePathname();
  const menu = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    if (menu.current) menu.current.open = false;
  }, [pathname]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || !menu.current?.open) return;
      menu.current.open = false;
      menu.current.querySelector('summary')?.focus();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const links = (surface: string) => (
    <>
      {NAV.map((item) => (
        <li key={item.href}>
          <Link href={item.href} aria-current={isCurrent(pathname, item.href) ? 'page' : undefined}>
            {item.label}
          </Link>
        </li>
      ))}
      <li>
        <TrackedLink
          href={SITE.repository}
          rel="noreferrer noopener"
          event="github_click"
          surface={surface}
        >
          GitHub
        </TrackedLink>
      </li>
    </>
  );

  return (
    <>
      <nav className="site-nav" aria-label="Primary">
        <ul className="site-nav__list">{links('header')}</ul>
      </nav>
      <span className="badge">{badge}</span>
      <details className="menu" ref={menu}>
        <summary>Menu</summary>
        <nav className="menu__panel" aria-label="Primary">
          <div className="shell">
            <ul>{links('header-menu')}</ul>
            <p className="menu__meta mono">{badge}</p>
          </div>
        </nav>
      </details>
    </>
  );
}
