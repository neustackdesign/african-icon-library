/**
 * Renders review sheets for the released set.
 *
 *   previews/contact-sheet.html   every icon at 16/24/32/48 px, light and dark
 *   previews/proof-strip-24.svg   the 24 px legibility strip from the v3 audit
 *
 * The 24 px strip is the check the audit built its case on: if a glyph does
 * not read at 24 px it is not an icon. Regenerate it after every redraw.
 */

import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { PATHS, listSvgAssets, loadCategories, loadIcons, relative } from './lib/repo.ts';
import { iconBody } from './lib/generators.ts';

const SIZES = [16, 24, 32, 48];

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

async function run(): Promise<number> {
  const [icons, categories, assets] = await Promise.all([
    loadIcons(),
    loadCategories(),
    listSvgAssets(PATHS.iconsSvgRoot),
  ]);

  if (assets.length === 0) {
    process.stderr.write('no assets to preview — run `npm run ingest` first\n');
    return 1;
  }

  const bodies = new Map(
    assets.map((asset) => [`${asset.id}:${asset.weight}`, iconBody(asset.source)]),
  );
  const categoryLabels = new Map(categories.map((category) => [category.id, category.label]));

  await mkdir(PATHS.previews, { recursive: true });

  /* ---------------- contact sheet ---------------- */

  const rows = icons
    .map((icon) => {
      const body = bodies.get(`${icon.id}:regular`) ?? '';
      const cells = SIZES.map(
        (size) =>
          `<td><svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" ` +
          `stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" ` +
          `aria-hidden="true">${body}</svg></td>`,
      ).join('');
      return (
        `<tr><th scope="row"><code>${escapeHtml(icon.id)}</code>` +
        `<span>${escapeHtml(categoryLabels.get(icon.category) ?? icon.category)}</span></th>${cells}</tr>`
      );
    })
    .join('\n      ');

  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>African Icon Library — contact sheet</title>
    <style>
      :root { color-scheme: light dark; }
      body {
        margin: 0;
        padding: 32px;
        font: 14px/1.5 ui-sans-serif, system-ui, sans-serif;
        background: Canvas;
        color: CanvasText;
      }
      h1 { font-size: 20px; margin: 0 0 4px; }
      p { margin: 0 0 24px; opacity: 0.7; }
      table { border-collapse: collapse; width: 100%; max-width: 720px; }
      th, td { border-bottom: 1px solid color-mix(in srgb, CanvasText 12%, transparent); padding: 10px 8px; }
      th { text-align: left; font-weight: 400; }
      th span { display: block; font-size: 11px; opacity: 0.6; }
      td { text-align: center; width: 72px; vertical-align: middle; }
      thead td { font-size: 11px; opacity: 0.6; }
      code { font: 12px ui-monospace, SFMono-Regular, Menlo, monospace; }
    </style>
  </head>
  <body>
    <h1>African Icon Library — contact sheet</h1>
    <p>${icons.length} released icons, regular weight, at ${SIZES.join(' / ')} px. Rendered in your system theme.</p>
    <table>
      <thead>
        <tr><td></td>${SIZES.map((size) => `<td>${size} px</td>`).join('')}</tr>
      </thead>
      <tbody>
      ${rows}
      </tbody>
    </table>
  </body>
</html>
`;

  await writeFile(path.join(PATHS.previews, 'contact-sheet.html'), html, 'utf8');

  /* ---------------- 24 px proof strip ---------------- */

  const columns = 8;
  const cell = 40;
  const rowsCount = Math.ceil(icons.length / columns);
  const width = columns * cell;
  const height = rowsCount * cell;

  const glyphs = icons
    .map((icon, index) => {
      const x = (index % columns) * cell + (cell - 24) / 2;
      const y = Math.floor(index / columns) * cell + (cell - 24) / 2;
      const body = bodies.get(`${icon.id}:regular`) ?? '';
      return `  <g transform="translate(${x} ${y})">${body}</g>`;
    })
    .join('\n');

  const strip = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
${glyphs}
</svg>
`;

  await writeFile(path.join(PATHS.previews, 'proof-strip-24.svg'), strip, 'utf8');

  process.stdout.write(
    [
      `previewed ${icons.length} icons`,
      `  ${relative(path.join(PATHS.previews, 'contact-sheet.html'))}`,
      `  ${relative(path.join(PATHS.previews, 'proof-strip-24.svg'))}`,
      '',
    ].join('\n'),
  );

  return 0;
}

process.exitCode = await run();
