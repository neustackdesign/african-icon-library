import Link from 'next/link';

import { TrackedLink } from '../TrackedLink';
import { DOWNLOADS, ISSUE_FORMS, SITE } from '@/lib/site';

const ROUTES = [
  {
    href: ISSUE_FORMS.iconProposal,
    title: 'Propose an icon',
    body: 'Something everyday that the set is missing.',
  },
  {
    href: ISSUE_FORMS.localName,
    title: 'Contribute a local name',
    body: 'What an object is called where you live.',
  },
  {
    href: ISSUE_FORMS.culturalCorrection,
    title: 'Report a cultural correction',
    body: 'A name, reference or drawing that is not right.',
  },
  {
    href: '/contributing',
    title: 'Contributing guide',
    body: 'Drawing standard, review and naming.',
  },
] as const;

export function OpenSourceSection() {
  return (
    <section aria-labelledby="open-source-title">
      <div className="shell section section-grid">
        <p className="section-label">Open source</p>
        <div className="split">
          <div className="stack">
            <h2 id="open-source-title">Use it. Adapt it. Help it grow.</h2>
            <p className="lead">
              The library is MIT licensed. If something important to African everyday life is
              missing, open an issue or contribute through the repository. Cultural specificity
              matters: names, references and symbols should be grounded rather than guessed.
            </p>
            <div className="actions">
              <TrackedLink
                className="btn btn--primary"
                href={DOWNLOADS.icons}
                download
                event="release_download"
                target_="icons-zip"
                surface="open-source"
              >
                Download all SVGs
              </TrackedLink>
              <a className="btn btn--secondary" href={SITE.newIssue} rel="noreferrer noopener">
                Suggest an icon
              </a>
            </div>
          </div>
          <ul className="routes">
            {ROUTES.map((route) => (
              <li key={route.title}>
                {route.href.startsWith('/') ? (
                  <Link href={route.href}>
                    <RouteText title={route.title} body={route.body} />
                  </Link>
                ) : (
                  <a href={route.href} rel="noreferrer noopener">
                    <RouteText title={route.title} body={route.body} />
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function RouteText({ title, body }: { title: string; body: string }) {
  return (
    <>
      <span className="routes__text">
        <span className="routes__title">{title}</span>
        <span className="routes__body">{body}</span>
      </span>
      <span aria-hidden="true">→</span>
    </>
  );
}
