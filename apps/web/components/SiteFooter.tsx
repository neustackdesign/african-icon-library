import Link from 'next/link';
import type { CSSProperties } from 'react';

import { browserEntries, heroIconIds } from '@/lib/icons';
import { categoryColour } from '@/lib/brand';
import { LIBRARY, SITE } from '@/lib/site';

import { IconGlyph } from './IconGlyph';
import { TrackedLink } from './TrackedLink';

const COLUMNS = [
  {
    heading: 'Library',
    links: [
      { href: '/#browse', label: 'Browse icons' },
      { href: '/downloads', label: 'Downloads' },
      { href: '/spec', label: 'Drawing spec' },
    ],
  },
  {
    heading: 'Project',
    links: [
      { href: '/changelog', label: 'Releases' },
      { href: '/contributing', label: 'Contributing' },
      { href: '/licence', label: 'Licence' },
      { href: '/status', label: 'V2 release' },
    ],
  },
] as const;

export function SiteFooter() {
  const heroes = heroIconIds();

  return (
    <footer className="site-footer">
      {/* The released set as a band; each category's representative carries its colour. */}
      <div className="band" aria-hidden="true">
        {browserEntries().map(({ icon, body }) => {
          const hero = heroes.has(icon.id);
          return (
            <span
              key={icon.id}
              className="band__cell"
              data-hero={hero ? '' : undefined}
              style={
                hero ? ({ '--cat': categoryColour(icon.category) } as CSSProperties) : undefined
              }
            >
              <IconGlyph body={body} size={20} />
            </span>
          );
        })}
      </div>

      <div className="shell site-footer__inner">
        <div className="site-footer__grid">
          {COLUMNS.map((column) => (
            <nav className="site-footer__col" key={column.heading} aria-label={column.heading}>
              <h2>{column.heading}</h2>
              {column.links.map((link) => (
                <Link key={link.href} href={link.href}>
                  {link.label}
                </Link>
              ))}
            </nav>
          ))}

          <nav className="site-footer__col" aria-label="Source">
            <h2>Source</h2>
            <TrackedLink
              href={SITE.repository}
              rel="noreferrer noopener"
              event="github_click"
              surface="footer"
            >
              GitHub repository
            </TrackedLink>
            <a href={SITE.newIssue} rel="noreferrer noopener">
              Suggest an icon or report an issue
            </a>
            <a href={`mailto:${SITE.contact}`}>{SITE.contact}</a>
          </nav>
        </div>

        <p className="mono">
          {SITE.name} v{LIBRARY.version} · {LIBRARY.iconCount} icons · MIT licensed · maintained by{' '}
          {SITE.maintainer}.
        </p>
      </div>
    </footer>
  );
}
