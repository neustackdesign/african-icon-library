/**
 * Packages the Figma plugins for submission.
 *
 * Figma's publish flow uploads from a local folder, so what a human needs is a
 * self-contained directory (and a zip of it for handoff) containing exactly the
 * files the manifest references — nothing else, so nothing unreviewed ships.
 */

import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { PATHS, ROOT, loadIcons, relative } from './lib/repo.ts';
import { createZip, type ZipEntry } from './lib/zip.ts';

interface PluginSpec {
  directory: string;
  label: string;
}

const PLUGINS: PluginSpec[] = [
  { directory: 'apps/figma-plugin', label: 'insert plugin' },
  { directory: 'apps/figma-community-builder', label: 'Community file builder' },
];

const NETWORK_PATTERNS = [
  /\bfetch\s*\(/,
  /XMLHttpRequest/,
  /\bWebSocket\b/,
  /\bEventSource\b/,
  /\bimportScripts\s*\(/,
  /https?:\/\/(?!www\.w3\.org\/)/,
];

async function main(): Promise<number> {
  const rootPackage = JSON.parse(await readFile(path.join(ROOT, 'package.json'), 'utf8')) as {
    version: string;
  };
  const version = rootPackage.version;
  const icons = await loadIcons();

  const outRoot = path.join(PATHS.release, 'figma');
  await rm(outRoot, { recursive: true, force: true });
  await mkdir(outRoot, { recursive: true });

  const problems: string[] = [];
  const built: Array<{ name: string; bytes: number }> = [];

  for (const plugin of PLUGINS) {
    const directory = path.join(ROOT, plugin.directory);
    const manifest = JSON.parse(await readFile(path.join(directory, 'manifest.json'), 'utf8')) as {
      name: string;
      id: string;
      main: string;
      ui: string;
      networkAccess?: { allowedDomains?: string[] };
      permissions?: string[];
    };

    if (manifest.networkAccess?.allowedDomains?.join(',') !== 'none') {
      problems.push(`${plugin.directory}: manifest does not declare no network access`);
    }
    if ((manifest.permissions ?? []).length > 0) {
      problems.push(`${plugin.directory}: manifest requests permissions`);
    }

    const files = [manifest.main, manifest.ui];
    const entries: ZipEntry[] = [
      { path: 'manifest.json', contents: `${JSON.stringify(manifest, null, 2)}\n` },
    ];

    for (const file of files) {
      let contents: string;
      try {
        contents = await readFile(path.join(directory, file), 'utf8');
      } catch {
        problems.push(`${plugin.directory}: ${file} is missing — run the plugin build first`);
        continue;
      }
      for (const pattern of NETWORK_PATTERNS) {
        if (pattern.test(contents)) {
          problems.push(`${plugin.directory}: ${file} matches ${String(pattern)}`);
        }
      }
      entries.push({ path: file, contents });
    }

    const readme = await readFile(path.join(directory, 'README.md'), 'utf8');
    entries.push({ path: 'README.md', contents: readme });
    entries.push({ path: 'LICENSE', contents: await readFile(path.join(ROOT, 'LICENSE'), 'utf8') });
    entries.push({
      path: 'SUBMISSION.txt',
      contents: [
        `${manifest.name} — ${plugin.label}`,
        `Library version ${version}, ${icons.length} released icons, regular weight only.`,
        '',
        'This folder contains exactly the files the manifest references. Import it in the',
        'Figma desktop app via Plugins -> Development -> Import plugin from manifest.',
        '',
        `Manifest id: ${manifest.id}`,
        manifest.id.startsWith('REPLACE_')
          ? 'Figma assigns the real id at publish time. Replace the placeholder and commit it.'
          : '',
        '',
        'Listing copy, tags, cover and carousel specifications:',
        '  docs/figma-plugin-publishing.md',
        '  docs/figma-community-file-spec.md',
        '',
      ]
        .filter(Boolean)
        .join('\n'),
    });

    const zip = createZip(entries);
    const name = `${path.basename(plugin.directory)}-${version}.zip`;
    await writeFile(path.join(outRoot, name), zip);
    built.push({ name, bytes: zip.length });
  }

  process.stdout.write(
    [
      `packaged ${built.length} plugin(s) into ${relative(outRoot)}:`,
      ...built.map((entry) => `  ${entry.name}  ${entry.bytes} bytes`),
      problems.length === 0
        ? 'offline and manifest checks: OK'
        : `FAILED:\n${problems.map((problem) => `  - ${problem}`).join('\n')}`,
      '',
    ].join('\n'),
  );

  return problems.length === 0 ? 0 : 1;
}

process.exitCode = await main();
