# Figma Community file — specification

The Community file is the showroom; the plugin is the distribution. This document specifies the
file so it can be built once, correctly, by whoever has the Figma account.

Nothing here has been published. Publishing is item 4.3 in
[RELEASE_CHECKLIST.md](../RELEASE_CHECKLIST.md).

---

## Publishing metadata

**File name**
`African Icon Library — 16 icons for African life`

**Tagline** (under 100 characters)
`Open-source icons for African life, on one 24px grid. Nigeria first.`

**Description**

> Sixteen icons for things global libraries have never drawn — a danfo, a suya skewer, a talking
> drum, a naira note, an agogo, a ludo board.
>
> Every icon is drawn on one 24-pixel grid with a 1.5 stroke, round caps and joins, and a 2-unit
> live area, so they sit level beside one another and beside the rest of your system. Nothing
> carries baked-in type, a brand mark, or a hard-coded colour: every glyph paints with
> `currentColor` and takes your text colour with no edits.
>
> This set is small on purpose. It follows an audit of an earlier 86-drawing library that found no
> shared grid, no stroke logic, and type and trademarks baked into the artwork. Rather than
> re-ship that, this release contains only what passes every automated check — viewBox, bounds,
> prohibited text, hard-coded colour, element allow-list, metadata completeness and weight
> completeness — and says plainly what has not been drawn yet.
>
> **What you get:** 16 icons in the regular weight, as components with variants ready to swap.
>
> **What you do not get, yet:** the thin, bold and fill weights are specified but not drawn. They
> will not be faked by changing a stroke width — a real weight redistributes mass and re-solves
> counters, and that is drawing work. The illustration tier has no pieces yet.
>
> MIT licensed. Free for commercial use, no attribution required.
>
> Source, roadmap and the full audit trail:
> github.com/neustackdesign/african-icon-library

**Tags** (Figma allows up to 12)
`icons`, `icon set`, `african`, `nigeria`, `lagos`, `culture`, `open source`, `design system`,
`ui icons`, `svg`, `24px`, `components`

**Category**
Icons

**Creator**
Neustack Design

**Support / contact**
`icons@neustackstudio.com`

**Licence shown on the file**
MIT — link to `github.com/neustackdesign/african-icon-library/blob/main/LICENSE`

---

## File structure

One Figma file, five pages, in this order.

### Page 1 — `Cover`

Not published as a page; it exists to hold the thumbnail frame. See "Cover requirements" below.

### Page 2 — `Icons`

The set itself.

- One component per icon, named exactly `african-icons/<category-slug>/<icon-id>` so Figma's
  asset panel nests them by category — for example `african-icons/food-drink/jollof-rice`.
- Each component is a 24 × 24 frame containing the vectors, with `Clip content` **off** and
  constraints set to `Scale` on both axes.
- Strokes: 1.5, round cap, round join, centre alignment. **Do not outline the strokes.** A user
  who wants a different weight needs live strokes to work with.
- Colour: a single solid black stroke. Figma has no `currentColor`; black is the honest
  substitute, and the component's stroke is the one thing users will restyle first.
- A `Weight` variant property with a single value, `Regular`. One value looks odd until you
  realise it is what lets `thin`, `bold` and `fill` be added later without every user re-placing
  every instance.

Layout: an auto-layout grid, 8 columns, 64 px gutters, grouped by category with a section label
above each group. Categories in the order they appear in `packages/metadata/src/data/categories.json`.

### Page 3 — `Grid & spec`

The drawing rules, shown rather than described.

- The 24-unit canvas with the 2-unit live area marked.
- The three keylines: 18 square, 20 circle, 16 × 20 portrait.
- One icon shown on the grid — `talking-drum` — with its anchors visible.
- A row of every icon at 16, 24, 32 and 48 px. This is the legibility proof; it is the single most
  useful page in the file for anyone deciding whether to adopt the set.
- A short note that the file is generated from the repository and that the spec is enforced in CI,
  with the link.

### Page 4 — `Usage`

- Recolouring: select the instance, change the stroke colour. That is the whole story.
- Sizing: 16, 24, 32, 48. A note that the drawings are optimised for 24 and hold to 16.
- What not to do: do not outline strokes, do not rescale non-uniformly, do not add text inside an
  icon frame.
- Pointer to the plugin for search and insertion.

### Page 5 — `About & roadmap`

- Where the set came from: the August 2026 audit, in four sentences.
- The counts, stated exactly: 16 released, 1 held for cultural review, 1 held for redraw, 61 in
  backlog, 3 merged, 4 cut.
- What is not drawn: three weights, the illustration tier.
- How to contribute, and the specific ask for local-name reviewers.
- Licence.

---

## Cover requirements

Figma renders the file thumbnail from a frame named `Cover` — the frame must be the first frame on
the first page.

- **Size:** 1920 × 960 (Figma's 2:1 Community thumbnail ratio). Exported at 2×.
- **Safe area:** keep all text within 120 px of every edge; Community crops the card at several
  aspect ratios.
- **Background:** `#FAF9F6` (the library's paper). Not white — white reads as a default template.
- **Ink:** `#16150F`. Accent `#2E7D4F` used once, not as a wash.
- **Content, in this order of visual weight:**
  1. Six to eight real icons at large scale — `talking-drum`, `danfo`, `suya`, `naira-note`,
     `ludo`, `agogo` — in a single row. Real drawings, not a mock-up.
  2. The name, `African Icon Library`, set large.
  3. One line of subtitle: `16 icons · 24px grid · MIT`.
- **Do not** put a count on the cover that will go stale silently. `16` is fine as long as
  re-publishing updates it; if that feels fragile, drop the number.
- **Do not** show icons that are not in the file. The cover is the first place a false claim would
  land.

Source material: `npm run preview` produces `previews/proof-strip-24.svg`, which is the real
drawings at real proportions and can be pasted straight into Figma.

---

## Carousel plan

Community allows up to five carousel images at 1920 × 960. Order matters — most people see the
first two only.

| #   | Frame                | Content                                                                                                           | Point it makes                                            |
| --- | -------------------- | ----------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| 1   | `Carousel/01-set`    | The full 16-icon grid on paper, category labels visible                                                           | This is what you get, all of it, no scrolling required    |
| 2   | `Carousel/02-24px`   | Every icon at 24 px on one row, then the same row at 400%                                                         | They actually read at UI size — the audit's decisive test |
| 3   | `Carousel/03-grid`   | `talking-drum` on the 24-unit grid with live area and keylines marked                                             | There is a system here, not a folder of drawings          |
| 4   | `Carousel/04-in-use` | Three realistic UI fragments — a nav bar, a food-delivery list row, a payment sheet — using the icons at 20–24 px | Proof they work in a real interface, not just on a grid   |
| 5   | `Carousel/05-honest` | The counts and the roadmap, typeset plainly: released / held / backlog / weights not drawn                        | Sets expectations before download rather than after       |

Frame 5 is unusual for a Community listing and it is deliberate. The alternative is a user
discovering the limits after adopting the set.

---

## Before publishing

- [ ] Every component name matches an id in `packages/metadata/src/data/icons.json`. A mismatch
      breaks the correspondence between the file, the plugin and the npm package.
- [ ] Component count equals the released count. If they differ, the file is stale.
- [ ] No text layers inside any icon frame.
- [ ] No icon from `packages/icons/staging/` is present.
- [ ] Every stroke is live, 1.5, round cap and join.
- [ ] The cover frame is first on the first page and named `Cover`.
- [ ] The description's counts match the repository.
- [ ] The support email exists and is monitored.
