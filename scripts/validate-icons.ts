/**
 * Validates every canonical asset and the metadata that describes it.
 *
 *   npm run validate
 *   npm run validate -- --json
 *
 * Held drawings in packages/icons/staging are checked too, but their findings
 * are reported separately and never fail the build — they are the queue for
 * human icon design, not a regression in the released set.
 */

import { PATHS, listSvgAssets, loadCategories, loadIcons, relative } from './lib/repo.ts';
import { summarise, validateAsset, validateCollection, type Finding } from './lib/validate.ts';

const asJson = process.argv.includes('--json');

function group(findings: readonly Finding[]): Map<string, Finding[]> {
  const grouped = new Map<string, Finding[]>();
  for (const finding of findings) {
    const bucket = grouped.get(finding.target) ?? [];
    bucket.push(finding);
    grouped.set(finding.target, bucket);
  }
  return new Map([...grouped].sort(([a], [b]) => a.localeCompare(b)));
}

function render(title: string, findings: readonly Finding[]): string {
  if (findings.length === 0) return `${title}: clean\n`;
  const lines = [`${title}:`];
  for (const [target, bucket] of group(findings)) {
    lines.push(`  ${target}`);
    for (const finding of bucket) {
      lines.push(
        `    ${finding.severity === 'error' ? '✗' : '!'} [${finding.rule}] ${finding.message}`,
      );
    }
  }
  lines.push('');
  return lines.join('\n');
}

async function run(): Promise<number> {
  const [categories, icons, assets, stagingAssets] = await Promise.all([
    loadCategories(),
    loadIcons(),
    listSvgAssets(PATHS.iconsSvgRoot),
    listSvgAssets(PATHS.iconsStagingRoot),
  ]);

  const releasedFindings: Finding[] = [
    ...assets.flatMap((asset) => validateAsset(asset)),
    ...validateCollection({ icons, categories, assets, stagingAssets }),
  ];

  const stagingFindings: Finding[] = stagingAssets.flatMap((asset) =>
    validateAsset(asset).map((finding) => ({ ...finding, target: `staging/${finding.target}` })),
  );

  const released = summarise(releasedFindings);

  if (asJson) {
    process.stdout.write(
      `${JSON.stringify(
        {
          released: {
            assets: assets.length,
            icons: icons.length,
            categories: categories.length,
            ...released,
            findings: releasedFindings,
          },
          staging: { assets: stagingAssets.length, findings: stagingFindings },
        },
        null,
        2,
      )}\n`,
    );
    return released.errors > 0 ? 1 : 0;
  }

  process.stdout.write(
    [
      `Released set — ${assets.length} asset(s) in ${relative(PATHS.iconsSvgRoot)}, ` +
        `${icons.length} metadata record(s), ${categories.length} categories`,
      '',
      render('Released', releasedFindings),
      stagingAssets.length > 0
        ? render(
            `Held drawings (${stagingAssets.length}, not shipped, informational)`,
            stagingFindings,
          )
        : '',
      released.errors > 0
        ? `FAILED — ${released.errors} error(s), ${released.warnings} warning(s)\n`
        : `PASSED — 0 errors, ${released.warnings} warning(s)\n`,
    ]
      .filter(Boolean)
      .join('\n'),
  );

  return released.errors > 0 ? 1 : 0;
}

process.exitCode = await run();
