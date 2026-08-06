/**
 * Packs the publishable packages and installs them into a throwaway consumer.
 *
 * This is the only way to find out what actually ships: `files`, `exports`,
 * type resolution and peer ranges are all things that look right in the
 * repository and break the moment someone installs the tarball.
 */

import { execFileSync } from 'node:child_process';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { ROOT, loadIcons, relative } from './lib/repo.ts';

const PACKAGES = ['packages/metadata', 'packages/icons', 'packages/react'] as const;

function run(command: string, args: string[], cwd: string): string {
  return execFileSync(command, args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
}

async function main(): Promise<number> {
  const outDir = path.join(ROOT, 'release/packages');
  await rm(outDir, { recursive: true, force: true });
  await mkdir(outDir, { recursive: true });

  const icons = await loadIcons();
  const problems: string[] = [];
  const packed: Array<{ name: string; file: string; bytes: number; files: number }> = [];

  for (const directory of PACKAGES) {
    const packageJson = JSON.parse(
      await readFile(path.join(ROOT, directory, 'package.json'), 'utf8'),
    ) as { name: string; version: string };

    const output = run(
      'npm',
      ['pack', '--json', '--pack-destination', outDir],
      path.join(ROOT, directory),
    );
    const [result] = JSON.parse(output) as Array<{
      filename: string;
      size: number;
      entryCount: number;
      files: Array<{ path: string }>;
    }>;

    packed.push({
      name: packageJson.name,
      file: result.filename,
      bytes: result.size,
      files: result.entryCount,
    });

    const paths = result.files.map((entry) => entry.path);

    // Nothing held back may ship, and nothing repository-internal may leak.
    for (const forbidden of ['staging/', 'superseded/', 'audit-records.json', 'src/data/']) {
      const leaked = paths.filter((entry) => entry.includes(forbidden));
      if (leaked.length > 0) {
        problems.push(`${packageJson.name} ships ${forbidden} (${leaked.length} file(s))`);
      }
    }
    if (!paths.some((entry) => entry === 'LICENSE' || entry === 'README.md')) {
      problems.push(`${packageJson.name} ships neither a LICENSE nor a README`);
    }
    if (packageJson.name === '@african-icon-library/icons') {
      const svgs = paths.filter((entry) => entry.startsWith('svg/'));
      if (svgs.length !== icons.length) {
        problems.push(
          `${packageJson.name} ships ${svgs.length} SVG file(s) but ${icons.length} icons are released`,
        );
      }
    }
  }

  /* ---------------- clean-room consumer ---------------- */

  const consumer = await mkdtemp(path.join(tmpdir(), 'ail-consumer-'));
  await writeFile(
    path.join(consumer, 'package.json'),
    `${JSON.stringify(
      { name: 'ail-consumer', private: true, version: '1.0.0', type: 'module' },
      null,
      2,
    )}\n`,
    'utf8',
  );

  const tarballs = packed.map((entry) => path.join(outDir, entry.file));
  run(
    'npm',
    ['install', '--no-audit', '--no-fund', 'react@19', 'react-dom@19', ...tarballs],
    consumer,
  );

  await writeFile(
    path.join(consumer, 'smoke.mjs'),
    `
import { renderToStaticMarkup } from 'react-dom/server';
import { createElement } from 'react';
import { icons, categories, pipeline, searchIcons, getIcon } from '@african-icon-library/metadata';
import { renderIconSvg, iconIds, getIconWeights } from '@african-icon-library/icons';
import * as ReactIcons from '@african-icon-library/react';

const failures = [];
const check = (label, condition) => { if (!condition) failures.push(label); };

check('metadata exports icons', icons.length === ${icons.length});
check('metadata exports categories', categories.length > 0);
check('pipeline released matches', pipeline.released === ${icons.length});
check('search finds a known icon', searchIcons(icons, 'suya')[0]?.icon.id === 'suya');
check('getIcon resolves', getIcon('danfo')?.name === 'Danfo');
check('icons package exports every id', iconIds.length === ${icons.length});
check('renderIconSvg produces a document', (renderIconSvg('talking-drum') ?? '').startsWith('<svg'));
check('weights are regular only', getIconWeights('danfo').join(',') === 'regular');

// No held or superseded asset may be reachable from a published package.
check('held icon is absent from icons', !iconIds.includes('fila'));
check('held icon is absent from metadata', getIcon('fila') === undefined);
check('held icon has no component', !('Fila' in ReactIcons));

const markup = renderToStaticMarkup(
  createElement('div', null,
    createElement(ReactIcons.TalkingDrum, { size: 32, title: 'Talking drum' }),
    createElement(ReactIcons.Danfo, null),
    createElement(ReactIcons.NairaSign, { weight: 'bold' }),
  ),
);
check('components render', markup.includes('<svg') && markup.split('<svg').length === 4);
check('accessible name is applied', markup.includes('aria-label="Talking drum"'));
check('decorative icons are hidden', markup.includes('aria-hidden="true"'));
check('paint stays currentColor', markup.includes('stroke="currentColor"') && !/#[0-9a-f]{3,6}/i.test(markup));
check('undrawn weight falls back rather than faking', markup.split('stroke-width="1.5"').length === 4);

if (failures.length) {
  console.error('CONSUMER FAILURES:\\n' + failures.map((f) => '  - ' + f).join('\\n'));
  process.exit(1);
}
console.log('consumer smoke test: ' + ${JSON.stringify('all checks passed')});
`,
    'utf8',
  );

  let smoke = '';
  try {
    smoke = run('node', ['smoke.mjs'], consumer).trim();
  } catch (error) {
    problems.push(
      `clean-room consumer failed: ${(error as Error & { stderr?: string }).stderr ?? ''}`,
    );
  }

  await rm(consumer, { recursive: true, force: true });

  process.stdout.write(
    [
      `packed ${packed.length} package(s) into ${relative(outDir)}:`,
      ...packed.map(
        (entry) =>
          `  ${entry.name.padEnd(36)} ${entry.file}  ${entry.bytes} bytes, ${entry.files} files`,
      ),
      smoke ? `  ${smoke}` : '',
      '',
      problems.length === 0
        ? 'package contents and clean-room install: OK'
        : `FAILED:\n${problems.map((problem) => `  - ${problem}`).join('\n')}`,
      '',
    ]
      .filter(Boolean)
      .join('\n'),
  );

  return problems.length === 0 ? 0 : 1;
}

process.exitCode = await main();
