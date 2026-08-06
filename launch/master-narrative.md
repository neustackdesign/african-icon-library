# Master narrative

The story, told once, properly. Every other piece of copy is a compression or a fragment of what
follows. Read [`positioning.md`](positioning.md) first.

---

## The story

There is a yellow bus in Lagos called a danfo. It carries most of the city. It is on every road,
in every conversation about the city, in the background of every photograph anyone has ever taken
on the mainland. It has never been drawn as an icon in any major open-source library.

That is not an oversight anyone should be angry about. Phosphor, Lucide, Heroicons — these are
serious, careful pieces of work, drawn by people covering the interface vocabulary they know. A
danfo is not in that vocabulary. Neither is a suya skewer, an agogo, a ludo board, a naira note,
or a bowl of pepper soup.

So the objects get approximated. A Nigerian food-delivery app ships a generic bowl for jollof
rice. A ticketing flow uses an intercity coach for a danfo. A payments screen prefixes a naira
figure with a dollar sign because that is the glyph that came in the box. It works. It is also,
quietly, a product telling its users that the shapes of their lives were not worth drawing.

The usual fix is to search "African icons" and download a pack. We did that, at scale, and then we
audited what we got.

**In August 2026 we reviewed 86 drawings from an earlier African icon set.** The audit found two
visual species in one library — no shared grid, so the icons could not sit next to each other in a
toolbar. It found no stroke logic; weight varied per drawing, so a row of them read like a row of
different fonts. It found letters and numerals baked into the artwork, which are illegible at
16 px and impossible to localise. It found trademarks and trade dress, which a redistributable
library cannot ship at all. It found five fabric rolls drawn five ways, three snack wrappers, four
bridges, and three rocks nobody could tell apart. And it found 38 files still named `Group-N` —
not an inconsistent naming convention, but the absence of one.

The tempting move was to fix the surface. Rename the files, normalise the strokes, re-export, ship
86 icons, announce a large number. We would have had a bigger library and a worse one, and
somebody would have shipped a trademark inside a product.

**We rebuilt instead, and changed what gets released.**

Now every drawing sits on one 24 × 24 canvas with a 2-unit live area. The live area is measured on
true curve bounds — cubics solved for extrema, arcs converted to cubics first — so a curve that
bulges past the edge is caught even when both its endpoints are comfortably inside. Stroke is 1.5,
round caps, round joins, with a 1.5-unit minimum counter so nothing fills in at 16 px. Every paint
is `currentColor`, so an icon takes your text colour without being edited. No text elements. No
`transform` attributes — a transform hides geometry from bounds checking. No element ids, because
ids collide when several icons are inlined into one document. No `script`, `image`, `use`,
`filter` or `mask`, because a distributed asset must not be able to execute, fetch or embed.

None of that is a style guide anyone has to remember. It is `npm run validate`, it runs in CI on
every asset, and it exits non-zero.

**Which is why the library is small.** 32 icons, in 7 categories, in
one weight. 1 drawing exists and is blocked — one of them because the audit could
not identify the object and we refuse to name a hat we cannot name. 55 audited
concepts have no drawing that meets the spec yet. Three weights are specified and undrawn, and
they will not be produced by raising `stroke-width`: a real weight redistributes mass and re-solves
counters, which is icon design, not a build step. The illustration tier has zero pieces.

Every one of those numbers is on the website's status page, computed from the repository at build
time, because a claim that is typed by hand is a claim that goes stale.

**And the naming is a process, not a good intention.** A drawing whose name asserts a cultural
referent does not ship until someone who knows that referent confirms it. The schema enforces it:
an icon with an outstanding required review will not parse, so the data and the claim cannot
diverge. Local names — `gangan` and `dùndún` for the talking drum, for instance — carry an explicit
review state, and not one name in the library is confirmed yet. So the website makes no
local-language claim at all. The feature exists in the architecture and stays switched off until a
speaker says otherwise.

Nigeria is the first region, not the only one. Region is a first-class axis in the metadata, which
is why `kente-cloth` sits in the backlog rather than being quietly filed as Nigerian. One
Nigeria-first release does not represent a continent, and the copy will not pretend it does.

**What this is, in the end:** a small, correct, MIT-licensed icon library for things global
libraries had no reason to draw, plus a public list of everything it has not drawn yet. The list
is the point. It is how you tell a library that will still be right in a year from a folder of
drawings that happened to be uploaded.

---

## One-line description

> Open-source icons for African life, drawn on one 24-pixel grid. Nigeria first; the continent is
> the roadmap.

**Variants, for where the line has to fit somewhere specific:**

- **Under 60 characters** — `Open-source icons for African life. Nigeria first.`
- **Under 100 characters (Figma tagline limit)** — `Open-source icons for African life, on one 24px grid. Nigeria first.`
- **Developer-facing** — `MIT-licensed SVG icons for African life. One 24px grid, one drawn weight, validated in CI.`
- **Press-facing** — `A small, deliberately incomplete open-source icon library for African life, rebuilt after an audit of 86 drawings found no grid and no stroke logic.`

## 50-word description

> The African Icon Library is an open-source set of 32 icons for things global
> libraries never drew — a danfo, a suya skewer, a talking drum, a naira note. One 24-pixel grid,
> one drawn weight, MIT licensed. Nigeria first. Everything not yet drawn is listed publicly.

_(50 words exactly, before token substitution. Re-count after substituting if the platform enforces
a hard limit.)_

## 100-word description

> The African Icon Library is an open-source set of 32 icons for African life — a
> danfo, a suya skewer, a talking drum, an agogo, a naira note — drawn on one 24-pixel grid with a
> 1.5 stroke and a 2-unit live area, so they sit level beside the rest of your system. Every glyph
> paints with `currentColor` and carries no text, no brand mark and no hard-coded colour; the
> rules are enforced in CI rather than documented and hoped for. The set is small on purpose: it
> follows an audit of 86 earlier drawings and releases only what passes. MIT licensed, Nigeria
> first.

## Full description

> **African Icon Library** is an open-source icon set for African life, maintained by Neustack
> Design. It ships 32 icons across 7 categories in one drawn weight,
> under the MIT licence.
>
> The icons are things global libraries had no reason to draw: a danfo, a suya skewer over coals, a
> talking drum, an agogo, a ludo board, a cocoa pod, a naira note. Every one is drawn on a 24 × 24
> canvas with a 2-unit live area, a 1.5 stroke, round caps and joins, and a 1.5-unit minimum
> counter so the glyph does not fill in at 16 px. Every paint is `currentColor`, so an icon takes
> your text colour with no edits and no overrides.
>
> That consistency is enforced, not requested. `npm run validate` checks the `viewBox`, measures
> geometry against the canvas and the live area using analytic curve bounds, rejects any text
> element or stray text content, rejects any hard-coded colour, restricts markup to an
> allow-list that excludes `script`, `image`, `use`, `filter` and `mask`, and fails the build if a
> weight ships for part of the set. CI runs exactly the same checks.
>
> The library is small deliberately. It follows an August 2026 audit of 86 drawings from an
> earlier set, which found two visual species in one library, no shared grid, no stroke logic,
> baked-in type and trademarks, duplicate concepts and 38 files still named `Group-N`. Rather than
> re-ship that set with a new coat of paint, this repository releases only what passes every check
> and states plainly what has not been drawn.
>
> What has not been drawn: three of the four specified weights — `thin`, `bold` and `fill` — which
> will not be faked by changing a stroke width, because a real weight redistributes mass and
> re-solves counters. 1 drawing exists but are blocked from release. 55
> audited concepts have no compliant drawing. The illustration tier has zero pieces. All of those
> numbers are computed from the repository at build time and shown on the website's status page.
>
> Cultural naming is a process. An icon whose name asserts a cultural referent does not ship until
> someone who knows that referent confirms it, and the metadata schema refuses to release an icon
> whose required review is outstanding. Local-language names carry an explicit review state; none
> are confirmed yet, so the library makes no local-name claim publicly.
>
> The set comes with a typed metadata package, generated React components, a Figma plugin that is
> offline by declaration and by build, and a website where every number is derived from the
> repository. Nigeria is the first region shipped; region is a first-class axis in the data, so
> entries from other African countries slot in without being treated as outliers.
>
> Source, spec, audit trail and backlog:
> [github.com/neustackdesign/african-icon-library](https://github.com/neustackdesign/african-icon-library)

## Founder statement

For quoting in the press release, the project page and the LinkedIn essay. Attributed to Neustack
Design as maintainer. Do not add a second, more excitable quote — one is enough and it should
sound like a person.

> "We started by downloading what already existed. Eighty-six drawings, and we sat with all of
> them for a week.
>
> The problem was never that they were ugly. Some of them were lovely. The problem was that they
> could not sit next to each other in a toolbar — no shared grid, no stroke logic, letters baked
> into the artwork, a couple of trademarks that no library can legally redistribute, and
> thirty-eight files still called `Group-6`, `Group-7`, `Group-37`. Three of them were rocks. We
> could not tell which rock was which.
>
> We could have renamed everything, normalised the strokes and shipped eighty-six icons. It would
> have taken a fortnight and the number would have looked good.
>
> We shipped 32 instead, and wrote down everything we have not drawn.
>
> The part I would want another designer to take from this has nothing to do with Nigeria. It is
> that an icon library is a set of promises about consistency, and if you cannot check the
> promises with a command, you are not making them. Ours are in `npm run validate`. When the
> geometry leaves the live area, the build fails. When a weight ships for one icon and not the
> rest, the build fails. When we cannot identify the hat in a drawing, the icon does not ship —
> and one of them, right now, does not ship for exactly that reason.
>
> A danfo is not a hard thing to draw. Drawing it so it still belongs beside the other
> 32 in two years is the hard thing."
>
> — Neustack Design, maintainer, African Icon Library

## Narrative beats, for reuse

Six beats. Every long-form piece — essay, thread, reel, pitch — is some subset of these in this
order. Do not reorder them; the audit has to land before the small number does, or the small
number reads as a failure instead of a decision.

1. **The gap.** A danfo has never been drawn in a major open-source library. Neither has a suya
   skewer, an agogo or a naira note. Products approximate them.
2. **The trap.** The fix looks like "download an African icon pack". We did, and audited it.
3. **The audit.** 86 drawings. No shared grid, no stroke logic, baked-in type and trademarks,
   duplicate concepts, 38 files named `Group-N`.
4. **The decision.** Rebuild rather than repaint. Release only what passes. 32, not 86.
5. **The system.** One canvas, one live area, one stroke, `currentColor`, no text, no transforms,
   enforced by a validator in CI.
6. **The honesty.** One weight drawn of four specified. 1 held, 55 in
   backlog, zero illustrations, zero confirmed local names. All on the status page, computed from
   the repository.

## Words and spellings

- **British English.** "licence" the noun, "license" the verb; "colour", "normalise", "optimised",
  "recognise". The repository's own docs use this — match them.
- **Icon ids in code voice, always kebab-case:** `talking-drum`, `naira-note`, `chin-chin-pack`.
  Never "Talking Drum" as an id.
- **"drawn weight"**, not "style" or "variant".
- **"held"** for a drawing that exists but is blocked. **"backlog"** for a concept with no
  compliant drawing. They are different states and the copy should not blur them.
- **"Nigeria first, the continent next"** — the repository's own phrasing. Use it verbatim rather
  than inventing a variant.
- Never "pack". Never "collection of stunning". Never "empowering".
