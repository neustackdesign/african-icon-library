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
  MAX_CAROUSEL_SLIDES,
  NAMES_INTRO,
  PENDING_BADGE,
  componentsNote,
  coverSubtitle,
  honestCounts,
  licenceBlocks,
  startHereBlocks,
  tagline,
  type Block,
} from './copy';
import {
  LIBRARY_NAME,
  PLUGIN_SVG,
  allIconSections,
  anyIconHasMultipleWeights,
  componentName,
  coverIcons,
  drawnWeights,
  fragmentIcons,
  libraryVersion,
  planPages,
  preferredIcon,
  regionLabel,
  releasedIcons,
  undrawnWeights,
  weightLabel,
  type PlannedPage,
  type Section,
} from './plan';
import { badge, column, eyebrow, frame, row, rule, text, wrapGrid } from './nodes';
import type { Icon } from '@african-icon-library/metadata';

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

/**
 * Removes a previous build.
 *
 * Pages are identified by the marker the builder wrote on them, and by the names
 * recorded in the root marker — never by pattern-matching a name, which would
 * put someone else's page at risk.
 */
async function wipePreviousBuild(): Promise<number> {
  const record = readMarker();
  if (!record) return 0;

  await ensurePagesLoaded();

  const recorded = new Set(record.pages);
  const doomed = figma.root.children.filter((page) => {
    try {
      return page.getPluginData(PAGE_MARKER_KEY) === '1' || recorded.has(page.name);
    } catch {
      return false;
    }
  });
  if (doomed.length === 0) {
    try {
      figma.root.setPluginData(MARKER_KEY, '');
    } catch {
      /* nothing to clear */
    }
    return 0;
  }

  // A Figma document must always keep at least one page, so a scratch page is
  // parked in the document while the old ones go. It is removed at the end of
  // the build, once the real pages exist.
  const scratch = figma.createPage();
  scratch.name = 'Rebuilding…';
  scratch.setPluginData(PAGE_MARKER_KEY, '1');
  await goToPage(scratch);

  let removed = 0;
  for (const page of doomed) {
    try {
      page.remove();
      removed += 1;
    } catch {
      /* a page that refuses to go is left alone rather than half-emptied */
    }
  }

  try {
    figma.root.setPluginData(MARKER_KEY, '');
  } catch {
    /* the rebuild overwrites it anyway */
  }
  return removed;
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
function composeCover(name: string, placer: Placer): FrameNode {
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

/* ------------------------------------------------------------------ *
 * Pages
 * ------------------------------------------------------------------ */

function buildComponentsPage(page: PageNode, notes: string[]): Map<string, BuiltIcon> {
  const multiWeight = anyIconHasMultipleWeights();
  const shell = pageShell(
    'Components',
    'The set itself. Everything on every other page is an instance of something here.',
  );
  shell.appendChild(blockNode(componentsNote(multiWeight), 980));

  const holder = wrapGrid('Components', CONTENT_WIDTH, 32, 40);
  shell.appendChild(holder);
  page.appendChild(shell);
  shell.x = 0;
  shell.y = 0;

  const byId = new Map<string, BuiltIcon>();
  for (const section of allIconSections()) {
    for (const icon of section.icons) {
      const built = buildIconEntry(icon, holder, notes);
      if (built) byId.set(icon.id, built);
    }
  }
  return byId;
}

function buildStartHerePage(page: PageNode, placer: Placer): void {
  // The cover must be the first frame on the first page — Figma reads the file
  // thumbnail from exactly that. It is appended before anything else.
  const cover = composeCover('Cover', placer);
  page.appendChild(cover);
  cover.x = 0;
  cover.y = 0;

  const shell = column('Start Here', 44, {
    fill: PAPER,
    padding: PAGE_PADDING,
    width: CONTENT_WIDTH + PAGE_PADDING * 2,
  });
  const head = column('Header', 14, { width: CONTENT_WIDTH });
  head.appendChild(eyebrow(`version ${libraryVersion()}`, ACCENT));
  head.appendChild(text(LIBRARY_NAME, { font: SEMIBOLD, size: 64, lineHeight: 110 }));
  head.appendChild(text(tagline(), { size: 22, colour: INK_MUTED, width: 900 }));
  shell.appendChild(head);
  shell.appendChild(rule(CONTENT_WIDTH, RULE));

  for (const block of startHereBlocks()) shell.appendChild(blockNode(block, 980));

  shell.appendChild(rule(CONTENT_WIDTH, RULE));
  shell.appendChild(
    text(
      'Built by the Community File Builder plugin from the repository’s generated icon data. Re-run it after a release rather than editing pages by hand.',
      { size: 14, colour: INK_MUTED, width: 980 },
    ),
  );

  page.appendChild(shell);
  shell.x = 0;
  shell.y = SLIDE_HEIGHT + 160;
}

function buildIconPage(page: PageNode, planned: PlannedPage, placer: Placer): void {
  const sections = planned.sections ?? [];
  const total = sections.reduce((sum, section) => sum + section.icons.length, 0);
  const subtitle =
    planned.kind === 'all'
      ? `Every released icon — ${total} in ${sections.length} ${sections.length === 1 ? 'category' : 'categories'}. Instances, not copies.`
      : (planned.spec?.blurb ?? '');

  const shell = pageShell(planned.spec?.title ?? 'All Icons', subtitle);
  const metrics = gridMetrics(total);

  for (const section of sections) {
    const group = column(section.label, 20, { width: CONTENT_WIDTH });
    group.appendChild(sectionHeader(section, CONTENT_WIDTH));
    const grid = wrapGrid(`${section.label} grid`, CONTENT_WIDTH, metrics.gap, metrics.gap + 8);
    for (const icon of section.icons) {
      grid.appendChild(placer.cell(icon, metrics.size, metrics.cell, 'both'));
    }
    group.appendChild(grid);
    shell.appendChild(group);
  }

  page.appendChild(shell);
  shell.x = 0;
  shell.y = 0;
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

function buildNamesPage(page: PageNode, placer: Placer): void {
  const shell = pageShell(
    'Names & Cultural Notes',
    'One card per icon: what it depicts, where the referent is from, and what it is called.',
  );
  shell.appendChild(blockNode(NAMES_INTRO, 980));

  const cardWidth = 400;
  const grid = wrapGrid('Cards', CONTENT_WIDTH, 40, 40);

  for (const icon of releasedIcons) {
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
        text('None recorded yet. Contributions welcome — see page 10.', {
          size: 13,
          colour: INK_MUTED,
          width: inner,
        }),
      );
    } else {
      for (const name of icon.localNames) {
        local.appendChild(
          localNameRow(name.language, name.value, name.review === 'pending', inner),
        );
      }
      if (icon.localNames.some((name) => name.review === 'pending')) {
        local.appendChild(
          text(
            'A pending name has not been confirmed by a speaker. It is recorded so it can be corrected, not asserted.',
            {
              size: 12,
              colour: WARN,
              width: inner,
            },
          ),
        );
      }
    }
    card.appendChild(local);

    if (icon.culturalReview.required) {
      card.appendChild(
        text(`Cultural review — ${icon.culturalReview.status}`, {
          size: 12,
          colour: INK_MUTED,
          width: inner,
        }),
      );
    }

    grid.appendChild(card);
  }

  shell.appendChild(grid);
  page.appendChild(shell);
  shell.x = 0;
  shell.y = 0;
}

function buildLicencePage(page: PageNode): void {
  const shell = pageShell(
    'Licence & Contributions',
    'What you may do with these icons, and how to tell the project it got something wrong.',
  );
  for (const block of licenceBlocks()) shell.appendChild(blockNode(block, 980));
  page.appendChild(shell);
  shell.x = 0;
  shell.y = 0;
}

/**
 * The frames the Community listing itself needs, parked beside the file cover.
 *
 * Figma allows nine carousel images. Only slides with real content are made —
 * an empty slide is worse than a missing one — so the count is what the plan can
 * fill, capped at nine.
 */
function buildCommunityFrames(page: PageNode, placer: Placer): number {
  const frames: FrameNode[] = [composeCover('Community/Cover', placer)];
  const slides = [
    carouselWholeSet(placer),
    carouselTwentyFour(placer),
    carouselGrid(placer),
    carouselInUse(placer),
    carouselHonest(),
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
  const total = planned.length + 4;
  let done = 0;
  const step = (label: string): void => {
    done += 1;
    report(done, total, label);
  };

  step('Loading fonts');
  await loadFonts();

  step('Clearing any previous build');
  await wipePreviousBuild();

  step('Creating pages');
  const preexisting = [...figma.root.children];
  const pages = new Map<string, PageNode>();
  const created: PageNode[] = [];
  for (const plan of planned) {
    const page = figma.createPage();
    page.name = plan.name;
    page.setPluginData(PAGE_MARKER_KEY, '1');
    if ('backgrounds' in page) page.backgrounds = [solid(PAPER)];
    pages.set(plan.name, page);
    created.push(page);
  }

  // Components first: every other page places instances of them.
  const componentsPlan = planned.find((plan) => plan.kind === 'components');
  const componentsPage = componentsPlan ? pages.get(componentsPlan.name) : undefined;
  if (!componentsPlan || !componentsPage) {
    throw new Error('the page plan produced no components page');
  }
  await goToPage(componentsPage);
  const byId = buildComponentsPage(componentsPage, notes);
  const placer = new Placer(byId, notes);
  step(`${componentsPlan.name}`);

  for (const plan of planned) {
    if (plan.kind === 'components') continue;
    const page = pages.get(plan.name);
    if (!page) continue;
    await goToPage(page);

    switch (plan.kind) {
      case 'start':
        buildStartHerePage(page, placer);
        buildCommunityFrames(page, placer);
        break;
      case 'all':
      case 'category':
        buildIconPage(page, plan, placer);
        break;
      case 'names':
        buildNamesPage(page, placer);
        break;
      case 'licence':
        buildLicencePage(page);
        break;
    }
    step(plan.name);
  }

  // Our pages go to the front so the cover really is on the first page.
  created.forEach((page, index) => {
    try {
      figma.root.insertChild(index, page);
    } catch {
      /* the document refused a reorder; creation order already approximates it */
    }
  });

  // Land on the finished file's first page *before* the sweep below: Figma
  // refuses to remove the page the user is standing on.
  const first = created[0];
  if (first) {
    try {
      await goToPage(first);
    } catch {
      /* the build stands even if the viewport does not follow */
    }
  }

  // The scratch page from a rebuild, and Figma's untouched default page, go now.
  for (const page of [...preexisting, ...figma.root.children]) {
    if (created.includes(page)) continue;
    const ours = (() => {
      try {
        return page.getPluginData(PAGE_MARKER_KEY) === '1';
      } catch {
        return false;
      }
    })();
    if (!ours && !isDisposableDefaultPage(page)) continue;
    try {
      page.remove();
    } catch {
      /* left in place rather than emptied */
    }
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
  });

  step('Finishing');

  return {
    pages: created.length,
    components: byId.size,
    instances: placer.count,
    notes,
  };
}
