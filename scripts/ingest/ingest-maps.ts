/**
 * Writes `packages/maps/svg/<id>.svg` from the country-map master.
 *
 *   npm run maps:ingest            regenerate the 54 standalone SVGs
 *   npm run maps:ingest -- --check fail if any committed SVG differs
 *
 * Deterministic: the same master and metadata always produce the same bytes.
 * It also deletes any SVG with no metadata row, so an orphan cannot linger.
 */

import { readFile, readdir, rm, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

import { extractMaps } from '../lib/map-ingest.ts';
import { PATHS, loadMaps, relative } from '../lib/repo.ts';

const check = process.argv.includes('--check');

async function main(): Promise<number> {
  const [source, maps] = await Promise.all([readFile(PATHS.mapsMaster, 'utf8'), loadMaps()]);
  const extracted = extractMaps(source, maps);

  await mkdir(PATHS.mapsSvgRoot, { recursive: true });
  const existing = (await readdir(PATHS.mapsSvgRoot)).filter((file) => file.endsWith('.svg'));
  const wanted = new Set(extracted.map((map) => `${map.id}.svg`));
  const problems: string[] = [];

  for (const map of extracted) {
    const file = path.join(PATHS.mapsSvgRoot, `${map.id}.svg`);
    const current = await readFile(file, 'utf8').catch(() => null);
    if (current === map.svg) continue;
    if (check)
      problems.push(
        `${relative(file)} ${current === null ? 'is missing' : 'differs from the master'}`,
      );
    else await writeFile(file, map.svg, 'utf8');
  }
  for (const file of existing.filter((name) => !wanted.has(name))) {
    if (check) problems.push(`${relative(path.join(PATHS.mapsSvgRoot, file))} has no metadata row`);
    else await rm(path.join(PATHS.mapsSvgRoot, file));
  }

  if (problems.length > 0) {
    process.stderr.write(
      [
        `${problems.length} map asset(s) out of date:`,
        ...problems.map((p) => `  ${p}`),
        '',
        'Run `npm run maps:ingest`.',
        '',
      ].join('\n'),
    );
    return 1;
  }
  const islands = extracted
    .filter((map) => map.subpaths > 1)
    .map((map) => `${map.id}(${map.subpaths})`);
  process.stdout.write(
    `${check ? 'verified' : 'wrote'} ${extracted.length} country maps in ${relative(PATHS.mapsSvgRoot)}\n` +
      `  multi-part outlines: ${islands.join(', ')}\n`,
  );
  return 0;
}

process.exitCode = await main();
