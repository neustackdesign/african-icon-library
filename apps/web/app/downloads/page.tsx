import type { Metadata } from 'next';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

import type { CSSProperties } from 'react';

import { PageHead } from '@/components/PageHead';
import { TrackedLink } from '@/components/TrackedLink';
import { categoryColour, categoryRank } from '@/lib/brand';
import { DOWNLOADS, LIBRARY, SITE, plural } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Downloads',
  description: 'Download African Icon Library V2 as SVGs, category packs or metadata.',
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
    <div className="page shell">
      <PageHead label="Downloads · V2" title="Take the files.">
        {plural(LIBRARY.iconCount, 'icon')} in the {LIBRARY.weightsShipped.join(', ')} weight and{' '}
        {plural(LIBRARY.mapCount, 'country map')}, ready as SVGs. MIT licensed for personal and
        commercial work.
      </PageHead>

      {manifest ? (
        <>
          <div className="actions">
            <TrackedLink
              className="btn btn--primary"
              href={DOWNLOADS.icons}
              download
              event="release_download"
              target_="icons-zip"
              surface="downloads"
            >
              Icons (.zip)
            </TrackedLink>
            <TrackedLink
              className="btn btn--secondary"
              href={DOWNLOADS.maps}
              download
              event="release_download"
              target_="maps-zip"
              surface="downloads"
            >
              Country maps (.zip)
            </TrackedLink>
            <TrackedLink
              className="btn btn--secondary"
              href={DOWNLOADS.complete}
              download
              event="release_download"
              target_="complete-zip"
              surface="downloads"
            >
              Complete library (.zip)
            </TrackedLink>
            <a className="btn btn--secondary" href={SITE.repository} rel="noreferrer noopener">
              View source on GitHub
            </a>
            <TrackedLink
              className="btn btn--secondary"
              href={DOWNLOADS.metadata}
              download
              event="release_download"
              target_="metadata-json"
              surface="downloads"
            >
              Metadata (.json)
            </TrackedLink>
          </div>

          <div className="page-block">
            <h2 className="subhead">Category packs</h2>
            <p className="muted">
              Icons only. Country maps are not an icon category; they ship in their own archive.
            </p>
            <p className="muted">Download only the part of the library you need.</p>
          </div>

          <ul className="card-grid">
            {[...(manifest.categories ?? [])]
              .sort((a, b) => categoryRank(a.id) - categoryRank(b.id))
              .map((category) => (
                <li
                  className="card"
                  key={category.id}
                  style={{ '--cat': categoryColour(category.id) } as CSSProperties}
                >
                  <span className="card__key" aria-hidden="true" />
                  <h3>{category.label}</h3>
                  <p className="muted">{plural(category.icons, 'icon')}</p>
                  <p>
                    <TrackedLink
                      className="mono-link"
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

          <div className="page-block">
            <h2 className="subhead">Checksums</h2>
            <p className="muted">
              SHA-256 values are provided for anyone who wants to verify a download.
            </p>
          </div>

          <div className="table-scroll">
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
                    <th scope="row">
                      <a href={`/downloads/${artefact.name}`} download>
                        {artefact.name}
                      </a>
                    </th>
                    <td className="nowrap">{formatBytes(artefact.bytes)}</td>
                    <td className="checksum">{artefact.sha256}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="empty-state">
          <p>Direct downloads are temporarily unavailable on this build.</p>
          <p>
            <a href={SITE.repository} rel="noreferrer noopener">
              Get the source files from GitHub →
            </a>
          </p>
        </div>
      )}

      <div className="prose page-block">
        <h2>What is in each zip</h2>
        <pre className="code-block">
          <code>
            {`african-icon-library-${LIBRARY.version}/          icons
  svg/regular/*.svg     ${LIBRARY.iconCount} icons, 24 x 24, currentColor
  metadata.json         names, categories and keywords
  LICENSE               MIT
  README.txt

african-icon-library-maps-${LIBRARY.version}/     country maps
  svg/*.svg             ${LIBRARY.mapCount} maps, own viewBox, currentColor
  metadata.json         names, ISO 3166-1 codes, regions, aliases
  LICENSE               MIT
  README.txt

african-icon-library-complete-${LIBRARY.version}/ both
  icons/svg/regular/*.svg
  maps/svg/*.svg
  metadata.json
  LICENSE
  README.txt`}
          </code>
        </pre>

        <h2>Licence</h2>
        <p>
          MIT. The licence covers the code, metadata and original drawings in the release.
          Third-party trademarks remain the property of their owners.
        </p>
      </div>
    </div>
  );
}
