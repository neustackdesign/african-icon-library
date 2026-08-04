/**
 * Plugin sandbox thread.
 *
 * Responsibilities: own the document, decide where an icon lands, and never
 * throw at the user. Every branch that touches the document assumes the document
 * may be empty, read-only, mid-edit, or in a state this plugin has never seen.
 */

import { PLUGIN_ICONS, PLUGIN_SVG } from './generated/icon-data';
import {
  isUiMessage,
  type ContextMessage,
  type InsertRequest,
  type PluginMessage,
} from './messages';

const UI_WIDTH = 380;
const UI_MIN_HEIGHT = 420;
const UI_MAX_HEIGHT = 720;

const iconsById = new Map(PLUGIN_ICONS.map((icon) => [icon.id, icon]));

function post(message: PluginMessage): void {
  figma.ui.postMessage(message);
}

/* ------------------------------------------------------------------ *
 * Where does the icon go?
 * ------------------------------------------------------------------ */

interface Destination {
  parent: BaseNode & ChildrenMixin;
  /** Human-readable description for the UI. */
  label: string;
  /** Centre point, in absolute canvas coordinates. */
  x: number;
  y: number;
}

/** Nodes that can hold children *and* accept an arbitrary vector frame. */
function canAcceptChildren(node: BaseNode): node is BaseNode & ChildrenMixin {
  return (
    node.type === 'FRAME' ||
    node.type === 'GROUP' ||
    node.type === 'COMPONENT' ||
    node.type === 'SECTION'
  );
}

function isLocked(node: BaseNode): boolean {
  let current: BaseNode | null = node;
  while (current && current.type !== 'PAGE' && current.type !== 'DOCUMENT') {
    if ('locked' in current && current.locked) return true;
    current = current.parent;
  }
  return false;
}

/**
 * Picks an insertion point.
 *
 * Preference order: inside a single selected container, beside a single selected
 * node, then the centre of the current viewport. Anything removed, locked or
 * unknown falls through to the page rather than failing.
 */
function resolveDestination(size: number): Destination {
  const page = figma.currentPage;
  const viewportFallback: Destination = {
    parent: page,
    label: 'the centre of your viewport',
    x: figma.viewport.center.x,
    y: figma.viewport.center.y,
  };

  let selection: readonly SceneNode[];
  try {
    selection = page.selection;
  } catch {
    return viewportFallback;
  }

  const usable = selection.filter((node) => !node.removed && !isLocked(node));
  if (usable.length !== 1) return viewportFallback;

  const node = usable[0];

  if (canAcceptChildren(node) && 'width' in node && 'height' in node) {
    return {
      parent: node,
      label: `inside "${node.name}"`,
      x: node.width / 2,
      y: node.height / 2,
    };
  }

  if ('absoluteBoundingBox' in node && node.absoluteBoundingBox) {
    const box = node.absoluteBoundingBox;
    return {
      parent: page,
      label: `beside "${node.name}"`,
      x: box.x + box.width + 16 + size / 2,
      y: box.y + size / 2,
    };
  }

  return viewportFallback;
}

function describeContext(): ContextMessage {
  try {
    const destination = resolveDestination(24);
    return { type: 'context', destination: destination.label, blocked: false };
  } catch {
    return {
      type: 'context',
      destination: 'the current page',
      blocked: false,
    };
  }
}

/* ------------------------------------------------------------------ *
 * Insertion
 * ------------------------------------------------------------------ */

/**
 * Figma's SVG importer has no notion of `currentColor`, so the keyword is
 * swapped for an explicit black at insert time. The asset on disk keeps
 * `currentColor` — this substitution exists only inside the document.
 */
function paintForFigma(svg: string): string {
  return svg.split('currentColor').join('#000000');
}

function insert(request: InsertRequest): void {
  const icon = iconsById.get(request.id);
  if (!icon) {
    post({ type: 'status', level: 'error', text: 'That icon is not in this build of the plugin.' });
    return;
  }

  const weight = icon.weights.includes(request.weight as (typeof icon.weights)[number])
    ? request.weight
    : 'regular';
  const svg = PLUGIN_SVG[icon.id]?.[weight];
  if (!svg) {
    post({
      type: 'status',
      level: 'error',
      text: `The "${weight}" weight of ${icon.name} is not drawn yet.`,
    });
    return;
  }

  const size = Number.isFinite(request.size) && request.size > 0 ? Math.round(request.size) : 24;

  let node: FrameNode;
  try {
    node = figma.createNodeFromSvg(paintForFigma(svg));
  } catch (error) {
    post({
      type: 'status',
      level: 'error',
      text: `Figma could not read that icon: ${(error as Error).message}`,
    });
    return;
  }

  try {
    node.name = icon.name;
    node.resize(size, size);
    // Keep the vectors scaling with the frame so a resized icon stays on-grid.
    for (const child of node.children) {
      if ('constraints' in child) {
        child.constraints = { horizontal: 'SCALE', vertical: 'SCALE' };
      }
    }

    const destination = resolveDestination(size);
    destination.parent.appendChild(node);
    node.x = Math.round(destination.x - size / 2);
    node.y = Math.round(destination.y - size / 2);

    // Selecting and scrolling are conveniences. If the document refuses them the
    // icon is still correctly placed, so they must not undo a successful insert.
    try {
      figma.currentPage.selection = [node];
      figma.viewport.scrollAndZoomIntoView([node]);
    } catch {
      /* the icon is placed; the viewport just did not follow */
    }

    post({
      type: 'status',
      level: 'info',
      text: `Inserted ${icon.name} at ${size} px — ${destination.label}.`,
    });
    post(describeContext());
  } catch (error) {
    // The node exists but could not be placed. Remove it rather than leaving an
    // orphan at the origin of the page.
    try {
      node.remove();
    } catch {
      /* already gone */
    }
    post({
      type: 'status',
      level: 'error',
      text: `Could not place the icon: ${(error as Error).message}`,
    });
  }
}

/* ------------------------------------------------------------------ *
 * Wiring
 * ------------------------------------------------------------------ */

figma.showUI(__html__, { width: UI_WIDTH, height: UI_MIN_HEIGHT, themeColors: true });

figma.ui.onmessage = (message: unknown) => {
  if (!isUiMessage(message)) return;

  switch (message.type) {
    case 'ready':
      post(describeContext());
      return;
    case 'resize': {
      const height = Math.min(UI_MAX_HEIGHT, Math.max(UI_MIN_HEIGHT, Math.round(message.height)));
      figma.ui.resize(UI_WIDTH, height);
      return;
    }
    case 'insert':
      insert(message);
      return;
  }
};

// Keep the "where will this land" hint honest as the user works.
figma.on('selectionchange', () => {
  post(describeContext());
});

figma.on('currentpagechange', () => {
  post(describeContext());
});
