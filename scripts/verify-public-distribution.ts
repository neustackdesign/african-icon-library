/**
 * Proves that no public distribution surface carries internal metadata.
 *
 * The canonical records in `packages/metadata/src/data/` hold maintenance
 * data — audit source filenames, audit verdicts, roadmap entries, reviewer
 * notes, audit cross-reference keys and pipeline counts. Every public surface
 * must use the public contract in `packages/metadata/src/public.ts` instead.
 * This scans, after a full build:
 *
 *   - the built website (pages, RSC payloads, client bundles);
 *   - apps/web/public/downloads (every served ZIP and JSON, unpacked);
 *   - release/ (every release ZIP, unpacked, the standalone metadata JSON and
 *     the manifest);
 *   - the Figma plugin bundle and its packaged submission ZIP;
 *   - freshly packed npm tarballs of all four public packages, unpacked.
 *
 * It fails on any internal field name used as a key, and on any internal
 * per-record value: every audit filename (released or held), audit note,
 * roadmap entry, reviewer note and region maintenance note.
 */

import { execFileSync } from 'node:child_process';
import { mkdtemp, readFile, readdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { gunzipSync } from 'node:zlib';

import { PATHS, ROOT, loadAuditRecords, loadIcons, relative } from './lib/repo.ts';
import { readZip } from './lib/zip.ts';

const PACKAGES = ['metadata', 'icons', 'maps', 'react'] as const;

/** Internal field names. Matched only where used as a key, so prose can mention them. */
const INTERNAL_KEYS = [
  'provenance',
  'culturalReview',
  'auditSourceFile',
  'auditVerdict',
  'roadmapEntry',
  'redrawnSinceIngest',
  'referentConfirmed',
  'auditKey',
  'auditRecords',
  'drawingsIngested',
  'releasedFromAuditDrawings',
  'releasedFromRoadmap',
  'heldForCulturalReview',
  'heldForIconDesign',
  'backlogConcepts',
  'mergedByAudit',
  'droppedByAudit',
  'weightsPlanned',
];
const KEY_PATTERN = new RegExp(`["']?\\b(${INTERNAL_KEYS.join('|')})\\b["']?\\s*:`, 'g');

interface Surface {
  name: string;
  text: string;
}

async function walk(dir: string, accept: (file: string) => boolean): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true }).catch(() => []);
  const out: string[] = [];
  for (const entry of entries) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'cache') out.push(...(await walk(file, accept)));
    } else if (accept(file)) out.push(file);
  }
  return out;
}

/** Reads a tar archive (as `npm pack` writes it) into its files. */
function readTar(archive: Buffer): Array<{ path: string; contents: Buffer }> {
  const files: Array<{ path: string; contents: Buffer }> = [];
  for (let offset = 0; offset + 512 <= archive.length;) {
    const header = archive.subarray(offset, offset + 512);
    const name = header.subarray(0, 100).toString('utf8').replace(/\0.*$/s, '');
    if (!name) break;
    const size = Number.parseInt(header.subarray(124, 136).toString('utf8').trim() || '0', 8);
    const type = String.fromCharCode(header[156] ?? 48);
    const prefix = header.subarray(345, 500).toString('utf8').replace(/\0.*$/s, '');
    if (type === '0' || type === '\0') {
      files.push({
        path: prefix ? `${prefix}/${name}` : name,
        contents: archive.subarray(offset + 512, offset + 512 + size),
      });
    }
    offset += 512 + Math.ceil(size / 512) * 512;
  }
  return files;
}

const TEXT = /\.(html|rsc|js|mjs|cjs|json|txt|md|ts|map|svg)$/;

async function expand(file: string): Promise<Surface[]> {
  const bytes = await readFile(file);
  const base = relative(file);
  if (file.endsWith('.zip')) {
    return readZip(bytes)
      .filter((entry) => TEXT.test(entry.path) || entry.path.endsWith('LICENSE'))
      .map((entry) => ({ name: `${base} › ${entry.path}`, text: entry.contents.toString('utf8') }));
  }
  if (file.endsWith('.tgz')) {
    return readTar(gunzipSync(bytes))
      .filter((entry) => TEXT.test(entry.path))
      .map((entry) => ({ name: `${base} › ${entry.path}`, text: entry.contents.toString('utf8') }));
  }
  return [{ name: base, text: bytes.toString('utf8') }];
}

async function main(): Promise<number> {
  const [icons, auditRecords] = await Promise.all([loadIcons(), loadAuditRecords()]);
  const regions = JSON.parse(
    await readFile(path.join(PATHS.categories, '..', 'regions.json'), 'utf8'),
  ) as Array<{ note?: string }>;
  const values = new Set<string>(
    [
      ...icons.flatMap((icon) => [
        icon.provenance.auditSourceFile,
        icon.provenance.roadmapEntry,
        icon.culturalReview.note,
      ]),
      ...auditRecords.flatMap((record) => [record.sourceFile, record.note, record.hold?.reason]),
      ...regions.map((region) => region.note),
    ].filter((value): value is string => typeof value === 'string' && value.length >= 8),
  );

  const web = path.join(ROOT, 'apps/web/.next');
  const files = [
    ...(await walk(path.join(web, 'server/app'), (file) => TEXT.test(file))),
    ...(await walk(path.join(web, 'static'), (file) => TEXT.test(file))),
    ...(await walk(path.join(ROOT, 'apps/web/public/downloads'), () => true)),
    ...(await walk(PATHS.release, (file) => !file.includes(`${path.sep}packages${path.sep}`))),
    ...(await walk(path.join(ROOT, 'apps/figma-plugin/dist'), () => true)),
  ];

  const packDir = await mkdtemp(path.join(tmpdir(), 'ail-pack-'));
  try {
    for (const name of PACKAGES) {
      execFileSync(
        'npm',
        ['pack', '--silent', '--pack-destination', packDir, '-w', `@african-icon-library/${name}`],
        { cwd: ROOT, stdio: ['ignore', 'ignore', 'inherit'] },
      );
    }
    files.push(...(await walk(packDir, (file) => file.endsWith('.tgz'))));

    const required = [
      'apps/web/.next/server/app',
      'apps/web/public/downloads',
      'release/african-icon-library-icons-',
      'release/african-icon-library-complete-',
      'release/african-icon-library-metadata-',
      'release/figma/figma-plugin-',
      'apps/figma-plugin/dist',
      'african-icon-library-metadata-',
    ];
    const names = files.map((file) => relative(file).replaceAll(path.sep, '/') + file);
    const missing = required.filter((prefix) => !names.some((name) => name.includes(prefix)));
    if (missing.length > 0) {
      process.stderr.write(
        `Missing public surfaces (build, release:build and package:plugins first):\n` +
          missing.map((m) => `  ${m}`).join('\n') +
          '\n',
      );
      return 1;
    }

    const leaks: string[] = [];
    let scanned = 0;
    for (const file of files) {
      for (const surface of await expand(file)) {
        scanned += 1;
        for (const match of surface.text.matchAll(KEY_PATTERN)) {
          leaks.push(`${surface.name}: internal field "${match[1]}"`);
        }
        for (const value of values) {
          if (surface.text.includes(value)) leaks.push(`${surface.name}: "${value.slice(0, 60)}"`);
        }
      }
    }

    if (leaks.length > 0) {
      const unique = [...new Set(leaks)];
      process.stderr.write(
        `Internal metadata found on public surfaces (${unique.length}):\n` +
          unique
            .slice(0, 60)
            .map((leak) => `  ${leak}`)
            .join('\n') +
          '\n',
      );
      return 1;
    }
    process.stdout.write(
      `public distribution clean: ${scanned} files across ${files.length} artefacts ` +
        `(website, downloads, release ZIPs and JSON, Figma plugin, ${PACKAGES.length} npm tarballs); ` +
        `${values.size} internal values and ${INTERNAL_KEYS.length} internal keys absent\n`,
    );
    return 0;
  } finally {
    await rm(packDir, { recursive: true, force: true });
  }
}

process.exitCode = await main();
