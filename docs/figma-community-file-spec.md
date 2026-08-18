# Figma Community file — V2 specification

The Community file is the design-facing home of the African Icon Library. It must contain the same released set as the website, downloads and plugin — never a separate Figma-only version.

## Publishing metadata

**File name**  
`African Icon Library — V2`

**Tagline**  
`Open-source icons for African everyday life, built on one 24px system.`

**Description**

> A free, open-source icon library for African everyday life — starting with Nigeria.
>
> V2 contains 30 icons across seven categories, including food, transport, culture, commerce,
> identity, fashion and play. Every icon follows the same 24-pixel drawing system and is provided
> as an editable Figma component.
>
> Use the Community file as a library, download the SVGs from icons.neustackstudio.com, or use the
> companion Figma plugin to search and place icons directly on your canvas.
>
> MIT licensed. Free for personal and commercial use.
>
> Source: github.com/neustackdesign/african-icon-library

**Tags**  
`icons`, `icon set`, `african`, `nigeria`, `culture`, `open source`, `design system`, `ui icons`,
`svg`, `24px`, `components`, `vector`

**Category**  
Icons

**Creator**  
Neustack Design

## Generated file structure

The Community builder currently creates a deliberately navigable file rather than one enormous icon page:

1. `00 — Start Here` — cover, public intro and Community listing frames.
2. `01 — All Icons` — complete released set grouped by category.
3. Populated category pages — Identity & State; Fashion & Textiles; Food & Drink; Music, Art & Play; Transport; Everyday Life & Commerce.
4. `Components` — the canonical editable components used by the other pages.
5. `Names & Cultural Notes` — public descriptions and confirmed naming context.
6. `Licence & Contributions` — licence, corrections and contribution routes.

Empty metadata categories do not get their own page. Page numbering closes automatically around whatever is actually released.

### Component rules

- One component per released icon.
- Component names: `african-icons/<category-slug>/<icon-id>`.
- Component frame: 24 × 24, clip content off.
- Preserve live strokes; do not outline them.
- Use one consistent editable stroke colour in Figma.
- The regular weight is the V2 baseline. Add a Weight property only when a second deliberately drawn weight actually exists.

## Cover and carousel

**Cover:** 1920 × 960, first frame of the first page, named `Cover`. Use real released artwork only and keep the headline/count treatment simple enough to remain legible as a Community thumbnail.

**Carousel:**

1. Full V2 category grid.
2. Icons at real UI size, then enlarged.
3. One representative icon on the 24 px drawing grid.
4. A few icons used in realistic product-interface contexts.
5. Community file, plugin, website downloads and open-source source shown as one connected library.

Do not publish audit diagnostics, rejected concepts, internal backlog counts, deployment state or release-operation notes in the Community file or listing media.

## Pre-publish integrity checks

- [ ] Component count matches the canonical released count.
- [ ] Every component id exists in the repository metadata.
- [ ] No unreleased/staging icon appears in the file, cover or carousel.
- [ ] Component geometry matches the canonical SVG source after final Figma cleanup.
- [ ] Any geometry change or newly added icon has been promoted back to the repository source before publication.
- [ ] All icon strokes remain live and editable.
- [ ] Cover is the first frame on the first page and named `Cover`.
- [ ] Website and GitHub links are correct.
- [ ] Support email is `icons@neustackstudio.com`.

The decisive rule: **Figma is a publishing surface, not a competing source of truth.** Final visual cleanup may happen there, but the repository must receive those final vectors before V2 is considered released.
