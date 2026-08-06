/**
 * Re-verifies every published checksum against the file it describes.
 *
 * `release/manifest.json` is what the website and the GitHub release both quote
 * as proof of integrity. A checksum is worthless if nothing ever checks it, and
 * the manifest is written by the same run that writes the archives — so this
 * recomputes them from the bytes on disk, immediately before they are attached
 * to a release, and refuses to continue on any mismatch.
 *
 * Also asserts that every artefact the manifest names actually exists, and that
 * no artefact exists which the manifest does not name: a file attached to a
 * release without a published checksum is unverifiable by anyone downloading it.
 */

import { createHash } from 'node:crypto';
import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';

import { ROOT, relative } from './lib/repo.ts';

const RELEASE_DIR = path.join(ROOT, 'release');
const MANIFEST = path.join(RELEASE_DIR, 'manifest.json');

/**
 * Files that live beside the artefacts and describe them rather than being
 * downloads in their own right. Listed explicitly so that verification stays
 * order-independent: the release workflow generates the notes after this runs,
 * but a re-run or a reordered step should not turn that into a failure.
 */
const NOT_ARTEFACTS = new Set(['manifest.json', 'RELEASE_NOTES.md']);

interface Artefact {
  name: string;
  bytes: number;
  sha256: string;
}

interface Manifest {
  version: string;
  icons: number;
  categories: unknown[];
  artefacts: Artefact[];
}

async function sha256(file: string): Promise<string> {
  return createHash('sha256')
    .update(await readFile(file))
    .digest('hex');
}

async function main(): Promise<number> {
  let manifest: Manifest;
  try {
    manifest = JSON.parse(await readFile(MANIFEST, 'utf8')) as Manifest;
  } catch {
    process.stderr.write(
      `No ${relative(MANIFEST)}. Run \`npm run release:build\` before verifying.\n`,
    );
    return 1;
  }

  const problems: string[] = [];
  const checked: string[] = [];

  for (const artefact of manifest.artefacts) {
    const file = path.join(RELEASE_DIR, artefact.name);
    let size: number;
    try {
      size = (await stat(file)).size;
    } catch {
      problems.push(
        `${artefact.name}: named in the manifest but missing from ${relative(RELEASE_DIR)}`,
      );
      continue;
    }

    if (size !== artefact.bytes) {
      problems.push(`${artefact.name}: manifest says ${artefact.bytes} bytes, file is ${size}`);
    }

    const actual = await sha256(file);
    if (actual !== artefact.sha256) {
      problems.push(
        `${artefact.name}: checksum mismatch\n    published ${artefact.sha256}\n    actual    ${actual}`,
      );
    } else {
      checked.push(artefact.name);
    }
  }

  /* Anything shipped without a published checksum cannot be verified by whoever
     downloads it, so treat an unlisted artefact as a failure rather than a
     bonus. `manifest.json` itself is the index, not an artefact. */
  const named = new Set(manifest.artefacts.map((a) => a.name));
  const onDisk = (await readdir(RELEASE_DIR, { withFileTypes: true }))
    .filter((entry) => entry.isFile() && !NOT_ARTEFACTS.has(entry.name))
    .map((entry) => entry.name);
  for (const file of onDisk) {
    if (!named.has(file)) {
      problems.push(
        `${file}: present in ${relative(RELEASE_DIR)} but carries no published checksum`,
      );
    }
  }

  if (problems.length > 0) {
    process.stderr.write(
      `Release artefact verification FAILED — ${problems.length} problem(s):\n` +
        problems.map((p) => `  ${p}`).join('\n') +
        '\n',
    );
    return 1;
  }

  process.stdout.write(
    `Release artefacts verified for v${manifest.version} — ` +
      `${checked.length} file(s), every published SHA-256 recomputed from disk and matching.\n` +
      checked.map((name) => `  ${name}`).join('\n') +
      '\n',
  );
  return 0;
}

process.exitCode = await main();
