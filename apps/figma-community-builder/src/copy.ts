/**
 * Every word the Community file contains.
 *
 * Kept apart from the layout so a wording change never risks a geometry change,
 * and so the claims the file makes can be read in one place and checked against
 * the repository. Counts are interpolated from the bundled data — no sentence
 * here states a number it does not compute.
 *
 * No absolute URL appears in this module. `build.ts` refuses to ship a bundle
 * containing one, so addresses are written the way the repository's own docs
 * write them: bare domains, which a reader can copy.
 */

import {
  LIBRARY_NAME,
  libraryVersion,
  PLUGIN_WEIGHTS,
  releasedIcons,
  undrawnWeights,
} from './plan';
import { pipeline, type Icon } from '@african-icon-library/metadata';

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

/** `16 icons · 24px grid · MIT` — the cover's one line of subtitle. */
export function coverSubtitle(icons: readonly Icon[] = releasedIcons): string {
  return `${icons.length} ${plural(icons.length, 'icon')} · 24px grid · MIT`;
}

export function tagline(): string {
  return 'Open-source icons for African life, on one 24px grid. Nigeria first.';
}

/* ------------------------------------------------------------------ *
 * 00 — Start Here
 * ------------------------------------------------------------------ */

export function startHereBlocks(icons: readonly Icon[] = releasedIcons): Block[] {
  const undrawn = undrawnWeights();
  const hasIllustrations = icons.some((icon) => icon.tier === 'illustration');

  return [
    {
      heading: 'What this file is',
      lines: [
        'The showroom for the African Icon Library: every released icon, as a component, with the names and cultural notes behind them.',
        'It is generated from the repository, not drawn here. If this file and the repository ever disagree, the repository is right.',
      ],
    },
    {
      heading: 'What is included',
      lines: [
        `${icons.length} released ${plural(icons.length, 'icon')}, each one a component named african-icons/<category>/<icon-id>.`,
        `Drawn ${plural(PLUGIN_WEIGHTS.length, 'weight')}: ${list(PLUGIN_WEIGHTS)}.`,
        'Every icon is a 24 × 24 frame with live strokes at 1.5, round cap and join. Clip content is off and the vectors scale with the frame.',
        'Everything on the icon pages is an instance. Detach nothing — swap the component later and every instance follows.',
      ],
    },
    {
      heading: 'What is not included, yet',
      lines: [
        undrawn.length > 0
          ? `The ${list(undrawn)} ${plural(undrawn.length, 'weight')} ${plural(undrawn.length, 'is', 'are')} specified but not drawn. ${plural(undrawn.length, 'It is', 'They are')} absent from this file rather than faked by changing a stroke width — a real weight redistributes mass and re-solves counters, and that is drawing work.`
          : 'Every specified weight is drawn.',
        hasIllustrations
          ? 'The illustration tier is present.'
          : 'The illustration tier has no pieces yet.',
        `Beyond the released set the repository holds ${pipeline.heldForCulturalReview + pipeline.heldForIconDesign} drawn ${plural(pipeline.heldForCulturalReview + pipeline.heldForIconDesign, 'concept')} that cannot ship — ${pipeline.heldForCulturalReview} awaiting cultural review, ${pipeline.heldForIconDesign} awaiting redraw — and ${pipeline.backlogConcepts} audited concepts with no drawing yet. None of them appear in this file.`,
        'Those pipeline counts come from the repository’s audit summary. The released count above is counted from the icons in this file.',
      ],
    },
    {
      heading: 'How to recolour',
      lines: [
        'Select the instance and change its stroke colour. That is the whole story.',
        'The drawings paint with currentColor on disk. Figma has no such keyword, so the components carry an explicit black stroke — restyling it is expected, not a workaround.',
        'Do not outline the strokes. A user who wants a different weight needs live strokes to work with.',
        'Do not rescale non-uniformly, and do not add text inside an icon frame.',
      ],
    },
    {
      heading: 'Sizes',
      lines: [
        'Drawn for 24. Holds at 16. Comfortable at 32 and 48.',
        'Page 01 shows the whole set at 24 so you can judge that for yourself before adopting it.',
      ],
    },
    {
      heading: 'Where else this lives',
      lines: [
        `Website — ${LINKS.website}`,
        `Source, roadmap and the full audit trail — ${LINKS.github}`,
        `Figma plugin, for search and insertion — ${LINKS.plugin}`,
        `Support — ${LINKS.support}`,
      ],
    },
  ];
}

/* ------------------------------------------------------------------ *
 * Components page
 * ------------------------------------------------------------------ */

/**
 * The note that sits above the components.
 *
 * The single-weight case is called out explicitly: a lone `Weight=Regular`
 * variant would imply the other three exist somewhere, which they do not.
 */
export function componentsNote(multiWeight: boolean): Block {
  const undrawn = undrawnWeights();
  return {
    heading: 'About these components',
    lines: multiWeight
      ? [
          'Icons drawn in more than one weight are component sets with a Weight property. Icons drawn in one weight are plain components — no property, because there is nothing to choose between.',
          'Instances stay bound either way. When a weight is added later, the component gains a variant and your instances keep working.',
        ]
      : [
          `Only the ${list(PLUGIN_WEIGHTS)} ${plural(PLUGIN_WEIGHTS.length, 'weight')} is drawn, so these are plain components with no Weight property. A one-value variant property would imply the other weights exist somewhere in this file. They do not.`,
          undrawn.length > 0
            ? `When ${list(undrawn)} are drawn, these same components gain a Weight property and every instance you have already placed keeps working.`
            : 'A Weight property will be added when a second weight is drawn.',
          'Names match ids in the repository exactly, so the file, the plugin and the npm package stay in correspondence.',
        ],
  };
}

/* ------------------------------------------------------------------ *
 * Names & cultural notes
 * ------------------------------------------------------------------ */

export const NAMES_INTRO: Block = {
  heading: 'Names & cultural notes',
  lines: [
    'What each icon depicts, where the referent is from, and what it is called in a local language where that is known.',
    'A local name is shown only with its review state attached. Confirmed means a speaker of the language confirmed it. Pending means nobody has yet — it is recorded so it can be searched and corrected, and it is not an authoritative claim.',
    `If a name here is wrong, that is the highest-priority bug this project has. Report it at ${LINKS.issues} — you do not have to be sure.`,
  ],
};

export const PENDING_BADGE = 'PENDING — unconfirmed';
export const CONFIRMED_BADGE = 'confirmed';

/* ------------------------------------------------------------------ *
 * 10 — Licence & Contributions
 * ------------------------------------------------------------------ */

export function licenceBlocks(): Block[] {
  return [
    {
      heading: 'Licence',
      lines: [
        'MIT. Free for commercial and personal use, in closed-source products, with no fee.',
        'You may use, copy, modify, merge, publish, distribute, sublicense and sell copies of the icons.',
        'The only condition MIT imposes is that the licence text travels with substantial copies of the source. Using an icon in an interface is not that.',
        `Full text — ${LINKS.licence}`,
      ],
    },
    {
      heading: 'Attribution',
      lines: [
        'Not required. Genuinely.',
        `If you would like to credit the set anyway, this is the line: “Icons from the ${LIBRARY_NAME} — ${LINKS.website}”.`,
        'Do not imply the project endorses your product, and do not present the icons as your own original drawings when redistributing the set itself.',
      ],
    },
    {
      heading: 'A name here is wrong. What do I do?',
      lines: [
        `Open an issue at ${LINKS.issues}, or write to ${LINKS.support}.`,
        'Say which icon id, what is wrong, and — if you know it — what the right name is and what language it is in.',
        'A misnamed or misrepresented cultural referent is treated as the highest-priority bug class in this project, ahead of any drawing or tooling work.',
        'You do not need to be certain. A flagged name is reviewed; an unflagged wrong name ships.',
      ],
    },
    {
      heading: 'Contributing',
      lines: [
        `How to propose a concept, a drawing or a correction — ${LINKS.contributing}`,
        'The standing ask is local-name reviewers. Every pending name on page 09 is a question waiting for someone who speaks the language.',
        'Drawings are checked in CI against the icon spec — viewBox, bounds, prohibited text, hard-coded colour, element allow-list, metadata completeness, weight completeness — so a contribution either passes or is told exactly why it does not.',
      ],
    },
    {
      heading: 'Provenance',
      lines: [
        'This set follows an audit of an earlier 86-drawing library that found no shared grid, no stroke logic, and type and trademarks baked into the artwork.',
        `Of those, ${pipeline.mergedByAudit} were merged into other concepts and ${pipeline.droppedByAudit} were cut. What ships here is what passes every automated check.`,
        `The audit trail is public — ${LINKS.github}`,
      ],
    },
  ];
}

/* ------------------------------------------------------------------ *
 * Community listing frames
 * ------------------------------------------------------------------ */

/** The plainly-typeset counts that carousel slide 05 exists to show. */
export function honestCounts(icons: readonly Icon[] = releasedIcons): Array<[string, string]> {
  const undrawn = undrawnWeights();
  return [
    ['Released', `${icons.length}`],
    ['Held for cultural review', `${pipeline.heldForCulturalReview}`],
    ['Held for redraw', `${pipeline.heldForIconDesign}`],
    ['Backlog concepts', `${pipeline.backlogConcepts}`],
    ['Merged by the audit', `${pipeline.mergedByAudit}`],
    ['Cut by the audit', `${pipeline.droppedByAudit}`],
    ['Weights drawn', list(PLUGIN_WEIGHTS)],
    ['Weights specified, not drawn', list(undrawn)],
    [
      'Illustration tier',
      icons.some((icon) => icon.tier === 'illustration') ? 'present' : 'nothing yet',
    ],
  ];
}

export interface SlideCopy {
  /** Frame name suffix, e.g. `01`. */
  number: string;
  title: string;
  subtitle: string;
}

export const CAROUSEL_COPY: readonly SlideCopy[] = [
  {
    number: '01',
    title: 'The whole set',
    subtitle: 'Everything in the file, grouped by category. No scrolling required.',
  },
  {
    number: '02',
    title: 'They read at 24px',
    subtitle: 'The same row at UI size and at 400%. This is the test the audit failed.',
  },
  {
    number: '03',
    title: 'One grid, one stroke',
    subtitle:
      '24-unit canvas, 2-unit live area, keylines at 18 square, 20 circle, 16 × 20 portrait.',
  },
  {
    number: '04',
    title: 'In an actual interface',
    subtitle: 'A nav bar, a delivery list row and a payment sheet, at 20–24px.',
  },
  {
    number: '05',
    title: 'What is not drawn yet',
    subtitle: 'Stated before you download rather than discovered after you adopt.',
  },
];

/** Figma allows nine carousel images; the plan only fills the ones it can earn. */
export const MAX_CAROUSEL_SLIDES = 9;

export function versionLine(icons: readonly Icon[] = releasedIcons): string {
  return `${LIBRARY_NAME} · version ${libraryVersion(icons)} · ${coverSubtitle(icons)}`;
}
