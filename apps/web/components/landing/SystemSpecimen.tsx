import Link from 'next/link';
import { Fragment, type CSSProperties } from 'react';

import { categoryColour } from '@/lib/brand';
import { SPEC_ROWS, UI_SIZES } from '@/lib/compositions';
import { iconBody } from '@/lib/icons';

import { Icon } from '../Icon';

const SPECIMEN = 'danfo';

export function SystemSpecimen() {
  const body = iconBody(SPECIMEN);

  return (
    <section
      className="theme-system"
      aria-labelledby="system-title"
      style={{ '--keyline': categoryColour('transport') } as CSSProperties}
    >
      <div className="shell section section-grid">
        <p className="section-label">The system</p>
        <div className="split">
          <div className="stack">
            <h2 id="system-title">A smaller, stronger system.</h2>
            <p className="lead">
              V2 rebuilds the library around a consistent 24-pixel icon system rather than treating
              every older asset as automatically release-ready. The regular weight is the released
              baseline.
            </p>
            <dl className="spec-list">
              {SPEC_ROWS.map(([term, value]) => (
                <Fragment key={term}>
                  <dt>{term}</dt>
                  <dd>{value}</dd>
                </Fragment>
              ))}
            </dl>
            <Link className="mono-link" href="/spec">
              Read the icon specification →
            </Link>
          </div>

          <div className="system-art">
            <figure
              className="plate"
              aria-label="The danfo drawing on its 24 × 24 construction grid"
            >
              <span className="plate__live" aria-hidden="true" />
              <svg
                className="plate__ghost"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                dangerouslySetInnerHTML={{ __html: body }}
              />
              <svg
                className="plate__keyline"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.25}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                dangerouslySetInnerHTML={{ __html: body }}
              />
              <span className="plate__label plate__label--live">live area 2–22</span>
              <span className="plate__label plate__label--size">24 × 24</span>
            </figure>
            <ul className="scale" aria-label="Danfo at 16, 20, 24, 32 and 48 pixels">
              {UI_SIZES.map((size) => (
                <li key={size}>
                  <Icon id={SPECIMEN} size={size} />
                  {size}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
