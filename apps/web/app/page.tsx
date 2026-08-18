import type { Metadata } from 'next';
import Link from 'next/link';

import { IconBrowser } from '@/components/IconBrowser';
import { browserEntries, populatedCategories } from '@/lib/icons';
import { DOWNLOADS, LIBRARY, SITE, plural } from '@/lib/site';

export const metadata: Metadata = {
  title: `${SITE.name} — icons for African everyday life`,
  description: SITE.description,
  alternates: { canonical: '/' },
};

export default function HomePage() {
  const entries = browserEntries();
  const categories = populatedCategories();

  return (
    <>
      <section className="section shell">
        <div className="stack" style={{ gap: '1.5rem', maxWidth: '50rem' }}>
          <p className="eyebrow">African Icon Library · V2 · Open source</p>
          <h1>Icons for the things African products actually need.</h1>
          <p className="lede">
            A free SVG icon library for African everyday life — starting with Nigeria. Built on a
            consistent 24-pixel system for product interfaces, brand systems, presentations and
            whatever you are making next.
          </p>

          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
            <a className="button" href="#browse">
              Browse the icons
            </a>
            <a className="button button--ghost" href={DOWNLOADS.icons} download>
              Download all SVGs
            </a>
            <a className="button button--ghost" href={SITE.repository} rel="noreferrer noopener">
              View on GitHub
            </a>
          </div>

          <div className="stats">
            <div className="stat">
              <div className="stat__value">{LIBRARY.iconCount}</div>
              <div className="stat__label">icons in V2</div>
            </div>
            <div className="stat">
              <div className="stat__value">{LIBRARY.categoryCount}</div>
              <div className="stat__label">categories</div>
            </div>
            <div className="stat">
              <div className="stat__value">24px</div>
              <div className="stat__label">base grid</div>
            </div>
            <div className="stat">
              <div className="stat__value">MIT</div>
              <div className="stat__label">open-source licence</div>
            </div>
          </div>
        </div>

        <div className="proof-strip" aria-hidden="true">
          {entries.map((entry) => (
            <svg
              key={entry.icon.id}
              width={36}
              height={36}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              focusable="false"
              dangerouslySetInnerHTML={{ __html: entry.body }}
            />
          ))}
        </div>
      </section>

      <section className="section section--sunken" id="browse">
        <div className="shell">
          <div className="stack" style={{ gap: '0.5rem', marginBottom: '1.5rem' }}>
            <p className="eyebrow">Browse</p>
            <h2>{plural(LIBRARY.iconCount, 'icon')}, ready to use.</h2>
            <p className="lede">
              Search by name or category, then copy the SVG directly. Every icon uses
              <code> currentColor</code>, so it inherits your interface colour without extra edits.
            </p>
          </div>

          <IconBrowser
            entries={entries}
            categories={categories}
            weightsShipped={LIBRARY.weightsShipped}
            weightsPlanned={[]}
          />
        </div>
      </section>

      <section className="section shell">
        <div className="stack" style={{ gap: '1rem', marginBottom: '1.5rem' }}>
          <p className="eyebrow">Use the library</p>
          <h2>Web, Figma or source.</h2>
          <p className="lede">
            V2 is designed as one library with multiple ways in. The same released icon set powers
            the website downloads, repository and Figma tooling.
          </p>
        </div>

        <div className="card-grid">
          <div className="card">
            <h3>Download the SVGs</h3>
            <p className="muted">
              Get every released SVG in one zip, or download smaller category packs. Metadata and
              checksums are available alongside the assets.
            </p>
            <p>
              <Link href="/downloads">Open downloads →</Link>
            </p>
          </div>

          <div className="card">
            <h3>Use it in Figma</h3>
            <p className="muted">
              The V2 Community file and Figma plugin use the same canonical icon set. Community
              publication is part of this release rollout.
            </p>
          </div>

          <div className="card">
            <h3>Build with the source</h3>
            <p className="muted">
              The repository contains the SVG source, metadata, validation rules and build tooling
              behind the library.
            </p>
            <p>
              <a href={SITE.repository} rel="noreferrer noopener">
                Open GitHub →
              </a>
            </p>
          </div>
        </div>
      </section>

      <section className="section section--sunken">
        <div className="shell prose">
          <p className="eyebrow">V2</p>
          <h2>A smaller, stronger system.</h2>
          <p>
            V2 rebuilds the library around a consistent 24-pixel icon system rather than treating
            every older asset as automatically release-ready. The first release focuses on a clean,
            reusable core across food, transport, culture, commerce, identity, fashion and play.
          </p>
          <p>
            The regular weight is the released baseline. New icons and additional weights will be
            added only when they meet the same drawing and metadata standard.
          </p>
          <p>
            <Link href="/spec">Read the icon specification →</Link>
          </p>
        </div>
      </section>

      <section className="section shell">
        <div className="prose">
          <p className="eyebrow">Open source</p>
          <h2>Use it. Adapt it. Help it grow.</h2>
          <p>
            The library is MIT licensed. If something important to African everyday life is missing,
            open an issue or contribute through the repository. Cultural specificity matters: names,
            references and symbols should be grounded rather than guessed.
          </p>
          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
            <a className="button" href={DOWNLOADS.icons} download>
              Download all SVGs
            </a>
            <a className="button button--ghost" href={SITE.issues} rel="noreferrer noopener">
              Suggest an icon
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
