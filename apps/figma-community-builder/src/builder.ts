/**
 * Builds the whole Community file.
 *
 * Everything here is driven by `plan.ts`, which is driven by the generated icon
 * data. No count, id or category name is written down in this module; if the
 * released set grows from sixteen icons to sixty, the only thing that changes is
 * how long the build takes.
 *
 * The document is assumed hostile: fonts may be missing, pages may be
 * unloadable, a node may refuse to accept a child. Every failure either aborts
 * before a single node exists (fonts) or is recorded as a note on the summary so
 * the operator sees it before publishing.
 */

import {
  ACCENT,
  CARD,
  CONTENT_WIDTH,
  FONTS,
  ICON_SIZE,
  INK,
  INK_MUTED,
  MEDIUM,
  PAGE_PADDING,
  PAPER,
  RULE,
  SEMIBOLD,
  SLIDE_HEIGHT,
  SLIDE_SAFE_AREA,
  SLIDE_WIDTH,
  WARN,
  solid,
} from './theme';
import {
  CAROUSEL_COPY,
  CONFIRMED_BADGE,
  LINKS,
  MAPS_SLIDE_COPY,
  MAX_CAROUSEL_SLIDES,
  NAMES_INTRO,
  PENDING_BADGE,
  SECTION_COPY,
  componentsNote,
  coverSubtitle,
  honestCounts,
  licenceBlocks,
  mapPolicyBlocks,
  mapsSlideSubtitle,
  publishingChecklist,
  sourceOfTruthBlocks,
  specBlocks,
  startHereBlocks,
  type Block,
} from './copy';
import {
  LIBRARY_NAME,
  MAP_BOUNDARY_POLICY,
  MAP_COMPONENT_SIZE,
  MAX_PAGES,
  PLUGIN_MAP_SVG,
  PLUGIN_SVG,
  allIconSections,
  anyIconHasMultipleWeights,
  componentName,
  coverIcons,
  drawnWeights,
  fragmentIcons,
  libraryVersion,
  mapComponentName,
  mapFrame,
  mapSections,
  planPages,
  preferredIcon,
  regionLabel,
  releasedIcons,
  releasedMaps,
  undrawnWeights,
  weightLabel,
  type MapSection,
  type PlannedPage,
  type Section,
} from './plan';
import { badge, column, eyebrow, frame, row, rule, text, wrapGrid } from './nodes';
import type { CountryMap, Icon } from '@african-icon-library/metadata';

/* ------------------------------------------------------------------ *
 * The marker
 * ------------------------------------------------------------------ */

/**
 * Written to `figma.root` so a second run can tell "this file already has a
 * build" from "this file happens to contain a page called 01 — All Icons".
 */
export const MARKER_KEY = 'african-icon-library:community-build';
/** Written to every page the builder owns, so a wipe never guesses. */
export const PAGE_MARKER_KEY = 'african-icon-library:community-page';

export interface BuildRecord {
  version: string;
  builtAt: string;
  pages: string[];
  icons: number;
  maps?: number;
}

export function readMarker(): BuildRecord | null {
  let raw = '';
  try {
    raw = figma.root.getPluginData(MARKER_KEY);
  } catch {
    return null;
  }
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<BuildRecord>;
    if (!Array.isArray(parsed.pages)) return null;
    return {
      version: typeof parsed.version === 'string' ? parsed.version : 'unknown',
      builtAt: typeof parsed.builtAt === 'string' ? parsed.builtAt : 'an earlier session',
      pages: parsed.pages.filter((page): page is string => typeof page === 'string'),
      icons: typeof parsed.icons === 'number' ? parsed.icons : 0,
    };
  } catch {
    return null;
  }
}

function writeMarker(record: BuildRecord): void {
  try {
    figma.root.setPluginData(MARKER_KEY, JSON.stringify(record));
  } catch {
    /* the document refused the marker; the build itself still stands */
  }
}

/* ------------------------------------------------------------------ *
 * Fonts
 * ------------------------------------------------------------------ */

export class FontLoadError extends Error {
  readonly font: FontName;
  constructor(font: FontName, cause: unknown) {
    super(
      `Figma could not load ${font.family} ${font.style}. ` +
        `The Community file is typeset in ${font.family}; install it, or run this in the ` +
        `Figma desktop app, then try again. (${(cause as Error)?.message ?? 'no detail given'})`,
    );
    this.name = 'FontLoadError';
    this.font = font;
  }
}

/**
 * Loads every style the file uses before a single text node exists.
 *
 * Sequential on purpose: the first failure names the font that failed, which is
 * the only detail that helps the person looking at the notification.
 */
export async function loadFonts(): Promise<void> {
  for (const font of FONTS) {
    try {
      await figma.loadFontAsync(font);
    } catch (error) {
      throw new FontLoadError(font, error);
    }
  }
}

/* ------------------------------------------------------------------ *
 * Document plumbing
 * ------------------------------------------------------------------ */

async function ensurePagesLoaded(): Promise<void> {
  // Required under `documentAccess: dynamic-page` before touching a page this
  // session did not create. Guarded because older API versions lack it.
  const loader = (figma as unknown as { loadAllPagesAsync?: () => Promise<void> })
    .loadAllPagesAsync;
  if (typeof loader !== 'function') return;
  try {
    await loader.call(figma);
  } catch {
    /* an unloadable page is handled where it is used */
  }
}

async function goToPage(page: PageNode): Promise<void> {
  const setter = (figma as unknown as { setCurrentPageAsync?: (page: PageNode) => Promise<void> })
    .setCurrentPageAsync;
  if (typeof setter === 'function') {
    await setter.call(figma, page);
    return;
  }
  figma.currentPage = page;
}

/** A page Figma made, that the user has not put anything on. Safe to drop. */
function isDisposableDefaultPage(page: PageNode): boolean {
  if (!/^Page \d+$/.test(page.name)) return false;
  try {
    return page.children.length === 0;
  } catch {
    return false;
  }
}

export class PageLimitError extends Error {
  constructor(foreign: number, wanted: number) {
    super(
      `This file already has ${foreign} page${foreign === 1 ? '' : 's'} the builder did not make, and the file may hold at most ${MAX_PAGES} pages (Figma's Free plan). ` +
        `The builder needs ${wanted}. Run it in a blank file, or delete the other pages first. Nothing was changed.`,
    );
    this.name = 'PageLimitError';
  }
}

function isOurs(page: PageNode, recorded: ReadonlySet<string>): boolean {
  try {
    return page.getPluginData(PAGE_MARKER_KEY) === '1' || recorded.has(page.name);
  } catch {
    return false;
  }
}

/** Removes every child of a page, so it can be rebuilt in place. */
function emptyPage(page: PageNode): void {
  for (const child of [...page.children]) {
    try {
      child.remove();
    } catch {
      /* a node that refuses to go is left alone rather than half-emptied */
    }
  }
}

/**
 * Returns exactly `names.length` pages for the build, never creating more than
 * `MAX_PAGES` pages in the document.
 *
 * Pages are identified by the marker the builder wrote on them, and by the names
 * recorded in the root marker — never by pattern-matching a name, which would
 * put someone else's page at risk. Pages from an earlier build (including the
 * thirteen-page layout this builder replaced) and Figma's untouched default
 * page are reused or removed. Pages the builder did not make are never touched:
 * if they leave no room, nothing is changed and the build refuses.
 *
 * Reusing pages instead of parking a scratch page also means a rebuild never
 * needs a fourth page, even briefly.
 */
async function acquirePages(names: readonly string[]): Promise<PageNode[]> {
  await ensurePagesLoaded();

  const recorded = new Set(readMarker()?.pages ?? []);
  const all = [...figma.root.children];
  const reusable = all.filter((page) => isOurs(page, recorded) || isDisposableDefaultPage(page));
  const foreign = all.length - reusable.length;
  if (foreign + names.length > MAX_PAGES) throw new PageLimitError(foreign, names.length);

  const kept = reusable.slice(0, names.length);
  const surplus = reusable.slice(names.length);

  // Stand on a page that survives before removing any that does not: Figma
  // refuses to remove the page the user is on.
  if (kept[0]) await goToPage(kept[0]);
  for (const page of surplus) {
    try {
      page.remove();
    } catch {
      /* left in place rather than emptied */
    }
  }

  const pages: PageNode[] = [];
  names.forEach((name, index) => {
    let page = kept[index];
    if (page) emptyPage(page);
    else page = figma.createPage();
    page.name = name;
    page.setPluginData(PAGE_MARKER_KEY, '1');
    if ('backgrounds' in page) page.backgrounds = [solid(PAPER)];
    pages.push(page);
  });

  try {
    figma.root.setPluginData(MARKER_KEY, '');
  } catch {
    /* the rebuild overwrites it anyway */
  }
  return pages;
}

/* ------------------------------------------------------------------ *
 * Components
 * ------------------------------------------------------------------ */

/**
 * Figma's SVG importer has no notion of `currentColor`, so the keyword is
 * swapped for an explicit black at import time. The asset on disk is untouched.
 */
function paintForFigma(svg: string): string {
  return svg.split('currentColor').join('#000000');
}

interface BuiltIcon {
  icon: Icon;
  node: ComponentNode | ComponentSetNode;
  /** The weights this entry actually contains. Never includes an undrawn one. */
  weights: string[];
}

function componentFromSvg(icon: Icon, weight: string, name: string): ComponentNode | null {
  const svg = PLUGIN_SVG[icon.id]?.[weight];
  if (!svg) return null;

  let imported: FrameNode;
  try {
    imported = figma.createNodeFromSvg(paintForFigma(svg));
  } catch {
    return null;
  }

  const component = figma.createComponent();
  component.name = name;
  component.resize(ICON_SIZE, ICON_SIZE);
  // Off, so a stroke that sits on the edge of the 24-unit canvas is not clipped
  // when an instance is scaled up.
  component.clipsContent = false;
  component.description = `${icon.name} — ${icon.description}`;

  for (const child of [...imported.children]) {
    component.appendChild(child);
    if ('constraints' in child) {
      child.constraints = { horizontal: 'SCALE', vertical: 'SCALE' };
    }
  }

  try {
    imported.remove();
  } catch {
    /* already detached */
  }
  return component;
}

/**
 * One entry per icon.
 *
 * A `Weight` property only exists when the icon has more than one *drawn*
 * weight. A single drawn weight produces a plain component — a one-value variant
 * property would advertise weights that have not been drawn.
 */
function buildIconEntry(icon: Icon, parent: FrameNode, notes: string[]): BuiltIcon | null {
  const weights = drawnWeights(icon);
  const name = componentName(icon);

  if (weights.length === 0) {
    notes.push(`${icon.id} has no drawn SVG in this build and was skipped.`);
    return null;
  }

  if (weights.length === 1) {
    const component = componentFromSvg(icon, weights[0], name);
    if (!component) {
      notes.push(`Figma could not read the markup for ${icon.id}; it is not in the file.`);
      return null;
    }
    parent.appendChild(component);
    return { icon, node: component, weights };
  }

  const variants: ComponentNode[] = [];
  const built: string[] = [];
  for (const weight of weights) {
    const variant = componentFromSvg(icon, weight, `Weight=${weightLabel(weight)}`);
    if (variant) {
      variants.push(variant);
      built.push(weight);
    }
  }

  if (variants.length === 0) {
    notes.push(`Figma could not read any weight of ${icon.id}; it is not in the file.`);
    return null;
  }

  if (variants.length === 1) {
    // One weight survived the import. Ship it as a plain component rather than a
    // component set with a single variant.
    variants[0].name = name;
    parent.appendChild(variants[0]);
    notes.push(`${icon.id} imported only its ${built[0]} weight, so it has no Weight property.`);
    return { icon, node: variants[0], weights: built };
  }

  try {
    const set = figma.combineAsVariants(variants, parent);
    set.name = name;
    set.description = `${icon.name} — ${icon.description}`;
    return { icon, node: set, weights: built };
  } catch {
    // Falling back to the baseline weight alone is honest; a half-made set is not.
    for (const extra of variants.slice(1)) {
      try {
        extra.remove();
      } catch {
        /* already gone */
      }
    }
    variants[0].name = name;
    parent.appendChild(variants[0]);
    notes.push(`Figma refused to combine the weights of ${icon.id}; it is a plain component.`);
    return { icon, node: variants[0], weights: [built[0]] };
  }
}

/* ------------------------------------------------------------------ *
 * Instances
 * ------------------------------------------------------------------ */

class Placer {
  count = 0;
  constructor(
    private readonly byId: Map<string, BuiltIcon>,
    private readonly notes: string[],
  ) {}

  instance(icon: Icon, size: number): InstanceNode | null {
    const built = this.byId.get(icon.id);
    if (!built) return null;
    const source = built.node.type === 'COMPONENT_SET' ? built.node.defaultVariant : built.node;
    if (!source) return null;
    try {
      const instance = source.createInstance();
      instance.name = icon.id;
      instance.resize(size, size);
      this.count += 1;
      return instance;
    } catch {
      this.notes.push(`Could not place an instance of ${icon.id}.`);
      return null;
    }
  }

  /** An instance plus its caption, as one cell of a grid. */
  cell(
    icon: Icon,
    size: number,
    width: number,
    caption: 'id' | 'name' | 'both' | 'none',
  ): FrameNode {
    const cell = column(icon.id, 10, { align: 'CENTER', width });
    const instance = this.instance(icon, size);
    if (instance) cell.appendChild(instance);

    if (caption === 'name' || caption === 'both') {
      cell.appendChild(
        text(icon.name, {
          font: MEDIUM,
          size: 13,
          colour: INK,
          width,
          lineHeight: 130,
        }),
      );
    }
    if (caption === 'id' || caption === 'both') {
      cell.appendChild(text(icon.id, { size: 11, colour: INK_MUTED, width, lineHeight: 130 }));
    }
    return cell;
  }
}

/* ------------------------------------------------------------------ *
 * Country maps
 * ------------------------------------------------------------------ */

/**
 * One component per country map, named `ail/maps/<id>`.
 *
 * The imported vectors are scaled with the frame (SCALE constraints, set
 * before the resize) so the component's longest side matches the icons' 24 px
 * frame and its other side keeps the country's proportions. Figma does not
 * scale `strokeWeight` on resize, so the live 1.5 stroke survives. No text is
 * ever placed inside a map component.
 */
function mapComponentFromSvg(map: CountryMap): ComponentNode | null {
  const svg = PLUGIN_MAP_SVG[map.id];
  if (!svg) return null;

  let imported: FrameNode;
  try {
    imported = figma.createNodeFromSvg(paintForFigma(svg));
  } catch {
    return null;
  }

  const size = mapFrame(map, MAP_COMPONENT_SIZE);
  for (const child of imported.children) {
    if ('constraints' in child) child.constraints = { horizontal: 'SCALE', vertical: 'SCALE' };
  }
  imported.resize(size.width, size.height);

  const component = figma.createComponent();
  component.name = mapComponentName(map);
  component.resize(size.width, size.height);
  // A stroke centred on the outline sits half outside it; never clip it.
  component.clipsContent = false;
  component.description = `${map.name} (${map.iso3}) — outline map. ${LIBRARY_NAME}.`;

  for (const child of [...imported.children]) {
    component.appendChild(child);
    if ('constraints' in child) {
      child.constraints = { horizontal: 'SCALE', vertical: 'SCALE' };
    }
  }

  try {
    imported.remove();
  } catch {
    /* already detached */
  }
  return component;
}

class MapPlacer {
  count = 0;
  constructor(
    private readonly byId: Map<string, ComponentNode>,
    private readonly notes: string[],
  ) {}

  /** An instance whose longest side is `size`; the other side keeps the proportions. */
  instance(map: CountryMap, size: number): InstanceNode | null {
    const component = this.byId.get(map.id);
    if (!component) return null;
    try {
      const instance = component.createInstance();
      instance.name = map.id;
      const fitted = mapFrame(map, size);
      instance.resize(fitted.width, fitted.height);
      this.count += 1;
      return instance;
    } catch {
      this.notes.push(`Could not place an instance of the ${map.id} map.`);
      return null;
    }
  }

  /** A map centred in a square presentation frame, captioned outside the component. */
  cell(map: CountryMap, size: number, width: number): FrameNode {
    const cell = column(map.id, 10, { align: 'CENTER', width });
    const stage = frame(`${map.id} frame`, {});
    stage.resize(size, size);
    const instance = this.instance(map, size);
    if (instance) {
      stage.appendChild(instance);
      instance.x = Math.round((size - instance.width) / 2);
      instance.y = Math.round((size - instance.height) / 2);
    }
    cell.appendChild(stage);
    cell.appendChild(
      text(map.name, { font: MEDIUM, size: 13, colour: INK, width, lineHeight: 130 }),
    );
    cell.appendChild(
      text(`${map.iso3} · ${map.id}`, { size: 11, colour: INK_MUTED, width, lineHeight: 130 }),
    );
    return cell;
  }
}

/* ------------------------------------------------------------------ *
 * Shared page furniture
 * ------------------------------------------------------------------ */

function pageShell(title: string, subtitle: string): FrameNode {
  const shell = column(title, 48, {
    fill: PAPER,
    padding: PAGE_PADDING,
    width: CONTENT_WIDTH + PAGE_PADDING * 2,
  });
  const head = column('Header', 12, { width: CONTENT_WIDTH });
  head.appendChild(eyebrow(LIBRARY_NAME, ACCENT));
  head.appendChild(text(title, { font: SEMIBOLD, size: 44, lineHeight: 120 }));
  if (subtitle) {
    head.appendChild(text(subtitle, { size: 18, colour: INK_MUTED, width: 880 }));
  }
  shell.appendChild(head);
  shell.appendChild(rule(CONTENT_WIDTH, RULE));
  return shell;
}

function blockNode(block: Block, width: number): FrameNode {
  const node = column(block.heading, 12, { width });
  node.appendChild(text(block.heading, { font: SEMIBOLD, size: 22, lineHeight: 130 }));
  for (const line of block.lines) {
    node.appendChild(text(line, { size: 16, colour: INK, width, lineHeight: 155 }));
  }
  return node;
}

function sectionHeader(section: Section, width: number): FrameNode {
  const head = column(section.label, 6, { width });
  head.appendChild(eyebrow(`${section.label} · ${section.icons.length}`, ACCENT));
  if (section.description) {
    head.appendChild(text(section.description, { size: 15, colour: INK_MUTED, width }));
  }
  return head;
}

/**
 * Cell width scales with the release size so a much larger set still fits the
 * canvas instead of running off the right-hand edge.
 */
function gridMetrics(count: number): { size: number; cell: number; gap: number } {
  if (count <= 24) return { size: 48, cell: 176, gap: 24 };
  if (count <= 48) return { size: 40, cell: 152, gap: 20 };
  return { size: 32, cell: 128, gap: 16 };
}

/* ------------------------------------------------------------------ *
 * Slides (cover + Community listing)
 * ------------------------------------------------------------------ */

function slide(name: string): FrameNode {
  const node = frame(name, { fill: PAPER, clip: true });
  node.resize(SLIDE_WIDTH, SLIDE_HEIGHT);
  return node;
}

function centreInSlide(node: FrameNode, content: FrameNode): void {
  content.x = SLIDE_SAFE_AREA;
  content.y = Math.max(SLIDE_SAFE_AREA, Math.round((SLIDE_HEIGHT - content.height) / 2));
}

/** The cover composition, used for both `Cover` and `Community/Cover`. */
function composeCover(name: string, placer: Placer, maps?: MapPlacer): FrameNode {
  const node = slide(name);
  const content = column('Cover content', 44, { align: 'MIN' });

  // The one permitted use of the accent: a mark, not a wash.
  const mark = frame('Accent', { fill: ACCENT, cornerRadius: 3 });
  mark.resize(88, 6);
  content.appendChild(mark);

  const strip = row('Icons', 48, { align: 'CENTER' });
  for (const icon of coverIcons()) {
    const instance = placer.instance(icon, 120);
    if (instance) strip.appendChild(instance);
  }
  content.appendChild(strip);

  // Announce the maps with a run of real map components, at their proportions.
  if (maps && releasedMaps.length > 0) {
    const mapStrip = row('Maps', 40, { align: 'CENTER' });
    for (const map of releasedMaps.slice(0, 12)) {
      const instance = maps.instance(map, 72);
      if (instance) mapStrip.appendChild(instance);
    }
    content.appendChild(mapStrip);
  }

  content.appendChild(text(LIBRARY_NAME, { font: SEMIBOLD, size: 116, lineHeight: 105 }));
  content.appendChild(text(coverSubtitle(), { size: 34, colour: INK_MUTED, lineHeight: 130 }));

  node.appendChild(content);
  centreInSlide(node, content);
  return node;
}

function slideHeading(title: string, subtitle: string, width: number): FrameNode {
  const head = column('Heading', 10, { width });
  head.appendChild(eyebrow(LIBRARY_NAME, ACCENT));
  head.appendChild(text(title, { font: SEMIBOLD, size: 56, lineHeight: 115 }));
  head.appendChild(text(subtitle, { size: 22, colour: INK_MUTED, width, lineHeight: 140 }));
  return head;
}

const SLIDE_CONTENT_WIDTH = SLIDE_WIDTH - SLIDE_SAFE_AREA * 2;

function carouselWholeSet(placer: Placer): FrameNode {
  const copy = CAROUSEL_COPY[0];
  const node = slide(`Community/Carousel-${copy.number}`);
  const content = column('Content', 40, { align: 'MIN' });
  content.appendChild(slideHeading(copy.title, copy.subtitle, SLIDE_CONTENT_WIDTH));

  const total = releasedIcons.length;
  const size = total <= 24 ? 64 : total <= 48 ? 44 : 32;
  const cell = size + 56;

  const columns = column('Sections', 28, { width: SLIDE_CONTENT_WIDTH });
  for (const section of allIconSections()) {
    const group = column(section.label, 12, { width: SLIDE_CONTENT_WIDTH });
    group.appendChild(eyebrow(section.label, INK_MUTED));
    const grid = wrapGrid(`${section.label} grid`, SLIDE_CONTENT_WIDTH, 16, 16);
    for (const icon of section.icons) grid.appendChild(placer.cell(icon, size, cell, 'none'));
    group.appendChild(grid);
    columns.appendChild(group);
  }
  content.appendChild(columns);

  node.appendChild(content);
  centreInSlide(node, content);
  return node;
}

function carouselTwentyFour(placer: Placer): FrameNode {
  const copy = CAROUSEL_COPY[1];
  const node = slide(`Community/Carousel-${copy.number}`);
  const content = column('Content', 48, { align: 'MIN' });
  content.appendChild(slideHeading(copy.title, copy.subtitle, SLIDE_CONTENT_WIDTH));

  const actual = column('At 24', 14, { width: SLIDE_CONTENT_WIDTH });
  actual.appendChild(eyebrow('24 px — actual size', INK_MUTED));
  const smallGrid = wrapGrid('24px row', SLIDE_CONTENT_WIDTH, 28, 20);
  for (const icon of releasedIcons) {
    const instance = placer.instance(icon, ICON_SIZE);
    if (instance) smallGrid.appendChild(instance);
  }
  actual.appendChild(smallGrid);
  content.appendChild(actual);

  const zoomSize = 96;
  const perRow = Math.max(1, Math.floor((SLIDE_CONTENT_WIDTH + 28) / (zoomSize + 28)));
  const zoomed = column('At 400%', 14, { width: SLIDE_CONTENT_WIDTH });
  zoomed.appendChild(eyebrow('the same drawings at 400%', INK_MUTED));
  const bigGrid = wrapGrid('400% row', SLIDE_CONTENT_WIDTH, 28, 20);
  for (const icon of releasedIcons.slice(0, perRow)) {
    const instance = placer.instance(icon, zoomSize);
    if (instance) bigGrid.appendChild(instance);
  }
  zoomed.appendChild(bigGrid);
  content.appendChild(zoomed);

  node.appendChild(content);
  centreInSlide(node, content);
  return node;
}

function carouselGrid(placer: Placer): FrameNode {
  const copy = CAROUSEL_COPY[2];
  const node = slide(`Community/Carousel-${copy.number}`);
  const content = row('Content', 96, { align: 'CENTER' });

  const scale = 20; // 24 units → 480 px
  const canvas = frame('24-unit canvas', { fill: '#FFFFFF' });
  canvas.resize(ICON_SIZE * scale, ICON_SIZE * scale);
  canvas.strokes = [solid(RULE)];
  canvas.strokeWeight = 2;

  const keyline = (
    name: string,
    width: number,
    height: number,
    shape: 'rect' | 'ellipse',
    dashed: boolean,
  ): void => {
    const marker = shape === 'ellipse' ? figma.createEllipse() : figma.createRectangle();
    marker.name = name;
    marker.resize(width * scale, height * scale);
    marker.fills = [];
    marker.strokes = [solid(ACCENT, dashed ? 0.5 : 0.35)];
    marker.strokeWeight = 2;
    if (dashed) marker.dashPattern = [10, 10];
    canvas.appendChild(marker);
    marker.x = Math.round((ICON_SIZE * scale - width * scale) / 2);
    marker.y = Math.round((ICON_SIZE * scale - height * scale) / 2);
  };

  keyline('Live area (2-unit inset)', 20, 20, 'rect', true);
  keyline('Keyline — 18 square', 18, 18, 'rect', false);
  keyline('Keyline — 20 circle', 20, 20, 'ellipse', false);
  keyline('Keyline — 16 × 20 portrait', 16, 20, 'rect', false);

  // Prefer the icon the spec names, but never assume it is in this build.
  const subject = preferredIcon('talking-drum');
  if (subject) {
    const instance = placer.instance(subject, ICON_SIZE * scale);
    if (instance) {
      canvas.appendChild(instance);
      instance.x = 0;
      instance.y = 0;
    }
  }

  const legend = column('Legend', 28, { width: SLIDE_CONTENT_WIDTH - ICON_SIZE * scale - 96 });
  legend.appendChild(
    slideHeading(copy.title, copy.subtitle, SLIDE_CONTENT_WIDTH - ICON_SIZE * scale - 96),
  );
  const facts = column('Facts', 10, { width: SLIDE_CONTENT_WIDTH - ICON_SIZE * scale - 96 });
  for (const line of [
    '24 × 24 canvas, 2-unit live area on every side.',
    'Stroke 1.5, round cap, round join, centre aligned.',
    'Live strokes — never outlined, so a weight can still be changed.',
    subject ? `Shown: ${subject.name} (${subject.id}).` : 'No icon available to show.',
    `Enforced in CI, not by convention — ${LINKS.github}`,
  ]) {
    facts.appendChild(
      text(line, {
        size: 18,
        colour: INK_MUTED,
        width: SLIDE_CONTENT_WIDTH - ICON_SIZE * scale - 96,
        lineHeight: 150,
      }),
    );
  }
  legend.appendChild(facts);

  content.appendChild(canvas);
  content.appendChild(legend);
  node.appendChild(content);
  centreInSlide(node, content);
  return node;
}

function uiCard(title: string, width: number): FrameNode {
  const card = column(title, 18, {
    fill: '#FFFFFF',
    padding: 24,
    cornerRadius: 16,
    width,
  });
  card.appendChild(eyebrow(title, INK_MUTED));
  return card;
}

function carouselInUse(placer: Placer): FrameNode {
  const copy = CAROUSEL_COPY[3];
  const node = slide(`Community/Carousel-${copy.number}`);
  const content = column('Content', 44, { align: 'MIN' });
  content.appendChild(slideHeading(copy.title, copy.subtitle, SLIDE_CONTENT_WIDTH));

  const cardWidth = Math.floor((SLIDE_CONTENT_WIDTH - 64) / 3);
  const cards = row('Fragments', 32, { align: 'MIN' });
  const used: Icon[] = [];

  // Nav bar
  const nav = uiCard('Navigation', cardWidth);
  const navRow = row('Bar', 0, { align: 'CENTER', width: cardWidth - 48 });
  navRow.primaryAxisAlignItems = 'SPACE_BETWEEN';
  const navIcons = fragmentIcons(['nigeria-flag', 'jollof-rice', 'danfo', 'naira-note'], 4, used);
  used.push(...navIcons);
  for (const icon of navIcons) {
    const item = column(icon.id, 6, { align: 'CENTER' });
    const instance = placer.instance(icon, 24);
    if (instance) item.appendChild(instance);
    item.appendChild(text(icon.name, { size: 11, colour: INK_MUTED, lineHeight: 130 }));
    navRow.appendChild(item);
  }
  nav.appendChild(navRow);
  cards.appendChild(nav);

  // Delivery list
  const listCard = uiCard('Delivery list', cardWidth);
  const listIcons = fragmentIcons(['jollof-rice', 'suya', 'pepper-soup'], 3, used);
  used.push(...listIcons);
  for (const icon of listIcons) {
    const listRow = row(icon.id, 14, { align: 'CENTER', width: cardWidth - 48 });
    const instance = placer.instance(icon, 24);
    if (instance) listRow.appendChild(instance);
    const label = column('Text', 2, {});
    label.appendChild(text(icon.name, { font: MEDIUM, size: 14, lineHeight: 130 }));
    label.appendChild(text('20–35 min', { size: 12, colour: INK_MUTED, lineHeight: 130 }));
    listRow.appendChild(label);
    listCard.appendChild(listRow);
  }
  cards.appendChild(listCard);

  // Payment sheet
  const payCard = uiCard('Payment sheet', cardWidth);
  const payIcons = fragmentIcons(['naira-note', 'train-ticket'], 2, used);
  used.push(...payIcons);
  for (const icon of payIcons) {
    const payRow = row(icon.id, 14, { align: 'CENTER', width: cardWidth - 48 });
    const instance = placer.instance(icon, 24);
    if (instance) payRow.appendChild(instance);
    payRow.appendChild(text(icon.name, { font: MEDIUM, size: 14, lineHeight: 130 }));
    payCard.appendChild(payRow);
  }
  payCard.appendChild(rule(cardWidth - 48, RULE));
  payCard.appendChild(
    text('Icons at 20–24 px, live strokes, no detaching.', {
      size: 12,
      colour: INK_MUTED,
      width: cardWidth - 48,
    }),
  );
  cards.appendChild(payCard);

  content.appendChild(cards);
  node.appendChild(content);
  centreInSlide(node, content);
  return node;
}

function carouselHonest(): FrameNode {
  const copy = CAROUSEL_COPY[4];
  const node = slide(`Community/Carousel-${copy.number}`);
  const content = column('Content', 44, { align: 'MIN' });
  content.appendChild(slideHeading(copy.title, copy.subtitle, SLIDE_CONTENT_WIDTH));

  const table = column('Counts', 0, { width: SLIDE_CONTENT_WIDTH });
  for (const [label, value] of honestCounts()) {
    const line = row(label, 24, {
      align: 'CENTER',
      width: SLIDE_CONTENT_WIDTH,
      padding: [14, 0, 14, 0],
    });
    line.primaryAxisAlignItems = 'SPACE_BETWEEN';
    line.appendChild(text(label, { size: 24, colour: INK_MUTED, lineHeight: 130 }));
    line.appendChild(text(value, { font: SEMIBOLD, size: 24, colour: INK, lineHeight: 130 }));
    table.appendChild(line);
    table.appendChild(rule(SLIDE_CONTENT_WIDTH, RULE));
  }
  content.appendChild(table);

  node.appendChild(content);
  centreInSlide(node, content);
  return node;
}

/** Announces the country maps: every map, grouped by region, at real proportions. */
function carouselMaps(maps: MapPlacer, number: string): FrameNode {
  const node = slide(`Community/Carousel-${number}`);
  const content = column('Content', 32, { align: 'MIN' });
  content.appendChild(
    slideHeading(MAPS_SLIDE_COPY.title, mapsSlideSubtitle(), SLIDE_CONTENT_WIDTH),
  );
  const sections = column('Regions', 18, { width: SLIDE_CONTENT_WIDTH });
  for (const section of mapSections()) {
    const group = row(section.label, 20, { align: 'CENTER', width: SLIDE_CONTENT_WIDTH });
    group.appendChild(eyebrow(section.label, INK_MUTED));
    for (const map of section.maps) {
      const instance = maps.instance(map, 56);
      if (instance) group.appendChild(instance);
    }
    sections.appendChild(group);
  }
  content.appendChild(sections);
  node.appendChild(content);
  centreInSlide(node, content);
  return node;
}

/* ------------------------------------------------------------------ *
 * Pages
 * ------------------------------------------------------------------ */

function mapSectionHeader(section: MapSection, width: number): FrameNode {
  const head = column(section.label, 6, { width });
  head.appendChild(eyebrow(`${section.label} · ${section.maps.length}`, ACCENT));
  return head;
}

/** A large section heading with its one-line description, used on the long pages. */
function sectionTitle(
  copy: { title: string; subtitle: string },
  width: number,
  count?: number,
): FrameNode {
  const head = column(copy.title, 10, { width });
  head.appendChild(eyebrow(count === undefined ? copy.title : `${copy.title} · ${count}`, ACCENT));
  head.appendChild(text(copy.title, { font: SEMIBOLD, size: 36, lineHeight: 120 }));
  head.appendChild(text(copy.subtitle, { size: 16, colour: INK_MUTED, width: 880 }));
  return head;
}

/** A component section: a labelled frame holding the components in a wrapped grid. */
function componentSection(
  copy: { title: string; subtitle: string },
  gap: number,
): { section: FrameNode; holder: FrameNode } {
  const section = column(copy.title, 28, { width: CONTENT_WIDTH });
  section.appendChild(sectionTitle(copy, CONTENT_WIDTH));
  const holder = wrapGrid(copy.title, CONTENT_WIDTH, gap, gap + 8);
  section.appendChild(holder);
  return { section, holder };
}

function buildIconComponents(notes: string[]): {
  section: FrameNode;
  byId: Map<string, BuiltIcon>;
} {
  const { section, holder } = componentSection(SECTION_COPY.iconComponents, 32);
  section.insertChild(1, blockNode(componentsNote(anyIconHasMultipleWeights()), 980));
  const byId = new Map<string, BuiltIcon>();
  for (const sectionOfIcons of allIconSections()) {
    for (const icon of sectionOfIcons.icons) {
      const built = buildIconEntry(icon, holder, notes);
      if (built) byId.set(icon.id, built);
    }
  }
  return { section, byId };
}

/** One `ail/maps/<id>` component per country, grouped by region. */
function buildMapComponents(notes: string[]): {
  section: FrameNode;
  byId: Map<string, ComponentNode>;
} {
  const section = column(SECTION_COPY.mapComponents.title, 28, { width: CONTENT_WIDTH });
  section.appendChild(sectionTitle(SECTION_COPY.mapComponents, CONTENT_WIDTH));
  const byId = new Map<string, ComponentNode>();
  for (const group of mapSections()) {
    const regionGroup = column(group.label, 16, { width: CONTENT_WIDTH });
    regionGroup.appendChild(mapSectionHeader(group, CONTENT_WIDTH));
    const holder = wrapGrid(`${group.label} components`, CONTENT_WIDTH, 32, 32);
    for (const map of group.maps) {
      const component = mapComponentFromSvg(map);
      if (!component) {
        notes.push(`Figma could not read the ${map.id} map; it is not in the file.`);
        continue;
      }
      holder.appendChild(component);
      byId.set(map.id, component);
    }
    regionGroup.appendChild(holder);
    section.appendChild(regionGroup);
  }
  return { section, byId };
}

/** The counts the Library page opens with. */
function countsRow(width: number): FrameNode {
  const table = row('Counts', 24, { width, align: 'MIN' });
  const entries: Array<[string, string]> = [
    ['Icons', `${releasedIcons.length}`],
    ['Categories', `${new Set(releasedIcons.map((icon) => icon.category)).size}`],
    ...(releasedMaps.length > 0
      ? ([['Country maps', `${releasedMaps.length}`]] as Array<[string, string]>)
      : []),
    ['Version', libraryVersion()],
  ];
  for (const [label, value] of entries) {
    const card = column(label, 4, { fill: CARD, padding: 20, cornerRadius: 12 });
    card.appendChild(text(value, { font: SEMIBOLD, size: 40, lineHeight: 110 }));
    card.appendChild(eyebrow(label, INK_MUTED));
    table.appendChild(card);
  }
  return table;
}

/**
 * `01 — Library`: one long page.
 *
 * The shell on the left reads top to bottom: intro and counts, All Icons by
 * group, Country Maps by region. The canonical components sit to its right in
 * labelled sections, because every instance on every page is made from them and
 * so they are created first.
 */
function buildLibraryPage(
  page: PageNode,
  planned: PlannedPage,
  notes: string[],
): { placer: Placer; maps: MapPlacer; components: number } {
  const shellWidth = CONTENT_WIDTH + PAGE_PADDING * 2;

  const componentsFrame = column('Components', 160, {
    fill: PAPER,
    padding: PAGE_PADDING,
    width: shellWidth,
  });
  const icons = buildIconComponents(notes);
  componentsFrame.appendChild(icons.section);
  const mapComponents = buildMapComponents(notes);
  if (releasedMaps.length > 0) componentsFrame.appendChild(mapComponents.section);
  page.appendChild(componentsFrame);
  componentsFrame.x = shellWidth + 320;
  componentsFrame.y = 0;

  const placer = new Placer(icons.byId, notes);
  const maps = new MapPlacer(mapComponents.byId, notes);

  const shell = pageShell(
    'Library',
    `The ${LIBRARY_NAME}: ${coverSubtitle()}. The canonical components are to the right of this column.`,
  );
  shell.appendChild(countsRow(CONTENT_WIDTH));
  for (const block of startHereBlocks()) shell.appendChild(blockNode(block, 980));

  // --- All Icons, by group
  const groups = planned.groups ?? [];
  const iconTotal = groups.reduce(
    (sum, group) => sum + group.sections.reduce((n, section) => n + section.icons.length, 0),
    0,
  );
  const metrics = gridMetrics(iconTotal);
  shell.appendChild(rule(CONTENT_WIDTH, RULE));
  shell.appendChild(sectionTitle(SECTION_COPY.allIcons, CONTENT_WIDTH, iconTotal));
  for (const group of groups) {
    const block = column(group.title, 24, { width: CONTENT_WIDTH });
    const single = group.sections.length === 1;
    const head = column(`${group.title} heading`, 6, { width: CONTENT_WIDTH });
    const groupCount = group.sections.reduce((n, section) => n + section.icons.length, 0);
    head.appendChild(text(group.title, { font: SEMIBOLD, size: 24, lineHeight: 125 }));
    head.appendChild(eyebrow(`${groupCount} ${groupCount === 1 ? 'icon' : 'icons'}`, ACCENT));
    if (group.blurb)
      head.appendChild(text(group.blurb, { size: 15, colour: INK_MUTED, width: 880 }));
    block.appendChild(head);
    for (const section of group.sections) {
      const inner = column(section.label, 16, { width: CONTENT_WIDTH });
      if (!single) inner.appendChild(sectionHeader(section, CONTENT_WIDTH));
      const grid = wrapGrid(`${section.label} grid`, CONTENT_WIDTH, metrics.gap, metrics.gap + 8);
      for (const icon of section.icons) {
        grid.appendChild(placer.cell(icon, metrics.size, metrics.cell, 'both'));
      }
      inner.appendChild(grid);
      block.appendChild(inner);
    }
    shell.appendChild(block);
  }

  // --- Country Maps, by region
  const regionsOfMaps = planned.mapSections ?? [];
  if (regionsOfMaps.length > 0) {
    const mapTotal = regionsOfMaps.reduce((sum, section) => sum + section.maps.length, 0);
    shell.appendChild(rule(CONTENT_WIDTH, RULE));
    shell.appendChild(sectionTitle(SECTION_COPY.maps, CONTENT_WIDTH, mapTotal));
    for (const group of regionsOfMaps) {
      const block = column(group.label, 20, { width: CONTENT_WIDTH });
      block.appendChild(mapSectionHeader(group, CONTENT_WIDTH));
      const grid = wrapGrid(`${group.label} grid`, CONTENT_WIDTH, 24, 32);
      for (const map of group.maps) grid.appendChild(maps.cell(map, 96, 152));
      block.appendChild(grid);
      shell.appendChild(block);
    }
  }

  page.appendChild(shell);
  shell.x = 0;
  shell.y = 0;
  return { placer, maps, components: icons.byId.size + mapComponents.byId.size };
}

function localNameRow(language: string, value: string, pending: boolean, width: number): FrameNode {
  const line = row('Local name', 10, { align: 'CENTER', width });
  line.appendChild(text(value, { font: MEDIUM, size: 14, lineHeight: 130 }));
  line.appendChild(text(language, { size: 12, colour: INK_MUTED, lineHeight: 130 }));
  line.appendChild(
    pending ? badge(PENDING_BADGE, WARN, '#F6E9D5') : badge(CONFIRMED_BADGE, ACCENT, '#E3EFE7'),
  );
  return line;
}

function nameCard(icon: Icon, placer: Placer, cardWidth: number): FrameNode {
  const card = column(icon.id, 14, {
    fill: CARD,
    padding: 24,
    cornerRadius: 12,
    width: cardWidth,
  });
  const inner = cardWidth - 48;

  const head = row('Head', 14, { align: 'CENTER', width: inner });
  const instance = placer.instance(icon, 40);
  if (instance) head.appendChild(instance);
  const names = column('Names', 2, {});
  names.appendChild(text(icon.name, { font: SEMIBOLD, size: 18, lineHeight: 125 }));
  names.appendChild(text(icon.id, { size: 12, colour: INK_MUTED, lineHeight: 130 }));
  head.appendChild(names);
  card.appendChild(head);

  card.appendChild(text(icon.description, { size: 14, colour: INK, width: inner }));
  card.appendChild(
    text(`Region — ${icon.regions.map(regionLabel).join(', ')}`, {
      size: 13,
      colour: INK_MUTED,
      width: inner,
    }),
  );

  const local = column('Local names', 8, { width: inner });
  local.appendChild(eyebrow('local names', INK_MUTED));
  if (icon.localNames.length === 0) {
    local.appendChild(
      text('None recorded yet. Contributions welcome — see Licence & Contributions below.', {
        size: 13,
        colour: INK_MUTED,
        width: inner,
      }),
    );
  } else {
    for (const name of icon.localNames) {
      local.appendChild(localNameRow(name.language, name.value, name.review === 'pending', inner));
    }
    if (icon.localNames.some((name) => name.review === 'pending')) {
      local.appendChild(
        text(
          'A pending name has not been confirmed by a speaker. It is recorded so it can be corrected, not asserted.',
          { size: 12, colour: WARN, width: inner },
        ),
      );
    }
  }
  card.appendChild(local);
  return card;
}

/**
 * `03 — Notes & Publishing`: spec guidance, names, map policy, licence and
 * contributions, source of truth and the release checklist, on one page.
 */
function buildNotesPage(page: PageNode, placer: Placer): void {
  const shell = pageShell(
    'Notes & Publishing',
    'How the library is drawn and named, the map policy, the licence, and the checklist for publishing an update.',
  );
  const addBlocks = (copy: { title: string; subtitle: string }, blocks: Block[]): void => {
    shell.appendChild(rule(CONTENT_WIDTH, RULE));
    shell.appendChild(sectionTitle(copy, CONTENT_WIDTH));
    for (const block of blocks) shell.appendChild(blockNode(block, 980));
  };

  addBlocks(SECTION_COPY.spec, specBlocks());

  shell.appendChild(rule(CONTENT_WIDTH, RULE));
  shell.appendChild(sectionTitle(SECTION_COPY.names, CONTENT_WIDTH, releasedIcons.length));
  shell.appendChild(blockNode(NAMES_INTRO, 980));
  const grid = wrapGrid('Cards', CONTENT_WIDTH, 40, 40);
  for (const icon of releasedIcons) grid.appendChild(nameCard(icon, placer, 400));
  shell.appendChild(grid);

  if (releasedMaps.length > 0)
    addBlocks(SECTION_COPY.mapPolicy, mapPolicyBlocks(MAP_BOUNDARY_POLICY));
  addBlocks(SECTION_COPY.licence, licenceBlocks());
  addBlocks(SECTION_COPY.source, sourceOfTruthBlocks());
  addBlocks(SECTION_COPY.checklist, [publishingChecklist()]);

  page.appendChild(shell);
  shell.x = 0;
  shell.y = 0;
}

/**
 * `02 — Community Listing`: the file `Cover` first, then the frames the
 * Community listing itself needs, parked beside it.
 *
 * Figma allows nine carousel images. Only slides with real content are made —
 * an empty slide is worse than a missing one — so the count is what the plan can
 * fill, capped at nine. The maps slide and the maps strip on both covers are
 * built only when the release contains maps.
 */
function buildListingPage(page: PageNode, placer: Placer, maps: MapPlacer): number {
  // The cover is the first frame on the page — appended before anything else.
  const cover = composeCover('Cover', placer, maps);
  page.appendChild(cover);
  cover.x = 0;
  cover.y = 0;

  const frames: FrameNode[] = [composeCover('Community/Cover', placer, maps)];
  const slides = [
    carouselWholeSet(placer),
    carouselTwentyFour(placer),
    carouselGrid(placer),
    carouselInUse(placer),
    carouselHonest(),
    ...(releasedMaps.length > 0
      ? [carouselMaps(maps, String(CAROUSEL_COPY.length + 1).padStart(2, '0'))]
      : []),
  ].slice(0, MAX_CAROUSEL_SLIDES);
  frames.push(...slides);

  let y = 0;
  for (const built of frames) {
    page.appendChild(built);
    built.x = SLIDE_WIDTH + 200;
    built.y = y;
    y += SLIDE_HEIGHT + 120;
  }
  return slides.length;
}

/* ------------------------------------------------------------------ *
 * The build
 * ------------------------------------------------------------------ */

export interface BuildSummary {
  pages: number;
  components: number;
  instances: number;
  notes: string[];
}

export type Report = (done: number, total: number, label: string) => void;

export async function buildCommunityFile(report: Report = () => {}): Promise<BuildSummary> {
  const notes: string[] = [];
  const planned = planPages();
  if (planned.length > MAX_PAGES) {
    throw new Error(`the page plan has ${planned.length} pages; the limit is ${MAX_PAGES}`);
  }
  const total = planned.length + 3;
  let done = 0;
  const step = (label: string): void => {
    done += 1;
    report(done, total, label);
  };

  step('Loading fonts');
  await loadFonts();

  step('Preparing the three pages');
  const pages = await acquirePages(planned.map((plan) => plan.name));
  const pageOf = (kind: PlannedPage['kind']): PageNode => {
    const index = planned.findIndex((plan) => plan.kind === kind);
    const page = pages[index];
    if (!page) throw new Error(`the page plan has no ${kind} page`);
    return page;
  };

  // The Library page first: it holds the components that every other page
  // places instances of.
  const libraryPlan = planned.find((plan) => plan.kind === 'library');
  if (!libraryPlan) throw new Error('the page plan has no library page');
  await goToPage(pageOf('library'));
  const library = buildLibraryPage(pageOf('library'), libraryPlan, notes);
  step(libraryPlan.name);

  await goToPage(pageOf('listing'));
  buildListingPage(pageOf('listing'), library.placer, library.maps);
  step(planned.find((plan) => plan.kind === 'listing')?.name ?? 'Community Listing');

  await goToPage(pageOf('notes'));
  buildNotesPage(pageOf('notes'), library.placer);
  step(planned.find((plan) => plan.kind === 'notes')?.name ?? 'Notes & Publishing');

  // Library, Listing, Notes — in that order, whatever order Figma kept.
  pages.forEach((page, index) => {
    try {
      figma.root.insertChild(index, page);
    } catch {
      /* the document refused a reorder; the names still carry the order */
    }
  });
  try {
    await goToPage(pages[0]);
  } catch {
    /* the build stands even if the viewport does not follow */
  }

  const undrawn = undrawnWeights();
  if (undrawn.length > 0) {
    notes.push(
      `${undrawn.join(', ')} ${undrawn.length === 1 ? 'is' : 'are'} not drawn, so no component carries a Weight property.`,
    );
  }

  writeMarker({
    version: libraryVersion(),
    builtAt: new Date().toISOString(),
    pages: planned.map((plan) => plan.name),
    icons: releasedIcons.length,
    maps: releasedMaps.length,
  });

  step('Finishing');

  return {
    pages: pages.length,
    components: library.components,
    instances: library.placer.count + library.maps.count,
    notes,
  };
}
