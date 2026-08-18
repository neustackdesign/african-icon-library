import Link from 'next/link';

import { TrackedLink } from '@/components/TrackedLink';
import { LIBRARY, SITE } from '@/lib/site';

const COLUMNS = [
  {
    heading: 'Library',
    links: [
      { href: '/', label: 'Browse icons' },
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
    ],
  },
] as const;

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell">
        <div className="site-footer__grid">
          {COLUMNS.map((column) => (
            <div key={column.heading}>
              <h3>{column.heading}</h3>
              <ul>
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3>Source</h3>
            <ul>
              <li>
                <TrackedLink
                  href={SITE.repository}
                  rel="noreferrer noopener"
                  event="github_click"
                  surface="footer"
                >
                  GitHub repository
                </TrackedLink>
              </li>
              <li>
                <a href={SITE.issues} rel="noreferrer noopener">
                  Suggest an icon or report an issue
                </a>
              </li>
              <li>
                <a href={`mailto:${SITE.contact}`}>{SITE.contact}</a>
              </li>
            </ul>
          </div>
        </div>

        <hr style={{ margin: '1.75rem 0 1.25rem' }} />

        <p className="mono">
          {SITE.name} v{LIBRARY.version} · {LIBRARY.iconCount} icons · MIT licensed · maintained by{' '}
          {SITE.maintainer}.
        </p>
      </div>
    </footer>
  );
}
