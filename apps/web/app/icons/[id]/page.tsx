import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { getIconBody, renderIconSvg } from '@african-icon-library/icons';
import { getCategory, getIcon, icons } from '@african-icon-library/metadata';

import { IconGlyph } from '@/components/IconGlyph';
import { TrackedLink } from '@/components/TrackedLink';
import { categoryColour } from '@/lib/brand';
import { LIBRARY, SITE } from '@/lib/site';

interface Params {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return icons.map((icon) => ({ id: icon.id }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const icon = getIcon(id);
  if (!icon) return { title: 'Icon not found' };

  const title = `${icon.name} icon`;
  const description = `${icon.description} A 24-pixel SVG icon from the ${SITE.name}, free under MIT.`;

  return {
    title,
    description,
    alternates: { canonical: `/icons/${icon.id}` },
    openGraph: { title: `${title} · ${SITE.name}`, description, url: `/icons/${icon.id}` },
    twitter: { title: `${title} · ${SITE.name}`, description },
  };
}

const SIZES = [16, 24, 32, 48, 64] as const;

export default async function IconPage({ params }: Params) {
  const { id } = await params;
  const icon = getIcon(id);
  if (!icon) notFound();

  const body = getIconBody(icon.id) ?? '';
  const svg = renderIconSvg(icon.id, { title: icon.name }) ?? '';
  const category = getCategory(icon.category);

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: `${icon.name} icon`,
    description: icon.description,
    license: 'https://opensource.org/licenses/MIT',
    isPartOf: { '@type': 'CreativeWorkSeries', name: SITE.name, url: SITE.url },
    keywords: icon.keywords.join(', '),
    url: `${SITE.url}/icons/${icon.id}`,
    version: icon.addedIn,
  };

  return (
    <article className="page shell">
      <p className="crumbs">
        <Link href="/#browse">Icons</Link> / {category?.label ?? icon.category} / {icon.id}
      </p>

      <div className="icon-page">
        <div className="stack">
          <div
            className="icon-hero field"
            style={{ '--cat': categoryColour(icon.category) } as CSSProperties}
          >
            <span className="grid-overlay" aria-hidden="true" />
            <span className="live-area" aria-hidden="true" />
            <IconGlyph body={body} size="45%" label={icon.name} />
          </div>

          <h2 className="subhead">At real sizes</h2>
          <ul className="sizes">
            {SIZES.map((size) => (
              <li key={size}>
                <IconGlyph body={body} size={size} label={`${icon.name} at ${size} pixels`} />
                {size}
              </li>
            ))}
          </ul>
        </div>

        <div className="stack">
          <h1 className="page-title">{icon.name}</h1>
          <p className="lead">{icon.description}</p>

          <ul className="tag-row">
            <li className="tag">{icon.id}</li>
            {category ? <li className="tag">{category.label}</li> : null}
            {icon.regions.map((region) => (
              <li className="tag" key={region}>
                {region}
              </li>
            ))}
            <li className="tag">added in v{icon.addedIn}</li>
          </ul>

          <div className="actions">
            <TrackedLink
              className="btn btn--primary"
              href={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`}
              download={`${icon.id}.svg`}
              event="icon_download"
              target_={icon.id}
              surface="icon-page"
            >
              Download SVG
            </TrackedLink>
            <Link className="btn btn--secondary" href="/#browse">
              Browse all icons
            </Link>
          </div>

          <h2 className="subhead">SVG source</h2>
          <pre className="code-block code-block--wrap">
            <code>{svg}</code>
          </pre>

          <h2 className="subhead">Search terms</h2>
          <ul className="tag-row">
            {icon.keywords.map((keyword) => (
              <li className="tag" key={keyword}>
                {keyword}
              </li>
            ))}
          </ul>

          {icon.localNames.length > 0 ? (
            <p className="notice notice--caution">
              <strong>Local names in review.</strong> {icon.localNames.length} local name(s) have
              not yet been confirmed by a speaker of the language, so they are not shown here as
              authoritative. They do work as search terms.
            </p>
          ) : null}

          <h2 className="subhead">Weights</h2>
          <ul className="tag-row">
            {icon.weights.map((weight) => (
              <li className="tag" key={weight}>
                {weight} — drawn
              </li>
            ))}
            {LIBRARY.weightsPlanned.map((weight) => (
              <li className="tag tag--muted" key={weight}>
                {weight} — not drawn
              </li>
            ))}
          </ul>
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </article>
  );
}
