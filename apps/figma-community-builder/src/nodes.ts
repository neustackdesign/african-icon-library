/**
 * Thin wrappers over the Figma node API.
 *
 * The builder makes a few thousand nodes; without these the interesting code
 * would be buried under property assignments. Two ordering rules the Figma API
 * enforces are encoded here rather than left to memory:
 *
 *   - a text node's font must be set (and loaded) before `characters`;
 *   - `layoutWrap = 'WRAP'` is rejected unless `layoutMode` is already
 *     `'HORIZONTAL'` and `primaryAxisSizingMode` is already `'FIXED'`.
 */

import { INK, MEDIUM, REGULAR, solid } from './theme';

export interface TextOptions {
  font?: FontName;
  size?: number;
  colour?: string;
  /** Fixes the width and lets the text wrap to as many lines as it needs. */
  width?: number;
  /** Percentage line height. Defaults to a comfortable reading value. */
  lineHeight?: number;
  letterSpacing?: number;
  opacity?: number;
  name?: string;
}

export function text(characters: string, options: TextOptions = {}): TextNode {
  const node = figma.createText();
  node.fontName = options.font ?? REGULAR;
  node.characters = characters;
  node.fontSize = options.size ?? 16;
  node.fills = [solid(options.colour ?? INK, options.opacity ?? 1)];
  node.lineHeight = { unit: 'PERCENT', value: options.lineHeight ?? 145 };
  if (options.letterSpacing !== undefined) {
    node.letterSpacing = { unit: 'PERCENT', value: options.letterSpacing };
  }
  node.name = options.name ?? characters.slice(0, 40);

  if (options.width === undefined) {
    node.textAutoResize = 'WIDTH_AND_HEIGHT';
  } else {
    node.textAutoResize = 'HEIGHT';
    node.resize(options.width, node.height);
  }
  return node;
}

/** A small upper-case label — used for section headings and state badges. */
export function eyebrow(characters: string, colour: string): TextNode {
  return text(characters.toUpperCase(), {
    font: MEDIUM,
    size: 12,
    colour,
    letterSpacing: 8,
    lineHeight: 130,
  });
}

export interface FrameOptions {
  fill?: string;
  padding?: number | [number, number, number, number];
  cornerRadius?: number;
  clip?: boolean;
}

function applyFrameOptions(node: FrameNode, options: FrameOptions): void {
  node.fills = options.fill ? [solid(options.fill)] : [];
  node.clipsContent = options.clip ?? false;
  if (options.cornerRadius !== undefined) node.cornerRadius = options.cornerRadius;

  if (options.padding !== undefined) {
    const [top, right, bottom, left] =
      typeof options.padding === 'number'
        ? [options.padding, options.padding, options.padding, options.padding]
        : options.padding;
    node.paddingTop = top;
    node.paddingRight = right;
    node.paddingBottom = bottom;
    node.paddingLeft = left;
  }
}

export function frame(name: string, options: FrameOptions = {}): FrameNode {
  const node = figma.createFrame();
  node.name = name;
  applyFrameOptions(node, options);
  return node;
}

export interface StackOptions extends FrameOptions {
  align?: 'MIN' | 'CENTER' | 'MAX';
  /** Fixes the frame along its own axis instead of hugging its contents. */
  width?: number;
}

function stack(
  name: string,
  direction: 'HORIZONTAL' | 'VERTICAL',
  spacing: number,
  options: StackOptions,
): FrameNode {
  const node = figma.createFrame();
  node.name = name;
  node.layoutMode = direction;
  node.itemSpacing = spacing;
  node.primaryAxisSizingMode = 'AUTO';
  node.counterAxisSizingMode = 'AUTO';
  node.counterAxisAlignItems = options.align ?? 'MIN';
  applyFrameOptions(node, options);
  if (options.width !== undefined) {
    node.counterAxisSizingMode = 'FIXED';
    node.resize(options.width, Math.max(node.height, 1));
  }
  return node;
}

export function column(name: string, spacing: number, options: StackOptions = {}): FrameNode {
  return stack(name, 'VERTICAL', spacing, options);
}

export function row(name: string, spacing: number, options: StackOptions = {}): FrameNode {
  return stack(name, 'HORIZONTAL', spacing, options);
}

/**
 * A fixed-width horizontal auto-layout that wraps — the grid every icon page
 * uses, so a longer release reflows instead of running off the canvas.
 */
export function wrapGrid(
  name: string,
  width: number,
  gap: number,
  rowGap: number,
  options: FrameOptions = {},
): FrameNode {
  const node = figma.createFrame();
  node.name = name;
  node.layoutMode = 'HORIZONTAL';
  // Both of these must be in place before `layoutWrap` is assigned.
  node.primaryAxisSizingMode = 'FIXED';
  node.counterAxisSizingMode = 'AUTO';
  node.layoutWrap = 'WRAP';
  node.itemSpacing = gap;
  node.counterAxisSpacing = rowGap;
  applyFrameOptions(node, options);
  node.resize(width, Math.max(node.height, 1));
  return node;
}

/** A hairline rule. A 1-unit rectangle beats a LINE for auto-layout behaviour. */
export function rule(width: number, colour: string): RectangleNode {
  const node = figma.createRectangle();
  node.name = 'Rule';
  node.resize(width, 1);
  node.fills = [solid(colour)];
  return node;
}

/** A pill. Used for review states, where the colour is carrying meaning. */
export function badge(label: string, ink: string, background: string): FrameNode {
  const pill = row('Badge', 0, {
    fill: background,
    padding: [3, 8, 3, 8],
    cornerRadius: 999,
    align: 'CENTER',
  });
  pill.appendChild(text(label, { font: MEDIUM, size: 11, colour: ink, lineHeight: 130 }));
  return pill;
}
