import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { getIconBody, renderIconSvg } from '@african-icon-library/icons';
import { getCategory, getIcon, icons } from '@african-icon-library/metadata';

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
    <article className="section shell">
      <p className="mono" style={{ marginBottom: '1rem' }}>
        <Link href="/">Icons</Link> / {icon.id}
      </p>

      <div
        style={{
          display: 'grid',
          gap: '1.5rem',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          alignItems: 'start',
        }}
      >
        <div className="stack">
          <h1 style={{ fontSize: 'clamp(1.75rem, 1.3rem + 2vw, 2.5rem)' }}>{icon.name}</h1>
          <p className="lede">{icon.description}</p>

          <ul className="tag-row" style={{ marginTop: 0 }}>
            <li className="tag">{icon.id}</li>
            {category ? <li className="tag">{category.label}</li> : null}
            {icon.regions.map((region) => (
              <li className="tag" key={region}>
                {region}
              </li>
            ))}
            <li className="tag">added in v{icon.addedIn}</li>
          </ul>

          <h2 style={{ fontSize: '1.125rem', marginTop: '1rem' }}>At real sizes</h2>
          <div
            style={{
              display: 'flex',
              gap: '1.25rem',
              alignItems: 'flex-end',
              flexWrap: 'wrap',
              border: '1px solid var(--line)',
              borderRadius: 'var(--radius)',
              background: 'var(--paper-raised)',
              padding: '1.25rem',
            }}
          >
            {SIZES.map((size) => (
              <div key={size} style={{ textAlign: 'center' }}>
                <svg
                  width={size}
                  height={size}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  role="img"
                  aria-label={`${icon.name} at ${size} pixels`}
                  dangerouslySetInnerHTML={{ __html: body }}
                />
                <div className="mono" style={{ marginTop: '0.4rem' }}>
                  {size}
                </div>
              </div>
            ))}
          </div>

          <h2 style={{ fontSize: '1.125rem', marginTop: '1rem' }}>Search terms</h2>
          <ul className="tag-row" style={{ marginTop: 0 }}>
            {icon.keywords.map((keyword) => (
              <li className="tag" key={keyword}>
                {keyword}
              </li>
            ))}
          </ul>

          {icon.localNames.length > 0 ? (
            <p className="notice notice--caution">
              <strong>Local names in review.</strong> {icon.localNames.length} name(s) carried over
              from the v3 audit have not yet been confirmed by a speaker of the language, so they
              are not shown here as authoritative. They do work as search terms.
            </p>
          ) : null}
        </div>

        <div className="stack">
          <h2 style={{ fontSize: '1.125rem' }}>Weights</h2>
          <ul className="tag-row" style={{ marginTop: 0 }}>
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

          <h2 style={{ fontSize: '1.125rem', marginTop: '1rem' }}>SVG source</h2>
          <pre className="code-block">
            <code>{svg}</code>
          </pre>

          <h2 style={{ fontSize: '1.125rem', marginTop: '1rem' }}>Provenance</h2>
          <p className="muted" style={{ fontSize: '0.9375rem' }}>
            Redrawn from <code>{icon.provenance.auditSourceFile}</code> in the August 2026 audit,
            whose verdict for that file was <code>{icon.provenance.auditVerdict}</code>.
          </p>
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </article>
  );
}
