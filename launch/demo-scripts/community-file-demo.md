# Community file demo — recording script

A 40-second walkthrough of the published Figma Community file. The quietest of the four demos, and
the one that has to make a file feel like a system.

**Records in phase 2, after publication.** The file structure it walks through is specified in
[`docs/figma-community-file-spec.md`](../../docs/figma-community-file-spec.md).

---

## Setup

| Setting     | Value                                                                   |
| ----------- | ------------------------------------------------------------------------- |
| Application | Figma desktop, current version                                            |
| Viewport    | 1440 × 900 at 2×, delivered at 1920 × 1080                                |
| File        | The **published** Community file, duplicated to a local draft first       |
| Theme       | Light. A dark take is optional here; the file is drawn on paper.          |
| Motion      | Real speed. Figma's own page transitions are enough motion.               |
| Audio       | None. Captions burned in.                                                 |

**Duplicate the file before recording.** The recording should show what a user sees after they
click "Open in Figma", which is a duplicate — not the source file with an editable original.

---

## Shot list

### Shot 1 — the duplicate (0:00–0:05)

Start on the Community listing page. Click through to open the file. Land on the `Icons` page.

**Caption:** `Duplicate the file. Everything is yours.`

**Note:** show the actual duplication step. It is the moment the licence becomes concrete.

### Shot 2 — the set (0:05–0:12)

Slow pan across the `Icons` page. Category section labels visible. The whole set fits in one
comfortable pan.

**Caption:** `32 components, grouped by category.`

### Shot 3 — component naming (0:12–0:18)

Open the assets panel. Show the nesting: `african-icons/food-drink/jollof-rice`. Expand two
categories.

**Caption:** `Names match the icon ids exactly. File, plugin and npm package all agree.`

**Note:** this is the shot that says "system" rather than "folder". Make the panel text legible.

### Shot 4 — the variant property (0:18–0:23)

Select a component. In the right panel, show the `Weight` variant with its single value,
`Regular`.

**Caption:** `One weight, with the variant property already in place for the ones we have not
drawn.`

### Shot 5 — recolour (0:23–0:28)

Drag an instance onto the canvas. Change its stroke colour. Then change it again to something
absurd, to make the point that nothing is baked in.

**Caption:** `Live strokes. Change the colour, that is the whole story.`

**Note:** do **not** demonstrate outlining strokes, even to say "don't". Someone will copy the
gesture rather than the caption.

### Shot 6 — the grid page (0:28–0:34)

Navigate to `Grid & spec`. Hold on `talking-drum` on the 24-unit grid with the live area and
keylines marked. Then pan to the size row: every icon at 16, 24, 32 and 48 px.

**Caption:** `The legibility proof. Drawn for 24, holds at 16.`

### Shot 7 — the honest page (0:34–0:38)

Navigate to `About & roadmap`. Hold on the counts block: released, held, backlog, merged, cut,
illustrations, confirmed local names.

**Caption:** `And what is not in the file, stated exactly.`

### Shot 8 — end card (0:38–0:40)

```
icons.neustackstudio.com
MIT · free for commercial use
```

---

## Also capture

- **The `Usage` page**, scrolling. Good source for a still about recolouring.
- **An instance dropped into a realistic UI fragment** at 20–24 px, beside icons from a general
  library, showing they sit level. This is the single most persuasive still for a designer and it
  belongs in the Community carousel too.
- **The cover frame**, for the listing image.

---

## What must not appear

- Any component whose name does not match a released icon id. If one appears, the file is stale and
  the recording stops until it is rebuilt.
- Any icon from `packages/icons/staging/`.
- A component with outlined strokes.
- A text layer inside an icon frame.
- A count anywhere on screen that does not match the repository that day.
- The original source file rather than a duplicate.

## Editing notes

- **Let Figma's own page transitions carry the cuts.** Do not add any.
- **Hold shots 3, 6 and 7.** They carry the three claims: naming agreement, legibility, honesty.
- **40 seconds total.** If over, trim shot 1 and shot 5. Never shot 6 or 7.
- **Caption style matches the other demos:** ink on a paper-coloured bar, bottom third, minimum
  28 px at 1080p.
