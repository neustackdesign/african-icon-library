import { optimize, type Config } from 'svgo';

/**
 * The exact root attribute set every icon asset must carry, in this order.
 *
 * Pinning it here (rather than trusting whatever the drawing tool exported)
 * is what makes `stroke="currentColor"` a guarantee instead of a convention:
 * a consumer can restyle any icon with `color`, and no asset can smuggle in a
 * hard-coded colour through a root attribute.
 */
export const ROOT_ATTRIBUTES: ReadonlyArray<readonly [string, string]> = [
  ['xmlns', 'http://www.w3.org/2000/svg'],
  ['width', '24'],
  ['height', '24'],
  ['viewBox', '0 0 24 24'],
  ['fill', 'none'],
  ['stroke', 'currentColor'],
  ['stroke-width', '1.5'],
  ['stroke-linecap', 'round'],
  ['stroke-linejoin', 'round'],
];

const SVGO_CONFIG: Config = {
  multipass: true,
  js2svg: { indent: 2, pretty: true, eol: 'lf', finalNewline: true },
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          // `removeViewBox` is not part of preset-default in SVGO 4, so the
          // viewBox — the coordinate contract every consumer relies on —
          // survives by default. The root is rewritten below regardless.
          //
          // Keep primitives as primitives. `<circle>` is easier to review than
          // the four arcs it would become, and the validator measures both.
          convertShapeToPath: false,
          // Merging paths across subpaths makes diffs unreadable and can change
          // fill-rule behaviour on the future `fill` weight.
          mergePaths: false,
          // The root's fill/stroke are load-bearing; SVGO must not "tidy" them.
          removeUselessStrokeAndFill: false,
          cleanupNumericValues: { floatPrecision: 3 },
          convertPathData: { floatPrecision: 3, transformPrecision: 4 },
          cleanupIds: { remove: true, minify: false },
        },
      },
    },
    'sortAttrs',
  ],
};

/**
 * Optimises an icon SVG and re-imposes the canonical root attributes.
 *
 * The root is rewritten rather than patched, so attribute order is deterministic
 * regardless of what the drawing tool exported.
 */
export function optimizeIconSvg(source: string): string {
  const { data } = optimize(source, SVGO_CONFIG);

  const match = /^<svg\b([^>]*)>([\s\S]*)<\/svg>\s*$/.exec(data.trim());
  if (!match) throw new Error('optimised output is not a single <svg> element');

  const body = match[2].replace(/^\n+/, '').replace(/\s+$/, '');
  const attributes = ROOT_ATTRIBUTES.map(([name, value]) => `${name}="${value}"`).join(' ');

  return `<svg ${attributes}>\n${body}\n</svg>\n`;
}
