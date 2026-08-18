/**
 * Public copy used by the generated Figma Community file and listing frames.
 * Counts are derived from the canonical released data rather than written by hand.
 */

import { LIBRARY_NAME, libraryVersion, PLUGIN_WEIGHTS, releasedIcons } from './plan';
import { type Icon } from '@african-icon-library/metadata';

export const LINKS = {
  website: 'icons.neustackstudio.com',
  github: 'github.com/neustackdesign/african-icon-library',
  issues: 'github.com/neustackdesign/african-icon-library/issues',
  licence: 'github.com/neustackdesign/african-icon-library/blob/main/LICENSE',
  contributing: 'github.com/neustackdesign/african-icon-library/blob/main/CONTRIBUTING.md',
  plugin: 'Figma → Plugins → “African Icon Library”',
  support: 'icons@neustackstudio.com',
} as const;

export interface Block {
  heading: string;
  lines: string[];
}

function list(values: readonly string[]): string {
  if (values.length === 0) return 'none';
  if (values.length === 1) return values[0];
  return `${values.slice(0, -1).join(', ')} and ${values[values.length - 1]}`;
}

function plural(count: number, one: string, many = `${one}s`): string {
  return count === 1 ? one : many;
}

export function coverSubtitle(icons: readonly Icon[] = releasedIcons): string {
  return `${icons.length} ${plural(icons.length, 'icon')} · 24px grid · MIT`;
}

export function tagline(): string {
  return 'Open-source icons for African everyday life — starting with Nigeria.';
}

export function startHereBlocks(icons: readonly Icon[] = releasedIcons): Block[] {
  return [
    {
      heading: 'What this file is',
      lines: [
        'The Figma home of the African Icon Library V2: every released icon as an editable component, generated from the same source as the website, downloads and plugin.',
        'The repository is the canonical source. A released icon should match everywhere the library appears.',
      ],
    },
    {
      heading: 'What is included',
      lines: [
        `${icons.length} released ${plural(icons.length, 'icon')} across African everyday life, with Nigeria as the starting point.`,
        `Released ${plural(PLUGIN_WEIGHTS.length, 'weight')}: ${list(PLUGIN_WEIGHTS)}.`,
        'Every icon uses a 24 × 24 component frame with live, editable strokes and consistent cap and join treatment.',
      ],
    },
    {
      heading: 'How to use it',
      lines: [
        'Use the components directly from this file, or use the companion plugin to search and insert an icon onto another canvas.',
        'Change stroke colour on the instance to match your interface. Resize proportionally; keep the strokes live rather than outlining them.',
        'The icons are drawn for 24 px, hold at 16 px and scale comfortably to 32 and 48 px.',
      ],
    },
    {
      heading: 'Get the files',
      lines: [
        `Website and SVG downloads — ${LINKS.website}`,
        `Open-source repository — ${LINKS.github}`,
        `Figma plugin — ${LINKS.plugin}`,
        `Support — ${LINKS.support}`,
      ],
    },
  ];
}

export function componentsNote(multiWeight: boolean): Block {
  return {
    heading: 'About these components',
    lines: multiWeight
      ? [
          'Icons available in more than one deliberately drawn weight are component sets with a Weight property.',
          'Names mirror repository ids so the Community file, plugin and downloadable source remain in correspondence.',
        ]
      : [
          `V2 ships the ${list(PLUGIN_WEIGHTS)} ${plural(PLUGIN_WEIGHTS.length, 'weight')} as its baseline.`,
          'The components keep live strokes so they remain editable in Figma.',
          'Names mirror repository ids so the Community file, plugin and downloadable source remain in correspondence.',
        ],
  };
}

export const NAMES_INTRO: Block = {
  heading: 'Names & cultural notes',
  lines: [
    'Each card records what the icon depicts and the region attached to the referent.',
    'Local-language names are published here only when they have been confirmed; uncertain names stay out of the public file until reviewed.',
    `If a name or cultural reference is wrong, report it at ${LINKS.issues} or write to ${LINKS.support}.`,
  ],
};

export const PENDING_BADGE = 'pending';
export const CONFIRMED_BADGE = 'confirmed';

export function licenceBlocks(): Block[] {
  return [
    {
      heading: 'Licence',
      lines: [
        'MIT licensed. Free for personal and commercial use, including in closed-source products.',
        `Full licence — ${LINKS.licence}`,
      ],
    },
    {
      heading: 'Attribution',
      lines: [
        'Attribution is not required for normal product use.',
        `Optional credit: “Icons from the ${LIBRARY_NAME} — ${LINKS.website}”.`,
      ],
    },
    {
      heading: 'Corrections',
      lines: [
        `Report a naming, drawing or cultural-reference issue at ${LINKS.issues}, or write to ${LINKS.support}.`,
        'Include the icon id and enough context to understand the correction.',
      ],
    },
    {
      heading: 'Contributing',
      lines: [
        `Contribution guide — ${LINKS.contributing}`,
        'New icons should extend the existing visual system and use grounded cultural references rather than guesses.',
      ],
    },
  ];
}

/** Public facts for the final Community carousel slide. */
export function honestCounts(icons: readonly Icon[] = releasedIcons): Array<[string, string]> {
  const categoryCount = new Set(icons.map((icon) => icon.category)).size;
  return [
    ['Released icons', `${icons.length}`],
    ['Categories', `${categoryCount}`],
    ['Base grid', '24px'],
    ['Released weight', list(PLUGIN_WEIGHTS)],
    ['Licence', 'MIT'],
    ['Source', 'Open source'],
  ];
}

export interface SlideCopy {
  number: string;
  title: string;
  subtitle: string;
}

export const CAROUSEL_COPY: readonly SlideCopy[] = [
  {
    number: '01',
    title: 'The V2 set',
    subtitle: 'The released library, grouped by category.',
  },
  {
    number: '02',
    title: 'Made for interface scale',
    subtitle: 'The same icons at UI size and enlarged so the construction stays visible.',
  },
  {
    number: '03',
    title: 'One 24px system',
    subtitle: 'A shared canvas, live area, keylines and stroke treatment.',
  },
  {
    number: '04',
    title: 'Use them in real products',
    subtitle: 'Editable components shown in familiar interface patterns at 20–24px.',
  },
  {
    number: '05',
    title: 'One library, several ways in',
    subtitle: 'Community file, plugin, website downloads and open-source files stay in sync.',
  },
];

export const MAX_CAROUSEL_SLIDES = 9;

export function versionLine(icons: readonly Icon[] = releasedIcons): string {
  return `${LIBRARY_NAME} · version ${libraryVersion(icons)} · ${coverSubtitle(icons)}`;
}
