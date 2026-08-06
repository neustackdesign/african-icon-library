/**
 * Bundles the Community file builder into `dist/`.
 *
 * Two outputs, both fully self-contained:
 *   dist/code.js  — the sandbox thread
 *   dist/ui.html  — one HTML file with CSS and JS inlined
 *
 * The offline assertion below is the same mechanism `apps/figma-plugin/build.ts`
 * uses, duplicated rather than imported: that file executes its build at the top
 * level, so importing it would run the other plugin's build as a side effect.
 * Both copies must stay in step — if one gains a rule, so does the other.
 */

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import * as esbuild from 'esbuild';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(HERE, 'src');
const DIST = path.join(HERE, 'dist');

const watch = process.argv.includes('--watch');

const SHARED: esbuild.BuildOptions = {
  bundle: true,
  format: 'iife',
  target: ['es2019'],
  legalComments: 'none',
  logLevel: 'warning',
};

/** Nothing in a plugin bundle may reach the network. */
const FORBIDDEN = [
  { pattern: /\bfetch\s*\(/, label: 'fetch(' },
  { pattern: /XMLHttpRequest/, label: 'XMLHttpRequest' },
  { pattern: /\bWebSocket\b/, label: 'WebSocket' },
  { pattern: /\bEventSource\b/, label: 'EventSource' },
  { pattern: /\bimportScripts\s*\(/, label: 'importScripts(' },
  { pattern: /https?:\/\/(?!www\.w3\.org\/)/, label: 'an absolute http(s) URL' },
];

function assertOffline(label: string, source: string): void {
  const hits = FORBIDDEN.filter((rule) => rule.pattern.test(source)).map((rule) => rule.label);
  if (hits.length > 0) {
    throw new Error(
      `${label} contains ${hits.join(', ')}. The plugin declares no network access ` +
        '("allowedDomains": ["none"]) and must not reference anything remote.',
    );
  }
}

async function buildMain(): Promise<void> {
  await esbuild.build({
    ...SHARED,
    entryPoints: [path.join(SRC, 'main.ts')],
    outfile: path.join(DIST, 'code.js'),
  });
  assertOffline('dist/code.js', await readFile(path.join(DIST, 'code.js'), 'utf8'));
}

async function buildUi(): Promise<void> {
  const [{ outputFiles }, template, css] = await Promise.all([
    esbuild.build({
      ...SHARED,
      entryPoints: [path.join(SRC, 'ui.ts')],
      write: false,
      outfile: path.join(DIST, 'ui.js'),
    }),
    readFile(path.join(SRC, 'ui.html'), 'utf8'),
    readFile(path.join(SRC, 'ui.css'), 'utf8'),
  ]);

  const script = outputFiles?.[0]?.text ?? '';
  if (!script) throw new Error('the UI bundle is empty');

  const html = template
    .replace('/* __STYLES__ */', () => css.trim())
    // `</script>` inside the bundle would close the tag early.
    .replace('/* __SCRIPT__ */', () => script.split('</script>').join('<\\/script>'));

  assertOffline('dist/ui.html', html);
  await writeFile(path.join(DIST, 'ui.html'), html, 'utf8');
}

async function buildOnce(): Promise<void> {
  await mkdir(DIST, { recursive: true });
  await Promise.all([buildMain(), buildUi()]);
  process.stdout.write('figma-community-builder: built dist/code.js and dist/ui.html\n');
}

await buildOnce();

if (watch) {
  const { watch: watchFiles } = await import('node:fs');
  process.stdout.write('figma-community-builder: watching src/…\n');
  watchFiles(SRC, { recursive: true }, () => {
    buildOnce().catch((error: unknown) => {
      process.stderr.write(`figma-community-builder: ${(error as Error).message}\n`);
    });
  });
}
