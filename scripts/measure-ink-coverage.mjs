/**
 * Measures real ink coverage per icon by rasterising it and counting pixels.
 *
 * Stroke-density consistency is the hardest thing to judge by eye across 32
 * drawings, and it is the thing that makes a set look like a family or like a
 * pile. Rendering each icon at 48 px on white and counting how much of the live
 * area is darkened gives a number that tracks what the eye reports as "heavy"
 * or "thin", which is then used to rank candidates for closer inspection.
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
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const SVG_DIR = process.argv[2];
const OUT = process.argv[3];
const SIZE = 48;

const files = readdirSync(SVG_DIR)
  .filter((f) => f.endsWith('.svg'))
  .sort();

const browser = await chromium.launch({ executablePath: CHROME });
const page = await browser.newPage({ viewport: { width: SIZE, height: SIZE } });

const coverage = {};
for (const file of files) {
  const id = path.basename(file, '.svg');
  const svg = readFileSync(path.join(SVG_DIR, file), 'utf8');
  await page.setContent(
    `<!doctype html><style>html,body{margin:0;padding:0;background:#fff}
     svg{display:block;width:${SIZE}px;height:${SIZE}px;color:#000}</style>${svg}`,
  );
  const pct = await page.evaluate(async (size) => {
    const svgEl = document.querySelector('svg');
    const serialised = new XMLSerializer().serializeToString(svgEl);
    const url = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(serialised);
    const img = new Image();
    img.width = size;
    img.height = size;
    await new Promise((res, rej) => {
      img.onload = res;
      img.onerror = rej;
      img.src = url;
    });
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, size, size);
    ctx.drawImage(img, 0, 0, size, size);
    const { data } = ctx.getImageData(0, 0, size, size);
    let ink = 0;
    for (let i = 0; i < data.length; i += 4) {
      // Weight by darkness so antialiased edges count partially, which is what
      // the eye integrates — a hard threshold would over-reward thin strokes.
      ink += (255 - data[i]) / 255;
    }
    return (ink / (size * size)) * 100;
  }, SIZE);
  coverage[id] = Number(pct.toFixed(2));
}

await browser.close();
writeFileSync(OUT, JSON.stringify(coverage, null, 2) + '\n');

const values = Object.entries(coverage).sort((a, b) => a[1] - b[1]);
const nums = values.map(([, v]) => v);
const median = nums[Math.floor(nums.length / 2)];
console.log(`measured ${values.length} icons — median ink coverage ${median.toFixed(2)}%`);
console.log('\nlightest 6:');
for (const [id, v] of values.slice(0, 6)) console.log(`  ${id.padEnd(20)} ${v.toFixed(2)}%`);
console.log('\nheaviest 6:');
for (const [id, v] of values.slice(-6)) console.log(`  ${id.padEnd(20)} ${v.toFixed(2)}%`);
