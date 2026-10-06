'use client';

import Link from 'next/link';
import {
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react';

import type { PublicCategory as Category } from '@/lib/public-icon';

import { track } from '@/lib/analytics';
import { categoryColour } from '@/lib/brand';
import { copyLabel, filterEntries } from '@/lib/browser';
import type { BrowserIcon } from '@/lib/icons';

import { IconGlyph } from './IconGlyph';
import { PREVIEW_SIZES, useBrowser } from './landing/LibraryProvider';

interface Props {
  categories: Category[];
  weightsShipped: readonly string[];
  /** Where new concepts are proposed when a search comes up empty. */
  proposeHref: string;
  /** False while the browser shows maps, so "/" and Escape act on the visible view only. */
  active?: boolean;
}

function isTyping(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return (
    target.tagName === 'INPUT' ||
    target.tagName === 'TEXTAREA' ||
    target.tagName === 'SELECT' ||
    target.isContentEditable
  );
}

export function IconBrowser({ categories, weightsShipped, proposeHref, active = true }: Props) {
  const {
    entries,
    byId,
    query,
    setQuery,
    category,
    setCategory,
    size,
    setSize,
    selectedId,
    panelOpen,
    isWide,
    toggle,
    closePanel,
    copy,
    copied,
  } = useBrowser();

  const searchRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const deferredQuery = useDeferredValue(query);

  const results = useMemo(
    () => filterEntries(entries, deferredQuery, category),
    [entries, deferredQuery, category],
  );

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const entry of entries) {
      map.set(entry.icon.category, (map.get(entry.icon.category) ?? 0) + 1);
    }
    return map;
  }, [entries]);

  useEffect(() => {
    // The query itself is never sent; the result count answers "is search
    // working" without recording what anyone typed.
    if (deferredQuery.trim().length < 2) return;
    track('search', { results: results.length, surface: 'browser' });
  }, [deferredQuery, results.length]);

  // "/" focuses search from anywhere on the page; Escape closes the sheet.
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
        closePanel();
        if (selectedId) {
          document.querySelector<HTMLElement>(`[data-icon-id="${selectedId}"]`)?.focus();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active, isWide, panelOpen, closePanel, selectedId]);

  // On tablet the panel sits above the grid, so a tile picked further down
  // would open it out of view. (On narrow it is a fixed sheet and needs nothing.)
  useEffect(() => {
    const panel = panelRef.current;
    if (isWide || !panelOpen || !panel || getComputedStyle(panel).position === 'fixed') return;
    panel.scrollIntoView({ block: 'nearest' });
  }, [isWide, panelOpen, selectedId]);

  const selected = selectedId ? (byId.get(selectedId) ?? null) : null;
  const showPanel = isWide || panelOpen;
  const pressedId = showPanel ? selectedId : null;
  const countLabel = `${results.length} of ${entries.length} icons`;

  const onSearchKey = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape' && query) {
      event.stopPropagation();
      setQuery('');
    }
  };

  return (
    <div className="browser">
      <div className="browser__toolbar">
        <div className="search">
          <label className="visually-hidden" htmlFor="icon-search">
            Search icons
          </label>
          <input
            ref={searchRef}
            id="icon-search"
            className="search__input"
            type="search"
            value={query}
            placeholder="Search jollof, danfo, drum…"
            autoComplete="off"
            spellCheck={false}
            aria-describedby="icon-search-count"
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={onSearchKey}
          />
          <span className="search__meta">
            <span id="icon-search-count" aria-live="polite">
              {countLabel}
            </span>
            {query ? null : (
              <kbd className="kbd" title="Press / to search">
                /
              </kbd>
            )}
          </span>
        </div>

        <div className="segmented" role="group" aria-label="Preview size">
          {PREVIEW_SIZES.map((value) => (
            <button
              key={value}
              type="button"
              aria-pressed={value === size}
              onClick={() => setSize(value)}
            >
              {value}px
            </button>
          ))}
        </div>
      </div>

      <div className="chips" role="group" aria-label="Filter by category">
        <button
          type="button"
          className="chip"
          aria-pressed={category === 'all'}
          onClick={() => setCategory('all')}
        >
          <span className="chip__key chip__key--all" aria-hidden="true" />
          All
          <span className="chip__count">{entries.length}</span>
        </button>
        {categories.map((entry) => (
          <button
            key={entry.id}
            type="button"
            className="chip"
            aria-pressed={category === entry.id}
            onClick={() => setCategory(entry.id)}
            style={{ '--cat': categoryColour(entry.id) } as CSSProperties}
          >
            <span className="chip__key" aria-hidden="true" />
            {entry.label}
            <span className="chip__count">{counts.get(entry.id) ?? 0}</span>
          </button>
        ))}
      </div>

      <div className="browser__body">
        <div className="browser__results">
          {results.length > 0 ? (
            <ul className="icon-grid" data-size={size} aria-label="Icons">
              {results.map((entry) => (
                <li key={entry.icon.id}>
                  <button
                    type="button"
                    className="tile"
                    data-icon-id={entry.icon.id}
                    aria-pressed={entry.icon.id === pressedId}
                    title={entry.icon.description}
                    onClick={() => toggle(entry.icon.id)}
                    style={{ '--cat': categoryColour(entry.icon.category) } as CSSProperties}
                  >
                    <IconGlyph body={entry.body} size={size} label={entry.icon.name} />
                    <span className="tile__label" aria-hidden="true">
                      {entry.icon.id}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="empty">
              <p className="empty__title">
                {query ? `Nothing matches “${query}” yet.` : 'No icons match these filters.'}
              </p>
              <p className="empty__body">
                The library ships {entries.length} icons today. If the concept you need is missing,
                open an issue — the roadmap is public.
              </p>
              <div className="actions empty__actions">
                {query ? (
                  <button type="button" className="btn btn--secondary" onClick={() => setQuery('')}>
                    Clear the search
                  </button>
                ) : null}
                <a className="btn btn--text" href={proposeHref} rel="noreferrer noopener">
                  Suggest an icon →
                </a>
              </div>
            </div>
          )}
          <p className="browser__foot">
            <span>
              {countLabel} · weight: {weightsShipped.join(', ')}
            </span>
            <span>Select an icon to copy or download</span>
          </p>
        </div>

        <aside
          ref={panelRef}
          className="panel"
          aria-label="Selected icon"
          data-open={!isWide && panelOpen ? '' : undefined}
        >
          {selected && showPanel ? (
            <DetailPanel
              entry={selected}
              categories={categories}
              weightsShipped={weightsShipped}
              closable={!isWide}
              onClose={closePanel}
              onCopy={() => copy(selected.icon.id, 'browser')}
              copyState={
                copied?.id === selected.icon.id ? (copied.ok ? 'copied' : 'failed') : 'idle'
              }
            />
          ) : (
            <div className="panel__inner">
              <div className="panel__empty">
                <p>Select an icon</p>
                <p>Copy the SVG, download the file, or open its detail page.</p>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

interface DetailProps {
  entry: BrowserIcon;
  categories: Category[];
  weightsShipped: readonly string[];
  closable: boolean;
  onClose: () => void;
  onCopy: () => void;
  copyState: 'idle' | 'copied' | 'failed';
}

function DetailPanel({
  entry,
  categories,
  weightsShipped,
  closable,
  onClose,
  onCopy,
  copyState,
}: DetailProps) {
  const { icon, body, svg } = entry;
  const categoryLabel =
    categories.find((item) => item.id === icon.category)?.label ?? icon.category;

  return (
    <div className="panel__inner">
      <div className="panel__head">
        <div
          className="panel__preview field"
          style={{ '--cat': categoryColour(icon.category) } as CSSProperties}
        >
          <span className="grid-overlay" aria-hidden="true" />
          <IconGlyph body={body} size="45%" className="panel__glyph" label={icon.name} />
        </div>
        <div className="panel__summary">
          <div className="panel__title-row">
            <h3 className="panel__title">{icon.id}</h3>
            {closable ? (
              <button type="button" className="panel__close" onClick={onClose}>
                Close
              </button>
            ) : null}
          </div>
          <p className="panel__description">{icon.description}</p>
        </div>
      </div>

      <dl className="meta-list">
        <dt>category</dt>
        <dd>{categoryLabel}</dd>
        <dt>region</dt>
        <dd>{icon.regions.join(', ')}</dd>
        <dt>weight</dt>
        <dd>{weightsShipped.join(', ')} · 1.5 stroke</dd>
        <dt>keywords</dt>
        <dd className="muted">{icon.keywords.slice(0, 5).join(', ')}</dd>
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
          download={`${icon.id}.svg`}
          onClick={() => track('icon_download', { target: icon.id, surface: 'browser' })}
        >
          Download SVG
        </a>
      </div>

      <Link className="mono-link" href={`/icons/${icon.id}`}>
        Icon details →
      </Link>
    </div>
  );
}
