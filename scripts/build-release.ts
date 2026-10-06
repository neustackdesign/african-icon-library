/**
 * Assembles the downloadable release artefacts.
 *
 * Validation runs first and hard-stops the build: an artefact that fails the
 * icon spec must never reach a download page. Output is deterministic, so the
 * published checksums are verifiable.
 *
 *   release/african-icon-library-icons-<version>.zip      icons only, unchanged layout
 *   release/african-icon-library-maps-<version>.zip       country maps
 *   release/african-icon-library-complete-<version>.zip   icons + maps in one archive
 *   release/african-icon-library-metadata-<version>.json
 *   release/manifest.json
 *   apps/web/public/downloads/…   (copies the website links to)
 */

import { createHash } from 'node:crypto';
import { mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';

import {
  PATHS,
  ROOT,
  listMapAssets,
  listSvgAssets,
  loadCategories,
  loadIcons,
  loadMapRegions,
  loadMaps,
  relative,
} from './lib/repo.ts';
import {
  validateAsset,
  validateCollection,
  validateMapAsset,
  validateMapCollection,
} from './lib/validate.ts';
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

  const [categories, icons, assets, stagingAssets, maps, mapRegions, mapAssets] = await Promise.all(
    [
      loadCategories(),
      loadIcons(),
      listSvgAssets(PATHS.iconsSvgRoot),
      listSvgAssets(PATHS.iconsStagingRoot),
      loadMaps(),
      loadMapRegions(),
      listMapAssets(),
    ],
  );

  const findings = [
    ...assets.flatMap((asset) => validateAsset(asset)),
    ...validateCollection({ icons, categories, assets, stagingAssets }),
    ...mapAssets.flatMap((asset) => validateMapAsset(asset)),
    ...validateMapCollection({ maps, regions: mapRegions, assets: mapAssets }),
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

  /* ---------------- country maps ---------------- */

  const mapAssetsById = new Map(mapAssets.map((asset) => [asset.id, asset]));
  const mapMetadata = { version, generatedFrom: 'packages/metadata/src/data', maps, mapRegions };
  const mapsReadme = [
    `African Icon Library — country maps, version ${version}`,
    '',
    `${maps.length} outline maps of African countries, grouped by the library's own regional grouping.`,
    '',
    'Every file is a standalone SVG at its own real proportions (its own viewBox, never',
    'forced into a square), drawn with a 1.5 stroke, round caps and joins, painting with',
    '`currentColor`. No text, no transforms, no background.',
    '',
    'Layout:',
    '  svg/<country-id>.svg   the maps',
    '  metadata.json          names, ISO 3166-1 codes, regions and aliases',
    '  LICENSE                MIT',
    '',
    'Full documentation: https://icons.neustackstudio.com',
    '',
  ].join('\n');
  const mapEntries = (root: string): ZipEntry[] =>
    maps.map((map) => ({
      path: `${root}/svg/${map.id}.svg`,
      contents: mapAssetsById.get(map.id)?.source ?? '',
    }));
  const mapsRoot = `african-icon-library-maps-${version}`;
  const mapsZip = createZip([
    ...mapEntries(mapsRoot),
    { path: `${mapsRoot}/metadata.json`, contents: `${JSON.stringify(mapMetadata, null, 2)}\n` },
    { path: `${mapsRoot}/LICENSE`, contents: licence },
    { path: `${mapsRoot}/README.txt`, contents: mapsReadme },
  ]);

  /* ---------------- complete library: icons + maps ---------------- */

  const completeRoot = `african-icon-library-complete-${version}`;
  const completeMetadata = { ...metadata, maps, mapRegions };
  const completeZip = createZip([
    ...assets.map((asset) => ({
      path: `${completeRoot}/icons/svg/${asset.weight}/${asset.id}.svg`,
      contents: asset.source,
    })),
    ...mapEntries(`${completeRoot}/maps`),
    {
      path: `${completeRoot}/metadata.json`,
      contents: `${JSON.stringify(completeMetadata, null, 2)}\n`,
    },
    { path: `${completeRoot}/LICENSE`, contents: licence },
    {
      path: `${completeRoot}/README.txt`,
      contents: [
        `African Icon Library — complete library, version ${version}`,
        '',
        `${icons.length} icons (icons/svg/<weight>/) and ${maps.length} country maps (maps/svg/).`,
        'metadata.json carries both. See the icons and maps archives for each on its own.',
        '',
      ].join('\n'),
    },
  ]);

  // The standalone metadata file grows a `maps` key; existing keys are unchanged.
  const metadataJson = Buffer.from(
    `${JSON.stringify({ ...metadata, maps, mapRegions }, null, 2)}\n`,
    'utf8',
  );

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
    { name: `african-icon-library-maps-${version}.zip`, contents: mapsZip },
    { name: `african-icon-library-complete-${version}.zip`, contents: completeZip },
    { name: `african-icon-library-metadata-${version}.json`, contents: metadataJson },
    ...categoryPacks.map((pack) => ({ name: pack.name, contents: pack.contents })),
  ];

  // Clears only what this script owns. `npm run package:plugins` writes into
  // release/figma and `npm run verify:packages` into release/packages; wiping
  // the whole directory would delete whichever ran first.
  for (const stale of await readdir(PATHS.release).catch(() => [])) {
    if (stale === 'figma' || stale === 'packages') continue;
    await rm(path.join(PATHS.release, stale), { recursive: true, force: true });
  }
  await mkdir(PATHS.release, { recursive: true });
  await rm(WEB_DOWNLOADS, { recursive: true, force: true });
  await mkdir(WEB_DOWNLOADS, { recursive: true });

  const manifest = {
    version,
    icons: icons.length,
    weights: [...new Set(icons.flatMap((icon) => icon.weights))].sort(),
    maps: maps.length,
    mapRegions: mapRegions.map((region) => ({
      id: region.id,
      label: region.label,
      maps: maps.filter((map) => map.region === region.id).length,
    })),
    mapsFile: `african-icon-library-maps-${version}.zip`,
    completeFile: `african-icon-library-complete-${version}.zip`,
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
      `release ${version} — ${icons.length} icons, ${maps.length} maps, ${categoryPacks.length} category packs`,
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
