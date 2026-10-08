import { readFile, readdir, rm } from 'node:fs/promises';
import path from 'node:path';

import type {
  Category,
  CountryMap,
  Icon,
  Region,
  Weight,
} from '../../packages/metadata/src/schema.ts';
import { WEIGHTS } from '../../packages/metadata/src/schema.ts';
import {
  toPublicCategory,
  toPublicIcon,
  toPublicRegion,
  type LibrarySummary,
} from '../../packages/metadata/src/public.ts';
import {
  PATHS,
  ROOT,
  listSvgAssets,
  loadCategories,
  loadIcons,
  loadMapRegions,
  loadMaps,
  listMapAssets,
  loadMapSources,
  writeGenerated,
  type SvgAsset,
} from './repo.ts';
import { regionsSchema } from '../../packages/metadata/src/schema.ts';
import { parseSvg, serializeChildren, type SvgNode } from './svg-document.ts';

/**
 * The repository version is the release version: the release workflow refuses
 * to publish unless the tag and all four package versions agree with it. Every
 * generated surface reads it from here so no copy of it can drift.
 */
const REPO_VERSION: string = JSON.parse(
  await readFile(new URL('../../package.json', import.meta.url), 'utf8'),
).version;

/* ------------------------------------------------------------------ *
 * Shared helpers
 * ------------------------------------------------------------------ */

export function pascalCase(id: string): string {
  return id
    .split('-')
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join('');
}

/** JSON.stringify with a trailing newline and deterministic key order for objects we build. */
function literal(value: unknown): string {
  return JSON.stringify(value, null, 2);
}

/** Strips the root element and returns the inner markup of an icon asset. */
export function iconBody(source: string): string {
  const root = parseSvg(source);
  return serializeChildren(root);
}

async function loadRegions(): Promise<Region[]> {
  const file = path.join(PATHS.categories, '..', 'regions.json');
  return regionsSchema.parse(JSON.parse(await readFile(file, 'utf8')));
}

/* ------------------------------------------------------------------ *
 * packages/metadata
 * ------------------------------------------------------------------ */

/**
 * The public release summary: counts of what ships, nothing about how it was
 * made. Audit and pipeline counts stay with the repository's own tooling.
 */
export function buildLibrarySummary(
  icons: readonly Icon[],
  maps: readonly CountryMap[],
): LibrarySummary {
  const shipped = new Set<Weight>();
  for (const icon of icons) for (const weight of icon.weights) shipped.add(weight);
  return {
    version: REPO_VERSION,
    icons: icons.length,
    categories: new Set(icons.map((icon) => icon.category)).size,
    maps: maps.length,
    mapRegions: new Set(maps.map((map) => map.region)).size,
    weights: WEIGHTS.filter((weight) => shipped.has(weight)),
  };
}

export async function generateMetadata(): Promise<string> {
  const [categories, icons, regions, maps, mapRegions] = await Promise.all([
    loadCategories(),
    loadIcons(),
    loadRegions(),
    loadMaps(),
    loadMapRegions(),
  ]);

  const body = [
    "import type { Category, CountryMap, Icon, LibrarySummary, MapRegion, Region } from '../public.js';",
    '',
    '/**',
    ' * Public records only, projected through `src/public.ts`. The canonical',
    ' * records in `src/data/` carry internal maintenance fields; they never reach',
    ' * this module.',
    ' */',
    '',
    '/** Released icons, sorted by id. */',
    `export const icons: readonly Icon[] = ${literal(icons.map(toPublicIcon))};`,
    '',
    `export const categories: readonly Category[] = ${literal(categories.map(toPublicCategory))};`,
    '',
    `export const regions: readonly Region[] = ${literal(regions.map(toPublicRegion))};`,
    '',
    '/** Public facts about this release. */',
    `export const library: LibrarySummary = ${literal(buildLibrarySummary(icons, maps))};`,
    '',
    '/**',
    " * Country maps — a separate asset type, not an icon category. In the master's",
    ' * order: AIL regional grouping, then reading order within each group.',
    ' */',
    `export const maps: readonly CountryMap[] = ${literal(maps)};`,
    '',
    "/** AIL's regional grouping for browsing maps, not a named external standard. */",
    `export const mapRegions: readonly MapRegion[] = ${literal(mapRegions)};`,
  ].join('\n');

  await writeGenerated(PATHS.metadataGenerated, body);
  return PATHS.metadataGenerated;
}

/* ------------------------------------------------------------------ *
 * packages/icons
 * ------------------------------------------------------------------ */

export async function generateIcons(): Promise<string> {
  const assets = await listSvgAssets(PATHS.iconsSvgRoot);

  const byId = new Map<string, Partial<Record<Weight, string>>>();
  for (const asset of assets) {
    const entry = byId.get(asset.id) ?? {};
    entry[asset.weight] = iconBody(asset.source);
    byId.set(asset.id, entry);
  }

  const sorted = [...byId.entries()].sort(([a], [b]) => a.localeCompare(b));

  const body = [
    "import type { Weight } from '@african-icon-library/metadata';",
    '',
    '/**',
    ' * Inner markup for every released icon, keyed by id and weight.',
    ' *',
    ' * Bodies only: the root `<svg>` element is composed at render time from a',
    ' * single template, so `viewBox`, `stroke` and cap/join settings cannot drift',
    ' * between assets.',
    ' */',
    'export const iconBodies: Readonly<Record<string, Partial<Record<Weight, string>>>> = {',
    ...sorted.map(([id, weights]) => {
      const entries = Object.entries(weights)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([weight, markup]) => `    ${weight}: ${JSON.stringify(markup)},`);
      return [`  ${JSON.stringify(id)}: {`, ...entries, '  },'].join('\n');
    }),
    '};',
    '',
    `export const iconIds: readonly string[] = ${literal(sorted.map(([id]) => id))};`,
  ].join('\n');

  await writeGenerated(PATHS.iconsGenerated, body);
  return PATHS.iconsGenerated;
}

/* ------------------------------------------------------------------ *
 * packages/maps
 * ------------------------------------------------------------------ */

/** Native viewBox size of a standalone map document. */
export function mapViewBox(source: string): [number, number] {
  const match = /viewBox="0 0 ([\d.]+) ([\d.]+)"/.exec(source);
  if (!match) throw new Error('a map asset has no "0 0 w h" viewBox');
  return [Number(match[1]), Number(match[2])];
}

export async function generateMaps(): Promise<string> {
  const [assets, maps, { manifest }] = await Promise.all([
    listMapAssets(),
    loadMaps(),
    loadMapSources(),
  ]);
  const byId = new Map(assets.map((asset) => [asset.id, asset]));
  const ordered = maps.map((map) => {
    const asset = byId.get(map.id);
    if (!asset)
      throw new Error(`maps.json lists ${map.id}, but packages/maps/svg/${map.id}.svg is missing`);
    return { id: map.id, body: iconBody(asset.source), box: mapViewBox(asset.source) };
  });

  const body = [
    '/**',
    " * Inner markup for every country map, keyed by id, plus each map's native",
    ' * viewBox. Maps keep their own aspect ratio; the root `<svg>` is composed at',
    ' * render time so paint, stroke and caps cannot drift between maps.',
    ' */',
    'export const mapBodies: Readonly<Record<string, string>> = {',
    ...ordered.map((map) => `  ${JSON.stringify(map.id)}: ${JSON.stringify(map.body)},`),
    '};',
    '',
    "/** `[width, height]` of each map's viewBox. */",
    'export const mapViewBoxes: Readonly<Record<string, readonly [number, number]>> = {',
    ...ordered.map((map) => `  ${JSON.stringify(map.id)}: [${map.box[0]}, ${map.box[1]}],`),
    '};',
    '',
    "/** Every map id, in the master's regional order. */",
    `export const mapIds: readonly string[] = ${literal(ordered.map((map) => map.id))};`,
    '',
    '/** The cartographic policy from `packages/maps/source/manifest.json`. */',
    `export const MAP_BOUNDARY_POLICY = ${JSON.stringify(manifest.policy)};`,
  ].join('\n');

  await writeGenerated(PATHS.mapsGenerated, body);
  return PATHS.mapsGenerated;
}

/* ------------------------------------------------------------------ *
 * packages/react
 * ------------------------------------------------------------------ */

const JSX_ATTRIBUTE_NAMES: Record<string, string> = {
  'stroke-width': 'strokeWidth',
  'stroke-linecap': 'strokeLinecap',
  'stroke-linejoin': 'strokeLinejoin',
  'fill-rule': 'fillRule',
  'clip-rule': 'clipRule',
};

function toJsxAttribute(name: string, value: string): string {
  const jsxName = JSX_ATTRIBUTE_NAMES[name] ?? name;
  const numeric = Number(value);
  if (value.trim() !== '' && Number.isFinite(numeric) && /^-?\d*\.?\d+$/.test(value.trim())) {
    return `${jsxName}={${numeric}}`;
  }
  return `${jsxName}=${JSON.stringify(value)}`;
}

function toJsx(node: SvgNode, indent: string): string {
  const attributes = Object.entries(node.attributes)
    .map(([name, value]) => toJsxAttribute(name, value))
    .join(' ');
  const open = attributes ? `<${node.tag} ${attributes}` : `<${node.tag}`;
  if (node.children.length === 0) return `${indent}${open} />`;
  return [
    `${indent}${open}>`,
    ...node.children.map((child) => toJsx(child, `${indent}  `)),
    `${indent}</${node.tag}>`,
  ].join('\n');
}

export async function generateReact(): Promise<string[]> {
  const [assets, icons] = await Promise.all([listSvgAssets(PATHS.iconsSvgRoot), loadIcons()]);

  // Clear stale components so a removed icon cannot linger in the published package.
  await rm(PATHS.reactIconsDir, { recursive: true, force: true });

  const byId = new Map<string, SvgAsset[]>();
  for (const asset of assets) {
    byId.set(asset.id, [...(byId.get(asset.id) ?? []), asset]);
  }

  const written: string[] = [];
  const exports: string[] = [];

  for (const icon of icons) {
    const forIcon = byId.get(icon.id) ?? [];
    const componentName = pascalCase(icon.id);

    // One entry per drawn weight. The shape is identical whether the icon ships
    // one weight or four, so adding `bold` later changes data, not code shape.
    const geometry = forIcon
      .slice()
      .sort((a, b) => a.weight.localeCompare(b.weight))
      .map((asset) => {
        const root = parseSvg(asset.source);
        return [
          `  ${asset.weight}: (`,
          '    <>',
          root.children.map((child) => toJsx(child, '      ')).join('\n'),
          '    </>',
          '  ),',
        ].join('\n');
      });

    const source = [
      `import { forwardRef, type ReactNode } from 'react';`,
      '',
      `import { IconBase, type IconProps, type IconWeight } from '../icon-base.js';`,
      '',
      `const geometry: Partial<Record<IconWeight, ReactNode>> = {`,
      ...geometry,
      '};',
      '',
      `/** ${icon.name} — ${icon.description} */`,
      `export const ${componentName} = forwardRef<SVGSVGElement, IconProps>(function ${componentName}(`,
      "  { weight = 'regular', ...props },",
      '  ref,',
      ') {',
      '  return (',
      `    <IconBase ref={ref} name=${JSON.stringify(icon.name)} {...props}>`,
      '      {geometry[weight] ?? geometry.regular}',
      '    </IconBase>',
      '  );',
      '});',
    ].join('\n');

    const file = path.join(PATHS.reactIconsDir, `${componentName}.tsx`);
    await writeGenerated(file, source);
    written.push(file);
    exports.push(`export { ${componentName} } from '../icons/${componentName}.js';`);
  }

  const indexBody = [
    '/** One entry per released icon. Import individually for tree-shaking. */',
    ...exports.sort(),
    '',
    `export const iconComponentNames: readonly string[] = ${literal(icons.map((icon) => pascalCase(icon.id)).sort())};`,
  ].join('\n');

  await writeGenerated(PATHS.reactGeneratedIndex, indexBody);
  written.push(PATHS.reactGeneratedIndex);
  return written;
}

/* ------------------------------------------------------------------ *
 * apps/figma-plugin
 * ------------------------------------------------------------------ */

/**
 * Bundles everything the plugin needs into a single module.
 *
 * The plugin declares no network access, so this file is the only source of
 * icon data it will ever see. It carries the same released metadata the website
 * uses — so search ranks identically in both — plus complete standalone `<svg>`
 * documents, because `figma.createNodeFromSvg` needs a whole document.
 */
export async function generatePluginData(): Promise<string> {
  const [assets, icons, categories] = await Promise.all([
    listSvgAssets(PATHS.iconsSvgRoot),
    loadIcons(),
    loadCategories(),
  ]);

  const sourcesById: Record<string, Partial<Record<Weight, string>>> = {};
  for (const asset of assets) {
    sourcesById[asset.id] = { ...sourcesById[asset.id], [asset.weight]: asset.source.trim() };
  }

  const usedCategories = categories
    .filter((category: Category) => icons.some((icon) => icon.category === category.id))
    .map((category) => ({ id: category.id, label: category.label }));

  const shippedWeights = [...new Set(icons.flatMap((icon) => icon.weights))].sort();

  const body = [
    "import type { Icon } from '@african-icon-library/metadata';",
    '',
    '/** Released icons in the public metadata shape, identical to what the website consumes. */',
    `export const PLUGIN_ICONS: Icon[] = ${literal(icons.map(toPublicIcon))};`,
    '',
    '/** Standalone SVG documents, keyed by icon id and then by drawn weight. */',
    `export const PLUGIN_SVG: Record<string, Record<string, string | undefined>> = ${literal(sourcesById)};`,
    '',
    '/** Only categories that actually contain a released icon — no empty filters. */',
    `export const PLUGIN_CATEGORIES: Array<{ id: string; label: string }> = ${literal(usedCategories)};`,
    '',
    '/** Weights the library has actually drawn. Undrawn weights are never offered. */',
    `export const PLUGIN_WEIGHTS: string[] = ${literal(shippedWeights)};`,
  ].join('\n');

  await writeGenerated(PATHS.pluginGenerated, body);
  return PATHS.pluginGenerated;
}

/**
 * Country-map data for the plugin and the Community builder: the released map
 * metadata, AIL's regional grouping, and each map as a complete standalone
 * `<svg>` document with its native viewBox size.
 */
export async function generatePluginMapData(): Promise<string> {
  const [assets, maps, mapRegions, { manifest }] = await Promise.all([
    listMapAssets(),
    loadMaps(),
    loadMapRegions(),
    loadMapSources(),
  ]);
  const byId = new Map(assets.map((asset) => [asset.id, asset]));
  const svg: Record<string, string> = {};
  const boxes: Record<string, [number, number]> = {};
  for (const map of maps) {
    const asset = byId.get(map.id);
    if (!asset) throw new Error(`no SVG for map ${map.id}`);
    svg[map.id] = asset.source.trim();
    boxes[map.id] = mapViewBox(asset.source);
  }
  const usedRegions = mapRegions.filter((region) => maps.some((map) => map.region === region.id));

  const body = [
    "import type { CountryMap } from '@african-icon-library/metadata';",
    '',
    "/** Released country maps, in the master's regional order. */",
    `export const PLUGIN_MAPS: CountryMap[] = ${literal(maps)};`,
    '',
    '/** Standalone SVG documents, keyed by map id. */',
    `export const PLUGIN_MAP_SVG: Record<string, string> = ${literal(svg)};`,
    '',
    "/** `[width, height]` of each map's native viewBox. */",
    `export const PLUGIN_MAP_BOXES: Record<string, [number, number]> = ${literal(boxes)};`,
    '',
    "/** AIL's regional grouping, limited to regions that contain a map. */",
    `export const PLUGIN_MAP_REGIONS: Array<{ id: string; label: string }> = ${literal(usedRegions)};`,
    '',
    '/** The cartographic policy from `packages/maps/source/manifest.json`. */',
    `export const MAP_BOUNDARY_POLICY = ${JSON.stringify(manifest.policy)};`,
  ].join('\n');

  await writeGenerated(PATHS.pluginMapsGenerated, body);
  return PATHS.pluginMapsGenerated;
}

/* ------------------------------------------------------------------ *
 * apps/web — repository documents
 * ------------------------------------------------------------------ */

/**
 * Documents the website renders. They stay canonical in the repository — that
 * is where contributors read and edit them — and are compiled into the web app
 * so the site never reads outside its own directory at build time.
 */
export const WEB_DOCUMENTS = [
  'LICENSE',
  'CHANGELOG.md',
  'CONTRIBUTING.md',
  'docs/icon-spec.md',
] as const;

export async function generateWebContent(): Promise<string> {
  const entries: Array<[string, string]> = [];
  for (const document of WEB_DOCUMENTS) {
    const file = path.join(ROOT, document);
    try {
      entries.push([document, await readFile(file, 'utf8')]);
    } catch {
      throw new Error(`the website expects ${document}, but it does not exist`);
    }
  }

  const body = [
    '/** Canonical repository documents, compiled in so the site reads no files at runtime. */',
    'export const DOCUMENTS: Record<string, string> = {',
    ...entries.map(([name, source]) => `  ${JSON.stringify(name)}: ${JSON.stringify(source)},`),
    '};',
    '',
    `export type DocumentName = ${entries.map(([name]) => JSON.stringify(name)).join(' | ')};`,
  ].join('\n');

  await writeGenerated(PATHS.webDocuments, body);
  return PATHS.webDocuments;
}

/* ------------------------------------------------------------------ *
 * Orchestration
 * ------------------------------------------------------------------ */

export async function generateAll(): Promise<string[]> {
  const written: string[] = [];
  written.push(await generateMetadata());
  written.push(await generateIcons());
  written.push(await generateMaps());
  written.push(...(await generateReact()));
  written.push(await generatePluginData());
  written.push(await generatePluginMapData());
  written.push(await generateWebContent());
  return written;
}

/** Lists every file the generators own, so drift checks can be exhaustive. */
export async function listGeneratedFiles(): Promise<string[]> {
  const files = [
    PATHS.metadataGenerated,
    PATHS.iconsGenerated,
    PATHS.mapsGenerated,
    PATHS.reactGeneratedIndex,
    PATHS.pluginGenerated,
    PATHS.pluginMapsGenerated,
    PATHS.webDocuments,
  ];
  try {
    const components = await readdir(PATHS.reactIconsDir);
    files.push(...components.map((file) => path.join(PATHS.reactIconsDir, file)));
  } catch {
    /* the directory does not exist yet */
  }
  return files.sort();
}
