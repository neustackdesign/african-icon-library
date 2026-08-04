import type { Metadata } from 'next';
import Link from 'next/link';

import { pipeline } from '@african-icon-library/metadata';

import { IconBrowser } from '@/components/IconBrowser';
import { browserEntries, populatedCategories } from '@/lib/icons';
import { DOWNLOADS, LIBRARY, SITE, plural } from '@/lib/site';

export const metadata: Metadata = {
  title: `${SITE.name} — icons for African life`,
  description: SITE.description,
  alternates: { canonical: '/' },
};

export default function HomePage() {
  const entries = browserEntries();
  const categories = populatedCategories();

  return (
    <>
      <section className="section shell">
        <div className="stack" style={{ gap: '1.5rem', maxWidth: '48rem' }}>
          <p className="eyebrow">Open source · MIT</p>
          <h1>The icons global libraries never drew.</h1>
          <p className="lede">
            A danfo, a suya skewer, a talking drum, a naira note — drawn on one strict 24-pixel grid
            and released only when they pass every check. Nigeria first; the continent is the
            roadmap.
          </p>

          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
            <a className="button" href="#browse">
              Browse the set
            </a>
            <Link className="button button--ghost" href="/downloads">
              Download
            </Link>
          </div>

          <div className="stats">
            <div className="stat">
              <div className="stat__value">{LIBRARY.iconCount}</div>
              <div className="stat__label">icons released</div>
            </div>
            <div className="stat">
              <div className="stat__value">{LIBRARY.weightsShipped.length}</div>
              <div className="stat__label">weight drawn ({LIBRARY.weightsShipped.join(', ')})</div>
            </div>
            <div className="stat">
              <div className="stat__value">{LIBRARY.categoryCount}</div>
              <div className="stat__label">categories in use</div>
            </div>
            <div className="stat">
              <div className="stat__value">{LIBRARY.auditRecords}</div>
              <div className="stat__label">concepts audited</div>
            </div>
          </div>

          <p className="notice">
            <strong>Where this actually stands.</strong> All {plural(LIBRARY.iconCount, 'icon')}{' '}
            pass every automated check and ship today, in the <code>regular</code> weight only. The{' '}
            {LIBRARY.weightsPlanned.join(', ')} weights are specified but <em>not drawn</em> — this
            library will not fake a weight by changing a stroke width.{' '}
            <Link href="/status">See the full status</Link>.
          </p>
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
        <p className="mono" style={{ marginTop: '0.85rem' }}>
          ↑ every released icon, at real proportions. Nothing here is a placeholder.
        </p>
      </section>

      <section className="section section--sunken" id="browse">
        <div className="shell">
          <div className="stack" style={{ gap: '0.5rem', marginBottom: '1.5rem' }}>
            <p className="eyebrow">Browse</p>
            <h2>Every released icon</h2>
            <p className="lede">
              Search in English, filter by category, click any icon to copy its SVG. Every asset
              paints with <code>currentColor</code>, so it takes your text colour with no edits.
            </p>
          </div>

          <IconBrowser
            entries={entries}
            categories={categories}
            weightsShipped={LIBRARY.weightsShipped}
            weightsPlanned={LIBRARY.weightsPlanned}
          />
        </div>
      </section>

      <section className="section shell">
        <div className="stack" style={{ gap: '1rem', marginBottom: '1.5rem' }}>
          <p className="eyebrow">Developers</p>
          <h2>Use them anywhere.</h2>
          <p className="lede">
            The packages in this repository build to plain ESM with TypeScript types. They are{' '}
            <strong>not published to npm yet</strong> — installing today means downloading the SVG
            bundle or building the workspace from source.
          </p>
        </div>

        <div className="card-grid">
          <div className="card">
            <h3>Download the SVGs</h3>
            <p className="muted">
              A single zip with every released icon, the metadata JSON and the licence. Checksums
              published alongside.
            </p>
            <p>
              <Link href="/downloads">Downloads →</Link>
            </p>
          </div>

          <div className="card">
            <h3>Build from source</h3>
            <p className="muted">Clone the repository, then:</p>
            <pre className="code-block">
              <code>{'npm install\nnpm run build'}</code>
            </pre>
          </div>

          <div className="card">
            <h3>React, once published</h3>
            <p className="muted">
              The React package is built and tested in this repository. This is the API it exposes;
              the npm release is a manual step that has not happened.
            </p>
            <pre className="code-block">
              <code>
                {"import { TalkingDrum } from '@african-icon-library/react';\n\n" +
                  '<TalkingDrum size={24} title="Talking drum" />'}
              </code>
            </pre>
          </div>
        </div>
      </section>

      <section className="section section--sunken">
        <div className="shell">
          <div className="stack" style={{ gap: '1rem', marginBottom: '1.5rem' }}>
            <p className="eyebrow">Figma plugin</p>
            <h2>Search and place, without leaving the canvas.</h2>
            <p className="lede">
              The plugin bundles every released icon at build time. It requests{' '}
              <strong>no network access</strong>, sends nothing anywhere, and inserts editable
              vector frames you can restyle like any other layer.
            </p>
          </div>

          <div className="card-grid">
            <div className="card">
              <h3>What it does</h3>
              <ul style={{ margin: 0, paddingLeft: '1.1rem' }}>
                <li>Search and category filtering, ranked exactly like this website</li>
                <li>Weight selection across the weights that are actually drawn</li>
                <li>Insert at 16, 24, 32 or 48 px into your selection or the viewport centre</li>
              </ul>
            </div>

            <div className="card">
              <h3>How to run it today</h3>
              <p className="muted">
                It is not on the Figma Community yet. Build it and load it as a development plugin:
              </p>
              <pre className="code-block">
                <code>{'npm run build -w @african-icon-library/figma-plugin'}</code>
              </pre>
              <p className="muted">
                Then <em>Plugins → Development → Import plugin from manifest</em> and pick{' '}
                <code>apps/figma-plugin/manifest.json</code>.
              </p>
            </div>

            <div className="card">
              <h3>Publication status</h3>
              <p className="muted">
                Publishing to the Figma Community needs an account action nobody has taken yet. The
                listing copy, cover requirements and carousel plan are written and waiting in the
                repository.
              </p>
              <p>
                <a
                  href={`${SITE.repository}/blob/main/docs/figma-plugin-publishing.md`}
                  rel="noreferrer noopener"
                >
                  Publishing metadata →
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section shell">
        <div className="prose">
          <p className="eyebrow">The honest part</p>
          <h2>What this library is not, yet.</h2>
          <p>
            The August 2026 audit reviewed {pipeline.auditRecords} drawings. It found two visual
            species in one set, no shared grid, baked-in type and trademarks, duplicate concepts,
            and 38 files still named <code>Group-N</code>. This repository is the rebuild that
            followed, and it is deliberately small.
          </p>
          <ul>
            <li>
              <strong>{pipeline.released} icons are released.</strong> Each one passes viewBox,
              bounds, prohibited-text, hard-coded-colour, element and metadata checks in CI.
            </li>
            <li>
              <strong>
                {pipeline.heldForCulturalReview + pipeline.heldForIconDesign} drawings are held.
              </strong>{' '}
              One needs a cultural naming confirmation; one leaves the live area and needs a redraw.
              Neither ships.
            </li>
            <li>
              <strong>{pipeline.backlogConcepts} concepts are backlog.</strong> They exist as v2
              raster drawings that do not meet the spec. They are not in this product, and no raster
              asset is shown as if it were an icon.
            </li>
            <li>
              <strong>The illustration tier does not exist yet.</strong> It is designed in the spec
              and has zero released pieces.
            </li>
          </ul>
          <p>
            <Link href="/status">Full status and roadmap →</Link>
          </p>
        </div>
      </section>

      <section className="section section--sunken">
        <div className="shell prose">
          <h2>Get the files</h2>
          <p className="muted">
            {plural(LIBRARY.iconCount, 'SVG')}, the metadata JSON, and the MIT licence.
          </p>
          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
            <a className="button" href={DOWNLOADS.icons} download>
              Download SVG bundle
            </a>
            <a className="button button--ghost" href={SITE.repository} rel="noreferrer noopener">
              View on GitHub
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
