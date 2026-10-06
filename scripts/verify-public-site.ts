/**
 * Scans the built website for internal icon metadata.
 *
 * Audit source filenames, audit verdict fields, roadmap entries and reviewer
 * notes live in the canonical metadata for maintainers. None may appear in a
 * page, its RSC payload or a client bundle. Run after `next build`.
 */

import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

import { ROOT, loadIcons, relative } from './lib/repo.ts';

const BUILD = path.join(ROOT, 'apps/web/.next');
const SCANNED = /\.(html|rsc|js|json|txt)$/;

async function files(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true }).catch(() => []);
  const out: string[] = [];
  for (const entry of entries) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'cache') continue;
      out.push(...(await files(file)));
    } else if (SCANNED.test(entry.name)) out.push(file);
  }
  return out;
}

async function main(): Promise<number> {
  const icons = await loadIcons();
  const needles = [
    'auditSourceFile',
    'auditVerdict',
    'roadmapEntry',
    'redrawnSinceIngest',
    'auditKey',
    ...icons.flatMap((icon) =>
      [
        icon.provenance.auditSourceFile,
        icon.provenance.roadmapEntry,
        icon.culturalReview.note,
      ].filter((value): value is string => Boolean(value)),
    ),
  ];
  const targets = [
    ...(await files(path.join(BUILD, 'server/app'))),
    ...(await files(path.join(BUILD, 'static'))),
  ];
  if (targets.length === 0) {
    process.stderr.write(`No build output in ${relative(BUILD)}. Build the website first.\n`);
    return 1;
  }
  const leaks: string[] = [];
  for (const file of targets) {
    const text = await readFile(file, 'utf8');
    for (const needle of needles) {
      if (text.includes(needle)) leaks.push(`${relative(file)}: ${needle}`);
    }
  }
  if (leaks.length > 0) {
    process.stderr.write(
      `Internal icon metadata found in the built website (${leaks.length}):\n` +
        leaks
          .slice(0, 40)
          .map((leak) => `  ${leak}`)
          .join('\n') +
        '\n',
    );
    return 1;
  }
  process.stdout.write(
    `public site clean: ${targets.length} built files, no internal provenance for ${icons.length} icons\n`,
  );
  return 0;
}

process.exitCode = await main();
