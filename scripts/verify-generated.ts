/**
 * Fails when a committed generated file no longer matches its inputs.
 *
 * The generators are re-run and their output compared byte for byte against
 * what was committed, so this catches both "forgot to run generate" and
 * "hand-edited a generated file". Re-running is safe: the generators are
 * deterministic and write only files they own.
 */

import { readFile } from 'node:fs/promises';

import { generateAll, listGeneratedFiles } from './lib/generators.ts';
import { relative } from './lib/repo.ts';

async function snapshot(files: readonly string[]): Promise<Map<string, string>> {
  const entries = await Promise.all(
    files.map(async (file) => {
      try {
        return [relative(file), await readFile(file, 'utf8')] as const;
      } catch {
        return [relative(file), null] as const;
      }
    }),
  );
  return new Map(entries.filter((entry): entry is readonly [string, string] => entry[1] !== null));
}

async function run(): Promise<number> {
  const before = await snapshot(await listGeneratedFiles());
  if (before.size === 0) {
    process.stderr.write('no generated files found — run `npm run generate` first\n');
    return 1;
  }

  await generateAll();
  const after = await snapshot(await listGeneratedFiles());

  const drifted: string[] = [];
  for (const [file, content] of after) {
    if (!before.has(file)) drifted.push(`${file} (newly generated)`);
    else if (before.get(file) !== content) drifted.push(file);
  }
  for (const file of before.keys()) {
    if (!after.has(file)) drifted.push(`${file} (no longer generated)`);
  }

  if (drifted.length > 0) {
    process.stderr.write(
      [
        `${drifted.length} generated file(s) are out of date:`,
        ...drifted.map((file) => `  ${file}`),
        '',
        'Run `npm run generate` and commit the result.',
        '',
      ].join('\n'),
    );
    return 1;
  }

  process.stdout.write(`${after.size} generated file(s) are up to date\n`);
  return 0;
}

process.exitCode = await run();
