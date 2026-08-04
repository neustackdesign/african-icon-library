import path from 'node:path';

import {
  BASELINE_WEIGHT,
  checkMetadataConsistency,
  type Category,
  type Icon,
  type Weight,
} from '../../packages/metadata/src/schema.ts';
import {
  EMPTY_BOX,
  expandBox,
  isEmptyBox,
  mergeBoxes,
  roundBox,
  shapeBounds,
  type Box,
} from './path-geometry.ts';
import { parseSvg, walk, type SvgNode } from './svg-document.ts';
import { ROOT_ATTRIBUTES } from './svg-optimize.ts';
import type { SvgAsset } from './repo.ts';

export const CANVAS = 24;
export const LIVE_AREA_PADDING = 2;
export const STROKE_WIDTH = 1.5;

export type Severity = 'error' | 'warning';

export interface Finding {
  rule: string;
  severity: Severity;
  target: string;
  message: string;
}

/* ------------------------------------------------------------------ *
 * Allow-lists
 * ------------------------------------------------------------------ */

/** Elements an icon-tier asset may contain. Anything else is a hard failure. */
export const ALLOWED_ELEMENTS = new Set([
  'svg',
  'g',
  'path',
  'circle',
  'ellipse',
  'rect',
  'line',
  'polyline',
  'polygon',
]);

/**
 * Elements that carry or can render text. These are banned outright: the
 * drawing spec forbids letterforms, and baked-in type cannot be localised,
 * cannot be restyled, and turns to dirt below 24 px.
 */
export const TEXT_ELEMENTS = new Set(['text', 'tspan', 'textPath', 'altGlyph', 'foreignObject']);

/** Elements that can execute, fetch or embed. Never allowed in a distributed asset. */
export const ACTIVE_ELEMENTS = new Set([
  'script',
  'image',
  'use',
  'animate',
  'animateTransform',
  'animateMotion',
  'set',
  'style',
  'filter',
  'mask',
  'pattern',
  'clipPath',
  'switch',
]);

const PRESENTATION_ATTRIBUTES = new Set([
  'fill',
  'stroke',
  'stroke-width',
  'stroke-linecap',
  'stroke-linejoin',
  'fill-rule',
]);

const GEOMETRY_ATTRIBUTES: Record<string, ReadonlySet<string>> = {
  svg: new Set(['xmlns', 'width', 'height', 'viewBox']),
  g: new Set([]),
  path: new Set(['d']),
  rect: new Set(['x', 'y', 'width', 'height', 'rx', 'ry']),
  circle: new Set(['cx', 'cy', 'r']),
  ellipse: new Set(['cx', 'cy', 'rx', 'ry']),
  line: new Set(['x1', 'y1', 'x2', 'y2']),
  polyline: new Set(['points']),
  polygon: new Set(['points']),
};

/** Values a paint attribute is allowed to hold. Everything else is a hard-coded colour. */
const ALLOWED_PAINTS = new Set(['none', 'currentColor', 'inherit']);

const PAINT_ATTRIBUTES = new Set([
  'fill',
  'stroke',
  'color',
  'stop-color',
  'flood-color',
  'lighting-color',
]);

const COLOUR_LITERAL =
  /(#[0-9a-fA-F]{3,8}\b|\b(?:rgb|rgba|hsl|hsla|color|lab|lch|oklab|oklch)\(|\burl\()/;

/* ------------------------------------------------------------------ *
 * Per-asset rules
 * ------------------------------------------------------------------ */

function findingsForRootAttributes(root: SvgNode, target: string): Finding[] {
  const findings: Finding[] = [];
  const actual = root.attributes;

  for (const [name, expected] of ROOT_ATTRIBUTES) {
    const value = actual[name];
    if (value === undefined) {
      findings.push({
        rule: 'root-attributes',
        severity: 'error',
        target,
        message: `root <svg> is missing the required attribute ${name}="${expected}"`,
      });
    } else if (value !== expected) {
      findings.push({
        rule: 'root-attributes',
        severity: 'error',
        target,
        message: `root <svg> has ${name}="${value}" but the spec requires ${name}="${expected}"`,
      });
    }
  }

  const expectedNames = new Set(ROOT_ATTRIBUTES.map(([name]) => name));
  for (const name of Object.keys(actual)) {
    if (!expectedNames.has(name)) {
      findings.push({
        rule: 'root-attributes',
        severity: 'error',
        target,
        message: `root <svg> carries the unexpected attribute "${name}"`,
      });
    }
  }

  return findings;
}

function findingsForViewBox(root: SvgNode, target: string): Finding[] {
  const viewBox = root.attributes.viewBox;
  if (viewBox === undefined) {
    return [{ rule: 'viewbox', severity: 'error', target, message: 'no viewBox attribute' }];
  }
  const parts = viewBox
    .trim()
    .split(/[\s,]+/)
    .map(Number);
  if (parts.length !== 4 || parts.some((value) => !Number.isFinite(value))) {
    return [
      {
        rule: 'viewbox',
        severity: 'error',
        target,
        message: `viewBox "${viewBox}" is not four numbers`,
      },
    ];
  }
  const [minX, minY, width, height] = parts;
  if (minX !== 0 || minY !== 0 || width !== CANVAS || height !== CANVAS) {
    return [
      {
        rule: 'viewbox',
        severity: 'error',
        target,
        message: `viewBox is "${viewBox}" but every icon-tier asset must use "0 0 ${CANVAS} ${CANVAS}"`,
      },
    ];
  }
  return [];
}

function findingsForElements(root: SvgNode, target: string): Finding[] {
  const findings: Finding[] = [];
  let shapeCount = 0;

  for (const node of walk(root)) {
    if (TEXT_ELEMENTS.has(node.tag)) {
      findings.push({
        rule: 'prohibited-text',
        severity: 'error',
        target,
        message: `<${node.tag}> is a text element; the drawing spec forbids letterforms in assets`,
      });
      continue;
    }
    if (ACTIVE_ELEMENTS.has(node.tag)) {
      findings.push({
        rule: 'unsupported-element',
        severity: 'error',
        target,
        message: `<${node.tag}> can script, fetch or embed and is never allowed in a distributed asset`,
      });
      continue;
    }
    if (!ALLOWED_ELEMENTS.has(node.tag)) {
      findings.push({
        rule: 'unsupported-element',
        severity: 'error',
        target,
        message: `<${node.tag}> is not in the supported element set (${[...ALLOWED_ELEMENTS].sort().join(', ')})`,
      });
      continue;
    }

    if (node.tag !== 'svg' && node.tag !== 'g') shapeCount += 1;

    if (node.text.trim().length > 0) {
      findings.push({
        rule: 'prohibited-text',
        severity: 'error',
        target,
        message: `<${node.tag}> contains the text content "${node.text.trim().slice(0, 40)}"`,
      });
    }
  }

  if (shapeCount === 0) {
    findings.push({
      rule: 'empty-drawing',
      severity: 'error',
      target,
      message: 'the asset contains no drawable shapes',
    });
  }

  return findings;
}

function findingsForAttributes(root: SvgNode, target: string): Finding[] {
  const findings: Finding[] = [];
  const seenIds = new Set<string>();

  for (const node of walk(root)) {
    if (!ALLOWED_ELEMENTS.has(node.tag)) continue;
    const allowedGeometry = GEOMETRY_ATTRIBUTES[node.tag] ?? new Set<string>();

    for (const [name, value] of Object.entries(node.attributes)) {
      if (name === 'id') {
        if (seenIds.has(value)) {
          findings.push({
            rule: 'duplicate-element-id',
            severity: 'error',
            target,
            message: `id="${value}" appears more than once`,
          });
        }
        seenIds.add(value);
        findings.push({
          rule: 'prohibited-attribute',
          severity: 'error',
          target,
          message:
            'element ids collide when several icons are inlined into one document; ' +
            'remove id="' +
            value +
            '"',
        });
        continue;
      }

      if (
        name === 'class' ||
        name === 'style' ||
        name.startsWith('data-') ||
        name.startsWith('on')
      ) {
        findings.push({
          rule: 'prohibited-attribute',
          severity: 'error',
          target,
          message: `attribute "${name}" is not allowed on <${node.tag}>`,
        });
        continue;
      }

      if (name === 'transform') {
        findings.push({
          rule: 'prohibited-attribute',
          severity: 'error',
          target,
          message:
            'transforms hide the real coordinates from bounds checking; ' +
            'bake the transform into the geometry instead',
        });
        continue;
      }

      if (PAINT_ATTRIBUTES.has(name) && !ALLOWED_PAINTS.has(value)) {
        findings.push({
          rule: 'hard-coded-colour',
          severity: 'error',
          target,
          message: `${name}="${value}" hard-codes a colour; icons must paint with currentColor or none`,
        });
        continue;
      }

      if (COLOUR_LITERAL.test(value) && !PAINT_ATTRIBUTES.has(name)) {
        findings.push({
          rule: 'hard-coded-colour',
          severity: 'error',
          target,
          message: `${name}="${value}" contains a colour or url() reference`,
        });
        continue;
      }

      if (!allowedGeometry.has(name) && !PRESENTATION_ATTRIBUTES.has(name)) {
        findings.push({
          rule: 'unsupported-attribute',
          severity: 'error',
          target,
          message: `attribute "${name}" is not supported on <${node.tag}>`,
        });
      }
    }
  }

  return findings;
}

export function measureAsset(root: SvgNode): { geometry: Box; stroked: Box } {
  let box = EMPTY_BOX;
  for (const node of walk(root)) {
    if (node.tag === 'svg' || node.tag === 'g') continue;
    const nodeBox = shapeBounds(node.tag, node.attributes);
    if (nodeBox && !isEmptyBox(nodeBox)) box = mergeBoxes(box, nodeBox);
  }
  return { geometry: roundBox(box), stroked: roundBox(expandBox(box, STROKE_WIDTH / 2)) };
}

function findingsForBounds(root: SvgNode, target: string): Finding[] {
  const { geometry, stroked } = measureAsset(root);
  if (isEmptyBox(geometry)) return [];

  const findings: Finding[] = [];
  const epsilon = 1e-6;

  if (
    stroked.minX < -epsilon ||
    stroked.minY < -epsilon ||
    stroked.maxX > CANVAS + epsilon ||
    stroked.maxY > CANVAS + epsilon
  ) {
    findings.push({
      rule: 'bounds-canvas',
      severity: 'error',
      target,
      message:
        `stroked geometry x [${stroked.minX}, ${stroked.maxX}] y [${stroked.minY}, ${stroked.maxY}] ` +
        `leaves the ${CANVAS}-unit canvas and will clip when rendered`,
    });
  }

  const low = LIVE_AREA_PADDING - epsilon;
  const high = CANVAS - LIVE_AREA_PADDING + epsilon;
  if (geometry.minX < low || geometry.minY < low || geometry.maxX > high || geometry.maxY > high) {
    findings.push({
      rule: 'bounds-live-area',
      severity: 'error',
      target,
      message:
        `geometry x [${geometry.minX}, ${geometry.maxX}] y [${geometry.minY}, ${geometry.maxY}] ` +
        `leaves the ${LIVE_AREA_PADDING}-unit live area; the glyph will not sit optically level ` +
        'beside the rest of the set',
    });
  }

  return findings;
}

/** Runs every per-asset rule against one SVG source. */
export function validateAsset(asset: Pick<SvgAsset, 'file' | 'source'>): Finding[] {
  const target = path.basename(asset.file);

  let root: SvgNode;
  try {
    root = parseSvg(asset.source);
  } catch (error) {
    return [{ rule: 'svg-parse', severity: 'error', target, message: (error as Error).message }];
  }

  if (root.tag !== 'svg') {
    return [
      {
        rule: 'svg-parse',
        severity: 'error',
        target,
        message: `root element is <${root.tag}>, expected <svg>`,
      },
    ];
  }

  return [
    ...findingsForRootAttributes(root, target),
    ...findingsForViewBox(root, target),
    ...findingsForElements(root, target),
    ...findingsForAttributes(root, target),
    ...findingsForBounds(root, target),
  ];
}

/* ------------------------------------------------------------------ *
 * Collection rules
 * ------------------------------------------------------------------ */

export interface CollectionInput {
  icons: readonly Icon[];
  categories: readonly Category[];
  assets: readonly SvgAsset[];
  stagingAssets: readonly SvgAsset[];
}

/**
 * Rules that only make sense across the whole set: metadata/asset agreement,
 * unique ids, and weight-variant completeness.
 */
export function validateCollection(input: CollectionInput): Finding[] {
  const { icons, categories, assets, stagingAssets } = input;
  const findings: Finding[] = [];

  for (const issue of checkMetadataConsistency(icons, categories)) {
    findings.push({
      rule: issue.code,
      severity: 'error',
      target: 'metadata',
      message: issue.message,
    });
  }

  const assetsByIcon = new Map<string, Set<Weight>>();
  for (const asset of assets) {
    const expectedName = `${asset.id}.svg`;
    if (path.basename(asset.file) !== expectedName) {
      findings.push({
        rule: 'asset-filename',
        severity: 'error',
        target: path.basename(asset.file),
        message: `file name must match the icon id exactly ("${expectedName}")`,
      });
    }
    const weights = assetsByIcon.get(asset.id) ?? new Set<Weight>();
    if (weights.has(asset.weight)) {
      findings.push({
        rule: 'duplicate-icon-id',
        severity: 'error',
        target: path.basename(asset.file),
        message: `two assets claim id "${asset.id}" at weight "${asset.weight}"`,
      });
    }
    weights.add(asset.weight);
    assetsByIcon.set(asset.id, weights);
  }

  const metadataIds = new Set(icons.map((icon) => icon.id));

  for (const [id, weights] of assetsByIcon) {
    if (!metadataIds.has(id)) {
      findings.push({
        rule: 'missing-metadata',
        severity: 'error',
        target: `${id}.svg`,
        message:
          `the asset has no record in packages/metadata/src/data/icons.json; ` +
          `every released drawing needs metadata before it can ship (weights on disk: ${[...weights].join(', ')})`,
      });
    }
  }

  for (const icon of icons) {
    const onDisk = assetsByIcon.get(icon.id);
    if (!onDisk) {
      findings.push({
        rule: 'missing-asset',
        severity: 'error',
        target: icon.id,
        message: 'metadata declares this icon as released but no SVG asset exists for it',
      });
      continue;
    }
    for (const weight of icon.weights) {
      if (!onDisk.has(weight)) {
        findings.push({
          rule: 'missing-weight-variant',
          severity: 'error',
          target: icon.id,
          message: `metadata declares the "${weight}" weight but packages/icons/svg/${weight}/${icon.id}.svg is missing`,
        });
      }
    }
    for (const weight of onDisk) {
      if (!icon.weights.includes(weight)) {
        findings.push({
          rule: 'undeclared-weight-variant',
          severity: 'error',
          target: icon.id,
          message: `an asset exists at weight "${weight}" but metadata does not declare it`,
        });
      }
    }
  }

  // Weight completeness. The library ships whole weights, not partial ones: if
  // any released icon gains a weight, every released icon must gain it too.
  const shippedWeights = new Set<Weight>();
  for (const icon of icons) for (const weight of icon.weights) shippedWeights.add(weight);
  for (const icon of icons) {
    for (const weight of shippedWeights) {
      if (!icon.weights.includes(weight)) {
        findings.push({
          rule: 'missing-weight-variant',
          severity: 'error',
          target: icon.id,
          message:
            `the library ships the "${weight}" weight for other icons but not for this one. ` +
            'A weight is released for the whole set or not at all — and it must be drawn, ' +
            'never derived by changing stroke-width.',
        });
      }
    }
  }
  if (icons.length > 0 && !shippedWeights.has(BASELINE_WEIGHT)) {
    findings.push({
      rule: 'missing-weight-variant',
      severity: 'error',
      target: 'library',
      message: `no icon ships the baseline "${BASELINE_WEIGHT}" weight`,
    });
  }

  // A drawing cannot be both released and held.
  const stagedIds = new Set(stagingAssets.map((asset) => asset.id));
  for (const id of stagedIds) {
    if (assetsByIcon.has(id) || metadataIds.has(id)) {
      findings.push({
        rule: 'staged-and-released',
        severity: 'error',
        target: id,
        message:
          'this drawing is held in packages/icons/staging but also appears in the released set; ' +
          'a held drawing must not be publicly exposed',
      });
    }
  }

  return findings;
}

export function summarise(findings: readonly Finding[]): { errors: number; warnings: number } {
  return {
    errors: findings.filter((finding) => finding.severity === 'error').length,
    warnings: findings.filter((finding) => finding.severity === 'warning').length,
  };
}
