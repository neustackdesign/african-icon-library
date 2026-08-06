/**
 * Rasterises SVG files to PNG at a chosen scale using headless Chromium.
 * Usage: node rasterise.mjs <in.svg|dir> <outDir> [scale]
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
import { readFileSync, readdirSync, statSync, mkdirSync } from 'node:fs';
import path from 'node:path';

const input = process.argv[2];
const outDir = process.argv[3];
const scale = Number(process.argv[4] ?? 2);

mkdirSync(outDir, { recursive: true });
const files = statSync(input).isDirectory()
  ? readdirSync(input)
      .filter((f) => f.endsWith('.svg'))
      .map((f) => path.join(input, f))
  : [input];

const browser = await chromium.launch({
  executablePath: CHROME,
});

for (const file of files) {
  const svg = readFileSync(file, 'utf8');
  const w = Number(/width="(\d+(?:\.\d+)?)"/.exec(svg)?.[1] ?? 1200);
  const h = Number(/height="(\d+(?:\.\d+)?)"/.exec(svg)?.[1] ?? 800);
  const page = await browser.newPage({
    viewport: { width: Math.ceil(w), height: Math.ceil(h) },
    deviceScaleFactor: scale,
  });
  await page.setContent(
    `<!doctype html><style>html,body{margin:0;padding:0}svg{display:block}</style>${svg}`,
  );
  const out = path.join(outDir, path.basename(file, '.svg') + '.png');
  await page.screenshot({ path: out, clip: { x: 0, y: 0, width: w, height: h } });
  await page.close();
  console.log(`  ${path.basename(out)}  ${Math.ceil(w * scale)}x${Math.ceil(h * scale)}`);
}

await browser.close();
