/**
 * Builds the visual-review boards used to judge the released set by eye.
 *
 *   reviews/visual-qa/complete-set-{16,20,24,32,48}px.svg
 *   reviews/visual-qa/category-boards/{category}.svg
 *   reviews/visual-qa/dark-canvas-board.svg
 *   reviews/visual-qa/optical-scale-board.svg
 *   reviews/visual-qa/metrics.json
 *
 * The automated checks in `npm run validate` prove an icon sits inside the
 * canvas. They cannot tell you whether it reads as the object it names, or
 * whether it carries the same visual weight as the icon beside it. These boards
 * exist so a person can answer those questions, and `metrics.json` gives that
 * person numbers to argue with — ink coverage, bounds, optical centre — rather
 * than only an impression.
 */

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { PATHS, ROOT, listSvgAssets, loadCategories, loadIcons, relative } from './lib/repo.ts';
import { iconBody } from './lib/generators.ts';
import { measureAsset } from './lib/validate.ts';
import { parseSvg } from './lib/svg-document.ts';

const OUT = path.join(ROOT, 'reviews/visual-qa');
const SIZES = [16, 20, 24, 32, 48] as const;

/* The site's own tokens, so a board reads like the product rather than a test page. */
const PAPER = '#FAF9F6';
const INK = '#16150F';
const LINE = '#E2DED3';
const MUTED = '#56524A';
const ACCENT = '#B4531F';

function esc(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/** One icon, drawn at `size` with its top-left at (x, y). */
function glyph(body: string, x: number, y: number, size: number, stroke: string): string {
  const scale = size / 24;
  return (
    `<g transform="translate(${x} ${y}) scale(${scale})" fill="none" stroke="${stroke}" ` +
    `stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${body}</g>`
  );
}

function label(text: string, x: number, y: number, fill: string, size = 7): string {
  return (
    `<text x="${x}" y="${y}" font-family="ui-monospace,SFMono-Regular,Menlo,monospace" ` +
    `font-size="${size}" fill="${fill}" text-anchor="middle">${esc(text)}</text>`
  );
}

function frame(width: number, height: number, background: string, body: string): string {
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" ` +
    `viewBox="0 0 ${width} ${height}">` +
    `<rect width="${width}" height="${height}" fill="${background}"/>${body}</svg>\n`
  );
}

interface Entry {
  id: string;
  category: string;
  categoryLabel: string;
  body: string;
  geometry: { minX: number; maxX: number; minY: number; maxY: number };
}

/**
 * The whole set at one size, on a fixed grid, every icon on a shared baseline
 * within its cell. Same cell size at every board size, so the icons change and
 * the layout does not — that is what makes two boards comparable.
 */
function completeSetBoard(entries: Entry[], size: number, dark: boolean): string {
  const cols = 8;
  const cellW = 96;
  const cellH = 84;
  const padX = 32;
  const padTop = 78;
  const rows = Math.ceil(entries.length / cols);
  const width = padX * 2 + cols * cellW;
  const height = padTop + rows * cellH + 40;
  const bg = dark ? INK : PAPER;
  const fg = dark ? PAPER : INK;
  const sub = dark ? '#B0AA9C' : MUTED;
  const rule = dark ? '#2C2A23' : LINE;

  const parts: string[] = [
    `<text x="${padX}" y="34" font-family="ui-sans-serif,system-ui,sans-serif" font-size="17" fill="${fg}">` +
      `African Icon Library — complete set at ${size} px${dark ? ' (dark canvas)' : ''}</text>`,
    `<text x="${padX}" y="52" font-family="ui-sans-serif,system-ui,sans-serif" font-size="11" fill="${sub}">` +
      `${entries.length} released icons, regular weight. Every icon is centred on a shared baseline in a ${cellW}×${cellH} cell.</text>`,
    `<line x1="${padX}" y1="62" x2="${width - padX}" y2="62" stroke="${rule}"/>`,
  ];

  entries.forEach((entry, index) => {
    const col = index % cols;
    const row = Math.floor(index / cols);
    const cx = padX + col * cellW + cellW / 2;
    const baseline = padTop + row * cellH + 46;
    /* Baseline-aligned: the cell's baseline is the bottom of the 24-unit canvas. */
    const gx = cx - size / 2;
    const gy = baseline - size;
    parts.push(glyph(entry.body, gx, gy, size, fg));
    parts.push(label(entry.id, cx, baseline + 16, sub));
  });

  return frame(width, height, bg, parts.join('\n'));
}

/** One category, each icon shown at all five sizes in a row. */
function categoryBoard(entries: Entry[], categoryLabel: string): string {
  const labelW = 150;
  const colW = 74;
  const rowH = 68;
  const padX = 28;
  const padTop = 76;
  const width = padX * 2 + labelW + SIZES.length * colW;
  const height = padTop + entries.length * rowH + 36;

  const parts: string[] = [
    `<text x="${padX}" y="32" font-family="ui-sans-serif,system-ui,sans-serif" font-size="16" fill="${INK}">` +
      `${esc(categoryLabel)}</text>`,
    `<text x="${padX}" y="50" font-family="ui-sans-serif,system-ui,sans-serif" font-size="11" fill="${MUTED}">` +
      `${entries.length} icon${entries.length === 1 ? '' : 's'} · the 16 px column decides whether a drawing survives</text>`,
    `<line x1="${padX}" y1="60" x2="${width - padX}" y2="60" stroke="${LINE}"/>`,
  ];

  SIZES.forEach((size, i) => {
    const cx = padX + labelW + i * colW + colW / 2;
    parts.push(label(`${size}px`, cx, padTop - 8, MUTED));
  });

  entries.forEach((entry, row) => {
    const baseline = padTop + row * rowH + 40;
    parts.push(
      `<text x="${padX}" y="${baseline}" font-family="ui-monospace,SFMono-Regular,Menlo,monospace" ` +
        `font-size="10" fill="${INK}">${esc(entry.id)}</text>`,
    );
    SIZES.forEach((size, i) => {
      const cx = padX + labelW + i * colW + colW / 2;
      parts.push(glyph(entry.body, cx - size / 2, baseline - size, size, INK));
    });
    parts.push(
      `<line x1="${padX}" y1="${baseline + 14}" x2="${width - padX}" y2="${baseline + 14}" stroke="${LINE}" stroke-opacity="0.6"/>`,
    );
  });

  return frame(width, height, PAPER, parts.join('\n'));
}

/**
 * Bounding box, optical centre and ink coverage, drawn on the canvas itself.
 *
 * The dashed square is the 2-unit live area. The solid box is the drawing's
 * true geometric extent. The cross is the centre of that extent — when it sits
 * off the canvas centre, the icon will look mis-set beside its neighbours even
 * though every automated rule passes.
 */
function opticalScaleBoard(entries: Entry[], coverage: Map<string, number>): string {
  const cols = 6;
  const cell = 132;
  const padX = 32;
  const padTop = 86;
  const rows = Math.ceil(entries.length / cols);
  const width = padX * 2 + cols * cell;
  const height = padTop + rows * cell + 40;
  const draw = 84; /* px the 24-unit canvas is drawn at */

  const coverages = entries.map((e) => coverage.get(e.id) ?? 0);
  const median = [...coverages].sort((a, b) => a - b)[Math.floor(coverages.length / 2)] ?? 0;

  const parts: string[] = [
    `<text x="${padX}" y="34" font-family="ui-sans-serif,system-ui,sans-serif" font-size="17" fill="${INK}">` +
      `Optical scale, bounds and visual mass</text>`,
    `<text x="${padX}" y="52" font-family="ui-sans-serif,system-ui,sans-serif" font-size="11" fill="${MUTED}">` +
      `Dashed = 2-unit live area. Solid = true geometric bounds. Cross = optical centre of the drawing.</text>`,
    `<text x="${padX}" y="66" font-family="ui-sans-serif,system-ui,sans-serif" font-size="11" fill="${MUTED}">` +
      `Percentage = ink coverage measured by rasterising at 48 px. Median across the set is ${median.toFixed(1)}%; ` +
      `a figure far from it reads heavier or lighter than its neighbours.</text>`,
    `<line x1="${padX}" y1="76" x2="${width - padX}" y2="76" stroke="${LINE}"/>`,
  ];

  entries.forEach((entry, index) => {
    const col = index % cols;
    const row = Math.floor(index / cols);
    const ox = padX + col * cell + (cell - draw) / 2;
    const oy = padTop + row * cell + 8;
    const u = draw / 24; /* one canvas unit in px */
    const g = entry.geometry;
    const cover = coverage.get(entry.id) ?? 0;
    const drift = Math.abs(cover - median);

    parts.push(
      `<rect x="${ox}" y="${oy}" width="${draw}" height="${draw}" fill="none" stroke="${LINE}"/>`,
    );
    parts.push(
      `<rect x="${ox + 2 * u}" y="${oy + 2 * u}" width="${20 * u}" height="${20 * u}" fill="none" ` +
        `stroke="${LINE}" stroke-dasharray="2 2"/>`,
    );
    parts.push(glyph(entry.body, ox, oy, draw, INK));
    parts.push(
      `<rect x="${ox + g.minX * u}" y="${oy + g.minY * u}" width="${(g.maxX - g.minX) * u}" ` +
        `height="${(g.maxY - g.minY) * u}" fill="none" stroke="${ACCENT}" stroke-opacity="0.55"/>`,
    );
    const ccx = ox + ((g.minX + g.maxX) / 2) * u;
    const ccy = oy + ((g.minY + g.maxY) / 2) * u;
    parts.push(
      `<path d="M${ccx - 4} ${ccy}H${ccx + 4}M${ccx} ${ccy - 4}V${ccy + 4}" stroke="${ACCENT}" stroke-width="1"/>`,
    );
    parts.push(label(entry.id, ox + draw / 2, oy + draw + 14, MUTED));
    parts.push(
      label(
        `${cover.toFixed(1)}%`,
        ox + draw / 2,
        oy + draw + 25,
        drift > median * 0.45 ? ACCENT : MUTED,
        6.5,
      ),
    );
  });

  return frame(width, height, PAPER, parts.join('\n'));
}

async function main(): Promise<number> {
  const [icons, categories, assets] = await Promise.all([
    loadIcons(),
    loadCategories(),
    listSvgAssets(PATHS.iconsSvgRoot),
  ]);

  const sources = new Map(assets.map((a) => [a.id, a.source]));
  const categoryLabels = new Map(categories.map((c) => [c.id, c.label]));

  const entries: Entry[] = icons.map((icon) => {
    const source = sources.get(icon.id) ?? '';
    const { geometry } = measureAsset(parseSvg(source));
    return {
      id: icon.id,
      category: icon.category,
      categoryLabel: categoryLabels.get(icon.category) ?? icon.category,
      body: iconBody(source),
      geometry,
    };
  });

  /* Ink coverage is measured externally by the rasteriser; fall back to 0 so the
     boards still build in isolation. */
  let coverage = new Map<string, number>();
  try {
    const raw = await readFile(path.join(OUT, 'coverage.json'), 'utf8');
    coverage = new Map(Object.entries(JSON.parse(raw) as Record<string, number>));
  } catch {
    /* first run: no coverage yet */
  }

  await mkdir(path.join(OUT, 'category-boards'), { recursive: true });

  const written: string[] = [];
  for (const size of SIZES) {
    const file = path.join(OUT, `complete-set-${size}px.svg`);
    await writeFile(file, completeSetBoard(entries, size, false), 'utf8');
    written.push(file);
  }

  await writeFile(
    path.join(OUT, 'dark-canvas-board.svg'),
    completeSetBoard(entries, 32, true),
    'utf8',
  );
  written.push(path.join(OUT, 'dark-canvas-board.svg'));

  await writeFile(
    path.join(OUT, 'optical-scale-board.svg'),
    opticalScaleBoard(entries, coverage),
    'utf8',
  );
  written.push(path.join(OUT, 'optical-scale-board.svg'));

  for (const category of categories) {
    const inCategory = entries.filter((e) => e.category === category.id);
    if (inCategory.length === 0) continue;
    const file = path.join(OUT, 'category-boards', `${category.id}.svg`);
    await writeFile(file, categoryBoard(inCategory, category.label), 'utf8');
    written.push(file);
  }

  /* Machine-readable companion to the boards. */
  await writeFile(
    path.join(OUT, 'metrics.json'),
    `${JSON.stringify(
      Object.fromEntries(
        entries.map((e) => [
          e.id,
          {
            category: e.category,
            bounds: e.geometry,
            width: Number((e.geometry.maxX - e.geometry.minX).toFixed(3)),
            height: Number((e.geometry.maxY - e.geometry.minY).toFixed(3)),
            opticalCentre: {
              x: Number(((e.geometry.minX + e.geometry.maxX) / 2).toFixed(3)),
              y: Number(((e.geometry.minY + e.geometry.maxY) / 2).toFixed(3)),
            },
            inkCoveragePercent: coverage.get(e.id) ?? null,
          },
        ]),
      ),
      null,
      2,
    )}\n`,
    'utf8',
  );

  process.stdout.write(
    `${written.length + 1} review boards written to ${relative(OUT)}\n` +
      `  ${SIZES.length} complete-set boards, ${categories.filter((c) => entries.some((e) => e.category === c.id)).length} category boards,\n` +
      `  1 dark canvas, 1 optical scale, metrics.json\n`,
  );
  return 0;
}

process.exitCode = await main();
