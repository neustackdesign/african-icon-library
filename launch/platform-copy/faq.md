# FAQ

For the website, the Community file's About page, and as a reply bank when the same question
arrives for the eighth time. Answers are short and lead with the true thing rather than the
comfortable thing.

---

## About the set

### How many icons are there?

32, across 7 categories, in one drawn weight. The status page on the
website computes that number from the repository at build time, so it cannot go stale.

### That is not very many.

No. It is a deliberate floor rather than a ceiling.

The library follows an August 2026 audit of 86 drawings from an earlier African icon set. The audit
found two visual species in one library, no shared grid, no stroke logic, letters and trademarks
baked into the artwork, five fabric rolls drawn five ways, and 38 files still named `Group-N`. We
could have renamed those files and shipped 86 icons. We released only what passes every automated
check instead, and published the list of what does not.

### What are the categories?

The system defines nine — Identity & State, Fashion & Textiles, Food & Drink, Music/Art & Play,
Transport, Places & Landmarks, Commerce & Industry, Culture & People, and Defence. Only
7 of them currently contain released icons, and the website only offers filters
for categories that actually have something in them.

### Which icons are in it?

A danfo, a suya skewer, a talking drum, an agogo, a naira note, a ludo board, jollof rice, pepper
soup, a cocoa pod, a chin-chin pack, an oil pumpjack, a canoe, a train ticket, a film clapper, a
Nigeria flag and a football jersey — plus whatever has landed since. Browse the full set on the
website; the browser is the authoritative list.

### Why does the flag have no colour?

`nigeria-flag` and `football-jersey` ship as neutral outlines — no colour, no crest, no number, no
lettering. Two reasons. Every icon in the library paints with `currentColor` so it takes your text
colour, which rules out fixed colour anywhere. And some jurisdictions regulate depictions of
national symbols, so a neutral outline is the safer thing to redistribute under MIT.

### Will you add icons from other African countries?

Yes, and region is already a first-class field in the metadata rather than a tag bolted on later.
Nigeria is the first region shipped, not the only one planned.

There is a Ghanaian concept, `kente-cloth`, sitting in the backlog right now specifically because
we want to confirm the region-tagging convention before the first non-Nigerian icon ships, rather
than after. One Nigeria-first release does not represent a continent and we will not describe it as
if it did.

### Can I request an icon?

Open an issue. Two questions decide it: is the concept specific enough that a general library has
no reason to draw it, and does it survive at 24 px? A generic clipboard belongs in Phosphor or
Lucide, which draw it better. A danfo belongs here.

---

## Weights

### Are there thin, bold and fill weights?

No. The system specifies four weights — `thin`, `regular`, `bold`, `fill` — and exactly one,
`regular`, is drawn. The other three are specified and undrawn.

### When will the other weights arrive?

When someone draws them. There is no date, and inventing one would be the same mistake as
inventing the weights.

### Can you not just increase the stroke width?

We could, and it would be worse. A real weight redistributes mass, re-solves counters and often
changes how much detail survives — at 1.0 the counters open up and some internal detail has to go;
at 2.0 the 1.5-unit counter minimum is violated by several current constructions. That is icon
design, not a build step.

The validator cannot tell a drawn weight from a thickened one, which is exactly why the rule is
written down instead: a weight ships for the whole set or the build fails.

### The Figma plugin shows weights I cannot pick.

On purpose. `thin`, `bold` and `fill` appear struck through as unavailable rather than being
hidden, so you learn the library's real shape before you adopt it rather than after.

---

## Using it

### What licence?

MIT, covering the code, the metadata and the drawings. Free for commercial use, no attribution
required. It grants no rights in third-party trademarks or regulated national symbols — no released
icon reproduces either, and none may be added.

### How do I install it?

Three packages: `@african-icon-library/metadata`, `@african-icon-library/icons` and
`@african-icon-library/react`. Until the technical-preview phase publishes them, clone the
repository or download the release zip from the downloads page — every artefact there carries a
published SHA-256 checksum.

### How do I recolour an icon?

Set a text colour. Every paint in every asset is `currentColor`, so an icon inherits the colour of
its context with no overrides and no per-icon edits. In Figma, select the instance and change the
stroke colour; Figma has no `currentColor`, so the components ship with a single black stroke as
the honest substitute.

### What sizes do they work at?

Drawn for 24 px, and they hold at 16. The minimum 1.5-unit counter exists so the glyph does not
fill in at small sizes. `npm run preview` produces `previews/proof-strip-24.svg`, which is the real
drawings at real proportions — if a glyph ever becomes a smudge there, it is a bug worth reporting.

### Can I use them in a commercial product?

Yes. MIT, no attribution required. A link back is appreciated and never required.

### Can I modify them?

Yes. If your modification is a genuine improvement to the drawing, please open a pull request — the
library gets better and you stop maintaining a fork.

### Do they work with React?

Yes. `@african-icon-library/react` has one generated component per icon, hook-free, so they work
unchanged in React Server Components. The components are generated from the assets and CI fails if
the generated output has drifted from its inputs.

---

## The Figma plugin

### Does it need an internet connection?

No, and it cannot use one. The manifest declares `"networkAccess": { "allowedDomains": ["none"] }`,
all icon data is compiled in at build time, and the build fails if `fetch`, `XMLHttpRequest`,
`WebSocket`, `EventSource`, `importScripts` or any absolute http(s) URL reaches either bundle.

### Does it collect data about me or my file?

There is nowhere for data to go. No analytics, no account, no `clientStorage`, no `setPluginData`.
The plugin only touches the current page.

### What does it insert?

Editable vector frames, named from the library metadata, with `SCALE` constraints, at 16, 24, 32
or 48 px — into your selection, or the centre of your viewport if nothing usable is selected.

### Is it in the Figma Community yet?

Check the website; it is the authoritative answer at any given moment. The plugin and the Community
file are staged releases and each one goes live only after the phase that publishes it.

---

## Cultural naming

### Who checks that the names are right?

People who know the objects, and until they do the icon does not ship. That rule is enforced by the
metadata schema rather than by good intentions: `releasedIconSchema` refuses to parse an icon where
a required cultural review is anything other than `approved`. The data and the public claim cannot
diverge, because the claim is generated from the data.

### Is anything being held right now for that reason?

Yes. A drawing of a cap passes every automated check and is not released, because the audit's note
reads "crown-on-brim could be several hats. Confirm before naming." Releasing it as `fila` would
assert a specific Yoruba cap on the strength of a shape. It sits in `packages/icons/staging/` with
the blocker recorded — held, not deleted, because the drawing is real work and the block is a
question rather than a verdict.

### Can I search in Yoruba, Hausa, Igbo or Pidgin?

No. Local-language names exist in the schema with an explicit review state, and not one of them is
confirmed. Pending names still feed the search index with diacritics stripped, so "dundun" finds
"dùndún" — making a name findable is not the same as presenting it as authoritative — but the
website renders no local name and makes no local-language claim.

This is the single highest-value contribution available to the project right now. If you speak one
of those languages and would review a 32-row list, please get in touch.

### An icon is named wrong. What do I do?

Open an issue. You do not need to be sure. A false report costs a conversation; a shipped mistake
costs everyone who uses the library. A misnamed or misrepresented cultural referent is the
highest-priority bug class in this project, ahead of every feature.

### Why is there no Fela Kuti icon?

Because a real-person likeness in a redistributable library is a rights problem, not a style
problem. The audit's options were to abstract it to a raised-arms silhouette or to clear rights
with the estate. Nobody has chosen yet, so the concept does not exist in the library.

---

## The project

### Who makes it?

Neustack Design, as maintainer. It is open source and open to contribution.

### How do I contribute?

`CONTRIBUTING.md` in the repository. Open an issue before drawing anything — the shape of the
concept matters more than the shape of the drawing. And local-name review is worth more to the
project today than another drawing is.

### Why publish the backlog?

Because a library you can trust in two years is one that told you what it could not do in the first
week. 55 audited concepts have no drawing that meets the spec, 1
drawings exist but are blocked, and the illustration tier has zero pieces. Those numbers are on the
status page, computed from the repository, next to the ones we are proud of.

### How is this different from The Noun Project?

The Noun Project has more African icons than we do and always will — it is a marketplace with
millions of contributed drawings. What it does not have is 32 of them drawn to one
spec, measured by one validator, licensed identically, and named through one review process. Put
six marketplace icons in one toolbar and you can see the seams; that is the problem this library
exists to not have.

### Should I use this instead of Phosphor or Lucide?

No — alongside. Phosphor and Lucide draw the general interface vocabulary better than we ever will,
and we would recommend either. This library draws the things they have no reason to draw. The grid
is compatible by design: 24 × 24, 1.5 stroke, round caps and joins.
