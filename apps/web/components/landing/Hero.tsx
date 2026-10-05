import { TrackedLink } from '../TrackedLink';
import { HEADLINE } from '@/lib/compositions';
import { DOWNLOADS, LIBRARY, SITE } from '@/lib/site';

import { Specimen } from './Specimen';

export function Hero({ categoryLabels }: { categoryLabels: Record<string, string> }) {
  return (
    <section className="hero shell section-grid" aria-labelledby="hero-title">
      <p className="section-label">V2 · Open source</p>
      <div className="hero__body">
        <h1 id="hero-title">{HEADLINE}</h1>
        <div className="hero__row">
          <div className="hero__copy">
            <p className="lead">
              A free SVG icon library for African everyday life — starting with Nigeria. Built on a
              consistent 24-pixel system for product interfaces, brand systems, presentations and
              whatever you are making next. Now with outline maps of {LIBRARY.mapCount} African
              countries, drawn in the same line.
            </p>
            <div className="actions">
              <a className="btn btn--primary" href="#browse">
                Browse the icons
              </a>
              <TrackedLink
                className="btn btn--secondary"
                href={DOWNLOADS.icons}
                download
                event="release_download"
                target_="icons-zip"
                surface="hero"
              >
                Download all SVGs
              </TrackedLink>
              <TrackedLink
                className="btn btn--text"
                href={SITE.repository}
                rel="noreferrer noopener"
                event="github_click"
                surface="hero"
              >
                GitHub ↗
              </TrackedLink>
            </div>
          </div>
          <Specimen categoryLabels={categoryLabels} />
        </div>
      </div>
    </section>
  );
}
