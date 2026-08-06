# Social assets — specification

Every social image the launch needs, with dimensions, safe areas and content rules, and the
repository script that produces its source art.

**The rule that governs all of them:** no social image is drawn from an idea of what the library
looks like. Every glyph in every image is exported from a released asset in
`packages/icons/svg/regular/`, and every screenshot is of the real product. A composited mock-up
that shows a bold weight, or an icon that does not exist, is a false claim about the product — and
this project's whole position is that it does not make those.

---

## Where the source art comes from

| Source art                | Command                 | Output                                                        |
| ------------------------- | ----------------------- | --------------------------------------------------------------- |
| Contact sheet, full set   | `npm run preview`       | `previews/contact-sheet.html` — render at 2× and export         |
| 24 px proof strip         | `npm run preview`       | `previews/proof-strip-24.svg` — real drawings, real proportions |
| Individual glyphs         | —                       | export directly from `packages/icons/svg/regular/<id>.svg`      |
| Grid diagram              | —                       | overlay the 24-unit grid on the real `talking-drum.svg`          |
| Open Graph image          | `npm run build`         | the site's `/opengraph-image` route                              |
| Release checksums, sizes  | `npm run release:build` | `release/manifest.json`                                          |

`previews/proof-strip-24.svg` is the single most reusable asset in this list. It can be pasted
straight into Figma and is the real drawings at real proportions.

---

## Palette and type

| Token   | Value     | Use                                                                    |
| ------- | --------- | ------------------------------------------------------------------------ |
| Paper   | `#FAF9F6` | every background. **Never white** — white reads as an unstyled default.  |
| Ink     | `#16150F` | glyphs, headlines, body                                                 |
| Accent  | `#2E7D4F` | once per composition. A live-area marker, a struck-through rule, a rule under a headline. Never a wash. |

**Type:** the site's typeface, one family per image. Minimum body sizes are given per format below;
they are minimums, not targets.

**Glyph rendering:** ink on paper, live strokes, 1.5 at 24 units scaled proportionally. Never
outlined, never filled, never with a drop shadow, never inside a rounded-square container. The
drawings are not app icons.

---

## Formats

### LinkedIn post image — 1200 × 627

**Safe area:** 60 px on every edge. LinkedIn crops to roughly 1.91:1 in feed and slightly tighter
on mobile.

**Minimum type:** 40 px headline, 28 px body.

**Content rules:**

- One idea. If the image needs two headlines, it is two images or a carousel.
- Either a glyph composition **or** a screenshot. Not both.
- If a count appears, it was substituted from repository state that day.

**Variants needed:** three, one per phase — technical preview (the four glyphs), website live (the
status page screenshot), plugin live (the weight picker with three weights struck through).

### LinkedIn carousel — 1200 × 1200 per page, exported as PDF

**Safe area:** 100 px on every edge. LinkedIn's page-number chrome sits bottom-right and eats about
80 px.

**Minimum type:** 72 px headline, 32 px body.

**Content rules:**

- 10 pages maximum. Script in
  [`../platform-copy/linkedin-carousel-script.md`](../platform-copy/linkedin-carousel-script.md).
- One idea per page, under 25 words of body text.
- At least one real glyph visible on every page that is not a pure data page.
- Alt text per page, in the document description. LinkedIn does not read PDF page content to screen
  readers.

### X post image — 1600 × 900

**Safe area:** 80 px on every edge. X crops to 16:9 in timeline and shows more on click.

**Minimum type:** 44 px headline, 30 px body.

**Content rules:**

- Legible at 400 px wide. That is roughly how it appears in a crowded timeline.
- Four images maximum per post, and fewer is better — a thread with three good images travels
  further than one with nine.
- Alt text on every image, always.

**Needed for:** thread posts 1, 5, 9 and 11 in
[`../platform-copy/x-launch-thread.md`](../platform-copy/x-launch-thread.md), plus the standalone
posts marked with an image in
[`../platform-copy/x-short-posts.md`](../platform-copy/x-short-posts.md).

### Instagram carousel — 1080 × 1350 (4:5)

**Safe area:** 120 px on every edge. Instagram's UI overlays the bottom on several surfaces and the
overlay height varies with caption length.

**Minimum type:** 72 px headline, 40 px body.

**Content rules:**

- 10 slides maximum; both current scripts use fewer.
- The honest slide — counts of what is not drawn — is mandatory and does not go last. Put it at
  position 7 of 8 so people reach it.
- Alt text per slide, written by a person, in the post's accessibility settings.

### Instagram reel and story — 1080 × 1920 (9:16)

**Safe area:** middle 1080 × 1420. Roughly 250 px is covered top and bottom.

**Minimum type:** 48 px for burned-in captions.

**Content rules:** see [`../demo-scripts/reel-shot-lists.md`](../demo-scripts/reel-shot-lists.md).

### Figma Community cover and carousel — 1920 × 960 (2:1)

**Safe area:** 120 px on every edge — Community crops the card at several ratios.

Specified in full in
[`docs/figma-community-file-spec.md`](../../docs/figma-community-file-spec.md) and
[`docs/figma-plugin-publishing.md`](../../docs/figma-plugin-publishing.md). Those are the source of
truth; do not re-specify them here.

### Open Graph and Twitter card — 1200 × 630

Generated by the site at `/opengraph-image` and `/twitter-image`, built from the real drawings.
**Do not hand-make these.** If they need to change, change the route.

### Avatar — 1024 × 1024

The `danfo` glyph, ink on paper, centred, with generous margin and **no container shape**. Same
avatar everywhere. There is no logo; the wordmark and the drawings are the identity.

---

## Content rules that apply to every social image

**Never:**

- Show a weight picker with `thin`, `bold` or `fill` selected, or any composition implying those
  weights exist.
- Show a drawing that is not in the released set. The held drawings appear in no generated surface
  and a test asserts it; a social image is not the exception. Where rejected work needs
  illustrating — the audit's three rocks, the held cap — use clearly labelled placeholder art.
- Add colour to `nigeria-flag` or `football-jersey`. They ship as neutral outlines on purpose.
- Put letters or numerals inside an icon frame in a mock-up. The library bans type inside glyphs
  and enforces it.
- Post a count that was not substituted from repository state that morning.
- Use white as a background.
- Use a stock photograph of "Africa".
- Use a drop shadow, a gradient, a glow or a bevel on a glyph.

**Always:**

- Alt text, written by a person, on every image on every platform that supports it.
- The limits present somewhere in the set — an image sequence that only shows the good parts is
  off-message for this project specifically.
- Real product screenshots, at the current version, retaken after any visual change.

---

## Accessibility

- **Contrast:** ink on paper is roughly 16:1. Any accent-on-paper text must be checked; `#2E7D4F`
  on `#FAF9F6` passes for large text but not reliably for small body copy. Use the accent for
  marks and rules, not for text.
- **Never signal by colour alone.** A struck-through weight needs the strike; a comparison needs
  labels, not just left/right position.
- **Minimum type sizes above are minimums.** Read every image on a phone at arm's length before it
  goes out.
- **Motion:** no strobing, no rapid flashing, no fast parallax.

---

## Naming and storage

```
launch-assets/
  <platform>/
    <phase>-<slug>-<width>x<height>.<ext>

e.g. linkedin/p2-status-page-1200x627.png
     instagram/p2-carousel-01-danfo-1080x1350.png
     x/p4-thread-01-four-glyphs-1600x900.png
```

Keep the layered source files alongside the exports. Every image will need its count re-substituted
at least once, and rebuilding from scratch to change one digit is how stale numbers end up shipping.
