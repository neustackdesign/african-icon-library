import { readFile, readdir, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  auditFileSchema,
  categoriesSchema,
  iconsSchema,
  type AuditRecord,
  type Category,
  type Icon,
  type Weight,
} from '../../packages/metadata/src/schema.ts';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

export const PATHS = {
  categories: path.join(ROOT, 'packages/metadata/src/data/categories.json'),
  icons: path.join(ROOT, 'packages/metadata/src/data/icons.json'),
  auditRecords: path.join(ROOT, 'packages/metadata/src/data/audit-records.json'),
  metadataGenerated: path.join(ROOT, 'packages/metadata/src/generated/data.ts'),
  iconsSvgRoot: path.join(ROOT, 'packages/icons/svg'),
  iconsStagingRoot: path.join(ROOT, 'packages/icons/staging'),
  iconsGenerated: path.join(ROOT, 'packages/icons/src/generated/icons.ts'),
  iconsOptimized: path.join(ROOT, 'packages/icons/optimized'),
  reactIconsDir: path.join(ROOT, 'packages/react/src/icons'),
  reactGeneratedIndex: path.join(ROOT, 'packages/react/src/generated/index.ts'),
  pluginGenerated: path.join(ROOT, 'apps/figma-plugin/src/generated/icon-data.ts'),
  webDocuments: path.join(ROOT, 'apps/web/generated/documents.ts'),
  previews: path.join(ROOT, 'previews'),
  release: path.join(ROOT, 'release'),
} as const;

export const GENERATED_BANNER = [
  '// AUTO-GENERATED FILE — DO NOT EDIT BY HAND.',
  '// Run `npm run generate` after changing the SVG assets or the metadata JSON.',
  '// `npm run verify:generated` fails the build if this file has drifted.',
  '',
  '',
].join('\n');

async function readJson(file: string): Promise<unknown> {
  return JSON.parse(await readFile(file, 'utf8')) as unknown;
}

export async function loadCategories(): Promise<Category[]> {
  return categoriesSchema.parse(await readJson(PATHS.categories));
}

export async function loadIcons(): Promise<Icon[]> {
  const parsed = iconsSchema.parse(await readJson(PATHS.icons));
  return [...parsed].sort((a, b) => a.id.localeCompare(b.id));
}

export async function loadAuditRecords(): Promise<AuditRecord[]> {
  return auditFileSchema.parse(await readJson(PATHS.auditRecords)).records;
}

export interface SvgAsset {
  id: string;
  weight: Weight;
  file: string;
  source: string;
}

/** Lists the released SVG assets, grouped by the weight directory they live in. */
export async function listSvgAssets(root = PATHS.iconsSvgRoot): Promise<SvgAsset[]> {
  const assets: SvgAsset[] = [];
  let weightDirs: string[];
  try {
    weightDirs = (await readdir(root, { withFileTypes: true }))
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name);
  } catch {
    return assets;
  }

  for (const weight of weightDirs.sort()) {
    const dir = path.join(root, weight);
    const files = (await readdir(dir)).filter((file) => file.endsWith('.svg')).sort();
    for (const file of files) {
      const full = path.join(dir, file);
      assets.push({
        id: path.basename(file, '.svg'),
        weight: weight as Weight,
        file: full,
        source: await readFile(full, 'utf8'),
      });
    }
  }

  return assets;
}

export async function writeGenerated(file: string, body: string): Promise<void> {
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, `${GENERATED_BANNER}${body.replace(/\n*$/, '\n')}`, 'utf8');
}

export function relative(file: string): string {
  return path.relative(ROOT, file);
}
