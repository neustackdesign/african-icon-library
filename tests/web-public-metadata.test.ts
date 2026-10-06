import { readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import { icons } from '@african-icon-library/metadata';

import { browserEntries } from '../apps/web/lib/icons.ts';
import { PUBLIC_ICON_FIELDS, toPublicIcon } from '../apps/web/lib/public-icon.ts';

/**
 * Canonical icon metadata carries internal maintenance records: audit source
 * filenames, audit verdicts, migration lineage and reviewer notes. They are
 * kept in the repository, but no public web page may render or serialise
 * them. The built output itself is scanned by `npm run verify:public-site`.
 */
const WEB = path.resolve(import.meta.dirname, '../apps/web');
const INTERNAL_FIELDS = [
  'provenance',
  'culturalReview',
  'auditSourceFile',
  'auditVerdict',
  'roadmapEntry',
  'redrawnSinceIngest',
  'referentConfirmed',
  'auditKey',
];
const internalValues = icons.flatMap((icon) =>
  [icon.provenance.auditSourceFile, icon.provenance.roadmapEntry, icon.culturalReview.note].filter(
    (value): value is string => Boolean(value),
  ),
);

function sources(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const file = path.join(dir, name);
    if (statSync(file).isDirectory()) return sources(file);
    return /\.(tsx?|mdx?)$/.test(name) ? [file] : [];
  });
}

describe('public icon pages never carry internal provenance', () => {
  it('projects every released icon to public fields only', () => {
    for (const icon of icons) {
      const projected = toPublicIcon(icon);
      expect(Object.keys(projected).sort(), icon.id).toEqual([...PUBLIC_ICON_FIELDS].sort());
      const json = JSON.stringify(projected);
      for (const field of INTERNAL_FIELDS) expect(json, icon.id).not.toContain(`"${field}"`);
    }
  });

  it('gives the browser (and so the page payload) no internal value for any of the icons', () => {
    const json = JSON.stringify(browserEntries());
    expect(browserEntries()).toHaveLength(icons.length);
    for (const field of INTERNAL_FIELDS) expect(json).not.toContain(`"${field}"`);
    for (const value of internalValues) expect(json).not.toContain(value);
  });

  it.each(['app', 'components', 'lib'])('no %s source reads an internal field', (dir) => {
    for (const file of sources(path.join(WEB, dir))) {
      if (file.endsWith(path.join('lib', 'public-icon.ts'))) continue;
      const code = readFileSync(file, 'utf8').replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, '');
      for (const field of INTERNAL_FIELDS) {
        expect(code, path.relative(WEB, file)).not.toMatch(new RegExp(`\\.${field}\\b`));
      }
    }
  });

  it('keeps the metadata package index (and its full records) out of client code', () => {
    const client = sources(WEB).filter(
      (file) =>
        !file.includes(`${path.sep}.next${path.sep}`) &&
        !file.includes(`${path.sep}node_modules${path.sep}`) &&
        /^['"]use client['"]/.test(readFileSync(file, 'utf8')),
    );
    // Client components and every local module they import, transitively.
    const seen = new Set<string>();
    const visit = (file: string): void => {
      if (seen.has(file)) return;
      seen.add(file);
      const code = readFileSync(file, 'utf8');
      expect(code, path.relative(WEB, file)).not.toMatch(
        /^import (?!type )[^;]*from '@african-icon-library\/metadata';/m,
      );
      for (const [, spec] of code.matchAll(/^import (?!type )[^;]*from '((?:@\/|\.)[^']+)';/gm)) {
        const base = spec!.startsWith('@/')
          ? path.join(WEB, spec!.slice(2))
          : path.resolve(path.dirname(file), spec!);
        const target = ['.ts', '.tsx', '/index.ts']
          .map((ext) => base + ext)
          .find((candidate) => {
            try {
              return statSync(candidate).isFile();
            } catch {
              return false;
            }
          });
        if (target && target.startsWith(WEB)) visit(target);
      }
    };
    for (const file of client) visit(file);
    expect(seen.size).toBeGreaterThan(client.length);
  });
});
