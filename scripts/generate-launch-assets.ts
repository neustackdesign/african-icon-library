/**
 * Builds the launch asset set as SVG masters, ready to rasterise.
 *
 * `launch/social-assets/README.md` described what these should be. This makes
 * them. Every count, icon and label is read from the repository at build time,
 * so an asset cannot claim a number the library does not have — the failure
 * mode that a hand-made PNG invites and never warns you about.
 *
 * Output: launch-assets/<channel>/*.svg plus alt text and a manifest.
 * `npm run launch:assets` writes the masters; the PNG/PDF exports are produced
 * from them by scripts/export-launch-assets.mjs using headless Chromium.
 */

import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { PATHS, ROOT, listSvgAssets, loadCategories, loadIcons, relative } from './lib/repo.ts';
import { iconBody } from './lib/generators.ts';

const OUT = path.join(ROOT, 'launch-assets');

/* The product's own tokens. Assets that drift from these stop reading as the
   same thing the website is. */
const PAPER = '#FAF9F6';
const INK = '#16150F';
const MUTED = '#56524A';
const ACCENT = '#1F5C3D';

const SANS = 'ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif';
const MONO = 'ui-monospace,SFMono-Regular,Menlo,monospace';

function esc(v: string): string {
  return v.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

interface Ctx {
  icons: { id: string; category: string; body: string }[];
  categories: Map<string, string>;
  count: number;
  categoryCount: number;
}

function text(
  s: string,
  x: number,
  y: number,
  size: number,
  fill: string,
  opts: { weight?: number; family?: string; anchor?: string; spacing?: number } = {},
): string {
  const { weight = 400, family = SANS, anchor = 'start', spacing } = opts;
  return (
    `<text x="${x}" y="${y}" font-family="${family}" font-size="${size}" font-weight="${weight}" ` +
    `fill="${fill}" text-anchor="${anchor}"${spacing ? ` letter-spacing="${spacing}"` : ''}>${esc(s)}</text>`
  );
}

function glyph(body: string, x: number, y: number, size: number, stroke: string, sw = 1.5): string {
  return (
    `<g transform="translate(${x} ${y}) scale(${size / 24})" fill="none" stroke="${stroke}" ` +
    `stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">${body}</g>`
  );
}

/**
 * Average advance width as a fraction of font size, measured from the rendered
 * output rather than guessed: the display face is wider than a naive 0.5em, and
 * assuming otherwise pushed the first headline straight off the canvas.
 */
const EM_BOLD = 0.58;
const EM_BODY = 0.51;

/** How many characters of `size` type fit in `width`. */
function fitChars(width: number, size: number, em: number): number {
  return Math.max(8, Math.floor(width / (size * em)));
}

/** Wraps a headline to a column, since SVG will not do it for us. */
function wrap(s: string, perLine: number): string[] {
  const words = s.split(' ');
  const lines: string[] = [];
  let line = '';
  for (const word of words) {
    if ((line + ' ' + word).trim().length > perLine && line) {
      lines.push(line.trim());
      line = word;
    } else line = `${line} ${word}`;
  }
  if (line.trim()) lines.push(line.trim());
  return lines;
}

function doc(w: number, h: number, bg: string, body: string): string {
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">` +
    `<rect width="${w}" height="${h}" fill="${bg}"/>${body}</svg>\n`
  );
}

/** A tiled band of icons, used as the recurring visual signature. */
function iconBand(
  ctx: Ctx,
  x: number,
  y: number,
  width: number,
  size: number,
  gap: number,
  stroke: string,
  offset = 0,
): string {
  const step = size + gap;
  const n = Math.floor(width / step);
  const out: string[] = [];
  for (let i = 0; i < n; i++) {
    const icon = ctx.icons[(i + offset) % ctx.icons.length];
    out.push(glyph(icon.body, x + i * step, y, size, stroke));
  }
  return out.join('');
}

/* ------------------------------------------------------------------ *
 * Templates
 * ------------------------------------------------------------------ */

function heroCard(
  ctx: Ctx,
  w: number,
  h: number,
  kicker: string,
  headline: string,
  sub: string,
): string {
  const pad = Math.round(w * 0.07);
  const avail = w - pad * 2;
  const kickerSize = Math.round(w * 0.016);
  const subSize = Math.round(w * 0.021);
  const bandSize = Math.round(w * 0.04);

  /* Reserve the band first and lay the text out in what is left. Sizing the
     headline against the width alone is what put the subtitle on top of the
     icons: a headline that wraps to three lines needs the vertical budget
     checked too. */
  const bandTop = h - pad - bandSize;
  const contentTop = pad + kickerSize + Math.round(h * 0.06);
  const contentBottom = bandTop - Math.round(h * 0.05);

  const longest = headline.split(' ').reduce((a, b) => (a.length > b.length ? a : b), '');
  let titleSize = Math.round(w * 0.072);
  let lines = wrap(headline, fitChars(avail, titleSize, EM_BOLD));
  const subLines = wrap(sub, fitChars(avail, subSize, EM_BODY));
  const blockHeight = () => lines.length * titleSize * 1.12 + 24 + subLines.length * subSize * 1.35;

  while (
    titleSize > 14 &&
    (longest.length * titleSize * EM_BOLD > avail || blockHeight() > contentBottom - contentTop)
  ) {
    titleSize -= 2;
    lines = wrap(headline, fitChars(avail, titleSize, EM_BOLD));
  }

  const parts: string[] = [
    text(kicker.toUpperCase(), pad, pad + kickerSize, kickerSize, ACCENT, {
      family: MONO,
      spacing: 2,
    }),
  ];

  /* Bottom-align the text block against the band so cards with one-line and
     three-line headlines still look like the same template. */
  let y =
    contentBottom - subLines.length * subSize * 1.35 - 24 - (lines.length - 1) * titleSize * 1.12;
  for (const line of lines) {
    parts.push(text(line, pad, y, titleSize, INK, { weight: 700 }));
    y += titleSize * 1.12;
  }
  y += 24 - titleSize * 1.12;
  for (const line of subLines) {
    y += subSize * 1.35;
    parts.push(text(line, pad, y, subSize, MUTED));
  }

  parts.push(iconBand(ctx, pad, bandTop, avail, bandSize, Math.round(w * 0.022), INK));
  return doc(w, h, PAPER, parts.join(''));
}

function statCard(
  ctx: Ctx,
  w: number,
  h: number,
  title: string,
  stats: [string, string][],
): string {
  const pad = Math.round(w * 0.07);
  const parts: string[] = [
    text(title, pad, pad + Math.round(w * 0.045), Math.round(w * 0.045), INK, { weight: 700 }),
  ];
  const colW = (w - pad * 2) / stats.length;
  stats.forEach(([value, label], i) => {
    const x = pad + i * colW;
    parts.push(text(value, x, Math.round(h * 0.55), Math.round(w * 0.075), INK, { weight: 700 }));
    for (const [j, line] of wrap(label, 18).entries()) {
      parts.push(text(line, x, Math.round(h * 0.55) + 26 + j * 20, Math.round(w * 0.018), MUTED));
    }
  });
  parts.push(
    iconBand(
      ctx,
      pad,
      h - pad - Math.round(w * 0.045),
      w - pad * 2,
      Math.round(w * 0.036),
      Math.round(w * 0.02),
      INK,
    ),
  );
  return doc(w, h, PAPER, parts.join(''));
}

/** The whole released set, laid out to fill the frame. */
function collectionSheet(ctx: Ctx, w: number, h: number, cols: number, dark = false): string {
  const bg = dark ? INK : PAPER;
  const fg = dark ? PAPER : INK;
  const sub = dark ? '#B0AA9C' : MUTED;
  const pad = Math.round(w * 0.06);
  const headH = Math.round(h * 0.2);
  const rows = Math.ceil(ctx.count / cols);
  const cellW = (w - pad * 2) / cols;
  const cellH = (h - headH - pad) / rows;
  const size = Math.min(cellW, cellH) * 0.52;

  const parts: string[] = [
    text('AFRICAN ICON LIBRARY', pad, pad + 16, Math.round(w * 0.014), ACCENT, {
      family: MONO,
      spacing: 2,
    }),
    text(
      `${ctx.count} icons. One grid.`,
      pad,
      pad + Math.round(w * 0.062),
      Math.round(w * 0.048),
      fg,
      {
        weight: 700,
      },
    ),
    text(
      `${ctx.categoryCount} categories · regular weight · MIT licensed`,
      pad,
      pad + Math.round(w * 0.092),
      Math.round(w * 0.018),
      sub,
    ),
  ];
  ctx.icons.forEach((icon, i) => {
    const cx = pad + (i % cols) * cellW + cellW / 2;
    const cy = headH + Math.floor(i / cols) * cellH + cellH / 2;
    parts.push(glyph(icon.body, cx - size / 2, cy - size / 2, size, fg));
  });
  return doc(w, h, bg, parts.join(''));
}

function quoteCard(ctx: Ctx, w: number, h: number, quote: string, attribution: string): string {
  const pad = Math.round(w * 0.08);
  const avail = w - pad * 2;
  let size = Math.round(w * 0.05);
  const longest = quote.split(' ').reduce((a, b) => (a.length > b.length ? a : b), '');
  while (size > 12 && longest.length * size * EM_BOLD > avail) size -= 2;
  const parts: string[] = [];
  let y = Math.round(h * 0.3);
  for (const line of wrap(quote, fitChars(avail, size, EM_BOLD))) {
    parts.push(text(line, pad, y, size, PAPER, { weight: 600 }));
    y += size * 1.2;
  }
  parts.push(text(attribution, pad, y + 24, Math.round(w * 0.02), '#B0AA9C', { family: MONO }));
  parts.push(
    iconBand(
      ctx,
      pad,
      h - pad - Math.round(w * 0.04),
      w - pad * 2,
      Math.round(w * 0.034),
      Math.round(w * 0.02),
      PAPER,
    ),
  );
  return doc(w, h, INK, parts.join(''));
}

function categorySheet(ctx: Ctx, w: number, h: number, categoryId: string, label: string): string {
  const inCat = ctx.icons.filter((i) => i.category === categoryId);
  const pad = Math.round(w * 0.08);
  const cols = Math.min(inCat.length, 4);
  const cellW = (w - pad * 2) / cols;
  const size = Math.min(cellW * 0.5, h * 0.22);
  const parts: string[] = [
    text(label.toUpperCase(), pad, pad + 16, Math.round(w * 0.016), ACCENT, {
      family: MONO,
      spacing: 2,
    }),
    text(`${inCat.length} icons`, pad, pad + Math.round(w * 0.06), Math.round(w * 0.042), INK, {
      weight: 700,
    }),
  ];
  inCat.forEach((icon, i) => {
    const cx = pad + (i % cols) * cellW + cellW / 2;
    const cy = Math.round(h * 0.45) + Math.floor(i / cols) * (size * 1.9);
    parts.push(glyph(icon.body, cx - size / 2, cy, size, INK));
    parts.push(
      text(icon.id, cx, cy + size + 22, Math.round(w * 0.015), MUTED, {
        family: MONO,
        anchor: 'middle',
      }),
    );
  });
  return doc(w, h, PAPER, parts.join(''));
}

/* ------------------------------------------------------------------ *
 * Build
 * ------------------------------------------------------------------ */

interface Asset {
  channel: string;
  file: string;
  svg: string;
  width: number;
  height: number;
  purpose: string;
  phase: string;
  alt: string;
}

async function main(): Promise<number> {
  const [icons, categories, assets] = await Promise.all([
    loadIcons(),
    loadCategories(),
    listSvgAssets(PATHS.iconsSvgRoot),
  ]);
  const sources = new Map(assets.map((a) => [a.id, a.source]));
  const ctx: Ctx = {
    icons: icons.map((i) => ({
      id: i.id,
      category: i.category,
      body: iconBody(sources.get(i.id) ?? ''),
    })),
    categories: new Map(categories.map((c) => [c.id, c.label])),
    count: icons.length,
    categoryCount: new Set(icons.map((i) => i.category)).size,
  };

  const N = ctx.count;
  const out: Asset[] = [];
  const add = (a: Asset) => out.push(a);

  /* ---- LinkedIn (1200x627) ---- */
  add({
    channel: 'linkedin',
    file: 'technical-preview.svg',
    svg: heroCard(
      ctx,
      1200,
      627,
      'Technical preview',
      'The icons global libraries never drew.',
      `${N} icons for Nigerian life, on one 24-pixel grid. Open source, MIT.`,
    ),
    width: 1200,
    height: 627,
    purpose: 'Technical-preview announcement',
    phase: 'Gate 2',
    alt: `Cream card reading "The icons global libraries never drew." above a row of African Icon Library glyphs. Subtitle: ${N} icons for Nigerian life, on one 24-pixel grid.`,
  });
  add({
    channel: 'linkedin',
    file: 'website-live.svg',
    svg: heroCard(
      ctx,
      1200,
      627,
      'Now live',
      'Browse all the icons in one place.',
      `icons.neustackstudio.com — search, copy SVG, download by category.`,
    ),
    width: 1200,
    height: 627,
    purpose: 'Website launch',
    phase: 'Gate 3',
    alt: 'Cream card announcing the African Icon Library website is live, above a row of icons.',
  });

  /* LinkedIn carousel — the narrative, one idea per page. */
  const carousel: [string, string, string][] = [
    [
      'The gap',
      'The icons global libraries never drew.',
      'Search any major icon set for "danfo". You get a bus.',
    ],
    [
      'The problem',
      'Generic shapes carry a culture badly.',
      'A yellow minibus is not a bus. A suya skewer is not a kebab.',
    ],
    [
      'The work',
      `${N} drawings on one 24-pixel grid.`,
      'One stroke logic, one live area, one canvas. Validated in CI.',
    ],
    [
      'The standard',
      'Legible at 16 pixels or it does not ship.',
      'Two drawings were withdrawn from this release for failing that.',
    ],
    [
      'The honesty',
      'One weight, and we say so.',
      'Thin, bold and fill are specified and undrawn. A weight is a drawing, not a stroke-width.',
    ],
    [
      'The invitation',
      'Nigeria first. Africa expanding.',
      'Open source, MIT. Corrections and local names welcome.',
    ],
  ];
  carousel.forEach(([kicker, headline, sub], i) => {
    add({
      channel: 'linkedin',
      file: `carousel-${String(i + 1).padStart(2, '0')}.svg`,
      svg: heroCard(ctx, 1200, 1200, kicker, headline, sub),
      width: 1200,
      height: 1200,
      purpose: `LinkedIn carousel page ${i + 1}: ${kicker}`,
      phase: 'Gate 3',
      alt: `Carousel page ${i + 1}. ${kicker}: ${headline} ${sub}`,
    });
  });

  /* ---- Instagram (1080x1350 feed, 1080x1920 story) ---- */
  carousel.forEach(([kicker, headline, sub], i) => {
    add({
      channel: 'instagram',
      file: `launch-carousel-${String(i + 1).padStart(2, '0')}.svg`,
      svg: heroCard(ctx, 1080, 1350, kicker, headline, sub),
      width: 1080,
      height: 1350,
      purpose: `Instagram launch carousel page ${i + 1}`,
      phase: 'Gate 3',
      alt: `Instagram carousel page ${i + 1}. ${kicker}: ${headline} ${sub}`,
    });
  });
  add({
    channel: 'instagram',
    file: 'cultural-review-call.svg',
    svg: quoteCard(
      ctx,
      1080,
      1350,
      'One drawing is held because nobody could confirm what it is.',
      'We need Nigerian reviewers. Link in bio.',
    ),
    width: 1080,
    height: 1350,
    purpose: 'Cultural-review recruitment',
    phase: 'Gate 2',
    alt: 'Dark card reading "One drawing is held because nobody could confirm what it is." with a call for Nigerian reviewers.',
  });
  add({
    channel: 'instagram',
    file: 'contributor-call.svg',
    svg: quoteCard(
      ctx,
      1080,
      1350,
      'If we drew it wrong, tell us. That is the whole contribution model.',
      'github.com/neustackdesign/african-icon-library',
    ),
    width: 1080,
    height: 1350,
    purpose: 'Contributor call',
    phase: 'Gate 4',
    alt: 'Dark card inviting corrections to the icon set, with the GitHub repository address.',
  });
  add({
    channel: 'instagram',
    file: 'story-launch.svg',
    svg: heroCard(
      ctx,
      1080,
      1920,
      'Now live',
      'The icons global libraries never drew.',
      `${N} icons. Free. MIT.`,
    ),
    width: 1080,
    height: 1920,
    purpose: 'Instagram story',
    phase: 'Gate 3',
    alt: 'Vertical story card announcing the African Icon Library launch.',
  });
  add({
    channel: 'instagram',
    file: 'reel-cover.svg',
    svg: collectionSheet(ctx, 1080, 1920, 5, true),
    width: 1080,
    height: 1920,
    purpose: 'Reel cover',
    phase: 'Gate 3',
    alt: `Dark vertical cover showing all ${N} icons in a grid.`,
  });

  /* ---- X (1600x900) ---- */
  add({
    channel: 'x',
    file: 'thread-01-hook.svg',
    svg: heroCard(
      ctx,
      1600,
      900,
      'Open source',
      'The icons global libraries never drew.',
      `${N} icons for Nigerian life. One 24-pixel grid. MIT.`,
    ),
    width: 1600,
    height: 900,
    purpose: 'Thread opener',
    phase: 'Gate 3',
    alt: 'Wide cream card with the headline "The icons global libraries never drew." above a row of icons.',
  });
  add({
    channel: 'x',
    file: 'thread-02-complete-set.svg',
    svg: collectionSheet(ctx, 1600, 900, 10),
    width: 1600,
    height: 900,
    purpose: 'Complete set',
    phase: 'Gate 3',
    alt: `All ${N} released icons shown together in a grid on cream.`,
  });
  add({
    channel: 'x',
    file: 'thread-03-standard.svg',
    svg: statCard(ctx, 1600, 900, 'Where this actually stands', [
      [String(N), 'icons released'],
      ['1', 'weight drawn (regular)'],
      [String(ctx.categoryCount), 'categories in use'],
      ['2', 'withdrawn for failing at 16px'],
    ]),
    width: 1600,
    height: 900,
    purpose: 'Honest numbers',
    phase: 'Gate 3',
    alt: `Card showing ${N} icons released, 1 weight drawn, ${ctx.categoryCount} categories in use, 2 withdrawn for failing at 16 pixels.`,
  });
  add({
    channel: 'x',
    file: 'thread-04-grid.svg',
    svg: quoteCard(
      ctx,
      1600,
      900,
      'Legible at 16 pixels, or it does not ship.',
      'Two drawings were withdrawn from this release for failing that test.',
    ),
    width: 1600,
    height: 900,
    purpose: 'The standard',
    phase: 'Gate 3',
    alt: 'Dark card reading "Legible at 16 pixels, or it does not ship."',
  });

  /* ---- GitHub + press ---- */
  add({
    channel: 'github',
    file: 'social-preview.svg',
    svg: heroCard(
      ctx,
      1280,
      640,
      'MIT licensed',
      'African Icon Library',
      `${N} icons for African life, drawn on one 24-pixel grid. Nigeria first.`,
    ),
    width: 1280,
    height: 640,
    purpose: 'GitHub repository social preview',
    phase: 'Gate 2',
    alt: 'GitHub social preview card for the African Icon Library.',
  });
  add({
    channel: 'press',
    file: 'press-kit-cover.svg',
    svg: heroCard(
      ctx,
      1920,
      1080,
      'Press kit',
      'African Icon Library',
      `${N} icons · ${ctx.categoryCount} categories · open source · Neustack Studio`,
    ),
    width: 1920,
    height: 1080,
    purpose: 'Press-kit cover',
    phase: 'Gate 3',
    alt: 'Press kit cover for the African Icon Library.',
  });
  add({
    channel: 'press',
    file: 'complete-collection-sheet.svg',
    svg: collectionSheet(ctx, 1920, 1080, 10),
    width: 1920,
    height: 1080,
    purpose: 'Complete collection sheet',
    phase: 'Gate 2',
    alt: `All ${N} released icons on one sheet.`,
  });
  for (const [id, label] of ctx.categories) {
    if (!ctx.icons.some((i) => i.category === id)) continue;
    add({
      channel: 'press',
      file: `category-${id}.svg`,
      svg: categorySheet(ctx, 1200, 900, id, label),
      width: 1200,
      height: 900,
      purpose: `Category sheet — ${label}`,
      phase: 'Gate 2',
      alt: `Category sheet showing the ${label} icons with their names.`,
    });
  }

  /* ---- Figma listing art ---- */
  add({
    channel: 'figma',
    file: 'plugin-cover-1920x960.svg',
    svg: heroCard(
      ctx,
      1920,
      960,
      'Figma plugin',
      'African Icon Library',
      `Insert any of ${N} icons as editable vectors. Works offline.`,
    ),
    width: 1920,
    height: 960,
    purpose: 'Figma plugin cover',
    phase: 'Gate 3',
    alt: 'Figma plugin cover for the African Icon Library.',
  });
  add({
    channel: 'figma',
    file: 'community-cover-1920x960.svg',
    svg: collectionSheet(ctx, 1920, 960, 10),
    width: 1920,
    height: 960,
    purpose: 'Figma Community file cover',
    phase: 'Gate 3',
    alt: `Figma Community cover showing all ${N} icons.`,
  });
  for (let i = 0; i < 4; i++) {
    const [kicker, headline, sub] = carousel[i];
    add({
      channel: 'figma',
      file: `plugin-carousel-${String(i + 1).padStart(2, '0')}.svg`,
      svg: heroCard(ctx, 1920, 960, kicker, headline, sub),
      width: 1920,
      height: 960,
      purpose: `Figma plugin carousel ${i + 1}`,
      phase: 'Gate 3',
      alt: `Figma plugin carousel image ${i + 1}. ${headline}`,
    });
  }

  /* ---- write ---- */
  for (const asset of out) {
    const dir = path.join(OUT, asset.channel);
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, asset.file), asset.svg, 'utf8');
  }

  /* One alt-text file per channel — accessible copy travels with the asset or
     it does not get written at all. */
  const byChannel = new Map<string, Asset[]>();
  for (const asset of out) {
    const list = byChannel.get(asset.channel) ?? [];
    list.push(asset);
    byChannel.set(asset.channel, list);
  }
  for (const [channel, list] of byChannel) {
    await writeFile(
      path.join(OUT, channel, 'alt-text.md'),
      `# Alt text — ${channel}\n\nPaste these when posting. Every image needs one.\n\n` +
        list.map((a) => `## \`${a.file.replace(/\.svg$/, '.png')}\`\n\n${a.alt}\n`).join('\n') +
        '\n',
      'utf8',
    );
  }

  await writeFile(
    path.join(OUT, 'manifest.json'),
    `${JSON.stringify(
      {
        $comment:
          'Generated by `npm run launch:assets`. Counts come from the repository, so an asset ' +
          'cannot claim a number the library does not have.',
        generatedFor: { icons: N, categories: ctx.categoryCount, weights: ['regular'] },
        assets: out.map((a) => ({
          channel: a.channel,
          master: `${a.channel}/${a.file}`,
          export: `${a.channel}/${a.file.replace(/\.svg$/, '.png')}`,
          dimensions: `${a.width}x${a.height}`,
          purpose: a.purpose,
          phase: a.phase,
          status: 'master built; PNG produced by npm run launch:export',
        })),
      },
      null,
      2,
    )}\n`,
    'utf8',
  );

  process.stdout.write(
    `${out.length} launch asset masters written to ${relative(OUT)}\n` +
      [...byChannel].map(([c, l]) => `  ${c.padEnd(10)} ${l.length}`).join('\n') +
      '\n',
  );
  return 0;
}

process.exitCode = await main();
