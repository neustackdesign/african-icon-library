# Media kit

Everything a journalist, a newsletter curator or a community organiser needs to write about the
African Icon Library without asking us for anything.

Published in phase 4 (Tue 20 October 2026) as a downloadable folder. Before that it exists here, in
the repository, and gets sent as links rather than attachments.

---

## What is in here

| File                                     | What it is                                                                   |
| ---------------------------------------- | ------------------------------------------------------------------------------ |
| `README.md`                              | this file — contents, licensing and usage rules                               |
| [`boilerplate.md`](boilerplate.md)       | the standard descriptions, at four lengths, plus the founder statement         |
| [`asset-manifest.md`](asset-manifest.md) | every image and video needed, with dimensions and the script that produces it  |
| [`credits.md`](credits.md)               | attribution for everything in the kit, and the record of third-party permissions |

Alongside these, the kit as distributed contains:

| Asset                     | Format                | Source                                                            |
| ------------------------- | --------------------- | ------------------------------------------------------------------- |
| Icon set, full            | SVG, in a zip         | `npm run release:build` → `release/*.zip`                          |
| Contact sheet             | PNG, 2400 × variable  | `npm run preview` → `previews/contact-sheet.html`, rendered        |
| 24 px proof strip         | SVG and PNG           | `npm run preview` → `previews/proof-strip-24.svg`                  |
| Website screenshots       | PNG, 2× retina        | the deployed site, per [`asset-manifest.md`](asset-manifest.md)     |
| Figma plugin screenshots  | PNG, 2× retina        | the real plugin running in Figma desktop                            |
| Grid diagram              | SVG                   | built from the real `talking-drum` asset                            |
| Open Graph image          | PNG, 1200 × 630       | the site's `/opengraph-image` route                                 |

**There is no logo file, because there is no logo.** The project's mark is the wordmark set in the
site's typeface, and the icons themselves. If a publication needs a square avatar, use the `danfo`
glyph, ink on `#FAF9F6`, with no container shape.

---

## Licensing of the kit

**The icons, the metadata and the code are MIT.** Free for commercial use, no attribution required,
including in a publication that criticises the project. See
[`LICENSE`](../../LICENSE).

**The kit's photographs, screenshots and composited launch images are also released under MIT**,
with two exceptions, which are recorded individually in [`credits.md`](credits.md):

1. **Any third-party photograph** (for example the danfo photograph in reel 3) carries the licence
   its photographer granted, which is stated per asset. Do not assume MIT.
2. **Any screenshot containing a third party's product** — a user's interface, a testimonial
   screenshot — is used with that party's specific written permission, for the specific uses
   recorded in `credits.md`. It is not sublicensed to anyone.

The MIT licence **grants no rights in third-party trademarks or regulated national symbols.** No
released icon reproduces either, and none may be added. Figma is a trademark of Figma, Inc.;
references to it are nominative and imply no endorsement.

---

## Usage rules

These are requests, not licence conditions — the licence is MIT and we are not going to police it.
They exist because getting them wrong misleads readers.

### Do

- **Use the drawings at any size**, in any colour, in print or on screen. They are `currentColor`
  in code and behave correctly at 16 px and above.
- **Crop and recolour freely.** That is what the set is for.
- **Quote the boilerplate verbatim** from [`boilerplate.md`](boilerplate.md).
- **Take your own screenshots** of the site or the plugin. Everything on both is real.
- **Check any count against the status page** on the day you publish. It is computed from the
  repository at build time and it is the only figure we will stand behind.

### Do not

- **Do not present the library as covering Africa.** It is Nigeria-first. Every released icon is
  tagged `NG`. Region is a first-class field in the metadata and other countries are the roadmap,
  not the current state.
- **Do not say it has four weights.** It specifies four and draws one, `regular`. The other three
  are undrawn.
- **Do not show a weight picker with `bold`, `thin` or `fill` selected.** They cannot be selected.
  A composited image implying otherwise is a false claim about the product.
- **Do not show any drawing that is not in the released set.** The held drawings appear in no
  generated surface and a test asserts it; a media image must not be the exception. Where the
  audit's rejected work needs illustrating — the three rocks, the held cap — use clearly labelled
  placeholder art.
- **Do not add colour to `nigeria-flag` or `football-jersey`.** They ship as neutral outlines
  deliberately, and some jurisdictions regulate depictions of national symbols.
- **Do not add letters or numerals inside an icon** in a composited image. The library bans type
  inside glyphs and enforces it; a mock-up that breaks the rule teaches readers the wrong thing.
- **Do not imply endorsement by Figma, npm, GitHub, Vercel or any organisation named in the
  materials.**
- **Do not use the kit to imply adoption we do not have.** There is no logo wall, no "trusted by",
  and no usage figures, because we have not measured any worth quoting.

---

## If you need something that is not here

Ask. `icons@neustackstudio.com`

Specifically, we are happy to produce: a specific icon at a specific size, a screen recording of a
particular flow, a higher-resolution grid diagram, or a written answer to a technical question
about the validator. What we will not produce is a rendering of something the library does not
have — a bold weight, an illustration, a local-name search screen — even as an illustration of the
roadmap.

---

## Verifying anything in this kit

Every claim in the boilerplate is checkable:

```sh
git clone https://github.com/neustackdesign/african-icon-library
cd african-icon-library
npm ci
npm run check      # lint, format, validate, drift, types, tests, build
npm run validate   # the icon rules on their own, with --json available
npm run preview    # regenerates the contact sheet and the 24px proof strip
```

The counts come from `packages/metadata/src/data/icons.json` and the `pipeline` export of
`@african-icon-library/metadata`. Nothing in the kit is a number typed by hand.
