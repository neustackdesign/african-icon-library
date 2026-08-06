/**
 * Substitutes the launch copy's count tokens from repository state.
 *
 * Launch copy is written with tokens rather than digits so a number can never
 * go stale between the repository and a press release. This is the only place
 * that resolves them, and it resolves them from the data, never by hand.
 *
 *   npm run launch:tokens          rewrite launch/ in place
 *   npm run launch:tokens -- --check   fail if any token is still unresolved
 */

import { readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { ROOT, loadIcons, loadAuditRecords, relative } from './lib/repo.ts';

const LAUNCH_DIR = path.join(ROOT, 'launch');
const check = process.argv.includes('--check');

async function walk(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const full = path.join(directory, entry.name);
      if (entry.isDirectory()) return walk(full);
      return /\.(md|csv|txt)$/.test(entry.name) ? [full] : [];
    }),
  );
  return files.flat();
}

async function main(): Promise<number> {
  const [icons, records, rootPackage] = await Promise.all([
    loadIcons(),
    loadAuditRecords(),
    readFile(path.join(ROOT, 'package.json'), 'utf8').then(
      (raw) => JSON.parse(raw) as { version: string },
    ),
  ]);

  const held = records.filter((record) => record.disposition === 'held').length;
  const releasedIds = new Set(icons.map((icon) => icon.id));

  const tokens: Record<string, string> = {
    '{{ICON_COUNT}}': String(icons.length),
    '{{CATEGORY_COUNT}}': String(new Set(icons.map((icon) => icon.category)).size),
    // Matches `pipeline.backlogConcepts`: an audit row stays 'backlog' even
    // after this release drew the concept, so the released ones come out.
    '{{BACKLOG_COUNT}}': String(
      records.filter((r) => r.disposition === 'backlog' && !releasedIds.has(r.proposedId)).length,
    ),
    '{{HELD_COUNT}}': String(held),
    '{{VERSION}}': rootPackage.version,
  };

  let files: string[];
  try {
    files = await walk(LAUNCH_DIR);
  } catch {
    process.stderr.write('no launch/ directory\n');
    return 1;
  }

  const rewritten: string[] = [];
  const unresolved: string[] = [];

  for (const file of files) {
    // The launch README documents the tokens, so it must keep showing their
    // names. Substituting it would turn the contract into a snapshot.
    if (path.basename(file) === 'README.md' && path.dirname(file) === LAUNCH_DIR) continue;

    const before = await readFile(file, 'utf8');
    let after = before;
    for (const [token, value] of Object.entries(tokens)) after = after.split(token).join(value);

    const leftover = after.match(/\{\{[A-Z_]+\}\}/g);
    if (leftover) unresolved.push(`${relative(file)}: ${[...new Set(leftover)].join(', ')}`);

    if (after !== before) {
      rewritten.push(relative(file));
      if (!check) await writeFile(file, after, 'utf8');
    }
  }

  if (unresolved.length > 0) {
    process.stderr.write(
      [
        'launch copy contains tokens this script does not know:',
        ...unresolved.map((u) => `  ${u}`),
        '',
      ].join('\n'),
    );
    return 1;
  }

  if (check && rewritten.length > 0) {
    process.stderr.write(
      [
        `${rewritten.length} launch file(s) still contain unsubstituted tokens:`,
        ...rewritten.map((file) => `  ${file}`),
        '',
        'Run `npm run launch:tokens`.',
        '',
      ].join('\n'),
    );
    return 1;
  }

  process.stdout.write(
    [
      check
        ? `${files.length} launch file(s) are fully substituted`
        : `substituted ${Object.keys(tokens).length} token(s) across ${rewritten.length} of ${files.length} file(s)`,
      ...Object.entries(tokens).map(([token, value]) => `  ${token.padEnd(22)} ${value}`),
      '',
    ].join('\n'),
  );
  return 0;
}

process.exitCode = await main();
