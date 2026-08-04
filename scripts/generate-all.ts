/**
 * Regenerates every derived source in the repository.
 *
 * Generated files are committed on purpose: `npm install && npm run build` must
 * work with no hidden prerequisite step. `npm run verify:generated` proves the
 * committed output still matches its inputs.
 */

import { generateAll } from './lib/generators.ts';
import { relative } from './lib/repo.ts';

const written = await generateAll();

process.stdout.write(
  [
    `generated ${written.length} file(s):`,
    ...written.map((file) => `  ${relative(file)}`),
    '',
  ].join('\n'),
);
