# Boilerplate

The standard descriptions. Copy them verbatim; that is what they are for.

Every one contains a placeholder token. Substitute from repository state on the day of use — see
[`../README.md`](../README.md) for how.

---

## One line (under 60 characters)

```
Open-source icons for African life. Nigeria first.
```

## Tagline (under 100 characters)

```
Open-source icons for African life, on one 24px grid. Nigeria first.
```

## 25 words

```
African Icon Library: 32 MIT-licensed icons for African life — a danfo, a suya skewer,
a talking drum — drawn on one 24-pixel grid.
```

## 50 words

```
The African Icon Library is an open-source set of 32 icons for things global libraries
never drew — a danfo, a suya skewer, a talking drum, a naira note. One 24-pixel grid, one drawn
weight, MIT licensed. Nigeria first. Everything not yet drawn is listed publicly.
```

## 100 words

```
The African Icon Library is an open-source set of 32 icons for African life — a danfo,
a suya skewer, a talking drum, an agogo, a naira note — drawn on one 24-pixel grid with a 1.5
stroke and a 2-unit live area, so they sit level beside the rest of your system. Every glyph paints
with currentColor and carries no text, no brand mark and no hard-coded colour; the rules are
enforced in CI rather than documented and hoped for. The set is small on purpose: it follows an
audit of 86 earlier drawings and releases only what passes. MIT licensed, Nigeria first.
```

## 200 words

```
The African Icon Library is an open-source icon set for African life, maintained by Neustack
Design. It ships 32 icons across 7 categories in one drawn weight,
under the MIT licence, free for commercial use with no attribution required.

The icons are things global libraries had no reason to draw: a danfo, a suya skewer over coals, a
talking drum, an agogo, a ludo board, a naira note. Every one sits on a 24 × 24 canvas with a
2-unit live area, a 1.5 stroke and round caps and joins, and every paint is currentColor, so an
icon inherits the colour of the text around it with no edits.

That consistency is enforced rather than requested: a validator running in CI checks the viewBox,
measures geometry with analytic curve bounds, rejects any text element or hard-coded colour, and
restricts markup to an allow-list.

The library is small deliberately. It follows an August 2026 audit of 86 drawings from an earlier
set — no shared grid, no stroke logic, baked-in type and trademarks, 38 files named Group-N — and
releases only what passes every check. Three of its four specified weights are undrawn, and the
site publishes everything not yet drawn.
```

## Full description

See [`../master-narrative.md`](../master-narrative.md) for the full description and the six
narrative beats.

---

## About Neustack Design

```
Neustack Design is a design studio and the maintainer of the African Icon Library. The library is
open source under the MIT licence and accepts contributions; the project documents a report of a
misnamed or misrepresented cultural referent as its highest-priority bug class.
```

---

## Founder statement

For quoting. One quote is enough; do not add a second, more enthusiastic one.

```
"We started by downloading what already existed. Eighty-six drawings, and we sat with all of them
for a week.

The problem was never that they were ugly. Some of them were lovely. The problem was that they
could not sit next to each other in a toolbar — no shared grid, no stroke logic, letters baked into
the artwork, a couple of trademarks that no library can legally redistribute, and thirty-eight
files still called Group-6, Group-7, Group-37. Three of them were rocks. We could not tell which
rock was which.

We could have renamed everything, normalised the strokes and shipped eighty-six icons. It would
have taken a fortnight and the number would have looked good.

We shipped 32 instead, and wrote down everything we have not drawn.

The part I would want another designer to take from this has nothing to do with Nigeria. It is that
an icon library is a set of promises about consistency, and if you cannot check the promises with a
command, you are not making them."
```

— Neustack Design, maintainer, African Icon Library

### Short pull quotes

```
"We could have renamed everything and shipped eighty-six icons. We shipped 32 instead,
and wrote down everything we have not drawn."
```

```
"Three of them were rocks. We could not tell which rock was which."
```

```
"An icon library is a set of promises about consistency. If you cannot check the promises with a
command, you are not making them."
```

```
"A danfo is not a hard thing to draw. Drawing it so it still belongs beside the other
32 in two years is the hard thing."
```

---

## Standard facts block

For an outlet that wants a fact box rather than prose.

```
Name          African Icon Library
Maintainer    Neustack Design
Licence       MIT — code, metadata and drawings
Released      32 icons across 7 categories
Weights       4 specified, 1 drawn (regular)
Canvas        24 × 24 units, 2-unit live area, 1.5 stroke
Region        Nigeria first; region is a first-class field in the metadata
Origin        An August 2026 audit of 86 drawings from an earlier African icon set
Website       https://icons.neustackstudio.com
Source        https://github.com/neustackdesign/african-icon-library
Contact       icons@neustackstudio.com
```

---

## The limits, stated for reuse

Any piece longer than 200 words should include at least one of these. They are the differentiator,
and a description without one is not describing this library.

```
Three of the four specified weights — thin, bold and fill — are not drawn, and will not be produced
by changing a stroke width.
```

```
1 drawing exists and are held from release, each with a recorded blocker. One is held
because the audit could not identify the object it depicts.
```

```
55 audited concepts have no drawing that meets the specification.
```

```
No local-language name in the library is confirmed, so the website shows none and makes no
local-language claim.
```

```
The illustration tier exists in the architecture and has zero released pieces.
```

---

## Phrases to avoid

Do not use in any description of this project, ours or anyone else's:

- "four weights" — it specifies four and draws one
- "icons for Africa" without "starting with Nigeria"
- "the first African icon library" — it is a rebuild that followed an audit of one
- "culturally authentic" — the checkable claim is the review process, not the adjective
- "trusted by" — no adoption has been measured
- "revolutionary", "game-changing", "empowering", "democratising", "seamless", "curated collection
  of stunning"
