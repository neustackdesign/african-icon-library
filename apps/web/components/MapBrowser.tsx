'use client';

import Link from 'next/link';
import { useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';

import { track } from '@/lib/analytics';
import { copyLabel, filterMaps } from '@/lib/browser';
import type { BrowserMap } from '@/lib/maps';

import { MapGlyph } from './MapGlyph';
import { useBrowser } from './landing/LibraryProvider';

interface Props {
  entries: BrowserMap[];
  regions: Array<{ id: string; label: string; count: number }>;
  /** Selected on wide screens before anyone has chosen. */
  defaultSelection: string;
  active: boolean;
}

function isTyping(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) || target.isContentEditable;
}

/**
 * The map view of the library browser: search, AIL region filter, a grid of
 * country outlines at their real proportions, and the same detail panel /
 * bottom sheet the icon view uses. No weight or size controls — a map is
 * drawn once, and the panel shows it large.
 */
export function MapBrowser({ entries, regions, defaultSelection, active }: Props) {
  const { isWide, copyText, copied } = useBrowser();
  const [query, setQuery] = useState('');
  const [region, setRegion] = useState('all');
  const [selectedId, setSelectedId] = useState<string | null>(
    entries.some((entry) => entry.map.id === defaultSelection)
      ? defaultSelection
      : (entries[0]?.map.id ?? null),
  );
  const [panelOpen, setPanelOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const deferredQuery = useDeferredValue(query);

  const regionLabels = useMemo(
    () => Object.fromEntries(regions.map((entry) => [entry.id, entry.label])),
    [regions],
  );
  const results = useMemo(
    () => filterMaps(entries, deferredQuery, region, regionLabels),
    [entries, deferredQuery, region, regionLabels],
  );

  useEffect(() => {
    if (!active || deferredQuery.trim().length < 2) return;
    track('search', { results: results.length, surface: 'map-browser' });
  }, [active, deferredQuery, results.length]);

  useEffect(() => {
    if (!active) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === '/' && !event.metaKey && !event.ctrlKey && !event.altKey) {
        if (isTyping(event.target)) return;
        event.preventDefault();
        searchRef.current?.focus();
        return;
      }
      if (event.key === 'Escape' && !isWide && panelOpen) {
        setPanelOpen(false);
        if (selectedId) {
          document.querySelector<HTMLElement>(`[data-map-id="${selectedId}"]`)?.focus();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active, isWide, panelOpen, selectedId]);

  useEffect(() => {
    const panel = panelRef.current;
    if (isWide || !panelOpen || !panel || getComputedStyle(panel).position === 'fixed') return;
    panel.scrollIntoView({ block: 'nearest' });
  }, [isWide, panelOpen, selectedId]);

  const toggle = (id: string) => {
    if (isWide) {
      setSelectedId(id);
      return;
    }
    if (panelOpen && selectedId === id) {
      setPanelOpen(false);
      return;
    }
    setSelectedId(id);
    setPanelOpen(true);
  };

  const selected = entries.find((entry) => entry.map.id === selectedId) ?? null;
  const showPanel = isWide || panelOpen;
  const pressedId = showPanel ? selectedId : null;
  const countLabel = `${results.length} of ${entries.length} maps`;

  return (
    <div className="browser" data-mode="maps">
      <div className="browser__toolbar browser__toolbar--single">
        <div className="search">
          <label className="visually-hidden" htmlFor="map-search">
            Search country maps
          </label>
          <input
            ref={searchRef}
            id="map-search"
            className="search__input"
            type="search"
            value={query}
            placeholder="Search Nigeria, DRC, KE, West Africa…"
            autoComplete="off"
            spellCheck={false}
            aria-describedby="map-search-count"
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Escape' && query) {
                event.stopPropagation();
                setQuery('');
              }
            }}
          />
          <span className="search__meta">
            <span id="map-search-count" aria-live="polite">
              {countLabel}
            </span>
            {query ? null : (
              <kbd className="kbd" title="Press / to search">
                /
              </kbd>
            )}
          </span>
        </div>
      </div>

      <div className="chips" role="group" aria-label="Filter by region">
        <button
          type="button"
          className="chip"
          aria-pressed={region === 'all'}
          onClick={() => setRegion('all')}
        >
          <span className="chip__key chip__key--all" aria-hidden="true" />
          All
          <span className="chip__count">{entries.length}</span>
        </button>
        {regions.map((entry) => (
          <button
            key={entry.id}
            type="button"
            className="chip"
            aria-pressed={region === entry.id}
            onClick={() => setRegion(entry.id)}
          >
            {entry.label}
            <span className="chip__count">{entry.count}</span>
          </button>
        ))}
      </div>

      <div className="browser__body">
        <div className="browser__results">
          {results.length > 0 ? (
            <ul className="icon-grid map-grid" aria-label="Country maps">
              {results.map((entry) => (
                <li key={entry.map.id}>
                  <button
                    type="button"
                    className="tile tile--map"
                    data-map-id={entry.map.id}
                    aria-pressed={entry.map.id === pressedId}
                    title={`${entry.map.name} · ${entry.map.iso3}`}
                    onClick={() => toggle(entry.map.id)}
                  >
                    <span className="tile__map">
                      <MapGlyph
                        body={entry.body}
                        width={entry.width}
                        height={entry.height}
                        size={48}
                        label={entry.map.name}
                      />
                    </span>
                    <span className="tile__label" aria-hidden="true">
                      {entry.map.name}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="empty">
              <p className="empty__title">
                {query ? `No country map matches “${query}”.` : 'No maps match this region.'}
              </p>
              <p className="empty__body">
                The library has outline maps of {entries.length} African countries. Search by name,
                a common alias, an ISO code such as NG or NGA, or a region.
              </p>
              {query ? (
                <div className="actions empty__actions">
                  <button type="button" className="btn btn--secondary" onClick={() => setQuery('')}>
                    Clear the search
                  </button>
                </div>
              ) : null}
            </div>
          )}
          <p className="browser__foot">
            <span>{countLabel} · 1.5 stroke · real proportions</span>
            <span>Select a country to copy or download</span>
          </p>
        </div>

        <aside
          ref={panelRef}
          className="panel"
          aria-label="Selected country map"
          data-open={!isWide && panelOpen ? '' : undefined}
        >
          {selected && showPanel ? (
            <MapDetail
              entry={selected}
              regionLabel={regionLabels[selected.map.region] ?? selected.map.region}
              closable={!isWide}
              onClose={() => setPanelOpen(false)}
              copyState={
                copied?.id === `map:${selected.map.id}` ? (copied.ok ? 'copied' : 'failed') : 'idle'
              }
              onCopy={() =>
                copyText(`map:${selected.map.id}`, `${selected.map.id}.svg`, selected.svg, () =>
                  track('map_copy', { target: selected.map.id, surface: 'map-browser' }),
                )
              }
            />
          ) : (
            <div className="panel__inner">
              <div className="panel__empty">
                <p>Select a country</p>
                <p>Copy the SVG, download the file, or open its map page.</p>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

function MapDetail({
  entry,
  regionLabel,
  closable,
  onClose,
  onCopy,
  copyState,
}: {
  entry: BrowserMap;
  regionLabel: string;
  closable: boolean;
  onClose: () => void;
  onCopy: () => void;
  copyState: 'idle' | 'copied' | 'failed';
}) {
  const { map, body, width, height, svg } = entry;
  return (
    <div className="panel__inner">
      <div className="panel__head">
        <div className="panel__preview field field--map">
          <MapGlyph body={body} width={width} height={height} size="70%" label={map.name} />
        </div>
        <div className="panel__summary">
          <div className="panel__title-row">
            <h3 className="panel__title panel__title--name">{map.name}</h3>
            {closable ? (
              <button type="button" className="panel__close" onClick={onClose}>
                Close
              </button>
            ) : null}
          </div>
          <p className="panel__description">{regionLabel}</p>
        </div>
      </div>

      <dl className="meta-list">
        <dt>id</dt>
        <dd>{map.id}</dd>
        <dt>iso</dt>
        <dd>
          {map.iso2} · {map.iso3}
        </dd>
        <dt>region</dt>
        <dd>{regionLabel}</dd>
        {map.aliases.length > 0 ? (
          <>
            <dt>also</dt>
            <dd className="muted">{map.aliases.join(', ')}</dd>
          </>
        ) : null}
      </dl>

      <div className="panel__actions">
        <button
          type="button"
          className="btn btn--primary"
          data-state={copyState === 'copied' ? 'copied' : undefined}
          onClick={onCopy}
        >
          {copyLabel(copyState)}
        </button>
        <a
          className="btn btn--secondary"
          href={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`}
          download={`${map.id}.svg`}
          onClick={() => track('map_download', { target: map.id, surface: 'map-browser' })}
        >
          Download SVG
        </a>
      </div>

      <Link className="mono-link" href={`/maps/${map.id}`}>
        Map details →
      </Link>
    </div>
  );
}
