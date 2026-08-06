/**
 * Generates the launch media kit from the released set.
 *
 * Output is SVG, at the exact pixel dimensions each platform asks for. SVG
 * because these are line drawings on flat colour: rasterising here would bake
 * in a resolution and lose nothing but fidelity. Every asset is drawn from
 * `packages/icons/svg/regular`, so a card can never show an icon the library
 * does not ship.
 *
 * PNG export, when a platform demands one:
 *   npx --yes svgexport media/og-social.svg media/og-social.png 1200:630
 * or open the SVG in any browser and screenshot at 2x.
 */

import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { PATHS, ROOT, listSvgAssets, loadCategories, loadIcons, relative } from './lib/repo.ts';
import { iconBody } from './lib/generators.ts';

const MEDIA_DIR = path.join(ROOT, 'media');

const PAPER = '#FAF9F6';
const INK = '#16150F';
const MUTED = '#56524A';
const ACCENT = '#2E7D4F';
const LINE = '#E2DED3';

const FONT =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Schibsted Grotesk', Roboto, Helvetica, Arial, sans-serif";
const MONO = "ui-monospace, SFMono-Regular, Menlo, 'IBM Plex Mono', monospace";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

interface GlyphOptions {
  x: number;
  y: number;
  size: number;
  stroke?: string;
  strokeWidth?: number;
}

/** Places a 24-unit drawing at an arbitrary size and position. */
function glyph(
  body: string,
  { x, y, size, stroke = INK, strokeWidth = 1.5 }: GlyphOptions,
): string {
  const scale = size / 24;
  return (
    `<g transform="translate(${x} ${y}) scale(${scale})" fill="none" stroke="${stroke}" ` +
    `stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round">${body}</g>`
  );
}

function text(
  value: string,
  x: number,
  y: number,
  options: { size: number; weight?: number; fill?: string; font?: string; anchor?: string } = {
    size: 16,
  },
): string {
  const { size, weight = 400, fill = INK, font = FONT, anchor = 'start' } = options;
  return (
    `<text x="${x}" y="${y}" font-family="${font}" font-size="${size}" font-weight="${weight}" ` +
    `fill="${fill}" text-anchor="${anchor}">${escapeXml(value)}</text>`
  );
}

function document_(width: number, height: number, body: string, background = PAPER): string {
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" ` +
    `viewBox="0 0 ${width} ${height}">` +
    `<rect width="${width}" height="${height}" fill="${background}"/>${body}</svg>\n`
  );
}

async function main(): Promise<number> {
  const [icons, categories, assets] = await Promise.all([
    loadIcons(),
    loadCategories(),
    listSvgAssets(PATHS.iconsSvgRoot),
  ]);

  const bodies = new Map(assets.map((asset) => [asset.id, iconBody(asset.source)]));
  const categoryLabels = new Map(categories.map((category) => [category.id, category.label]));
  const count = icons.length;
  const categoryCount = new Set(icons.map((icon) => icon.category)).size;

  await mkdir(MEDIA_DIR, { recursive: true });
  const written: string[] = [];

  const write = async (name: string, contents: string) => {
    await writeFile(path.join(MEDIA_DIR, name), contents, 'utf8');
    written.push(name);
  };

  /** A row of hero icons, evenly spaced and centred. */
  const heroRow = (ids: string[], y: number, size: number, width: number, stroke = INK) => {
    const gap = size * 0.55;
    const total = ids.length * size + (ids.length - 1) * gap;
    const startX = (width - total) / 2;
    return ids
      .map((id, index) =>
        glyph(bodies.get(id) ?? '', {
          x: startX + index * (size + gap),
          y,
          size,
          stroke,
          strokeWidth: 1.4,
        }),
      )
      .join('');
  };

  const HERO = ['talking-drum', 'danfo', 'suya', 'naira-sign', 'agogo', 'jerry-can', 'shekere'];

  /* ---------------- social / Open Graph, 1200 x 630 ---------------- */

  await write(
    'og-social.svg',
    document_(
      1200,
      630,
      [
        text('OPEN SOURCE · MIT', 80, 110, { size: 20, weight: 600, fill: ACCENT }),
        text('African Icon Library', 80, 200, { size: 68, weight: 800 }),
        text(`${count} icons for African life, drawn on one 24-pixel grid.`, 80, 258, {
          size: 30,
          fill: MUTED,
        }),
        text('Nigeria first; the continent next.', 80, 300, { size: 30, fill: MUTED }),
        heroRow(HERO, 400, 96, 1200),
        `<line x1="80" y1="548" x2="1120" y2="548" stroke="${LINE}" stroke-width="2"/>`,
        text('icons.neustackstudio.com', 80, 585, { size: 22, fill: MUTED, font: MONO }),
        text(`${categoryCount} categories · regular weight`, 1120, 585, {
          size: 22,
          fill: MUTED,
          font: MONO,
          anchor: 'end',
        }),
      ].join(''),
    ),
  );

  /* ---------------- GitHub social preview, 1280 x 640 ---------------- */

  await write(
    'github-social.svg',
    document_(
      1280,
      640,
      [
        text('african-icon-library', 80, 130, { size: 26, weight: 500, fill: MUTED, font: MONO }),
        text('The icons global', 80, 230, { size: 72, weight: 800 }),
        text('libraries never drew.', 80, 310, { size: 72, weight: 800 }),
        heroRow(HERO, 410, 92, 1280),
        text(`${count} icons · MIT · one 24-pixel grid`, 640, 580, {
          size: 24,
          fill: MUTED,
          font: MONO,
          anchor: 'middle',
        }),
      ].join(''),
    ),
  );

  /* ---------------- full collection sheet ---------------- */

  {
    const columns = 8;
    const cell = 150;
    const top = 210;
    const rows = Math.ceil(count / columns);
    const width = columns * cell + 160;
    const height = top + rows * cell + 120;

    const grid = icons
      .map((icon, index) => {
        const x = 80 + (index % columns) * cell;
        const y = top + Math.floor(index / columns) * cell;
        return [
          glyph(bodies.get(icon.id) ?? '', { x: x + (cell - 56) / 2, y, size: 56 }),
          text(icon.id, x + cell / 2, y + 84, {
            size: 13,
            fill: MUTED,
            font: MONO,
            anchor: 'middle',
          }),
        ].join('');
      })
      .join('');

    await write(
      'collection-sheet.svg',
      document_(
        width,
        height,
        [
          text('African Icon Library', 80, 100, { size: 44, weight: 800 }),
          text(
            `Every released icon — ${count} across ${categoryCount} categories, regular weight.`,
            80,
            145,
            { size: 22, fill: MUTED },
          ),
          grid,
          text('icons.neustackstudio.com · MIT', 80, height - 50, {
            size: 18,
            fill: MUTED,
            font: MONO,
          }),
        ].join(''),
      ),
    );
  }

  /* ---------------- 24 px proof strip, the audit's decisive test ---------------- */

  {
    const width = 1600;
    const height = 900;
    const perRow = 16;
    const smallRow = icons
      .slice(0, perRow)
      .map((icon, index) =>
        glyph(bodies.get(icon.id) ?? '', { x: 120 + index * 88, y: 260, size: 24 }),
      )
      .join('');
    const bigRow = icons
      .slice(0, 8)
      .map((icon, index) =>
        glyph(bodies.get(icon.id) ?? '', { x: 120 + index * 176, y: 470, size: 96 }),
      )
      .join('');

    await write(
      'proof-24px.svg',
      document_(
        width,
        height,
        [
          text('The 24-pixel test', 120, 130, { size: 52, weight: 800 }),
          text('If a glyph does not read at UI size, it is not an icon.', 120, 180, {
            size: 24,
            fill: MUTED,
          }),
          smallRow,
          text('↑ actual size, 24 px', 120, 340, { size: 18, fill: MUTED, font: MONO }),
          bigRow,
          text('↑ the same drawings at 400%', 120, 620, { size: 18, fill: MUTED, font: MONO }),
          `<line x1="120" y1="700" x2="${width - 120}" y2="700" stroke="${LINE}" stroke-width="2"/>`,
          text(
            'Every icon in this library is measured against the 24-unit canvas and a 2-unit live area',
            120,
            750,
            { size: 22, fill: MUTED },
          ),
          text('before it is released. The check runs in CI on every commit.', 120, 785, {
            size: 22,
            fill: MUTED,
          }),
        ].join(''),
      ),
    );
  }

  /* ---------------- grid explainer ---------------- */

  {
    const width = 1600;
    const height = 900;
    const canvas = 520;
    const originX = 140;
    const originY = 220;
    const unit = canvas / 24;
    const live = 2 * unit;

    const gridLines = Array.from({ length: 25 }, (_, index) => {
      const at = index * unit;
      const strong = index % 6 === 0;
      return (
        `<line x1="${originX + at}" y1="${originY}" x2="${originX + at}" y2="${originY + canvas}" ` +
        `stroke="${LINE}" stroke-width="${strong ? 2 : 1}"/>` +
        `<line x1="${originX}" y1="${originY + at}" x2="${originX + canvas}" y2="${originY + at}" ` +
        `stroke="${LINE}" stroke-width="${strong ? 2 : 1}"/>`
      );
    }).join('');

    await write(
      'grid-explainer.svg',
      document_(
        width,
        height,
        [
          text('One grid, every icon', 140, 130, { size: 52, weight: 800 }),
          text('24-unit canvas · 2-unit live area · 1.5 stroke · round caps and joins', 140, 178, {
            size: 24,
            fill: MUTED,
          }),
          gridLines,
          `<rect x="${originX + live}" y="${originY + live}" width="${canvas - live * 2}" ` +
            `height="${canvas - live * 2}" fill="none" stroke="${ACCENT}" stroke-width="3" ` +
            `stroke-dasharray="10 8"/>`,
          `<rect x="${originX}" y="${originY}" width="${canvas}" height="${canvas}" fill="none" ` +
            `stroke="${INK}" stroke-width="3"/>`,
          glyph(bodies.get('talking-drum') ?? '', {
            x: originX,
            y: originY,
            size: canvas,
            strokeWidth: 1.5,
          }),
          text('talking-drum', originX, originY + canvas + 46, {
            size: 20,
            fill: MUTED,
            font: MONO,
          }),
          ...[
            ['24 × 24 canvas', 'The coordinate contract. Every asset, no exceptions.'],
            ['2-unit live area', 'Nothing crosses it, so icons sit optically level side by side.'],
            ['1.5 stroke', 'Round caps and joins throughout. Minimum 1.5 counter between strokes.'],
            ['currentColor', 'No hard-coded colour anywhere. Recolour with `color`.'],
            ['No letterforms', 'Type is illegible at icon size and cannot be localised.'],
          ].flatMap(([title, detail], index) => [
            text(title, 800, 280 + index * 92, { size: 28, weight: 650 }),
            text(detail, 800, 316 + index * 92, { size: 20, fill: MUTED }),
          ]),
        ].join(''),
      ),
    );
  }

  /* ---------------- category cards ---------------- */

  for (const category of categories) {
    const members = icons.filter((icon) => icon.category === category.id);
    if (members.length === 0) continue;
    const width = 1200;
    const height = 630;
    const size = 84;
    const gap = 44;
    const perRow = Math.min(members.length, 6);
    const rows = Math.ceil(members.length / perRow);
    const totalWidth = perRow * size + (perRow - 1) * gap;
    const startX = (width - totalWidth) / 2;
    const startY = 300 - ((rows - 1) * (size + gap)) / 2;

    await write(
      `category-${category.id}.svg`,
      document_(
        width,
        height,
        [
          text(category.label.toUpperCase(), 80, 100, { size: 20, weight: 600, fill: ACCENT }),
          text(`${members.length} icons`, 80, 150, { size: 40, weight: 800 }),
          members
            .map((icon, index) =>
              glyph(bodies.get(icon.id) ?? '', {
                x: startX + (index % perRow) * (size + gap),
                y: startY + Math.floor(index / perRow) * (size + gap),
                size,
                strokeWidth: 1.4,
              }),
            )
            .join(''),
          text('African Icon Library · icons.neustackstudio.com', 600, 580, {
            size: 20,
            fill: MUTED,
            font: MONO,
            anchor: 'middle',
          }),
        ].join(''),
      ),
    );
  }

  /* ---------------- before / after cards ---------------- */

  const supersededDir = path.join(ROOT, 'packages/icons/superseded/regular');
  let superseded: string[] = [];
  try {
    superseded = (await readdir(supersededDir)).filter((file) => file.endsWith('.svg'));
  } catch {
    /* nothing superseded */
  }

  for (const file of superseded) {
    const id = path.basename(file, '.svg');
    const before = iconBody(await readFile(path.join(supersededDir, file), 'utf8'));
    const after = bodies.get(id) ?? '';
    const icon = icons.find((candidate) => candidate.id === id);

    await write(
      `before-after-${id}.svg`,
      document_(
        1200,
        630,
        [
          text('REDRAWN', 80, 90, { size: 20, weight: 600, fill: ACCENT }),
          text(id, 80, 150, { size: 44, weight: 800, font: MONO }),
          text(icon?.description ?? 'Redrawn to fit the live area.', 80, 195, {
            size: 22,
            fill: MUTED,
          }),
          `<line x1="600" y1="250" x2="600" y2="500" stroke="${LINE}" stroke-width="2"/>`,
          glyph(before, { x: 260, y: 280, size: 180 }),
          text('before', 350, 510, { size: 22, fill: MUTED, font: MONO, anchor: 'middle' }),
          text('left the 2-unit live area', 350, 542, {
            size: 18,
            fill: MUTED,
            anchor: 'middle',
          }),
          glyph(after, { x: 760, y: 280, size: 180 }),
          text('after', 850, 510, { size: 22, fill: MUTED, font: MONO, anchor: 'middle' }),
          text('fits, and reads at 16 px', 850, 542, { size: 18, fill: MUTED, anchor: 'middle' }),
        ].join(''),
      ),
    );
  }

  /* ---------------- manifest ---------------- */

  await write(
    'README.md',
    [
      '# Media kit',
      '',
      `Generated by \`npm run media\` from the released set — ${count} icons across ` +
        `${categoryCount} categories. Every drawing in every asset is one the library actually ships.`,
      '',
      'Regenerate after any change to the icon set; do not edit these by hand.',
      '',
      '| File | Size | Use |',
      '| --- | --- | --- |',
      '| `og-social.svg` | 1200 × 630 | Open Graph / Twitter card |',
      '| `github-social.svg` | 1280 × 640 | GitHub repository social preview |',
      '| `collection-sheet.svg` | fits the set | The whole collection on one sheet |',
      '| `proof-24px.svg` | 1600 × 900 | The 24-pixel legibility proof |',
      '| `grid-explainer.svg` | 1600 × 900 | The drawing system, shown |',
      ...categories
        .filter((category) => icons.some((icon) => icon.category === category.id))
        .map(
          (category) =>
            `| \`category-${category.id}.svg\` | 1200 × 630 | ${categoryLabels.get(category.id)} pack card |`,
        ),
      ...superseded.map(
        (file) =>
          `| \`before-after-${path.basename(file, '.svg')}.svg\` | 1200 × 630 | Redraw comparison |`,
      ),
      '',
      '## PNG export',
      '',
      'Platforms that insist on a raster file:',
      '',
      '```',
      'npx --yes svgexport media/og-social.svg media/og-social.png 1200:630',
      '```',
      '',
      'Or open the SVG in a browser and screenshot at 2×. The website also serves a rendered PNG',
      'card at `/opengraph-image`, built from the same drawings.',
      '',
      '## Licence',
      '',
      'MIT, same as the library. Attribution is welcome and not required.',
      '',
    ].join('\n'),
  );

  process.stdout.write(
    [
      `generated ${written.length} media asset(s) in ${relative(MEDIA_DIR)}:`,
      ...written.map((name) => `  ${name}`),
      '',
    ].join('\n'),
  );
  return 0;
}

process.exitCode = await main();
