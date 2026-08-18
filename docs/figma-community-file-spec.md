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

## File structure

Use five pages, in this order.

### 1. Cover

One 1920 × 960 frame named `Cover` as the first frame in the file. Keep the thumbnail count-free so it does not become stale. Show the library name, short tagline and 6–8 distinctive released icons.

### 2. Icons

The complete V2 set, grouped into the seven populated categories in canonical metadata order.

- One component per released icon.
- Component names: `african-icons/<category-slug>/<icon-id>`.
- Component frame: 24 × 24, clip content off.
- Preserve live strokes; do not outline them.
- Use one consistent editable stroke colour in Figma.
- Keep `Weight = Regular` as the current variant value so future deliberately drawn weights can extend the component API without replacing instances.

### 3. Grid & spec

Show the 24-unit canvas, live area/keylines and a small number of representative icons on-grid. Include a legibility strip at 16, 24, 32 and 48 px.

### 4. Usage

Keep this practical:

- recolouring;
- resizing;
- using components in product UI;
- link to the website for SVG downloads;
- link to the companion plugin for search/insertion.

### 5. About

A concise project statement, MIT licence, contribution link and source repository. Do not publish audit diagnostics, rejected concepts, internal backlog counts, deployment state or release-operation notes here.

## Cover and carousel

**Cover:** 1920 × 960. Use the library paper/ink visual language already established by the website. Use real released artwork only.

**Suggested carousel:**

1. Full V2 category grid.
2. Icons at real UI size, then enlarged.
3. One representative icon on the 24 px drawing grid.
4. A few icons used in realistic African product-interface contexts.
5. Website, Community file and plugin shown as three ways into the same library.

## Pre-publish integrity checks

- [ ] Component count matches the canonical released count.
- [ ] Every component id exists in the repository metadata.
- [ ] No unreleased/staging icon appears in the file, cover or carousel.
- [ ] Component geometry matches the canonical SVG source after the user's final Figma cleanup.
- [ ] Any geometry change or newly added icon has been promoted back to the repository source before publication.
- [ ] All icon strokes remain live and editable.
- [ ] Cover is the first frame on the first page and named `Cover`.
- [ ] Website and GitHub links are correct.
- [ ] Support email is `icons@neustackstudio.com`.

The decisive rule: **Figma is a publishing surface, not a competing source of truth.** Final visual cleanup may happen there, but the repository must receive those final vectors before V2 is considered released.
