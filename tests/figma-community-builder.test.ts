import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { PATHS, ROOT, loadAuditRecords, loadIcons } from '../scripts/lib/repo.ts';

/* ------------------------------------------------------------------ *
 * A small, deliberately hostile fake of the Figma plugin API.
 *
 * It is stricter than Figma in the two places that matter to this plugin:
 *   - setting `characters` on a text node throws unless that exact font has
 *     been through `loadFontAsync`, which is how "load fonts before creating
 *     any text" is actually verified rather than assumed;
 *   - removing the current page, or the last page, throws, which is how a
 *     wipe-and-rebuild that strands the document is caught.
 * ------------------------------------------------------------------ */

interface FakeNode {
  type: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  removed: boolean;
  parent: FakeNode | null;
  children: FakeNode[];
  pluginData: Record<string, string>;
  characters: string;
  fontName: { family: string; style: string } | null;
  defaultVariant?: FakeNode;
  source?: string;
  appendChild(child: FakeNode): void;
  insertChild(index: number, child: FakeNode): void;
  remove(): void;
  resize(width: number, height: number): void;
  getPluginData(key: string): string;
  setPluginData(key: string, value: string): void;
  createInstance?(): FakeNode;
  [key: string]: unknown;
}

interface Harness {
  figma: Record<string, unknown>;
  root: FakeNode;
  messages: Array<Record<string, unknown>>;
  notifications: Array<{ text: string; error: boolean }>;
  send(message: unknown): Promise<void>;
  pages(): FakeNode[];
  allNodes(): FakeNode[];
}

function detach(node: FakeNode): void {
  if (node.parent) {
    node.parent.children = node.parent.children.filter((child) => child !== node);
    node.parent = null;
  }
}

function makeHarness(options: { fontsReject?: boolean; svgThrows?: boolean } = {}): Harness {
  const messages: Array<Record<string, unknown>> = [];
  const notifications: Array<{ text: string; error: boolean }> = [];
  const loadedFonts = new Set<string>();

  let currentPage: FakeNode;
  let onmessage: ((message: unknown) => unknown) | null = null;

  const makeNode = (type: string, name = type.toLowerCase()): FakeNode => {
    let characters = '';
    const node = {
      type,
      name,
      x: 0,
      y: 0,
      width: type === 'TEXT' ? 80 : 100,
      height: type === 'TEXT' ? 20 : 100,
      removed: false,
      parent: null as FakeNode | null,
      children: [] as FakeNode[],
      pluginData: {} as Record<string, string>,
      fontName: null as { family: string; style: string } | null,
      // Present on every node, as it is on every Figma scene node the builder
      // touches — the builder only assigns it when `'constraints' in node`.
      constraints: { horizontal: 'MIN', vertical: 'MIN' },
      appendChild(child: FakeNode) {
        detach(child);
        child.parent = node;
        node.children.push(child);
      },
      insertChild(index: number, child: FakeNode) {
        detach(child);
        child.parent = node;
        node.children.splice(index, 0, child);
      },
      remove() {
        if (node.removed) throw new Error('node already removed');
        if (node.type === 'PAGE') {
          if (node === currentPage) throw new Error('cannot remove the current page');
          if (root.children.length <= 1) throw new Error('a document needs at least one page');
        }
        node.removed = true;
        detach(node);
      },
      resize(width: number, height: number) {
        if (width < 0.01 || height < 0.01) throw new Error('cannot resize below 0.01');
        node.width = width;
        node.height = height;
      },
      getPluginData(key: string) {
        if (node.removed) throw new Error('node has been removed');
        return node.pluginData[key] ?? '';
      },
      setPluginData(key: string, value: string) {
        if (node.removed) throw new Error('node has been removed');
        node.pluginData[key] = value;
      },
    } as unknown as FakeNode;

    Object.defineProperty(node, 'characters', {
      get: () => characters,
      set: (value: string) => {
        const font = node.fontName;
        const key = font ? `${font.family}/${font.style}` : 'none';
        if (!loadedFonts.has(key)) {
          throw new Error(`Cannot write to node with unloaded font "${key}"`);
        }
        characters = value;
      },
      configurable: true,
    });

    return node;
  };

  const root = makeNode('DOCUMENT', 'Document');
  currentPage = makeNode('PAGE', 'Page 1');
  root.appendChild(currentPage);

  /** Every `create*` call lands on the current page, exactly as Figma does. */
  const spawn = (type: string, name?: string): FakeNode => {
    const node = makeNode(type, name);
    currentPage.appendChild(node);
    return node;
  };

  const makeComponent = (): FakeNode => {
    const component = spawn('COMPONENT', 'Component');
    component.createInstance = () => {
      const instance = spawn('INSTANCE', component.name);
      instance.mainComponent = component;
      return instance;
    };
    return component;
  };

  const figma: Record<string, unknown> = {
    root,
    get currentPage() {
      return currentPage;
    },
    set currentPage(page: FakeNode) {
      currentPage = page;
    },
    setCurrentPageAsync: async (page: FakeNode) => {
      currentPage = page;
    },
    loadAllPagesAsync: async () => {},
    loadFontAsync: async (font: { family: string; style: string }) => {
      if (options.fontsReject) throw new Error('font unavailable in this environment');
      loadedFonts.add(`${font.family}/${font.style}`);
    },
    notify: (text: string, opts?: { error?: boolean }) => {
      notifications.push({ text, error: Boolean(opts?.error) });
      return { cancel: () => {} };
    },
    showUI: vi.fn(),
    on: vi.fn(),
    viewport: { center: { x: 0, y: 0 }, scrollAndZoomIntoView: vi.fn() },
    ui: {
      postMessage: (message: Record<string, unknown>) => messages.push(message),
      resize: vi.fn(),
      set onmessage(handler: (message: unknown) => unknown) {
        onmessage = handler;
      },
      get onmessage() {
        return onmessage as (message: unknown) => unknown;
      },
    },
    createPage: () => {
      const page = makeNode('PAGE', 'Page');
      root.appendChild(page);
      return page;
    },
    createFrame: () => spawn('FRAME', 'Frame'),
    createText: () => spawn('TEXT', 'Text'),
    createRectangle: () => spawn('RECTANGLE', 'Rectangle'),
    createEllipse: () => spawn('ELLIPSE', 'Ellipse'),
    createComponent: makeComponent,
    createNodeFromSvg: (source: string) => {
      if (options.svgThrows) throw new Error('unsupported markup');
      const wrapper = spawn('FRAME', 'svg');
      wrapper.source = source;
      const vector = makeNode('VECTOR', 'Vector');
      wrapper.appendChild(vector);
      return wrapper;
    },
    combineAsVariants: (variants: FakeNode[], parent: FakeNode) => {
      const set = makeNode('COMPONENT_SET', 'Component Set');
      parent.appendChild(set);
      for (const variant of variants) set.appendChild(variant);
      set.defaultVariant = variants[0];
      set.createInstance = () => variants[0].createInstance?.() ?? makeNode('INSTANCE');
      return set;
    },
  };

  const walk = (node: FakeNode, out: FakeNode[]): void => {
    out.push(node);
    for (const child of node.children) walk(child, out);
  };

  return {
    figma,
    root,
    messages,
    notifications,
    async send(message: unknown) {
      await onmessage?.(message);
    },
    pages: () => root.children,
    allNodes: () => {
      const out: FakeNode[] = [];
      for (const page of root.children) walk(page, out);
      return out;
    },
  };
}

async function loadPlugin(harness: Harness): Promise<void> {
  vi.resetModules();
  (globalThis as Record<string, unknown>).figma = harness.figma;
  (globalThis as Record<string, unknown>).__html__ = '<html></html>';
  await import('../apps/figma-community-builder/src/main.ts');
}

async function loadPlan() {
  return import('../apps/figma-community-builder/src/plan.ts');
}

function messagesOfType(harness: Harness, type: string) {
  return harness.messages.filter((message) => message.type === type);
}

/** Every string the document renders — node names and text content alike. */
function documentStrings(harness: Harness): string[] {
  const strings: string[] = [];
  for (const page of harness.pages()) strings.push(page.name);
  for (const node of harness.allNodes()) {
    strings.push(node.name);
    if (node.type === 'TEXT' && node.characters) strings.push(node.characters);
  }
  return strings;
}

function componentEntries(harness: Harness) {
  return harness
    .allNodes()
    .filter(
      (node) =>
        (node.type === 'COMPONENT' || node.type === 'COMPONENT_SET') &&
        node.name.startsWith('african-icons/'),
    );
}

/* ------------------------------------------------------------------ *
 * The category → page mapping, restated independently of the plugin.
 *
 * Written out here on purpose: if someone changes the mapping in `plan.ts`
 * this test fails, which is the point — the mapping is documented in the
 * README and a silent change would make the README wrong.
 * ------------------------------------------------------------------ */

const CATEGORY_PAGE_GROUPS: ReadonlyArray<{ title: string; categoryIds: readonly string[] }> = [
  { title: 'Identity & State', categoryIds: ['identity-state', 'defence'] },
  { title: 'Fashion & Textiles', categoryIds: ['fashion-textiles'] },
  { title: 'Food & Drink', categoryIds: ['food-drink'] },
  { title: 'Music, Art & Play', categoryIds: ['music-art-play', 'culture-people'] },
  { title: 'Transport', categoryIds: ['transport'] },
  { title: 'Everyday Life & Commerce', categoryIds: ['commerce-industry', 'places-landmarks'] },
];

/* ------------------------------------------------------------------ */

describe('figma community builder — the produced document', () => {
  let harness: Harness;

  beforeEach(async () => {
    harness = makeHarness();
    await loadPlugin(harness);
    await harness.send({ type: 'build', mode: 'fresh' });
  });

  afterEach(() => {
    delete (globalThis as Record<string, unknown>).figma;
    delete (globalThis as Record<string, unknown>).__html__;
  });

  it('creates one page per fixed page plus one per populated category group', async () => {
    const { PLUGIN_ICONS } = await loadPlan();
    const present = new Set(PLUGIN_ICONS.map((icon) => icon.category));
    const expectedGroups = CATEGORY_PAGE_GROUPS.filter((group) =>
      group.categoryIds.some((id) => present.has(id)),
    );

    // 00 Start Here, 01 All Icons, then the groups, then Components, Names, Licence.
    expect(harness.pages()).toHaveLength(2 + expectedGroups.length + 3);
  });

  it('numbers the pages contiguously and in the documented order', async () => {
    const { PLUGIN_ICONS } = await loadPlan();
    const present = new Set(PLUGIN_ICONS.map((icon) => icon.category));
    const groups = CATEGORY_PAGE_GROUPS.filter((group) =>
      group.categoryIds.some((id) => present.has(id)),
    );

    const expected = [
      'Start Here',
      'All Icons',
      ...groups.map((group) => group.title),
      'Components',
      'Names & Cultural Notes',
      'Licence & Contributions',
    ].map((title, index) => `${String(index).padStart(2, '0')} — ${title}`);

    expect(harness.pages().map((page) => page.name)).toEqual(expected);
  });

  it('gives no page to a category with no released icon', async () => {
    const { PLUGIN_ICONS } = await loadPlan();
    const present = new Set(PLUGIN_ICONS.map((icon) => icon.category));
    const empty = CATEGORY_PAGE_GROUPS.filter(
      (group) => !group.categoryIds.some((id) => present.has(id)),
    );

    const names = harness.pages().map((page) => page.name);
    for (const group of empty) {
      expect(names.some((name) => name.endsWith(group.title))).toBe(false);
    }
  });

  it('creates exactly one component entry per released icon, correctly named', async () => {
    const { PLUGIN_ICONS, componentName } = await loadPlan();
    const names = componentEntries(harness).map((node) => node.name);

    expect(new Set(names).size).toBe(names.length);
    expect([...names].sort()).toEqual([...PLUGIN_ICONS.map(componentName)].sort());
  });

  it('has a component count equal to the released icon count', async () => {
    const { PLUGIN_ICONS } = await loadPlan();
    expect(componentEntries(harness)).toHaveLength(PLUGIN_ICONS.length);

    // The bundled data is the set this file is built from; a separate test in
    // tests/figma-plugin.test.ts asserts it covers every released icon. Here we
    // only need it to contain nothing that is *not* released.
    const released = new Set((await loadIcons()).map((icon) => icon.id));
    for (const icon of PLUGIN_ICONS) expect(released.has(icon.id)).toBe(true);
  });

  it('carries no variant property for an icon with a single drawn weight', async () => {
    const { PLUGIN_ICONS, componentName, drawnWeights } = await loadPlan();
    const entries = new Map(componentEntries(harness).map((node) => [node.name, node]));

    for (const icon of PLUGIN_ICONS) {
      if (drawnWeights(icon).length !== 1) continue;
      const entry = entries.get(componentName(icon));
      expect(entry).toBeDefined();
      // A component set is how Figma expresses a variant property. A plain
      // component cannot carry one.
      expect(entry?.type).toBe('COMPONENT');
      expect(entry?.children ?? []).not.toContainEqual(
        expect.objectContaining({ type: 'COMPONENT' }),
      );
    }

    const undrawn = PLUGIN_ICONS.every((icon) => drawnWeights(icon).length === 1);
    if (undrawn) {
      expect(harness.allNodes().filter((node) => node.type === 'COMPONENT_SET')).toHaveLength(0);
      expect(documentStrings(harness).some((value) => value.includes('Weight='))).toBe(false);
    }
  });

  it('makes every icon component 24 × 24, unclipped, with children set to scale', () => {
    for (const entry of componentEntries(harness)) {
      if (entry.type !== 'COMPONENT') continue;
      expect(entry.width).toBe(24);
      expect(entry.height).toBe(24);
      expect(entry.clipsContent).toBe(false);
      for (const child of entry.children) {
        expect(child.constraints).toEqual({ horizontal: 'SCALE', vertical: 'SCALE' });
      }
    }
  });

  it('places instances rather than copies of the components', () => {
    const instances = harness.allNodes().filter((node) => node.type === 'INSTANCE');
    expect(instances.length).toBeGreaterThan(0);
    for (const instance of instances) expect(instance.mainComponent).toBeDefined();

    // Nothing outside the components page may be a loose component.
    const componentsPage = harness
      .pages()
      .find((page) => page.name.endsWith('Components')) as FakeNode;
    const strays = harness
      .pages()
      .filter((page) => page !== componentsPage)
      .flatMap((page) => {
        const out: FakeNode[] = [];
        const walk = (node: FakeNode): void => {
          if (node.type === 'COMPONENT' || node.type === 'COMPONENT_SET') out.push(node);
          for (const child of node.children) walk(child);
        };
        walk(page);
        return out;
      });
    expect(strays).toHaveLength(0);
  });

  it('puts a 1920 × 960 frame named Cover first on the first page', () => {
    const first = harness.pages()[0];
    expect(first.name).toBe('00 — Start Here');
    const frames = first.children.filter((child) => child.type === 'FRAME');
    expect(frames[0].name).toBe('Cover');
    expect(frames[0].width).toBe(1920);
    expect(frames[0].height).toBe(960);
  });

  it('shows only real icons on the cover', async () => {
    const { PLUGIN_ICONS } = await loadPlan();
    const known = new Set(PLUGIN_ICONS.map((icon) => icon.id));
    const cover = harness.pages()[0].children.find((child) => child.name === 'Cover') as FakeNode;

    const instances: FakeNode[] = [];
    const walk = (node: FakeNode): void => {
      if (node.type === 'INSTANCE') instances.push(node);
      for (const child of node.children) walk(child);
    };
    walk(cover);

    expect(instances.length).toBeGreaterThan(0);
    for (const instance of instances) expect(known.has(instance.name)).toBe(true);
  });

  it('builds the Community listing frames at 1920 × 960, capped at nine carousels', () => {
    const first = harness.pages()[0];
    const communityCover = first.children.find((child) => child.name === 'Community/Cover');
    expect(communityCover).toBeDefined();
    expect(communityCover?.width).toBe(1920);
    expect(communityCover?.height).toBe(960);

    const carousels = first.children.filter((child) =>
      /^Community\/Carousel-\d\d$/.test(child.name),
    );
    expect(carousels.length).toBeGreaterThan(0);
    expect(carousels.length).toBeLessThanOrEqual(9);
    for (const slide of carousels) {
      expect(slide.width).toBe(1920);
      expect(slide.height).toBe(960);
    }
  });

  it('labels a pending local name as unconfirmed wherever one exists', async () => {
    const { PLUGIN_ICONS } = await loadPlan();
    const pending = PLUGIN_ICONS.flatMap((icon) =>
      icon.localNames.filter((name) => name.review === 'pending'),
    );
    const strings = documentStrings(harness);

    if (pending.length === 0) {
      // Nothing to label — but the page must still exist.
      expect(harness.pages().some((page) => page.name.endsWith('Names & Cultural Notes'))).toBe(
        true,
      );
      return;
    }

    for (const name of pending) expect(strings).toContain(name.value);
    expect(strings.filter((value) => value.includes('PENDING')).length).toBeGreaterThanOrEqual(
      pending.length,
    );
  });

  it('reports progress and a summary to its UI', async () => {
    const { PLUGIN_ICONS } = await loadPlan();
    expect(messagesOfType(harness, 'progress').length).toBeGreaterThan(0);

    const summary = messagesOfType(harness, 'summary').at(-1);
    expect(summary).toBeDefined();
    expect(summary?.pages).toBe(harness.pages().length);
    expect(summary?.components).toBe(PLUGIN_ICONS.length);
    expect(Number(summary?.instances)).toBeGreaterThan(PLUGIN_ICONS.length);
  });

  it('records a marker on the document root', () => {
    const raw = harness.root.pluginData['african-icon-library:community-build'];
    expect(raw).toBeTruthy();
    const record = JSON.parse(raw) as { pages: string[] };
    expect(record.pages).toEqual(harness.pages().map((page) => page.name));
  });
});

describe('figma community builder — what must never appear', () => {
  let harness: Harness;

  beforeEach(async () => {
    harness = makeHarness();
    await loadPlugin(harness);
    await harness.send({ type: 'build', mode: 'fresh' });
  });

  afterEach(() => {
    delete (globalThis as Record<string, unknown>).figma;
    delete (globalThis as Record<string, unknown>).__html__;
  });

  it('contains no staged or held icon id anywhere in the document', async () => {
    const released = new Set((await loadIcons()).map((icon) => icon.id));

    const staged = (await readdir(path.join(PATHS.iconsStagingRoot, 'regular')).catch(() => []))
      .filter((file) => file.endsWith('.svg'))
      .map((file) => path.basename(file, '.svg'));

    const held = (await loadAuditRecords())
      .filter((record) => record.disposition === 'held')
      .map((record) => record.publicIconId ?? record.proposedId);

    // An id that has since been released is no longer forbidden.
    const forbidden = [...new Set([...staged, ...held])].filter((id) => !released.has(id));
    expect(forbidden.length).toBeGreaterThan(0);

    const strings = documentStrings(harness);
    for (const id of forbidden) {
      for (const value of strings) {
        expect(value).not.toContain(id);
      }
    }
  });

  it('puts no text layer inside an icon component', () => {
    for (const entry of componentEntries(harness)) {
      const walk = (node: FakeNode): void => {
        expect(node.type).not.toBe('TEXT');
        for (const child of node.children) walk(child);
      };
      for (const child of entry.children) walk(child);
    }
  });

  it('leaves no loose node on a page outside a frame it built', () => {
    for (const page of harness.pages()) {
      for (const child of page.children) {
        expect(['FRAME', 'COMPONENT', 'COMPONENT_SET']).toContain(child.type);
      }
    }
  });
});

/* ------------------------------------------------------------------ *
 * The multi-weight branch.
 *
 * The library draws one weight today, so the variant path would otherwise never
 * execute. Substituting the generated data module is the only way to exercise it
 * without inventing artwork in the repository.
 * ------------------------------------------------------------------ */

const GENERATED_DATA = '../apps/figma-plugin/src/generated/icon-data';

describe('figma community builder — when a second weight is drawn', () => {
  afterEach(() => {
    vi.doUnmock(GENERATED_DATA);
    vi.resetModules();
    delete (globalThis as Record<string, unknown>).figma;
    delete (globalThis as Record<string, unknown>).__html__;
  });

  it('adds a Weight property only for the icon with two drawn weights', async () => {
    const svg =
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" ' +
      'fill="none" stroke="currentColor"><path d="M4 4h16"/></svg>';

    const icon = (id: string, weights: string[]) => ({
      id,
      name: id,
      description: `${id} description`,
      category: 'food-drink',
      tier: 'icon',
      regions: ['NG'],
      weights,
      keywords: [],
      localNames: [],
      status: 'released',
      addedIn: '0.2.0',
      culturalReview: { required: false, status: 'not-required' },
      provenance: { referentConfirmed: true },
    });

    vi.doMock(GENERATED_DATA, () => ({
      // `two-weight` claims a thin weight it has no drawing for. It must not
      // become a variant.
      PLUGIN_ICONS: [
        icon('one-weight', ['regular']),
        icon('two-weight', ['regular', 'bold', 'thin']),
      ],
      PLUGIN_SVG: {
        'one-weight': { regular: svg },
        'two-weight': { regular: svg, bold: svg },
      },
      PLUGIN_CATEGORIES: [{ id: 'food-drink', label: 'Food & Drink' }],
      PLUGIN_WEIGHTS: ['bold', 'regular'],
    }));

    const harness = makeHarness();
    await loadPlugin(harness);
    await harness.send({ type: 'build', mode: 'fresh' });

    const entries = new Map(componentEntries(harness).map((node) => [node.name, node]));
    expect([...entries.keys()].sort()).toEqual([
      'african-icons/food-drink/one-weight',
      'african-icons/food-drink/two-weight',
    ]);

    const single = entries.get('african-icons/food-drink/one-weight');
    expect(single?.type).toBe('COMPONENT');

    const multiple = entries.get('african-icons/food-drink/two-weight');
    expect(multiple?.type).toBe('COMPONENT_SET');
    expect((multiple?.children ?? []).map((child) => child.name).sort()).toEqual([
      'Weight=Bold',
      'Weight=Regular',
    ]);

    // The undrawn weight is nowhere in the document.
    expect(documentStrings(harness).some((value) => value.includes('Weight=Thin'))).toBe(false);
  });
});

describe('figma community builder — running it more than once', () => {
  afterEach(() => {
    delete (globalThis as Record<string, unknown>).figma;
    delete (globalThis as Record<string, unknown>).__html__;
  });

  it('refuses a second fresh build rather than duplicating pages', async () => {
    const harness = makeHarness();
    await loadPlugin(harness);
    await harness.send({ type: 'build', mode: 'fresh' });

    const after = harness.pages().map((page) => page.name);
    harness.messages.length = 0;

    await harness.send({ type: 'build', mode: 'fresh' });

    expect(harness.pages().map((page) => page.name)).toEqual(after);
    const state = messagesOfType(harness, 'state').at(-1) as { existingBuild: unknown } | undefined;
    expect(state?.existingBuild).not.toBeNull();
  });

  it('wipes and rebuilds without duplicating pages', async () => {
    const harness = makeHarness();
    await loadPlugin(harness);
    await harness.send({ type: 'build', mode: 'fresh' });
    const first = harness.pages().map((page) => page.name);
    const firstComponents = componentEntries(harness).length;

    await harness.send({ type: 'build', mode: 'rebuild' });
    const second = harness.pages().map((page) => page.name);

    expect(second).toEqual(first);
    expect(new Set(second).size).toBe(second.length);
    expect(componentEntries(harness)).toHaveLength(firstComponents);
    expect(harness.pages().some((page) => page.name === 'Rebuilding…')).toBe(false);
  });

  it('survives a third run', async () => {
    const harness = makeHarness();
    await loadPlugin(harness);
    await harness.send({ type: 'build', mode: 'fresh' });
    const expected = harness.pages().map((page) => page.name);

    await harness.send({ type: 'build', mode: 'rebuild' });
    await harness.send({ type: 'build', mode: 'rebuild' });

    expect(harness.pages().map((page) => page.name)).toEqual(expected);
  });
});

describe('figma community builder — failure modes', () => {
  afterEach(() => {
    delete (globalThis as Record<string, unknown>).figma;
    delete (globalThis as Record<string, unknown>).__html__;
  });

  it('fails clearly, and changes nothing, when a font will not load', async () => {
    const harness = makeHarness({ fontsReject: true });
    await loadPlugin(harness);
    const before = harness.pages().map((page) => page.name);

    await harness.send({ type: 'build', mode: 'fresh' });

    const errors = messagesOfType(harness, 'status').filter((message) => message.level === 'error');
    expect(errors).toHaveLength(1);
    expect(String(errors[0].text)).toContain('Inter');

    expect(harness.notifications).toHaveLength(1);
    expect(harness.notifications[0].error).toBe(true);
    expect(harness.notifications[0].text).toContain('Inter');

    // Nothing was created, so nothing has to be cleaned up.
    expect(harness.pages().map((page) => page.name)).toEqual(before);
    expect(messagesOfType(harness, 'summary')).toHaveLength(0);
    expect(harness.root.pluginData['african-icon-library:community-build']).toBeUndefined();
  });

  it('reports rather than throws when Figma cannot read the markup', async () => {
    const harness = makeHarness({ svgThrows: true });
    await loadPlugin(harness);

    await expect(harness.send({ type: 'build', mode: 'fresh' })).resolves.toBeUndefined();

    const summary = messagesOfType(harness, 'summary').at(-1);
    expect(summary).toBeDefined();
    expect(summary?.components).toBe(0);
    expect((summary?.notes as string[]).length).toBeGreaterThan(0);
  });

  it('ignores malformed messages', async () => {
    const harness = makeHarness();
    await loadPlugin(harness);
    harness.messages.length = 0;

    await harness.send(null);
    await harness.send({ type: 'nonsense' });
    await harness.send('build');

    expect(messagesOfType(harness, 'progress')).toHaveLength(0);
  });

  it('answers the ready handshake with the document state', async () => {
    const harness = makeHarness();
    await loadPlugin(harness);
    harness.messages.length = 0;

    await harness.send({ type: 'ready' });
    const state = messagesOfType(harness, 'state').at(-1) as
      { existingBuild: unknown; icons: number } | undefined;
    expect(state?.existingBuild).toBeNull();
    expect(state?.icons).toBeGreaterThan(0);
  });
});

describe('figma community builder — offline guarantees', () => {
  it('declares no network access in its manifest', async () => {
    const manifest = JSON.parse(
      await readFile(path.join(ROOT, 'apps/figma-community-builder/manifest.json'), 'utf8'),
    ) as { networkAccess?: { allowedDomains?: string[] }; permissions?: string[] };

    expect(manifest.networkAccess?.allowedDomains).toEqual(['none']);
    expect(manifest.permissions).toEqual([]);
  });

  it('ships no networking call, and no absolute URL, in its sources', async () => {
    const dir = path.join(ROOT, 'apps/figma-community-builder/src');
    const files = (await readdir(dir)).filter((file) => file.endsWith('.ts'));
    expect(files.length).toBeGreaterThan(0);

    for (const file of files) {
      const source = await readFile(path.join(dir, file), 'utf8');
      expect(source).not.toMatch(/\bfetch\s*\(/);
      expect(source).not.toMatch(/XMLHttpRequest|WebSocket|EventSource/);
      expect(source).not.toMatch(/https?:\/\/(?!www\.w3\.org\/)/);
    }
  });
});
