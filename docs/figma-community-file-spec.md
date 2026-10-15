# Figma Community file — V2 specification

The Community file is the design-facing home of the African Icon Library. It must contain the same released set as the website, downloads and plugin — never a separate Figma-only version.

Live Community file:
[figma.com/community/file/1688005719745631513/african-icon-library-v2](https://www.figma.com/community/file/1688005719745631513/african-icon-library-v2).
Each release updates this file; it is never republished as a new one.

## Publishing metadata

**File name**  
`African Icon Library — V2`

**Tagline**  
`Open-source icons for African everyday life, built on one 24px system.`

**Description**

> A free, open-source icon library for African everyday life — starting with Nigeria.
>
> 30 icons across seven categories, including food, transport, culture, commerce, identity,
> fashion and play. Every icon follows the same 24-pixel drawing system and is provided as an
> editable Figma component.
>
> New in v0.3.0: Country Maps — outline maps of all 54 African countries in the same 1.5 stroke,
> grouped by region, each an editable `ail/maps/<id>` component at its real proportions.
>
> Use the Community file as a library, download the SVGs from icons.neustackstudio.com, or use the
> companion Figma plugin to search and place icons and maps directly on your canvas.
>
> AIL follows a documented cartographic treatment for disputed territories. Boundary
> representations do not imply endorsement of territorial claims.
>
> MIT licensed. Free for personal and commercial use.
>
> Source: github.com/neustackdesign/african-icon-library

**Tags**  
`icons`, `icon set`, `maps`, `country maps`, `african`, `nigeria`, `culture`, `open source`,
`design system`, `ui icons`, `svg`, `components`

**Category**  
Icons

**Creator**  
Neustack Design

## Generated file structure

The published Community source file is on Figma's Free plan, which allows **no more than three
pages**. The Community builder therefore generates exactly three, and never creates a fourth:

1. `01 — Library` — one long, navigable page: intro and counts; **All Icons**, grouped visually by
   category group (Identity & State; Fashion & Textiles; Food & Drink; Music, Art & Play; Transport;
   Everyday Life & Commerce); **Country Maps**, grouped by AIL region; and, in labelled sections to
   the right, the canonical **Components — Icons** and **Components — Maps**.
2. `02 — Community Listing` — `Cover` (the first frame), `Community/Cover` and the carousel frames,
   including the country-maps slide.
3. `03 — Notes & Publishing` — drawing and spec guidance, Names & Cultural Notes, the maps'
   cartographic and boundary policy, licence, contributions and corrections, source-of-truth
   guidance and the release and publishing checklist.

Empty metadata categories do not get their own group. Counts and groups are derived from the
generated data, so a release changes what is on the pages, never how many pages there are.

### Component rules

- One component per released icon.
- Component names: `african-icons/<category-slug>/<icon-id>`.
- Component frame: 24 × 24, clip content off.
- Preserve live strokes; do not outline them.
- Use one consistent editable stroke colour in Figma.
- The regular weight is the V2 baseline. Add a Weight property only when a second deliberately drawn weight actually exists.

### Map component rules

- One component per released map, named `ail/maps/<id>`; no text inside the component.
- Longest side 24, the other side at the map's real proportion — geography is never stretched to a square.
- Clip content off; vector constraints SCALE; 1.5 live stroke.
- Map counts on the cover, carousel and Library page are computed from the generated data.

## Cover and carousel

**Cover:** 1920 × 960, first frame of the `02 — Community Listing` page, named `Cover`, showing the current counts (for v0.3.0, `30 icons · 54 maps`). Use real released artwork only and keep the headline/count treatment simple enough to remain legible as a Community thumbnail.

**Carousel:**

1. The full icon set, grouped by category.
2. Icons at real UI size, then enlarged.
3. One representative icon on the 24 px drawing grid.
4. A few icons used in realistic product-interface contexts.
5. Community file, plugin, website downloads and open-source source shown as one connected library.
6. Country maps: every released map, by region, at real proportions.

Do not publish audit diagnostics, rejected concepts, internal backlog counts, deployment state or release-operation notes in the Community file or listing media.

## Pre-publish integrity checks

- [ ] The file has exactly three pages.
- [ ] Component count matches the canonical released count (icons and maps).
- [ ] Every component id exists in the repository metadata.
- [ ] No unreleased/staging icon appears in the file, cover or carousel.
- [ ] Component geometry matches the canonical SVG source after final Figma cleanup.
- [ ] Any geometry change or newly added icon has been promoted back to the repository source before publication.
- [ ] All icon strokes remain live and editable.
- [ ] Cover is the first frame on the first page and named `Cover`.
- [ ] Website and GitHub links are correct.
- [ ] Support email is `icons@neustackstudio.com`.

The decisive rule: **Figma is a publishing surface, not a competing source of truth.** Final visual cleanup may happen there, but the repository must receive those final vectors before V2 is considered released.
