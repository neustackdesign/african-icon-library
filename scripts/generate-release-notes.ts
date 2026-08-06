/**
 * Writes the GitHub release body for the current version.
 *
 *   release/RELEASE_NOTES.md
 *
 * Composed from repository state and the matching CHANGELOG section rather than
 * written by hand, so the release page cannot claim a count, a weight or a
 * channel the library does not have. Every number here is derived; the prose is
 * the changelog's own.
 */

import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { ROOT, loadIcons, loadCategories, relative } from './lib/repo.ts';

const RELEASE_DIR = path.join(ROOT, 'release');

interface Artefact {
  name: string;
  bytes: number;
  sha256: string;
}

/** Pulls the section for `version` out of the changelog, without its heading. */
function changelogSection(changelog: string, version: string): string | null {
  const lines = changelog.split('\n');
  const start = lines.findIndex((line) => line.startsWith(`## [${version}]`));
  if (start === -1) return null;
  const rest = lines.slice(start + 1);
  const end = rest.findIndex((line) => line.startsWith('## '));
  return (end === -1 ? rest : rest.slice(0, end)).join('\n').trim();
}

function humanBytes(bytes: number): string {
  return bytes < 1024 * 1024
    ? `${(bytes / 1024).toFixed(1)} KB`
    : `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

async function main(): Promise<number> {
  const pkg = JSON.parse(await readFile(path.join(ROOT, 'package.json'), 'utf8')) as {
    version: string;
  };
  const version = pkg.version;

  const manifest = JSON.parse(await readFile(path.join(RELEASE_DIR, 'manifest.json'), 'utf8')) as {
    version: string;
    artefacts: Artefact[];
  };

  if (manifest.version !== version) {
    process.stderr.write(
      `Refusing to write release notes: manifest is ${manifest.version}, repository is ${version}.\n` +
        'Run `npm run release:build` so the artefacts match the version being released.\n',
    );
    return 1;
  }

  const [icons, categories] = await Promise.all([loadIcons(), loadCategories()]);
  const inUse = new Set(icons.map((icon) => icon.category));
  const weights = [...new Set(icons.flatMap((icon) => icon.weights))];
  const undrawn = ['thin', 'bold', 'fill'].filter((w) => !weights.includes(w as never));

  const changelog = await readFile(path.join(ROOT, 'CHANGELOG.md'), 'utf8');
  const section = changelogSection(changelog, version);

  const byCategory = [...inUse]
    .map((id) => ({
      label: categories.find((c) => c.id === id)?.label ?? id,
      count: icons.filter((i) => i.category === id).length,
    }))
    .sort((a, b) => b.count - a.count);

  const body = [
    `**${icons.length} icons across ${inUse.size} categories, \`${weights.join('`, `')}\` weight only.** MIT licensed.`,
    '',
    undrawn.length > 0
      ? `\`${undrawn.join('`, `')}\` are specified and **not drawn**. A weight is a drawing, not a ` +
        '`stroke-width` change, and this release does not pretend otherwise.'
      : '',
    '',
    '## What is in this release',
    '',
    '| Category | Icons |',
    '| --- | --- |',
    ...byCategory.map((c) => `| ${c.label} | ${c.count} |`),
    '',
    section ? `## Changes\n\n${section}` : '',
    '',
    '## Downloads',
    '',
    'Every archive below is built deterministically, and its SHA-256 is recomputed from the bytes ' +
      'on disk during the release run — the workflow fails rather than publishing a checksum it ' +
      'has not just verified.',
    '',
    '| File | Size | SHA-256 |',
    '| --- | --- | --- |',
    ...manifest.artefacts.map(
      (a) => `| \`${a.name}\` | ${humanBytes(a.bytes)} | \`${a.sha256}\` |`,
    ),
    '',
    '## Figma',
    '',
    'The plugin and the Community file builder are attached and are **not yet published to the ' +
      'Figma Community**. Both are offline by declaration and by build: their bundles are scanned ' +
      'at package time and the build fails if any networking call reaches them.',
    '',
    '## Verifying a download',
    '',
    '```sh',
    `shasum -a 256 african-icon-library-icons-${version}.zip`,
    '```',
    '',
    'Compare the result with the table above, or with `manifest.json`.',
    '',
  ]
    .filter((line, i, all) => !(line === '' && all[i - 1] === ''))
    .join('\n');

  const out = path.join(RELEASE_DIR, 'RELEASE_NOTES.md');
  await writeFile(out, `${body}\n`, 'utf8');
  process.stdout.write(
    `Release notes for v${version} written to ${relative(out)} ` +
      `(${icons.length} icons, ${inUse.size} categories, ${manifest.artefacts.length} artefacts).\n`,
  );
  return 0;
}

process.exitCode = await main();
