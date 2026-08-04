/**
 * Ingests the v3 audit artefacts into the repository's canonical form.
 *
 * Input  : scripts/ingest/source/icons-data.v3-audit.js  (verbatim from the audit)
 * Output : packages/icons/svg/regular/*.svg               (released drawings)
 *          packages/icons/staging/regular/*.svg           (drawings held from release)
 *          packages/metadata/src/data/audit-records.json  (all 86 audit rows, typed)
 *
 * This script is idempotent and re-runnable: it is the provenance record for
 * every drawing in the library. It never invents weights, never rewrites
 * geometry, and never promotes a drawing past the hold list below.
 */

import { mkdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import {
  expandBox,
  isEmptyBox,
  mergeBoxes,
  roundBox,
  shapeBounds,
  EMPTY_BOX,
} from '../lib/path-geometry.ts';
import { parseSvg, walk } from '../lib/svg-document.ts';
import { optimizeIconSvg } from '../lib/svg-optimize.ts';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../..');

const SOURCE = path.join(HERE, 'source/icons-data.v3-audit.js');
const RELEASED_DIR = path.join(ROOT, 'packages/icons/svg/regular');
const STAGING_DIR = path.join(ROOT, 'packages/icons/staging/regular');
const AUDIT_JSON = path.join(ROOT, 'packages/metadata/src/data/audit-records.json');

export type Blocker = 'cultural-review' | 'icon-design';

/**
 * Judgement-call holds: drawings that pass every automated check but must not
 * ship for a reason no script can decide. Geometry holds are *derived* below
 * rather than listed here, so a bad drawing can never be waved through by
 * forgetting to add it to a list.
 */
const CULTURAL_HOLDS: Record<string, string> = {
  fila:
    'The v3 audit flagged the referent as unconfirmed ("crown-on-brim could be several hats"). ' +
    'Releasing it would assert a cultural name the audit explicitly refused to assert. ' +
    'Needs a named referent confirmed by a Nigerian reviewer before release.',
};

/** Audit categories, mapped from the audit's short keys to stable public ids. */
const CATEGORY_IDS: Record<string, string> = {
  id: 'identity-state',
  fas: 'fashion-textiles',
  food: 'food-drink',
  mus: 'music-art-play',
  tra: 'transport',
  pla: 'places-landmarks',
  com: 'commerce-industry',
  cul: 'culture-people',
  def: 'defence',
};

const TIER_IDS: Record<string, 'icon' | 'illustration' | 'removed'> = {
  icon: 'icon',
  illus: 'illustration',
  '—': 'removed',
};

interface AuditModule {
  CATS: Record<string, string>;
  DATA: Array<[string, string, string, string, string, string]>;
  V3: Record<string, string>;
}

interface AuditRecord {
  sourceFile: string;
  proposedId: string;
  referentConfirmed: boolean;
  categoryId: string;
  auditTier: 'icon' | 'illustration' | 'removed';
  verdict: string;
  note: string;
  disposition: 'released' | 'held' | 'backlog' | 'merged' | 'dropped';
  publicIconId: string | null;
  hold?: { blocker: Blocker; reason: string };
}

const STROKE_WIDTH = 1.5;
const CANVAS = 24;
const LIVE_AREA_PADDING = 2;

function normaliseId(auditId: string): { id: string; confirmed: boolean } {
  const confirmed = !auditId.startsWith('⚠');
  return { id: auditId.replace(/^⚠\s*/, '').trim(), confirmed };
}

/**
 * Icon sources are pure geometry: no `<title>`, no `<desc>`, no ids, no classes.
 * Accessible names are supplied by the consuming layer (the React `title` prop,
 * the website's `aria-label`, the Figma node name), which is the only layer that
 * knows the user's language.
 */
function buildSvg(body: string): string {
  return [
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"',
    ` fill="none" stroke="currentColor" stroke-width="${STROKE_WIDTH}"`,
    ' stroke-linecap="round" stroke-linejoin="round">\n  ',
    body.replace(/></g, '>\n  <'),
    '\n</svg>\n',
  ].join('');
}

function measure(svgSource: string) {
  const root = parseSvg(svgSource);
  let box = EMPTY_BOX;
  for (const node of walk(root)) {
    if (node.tag === 'svg') continue;
    const nodeBox = shapeBounds(node.tag, node.attributes);
    if (nodeBox && !isEmptyBox(nodeBox)) box = mergeBoxes(box, nodeBox);
  }
  const stroked = expandBox(box, STROKE_WIDTH / 2);
  return {
    geometry: roundBox(box),
    stroked: roundBox(stroked),
    withinCanvas:
      stroked.minX >= -1e-6 &&
      stroked.minY >= -1e-6 &&
      stroked.maxX <= CANVAS + 1e-6 &&
      stroked.maxY <= CANVAS + 1e-6,
    withinLiveArea:
      box.minX >= LIVE_AREA_PADDING - 1e-6 &&
      box.minY >= LIVE_AREA_PADDING - 1e-6 &&
      box.maxX <= CANVAS - LIVE_AREA_PADDING + 1e-6 &&
      box.maxY <= CANVAS - LIVE_AREA_PADDING + 1e-6,
  };
}

async function main() {
  const module_ = (await import(pathToFileURL(SOURCE).href)) as AuditModule;
  const { CATS, DATA, V3 } = module_;

  const unknownCategories = Object.keys(CATS).filter((key) => !CATEGORY_IDS[key]);
  if (unknownCategories.length > 0) {
    throw new Error(
      `audit contains categories with no public mapping: ${unknownCategories.join(', ')}`,
    );
  }

  await rm(RELEASED_DIR, { recursive: true, force: true });
  await rm(STAGING_DIR, { recursive: true, force: true });
  await mkdir(RELEASED_DIR, { recursive: true });
  await mkdir(STAGING_DIR, { recursive: true });
  await mkdir(path.dirname(AUDIT_JSON), { recursive: true });

  const drawings = new Map<string, string>();
  for (const [auditId, body] of Object.entries(V3)) {
    const { id } = normaliseId(auditId);
    if (drawings.has(id)) throw new Error(`duplicate v3 drawing id: ${id}`);
    drawings.set(id, body);
  }

  const records: AuditRecord[] = [];
  const report: Array<Record<string, unknown>> = [];

  for (const row of DATA) {
    const [sourceFile, auditId, categoryKey, tierKey, verdict, note] = row;
    const { id, confirmed } = normaliseId(auditId);
    const categoryId = CATEGORY_IDS[categoryKey];
    const auditTier = TIER_IDS[tierKey];
    if (!categoryId) throw new Error(`unmapped audit category "${categoryKey}" on ${sourceFile}`);
    if (!auditTier) throw new Error(`unmapped audit tier "${tierKey}" on ${sourceFile}`);

    const body = drawings.get(id);

    if (!body) {
      records.push({
        sourceFile: `${sourceFile}.png`,
        proposedId: id,
        referentConfirmed: confirmed,
        categoryId,
        auditTier,
        verdict,
        note,
        disposition: verdict === 'cut' ? 'dropped' : verdict === 'merge' ? 'merged' : 'backlog',
        publicIconId: null,
      });
      continue;
    }

    // Written in the same canonical, optimised form `npm run optimize` produces,
    // so re-running the ingest never dirties the tree.
    const svg = optimizeIconSvg(buildSvg(body));
    const metrics = measure(svg);

    // A drawing is released only when nothing — human judgement or measured
    // geometry — is standing in its way.
    let hold: AuditRecord['hold'];
    if (CULTURAL_HOLDS[id]) {
      hold = { blocker: 'cultural-review', reason: CULTURAL_HOLDS[id] };
    } else if (!confirmed) {
      hold = {
        blocker: 'cultural-review',
        reason: `The v3 audit marked the referent as unconfirmed: ${note}`,
      };
    } else if (!metrics.withinCanvas) {
      hold = {
        blocker: 'icon-design',
        reason:
          `Stroked geometry leaves the 24-unit canvas ` +
          `(x [${metrics.stroked.minX}, ${metrics.stroked.maxX}], y [${metrics.stroked.minY}, ${metrics.stroked.maxY}]).`,
      };
    } else if (!metrics.withinLiveArea) {
      hold = {
        blocker: 'icon-design',
        reason:
          `Geometry leaves the ${LIVE_AREA_PADDING}-unit live area required by the drawing spec ` +
          `(x [${metrics.geometry.minX}, ${metrics.geometry.maxX}], y [${metrics.geometry.minY}, ${metrics.geometry.maxY}]). ` +
          'Needs a redraw that fits the safe padding, not a rescale.',
      };
    }

    const disposition: AuditRecord['disposition'] = hold ? 'held' : 'released';

    records.push({
      sourceFile: `${sourceFile}.png`,
      proposedId: id,
      referentConfirmed: confirmed,
      categoryId,
      auditTier,
      verdict,
      note,
      disposition,
      publicIconId: disposition === 'released' ? id : null,
      ...(hold ? { hold } : {}),
    });

    const target = disposition === 'released' ? RELEASED_DIR : STAGING_DIR;
    await writeFile(path.join(target, `${id}.svg`), svg, 'utf8');
    drawings.delete(id);

    report.push({
      id,
      disposition,
      blocker: hold?.blocker ?? null,
      referentConfirmed: confirmed,
      ...metrics,
    });
  }

  if (drawings.size > 0) {
    throw new Error(
      `v3 drawings with no audit row (cannot establish provenance): ${[...drawings.keys()].join(', ')}`,
    );
  }

  records.sort((a, b) => a.sourceFile.localeCompare(b.sourceFile));
  await writeFile(
    AUDIT_JSON,
    `${JSON.stringify(
      {
        $comment:
          'Internal working record from the August 2026 v3 audit. Verdicts and notes are ' +
          'preserved verbatim for design continuity. This file is NOT part of the published ' +
          'package surface and is never rendered in the public icon browser.',
        source: 'scripts/ingest/source/icons-data.v3-audit.js',
        auditedAt: '2026-08',
        records,
      },
      null,
      2,
    )}\n`,
    'utf8',
  );

  const count = (disposition: AuditRecord['disposition']) =>
    records.filter((record) => record.disposition === disposition).length;

  process.stdout.write(
    [
      `audit rows            : ${records.length}`,
      `v3 drawings ingested  : ${report.length}`,
      `  released            : ${count('released')}`,
      `  held                : ${count('held')}`,
      `backlog (no drawing)  : ${count('backlog')}`,
      `merged by audit       : ${count('merged')}`,
      `dropped by audit (cut): ${count('dropped')}`,
      '',
      'geometry report (units, 24x24 canvas):',
      ...report.map((entry) => {
        const geometry = entry.geometry as {
          minX: number;
          minY: number;
          maxX: number;
          maxY: number;
        };
        const flags = [
          entry.withinCanvas ? '' : 'OUTSIDE-CANVAS',
          entry.withinLiveArea ? '' : 'outside-live-area',
          entry.blocker ? `held:${String(entry.blocker)}` : '',
        ]
          .filter(Boolean)
          .join(' ');
        return `  ${String(entry.id).padEnd(16)} x[${geometry.minX}, ${geometry.maxX}] y[${geometry.minY}, ${geometry.maxY}] ${flags}`;
      }),
      '',
    ].join('\n'),
  );
}

await main();
