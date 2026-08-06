# Reel shot lists

The production companion to
[`../platform-copy/instagram-reel-scripts.md`](../platform-copy/instagram-reel-scripts.md). That
file has the scripts and captions; this one has what to actually capture, in what order, and what
will go wrong.

All reels: **1080 × 1920, 9:16, 30 fps, captions burned in, no sound required.**

**Safe area:** keep everything important inside the middle 1080 × 1420. Instagram's UI covers
roughly 250 px at the top and 250 px at the bottom, and the bottom overlay moves depending on
caption length. Anything within 250 px of an edge will be covered on some surface.

---

## Shared setup

| Item        | Detail                                                                                  |
| ----------- | ----------------------------------------------------------------------------------------- |
| Background  | Paper `#FAF9F6`. Never white.                                                            |
| Ink         | `#16150F`. Accent `#2E7D4F`, once per reel maximum.                                       |
| Type        | The site's typeface. Minimum 48 px at 1080 wide. Captions bottom third, above safe line.  |
| Motion      | Ease in, hold. No spins, no bounces, no zoom-punches.                                     |
| Sound       | Optional and never required. If music is used, its licence is recorded in `../media-kit/credits.md`. |
| Counts      | Substituted from repository state on the day of the render, not the day of the shoot.     |

---

## Reel 1 — "Does it read at 16 pixels?"

**Phase 2 · 20 seconds · the highest-value 20 seconds this project has.**

### Capture list

| #   | Shot                                                                              | Source                                              |
| --- | ----------------------------------------------------------------------------------- | ----------------------------------------------------- |
| 1.1 | `danfo` at 900 px, static, centred on paper                                         | `packages/icons/svg/regular/danfo.svg`, exported      |
| 1.2 | The same glyph scaling 200 → 96 → 48 → 24 → 16 px, centred, no motion blur          | animate the SVG, do not scale a raster                |
| 1.3 | Hold at 16 px for one full second                                                   | same                                                  |
| 1.4 | Whip-scale to 400% so the pixel grid is visible and the glyph is still legible       | render at 16 px, then scale the raster — the pixels are the point here |
| 1.5 | The proof strip scrolling horizontally, every icon at 24 px                          | `previews/proof-strip-24.svg` from `npm run preview`  |
| 1.6 | End card                                                                            | typeset                                               |

### Notes

- **1.2 must be a vector scale, not a raster scale.** A blurry downscale would show the opposite of
  what the reel claims.
- **1.4 must be a raster scale of a 16 px render.** That is the honest way to show what 16 px
  actually looks like.
- If a glyph does not survive 1.4, **stop and file a bug**. That is a real finding and worth more
  than the reel.
- Shoot 1.5 wide enough that at least eight icons are in frame at once.

---

## Reel 2 — "Search, place, done"

**Phase 3 · 25 seconds · screen recording.**

### Capture list

| #   | Shot                                                                                   | Source                                     |
| --- | ---------------------------------------------------------------------------------------- | -------------------------------------------- |
| 2.1 | The demo file with empty icon slots, framed vertically                                   | the prepared Figma demo file                 |
| 2.2 | Plugin opening                                                                           | live capture                                 |
| 2.3 | Typing `dr`, results narrowing, at real speed                                            | live capture                                 |
| 2.4 | Click, icon lands in the selected frame                                                  | live capture                                 |
| 2.5 | The layer tree — frame, then vectors, named from metadata                                | live capture, layer panel legible            |
| 2.6 | Stroke colour change to match the nav text                                               | live capture                                 |
| 2.7 | The manifest's `networkAccess` block, typeset                                            | `apps/figma-plugin/manifest.json`            |

### Notes

- **Recompose for vertical.** A 16:9 Figma recording cropped to 9:16 loses the panel or the canvas.
  Record at 1440 × 900 and build the vertical frame as a composition: canvas on top, plugin panel
  below, both legible.
- **Do not speed-ramp 2.3.** The search is genuinely fast.
- **2.5 is the shot.** If the layer names are not readable at phone size, the reel has not made its
  point. Zoom the layer panel in the composition, not the canvas.
- Do not include the weight picker here — it has its own moment in reel 2's caption and in the
  plugin demo. Cramming it in costs the insertion shot.

---

## Reel 3 — "From photograph to glyph"

**Phase 4 · 30 seconds · the process reel.**

### Capture list

| #   | Shot                                                              | Source                                                                |
| --- | ------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| 3.1 | A photograph of a real danfo, held, no movement                     | **rights-cleared photograph — see below**                              |
| 3.2 | Cross-fade to the empty 24-unit grid with the live area marked      | built from the spec                                                     |
| 3.3 | Time-lapse: body block, windows, wheels, anchors visible            | screen recording of the drawing, or a rebuilt animation from the final asset |
| 3.4 | A fourth level of detail added, then deleted                        | same                                                                    |
| 3.5 | The finished glyph, scaling down to 16 px and back                  | the released asset                                                      |
| 3.6 | The glyph joining the contact sheet, level with its neighbours      | `previews/contact-sheet.html`                                           |

### Notes on 3.1 — read this before scheduling the shoot

**The photograph must be rights-cleared before anything else in this reel is made.** Either
team-shot, or licensed for commercial use with the attribution actually rendered on screen. It goes
in [`../media-kit/credits.md`](../media-kit/credits.md) with its licence and date.

A rights-unclear photograph in a reel for a library whose entire argument is that it does not ship
things it has no rights to is the worst available own goal. If clearance is not certain, **cut
scene 3.1 and open on the empty grid instead.** The reel still works.

### Notes on 3.4

The deleted fourth level of detail should be a real one — something that genuinely came out of the
drawing because it did not read at 24 px. If it is invented for the shot, the caption is a lie
about the process. Check the drawing's history or pick a different icon where the removal is real.

---

## Post-production checklist, every reel

- [ ] Everything important inside the middle 1080 × 1420.
- [ ] Captions burned in, minimum 48 px, legible against paper.
- [ ] Counts substituted from repository state on render day.
- [ ] No drawing that is not in the released set.
- [ ] No weight picker showing a selectable `thin`, `bold` or `fill`.
- [ ] No coloured `nigeria-flag` or `football-jersey`.
- [ ] Any third-party asset recorded in `credits.md`.
- [ ] Alt text written for the post.
- [ ] Watched once on a phone, at arm's length, with the sound off. If any caption cannot be read
      that way, it is too small.
