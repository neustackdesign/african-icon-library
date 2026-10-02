/**
 * Rasterises the V3 release masters in media/release-assets/ to PNG.
 *
 *   npm run media            # regenerate the SVG masters first
 *   npm run media:export     # then render media/release-assets/png/*.png
 *
 * Needs a Chromium driven by Playwright. Playwright is deliberately not a
 * dependency (CI should not download a browser to lint an icon set), so this
 * resolves, in order: a local `playwright` or `playwright-core`, then the path
 * in PLAYWRIGHT_MODULE, then a global install. It fails with an instruction,
 * not a stack trace, when none is available.
 *
 * Text is set in Geist and Geist Mono. Both ship inside `next` (the dev
 * overlay's own copies), so the export uses exactly the faces the website
 * loads, with no network request.
 */

import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdir, readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const RELEASE = path.join(ROOT, 'media/release-assets');
const FONT_DIR = path.join(ROOT, 'node_modules/next/dist/next-devtools/server/font');

function loadPlaywright() {
  const require = createRequire(import.meta.url);
  const candidates = ['playwright', 'playwright-core'];
  if (process.env.PLAYWRIGHT_MODULE) candidates.push(process.env.PLAYWRIGHT_MODULE);
  try {
    const globalRoot = execSync('npm root -g', { encoding: 'utf8' }).trim();
    candidates.push(path.join(globalRoot, 'playwright'), path.join(globalRoot, 'playwright-core'));
  } catch {
    /* no global npm */
  }
  for (const candidate of candidates) {
    try {
      return require(candidate);
    } catch {
      /* try the next one */
    }
  }
  return null;
}

async function fontFace(family, file) {
  const data = await readFile(path.join(FONT_DIR, file));
  return (
    `@font-face{font-family:'${family}';font-style:normal;font-weight:100 900;` +
    `src:url(data:font/woff2;base64,${data.toString('base64')}) format('woff2');}`
  );
}

async function main() {
  const playwright = loadPlaywright();
  if (!playwright) {
    console.error(
      'export-release-assets: Playwright is not installed.\n' +
        '  Install it locally without saving (npm i --no-save playwright-core) and point\n' +
        '  PLAYWRIGHT_BROWSERS_PATH at a Chromium, or set PLAYWRIGHT_MODULE to an existing install.',
    );
    return 1;
  }
  if (!existsSync(path.join(RELEASE, 'manifest.json'))) {
    console.error(
      'export-release-assets: run `npm run media` first; media/release-assets/manifest.json is missing.',
    );
    return 1;
  }

  const manifest = JSON.parse(await readFile(path.join(RELEASE, 'manifest.json'), 'utf8'));
  const fonts =
    (await fontFace('Geist', 'geist-latin.woff2')) +
    (await fontFace('Geist Mono', 'geist-mono-latin.woff2'));

  const executablePath = process.env.CHROMIUM_PATH;
  const browser = await playwright.chromium.launch(executablePath ? { executablePath } : {});
  await mkdir(path.join(RELEASE, 'png'), { recursive: true });

  for (const asset of manifest.assets) {
    const svg = await readFile(path.join(RELEASE, asset.file), 'utf8');
    const page = await browser.newPage({
      viewport: { width: asset.width, height: asset.height },
      deviceScaleFactor: 1,
    });
    await page.setContent(
      `<!doctype html><html><head><meta charset="utf-8"><style>${fonts}` +
        `html,body{margin:0;padding:0;overflow:hidden}svg{display:block}</style></head>` +
        `<body>${svg}</body></html>`,
    );
    const loaded = await page.evaluate(async () => {
      const faces = await Promise.all([
        document.fonts.load("400 16px 'Geist'"),
        document.fonts.load("500 16px 'Geist'"),
        document.fonts.load("400 16px 'Geist Mono'"),
      ]);
      await document.fonts.ready;
      return faces.map((list) => list.length);
    });
    if (loaded.some((found) => found === 0)) throw new Error(`${asset.file}: Geist did not load`);
    await page.screenshot({ path: path.join(RELEASE, asset.png), omitBackground: false });
    await page.close();
    process.stdout.write(`  ${asset.png}  ${asset.width} × ${asset.height}\n`);
  }

  await browser.close();
  process.stdout.write(`exported ${manifest.assets.length} PNG(s) to media/release-assets/png\n`);
  return 0;
}

process.exitCode = await main();
