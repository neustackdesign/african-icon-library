import type { Metadata } from 'next';
import Link from 'next/link';

import { pipeline } from '@african-icon-library/metadata';

import { LIBRARY, SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Status',
  description:
    'What the African Icon Library ships today, what is held back and why, and what is still ' +
    'waiting on human icon design or cultural review.',
  alternates: { canonical: '/status' },
};

const ROWS = [
  {
    label: 'Released',
    count: pipeline.released,
    detail: 'Passes every automated check. Public, downloadable, in the plugin.',
  },
  {
    label: 'Held — cultural review',
    count: pipeline.heldForCulturalReview,
    detail:
      'Drawn, but the audit could not confirm what the object is. Releasing it would assert a ' +
      'name nobody has verified.',
  },
  {
    label: 'Held — icon design',
    count: pipeline.heldForIconDesign,
    detail:
      'Drawn, but the geometry leaves the 2-unit live area. Needs a redraw that fits the grid, ' +
      'not a rescale.',
  },
  {
    label: 'Backlog',
    count: pipeline.backlogConcepts,
    detail:
      'Audited concepts with no drawing that meets the spec. The v2 raster originals are kept ' +
      'out of the public product entirely.',
  },
  {
    label: 'Merged by the audit',
    count: pipeline.mergedByAudit,
    detail: 'Near-duplicate concepts folded into a single entry.',
  },
  {
    label: 'Cut by the audit',
    count: pipeline.droppedByAudit,
    detail:
      'Off-brief, brand-locked or type-locked assets the audit removed from the library entirely.',
  },
] as const;

export default function StatusPage() {
  return (
    <div className="section shell">
      <div className="prose">
        <p className="eyebrow">Status</p>
        <h1 style={{ fontSize: 'clamp(1.9rem, 1.4rem + 2.4vw, 2.75rem)' }}>
          Exactly what exists, and what does not.
        </h1>
        <p className="lede">
          Every number on this page is computed from the repository at build time. Nothing here is
          typed by hand, and nothing is rounded up.
        </p>
      </div>

      <div className="table-scroll" style={{ marginTop: '2rem' }}>
        <table>
          <caption className="visually-hidden">
            Disposition of every concept reviewed in the August 2026 audit
          </caption>
          <thead>
            <tr>
              <th scope="col">State</th>
              <th scope="col">Count</th>
              <th scope="col">What it means</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => (
              <tr key={row.label}>
                <th scope="row">{row.label}</th>
                <td style={{ fontVariantNumeric: 'tabular-nums' }}>{row.count}</td>
                <td className="muted">{row.detail}</td>
              </tr>
            ))}
            <tr>
              <th scope="row">Total audited</th>
              <td style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 700 }}>
                {pipeline.auditRecords}
              </td>
              <td className="muted">Every asset the August 2026 audit reviewed.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="prose" style={{ marginTop: '2.5rem' }}>
        <h2>Weights</h2>
        <p>
          The drawing system defines four weights: <code>thin</code>, <code>regular</code>,{' '}
          <code>bold</code> and <code>fill</code>. Exactly {LIBRARY.weightsShipped.length} of them
          is drawn: <code>{LIBRARY.weightsShipped.join(', ')}</code>.
        </p>
        <p>
          The other three ({LIBRARY.weightsPlanned.join(', ')}) are specified but not drawn. They
          cannot be produced by changing <code>stroke-width</code> on the regular weight — a real
          weight redistributes mass and re-solves counters, which is icon-design work, not a build
          step. The validator refuses a release where one icon has a weight another lacks.
        </p>

        <h2>Illustration tier</h2>
        <p>
          The architecture reserves a second tier for spot illustrations at 64 px and up. It has
          zero released pieces. Nothing on this site is presented as an illustration-tier asset.
        </p>

        <h2>Local-name search</h2>
        <p>
          The metadata schema carries local names with an explicit review state. Today no local name
          has been confirmed by a speaker, so none is displayed as authoritative. Search still
          matches against them, diacritics included, so the work is not wasted while it waits for
          review.
        </p>

        <h2>What needs a person</h2>
        <p>
          The repository separates work that a script finished from work that needs an icon
          designer, a cultural reviewer, or someone with account access to Figma, npm and Vercel.
          That separation lives in{' '}
          <a href={`${SITE.repository}/blob/main/RELEASE_CHECKLIST.md`} rel="noreferrer noopener">
            RELEASE_CHECKLIST.md
          </a>
          .
        </p>

        <p>
          <Link href="/changelog">See what shipped and when →</Link>
        </p>
      </div>
    </div>
  );
}
