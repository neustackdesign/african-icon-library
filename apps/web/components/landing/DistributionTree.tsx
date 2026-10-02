import Link from 'next/link';
import type { CSSProperties } from 'react';

import { categoryColour } from '@/lib/brand';
import { browserEntries } from '@/lib/icons';
import { FIGMA, LIBRARY, SITE } from '@/lib/site';

import { Icon } from '../Icon';
import { IconGlyph } from '../IconGlyph';
import { TrackedLink } from '../TrackedLink';

function node(colour: string): CSSProperties {
  return { '--cat': colour } as CSSProperties;
}

/**
 * One library, three ways in. The canonical release in the repository is the
 * root; web, Figma and source branch from it with 1px orthogonal connectors on
 * wide screens, and stack below 1000px.
 */
export function DistributionTree() {
  return (
    <section className="theme-light" aria-labelledby="surfaces-title">
      <div className="shell section section-grid">
        <p className="section-label">Use the library</p>
        <div className="section-head">
          <h2 id="surfaces-title">Web, Figma or source.</h2>
          <p className="lead">
            V2 is designed as one library with multiple ways in. The same released icon set powers
            the website downloads, repository and Figma tooling.
          </p>
        </div>

        <div className="tree">
          <div className="tree__root">
            <p className="tree__root-head">
              <span>Canonical release · v{LIBRARY.version}</span>
              <span>MIT</span>
            </p>
            <span className="tree__path">packages/icons/svg/regular</span>
            <div
              className="tree__set"
              aria-label={`All ${LIBRARY.iconCount} released icons`}
              role="img"
            >
              {browserEntries().map(({ icon, body }) => (
                <IconGlyph key={icon.id} body={body} size={18} />
              ))}
            </div>
          </div>

          <div className="tree__branches" aria-hidden="true">
            <span className="tree__stem" />
            <span className="tree__bar" />
            <span className="tree__drops">
              <span className="tree__stem" />
              <span className="tree__stem" />
              <span className="tree__stem" />
            </span>
          </div>

          <ul className="surfaces">
            <li className="surface">
              <span className="surface__node field" style={node('var(--accent)')}>
                <Icon id="jollof-rice" size={28} />
              </span>
              <span className="surface__text">
                <span className="surface__kicker">Web · SVG</span>
                <h3>Download the SVGs</h3>
                <p>
                  Every released SVG in one zip, or smaller category packs. Metadata and checksums
                  sit alongside.
                </p>
              </span>
              <Link className="mono-link" href="/downloads">
                Open downloads →
              </Link>
            </li>

            <li className="surface">
              <span className="surface__node field" style={node(categoryColour('music-art-play'))}>
                <Icon id="talking-drum" size={28} />
              </span>
              <span className="surface__text">
                <span className="surface__kicker">Figma · {LIBRARY.iconCount} components</span>
                <h3>Use it in Figma</h3>
                <p>
                  The Community file and plugin are generated from the same canonical set. Strokes
                  stay live and editable.
                </p>
              </span>
              {FIGMA.published && FIGMA.url ? (
                <TrackedLink
                  className="mono-link"
                  href={FIGMA.url}
                  rel="noreferrer noopener"
                  event="figma_click"
                  surface="home"
                >
                  Open in Figma →
                </TrackedLink>
              ) : (
                <span className="surface__status">Community publication pending</span>
              )}
            </li>

            <li className="surface">
              <span className="surface__node field" style={node(categoryColour('transport'))}>
                <Icon id="danfo" size={28} />
              </span>
              <span className="surface__text">
                <span className="surface__kicker">Source · React</span>
                <h3>Build with the source</h3>
                <p>
                  SVG source, metadata, validation rules and build tooling, with generated React
                  components.
                </p>
              </span>
              <code className="surface__code">{'<Danfo size={24} />'}</code>
              <TrackedLink
                className="mono-link"
                href={SITE.repository}
                rel="noreferrer noopener"
                event="github_click"
                surface="home"
              >
                Open GitHub →
              </TrackedLink>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
