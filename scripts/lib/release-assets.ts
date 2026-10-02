/**
 * Release-asset masters for the Design System v3 release formats.
 *
 * Every frame is composed from the same parts as the website: the design
 * tokens and category colours in `apps/web/lib/brand.ts`, the shared route,
 * spec rows and facts in `apps/web/lib/compositions.ts`, and the released
 * drawings themselves. Nothing here is hand-drawn, so the next release
 * regenerates the whole set from its own data.
 *
 * Grammar (Design System v3 · 08 Release formats):
 * - Marketing frames carry headlines and mono facts only, never paragraphs.
 * - Safe area is 120px at 1920 wide and 84px at 1080 wide (80px on the
 *   1280 GitHub card).
 * - The Community cover must read at card size: wordmark plus ribbon only.
 * - Square fields, 1px rules, no gradients, ink icons on colour.
 *
 * Output is SVG with live text in Geist and Geist Mono, so a master opens
 * editable in Figma. `scripts/export-release-assets.mjs` rasterises them.
 */

import {
  CATEGORY_SYSTEM,
  DARK,
  LIGHT,
  SYSTEM_GROUND,
  categoryColour,
  categoryRank,
  oklchToHex,
  ribbonHeight,
} from '../../apps/web/lib/brand.ts';
import {
  HEADLINE,
  ROUTE,
  ROUTE_FRAME,
  SPEC_ROWS,
  routePoints,
} from '../../apps/web/lib/compositions.ts';

export interface AssetIcon {
  id: string;
  name: string;
  category: string;
  body: string;
}

export interface AssetInput {
  icons: AssetIcon[];
  categoryLabels: Record<string, string>;
  version: string;
  figmaPublished: boolean;
}

export interface ReleaseAsset {
  file: string;
  name: string;
  width: number;
  height: number;
  use: string;
  alt: string;
  svg: string;
}

/* ---------------- tokens for non-CSS renderers ---------------- */

const SANS = "Geist, 'Geist Fallback', Arial, sans-serif";
const MONO = "'Geist Mono', ui-monospace, Menlo, monospace";
/** Geist Mono advances every glyph by 0.6em, so mono widths are exact. */
const MONO_ADVANCE = 0.6;
const SYSTEM = oklchToHex(SYSTEM_GROUND);
const IVORY_RULE = 'rgba(239,237,230,0.22)';

const hex = (categoryId: string) => oklchToHex(categoryColour(categoryId));

function esc(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const r = (value: number) => Math.round(value * 100) / 100;

/* ---------------- primitives ---------------- */

export function frame(width: number, height: number, ground: string, body: string[]): string {
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" ` +
    `viewBox="0 0 ${width} ${height}">` +
    `<rect width="${width}" height="${height}" fill="${ground}"/>` +
    body.join('') +
    `</svg>\n`
  );
}

/** A released drawing at any size, with the library's own stroke settings. */
export function glyph(body: string, x: number, y: number, size: number, colour: string): string {
  return (
    `<g transform="translate(${r(x)} ${r(y)}) scale(${r(size / 24)})" fill="none" stroke="${colour}" ` +
    `stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${body}</g>`
  );
}

interface TextOptions {
  size: number;
  fill: string;
  mono?: boolean;
  weight?: 400 | 500;
  /** Tracking in em. Display type is tight; mono labels are open. */
  tracking?: number;
  anchor?: 'start' | 'middle' | 'end';
  upper?: boolean;
}

export function text(value: string, x: number, y: number, options: TextOptions): string {
  const { size, fill, mono = false, weight = 400, tracking = 0, anchor = 'start', upper } = options;
  const content = upper ? value.toUpperCase() : value;
  return (
    `<text x="${r(x)}" y="${r(y)}" font-family="${mono ? MONO : SANS}" font-size="${size}" ` +
    `font-weight="${weight}" letter-spacing="${r(size * tracking)}" fill="${fill}" ` +
    `text-anchor="${anchor}">${esc(content)}</text>`
  );
}

/** Display headline over several lines: Geist 400, line-height 0.98, tracking −0.05em. */
export function headline(
  lines: string[],
  x: number,
  top: number,
  size: number,
  fill: string,
  { lineHeight = 0.98, tracking = -0.05 } = {},
): string {
  return lines
    .map((line, index) =>
      text(line, x, top + size * 0.8 + index * size * lineHeight, { size, fill, tracking }),
    )
    .join('');
}

/** Width of a mono label, exactly. */
export function monoWidth(value: string, size: number, tracking = 0): number {
  return value.length * size * (MONO_ADVANCE + tracking);
}

/** Mono section label with the 1px tick. */
export function sectionLabel(
  value: string,
  x: number,
  y: number,
  size: number,
  ink: string,
  tick: string,
) {
  return (
    `<rect x="${x}" y="${r(y - size * 1.05)}" width="1" height="${r(size * 1.17)}" fill="${tick}"/>` +
    text(value, x + size, y, { size, fill: ink, mono: true, tracking: 0.06, upper: true })
  );
}

/** Ivory mono tag on ink, as used for route stops and ribbon names. */
export function labelTag(value: string, x: number, y: number, size: number): string {
  const padX = size;
  const padY = size * 0.67;
  const label = value.toUpperCase();
  const width = monoWidth(label, size, 0.04) + padX * 2;
  const height = size * 1.4 + padY * 2;
  return (
    `<rect x="${r(x)}" y="${r(y)}" width="${r(width)}" height="${r(height)}" fill="${DARK.text}" ` +
    `stroke="${DARK.canvas}" stroke-width="1"/>` +
    text(label, x + padX, y + padY + size * 1.05, {
      size,
      fill: DARK.canvas,
      mono: true,
      tracking: 0.04,
    })
  );
}

/** Mono facts joined by middots. */
export function facts(
  items: string[],
  x: number,
  y: number,
  size: number,
  fill: string,
  anchor: 'start' | 'end' = 'start',
) {
  return text(items.join(' · '), x, y, {
    size,
    fill,
    mono: true,
    tracking: 0.06,
    upper: true,
    anchor,
  });
}

/** The wordmark: talking drum plus the library name. */
export function wordmark(
  x: number,
  y: number,
  size: number,
  fill: string,
  icons: Map<string, AssetIcon>,
) {
  const drum = icons.get('talking-drum');
  return (
    (drum ? glyph(drum.body, x, y, size * 1.45, fill) : '') +
    text('African Icon Library', x + size * 2.25, y + size * 1.08, {
      size,
      fill,
      weight: 500,
      tracking: -0.01,
    })
  );
}

/**
 * The ribbon: one bar per released icon in V3 order, rising left to right,
 * category colour as the field, ink icon at the top of each bar.
 */
export function ribbon(
  icons: AssetIcon[],
  x: number,
  y: number,
  width: number,
  height: number,
  {
    iconSize = 24,
    rule = DARK.line as string,
    ground = DARK.canvas as string,
  }: { iconSize?: number; rule?: string; ground?: string } = {},
): string {
  const bar = width / icons.length;
  const size = Math.min(iconSize, bar * 0.62);
  const parts = [`<rect x="${x}" y="${y}" width="${width}" height="${height}" fill="${ground}"/>`];
  icons.forEach((icon, index) => {
    const h = (ribbonHeight(index, icons.length) / 100) * height;
    const bx = x + index * bar;
    const by = y + height - h;
    parts.push(
      `<rect x="${r(bx)}" y="${r(by)}" width="${r(bar)}" height="${r(h)}" fill="${hex(icon.category)}"/>`,
      glyph(icon.body, bx + (bar - size) / 2, by + Math.max(12, size * 0.6), size, DARK.canvas),
    );
  });
  for (let index = 0; index <= icons.length; index += 1) {
    const lx = r(x + index * bar);
    parts.push(
      `<line x1="${lx}" y1="${y}" x2="${lx}" y2="${y + height}" stroke="${rule}" stroke-width="1"/>`,
    );
  }
  parts.push(
    `<line x1="${x}" y1="${y}" x2="${x + width}" y2="${y}" stroke="${rule}" stroke-width="1"/>`,
  );
  return parts.join('');
}

/** A square category field with the 24-unit construction grid and live area. */
export function constructionField(icon: AssetIcon, x: number, y: number, size: number): string {
  const unit = size / 24;
  const grid: string[] = [];
  for (let index = 1; index < 24; index += 1) {
    const at = r(index * unit);
    grid.push(
      `<line x1="${r(x + at)}" y1="${y}" x2="${r(x + at)}" y2="${y + size}"/>`,
      `<line x1="${x}" y1="${r(y + at)}" x2="${x + size}" y2="${r(y + at)}"/>`,
    );
  }
  return (
    `<rect x="${x}" y="${y}" width="${size}" height="${size}" fill="${hex(icon.category)}"/>` +
    `<g stroke="rgba(18,17,13,0.1)" stroke-width="1">${grid.join('')}</g>` +
    `<rect x="${r(x + unit * 2)}" y="${r(y + unit * 2)}" width="${r(unit * 20)}" height="${r(unit * 20)}" ` +
    `fill="none" stroke="rgba(18,17,13,0.35)" stroke-width="1" stroke-dasharray="4 4"/>` +
    glyph(icon.body, x + size * 0.2, y + size * 0.2, size * 0.6, DARK.canvas)
  );
}

/** The specimen card: field plus id, category and stroke facts. */
export function specimenCard(
  icon: AssetIcon,
  position: string,
  categoryLabel: string,
  x: number,
  y: number,
  field: number,
): string {
  const width = field * 2.45;
  const pad = field * 0.13;
  const bx = x + field + pad * 1.4;
  const mono = field * 0.065;
  return (
    `<rect x="${x}" y="${y}" width="${r(width)}" height="${field}" fill="${DARK.canvas}" stroke="${DARK.line}" stroke-width="1"/>` +
    constructionField(icon, x, y, field) +
    text('Specimen', bx, y + pad + mono, {
      size: mono,
      fill: DARK.text3,
      mono: true,
      tracking: 0.06,
      upper: true,
    }) +
    text(position, x + width - pad, y + pad + mono, {
      size: mono,
      fill: DARK.text3,
      mono: true,
      tracking: 0.06,
      anchor: 'end',
    }) +
    text(icon.id, bx, y + field * 0.52, { size: field * 0.1, fill: DARK.text, mono: true }) +
    text(categoryLabel, bx, y + field * 0.66, { size: field * 0.078, fill: DARK.text2 }) +
    text('24px · 1.5 stroke', bx, y + field * 0.79, { size: mono, fill: DARK.text3, mono: true })
  );
}

/** The ordinary-day route, scaled into any frame. */
export function route(
  icons: Map<string, AssetIcon>,
  x: number,
  y: number,
  scale: number,
  rule: string,
) {
  const parts = [
    `<polyline transform="translate(${x} ${y}) scale(${scale})" points="${routePoints()}" fill="none" ` +
      `stroke="${rule}" stroke-width="${r(1.5 / scale)}" stroke-dasharray="${r(6 / scale)} ${r(7 / scale)}"/>`,
  ];
  ROUTE.forEach((stop, index) => {
    const icon = icons.get(stop.id);
    if (!icon) return;
    const sx = x + stop.x * scale;
    const sy = y + (stop.y + ROUTE_FRAME.tag) * scale;
    const side = ROUTE_FRAME.stop * scale;
    const size = 12 * scale;
    // The last stop's tag hangs back over its square instead of past the frame edge.
    const tagWidth = monoWidth(stop.tag, size, 0.04) + size * 2;
    const tagX = index === ROUTE.length - 1 ? sx + side - tagWidth : sx;
    parts.push(
      `<rect x="${r(sx)}" y="${r(sy)}" width="${r(side)}" height="${r(side)}" fill="${hex(icon.category)}"/>`,
      glyph(icon.body, sx + side * 0.27, sy + side * 0.27, side * 0.46, DARK.canvas),
      labelTag(stop.tag, tagX, sy - 16 * scale - 34 * scale, size),
    );
  });
  return parts.join('');
}

/** A hairline grid of icon tiles, with one tile selected in its category field. */
export function tileGrid(
  icons: AssetIcon[],
  x: number,
  y: number,
  columns: number,
  cell: number,
  selectedId: string,
): string {
  const rows = Math.ceil(icons.length / columns);
  const parts = [
    `<rect x="${x}" y="${y}" width="${columns * cell}" height="${rows * cell}" fill="${DARK.canvas}" stroke="${DARK.line}" stroke-width="1"/>`,
  ];
  icons.forEach((icon, index) => {
    const cx = x + (index % columns) * cell;
    const cy = y + Math.floor(index / columns) * cell;
    const selected = icon.id === selectedId;
    if (selected)
      parts.push(
        `<rect x="${cx}" y="${cy}" width="${cell}" height="${cell}" fill="${hex(icon.category)}"/>`,
      );
    const ink = selected ? DARK.canvas : DARK.text;
    const size = cell * 0.27;
    parts.push(
      glyph(icon.body, cx + (cell - size) / 2, cy + cell * 0.26, size, ink),
      text(icon.id, cx + cell / 2, cy + cell * 0.78, {
        size: Math.min(cell * 0.085, (cell * 0.9) / (icon.id.length * MONO_ADVANCE)),
        fill: selected ? DARK.canvas : DARK.text3,
        mono: true,
        anchor: 'middle',
      }),
    );
  });
  for (let column = 1; column < columns; column += 1) {
    parts.push(
      `<line x1="${x + column * cell}" y1="${y}" x2="${x + column * cell}" y2="${y + rows * cell}" stroke="${DARK.line}"/>`,
    );
  }
  for (let row = 1; row < rows; row += 1) {
    parts.push(
      `<line x1="${x}" y1="${y + row * cell}" x2="${x + columns * cell}" y2="${y + row * cell}" stroke="${DARK.line}"/>`,
    );
  }
  return parts.join('');
}

/** The danfo construction plate: ghost stroke at scale plus a hairline keyline. */
export function keylinePlate(
  icon: AssetIcon,
  x: number,
  y: number,
  size: number,
  keyline: string,
): string {
  const unit = size / 24;
  const grid: string[] = [];
  for (let index = 1; index < 24; index += 1) {
    const at = r(index * unit);
    grid.push(
      `<line x1="${r(x + at)}" y1="${y}" x2="${r(x + at)}" y2="${y + size}"/>`,
      `<line x1="${x}" y1="${r(y + at)}" x2="${x + size}" y2="${r(y + at)}"/>`,
    );
  }
  const scale = r(size / 24);
  return (
    `<g stroke="rgba(239,237,230,0.12)" stroke-width="1">${grid.join('')}</g>` +
    `<rect x="${x}" y="${y}" width="${size}" height="${size}" fill="none" stroke="rgba(239,237,230,0.3)" stroke-width="1"/>` +
    `<rect x="${r(x + unit * 2)}" y="${r(y + unit * 2)}" width="${r(unit * 20)}" height="${r(unit * 20)}" fill="none" stroke="${keyline}" stroke-width="1" stroke-dasharray="4 4"/>` +
    `<g transform="translate(${x} ${y}) scale(${scale})" fill="none" stroke="${LIGHT.canvas}" stroke-opacity="0.22" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${icon.body}</g>` +
    `<g transform="translate(${x} ${y}) scale(${scale})" fill="none" stroke="${keyline}" stroke-width="${r(1.25 / scale)}" stroke-linecap="round" stroke-linejoin="round">${icon.body}</g>` +
    text('live area 2–22', x + unit * 2, y + unit * 1.35, {
      size: Math.max(11, unit * 0.5),
      fill: keyline,
      mono: true,
    }) +
    text('24 × 24', x + size - unit * 0.4, y + size - unit * 0.4, {
      size: Math.max(11, unit * 0.5),
      fill: 'rgba(239,237,230,0.7)',
      mono: true,
      anchor: 'end',
    })
  );
}

/* ---------------- the release formats ---------------- */

export function orderIcons<T extends { id: string; category: string }>(icons: T[]): T[] {
  return icons
    .map((icon, index) => ({ icon, index }))
    .sort(
      (a, b) => categoryRank(a.icon.category) - categoryRank(b.icon.category) || a.index - b.index,
    )
    .map(({ icon }) => icon);
}

export function buildReleaseAssets(input: AssetInput): ReleaseAsset[] {
  const icons = orderIcons(input.icons);
  const byId = new Map(icons.map((icon) => [icon.id, icon]));
  const count = icons.length;
  const categoryCount = new Set(icons.map((icon) => icon.category)).size;
  const factLine = [`${count} icons`, `${categoryCount} categories`, '24px grid', 'MIT'];
  const lead = byId.get(CATEGORY_SYSTEM[0].hero) ?? icons[0]!;
  const danfo = byId.get('danfo') ?? icons[0]!;
  const keyline = hex('transport');
  const label = (id: string) => input.categoryLabels[id] ?? id;
  const position = (icon: AssetIcon) =>
    `${String(icons.indexOf(icon) + 1).padStart(2, '0')} / ${count}`;
  const altSet = `the ${count} released icons as a rising ribbon of category-coloured bars`;

  const assets: ReleaseAsset[] = [];
  const add = (asset: Omit<ReleaseAsset, 'svg'>, body: string[], ground: string = DARK.canvas) =>
    assets.push({ ...asset, svg: frame(asset.width, asset.height, ground, body) });

  /* Figma Community cover · 1920 × 960 · wordmark plus ribbon only. */
  add(
    {
      file: 'figma-community-cover-1920x960.svg',
      name: 'Figma Community cover',
      width: 1920,
      height: 960,
      use: 'Figma Community file cover',
      alt: `African Icon Library wordmark above ${altSet}.`,
    },
    [wordmark(120, 120, 56, DARK.text, byId), ribbon(icons, 0, 400, 1920, 560, { iconSize: 36 })],
  );

  /* Carousel 01 · Overview. */
  add(
    {
      file: 'carousel-01-overview-1920x960.svg',
      name: 'Community carousel 01 — Overview',
      width: 1920,
      height: 960,
      use: 'Figma Community carousel, slide 1',
      alt: `“${HEADLINE}” above ${altSet}.`,
    },
    [
      sectionLabel(`African Icon Library · V2`, 120, 150, 18, DARK.text2, DARK.accent),
      headline(
        ['Icons for the things African', 'products actually need.'],
        120,
        196,
        92,
        DARK.text,
      ),
      facts(factLine, 1800, 150, 18, DARK.text3, 'end'),
      ribbon(icons, 0, 600, 1920, 360, { iconSize: 30 }),
    ],
  );

  /* Carousel 02 · Library. */
  add(
    {
      file: 'carousel-02-library-1920x960.svg',
      name: 'Community carousel 02 — Library',
      width: 1920,
      height: 960,
      use: 'Figma Community carousel, slide 2',
      alt: `“${count} icons for African everyday life.” beside a grid of every released icon with its id, ${lead.id} selected.`,
    },
    [
      sectionLabel('Library', 120, 150, 18, DARK.text2, DARK.accent),
      headline([`${count} icons for`, 'African', 'everyday life.'], 120, 196, 96, DARK.text),
      facts([`${categoryCount} categories`, 'regular · 1.5 stroke'], 120, 840, 18, DARK.text3),
      tileGrid(icons, 960, 120, 6, 140, lead.id),
    ],
  );

  /* Carousel 03 · System. */
  add(
    {
      file: 'carousel-03-system-1920x960.svg',
      name: 'Community carousel 03 — System',
      width: 1920,
      height: 960,
      use: 'Figma Community carousel, slide 3',
      alt: '“A smaller, stronger system.” with the drawing rules and the danfo icon on its 24 × 24 construction grid.',
    },
    [
      sectionLabel('The system', 120, 150, 18, LIGHT.canvas, LIGHT.canvas),
      headline(['A smaller,', 'stronger system.'], 120, 196, 96, LIGHT.canvas),
      ...SPEC_ROWS.flatMap(([term, value], index) => {
        const rowY = 520 + index * 64;
        return [
          `<line x1="120" y1="${rowY}" x2="1000" y2="${rowY}" stroke="${IVORY_RULE}"/>`,
          text(term, 120, rowY + 40, { size: 22, fill: 'rgba(239,237,230,0.7)', mono: true }),
          text(value, 340, rowY + 40, { size: 22, fill: LIGHT.canvas, mono: true }),
        ];
      }),
      `<line x1="120" y1="840" x2="1000" y2="840" stroke="${IVORY_RULE}"/>`,
      keylinePlate(danfo, 1160, 120, 640, keyline),
    ],
    SYSTEM,
  );

  /* Carousel 04 · Context. */
  add(
    {
      file: 'carousel-04-context-1920x960.svg',
      name: 'Community carousel 04 — Context',
      width: 1920,
      height: 960,
      use: 'Figma Community carousel, slide 4',
      alt: '“Drawn for real product surfaces.” above an illustrative ordinary-day route: breakfast, commute, market, payment and dinner, each a released icon on its category colour.',
    },
    [
      sectionLabel('In context', 120, 150, 18, DARK.text2, DARK.accent),
      headline(['Drawn for real product surfaces.'], 120, 196, 88, DARK.text),
      facts(
        ['Illustrative', 'released icons at working sizes', 'not customer products'],
        120,
        360,
        16,
        DARK.text3,
      ),
      route(byId, 120, 420, 1680 / ROUTE_FRAME.width, DARK.text3),
    ],
  );

  /* Carousel 05 · One library. */
  {
    const root = { x: 560, y: 360, w: 800, h: 170 };
    const columns = [360, 960, 1560];
    const nodes = [
      { x: columns[0]!, icon: 'jollof-rice', fill: DARK.accent, label: 'Web · SVG' },
      {
        x: columns[1]!,
        icon: 'talking-drum',
        fill: hex('music-art-play'),
        label: `Figma · ${count} components`,
      },
      { x: columns[2]!, icon: 'danfo', fill: hex('transport'), label: 'Source · React' },
    ];
    const strip = icons
      .map((icon, index) =>
        glyph(icon.body, root.x + 40 + index * 24.4, root.y + 108, 18, LIGHT.ink),
      )
      .join('');
    add(
      {
        file: 'carousel-05-one-library-1920x960.svg',
        name: 'Community carousel 05 — One library',
        width: 1920,
        height: 960,
        use: 'Figma Community carousel, slide 5',
        alt: '“Web, Figma or source.” with the canonical release in the repository branching to web SVG downloads, Figma and React source.',
      },
      [
        sectionLabel('Use the library', 120, 150, 18, LIGHT.ink2, LIGHT.ink),
        headline(['Web, Figma or source.'], 120, 196, 88, LIGHT.ink),
        `<rect x="${root.x}" y="${root.y}" width="${root.w}" height="${root.h}" fill="${LIGHT.card}" stroke="${LIGHT.ink}"/>`,
        text(`Canonical release · v${input.version}`, root.x + 40, root.y + 46, {
          size: 15,
          fill: LIGHT.ink,
          mono: true,
          tracking: 0.06,
          upper: true,
        }),
        text('MIT', root.x + root.w - 40, root.y + 46, {
          size: 15,
          fill: LIGHT.ink2,
          mono: true,
          tracking: 0.06,
          anchor: 'end',
        }),
        text('packages/icons/svg/regular', root.x + 40, root.y + 86, {
          size: 20,
          fill: LIGHT.ink,
          mono: true,
        }),
        strip,
        `<line x1="960" y1="${root.y + root.h}" x2="960" y2="${root.y + root.h + 60}" stroke="${LIGHT.ink}"/>`,
        `<line x1="${columns[0]}" y1="${root.y + root.h + 60}" x2="${columns[2]}" y2="${root.y + root.h + 60}" stroke="${LIGHT.ink}"/>`,
        ...nodes.flatMap((node) => [
          `<line x1="${node.x}" y1="${root.y + root.h + 60}" x2="${node.x}" y2="${root.y + root.h + 120}" stroke="${LIGHT.ink}"/>`,
          `<rect x="${node.x - 48}" y="${root.y + root.h + 120}" width="96" height="96" fill="${node.fill}" stroke="${LIGHT.ink}"/>`,
          glyph(byId.get(node.icon)?.body ?? '', node.x - 22, root.y + root.h + 142, 44, LIGHT.ink),
          text(node.label, node.x, root.y + root.h + 270, {
            size: 18,
            fill: LIGHT.ink2,
            mono: true,
            tracking: 0.06,
            upper: true,
            anchor: 'middle',
          }),
        ]),
        input.figmaPublished
          ? ''
          : text('Community publication pending', columns[1]!, root.y + root.h + 304, {
              size: 15,
              fill: LIGHT.ink2,
              mono: true,
              anchor: 'middle',
            }),
      ],
      LIGHT.canvas,
    );
  }

  /* Social landscape · 1200 × 628. */
  add(
    {
      file: 'social-landscape-1200x628.svg',
      name: 'Social landscape',
      width: 1200,
      height: 628,
      use: 'Open Graph, X, LinkedIn',
      alt: `African Icon Library — “${HEADLINE}” above ${altSet}.`,
    },
    [
      wordmark(72, 60, 22, DARK.text, byId),
      facts([`v${input.version}`, `${count} icons`, 'MIT'], 1128, 84, 15, DARK.text3, 'end'),
      headline(['Icons for the things African', 'products actually need.'], 72, 140, 60, DARK.text),
      ribbon(icons, 0, 368, 1200, 260, { iconSize: 22 }),
    ],
  );

  /* Social square · 1080 × 1080. */
  add(
    {
      file: 'social-square-1080x1080.svg',
      name: 'Social square',
      width: 1080,
      height: 1080,
      use: 'Instagram, LinkedIn',
      alt: `“${HEADLINE}” above ${altSet}.`,
    },
    [
      sectionLabel('African Icon Library · V2', 84, 120, 16, DARK.text2, DARK.accent),
      headline(
        ['Icons for the', 'things African', 'products', 'actually need.'],
        84,
        160,
        96,
        DARK.text,
      ),
      ribbon(icons, 0, 640, 1080, 440, { iconSize: 24 }),
    ],
  );

  /* Social portrait · 1080 × 1350. */
  add(
    {
      file: 'social-portrait-1080x1350.svg',
      name: 'Social portrait',
      width: 1080,
      height: 1350,
      use: 'Instagram feed',
      alt: `“${HEADLINE}” with the release facts, above ${altSet}.`,
    },
    [
      sectionLabel('African Icon Library · V2', 84, 120, 16, DARK.text2, DARK.accent),
      headline(
        ['Icons for the', 'things African', 'products', 'actually need.'],
        84,
        160,
        104,
        DARK.text,
      ),
      facts(factLine, 84, 640, 18, DARK.text3),
      ribbon(icons, 0, 790, 1080, 560, { iconSize: 24 }),
    ],
  );

  /* Hero / video poster · 1920 × 1080. */
  add(
    {
      file: 'hero-poster-1920x1080.svg',
      name: 'Hero / video poster',
      width: 1920,
      height: 1080,
      use: 'Slides, video poster',
      alt: `“${HEADLINE}” beside the ${lead.name} specimen on its construction grid, above ${altSet}.`,
    },
    [
      sectionLabel('V2 · Open source', 120, 150, 18, DARK.text2, DARK.accent),
      headline(
        ['Icons for the things', 'African products', 'actually need.'],
        120,
        196,
        104,
        DARK.text,
      ),
      specimenCard(lead, position(lead), label(lead.category), 1180, 196, 250),
      ribbon(icons, 0, 640, 1920, 440, { iconSize: 30 }),
    ],
  );

  /* GitHub social · 1280 × 640 · from the 2:1 master, safe 80. */
  add(
    {
      file: 'github-social-1280x640.svg',
      name: 'GitHub social preview',
      width: 1280,
      height: 640,
      use: 'GitHub repository social preview',
      alt: `African Icon Library — “${HEADLINE}” above ${altSet}.`,
    },
    [
      wordmark(80, 72, 22, DARK.text, byId),
      facts([`v${input.version}`, `${count} icons`, 'MIT'], 1200, 96, 15, DARK.text3, 'end'),
      headline(['Icons for the things African', 'products actually need.'], 80, 148, 64, DARK.text),
      ribbon(icons, 0, 390, 1280, 250, { iconSize: 22 }),
    ],
  );

  return assets;
}

/** The asset table for media/release-assets/README.md. */
export function releaseAssetReadme(assets: ReleaseAsset[], version: string, count: number): string {
  return [
    '# Release assets',
    '',
    `Masters for v${version}, generated by \`npm run media\` from the released set (${count} icons), the`,
    'V3 design tokens in `apps/web/lib/brand.ts` and the shared compositions in',
    '`apps/web/lib/compositions.ts`. Do not edit these by hand; regenerate them.',
    '',
    'The SVGs are the masters: live text in Geist and Geist Mono, so they open editable in Figma.',
    'PNG exports live in `png/` and are rendered by `npm run media:export`, which needs a local',
    'Chromium (see the script header).',
    '',
    '| File | Size | Use |',
    '| --- | --- | --- |',
    ...assets.map(
      (asset) => `| \`${asset.file}\` | ${asset.width} × ${asset.height} | ${asset.use} |`,
    ),
    '',
    '## Alt text',
    '',
    ...assets.map((asset) => `- **${asset.name}** — ${asset.alt}`),
    '',
  ].join('\n');
}
