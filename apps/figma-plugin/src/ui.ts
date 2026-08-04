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
 * Looks up an element the UI shell guarantees exists. The `_tag` argument names
 * the expected type at each call site; a missing node is a mistake in
 * `ui.html`, not a runtime condition worth recovering from.
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
const categorySelect = element('category', 'select');
const weightRow = element('weights', 'div');
const sizeSelect = element('size', 'select');
const grid = element('grid', 'div');
const emptyState = element('empty', 'div');
const detail = element('detail', 'div');
const detailName = element('detail-name', 'div');
const detailMeta = element('detail-meta', 'div');
const insertButton = element('insert', 'button');
const statusBar = element('status', 'div');
const contextBar = element('context', 'div');
const countLabel = element('count', 'div');

/* ------------------------------------------------------------------ *
 * Rendering
 * ------------------------------------------------------------------ */

function svgFor(id: string, weight: string): string {
  const sources = PLUGIN_SVG[id] ?? {};
  return sources[weight] ?? sources[DEFAULT_WEIGHT] ?? '';
}

/**
 * Builds the preview thumbnail.
 *
 * The bundled markup is trusted — it is compiled into this file from validated
 * assets and never comes from user input or the network — but it is still
 * parsed rather than assigned as HTML, so a malformed asset produces an empty
 * cell instead of anything executable.
 */
function thumbnail(id: string, weight: string): SVGSVGElement | null {
  const source = svgFor(id, weight);
  if (!source) return null;
  const parsed = new DOMParser().parseFromString(source, 'image/svg+xml');
  const root = parsed.documentElement;
  if (root.nodeName !== 'svg' || parsed.getElementsByTagName('parsererror').length > 0) return null;
  const imported = document.importNode(root, true) as unknown as SVGSVGElement;
  imported.setAttribute('width', '24');
  imported.setAttribute('height', '24');
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

function renderWeights(): void {
  weightRow.replaceChildren();

  for (const weight of PLUGIN_WEIGHTS) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'chip';
    button.textContent = weight;
    button.setAttribute('aria-pressed', String(weight === state.weight));
    button.addEventListener('click', () => {
      state.weight = weight;
      render();
    });
    weightRow.append(button);
  }

  // Weights the library has not drawn are shown as unavailable rather than
  // hidden, so the plugin never implies a weight exists when it does not.
  const undrawn = (['thin', 'regular', 'bold', 'fill'] as const).filter(
    (weight) => !PLUGIN_WEIGHTS.includes(weight),
  );
  for (const weight of undrawn) {
    const chip = document.createElement('span');
    chip.className = 'chip chip--unavailable';
    chip.textContent = weight;
    chip.title = `The ${weight} weight has not been drawn yet.`;
    weightRow.append(chip);
  }
}

function renderDetail(icons: Icon[]): void {
  const icon = icons.find((candidate) => candidate.id === state.selectedId) ?? null;
  if (!icon) {
    state.selectedId = null;
    detail.hidden = true;
    insertButton.disabled = true;
    return;
  }

  detail.hidden = false;
  insertButton.disabled = false;
  detailName.textContent = icon.name;

  const category = PLUGIN_CATEGORIES.find((entry) => entry.id === icon.category);
  detailMeta.textContent = [icon.id, category?.label, icon.regions.join(', ')]
    .filter(Boolean)
    .join(' · ');
}

function render(): void {
  const icons = results();

  renderWeights();

  grid.replaceChildren();
  for (const icon of icons) {
    const cell = document.createElement('button');
    cell.type = 'button';
    cell.className = 'cell';
    cell.dataset.id = icon.id;
    cell.title = `${icon.name} — ${icon.description}`;
    cell.setAttribute('aria-label', icon.name);
    cell.setAttribute('aria-pressed', String(icon.id === state.selectedId));

    const preview = thumbnail(icon.id, state.weight);
    if (preview) cell.append(preview);

    const label = document.createElement('span');
    label.className = 'cell__label';
    label.textContent = icon.id;
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
      ? `No icon matches "${state.query}". The library ships ${PLUGIN_ICONS.length} icons so far.`
      : 'No icons match these filters.';
  }

  countLabel.textContent = `${icons.length} of ${PLUGIN_ICONS.length} icons`;

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

for (const category of [{ id: 'all', label: 'All categories' }, ...PLUGIN_CATEGORIES]) {
  const option = document.createElement('option');
  option.value = category.id;
  option.textContent = category.label;
  categorySelect.append(option);
}

for (const size of SIZES) {
  const option = document.createElement('option');
  option.value = String(size);
  option.textContent = `${size} px`;
  option.selected = size === state.size;
  sizeSelect.append(option);
}

searchInput.addEventListener('input', () => {
  state.query = searchInput.value;
  render();
});

searchInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    const first = results()[0];
    if (first) {
      state.selectedId = first.id;
      render();
      requestInsert();
    }
  }
});

categorySelect.addEventListener('change', () => {
  state.category = categorySelect.value;
  render();
});

sizeSelect.addEventListener('change', () => {
  const parsed = Number(sizeSelect.value);
  state.size = Number.isFinite(parsed) && parsed > 0 ? parsed : 24;
});

insertButton.addEventListener('click', requestInsert);

window.addEventListener('message', (event: MessageEvent) => {
  const message = (event.data as { pluginMessage?: PluginMessage } | null)?.pluginMessage;
  if (!message) return;
  if (message.type === 'status') setStatus(message.text, message.level);
  if (message.type === 'context')
    contextBar.textContent = `Next insert lands ${message.destination}.`;
});

render();
send({ type: 'ready' });
