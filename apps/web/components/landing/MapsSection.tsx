import type { CSSProperties } from 'react';

import { mapEntries, populatedMapRegions } from '@/lib/maps';
import { DOWNLOADS, LIBRARY } from '@/lib/site';

import { MapGlyph } from '../MapGlyph';
import { TrackedLink } from '../TrackedLink';

/**
 * Announces the country maps without turning the page into a maps campaign:
 * one section, every outline at its real proportions, grouped by AIL region,
 * and two ways in — the browser's map view and the maps download.
 */
export function MapsSection() {
  const entries = mapEntries();
  const regions = populatedMapRegions();

  return (
    <section className="maps-intro" aria-labelledby="maps-title">
      <div className="shell section section-grid">
        <p className="section-label">Country maps · new in v{LIBRARY.version}</p>
        <div className="section-head">
          <h2 id="maps-title">{LIBRARY.mapCount} African countries, in the same line.</h2>
          <p className="lead">
            Outline maps drawn in the library’s 1.5-stroke language. Each keeps its real
            proportions, paints with <code>currentColor</code> and ships as its own SVG — a second
            asset type alongside the icons.
          </p>
        </div>

        <div className="maps-intro__regions">
          {regions.map((region) => (
            <div className="maps-intro__region" key={region.id}>
              <p className="maps-intro__region-label">
                {region.label} <span>{region.count}</span>
              </p>
              <ul className="maps-intro__strip" aria-label={`${region.label} country maps`}>
                {entries
                  .filter((entry) => entry.map.region === region.id)
                  .map((entry) => (
                    <li
                      key={entry.map.id}
                      title={entry.map.name}
                      style={{ '--ar': entry.width / entry.height } as CSSProperties}
                    >
                      <MapGlyph
                        body={entry.body}
                        width={entry.width}
                        height={entry.height}
                        size={32}
                        label={entry.map.name}
                      />
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="actions maps-intro__actions">
          <a className="btn btn--primary" href="#maps">
            Browse the maps
          </a>
          <TrackedLink
            className="btn btn--secondary"
            href={DOWNLOADS.maps}
            download
            event="release_download"
            target_="maps-zip"
            surface="home-maps"
          >
            Download all maps
          </TrackedLink>
        </div>
      </div>
    </section>
  );
}
