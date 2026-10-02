import type { CSSProperties } from 'react';

import { getIcon } from '@african-icon-library/metadata';

import { categoryColour } from '@/lib/brand';
import { ROUTE, ROUTE_FRAME, routePoints } from '@/lib/compositions';

import { Icon } from '../Icon';

const { width: ROUTE_W, height: ROUTE_H, tag: TAG } = ROUTE_FRAME;

function routeCategories(): number {
  return new Set(ROUTE.map((stop) => getIcon(stop.id)?.category)).size;
}

function catStyle(categoryId: string): CSSProperties {
  return { '--cat': categoryColour(categoryId) } as CSSProperties;
}

export function ContextSection() {
  return (
    <section aria-labelledby="context-title">
      <div className="shell section section-grid">
        <p className="section-label">In context</p>
        <div className="section-head">
          <h2 id="context-title">Drawn for real product surfaces.</h2>
          <p className="note">
            Illustrative interfaces using released icons at working sizes. Not customer products.
          </p>
        </div>

        <div className="context">
          <figure className="route-card">
            <figcaption className="route-card__head">
              <span>An ordinary day</span>
              <span>
                {ROUTE.length} icons · {routeCategories()} categories
              </span>
            </figcaption>
            <div className="route">
              <svg
                className="route__path"
                viewBox={`0 0 ${ROUTE_W} ${ROUTE_H}`}
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <polyline
                  points={routePoints()}
                  fill="none"
                  stroke="var(--text-3)"
                  strokeWidth={1.5}
                  strokeDasharray="6 7"
                />
              </svg>
              <ol className="route__stops">
                {ROUTE.map((stop) => {
                  const icon = getIcon(stop.id);
                  return (
                    <li
                      key={stop.id}
                      className="route__stop"
                      style={
                        {
                          '--x': `${(stop.x / ROUTE_W) * 100}%`,
                          '--y': `${((stop.y + TAG) / ROUTE_H) * 100}%`,
                        } as CSSProperties
                      }
                    >
                      <span className="route__field field" style={catStyle(icon?.category ?? '')}>
                        <Icon id={stop.id} labelled />
                      </span>
                      <span className="label-tag">{stop.tag}</span>
                    </li>
                  );
                })}
              </ol>
            </div>
          </figure>

          <div className="stages">
            <FoodStage />
            <CommerceStage />
            <CivicStage />
          </div>
        </div>
      </div>
    </section>
  );
}

function FoodStage() {
  return (
    <figure className="stage" style={catStyle('food-drink')}>
      <figcaption className="stage__label">Food &amp; Drink · ordering</figcaption>
      <div className="ui-card">
        <span className="ui-card__title">Lunch menu</span>
        <ul className="ui-pills">
          <li className="ui-pill ui-pill--on">
            <Icon id="jollof-rice" size={16} />
            Rice
          </li>
          <li className="ui-pill">
            <Icon id="suya" size={16} />
            Grills
          </li>
          <li className="ui-pill">
            <Icon id="pepper-soup" size={16} />
            Soups
          </li>
        </ul>
        <ul className="ui-rows ui-rows--menu">
          <li className="ui-row">
            <Icon id="jollof-rice" />
            <span className="ui-row__label">Jollof rice</span>
            <span className="ui-figure">₦3,500</span>
          </li>
          <li className="ui-row">
            <Icon id="suya" />
            <span className="ui-row__label">Suya, per stick</span>
            <span className="ui-figure">₦1,000</span>
          </li>
          <li className="ui-row">
            <Icon id="akara" />
            <span className="ui-row__label">Akara, five pieces</span>
            <span className="ui-figure">₦800</span>
          </li>
        </ul>
        <span className="ui-bar">
          <span>View order</span>
          <span className="ui-figure">₦4,500</span>
        </span>
      </div>
    </figure>
  );
}

function CommerceStage() {
  return (
    <figure className="stage" style={catStyle('commerce-industry')}>
      <figcaption className="stage__label">Commerce · point of sale</figcaption>
      <div className="ui-card ui-card--ink">
        <span className="ui-card__title">Today’s sales</span>
        <span className="ui-total">
          <Icon id="naira-sign" size={28} labelled />
          158,500
        </span>
        <ul className="ui-rows">
          <li className="ui-row">
            <Icon id="pos-terminal" size={22} />
            <span className="ui-row__label">Card · POS</span>
            <span className="ui-figure">₦96,000</span>
          </li>
          <li className="ui-row">
            <Icon id="naira-note" size={22} />
            <span className="ui-row__label">Cash</span>
            <span className="ui-figure">₦62,500</span>
          </li>
          <li className="ui-row ui-row--muted">
            <Icon id="jerry-can" size={22} />
            <span className="ui-row__label">Generator fuel</span>
            <span className="ui-figure">−₦6,000</span>
          </li>
        </ul>
        <span className="ui-bar">
          <Icon id="pos-terminal" size={18} />
          Take payment
        </span>
      </div>
    </figure>
  );
}

function CivicStage() {
  return (
    <figure className="stage" style={catStyle('identity-state')}>
      <figcaption className="stage__label">Civic · culture</figcaption>
      <div className="ui-card">
        <span className="ui-card__title">Passport renewal</span>
        <div className="ui-booking">
          <Icon id="passport" size={30} />
          <span className="ui-booking__text">
            <span>Appointment booked</span>
            <span>Thursday · 10:30</span>
          </span>
        </div>
        <span className="ui-kicker">This weekend</span>
        <ul className="ui-rows">
          <li className="ui-row">
            <Icon id="talking-drum" size={22} />
            <span className="ui-row__label">Talking drum workshop</span>
            <span className="ui-day">Sat</span>
          </li>
          <li className="ui-row">
            <Icon id="film-clapper" size={22} />
            <span className="ui-row__label">Short film screening</span>
            <span className="ui-day">Sat</span>
          </li>
          <li className="ui-row">
            <Icon id="beaded-crown" size={22} />
            <span className="ui-row__label">Regalia exhibition</span>
            <span className="ui-day">Sun</span>
          </li>
        </ul>
      </div>
    </figure>
  );
}
