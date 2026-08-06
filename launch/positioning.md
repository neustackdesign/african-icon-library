# Positioning

The master document. Everything in `platform-copy/` and `outreach/` is a compression of this. If a
piece of copy contradicts this file, the copy is wrong.

---

## 1. The problem

Open a Nigerian product — a food-delivery app, a bus-ticketing flow, a fintech onboarding screen —
and look at the icons. A yellow bus is drawn as a grey coach. Jollof rice is drawn as a bowl of
soup with steam lines. A naira amount is prefixed with a dollar sign because that is the glyph the
icon set shipped. A talking drum, if it appears at all, appears as a stock hand drum with a strap.

This is not a taste problem. It is a coverage problem, and it has a shape:

- Global icon libraries are excellent and enormous, and they are drawn from the reference set of
  the places their contributors live. A cursor, a credit card, a hamburger, a taco. None of them
  are wrong; they are just not everything.
- The gap is filled by clipart. Search "danfo icon" and you get raster PNGs at one size, with
  baked-in colour, no grid, and a licence nobody can read.
- Designers then redraw the same objects, badly and repeatedly, one product at a time, on
  deadline. The redrawing does not accumulate anywhere.

And the second-order problem, which is the one this repository was actually built to solve: **the
attempts to fill the gap have mostly been collections, not systems.** A folder of drawings is not
an icon library. It has no grid, no stroke logic, no ids, no metadata, no validation, no way to
tell whether the thing you are about to ship has type baked into it.

We know that specifically, because we audited one.

## 2. The insight

In August 2026 we audited an earlier 86-drawing African icon set. The findings were not subtle:

- **Two visual species in one library.** No shared grid. Icons that could not sit next to each
  other in a toolbar.
- **No stroke logic.** Weight varied per drawing, so a row of icons read as a row of different
  fonts.
- **Type baked into the artwork.** Letters and numerals inside the SVG — illegible at 16 px,
  impossible to localise, and dirt when scaled down.
- **Trademarks and trade dress.** Things a redistributable library cannot ship at all.
- **Duplicate concepts.** Five fabric rolls drawn five ways. Three snack wrappers. Four bridges.
  Three rocks nobody could tell apart.
- **38 files still named `Group-N`.** Not a naming inconsistency — an absence of naming.

The insight is the choice we made next. The obvious move was to fix the top layer: rename the
files, normalise the strokes, re-export, ship 86 icons. That would have produced a bigger number
and a library that still could not be trusted.

**Correctness is the scarce resource here, not volume.** Anyone can produce a hundred African
drawings. Almost nobody will produce a set where every glyph is measured against the same grid,
every name has been checked with someone who knows the object, and every limit is written down
where a user sees it before adopting.

So we rebuilt, and we release only what passes. 32 icons is a small number and it is
the honest one.

## 3. The promise

> **Icons for African life that behave like a real icon system, and a library that tells you
> exactly what it has not drawn yet.**

Three parts, all checkable:

**They are specific.** A danfo. A suya skewer over coals. A talking drum. An agogo. A naira note.
A ludo board. Concepts a global library has no reason to draw, drawn properly rather than
approximated.

**They are a system, not a folder.** One 24 × 24 canvas. A 2-unit live area measured on true curve
bounds, so a cubic that bulges past the edge is caught even when its endpoints are inside. A 1.5
stroke, round caps and joins, a 1.5-unit minimum counter so glyphs do not fill in at 16 px. Every
paint is `currentColor`, so an icon takes your text colour with no edits. No text, no `transform`,
no element ids, no `script`, `image`, `use`, `filter` or `mask`. All of that is enforced by
`npm run validate` in CI, on every asset, every time.

**They are honest about scope.** The library ships one weight. It ships 32 icons in
7 categories. It has 1 drawing that exist but are blocked from
release, 55 audited concepts with no compliant drawing, and zero illustration-tier
pieces. Those numbers are on the website's status page, computed from the repository at build
time, so the site cannot drift from the source.

## 4. The proof

Every one of these is a command anyone can run or a file anyone can read. Use them in copy; do not
use adjectives instead of them.

| Claim                             | Proof                                                                                                                                                                                                            |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| One grid, enforced                | `npm run validate` — `viewBox` must be exactly `0 0 24 24`; bounds measured with analytic curve extrema, not sampled points                                                                                      |
| No baked-in type                  | the `prohibited-text` rule rejects `text`, `tspan`, `textPath`, `foreignObject` and stray text content                                                                                                           |
| No hard-coded colour              | the `hard-coded-colour` rule rejects any paint that is not `currentColor` / `none` / `inherit`, plus hex, `rgb()`, `hsl()`, `oklch()` and `url()` literals                                                       |
| Nothing executable ships          | element allow-list: `svg`, `g`, `path`, `circle`, `ellipse`, `rect`, `line`, `polyline`, `polygon`. Everything else fails.                                                                                       |
| Weights are not faked             | a weight ships for the whole set or the build fails; `thin`, `bold`, `fill` are absent, not synthesised from `regular`                                                                                           |
| The site cannot overstate the set | every number on `icons.neustackstudio.com` is computed from `packages/metadata` at build time                                                                                                                    |
| The Figma plugin is offline       | manifest declares `"networkAccess": { "allowedDomains": ["none"] }`; the build fails if `fetch`, `XMLHttpRequest`, `WebSocket`, `EventSource`, `importScripts` or any absolute http(s) URL reaches either bundle |
| Provenance is traceable           | every released drawing traces to a row in the vendored audit source; a test asserts the dispositions sum to 86                                                                                                   |
| Names are not guessed             | `releasedIconSchema` refuses to parse an icon whose required cultural review is not `approved`                                                                                                                   |
| Held work is genuinely held       | a test asserts no held drawing's id or component name appears in any generated surface                                                                                                                           |
| Downloads are verifiable          | `npm run release:build` publishes SHA-256 checksums alongside the artefacts                                                                                                                                      |

## 5. Anti-claims

Things we will not say, and the true sentence to use instead. These are load-bearing: the honesty
is the differentiator, so a single inflated line costs more than it gains.

| Do not say                                 | Say instead                                                                                                                                    |
| ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| "Four weights: thin, regular, bold, fill"  | "One weight, `regular`. The other three are specified and undrawn, and will not be faked with `stroke-width`."                                 |
| "Available on npm"                         | "Published to npm in the technical preview — until then, clone the repository or download the release zip."                                    |
| "Get it on the Figma Community"            | "The Community file and plugin are built and specified. Neither is published yet; both are phase 2 and 3."                                     |
| "Icons for Africa"                         | "Icons for African life, starting with Nigeria. Region is a first-class axis; Nigeria is the first region."                                    |
| "The definitive African icon set"          | "32 icons, drawn to one spec. The backlog is public and the limits are on the status page."                                        |
| "Search in Yoruba, Hausa, Igbo and Pidgin" | "Local names carry a review state. None are confirmed yet, so the site makes no local-name claim at all."                                      |
| "Culturally authentic"                     | "Every name that asserts a cultural referent is confirmed by someone who knows it, or the icon does not ship."                                 |
| "1,000+ icons coming soon"                 | "55 audited concepts are in the backlog. They ship when they meet the spec, not before."                                        |
| "Illustrations and icons"                  | "The illustration tier exists in the architecture and has zero released pieces."                                                               |
| "Free forever, no strings"                 | "MIT licensed. Free for commercial use, no attribution required. It grants no rights in third-party trademarks or regulated national symbols." |
| "Trusted by teams at…"                     | Nothing. There are no users yet. Say so, or say nothing.                                                                                       |
| "Community-built"                          | "Maintained by Neustack Design, open to contribution, with cultural review as the highest-priority bug class."                                 |

Also on the banned list, everywhere: _revolutionary, game-changing, empowering, unleash,
democratise, seamless, curated collection of stunning, must-have, level up._

## 6. Competitor framing

We are not competing with these. Two of them are our recommendation for the icons we do not draw,
and the copy should say so — it is true, it is disarming, and it makes the specific claim we do
make more credible.

### Phosphor Icons

**What it is.** Around 1,200 concepts, each drawn in six weights (thin, light, regular, bold, fill,
duotone), which is the most expressive free weight system available. MIT.

**Where it wins.** Weight range, breadth, polish, a mature ecosystem across frameworks.

**Where we differ.** Phosphor has no danfo, no suya, no agogo, no naira note — reasonably, because
that is not what it set out to draw. We have one weight to Phosphor's six, and we say so rather
than implying parity. Phosphor is the honest comparison for _how a weight system should work_, and
it is the reason we refuse to fake ours: a real weight redistributes mass and re-solves counters.
Raising `stroke-width` on our `regular` set would produce six files that pass the validator and
look wrong at 16 px.

**The line to use.** "Phosphor draws the general set better than we ever will. Use it. We draw the
things it has no reason to draw."

### Lucide

**What it is.** 1,600+ community-drawn outline icons on a strict 24 px grid, the default icon set
for the shadcn/ui ecosystem, tree-shakable packages across React, Vue, Svelte, Solid and Angular.

**Where it wins.** Volume, distribution, ubiquity, a genuinely strict grid discipline.

**Where we differ.** Same grid discipline, opposite scope. Lucide is horizontal coverage of the
general interface vocabulary; we are vertical coverage of one cultural reference set. Our React
package is generated, hook-free and works unchanged in Server Components, which is table stakes
rather than a differentiator — we should not pretend otherwise.

**The line to use.** "Lucide is our stroke and grid discipline applied to the general set. We are
the same discipline applied to the set nobody drew."

### The Noun Project

**What it is.** Millions of icons, the largest catalogue of specific and cultural concepts
anywhere, contributed by tens of thousands of designers.

**Where it wins.** Coverage. There are African objects in there that we will not reach for years.

**Where we differ.** This is the sharpest and most useful contrast, so make it carefully and
without disparagement. The Noun Project is a marketplace of independent drawings: each icon is
excellent on its own terms and drawn by a different person on a different grid, with its own
stroke weight, its own optical scale, and per-icon licensing that varies between royalty-free with
attribution and paid. Put six of them in one toolbar and you can see the seams.

We are not a marketplace. Every glyph in this library is drawn to the same spec, measured by the
same validator, licensed identically under MIT, and named against a metadata schema that refuses
to release an unconfirmed cultural referent.

**The line to use.** "The Noun Project has more African icons than we do and always will. What it
does not have is 32 of them drawn on one grid, with one stroke, one licence and one
naming process."

### The category we are actually in

Not "icon packs". **Icon systems with a specific reference set** — the shelf that holds Phosphor,
Lucide, Heroicons, Radix. The pitch is "this is a real system, and its reference set is Nigerian",
not "here is a pack of African icons".

## 7. Audiences, in priority order

| #   | Audience                                           | What they need to hear                                                                                                 |
| --- | -------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| 1   | Nigerian product designers and front-end engineers | The objects you keep redrawing exist, on a grid, MIT, with a Figma plugin that works offline.                          |
| 2   | African design and open-source communities         | This is a rebuild done properly, the backlog is public, and cultural review is the highest-priority bug class.         |
| 3   | Yoruba, Hausa, Igbo and Nigerian Pidgin speakers   | Zero local names are confirmed. Reviewing a 32-row list is the highest-value contribution available today. |
| 4   | Design-systems practitioners anywhere              | The validation and provenance model is reusable. The audit is public. Steal the approach.                              |
| 5   | Diaspora and pan-African product teams             | Region is a first-class axis, not a tag bolted on. Nigeria is the first region, not the only one.                      |
| 6   | Tech and culture press                             | The story is the audit and the decision to ship 32 rather than 86 — not "African icons launched".          |

## 8. The three sentences everything compresses to

1. Global icon libraries never drew a danfo, so Nigerian products redraw one, badly, every time.
2. We audited 86 existing African drawings, found no grid, no stroke logic and type baked into the
   artwork, and rebuilt from the ground up — releasing only the 32 that pass every
   automated check.
3. One weight, MIT, offline Figma plugin, and a public list of everything we have not drawn yet.
