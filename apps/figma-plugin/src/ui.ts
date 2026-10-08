/**
 * Plugin UI thread.
 *
 * Runs in a sandboxed iframe with no network access. Every icon, map, label
 * and search term is compiled into this bundle; nothing is fetched at runtime.
 *
 * Two asset types share one shell: Icons (unchanged behaviour — category,
 * weight, 16–48 px) and Maps (region, 64–512 px fitted to the longest side, no
 * weight). Each mode keeps its own query, filter, size and selection.
 */

import type { CountryMap, Icon } from '@african-icon-library/metadata';
// Data-free search: the plugin's records come from its own generated bundle.
import { searchIcons, searchMaps } from '@african-icon-library/metadata/search';

import { PLUGIN_CATEGORIES, PLUGIN_ICONS, PLUGIN_SVG, PLUGIN_WEIGHTS } from './generated/icon-data';
import {
  PLUGIN_MAPS,
  PLUGIN_MAP_BOXES,
  PLUGIN_MAP_REGIONS,
  PLUGIN_MAP_SVG,
} from './generated/map-data';
import {
  DEFAULT_MAP_SIZE,
  MAP_SIZES,
  fitToBox,
  type PluginMessage,
  type UiMessage,
} from './messages';

const DEFAULT_WEIGHT = 'regular';
const ICON_SIZES = [16, 24, 32, 48];

type Mode = 'icons' | 'maps';

interface ModeState {
  query: string;
  /** Category id (icons) or region id (maps); `all` for no filter. */
  filter: string;
  size: number;
  selectedId: string | null;
}

const state: { mode: Mode; weight: string; icons: ModeState; maps: ModeState } = {
  mode: 'icons',
  weight: PLUGIN_WEIGHTS.includes(DEFAULT_WEIGHT)
    ? DEFAULT_WEIGHT
    : (PLUGIN_WEIGHTS[0] ?? DEFAULT_WEIGHT),
  icons: { query: '', filter: 'all', size: 24, selectedId: null },
  maps: { query: '', filter: 'all', size: DEFAULT_MAP_SIZE, selectedId: null },
};

const regionLabels: Record<string, string> = Object.fromEntries(
  PLUGIN_MAP_REGIONS.map((region) => [region.id, region.label]),
);

function current(): ModeState {
  return state[state.mode];
}

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

const modeIcons = element('mode-icons', 'button');
const modeMaps = element('mode-maps', 'button');
const searchInput = element('search', 'input');
const searchLabel = element('search-label', 'label');
const filterSelect = element('category', 'select');
const filterLabel = element('filter-label', 'label');
const weightsBar = element('weights-bar', 'div');
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
 * Parses bundled markup into an SVG element.
 *
 * The bundled markup is trusted — it is compiled into this file from validated
 * assets and never comes from user input or the network — but it is still
 * parsed rather than assigned as HTML, so a malformed asset produces an empty
 * cell instead of anything executable.
 */
function parseSvgElement(source: string): SVGSVGElement | null {
  if (!source) return null;
  const parsed = new DOMParser().parseFromString(source, 'image/svg+xml');
  const root = parsed.documentElement;
  if (root.nodeName !== 'svg' || parsed.getElementsByTagName('parsererror').length > 0) return null;
  const imported = document.importNode(root, true) as unknown as SVGSVGElement;
  imported.setAttribute('aria-hidden', 'true');
  imported.setAttribute('focusable', 'false');
  return imported;
}

function thumbnail(id: string, weight: string): SVGSVGElement | null {
  const svg = parseSvgElement(svgFor(id, weight));
  svg?.setAttribute('width', '24');
  svg?.setAttribute('height', '24');
  return svg;
}

/** A map preview whose longest side is 30 px; the other side keeps the map's proportions. */
function mapThumbnail(id: string): SVGSVGElement | null {
  const svg = parseSvgElement(PLUGIN_MAP_SVG[id] ?? '');
  const box = PLUGIN_MAP_BOXES[id];
  if (!svg || !box) return svg;
  const fitted = fitToBox(box[0], box[1], 30);
  svg.setAttribute('width', String(fitted.width));
  svg.setAttribute('height', String(fitted.height));
  return svg;
}

function iconResults(): Icon[] {
  return searchIcons(PLUGIN_ICONS, state.icons.query, {
    category: state.icons.filter === 'all' ? null : state.icons.filter,
    weight: state.weight,
  }).map((result) => result.icon);
}

function mapResults(): CountryMap[] {
  return searchMaps(PLUGIN_MAPS, state.maps.query, {
    region: state.maps.filter === 'all' ? null : state.maps.filter,
    regionLabels,
  }).map((result) => result.map);
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

/** Rebuilds the filter and size selects for the active mode. */
function renderControls(): void {
  const maps = state.mode === 'maps';
  modeIcons.setAttribute('aria-pressed', String(!maps));
  modeMaps.setAttribute('aria-pressed', String(maps));

  searchInput.value = current().query;
  searchInput.placeholder = maps
    ? 'Search Nigeria, DRC, KE, West Africa…'
    : 'Search jollof, danfo, drum…';
  searchLabel.textContent = maps ? 'Search country maps' : 'Search icons';
  filterLabel.textContent = maps ? 'Region' : 'Category';
  sizeSelect.setAttribute('aria-label', maps ? 'Insert size, longest side' : 'Insert size');

  const options = maps
    ? [{ id: 'all', label: 'All regions' }, ...PLUGIN_MAP_REGIONS]
    : [{ id: 'all', label: 'All categories' }, ...PLUGIN_CATEGORIES];
  filterSelect.replaceChildren(
    ...options.map((entry) => {
      const option = document.createElement('option');
      option.value = entry.id;
      option.textContent = entry.label;
      option.selected = entry.id === current().filter;
      return option;
    }),
  );

  const sizes: readonly number[] = maps ? MAP_SIZES : ICON_SIZES;
  sizeSelect.replaceChildren(
    ...sizes.map((size) => {
      const option = document.createElement('option');
      option.value = String(size);
      option.textContent = maps ? `${size} px longest side` : `${size} px`;
      option.selected = size === current().size;
      return option;
    }),
  );

  // Maps have no weight: the row disappears rather than offering a control
  // that would do nothing.
  weightsBar.hidden = maps;
}

interface CellSpec {
  id: string;
  name: string;
  label: string;
  title: string;
  preview: SVGSVGElement | null;
}

function select(id: string, ids: string[]): void {
  current().selectedId = id;
  for (const cell of grid.querySelectorAll<HTMLButtonElement>('.cell')) {
    cell.setAttribute('aria-pressed', String(cell.dataset.id === id));
  }
  renderDetail(ids);
  reportHeight();
}

function renderGrid(cells: CellSpec[]): void {
  const mode = current();
  const ids = cells.map((spec) => spec.id);
  grid.replaceChildren();
  grid.classList.toggle('grid--maps', state.mode === 'maps');
  for (const spec of cells) {
    const cell = document.createElement('button');
    cell.type = 'button';
    cell.className = 'cell';
    cell.dataset.id = spec.id;
    cell.title = spec.title;
    cell.setAttribute('aria-label', spec.name);
    cell.setAttribute('aria-pressed', String(spec.id === mode.selectedId));

    if (spec.preview) {
      if (state.mode === 'maps') {
        const frame = document.createElement('span');
        frame.className = 'cell__map';
        frame.append(spec.preview);
        cell.append(frame);
      } else {
        cell.append(spec.preview);
      }
    }

    const label = document.createElement('span');
    label.className = 'cell__label';
    label.textContent = spec.label;
    cell.append(label);

    // Selecting updates the pressed state and the detail panel in place. The
    // grid is not rebuilt, so the second click of a double-click lands on the
    // same cell instead of a freshly created one.
    cell.addEventListener('click', () => select(spec.id, ids));
    cell.addEventListener('dblclick', () => {
      mode.selectedId = spec.id;
      requestInsert();
    });

    grid.append(cell);
  }
}

function renderDetail(ids: string[]): void {
  const mode = current();
  if (!mode.selectedId || !ids.includes(mode.selectedId)) {
    mode.selectedId = null;
    detail.hidden = true;
    insertButton.disabled = true;
    return;
  }

  detail.hidden = false;
  insertButton.disabled = false;

  if (state.mode === 'maps') {
    const map = PLUGIN_MAPS.find((candidate) => candidate.id === mode.selectedId)!;
    detailName.textContent = map.name;
    detailMeta.textContent = [map.iso2, map.iso3, regionLabels[map.region]]
      .filter(Boolean)
      .join(' · ');
    insertButton.setAttribute('aria-label', `Insert ${map.name} map`);
    return;
  }

  const icon = PLUGIN_ICONS.find((candidate) => candidate.id === mode.selectedId)!;
  detailName.textContent = icon.name;
  const category = PLUGIN_CATEGORIES.find((entry) => entry.id === icon.category);
  detailMeta.textContent = [icon.id, category?.label, icon.regions.join(', ')]
    .filter(Boolean)
    .join(' · ');
  insertButton.setAttribute('aria-label', `Insert ${icon.name}`);
}

function render(): void {
  renderControls();

  let ids: string[];
  let total: number;
  let noun: string;
  if (state.mode === 'maps') {
    const maps = mapResults();
    renderGrid(
      maps.map((map) => ({
        id: map.id,
        name: map.name,
        label: map.name,
        title: `${map.name} · ${map.iso3} · ${regionLabels[map.region] ?? map.region}`,
        preview: mapThumbnail(map.id),
      })),
    );
    ids = maps.map((map) => map.id);
    total = PLUGIN_MAPS.length;
    noun = 'maps';
  } else {
    renderWeights();
    const icons = iconResults();
    renderGrid(
      icons.map((icon) => ({
        id: icon.id,
        name: icon.name,
        label: icon.id,
        title: `${icon.name} — ${icon.description}`,
        preview: thumbnail(icon.id, state.weight),
      })),
    );
    ids = icons.map((icon) => icon.id);
    total = PLUGIN_ICONS.length;
    noun = 'icons';
  }

  const hasResults = ids.length > 0;
  grid.hidden = !hasResults;
  emptyState.hidden = hasResults;
  if (!hasResults) {
    const query = current().query;
    emptyState.textContent =
      state.mode === 'maps'
        ? query
          ? `No country map matches "${query}". Try a name, an ISO code such as NG, or a region.`
          : 'No maps match this region.'
        : query
          ? `No icon matches "${query}". The library ships ${PLUGIN_ICONS.length} icons so far.`
          : 'No icons match these filters.';
  }

  countLabel.textContent = `${ids.length} of ${total} ${noun}`;

  renderDetail(ids);
  reportHeight();
}

function reportHeight(): void {
  send({ type: 'resize', height: Math.ceil(document.documentElement.scrollHeight) });
}

/* ------------------------------------------------------------------ *
 * Actions
 * ------------------------------------------------------------------ */

function requestInsert(): void {
  const mode = current();
  if (!mode.selectedId) return;
  if (state.mode === 'maps') {
    send({ type: 'insert-map', id: mode.selectedId, size: mode.size });
  } else {
    send({ type: 'insert', id: mode.selectedId, weight: state.weight, size: mode.size });
  }
}

function setStatus(text: string, level: 'info' | 'error'): void {
  statusBar.textContent = text;
  statusBar.dataset.level = level;
}

function setMode(mode: Mode): void {
  if (state.mode === mode) return;
  state.mode = mode;
  render();
  searchInput.focus();
}

/* ------------------------------------------------------------------ *
 * Wiring
 * ------------------------------------------------------------------ */

modeIcons.addEventListener('click', () => setMode('icons'));
modeMaps.addEventListener('click', () => setMode('maps'));

searchInput.addEventListener('input', () => {
  current().query = searchInput.value;
  render();
});

searchInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    const first = state.mode === 'maps' ? mapResults()[0] : iconResults()[0];
    if (first) {
      current().selectedId = first.id;
      render();
      requestInsert();
    }
  }
});

filterSelect.addEventListener('change', () => {
  current().filter = filterSelect.value;
  render();
});

sizeSelect.addEventListener('change', () => {
  const parsed = Number(sizeSelect.value);
  const fallback = state.mode === 'maps' ? DEFAULT_MAP_SIZE : 24;
  current().size = Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
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
