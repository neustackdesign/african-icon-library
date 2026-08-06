# Figma Community file — listing copy

**Phase 2.** Publish only after the file has passed the pre-publish checklist in
`docs/figma-community-file-spec.md`.

The canonical technical spec for the file itself — page structure, component naming, cover
requirements, carousel plan — lives in
[`docs/figma-community-file-spec.md`](../../docs/figma-community-file-spec.md). This file is the
listing copy in its final, token-substituted form, plus the things a listing needs that the spec
does not cover.

**Before pasting:** substitute the tokens, then count the tagline characters. Figma's tagline limit
is 100.

---

## File name

```
African Icon Library — 32 icons for African life
```

## Tagline (100 characters max)

```
Open-source icons for African life, on one 24px grid. Nigeria first.
```

68 characters, before substitution — the tagline carries no token, so it is safe as written.

## Description

> 32 icons for things global libraries have never drawn — a danfo, a suya skewer, a
> talking drum, a naira note, an agogo, a ludo board.
>
> Every icon is drawn on one 24-pixel grid with a 1.5 stroke, round caps and joins, and a 2-unit
> live area, so they sit level beside one another and beside the rest of your system. Nothing
> carries baked-in type, a brand mark, or a hard-coded colour: every glyph paints with
> `currentColor` in code, and arrives here as a live black stroke you can restyle in one click.
>
> **This set is small on purpose.** It follows an August 2026 audit of an earlier 86-drawing
> library that found no shared grid, no stroke logic, and type and trademarks baked into the
> artwork. Rather than re-ship that, this release contains only what passes every automated check
> — viewBox, bounds, prohibited text, hard-coded colour, element allow-list, metadata completeness
> and weight completeness — and says plainly what has not been drawn yet.
>
> **What you get:** 32 icons in the `regular` weight, across 7
> categories, as components with a variant property ready for weights that do not exist yet.
>
> **What you do not get, yet:** the `thin`, `bold` and `fill` weights are specified and not drawn.
> They will not be faked by changing a stroke width — a real weight redistributes mass and
> re-solves counters, and that is drawing work. The illustration tier has no pieces. No
> local-language name in the library is confirmed yet, so none are shown.
>
> MIT licensed. Free for commercial use, no attribution required.
>
> Source, roadmap and the full audit trail:
> github.com/neustackdesign/african-icon-library

## Tags (up to 12)

```
icons, icon set, african, nigeria, lagos, culture, open source, design system, ui icons, svg, 24px, components
```

## Category

`Icons`

## Creator

`Neustack Design`

## Support contact

`icons@neustackstudio.com`

## Licence shown on the file

MIT — link to `github.com/neustackdesign/african-icon-library/blob/main/LICENSE`

---

## Copy for the pages inside the file

The spec says what each page contains. This is the text that goes on them.

### Page 2 — `Icons`, section header

> **32 icons, one weight, one grid.**
> Grouped by category, in the order they appear in the library's metadata. Component names match
> the icon ids exactly — `african-icons/food-drink/jollof-rice` — so the file, the plugin and the
> npm package all agree.

### Page 3 — `Grid & spec`, header block

> **The rules, shown rather than described.**
>
> 24 × 24 canvas. A 2-unit live area — all geometry inside `x [2, 22]`, `y [2, 22]`, measured on
> true curve bounds so a bulging cubic is caught even when its endpoints are inside. Stroke 1.5,
> round cap, round join. Minimum 1.5 units of counter between parallel strokes, so nothing fills
> in at 16 px.
>
> None of this is a style guide anyone has to remember. It is `npm run validate`, and it runs in
> CI on every asset.

### Page 3 — the size row caption

> **The legibility proof.** Every icon at 16, 24, 32 and 48 px. Drawn for 24, holds at 16. If a
> glyph becomes a smudge here, that is a bug — please report it.

### Page 4 — `Usage`

> **Recolouring.** Select the instance, change the stroke colour. That is the whole story. Figma
> has no `currentColor`, so the components ship with a single black stroke — in code, every paint
> is `currentColor` and inherits your text colour with no edits.
>
> **Sizing.** 16, 24, 32, 48. Drawn for 24, holds at 16.
>
> **Do not** outline the strokes — someone will want a different weight one day and they will need
> live strokes to work with. **Do not** rescale non-uniformly. **Do not** add text inside an icon
> frame; the library bans type inside glyphs and the validator enforces it.
>
> **The `Weight` variant has one value, `Regular`.** That looks odd until you realise it is what
> lets `thin`, `bold` and `fill` be added later without every user re-placing every instance.
>
> **For search and insertion**, use the plugin. It runs offline, has no account, and ranks results
> with the same code as the website.

### Page 5 — `About & roadmap`

> **Where this came from.**
> In August 2026 we audited 86 drawings from an earlier African icon set. It found two visual
> species in one library, no shared grid, no stroke logic, letters and trademarks baked into the
> artwork, five fabric rolls drawn five ways, and 38 files still named `Group-N`. We rebuilt rather
> than repainted, and changed what qualifies for release.
>
> **The counts, exactly.**
> 32 released · 1 drawn but held · 55 in backlog · 3
> merged by the audit · 4 cut by it · 0 illustration-tier pieces · 0 confirmed local-language
> names.
>
> **What is not drawn.**
> `thin`, `bold` and `fill`. No date. They will be drawn, not derived from `regular`.
>
> **The contribution we actually need.**
> Not a drawing. A speaker of Yoruba, Hausa, Igbo or Nigerian Pidgin willing to review a
> 32-row list of proposed local names. Zero are confirmed today, which is why this
> file shows none. `icons@neustackstudio.com`, or open an issue.
>
> **Licence.** MIT. Free for commercial use, no attribution required. It grants no rights in
> third-party trademarks or regulated national symbols; no icon here reproduces either.

---

## Cover text

Per the spec: 1920 × 960, `#FAF9F6` paper, `#16150F` ink, one use of `#2E7D4F`, 120 px safe area.

- **Title:** `African Icon Library`
- **Subtitle:** `32 icons · 24px grid · MIT`

The spec warns that a count on a cover goes stale silently. It is acceptable here on one condition:
**republishing the file regenerates the cover.** If that discipline is not certain, drop the count
and use `24px grid · one weight · MIT` instead.

---

## Comment replies

Community comments arrive in patterns. Pre-written, so the answer is consistent and nobody
improvises a promise.

**"Only 32 icons?"**

> Yes — small on purpose. It follows an audit of 86 earlier drawings that found no shared grid, no
> stroke logic and type baked into the artwork, so this set only contains what passes every
> automated check. The backlog and everything we have not drawn are listed publicly:
> icons.neustackstudio.com/status

**"Can you add bold?"**

> Not by thickening these — a real weight redistributes mass and re-solves counters, and at 2.0
> several of these constructions violate the 1.5-unit counter minimum. It has to be drawn. It is
> on the roadmap without a date, because a date would be made up.

**"Do you have [country]?"**

> Not yet. Nigeria is the first region shipped and region is a first-class field in the metadata,
> so other countries slot in rather than being bolted on. If you want to help define what should
> be in a first pass for your country, open an issue — that conversation is more useful to us than
> a request list.

**"Is this free for commercial use?"**

> Yes. MIT, no attribution required.

**"Can I get PNGs?"**

> Not from us. There is no raster asset anywhere in this product — the earlier set's PNG backlog is
> what this rebuild replaced. Export from Figma at whatever size you need, or use the SVGs.

**"An icon is named wrong."**

> Thank you — that is the most valuable report this project gets, and it is our highest-priority
> bug class. Please open an issue at
> github.com/neustackdesign/african-icon-library/issues. You do not need to be certain.
