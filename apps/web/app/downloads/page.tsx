import type { Metadata } from 'next';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { TrackedLink } from '@/components/TrackedLink';
import { DOWNLOADS, LIBRARY, SITE, plural } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Downloads',
  description:
    'Download every released African Icon Library SVG, the metadata JSON, and verify the ' +
    'published checksums.',
  alternates: { canonical: '/downloads' },
};

interface Manifest {
  version: string;
  icons: number;
  weights: string[];
  categories: Array<{ id: string; label: string; icons: number; file: string }>;
  artefacts: Array<{ name: string; bytes: number; sha256: string }>;
}

async function readManifest(): Promise<Manifest | null> {
  try {
    const file = path.join(process.cwd(), 'public/downloads/manifest.json');
    return JSON.parse(await readFile(file, 'utf8')) as Manifest;
  } catch {
    // The manifest is produced by `npm run release:build`. If it is missing the
    // page says so rather than linking to files that do not exist.
    return null;
  }
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} kB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default async function DownloadsPage() {
  const manifest = await readManifest();

  return (
    <div className="section shell">
      <div className="prose">
        <p className="eyebrow">Downloads</p>
        <h1 style={{ fontSize: 'clamp(1.9rem, 1.4rem + 2.4vw, 2.75rem)' }}>Take the files.</h1>
        <p className="lede">
          {plural(LIBRARY.iconCount, 'icon')} in the{' '}
          <code>{LIBRARY.weightsShipped.join(', ')}</code> weight, plus the metadata that describes
          them. MIT licensed — commercial use included, no attribution required (though it is
          welcome).
        </p>
      </div>

      {manifest ? (
        <>
          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginTop: '1.5rem' }}>
            <TrackedLink
              className="button"
              href={DOWNLOADS.icons}
              download
              event="release_download"
              target_="icons-zip"
              surface="downloads"
            >
              SVG bundle (.zip)
            </TrackedLink>
            <TrackedLink
              className="button button--ghost"
              href={DOWNLOADS.metadata}
              download
              event="release_download"
              target_="metadata-json"
              surface="downloads"
            >
              Metadata (.json)
            </TrackedLink>
          </div>

          <div className="prose" style={{ marginTop: '2.5rem' }}>
            <h2>Category packs</h2>
            <p className="muted">
              Only the categories that actually contain released icons are offered. An empty pack
              would be a download that promises something it cannot give.
            </p>
          </div>

          <ul className="card-grid" style={{ listStyle: 'none', margin: '1rem 0 0', padding: 0 }}>
            {(manifest.categories ?? []).map((category) => (
              <li className="card" key={category.id}>
                <h3>{category.label}</h3>
                <p className="muted">{plural(category.icons, 'icon')}</p>
                <p>
                  <TrackedLink
                    href={`/downloads/${category.file}`}
                    download
                    event="category_download"
                    target_={category.id}
                    surface="downloads"
                  >
                    Download pack →
                  </TrackedLink>
                </p>
              </li>
            ))}
          </ul>

          <div className="prose" style={{ marginTop: '2.5rem' }}>
            <h2>Checksums</h2>
          </div>

          <div className="table-scroll" style={{ marginTop: '1rem' }}>
            <table>
              <caption className="visually-hidden">Published artefacts and their checksums</caption>
              <thead>
                <tr>
                  <th scope="col">File</th>
                  <th scope="col">Size</th>
                  <th scope="col">SHA-256</th>
                </tr>
              </thead>
              <tbody>
                {manifest.artefacts.map((artefact) => (
                  <tr key={artefact.name}>
                    <th scope="row" style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}>
                      <a href={`/downloads/${artefact.name}`} download>
                        {artefact.name}
                      </a>
                    </th>
                    <td style={{ whiteSpace: 'nowrap' }}>{formatBytes(artefact.bytes)}</td>
                    <td
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.75rem',
                        wordBreak: 'break-all',
                      }}
                    >
                      {artefact.sha256}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="empty-state" style={{ marginTop: '1.5rem' }}>
          <p>The download artefacts have not been built for this deployment.</p>
          <p className="mono">Run `npm run release:build` before building the site.</p>
        </div>
      )}

      <div className="prose" style={{ marginTop: '2.5rem' }}>
        <h2>What is in the zip</h2>
        <pre className="code-block">
          <code>
            {`african-icon-library-${LIBRARY.version}/
  svg/regular/*.svg     ${LIBRARY.iconCount} icons, 24 x 24, currentColor
  metadata.json         names, categories, keywords, provenance
  LICENSE               MIT
  README.txt`}
          </code>
        </pre>

        <h2>Verify the download</h2>
        <pre className="code-block">
          <code>{`shasum -a 256 african-icon-library-icons-${LIBRARY.version}.zip`}</code>
        </pre>
        <p className="muted">
          The archive is built deterministically, so the same source tree always produces the same
          checksum.
        </p>

        <h2>Not on npm yet</h2>
        <p>
          <code>@african-icon-library/icons</code>, <code>/metadata</code> and <code>/react</code>{' '}
          build and test in CI but have not been published. Publishing needs an npm account action
          that has not been taken. Until then, build them from{' '}
          <a href={SITE.repository} rel="noreferrer noopener">
            the repository
          </a>
          .
        </p>

        <h2>Licence</h2>
        <p>
          MIT. It covers the code, the metadata and the drawings. It does not grant rights in
          third-party trademarks or regulated national symbols — no released icon reproduces either,
          and none may be added.
        </p>
      </div>
    </div>
  );
}
