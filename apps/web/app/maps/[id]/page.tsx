import { MAP_BOUNDARY_POLICY } from '@african-icon-library/maps';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { fitMapSize, getMapBody, getMapViewBox, renderMapSvg } from '@african-icon-library/maps';
import { getMap, getMapRegion, maps } from '@african-icon-library/metadata';

import { CopySvgButton } from '@/components/CopySvgButton';
import { MapGlyph } from '@/components/MapGlyph';
import { TrackedLink } from '@/components/TrackedLink';
import { DOWNLOADS, SITE } from '@/lib/site';

interface Params {
  params: Promise<{ id: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return maps.map((map) => ({ id: map.id }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const map = getMap(id);
  if (!map) return { title: 'Map not found' };
  const title = `${map.name} map`;
  const description = `An outline map of ${map.name} (${map.iso3}) as a free SVG, drawn in the ${SITE.name}’s 1.5-stroke line language. MIT licensed.`;
  return {
    title,
    description,
    alternates: { canonical: `/maps/${map.id}` },
    openGraph: { title: `${title} · ${SITE.name}`, description, url: `/maps/${map.id}` },
    twitter: { title: `${title} · ${SITE.name}`, description },
  };
}

/** Longest side, in px. The other side follows the country's proportions. */
const SIZES = [24, 48, 96, 192] as const;

export default async function MapPage({ params }: Params) {
  const { id } = await params;
  const map = getMap(id);
  const body = map ? getMapBody(map.id) : undefined;
  const box = map ? getMapViewBox(map.id) : undefined;
  if (!map || body === undefined || !box) notFound();

  const svg = renderMapSvg(map.id, { title: map.name }) ?? '';
  const region = getMapRegion(map.region);

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: `${map.name} map`,
    description: `Outline map of ${map.name}.`,
    license: 'https://opensource.org/licenses/MIT',
    isPartOf: { '@type': 'CreativeWorkSeries', name: SITE.name, url: SITE.url },
    about: { '@type': 'Country', name: map.name, identifier: map.iso3 },
    keywords: [map.name, ...map.aliases, map.iso2, map.iso3].join(', '),
    url: `${SITE.url}/maps/${map.id}`,
    version: map.addedIn,
  };

  return (
    <article className="page shell">
      <p className="crumbs">
        <Link href="/#maps">Maps</Link> / {region?.label ?? map.region} / {map.id}
      </p>

      <div className="icon-page">
        <div className="stack">
          <div className="map-hero field field--map">
            <MapGlyph
              body={body}
              width={box.width}
              height={box.height}
              size="80%"
              label={map.name}
            />
          </div>

          <h2 className="subhead">At working sizes</h2>
          <ul className="sizes map-sizes">
            {SIZES.map((size) => {
              const fitted = fitMapSize(map.id, size)!;
              return (
                <li key={size}>
                  <svg
                    className="map-glyph"
                    width={fitted.width}
                    height={fitted.height}
                    viewBox={`0 0 ${box.width} ${box.height}`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    role="img"
                    aria-label={`${map.name}, longest side ${size} pixels`}
                    dangerouslySetInnerHTML={{ __html: body }}
                  />
                  {size}
                </li>
              );
            })}
          </ul>
        </div>

        <div className="stack">
          <h1 className="page-title">{map.name}</h1>
          {map.officialName ? <p className="lead">{map.officialName}</p> : null}

          <dl className="meta-list map-meta">
            <dt>region</dt>
            <dd>{region?.label ?? map.region}</dd>
            <dt>ISO 3166-1</dt>
            <dd>
              {map.iso2} · {map.iso3}
            </dd>
            <dt>id</dt>
            <dd>{map.id}</dd>
            {map.aliases.length > 0 ? (
              <>
                <dt>also</dt>
                <dd>{map.aliases.join(', ')}</dd>
              </>
            ) : null}
            <dt>proportions</dt>
            <dd>
              {box.width} × {box.height} viewBox · 1.5 stroke
            </dd>
          </dl>

          <div className="actions">
            <CopySvgButton svg={svg} target={map.id} event="map_copy" surface="map-page" />
            <TrackedLink
              className="btn btn--secondary"
              href={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`}
              download={`${map.id}.svg`}
              event="map_download"
              target_={map.id}
              surface="map-page"
            >
              Download SVG
            </TrackedLink>
          </div>
          <p className="note">
            Region is the {SITE.name}’s own grouping for browsing.{' '}
            <a href={DOWNLOADS.maps} download>
              Download all maps (.zip)
            </a>
          </p>
          <p className="note">{MAP_BOUNDARY_POLICY}</p>

          <h2 className="subhead">SVG source</h2>
          <pre className="code-block code-block--wrap">
            <code>{svg}</code>
          </pre>
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </article>
  );
}
