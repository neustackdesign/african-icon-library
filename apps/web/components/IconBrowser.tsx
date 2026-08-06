'use client';

import Link from 'next/link';
import { useCallback, useDeferredValue, useEffect, useMemo, useState } from 'react';

import { searchIcons, type Category, type Icon } from '@african-icon-library/metadata';

import { track } from '@/lib/analytics';

export interface BrowserIcon {
  icon: Icon;
  /** Inner markup for the regular weight. Injected as SVG, never as HTML. */
  body: string;
  /** The complete, copyable SVG document. */
  svg: string;
}

interface Props {
  entries: BrowserIcon[];
  categories: Category[];
  weightsShipped: readonly string[];
  weightsPlanned: readonly string[];
}

const SIZES = [16, 24, 32, 48] as const;

export function IconBrowser({ entries, categories, weightsShipped, weightsPlanned }: Props) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [size, setSize] = useState<number>(32);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const deferredQuery = useDeferredValue(query);

  const byId = useMemo(() => new Map(entries.map((entry) => [entry.icon.id, entry])), [entries]);

  const results = useMemo(() => {
    const icons = entries.map((entry) => entry.icon);
    return searchIcons(icons, deferredQuery, {
      category: category === 'all' ? null : category,
    }).map((result) => byId.get(result.icon.id)!);
  }, [entries, byId, deferredQuery, category]);

  useEffect(() => {
    // The query itself is never sent; the result count answers "is search
    // working" without recording what anyone typed.
    if (deferredQuery.trim().length < 2) return;
    track('search', { results: results.length, surface: 'browser' });
  }, [deferredQuery, results.length]);

  const selected = selectedId ? (byId.get(selectedId) ?? null) : null;

  const copy = useCallback(async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      track('icon_copy', { target: id, surface: 'browser' });
      setCopied(id);
      window.setTimeout(() => setCopied((current) => (current === id ? null : current)), 2000);
    } catch {
      // Clipboard access can be refused (permissions, insecure context). Say so
      // rather than pretending the copy worked.
      setCopied('__failed__');
      window.setTimeout(() => setCopied(null), 3000);
    }
  }, []);

  return (
    <div>
      <div className="browser__controls">
        <label className="visually-hidden" htmlFor="icon-search">
          Search icons
        </label>
        <input
          id="icon-search"
          className="input"
          type="search"
          value={query}
          placeholder="Search jollof, danfo, drum…"
          autoComplete="off"
          onChange={(event) => setQuery(event.target.value)}
        />

        <label className="visually-hidden" htmlFor="icon-category">
          Category
        </label>
        <select
          id="icon-category"
          className="select"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
        >
          <option value="all">All categories</option>
          {categories.map((entry) => (
            <option key={entry.id} value={entry.id}>
              {entry.label}
            </option>
          ))}
        </select>

        <label className="visually-hidden" htmlFor="icon-size">
          Preview size
        </label>
        <select
          id="icon-size"
          className="select"
          value={size}
          onChange={(event) => setSize(Number(event.target.value))}
        >
          {SIZES.map((value) => (
            <option key={value} value={value}>
              Preview at {value} px
            </option>
          ))}
        </select>
      </div>

      <div className="browser__meta">
        <span aria-live="polite">
          {results.length} of {entries.length} icons
        </span>
        <span>
          weight: {weightsShipped.join(', ')}
          {weightsPlanned.length > 0 ? ` · not drawn yet: ${weightsPlanned.join(', ')}` : ''}
        </span>
      </div>

      {selected ? (
        <div className="detail-panel">
          <div className="detail-panel__preview">
            <IconMark body={selected.body} size={48} label={selected.icon.name} />
          </div>

          <div>
            <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: '1rem' }}>{selected.icon.id}</h3>
            <p className="muted" style={{ marginTop: '0.25rem' }}>
              {selected.icon.description}
            </p>
            <ul className="tag-row">
              <li className="tag">{categoryLabel(categories, selected.icon.category)}</li>
              {selected.icon.regions.map((region) => (
                <li className="tag" key={region}>
                  {region}
                </li>
              ))}
              {selected.icon.weights.map((weight) => (
                <li className="tag" key={weight}>
                  {weight}
                </li>
              ))}
              {weightsPlanned.map((weight) => (
                <li className="tag tag--muted" key={weight} title="Not drawn yet">
                  {weight} — not drawn
                </li>
              ))}
            </ul>
          </div>

          <div className="detail-panel__actions">
            <button
              type="button"
              className="button"
              onClick={() => void copy(selected.icon.id, selected.svg)}
            >
              {copied === selected.icon.id
                ? 'Copied'
                : copied === '__failed__'
                  ? 'Copy blocked'
                  : 'Copy SVG'}
            </button>
            <a
              className="button button--ghost"
              href={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(selected.svg)}`}
              download={`${selected.icon.id}.svg`}
              onClick={() =>
                track('icon_download', { target: selected.icon.id, surface: 'browser' })
              }
            >
              Download SVG
            </a>
            <Link className="button button--ghost" href={`/icons/${selected.icon.id}`}>
              Details
            </Link>
            <button
              type="button"
              className="button button--ghost"
              onClick={() => setSelectedId(null)}
            >
              Close
            </button>
          </div>
        </div>
      ) : null}

      {results.length > 0 ? (
        <ul className="icon-grid">
          {results.map((entry) => (
            <li key={entry.icon.id}>
              <button
                type="button"
                className="icon-tile"
                aria-pressed={entry.icon.id === selectedId}
                onClick={() => setSelectedId(entry.icon.id === selectedId ? null : entry.icon.id)}
                title={entry.icon.description}
              >
                <IconMark body={entry.body} size={size} label={entry.icon.name} />
                <span className="icon-tile__label">{entry.icon.id}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="empty-state">
          <p>{query ? `Nothing matches “${query}” yet.` : 'No icons match these filters.'}</p>
          <p className="mono">
            The library ships {entries.length} icons today. If the concept you need is missing, open
            an issue — the roadmap is public.
          </p>
          {query ? (
            <button type="button" className="button button--ghost" onClick={() => setQuery('')}>
              Clear the search
            </button>
          ) : null}
        </div>
      )}
    </div>
  );
}

function categoryLabel(categories: Category[], id: string): string {
  return categories.find((category) => category.id === id)?.label ?? id;
}

function IconMark({ body, size, label }: { body: string; size: number; label: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label={label}
      focusable="false"
      // The markup is compiled into the bundle from validated assets: no
      // element outside the allow-list survives `npm run validate`, and none of
      // it comes from user input or a network response.
      dangerouslySetInnerHTML={{ __html: body }}
    />
  );
}
