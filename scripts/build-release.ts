/**
 * Assembles the downloadable release artefacts.
 *
 * Validation runs first and hard-stops the build: an artefact that fails the
 * icon spec must never reach a download page. Output is deterministic, so the
 * published checksums are verifiable.
 *
 *   release/african-icon-library-icons-<version>.zip
 *   release/african-icon-library-metadata-<version>.json
 *   release/manifest.json
 *   apps/web/public/downloads/…   (copies the website links to)
 */

import { createHash } from 'node:crypto';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { PATHS, ROOT, listSvgAssets, loadCategories, loadIcons, relative } from './lib/repo.ts';
import { validateAsset, validateCollection } from './lib/validate.ts';
import { createZip, type ZipEntry } from './lib/zip.ts';

const WEB_DOWNLOADS = path.join(ROOT, 'apps/web/public/downloads');

function sha256(buffer: Buffer): string {
  return createHash('sha256').update(buffer).digest('hex');
}

async function run(): Promise<number> {
  const rootPackage = JSON.parse(await readFile(path.join(ROOT, 'package.json'), 'utf8')) as {
    version: string;
  };
  const version = rootPackage.version;

  const [categories, icons, assets, stagingAssets] = await Promise.all([
    loadCategories(),
    loadIcons(),
    listSvgAssets(PATHS.iconsSvgRoot),
    listSvgAssets(PATHS.iconsStagingRoot),
  ]);

  const findings = [
    ...assets.flatMap((asset) => validateAsset(asset)),
    ...validateCollection({ icons, categories, assets, stagingAssets }),
  ].filter((finding) => finding.severity === 'error');

  if (findings.length > 0) {
    process.stderr.write(
      [
        `refusing to build a release with ${findings.length} validation error(s):`,
        ...findings.map((finding) => `  ${finding.target}: [${finding.rule}] ${finding.message}`),
        '',
      ].join('\n'),
    );
    return 1;
  }

  const licence = await readFile(path.join(ROOT, 'LICENSE'), 'utf8');

  const readme = [
    `African Icon Library — icon assets, version ${version}`,
    '',
    `${icons.length} icons, ${[...new Set(icons.flatMap((icon) => icon.weights))].join(', ')} weight only.`,
    '',
    'Every file is a 24 x 24 SVG that paints with `currentColor`. Set `color` on an',
    'ancestor (or on the SVG itself) to recolour it. Nothing in these files carries a',
    'hard-coded colour, embedded text, or a script.',
    '',
    'Layout:',
    '  svg/<weight>/<icon-id>.svg   the drawings',
    '  metadata.json                names, categories, keywords and provenance',
    '  LICENSE                      MIT',
    '',
    'Full documentation: https://icons.neustackstudio.com',
    'Source: https://github.com/neustackdesign/african-icon-library',
    '',
  ].join('\n');

  const metadata = {
    version,
    generatedFrom: 'packages/metadata/src/data',
    icons,
    categories,
  };

  const entries: ZipEntry[] = [
    ...assets.map((asset) => ({
      path: `african-icon-library-${version}/svg/${asset.weight}/${asset.id}.svg`,
      contents: asset.source,
    })),
    {
      path: `african-icon-library-${version}/metadata.json`,
      contents: `${JSON.stringify(metadata, null, 2)}\n`,
    },
    { path: `african-icon-library-${version}/LICENSE`, contents: licence },
    { path: `african-icon-library-${version}/README.txt`, contents: readme },
  ];

  const zip = createZip(entries);
  const metadataJson = Buffer.from(`${JSON.stringify(metadata, null, 2)}\n`, 'utf8');

  // One pack per category that actually contains released icons. A pack for an
  // empty category would be a download that promises something it cannot give.
  const categoryPacks = categories
    .map((category) => {
      const members = icons.filter((icon) => icon.category === category.id);
      if (members.length === 0) return null;
      const ids = new Set(members.map((icon) => icon.id));
      const packEntries: ZipEntry[] = [
        ...assets
          .filter((asset) => ids.has(asset.id))
          .map((asset) => ({
            path: `african-icon-library-${category.id}-${version}/svg/${asset.weight}/${asset.id}.svg`,
            contents: asset.source,
          })),
        {
          path: `african-icon-library-${category.id}-${version}/metadata.json`,
          contents: `${JSON.stringify({ version, category, icons: members }, null, 2)}\n`,
        },
        { path: `african-icon-library-${category.id}-${version}/LICENSE`, contents: licence },
      ];
      return {
        name: `african-icon-library-${category.id}-${version}.zip`,
        categoryId: category.id,
        categoryLabel: category.label,
        icons: members.length,
        contents: createZip(packEntries),
      };
    })
    .filter((pack): pack is NonNullable<typeof pack> => pack !== null);

  const artefacts = [
    { name: `african-icon-library-icons-${version}.zip`, contents: zip },
    { name: `african-icon-library-metadata-${version}.json`, contents: metadataJson },
    ...categoryPacks.map((pack) => ({ name: pack.name, contents: pack.contents })),
  ];

  await rm(PATHS.release, { recursive: true, force: true });
  await mkdir(PATHS.release, { recursive: true });
  await rm(WEB_DOWNLOADS, { recursive: true, force: true });
  await mkdir(WEB_DOWNLOADS, { recursive: true });

  const manifest = {
    version,
    icons: icons.length,
    weights: [...new Set(icons.flatMap((icon) => icon.weights))].sort(),
    categories: categoryPacks.map((pack) => ({
      id: pack.categoryId,
      label: pack.categoryLabel,
      icons: pack.icons,
      file: pack.name,
    })),
    artefacts: artefacts.map((artefact) => ({
      name: artefact.name,
      bytes: artefact.contents.length,
      sha256: sha256(artefact.contents),
    })),
  };

  for (const artefact of artefacts) {
    await writeFile(path.join(PATHS.release, artefact.name), artefact.contents);
    await writeFile(path.join(WEB_DOWNLOADS, artefact.name), artefact.contents);
  }

  const manifestJson = `${JSON.stringify(manifest, null, 2)}\n`;
  await writeFile(path.join(PATHS.release, 'manifest.json'), manifestJson, 'utf8');
  await writeFile(path.join(WEB_DOWNLOADS, 'manifest.json'), manifestJson, 'utf8');

  process.stdout.write(
    [
      `release ${version} — ${icons.length} icons, ${entries.length} files, ${categoryPacks.length} category packs`,
      ...manifest.artefacts.map(
        (artefact) =>
          `  ${artefact.name}  ${artefact.bytes} bytes  sha256:${artefact.sha256.slice(0, 16)}…`,
      ),
      `written to ${relative(PATHS.release)} and ${relative(WEB_DOWNLOADS)}`,
      '',
    ].join('\n'),
  );

  return 0;
}

process.exitCode = await run();
