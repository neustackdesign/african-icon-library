/**
 * Assembles the LinkedIn carousel PNGs into a single PDF, which is the only
 * format LinkedIn accepts for a document post.
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

const dir = process.argv[2];
const out = process.argv[3];
const pages = readdirSync(dir)
  .filter((f) => /^carousel-\d+\.png$/.test(f))
  .sort();

const imgs = pages
  .map((f) => {
    const b64 = readFileSync(path.join(dir, f)).toString('base64');
    return `<div class="page"><img src="data:image/png;base64,${b64}"></div>`;
  })
  .join('');

const browser = await chromium.launch({
  executablePath: CHROME,
});
const page = await browser.newPage();
await page.setContent(`<!doctype html><style>
  @page { size: 1200px 1200px; margin: 0 }
  html,body { margin:0; padding:0 }
  .page { width:1200px; height:1200px; page-break-after: always; }
  .page:last-child { page-break-after: auto }
  img { display:block; width:1200px; height:1200px }
</style>${imgs}`);
await page.pdf({
  path: out,
  width: '1200px',
  height: '1200px',
  printBackground: true,
  pageRanges: `1-${pages.length}`,
});
await browser.close();
console.log(`${out} — ${pages.length} pages`);
