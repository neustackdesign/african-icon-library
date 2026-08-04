/**
 * Normalises and optimises every canonical SVG asset in place.
 *
 * Sources are the optimised form: there is no separate "pretty" copy that can
 * drift from what ships. Run with `--check` (CI does) to fail instead of write
 * when an asset is not already in canonical form.
 *
 *   npm run optimize
 *   npm run optimize -- --check
 */

import { readFile, writeFile } from 'node:fs/promises';

import { PATHS, listSvgAssets, relative } from './lib/repo.ts';
import { optimizeIconSvg } from './lib/svg-optimize.ts';

const check = process.argv.includes('--check');

async function run(): Promise<number> {
  const assets = [
    ...(await listSvgAssets(PATHS.iconsSvgRoot)),
    ...(await listSvgAssets(PATHS.iconsStagingRoot)),
  ];

  if (assets.length === 0) {
    process.stderr.write('no SVG assets found — run `npm run ingest` first\n');
    return 1;
  }

  const changed: string[] = [];
  let bytesBefore = 0;
  let bytesAfter = 0;

  for (const asset of assets) {
    const current = await readFile(asset.file, 'utf8');
    let optimized: string;
    try {
      optimized = optimizeIconSvg(current);
    } catch (error) {
      process.stderr.write(`${relative(asset.file)}: ${(error as Error).message}\n`);
      return 1;
    }

    bytesBefore += Buffer.byteLength(current);
    bytesAfter += Buffer.byteLength(optimized);

    if (optimized !== current) {
      changed.push(relative(asset.file));
      if (!check) await writeFile(asset.file, optimized, 'utf8');
    }
  }

  if (check && changed.length > 0) {
    process.stderr.write(
      [
        `${changed.length} asset(s) are not in canonical optimised form:`,
        ...changed.map((file) => `  ${file}`),
        '',
        'Run `npm run optimize` and commit the result.',
        '',
      ].join('\n'),
    );
    return 1;
  }

  const saved = bytesBefore - bytesAfter;
  process.stdout.write(
    check
      ? `${assets.length} asset(s) already in canonical optimised form\n`
      : `optimised ${assets.length} asset(s); ${changed.length} rewritten; ${saved} bytes saved\n`,
  );
  return 0;
}

process.exitCode = await run();
