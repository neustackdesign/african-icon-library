import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ROOT } from '../scripts/lib/repo.ts';

/* ------------------------------------------------------------------ *
 * A small, deliberately hostile fake of the Figma plugin API.
 * ------------------------------------------------------------------ */

interface FakeNode {
  type: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  removed: boolean;
  locked?: boolean;
  parent: FakeNode | FakePage | null;
  children: FakeNode[];
  absoluteBoundingBox?: { x: number; y: number; width: number; height: number } | null;
  constraints?: { horizontal: string; vertical: string };
  resize(width: number, height: number): void;
  remove(): void;
  appendChild(child: FakeNode): void;
}

interface FakePage {
  type: 'PAGE';
  name: string;
  selection: FakeNode[];
  children: FakeNode[];
  appendChild(child: FakeNode): void;
}

function makeNode(overrides: Partial<FakeNode> = {}): FakeNode {
  const node: FakeNode = {
    type: 'VECTOR',
    name: 'node',
    x: 0,
    y: 0,
    width: 24,
    height: 24,
    removed: false,
    parent: null,
    children: [],
    absoluteBoundingBox: { x: 0, y: 0, width: 24, height: 24 },
    constraints: { horizontal: 'MIN', vertical: 'MIN' },
    resize(width, height) {
      node.width = width;
      node.height = height;
    },
    remove() {
      node.removed = true;
      if (node.parent)
        node.parent.children = node.parent.children.filter((child) => child !== node);
    },
    appendChild(child) {
      child.parent = node;
      node.children.push(child);
    },
    ...overrides,
  };
  return node;
}

interface Harness {
  figma: Record<string, unknown>;
  page: FakePage;
  messages: Array<Record<string, unknown>>;
  handlers: Record<string, Array<() => void>>;
  send(message: unknown): void;
  createdNodes: FakeNode[];
}

function makeHarness(options: { createThrows?: boolean } = {}): Harness {
  const messages: Array<Record<string, unknown>> = [];
  const handlers: Record<string, Array<() => void>> = {};
  const createdNodes: FakeNode[] = [];

  const page: FakePage = {
    type: 'PAGE',
    name: 'Page 1',
    selection: [],
    children: [],
    appendChild(child) {
      child.parent = page;
      page.children.push(child);
    },
  };

  let onmessage: ((message: unknown) => void) | null = null;

  const figma: Record<string, unknown> = {
    currentPage: page,
    viewport: { center: { x: 500, y: 300 }, scrollAndZoomIntoView: vi.fn() },
    ui: {
      postMessage: (message: Record<string, unknown>) => messages.push(message),
      resize: vi.fn(),
      set onmessage(handler: (message: unknown) => void) {
        onmessage = handler;
      },
      get onmessage() {
        return onmessage as (message: unknown) => void;
      },
    },
    showUI: vi.fn(),
    on: (event: string, handler: () => void) => {
      handlers[event] = [...(handlers[event] ?? []), handler];
    },
    createNodeFromSvg: (source: string) => {
      if (options.createThrows) throw new Error('unsupported markup');
      const frame = makeNode({ type: 'FRAME', name: 'svg' });
      frame.appendChild(makeNode({ type: 'VECTOR', name: 'Vector' }));
      // Remember what markup Figma was handed, so the test can assert on it.
      (frame as unknown as { source: string }).source = source;
      createdNodes.push(frame);
      return frame;
    },
  };

  return {
    figma,
    page,
    messages,
    handlers,
    createdNodes,
    send(message: unknown) {
      onmessage?.(message);
    },
  };
}

async function loadPlugin(harness: Harness) {
  vi.resetModules();
  (globalThis as Record<string, unknown>).figma = harness.figma;
  (globalThis as Record<string, unknown>).__html__ = '<html></html>';
  await import('../apps/figma-plugin/src/main.ts');
}

function statuses(harness: Harness) {
  return harness.messages.filter((message) => message.type === 'status');
}

/* ------------------------------------------------------------------ */

describe('figma plugin — insertion', () => {
  let harness: Harness;

  beforeEach(async () => {
    harness = makeHarness();
    await loadPlugin(harness);
  });

  afterEach(() => {
    delete (globalThis as Record<string, unknown>).figma;
    delete (globalThis as Record<string, unknown>).__html__;
  });

  it('shows its UI on start', () => {
    expect(harness.figma.showUI).toHaveBeenCalled();
  });

  it('inserts an editable vector frame at the requested size', () => {
    harness.send({ type: 'insert', id: 'danfo', weight: 'regular', size: 32 });

    expect(harness.createdNodes).toHaveLength(1);
    const node = harness.createdNodes[0];
    expect(node.name).toBe('Danfo');
    expect(node.width).toBe(32);
    expect(node.height).toBe(32);
    expect(node.children[0].type).toBe('VECTOR');
    expect(node.children[0].constraints).toEqual({ horizontal: 'SCALE', vertical: 'SCALE' });
    expect(statuses(harness)[0].level).toBe('info');
  });

  it('resolves currentColor before handing markup to Figma', () => {
    harness.send({ type: 'insert', id: 'danfo', weight: 'regular', size: 24 });
    const source = (harness.createdNodes[0] as unknown as { source: string }).source;
    expect(source).not.toContain('currentColor');
    expect(source).toContain('#000000');
  });

  it('places the icon at the viewport centre when nothing is selected', () => {
    harness.send({ type: 'insert', id: 'suya', weight: 'regular', size: 24 });
    const node = harness.createdNodes[0];
    expect(node.parent).toBe(harness.page);
    expect(node.x).toBe(500 - 12);
    expect(node.y).toBe(300 - 12);
  });

  it('places the icon inside a selected container', () => {
    const frame = makeNode({ type: 'FRAME', name: 'Toolbar', width: 200, height: 100 });
    harness.page.selection = [frame];

    harness.send({ type: 'insert', id: 'suya', weight: 'regular', size: 24 });
    const node = harness.createdNodes[0];
    expect(node.parent).toBe(frame);
    expect(statuses(harness)[0].text).toContain('inside "Toolbar"');
  });

  it('ignores a selection that has been removed mid-session', () => {
    harness.page.selection = [makeNode({ type: 'FRAME', name: 'Gone', removed: true })];
    harness.send({ type: 'insert', id: 'suya', weight: 'regular', size: 24 });
    expect(harness.createdNodes[0].parent).toBe(harness.page);
  });

  it('ignores a locked selection rather than failing to append', () => {
    harness.page.selection = [makeNode({ type: 'FRAME', name: 'Locked', locked: true })];
    harness.send({ type: 'insert', id: 'suya', weight: 'regular', size: 24 });
    expect(harness.createdNodes[0].parent).toBe(harness.page);
  });

  it('ignores a selection whose ancestor is locked', () => {
    const parent = makeNode({ type: 'FRAME', name: 'Locked parent', locked: true });
    const child = makeNode({ type: 'FRAME', name: 'Child', width: 50, height: 50 });
    parent.appendChild(child);
    harness.page.selection = [child];

    harness.send({ type: 'insert', id: 'suya', weight: 'regular', size: 24 });
    expect(harness.createdNodes[0].parent).toBe(harness.page);
  });

  it('falls back to the viewport when several nodes are selected', () => {
    harness.page.selection = [
      makeNode({ type: 'FRAME', name: 'A', width: 10, height: 10 }),
      makeNode({ type: 'FRAME', name: 'B', width: 10, height: 10 }),
    ];
    harness.send({ type: 'insert', id: 'suya', weight: 'regular', size: 24 });
    expect(harness.createdNodes[0].parent).toBe(harness.page);
  });

  it('places beside a selected leaf node it cannot nest inside', () => {
    harness.page.selection = [
      makeNode({
        type: 'TEXT',
        name: 'Label',
        absoluteBoundingBox: { x: 100, y: 40, width: 60, height: 20 },
      }),
    ];
    harness.send({ type: 'insert', id: 'suya', weight: 'regular', size: 24 });
    const node = harness.createdNodes[0];
    expect(node.parent).toBe(harness.page);
    expect(node.x).toBe(100 + 60 + 16);
  });

  it('survives a node with no bounding box', () => {
    harness.page.selection = [
      makeNode({ type: 'SLICE', name: 'Slice', absoluteBoundingBox: null }),
    ];
    harness.send({ type: 'insert', id: 'suya', weight: 'regular', size: 24 });
    expect(harness.createdNodes[0].parent).toBe(harness.page);
    expect(statuses(harness)[0].level).toBe('info');
  });

  it('survives a page that throws when its selection is read', async () => {
    const hostile = makeHarness();
    Object.defineProperty(hostile.page, 'selection', {
      get() {
        throw new Error('document not ready');
      },
      set() {
        /* Figma still lets the plugin assign a selection */
      },
      configurable: true,
    });
    await loadPlugin(hostile);

    hostile.send({ type: 'insert', id: 'suya', weight: 'regular', size: 24 });
    expect(statuses(hostile)[0].level).toBe('info');
    expect(hostile.createdNodes[0].parent).toBe(hostile.page);
  });

  it('reports an unknown icon id without throwing', () => {
    harness.send({ type: 'insert', id: 'not-an-icon', weight: 'regular', size: 24 });
    expect(harness.createdNodes).toHaveLength(0);
    expect(statuses(harness)[0].level).toBe('error');
  });

  it('falls back to the drawn weight when an undrawn one is requested', () => {
    harness.send({ type: 'insert', id: 'suya', weight: 'bold', size: 24 });
    expect(harness.createdNodes).toHaveLength(1);
    expect(statuses(harness)[0].level).toBe('info');
  });

  it('clamps a nonsensical size', () => {
    harness.send({ type: 'insert', id: 'suya', weight: 'regular', size: Number.NaN });
    expect(harness.createdNodes[0].width).toBe(24);
  });

  it('reports a failed import instead of crashing', async () => {
    const broken = makeHarness({ createThrows: true });
    await loadPlugin(broken);
    broken.send({ type: 'insert', id: 'suya', weight: 'regular', size: 24 });
    expect(statuses(broken)[0].level).toBe('error');
  });

  it('cleans up an orphan when placement fails', async () => {
    const hostile = makeHarness();
    hostile.page.appendChild = () => {
      throw new Error('page is read-only');
    };
    await loadPlugin(hostile);

    hostile.send({ type: 'insert', id: 'suya', weight: 'regular', size: 24 });
    expect(statuses(hostile)[0].level).toBe('error');
    expect(hostile.createdNodes[0].removed).toBe(true);
  });

  it('ignores malformed messages', () => {
    harness.send(null);
    harness.send({ type: 'nonsense' });
    harness.send('insert');
    expect(harness.createdNodes).toHaveLength(0);
  });

  it('answers a ready handshake with the current destination', () => {
    harness.send({ type: 'ready' });
    const context = harness.messages.filter((message) => message.type === 'context');
    expect(context.length).toBeGreaterThan(0);
  });

  it('clamps UI resize requests to a sane range', () => {
    harness.send({ type: 'resize', height: 10_000 });
    expect(harness.figma.ui).toBeDefined();
    expect((harness.figma.ui as { resize: ReturnType<typeof vi.fn> }).resize).toHaveBeenCalledWith(
      380,
      720,
    );
  });

  it('re-reports the destination when the selection changes', () => {
    harness.messages.length = 0;
    for (const handler of harness.handlers.selectionchange ?? []) handler();
    expect(harness.messages.some((message) => message.type === 'context')).toBe(true);
  });
});

describe('figma plugin — offline guarantees', () => {
  it('declares no network access in its manifest', async () => {
    const manifest = JSON.parse(
      await readFile(path.join(ROOT, 'apps/figma-plugin/manifest.json'), 'utf8'),
    ) as { networkAccess?: { allowedDomains?: string[] }; permissions?: string[] };

    expect(manifest.networkAccess?.allowedDomains).toEqual(['none']);
    expect(manifest.permissions).toEqual([]);
  });

  it('ships no networking call in its sources', async () => {
    const sources = await Promise.all(
      ['main.ts', 'ui.ts', 'generated/icon-data.ts'].map((file) =>
        readFile(path.join(ROOT, 'apps/figma-plugin/src', file), 'utf8'),
      ),
    );

    for (const source of sources) {
      expect(source).not.toMatch(/\bfetch\s*\(/);
      expect(source).not.toMatch(/XMLHttpRequest|WebSocket|EventSource/);
      expect(source).not.toMatch(/https?:\/\/(?!www\.w3\.org\/)/);
    }
  });

  it('bundles every released icon locally', async () => {
    const data = await readFile(
      path.join(ROOT, 'apps/figma-plugin/src/generated/icon-data.ts'),
      'utf8',
    );
    const { loadIcons } = await import('../scripts/lib/repo.ts');
    for (const icon of await loadIcons()) {
      expect(data).toContain(`"${icon.id}"`);
    }
  });
});
