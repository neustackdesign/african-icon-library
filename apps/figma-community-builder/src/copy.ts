/**
 * Public copy used by the generated Figma Community file and listing frames.
 * Counts are derived from the canonical released data rather than written by hand.
 */

import {
  LIBRARY_NAME,
  libraryVersion,
  PLUGIN_MAP_REGIONS,
  PLUGIN_WEIGHTS,
  releasedIcons,
  releasedMaps,
} from './plan';
import { type CountryMap, type Icon } from '@african-icon-library/metadata';

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

export function coverSubtitle(
  icons: readonly Icon[] = releasedIcons,
  maps: readonly CountryMap[] = releasedMaps,
): string {
  const mapPart = maps.length > 0 ? ` · ${maps.length} ${plural(maps.length, 'map')}` : '';
  return `${icons.length} ${plural(icons.length, 'icon')}${mapPart} · 24px grid · MIT`;
}

export function tagline(): string {
  return 'Open-source icons for African everyday life — starting with Nigeria.';
}

export function startHereBlocks(
  icons: readonly Icon[] = releasedIcons,
  maps: readonly CountryMap[] = releasedMaps,
): Block[] {
  return [
    {
      heading: 'What this file is',
      lines: [
        `The Figma home of the ${LIBRARY_NAME}: every released icon and country map as an editable component, generated from the same source as the website, downloads and plugin.`,
        'The repository is the canonical source. A released icon or map should match everywhere the library appears.',
        'This file has three pages: Library (everything, plus the components), Community Listing (the cover and carousel) and Notes & Publishing.',
      ],
    },
    {
      heading: 'What is included',
      lines: [
        `${icons.length} released ${plural(icons.length, 'icon')} across African everyday life, with Nigeria as the starting point.`,
        `Released ${plural(PLUGIN_WEIGHTS.length, 'weight')}: ${list(PLUGIN_WEIGHTS)}.`,
        'Every icon uses a 24 × 24 component frame with live, editable strokes and consistent cap and join treatment.',
        ...(maps.length > 0
          ? [
              `${maps.length} country ${plural(maps.length, 'map')} — a second asset type, not an icon category — grouped by the library’s own ${PLUGIN_MAP_REGIONS.length}-region grouping. Each map component (ail/maps/<country-id>) keeps the country’s real proportions, fitted so its longest side is 24 px, with the same live 1.5 stroke.`,
            ]
          : []),
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
          `This release ships the ${list(PLUGIN_WEIGHTS)} ${plural(PLUGIN_WEIGHTS.length, 'weight')} as its baseline.`,
          'The components keep live strokes so they remain editable in Figma.',
          'Names mirror repository ids so the Community file, plugin and downloadable source remain in correspondence.',
        ],
  };
}

export const NAMES_INTRO: Block = {
  heading: 'Names & cultural notes',
  lines: [
    'Each card records what the icon depicts and the region attached to the referent.',
    'Confirmed local-language names are marked CONFIRMED. Names still awaiting cultural review are visibly marked PENDING rather than presented as settled fact.',
    `If a name or cultural reference is wrong, report it at ${LINKS.issues} or write to ${LINKS.support}.`,
  ],
};

export const PENDING_BADGE = 'PENDING';
export const CONFIRMED_BADGE = 'CONFIRMED';

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
export function honestCounts(
  icons: readonly Icon[] = releasedIcons,
  maps: readonly CountryMap[] = releasedMaps,
): Array<[string, string]> {
  const categoryCount = new Set(icons.map((icon) => icon.category)).size;
  return [
    ['Released icons', `${icons.length}`],
    ['Categories', `${categoryCount}`],
    ...(maps.length > 0 ? [['Country maps', `${maps.length}`] as [string, string]] : []),
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
    title: 'The icon set',
    subtitle: 'The released icons, grouped by category.',
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
    subtitle:
      'Icons and country maps: Community file, plugin, website downloads and open-source files stay in sync.',
  },
];

/** The maps announcement slide; only built when the release contains maps. */
export const MAPS_SLIDE_COPY = {
  title: 'Country maps, in the same line',
  subtitle: 'Outline maps of African countries at their real proportions, as components.',
} as const;

export function mapsSlideSubtitle(maps: readonly CountryMap[] = releasedMaps): string {
  return `${maps.length} outline ${plural(maps.length, 'map')} of African countries — real proportions, live 1.5 stroke, one component each.`;
}

export const MAX_CAROUSEL_SLIDES = 9;

/** The big section headings of the Library and Notes pages. */
export const SECTION_COPY = {
  allIcons: {
    title: 'All Icons',
    subtitle:
      'Every released icon, grouped the way the library presents its categories. Instances, not copies.',
  },
  maps: {
    title: 'Country Maps',
    subtitle:
      'Outline maps of African countries, grouped by the library’s own regional grouping. Instances of the map components, at real proportions.',
  },
  iconComponents: {
    title: 'Components — Icons',
    subtitle: 'The icon set itself. Every icon in this file is an instance of something here.',
  },
  mapComponents: {
    title: 'Components — Maps',
    subtitle:
      'One component per country, named ail/maps/<country-id>. Real proportions, longest side 24 px, live 1.5 stroke.',
  },
  spec: {
    title: 'Drawing & spec guidance',
    subtitle: 'How the library is drawn, so additions extend it rather than start a second system.',
  },
  names: {
    title: 'Names & Cultural Notes',
    subtitle:
      'One card per icon: what it depicts, where the referent is from, and what it is called.',
  },
  mapPolicy: {
    title: 'Maps — cartographic policy',
    subtitle: 'How the country maps treat boundaries and scale.',
  },
  licence: {
    title: 'Licence & Contributions',
    subtitle:
      'What you may do with these assets, and how to tell the project it got something wrong.',
  },
  source: {
    title: 'Source of truth',
    subtitle: 'Where the library really lives.',
  },
  checklist: {
    title: 'Release & publishing checklist',
    subtitle: 'For whoever holds the Figma account.',
  },
} as const;

/** Drawing and spec guidance, with figures taken from the generated data. */
export function specBlocks(): Block[] {
  return [
    {
      heading: 'The drawing system',
      lines: [
        'Every icon is drawn on a 24 × 24 grid inside a 2-unit live area, with a 1.5 stroke, round caps and joins, and no fill.',
        `Released ${plural(PLUGIN_WEIGHTS.length, 'weight')}: ${list(PLUGIN_WEIGHTS)}. A further weight is added only when it is genuinely drawn, never by mechanically changing the stroke width.`,
        'Components keep live, editable strokes: restyle the stroke colour on the instance and resize proportionally; do not outline the strokes.',
        `Full specification — ${LINKS.github}/blob/main/docs/icon-spec.md`,
      ],
    },
    {
      heading: 'Components and names',
      lines: [
        'Icon components are named african-icons/<category-id>/<icon-id>; map components are named ail/maps/<country-id>. Names mirror repository ids.',
        'Icon components are 24 × 24 frames with Clip content off and vectors constrained to Scale. Map components are fitted so their longest side is 24 and their other side keeps the country’s real proportions.',
        'A Weight property exists only where more than one weight is genuinely drawn.',
      ],
    },
  ];
}

export function mapPolicyBlocks(policy: string): Block[] {
  return [
    {
      heading: 'Boundaries',
      lines: [
        policy,
        `Treatment details and sources — ${LINKS.github}/blob/main/docs/maps-cartography.md`,
      ],
    },
    {
      heading: 'Scale and proportions',
      lines: [
        'Every map is drawn at the same longest side, so the maps do not show the countries’ relative size.',
        'Each map keeps its own real proportions: it is never stretched to a square.',
      ],
    },
  ];
}

export function sourceOfTruthBlocks(): Block[] {
  return [
    {
      heading: 'The repository is canonical',
      lines: [
        `Icons, maps and metadata live in ${LINKS.github}. This file is generated from them by the Community File Builder plugin.`,
        'Change the library in the repository and regenerate. Do not edit this file by hand: a manual edit is lost on the next rebuild and would make the file disagree with the website, downloads and plugin.',
      ],
    },
  ];
}

export function publishingChecklist(): Block {
  return {
    heading: 'Before publishing an update',
    lines: [
      '1. Run the Community File Builder with “Wipe and rebuild” in this file. The result must be exactly three pages.',
      '2. Check the counts on the Library page and the Cover against the repository release.',
      '3. Check the Cover is the first frame on the Community Listing page, and that the carousel frames show icons and country maps.',
      '4. Check the component names: african-icons/<category>/<icon> and ail/maps/<country>.',
      '5. Publish the update to the existing Community file, then confirm the live listing shows the new version.',
    ],
  };
}

export function versionLine(icons: readonly Icon[] = releasedIcons): string {
  return `${LIBRARY_NAME} · version ${libraryVersion(icons)} · ${coverSubtitle(icons)}`;
}
