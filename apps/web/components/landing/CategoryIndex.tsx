import type { CSSProperties } from 'react';

import { getIcon } from '@african-icon-library/metadata';

import type { CategorySummary } from '@/lib/icons';
import { SITE, plural } from '@/lib/site';

import { Icon } from '../Icon';
import { CategoryLink } from './CategoryLink';

export function CategoryIndex({ categories }: { categories: CategorySummary[] }) {
  const count = categories.length;
  const countWord =
    ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'][count] ??
    String(count);

  return (
    <section className="theme-light" aria-labelledby="categories-title">
      <div className="shell section section-grid">
        <p className="section-label">{countWord} categories</p>
        <div className="section-head">
          <h2 id="categories-title">The everyday things most icon sets leave out.</h2>
          <p className="lead">
            Drawn from Nigerian life first: what people eat, how they move and pay, and what they
            wear, play and keep.
          </p>
        </div>

        <div>
          <ul className="cat-index">
            {categories.map((category, index) => (
              <li key={category.id}>
                <CategoryLink
                  categoryId={category.id}
                  className="cat-row"
                  label={`Show ${category.label} in the browser — ${plural(category.iconIds.length, 'icon')}`}
                >
                  <span
                    className="cat-row__block field"
                    style={{ '--cat': category.colour } as CSSProperties}
                  >
                    <Icon id={category.hero} size="46%" />
                  </span>
                  <span className="cat-row__text">
                    <span className="cat-row__title">
                      <span className="cat-row__n">{String(index + 1).padStart(2, '0')}</span>
                      <h3>{category.label}</h3>
                    </span>
                    <span className="cat-row__description">{category.description}</span>
                  </span>
                  <span className="cat-row__icons">
                    {category.iconIds.map((id) => (
                      <span key={id} title={getIcon(id)?.name ?? id}>
                        <Icon id={id} size={28} />
                      </span>
                    ))}
                    <span className="cat-row__count">
                      {plural(category.iconIds.length, 'icon')} →
                    </span>
                  </span>
                </CategoryLink>
              </li>
            ))}
          </ul>
          <a className="propose" href={SITE.newIssue} rel="noreferrer noopener">
            <span className="propose__text">
              Missing something? Propose an icon, a local name or a cultural correction.
            </span>
            <span className="propose__cta">Open an issue →</span>
          </a>
        </div>
      </div>
    </section>
  );
}
