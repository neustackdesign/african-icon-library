/**
 * Plugin UI thread.
 *
 * Runs in a sandboxed iframe with no network access. Every icon, label and
 * search term is compiled into this bundle; nothing is fetched at runtime.
 */

import { searchIcons, type Icon } from '@african-icon-library/metadata';

import { PLUGIN_CATEGORIES, PLUGIN_ICONS, PLUGIN_SVG, PLUGIN_WEIGHTS } from './generated/icon-data';
import type { PluginMessage, UiMessage } from './messages';

const DEFAULT_WEIGHT = 'regular';
const SIZES = [16, 24, 32, 48];

interface State {
  query: string;
  category: string;
  weight: string;
  size: number;
  selectedId: string | null;
}

const state: State = {
  query: '',
  category: 'all',
  weight: PLUGIN_WEIGHTS.includes(DEFAULT_WEIGHT)
    ? DEFAULT_WEIGHT
    : (PLUGIN_WEIGHTS[0] ?? DEFAULT_WEIGHT),
  size: 24,
  selectedId: null,
};

function send(message: UiMessage): void {
  parent.postMessage({ pluginMessage: message }, '*');
}

/**
 * Looks up an element the UI shell guarantees exists. A missing node is a build
 * error in `ui.html`, not a runtime state worth silently recovering from.
 */
function element<K extends keyof HTMLElementTagNameMap>(
  id: string,
  _tag: K,
): HTMLElementTagNameMap[K] {
  const node = document.getElementById(id);
  if (!node) throw new Error(`missing element #${id}`);
  return node as HTMLElementTagNameMap[K];
}

const searchInput = element('search', 'input');
const categoryRow = element('categories', 'div');
const weightControl = element('weight-control', 'div');
const weightRow = element('weights', 'div');
const sizeRow = element('sizes', 'div');
const grid = element('grid', 'div');
const emptyState = element('empty', 'div');
const detail = element('detail', 'section');
const detailPreview = element('detail-preview', 'div');
const detailName = element('detail-name', 'div');
const detailMeta = element('detail-meta', 'div');
const insertButton = element('insert', 'button');
const statusBar = element('status', 'div');
const contextBar = element('context', 'div');
const countLabel = element('count', 'span');
const libraryMeta = element('library-meta', 'span');

/* ------------------------------------------------------------------ *
 * Rendering
 * ------------------------------------------------------------------ */

function svgFor(id: string, weight: string): string {
  const sources = PLUGIN_SVG[id] ?? {};
  return sources[weight] ?? sources[DEFAULT_WEIGHT] ?? '';
}

/**
 * Builds a preview thumbnail from a bundled, validated SVG. The markup is
 * parsed rather than assigned as HTML so a malformed build produces no preview
 * instead of executable DOM.
 */
function thumbnail(id: string, weight: string, size = 24): SVGSVGElement | null {
  const source = svgFor(id, weight);
  if (!source) return null;
  const parsed = new DOMParser().parseFromString(source, 'image/svg+xml');
  const root = parsed.documentElement;
  if (root.nodeName !== 'svg' || parsed.getElementsByTagName('parsererror').length > 0) return null;
  const imported = document.importNode(root, true) as unknown as SVGSVGElement;
  imported.setAttribute('width', String(size));
  imported.setAttribute('height', String(size));
  imported.setAttribute('aria-hidden', 'true');
  imported.setAttribute('focusable', 'false');
  return imported;
}

function results(): Icon[] {
  return searchIcons(PLUGIN_ICONS, state.query, {
    category: state.category === 'all' ? null : state.category,
    weight: state.weight,
  }).map((result) => result.icon);
}

function pressable(
  label: string,
  pressed: boolean,
  className: string,
  onPress: () => void,
): HTMLButtonElement {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = className;
  button.textContent = label;
  button.setAttribute('aria-pressed', String(pressed));
  button.addEventListener('click', onPress);
  return button;
}

function renderCategories(): void {
  categoryRow.replaceChildren();
  const choices = [{ id: 'all', label: 'All' }, ...PLUGIN_CATEGORIES];
  for (const category of choices) {
    categoryRow.appendChild(
      pressable(category.label, state.category === category.id, 'chip', () => {
        state.category = category.id;
        state.selectedId = null;
        render();
      }),
    );
  }
}

function renderSizes(): void {
  sizeRow.replaceChildren();
  for (const size of SIZES) {
    sizeRow.appendChild(
      pressable(String(size), state.size === size, 'segment', () => {
        state.size = size;
        renderSizes();
      }),
    );
  }
}

function renderWeights(): void {
  weightRow.replaceChildren();
  const hasChoice = PLUGIN_WEIGHTS.length > 1;
  weightControl.hidden = !hasChoice;
  if (!hasChoice) return;

  for (const weight of PLUGIN_WEIGHTS) {
    const label = weight.charAt(0).toUpperCase() + weight.slice(1);
    weightRow.appendChild(
      pressable(label, weight === state.weight, 'segment', () => {
        state.weight = weight;
        state.selectedId = null;
        render();
      }),
    );
  }
}

function renderDetail(icons: Icon[]): void {
  const icon = icons.find((candidate) => candidate.id === state.selectedId) ?? null;
  if (!icon) {
    state.selectedId = null;
    detail.hidden = true;
    insertButton.disabled = true;
    detailPreview.replaceChildren();
    return;
  }

  detail.hidden = false;
  insertButton.disabled = false;
  detailName.textContent = icon.name;

  const category = PLUGIN_CATEGORIES.find((entry) => entry.id === icon.category);
  detailMeta.textContent = [category?.label, icon.regions.join(', '), `${state.size}px`]
    .filter(Boolean)
    .join(' · ');

  detailPreview.replaceChildren();
  const preview = thumbnail(icon.id, state.weight, 28);
  if (preview) detailPreview.appendChild(preview);
}

function render(): void {
  const icons = results();

  renderCategories();
  renderWeights();
  renderSizes();

  grid.replaceChildren();
  for (const icon of icons) {
    const cell = document.createElement('button');
    cell.type = 'button';
    cell.className = 'cell';
    cell.dataset.id = icon.id;
    cell.dataset.category = icon.category;
    cell.title = `${icon.name} — ${icon.description}`;
    cell.setAttribute('aria-label', icon.name);
    cell.setAttribute('aria-pressed', String(icon.id === state.selectedId));

    const preview = thumbnail(icon.id, state.weight);
    if (preview) cell.append(preview);

    const label = document.createElement('span');
    label.className = 'cell__label';
    label.textContent = icon.name;
    cell.append(label);

    cell.addEventListener('click', () => {
      state.selectedId = icon.id;
      render();
    });
    cell.addEventListener('dblclick', () => {
      state.selectedId = icon.id;
      requestInsert();
    });

    grid.append(cell);
  }

  const hasResults = icons.length > 0;
  grid.hidden = !hasResults;
  emptyState.hidden = hasResults;
  if (!hasResults) {
    emptyState.textContent = state.query
      ? `No icon matches “${state.query}”. Try a broader term or another category.`
      : 'No icons match these filters.';
  }

  countLabel.textContent = `${icons.length} / ${PLUGIN_ICONS.length}`;
  libraryMeta.textContent = `${PLUGIN_ICONS.length} icons · 24px system · starting with Nigeria`;

  renderDetail(icons);
  reportHeight();
}

function reportHeight(): void {
  send({ type: 'resize', height: Math.ceil(document.documentElement.scrollHeight) });
}

/* ------------------------------------------------------------------ *
 * Actions
 * ------------------------------------------------------------------ */

function requestInsert(): void {
  if (!state.selectedId) return;
  send({ type: 'insert', id: state.selectedId, weight: state.weight, size: state.size });
}

function setStatus(text: string, level: 'info' | 'error'): void {
  statusBar.textContent = text;
  statusBar.dataset.level = level;
}

/* ------------------------------------------------------------------ *
 * Wiring
 * ------------------------------------------------------------------ */

searchInput.addEventListener('input', () => {
  state.query = searchInput.value;
  state.selectedId = null;
  render();
});

searchInput.addEventListener('keydown', (event) => {
  if (event.key !== 'Enter') return;
  const first = results()[0];
  if (!first) return;
  state.selectedId = first.id;
  render();
  requestInsert();
});

insertButton.addEventListener('click', requestInsert);

window.addEventListener('message', (event: MessageEvent) => {
  const message = (event.data as { pluginMessage?: PluginMessage } | null)?.pluginMessage;
  if (!message) return;
  if (message.type === 'status') setStatus(message.text, message.level);
  if (message.type === 'context')
    contextBar.textContent = `Insert destination: ${message.destination}.`;
});

render();
send({ type: 'ready' });
