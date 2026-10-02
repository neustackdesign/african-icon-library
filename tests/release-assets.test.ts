import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import { pipeline } from '@african-icon-library/metadata';

import { FIGMA } from '../apps/web/lib/site.ts';
import { iconBody } from '../scripts/lib/generators.ts';
import {
  buildReleaseAssets,
  monoWidth,
  orderIcons,
  type AssetInput,
} from '../scripts/lib/release-assets.ts';
import { ROOT, listSvgAssets, loadCategories, loadIcons } from '../scripts/lib/repo.ts';

const icons = await loadIcons();
const categories = await loadCategories();
const assets = await listSvgAssets();
const bodies = new Map(assets.map((asset) => [asset.id, iconBody(asset.source)]));

const input: AssetInput = {
  icons: icons.map((icon) => ({
    id: icon.id,
    name: icon.name,
    category: icon.category,
    body: bodies.get(icon.id) ?? '',
  })),
  categoryLabels: Object.fromEntries(categories.map((category) => [category.id, category.label])),
  version: pipeline.version,
  figmaPublished: FIGMA.published,
};

const built = buildReleaseAssets(input);
const byFile = new Map(built.map((asset) => [asset.file, asset]));

/** The release formats named in Design System v3 · 08. */
const FORMATS = [
  ['figma-community-cover-1920x960.svg', 1920, 960],
  ['carousel-01-overview-1920x960.svg', 1920, 960],
  ['carousel-02-library-1920x960.svg', 1920, 960],
  ['carousel-03-system-1920x960.svg', 1920, 960],
  ['carousel-04-context-1920x960.svg', 1920, 960],
  ['carousel-05-one-library-1920x960.svg', 1920, 960],
  ['social-landscape-1200x628.svg', 1200, 628],
  ['social-square-1080x1080.svg', 1080, 1080],
  ['social-portrait-1080x1350.svg', 1080, 1350],
  ['hero-poster-1920x1080.svg', 1920, 1080],
  ['github-social-1280x640.svg', 1280, 640],
] as const;

const texts = (svg: string) =>
  [...svg.matchAll(/<text[^>]*>([^<]*)<\/text>/g)].map((match) => match[1] ?? '');

describe('release assets', () => {
  it('produces exactly the approved formats at their exact sizes', () => {
    expect(built.map((asset) => asset.file).sort()).toEqual(FORMATS.map(([file]) => file).sort());
    for (const [file, width, height] of FORMATS) {
      const asset = byFile.get(file)!;
      expect(asset.width).toBe(width);
      expect(asset.height).toBe(height);
      expect(asset.svg).toContain(
        `width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"`,
      );
    }
  });

  it('keeps the Community cover to the wordmark and the ribbon', () => {
    expect(texts(byFile.get('figma-community-cover-1920x960.svg')!.svg)).toEqual([
      'African Icon Library',
    ]);
  });

  it('uses the approved headline verbatim and real counts only', () => {
    const all = built.map((asset) => texts(asset.svg).join(' ')).join(' ');
    expect(all).toContain('Icons for the things');
    expect(all).toContain(`${icons.length} ICONS`);
    // No other icon count anywhere.
    for (const match of all.matchAll(/(\d+) (?:icons|ICONS)\b/g)) {
      expect(Number(match[1])).toBe(icons.length);
    }
  });

  it('keeps the illustrative disclaimer on the context slide', () => {
    expect(texts(byFile.get('carousel-04-context-1920x960.svg')!.svg).join(' ')).toContain(
      'NOT CUSTOMER PRODUCTS',
    );
  });

  it('says Figma is pending until it is published', () => {
    const slide = texts(byFile.get('carousel-05-one-library-1920x960.svg')!.svg).join(' ');
    expect(slide.includes('Community publication pending')).toBe(!FIGMA.published);
  });

  it('only draws released icons, every one in the ribbon frames', () => {
    const released = new Set(bodies.values());
    for (const asset of built) {
      for (const match of asset.svg.matchAll(/stroke-linejoin="round">(.*?)<\/g>/g)) {
        expect(released.has(match[1]!), asset.file).toBe(true);
      }
    }
    const cover = byFile.get('figma-community-cover-1920x960.svg')!.svg;
    for (const body of released) expect(cover).toContain(body);
  });

  it('composes with square fields and no gradients', () => {
    for (const asset of built) {
      // Drawings carry their own geometry; check only the composition around them.
      const composition = asset.svg.replace(/<g transform[^>]*>.*?<\/g>/g, '');
      expect(composition, asset.file).not.toMatch(/Gradient|\brx="/);
    }
  });

  it('orders the set by the V3 category order', () => {
    const ordered = orderIcons(input.icons).map((icon) => icon.category);
    expect(ordered[0]).toBe('food-drink');
    expect(ordered.at(-1)).toBe('identity-state');
  });

  it('measures mono labels exactly', () => {
    expect(monoWidth('abcd', 10)).toBe(24);
  });

  it('matches the committed masters, so media/release-assets is never stale', async () => {
    for (const asset of built) {
      const committed = await readFile(path.join(ROOT, 'media/release-assets', asset.file), 'utf8');
      expect(committed, asset.file).toBe(asset.svg);
    }
  });
});
