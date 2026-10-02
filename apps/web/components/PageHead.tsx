import type { ReactNode } from 'react';

/** The secondary-page header: section label, display title and an optional lead. */
export function PageHead({
  label,
  title,
  children,
}: {
  label: string;
  title?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <header className="page-head">
      <p className="section-label">{label}</p>
      {title ? <h1 className="page-title">{title}</h1> : null}
      {children ? <div className="lead">{children}</div> : null}
    </header>
  );
}

/** Footnote pointing at the canonical repository copy of a rendered document. */
export function CanonicalCopy({ href, label }: { href: string; label: string }) {
  return (
    <p className="note canonical-copy">
      Canonical copy:{' '}
      <a href={href} rel="noreferrer noopener">
        {label}
      </a>
      .
    </p>
  );
}
