/**
 * Renders every icon at a real 16px (and 20px), then magnifies the resulting
 * bitmap with no interpolation. This is the decisive test: it shows the actual
 * pixels a user gets, not a scaled vector that flatters the drawing.
 */
let chromium;
try {
  ({ chromium } = await import('playwright-core'));
} catch {
  console.error(
    'This exporter needs playwright-core and a local Chromium. It is deliberately not a\n' +
      'dependency of this repository: CI has no browser and should not download one to lint\n' +
      'an icon set. Install it just for this run:\n\n' +
      '  npm install --no-save playwright-core\n\n' +
      'and set CHROME_PATH if your browser is not at the default location.',
  );
  process.exit(1);
}

/**
 * These exporters need a real browser and are run by hand, not in CI, so
 * playwright-core is deliberately not a dependency of this repository — CI has
 * no browser binary and should not download one to lint an icon set.
 * Override the path with CHROME_PATH when it differs.
 */
const CHROME = process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';

const SVG_DIR = process.argv[2];
const OUT = process.argv[3];
const SIZE = Number(process.argv[4] ?? 16);
const ZOOM = 9;
const COLS = 8;

const files = readdirSync(SVG_DIR)
  .filter((f) => f.endsWith('.svg'))
  .sort();
const browser = await chromium.launch({
  executablePath: CHROME,
});

// First pass: rasterise each icon to a data URL at exactly SIZE px.
const shot = await browser.newPage({ viewport: { width: SIZE, height: SIZE } });
const bitmaps = [];
for (const file of files) {
  const svg = readFileSync(path.join(SVG_DIR, file), 'utf8');
  await shot.setContent(
    `<!doctype html><style>html,body{margin:0;background:#fff}svg{display:block;width:${SIZE}px;height:${SIZE}px;color:#16150F}</style>${svg}`,
  );
  const buf = await shot.screenshot({ clip: { x: 0, y: 0, width: SIZE, height: SIZE } });
  bitmaps.push({ id: path.basename(file, '.svg'), data: buf.toString('base64') });
}
await shot.close();

// Second pass: lay the magnified bitmaps out on one sheet.
const cellW = SIZE * ZOOM + 26;
const cellH = SIZE * ZOOM + 46;
const rows = Math.ceil(bitmaps.length / COLS);
const width = COLS * cellW + 48;
const height = rows * cellH + 96;

const cells = bitmaps
  .map(
    (b, i) => `
  <figure style="position:absolute;left:${24 + (i % COLS) * cellW}px;top:${76 + Math.floor(i / COLS) * cellH}px;margin:0">
    <img src="data:image/png;base64,${b.data}"
         style="width:${SIZE * ZOOM}px;height:${SIZE * ZOOM}px;image-rendering:pixelated;border:1px solid #E2DED3"/>
    <figcaption style="font:10px ui-monospace,Menlo,monospace;color:#56524A;text-align:center;margin-top:6px">${b.id}</figcaption>
  </figure>`,
  )
  .join('');

const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
await page.setContent(`<!doctype html>
<style>html,body{margin:0;background:#FAF9F6;width:${width}px;height:${height}px}</style>
<h1 style="font:600 20px ui-sans-serif,system-ui;color:#16150F;margin:24px 0 4px 24px">
  Pixel truth at ${SIZE} px — magnified ${ZOOM}×, no interpolation</h1>
<p style="font:12px ui-sans-serif,system-ui;color:#56524A;margin:0 0 0 24px">
  Each icon was rasterised at a real ${SIZE}×${SIZE} and then enlarged. This is what the user actually receives.</p>
${cells}`);
await page.screenshot({ path: OUT });
await page.close();
await browser.close();
console.log(`wrote ${OUT} (${width}x${height}) for ${bitmaps.length} icons at ${SIZE}px`);
