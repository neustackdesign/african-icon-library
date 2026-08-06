# Neustack Design — project page copy

For the studio's own site, as a case study. Longer and more reflective than the launch copy,
because the audience is people evaluating the studio, not people looking for icons.

Publishes in phase 1. It is the one piece of launch copy that works before the icon website is
live, because it is about how the work was done rather than a place to download something.

---

## Page title

```
African Icon Library
```

## Subtitle

```
An open-source icon system for African life. Nigeria first, MIT licensed, and honest about its own
backlog.
```

## Meta description (155 characters max)

```
How we audited 86 African icon drawings, found no shared grid, and rebuilt the library from scratch — releasing 32 icons instead of 86.
```

_146 characters before substitution. Recount after._

## Project metadata block

| Field   | Value                                                                     |
| ------- | ------------------------------------------------------------------------- |
| Project | African Icon Library                                                      |
| Role    | Design, engineering and maintenance                                       |
| Type    | Open source                                                               |
| Licence | MIT                                                                       |
| Started | August 2026                                                               |
| Status  | Active. `0.2.0` released; the set and the roadmap are both public.  |
| Links   | icons.neustackstudio.com · github.com/neustackdesign/african-icon-library |

---

## The page

### The brief we gave ourselves

Nigerian products keep redrawing the same objects. A danfo. A suya skewer. A talking drum. A naira
note. Global icon libraries never drew them — reasonably, since they cover the interface vocabulary
of the places their contributors live — so the objects get approximated, one deadline at a time,
and the work never accumulates anywhere.

We wanted a set that a Nigerian product team could adopt on a Tuesday afternoon and still trust in
two years.

### We started by downloading what already existed

Eighty-six drawings, from an earlier African icon set. We spent a week with all of them.

The findings were not close calls:

- **Two visual species in one library.** No shared grid, so the icons could not sit next to each
  other in a toolbar without one of them looking wrong.
- **No stroke logic.** Weight varied per drawing. A row of them read like a row of different fonts.
- **Type baked into the artwork.** Letters and numerals inside the SVG. Illegible at 16 px,
  impossible to localise, and dirt when scaled down.
- **Trademarks and trade dress.** Things a redistributable library cannot ship at all, in any
  licence.
- **Duplicate concepts.** Five fabric rolls drawn five ways. Three snack wrappers. Four bridges.
  Three rocks nobody could tell apart — and the audit could not say which was Olumo, which was Zuma
  and which was Aso.
- **38 files still named `Group-N`.** `Group-6`. `Group-7`. `Group-37`. Not an inconsistent naming
  convention; the absence of one.

And a detail that sums it up: the "SVG sources" archive turned out to contain PNG renders. There
were 18 actual vector drawings in the whole inheritance.

### The decision that made the project

We could have fixed the top layer — rename the files, normalise the strokes, re-export, ship 86
icons. Two weeks of work and a number that looks good in a headline.

We rebuilt instead, and changed what qualifies for release. Now a drawing ships only if it survives
four gates, three of which are derived from measured geometry rather than a list someone maintains:

1. **Cultural hold** — a named entry with a recorded reason.
2. **Unconfirmed referent** — derived. Any drawing the audit flagged with a warning is held
   automatically, so nobody has to remember to add it.
3. **Outside the canvas** — derived from measured geometry, including the stroke halo.
4. **Outside the live area** — derived from measured geometry.

32 icons survive all four today. That is the library.

### The system underneath

One 24 × 24 canvas. A 2-unit live area, measured on true curve bounds — cubics solved for extrema,
arcs converted to cubics first — because a sampled measurement lets a shallow curve through. Stroke
1.5, round caps, round joins, and a 1.5-unit minimum counter so nothing fills in at 16 px. Every
paint is `currentColor`, so an icon takes the colour of the text around it with no edits.

None of that is a style guide someone has to remember. It is `npm run validate`, it runs in CI on
every asset, and it exits non-zero. It rejects a text element, a hard-coded colour, a `transform`
that would hide geometry from bounds checking, an element id that would collide when icons are
inlined into one document, and any `script`, `image`, `use`, `filter` or `mask` — because a
distributed asset must not be able to execute, fetch or embed.

The part we would defend hardest is the weight rule. The system specifies four weights and one is
drawn. The other three will not be produced by raising `stroke-width`: a real weight redistributes
mass, re-solves counters, and often changes how much detail survives. The validator cannot tell a
drawn weight from a thickened one, so it enforces the only part it can prove — a weight ships for
the whole set or the build fails.

### Naming is a process, not an intention

An icon whose name asserts a cultural referent does not ship until someone who knows that referent
confirms it. That is enforced in the type system: the released-icon schema refuses to parse an icon
whose required review is anything other than approved. The data and the public claim cannot
diverge, because the claim is generated from the data.

Right now, one drawing is held for exactly that reason. It is a cap. It passes every automated
check. The audit's note reads: _"Referent unclear — crown-on-brim could be several hats. Confirm
before naming."_ Shipping it under a Yoruba name would assert a specific object on the strength of
a shape, so it sits in staging with the blocker recorded — held, not deleted, because the drawing
is real work and the block is a question, not a verdict.

The same applies to local-language names. Two Yoruba names for the talking drum came out of the
audit and are marked pending, because they are related instruments and nobody has confirmed which
one is drawn. Not a single local name in the library is confirmed, so the website makes no
local-language claim at all and the local-name search feature stays switched off.

### What we shipped

- **32 icons** in 7 categories, one drawn weight, MIT.
- **Three npm packages** — canonical assets with a shared renderer, a typed metadata package with
  runtime validation and shared search, and generated hook-free React components.
- **A Figma plugin** that is offline by declaration and by build: the manifest declares
  `"allowedDomains": ["none"]`, all data is compiled in at build time, and the build fails if
  `fetch`, `XMLHttpRequest`, `WebSocket`, `EventSource`, `importScripts` or any absolute http(s)
  URL reaches either bundle.
- **A website** where every number — released, held, backlog, weights drawn — is computed from the
  repository at build time, so it cannot drift from the source.
- **A public audit trail.** Every drawing traces to a row in the vendored audit file, and a test
  asserts the dispositions sum to 86.

### What we did not ship, and say so

1 drawing that exist and are blocked. 55 audited concepts with no
compliant drawing. Three of four specified weights. Zero illustration-tier pieces. Zero confirmed
local-language names.

All of it is on the status page, next to the numbers we are pleased with. That is not modesty. A
library you can plan around is one that told you its limits in the first week rather than the
eighteenth month.

### What we would tell another studio

An icon library is a set of promises about consistency. If you cannot check a promise with a
command, you have not made it — you have expressed a preference, and preferences drift the moment
a deadline arrives.

The specific decision worth stealing has nothing to do with Nigeria: **release less than you have
drawn, and publish the difference.** It costs a smaller number on launch day and buys a library
nobody has to audit again.

### Contribute

The most valuable thing anyone can give this project is not a drawing. It is a speaker of Yoruba,
Hausa, Igbo or Nigerian Pidgin willing to review a 32-row list of proposed local names.
Zero are confirmed today.

`icons@neustackstudio.com` · github.com/neustackdesign/african-icon-library

---

## Suggested page furniture

- **Hero image:** the contact sheet from `npm run preview`, on the `#FAF9F6` paper. Real drawings,
  no mock-up.
- **Pull quote:** _"We could have renamed everything and shipped eighty-six icons. We shipped
  32 instead, and wrote down everything we have not drawn."_
- **Inline figure:** the before/after — a `Group-37` filename beside `talking-drum`, at the same
  scale.
- **Inline figure:** `talking-drum` on the 24-unit grid with the live area marked.
- **Call to action, single:** _Review a name._ Not _star the repo_.
