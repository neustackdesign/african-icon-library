# LinkedIn — founder essay

Phase 4, Wednesday 21 October 2026. Posted from the maintainer's personal account, not the company
page — the piece is a first-person account of a decision and it does not survive being written by a
brand.

Roughly 1,150 words. LinkedIn allows 3,000 characters in a post, so this runs as a LinkedIn
article, with the first 200 words posted as the teaser. Both are below.

Do not pair it with a graphic that summarises it. Pair it with one image: the `Group-37` filename
beside `talking-drum`.

---

## The teaser post (links to the article)

---

We spent a week looking at 86 African icon drawings before we drew a single line.

Thirty-eight of the files were still called `Group-6`, `Group-7`, `Group-37`. Three of them were
rocks. We could not tell which rock was which — and neither, it turned out, could the audit: one
was probably Olumo, one probably Zuma, one probably Aso, and nobody had written it down.

The obvious move was to rename everything, normalise the strokes, re-export and ship 86 icons. Two
weeks of work. A good number.

We shipped 32 instead, and published the list of everything we have not drawn.

I have written up why, because the decision generalises past icons and past Nigeria: an icon
library is a set of promises about consistency, and if you cannot check a promise with a command,
you have not made it.

Full piece below. It includes the drawing we still refuse to release, and the reason.

---

## The article

**Title:** `We audited 86 African icons and shipped 32`

**Subtitle:** `What a week with somebody else's icon set taught us about what a library actually
is`

---

There is a yellow bus in Lagos called a danfo.

It carries most of the city. It is on every road, in the background of every photograph anyone has
taken on the mainland, in every conversation about traffic, which is most conversations. And it has
never been drawn as an icon in any major open-source library.

That is not an injustice and I do not want to write it as one. Phosphor, Lucide, Heroicons — these
are serious, careful pieces of work, drawn by people covering the interface vocabulary of the
places they live. A danfo is not in that vocabulary. Neither is a suya skewer, an agogo, a ludo
board, or a bowl of pepper soup.

What happens instead is small and constant. A Nigerian food-delivery app ships a generic bowl for
jollof rice. A ticketing flow uses an intercity coach for a danfo. A payments screen puts a dollar
sign in front of a naira figure, because that is the glyph that came in the box. Every team solves
it once, on deadline, badly, and the solution goes nowhere.

So we decided to draw the objects properly. And we started, sensibly, by finding out what already
existed.

### The week with the 86

We got hold of an earlier African icon set. Eighty-six drawings. We spent a week with all of them,
and wrote down what we found.

**There was no shared grid.** Two visual species in one library. Put six of them in a toolbar and
one of them is always the wrong size, not because it is badly drawn but because nobody agreed what
size meant.

**There was no stroke logic.** Weight varied per drawing. A row of them reads like a row of
different fonts, which is a thing you feel before you can name it.

**There were letters baked into the artwork.** Type inside the SVG. It is illegible at 16 px, it
cannot be localised, and it turns to dirt in a scaled-down UI.

**There were trademarks and trade dress.** Which is not a taste question. A redistributable library
cannot ship those under any licence, and somebody would eventually have shipped one inside a
product.

**There were duplicates nobody had noticed.** Five fabric rolls drawn five ways. Three snack
wrappers. Four bridges. Three rocks — and this is the one that stayed with me — three rocks that
could not be told apart. One was probably Olumo. One was probably Zuma. One was probably Aso. They
are three genuinely different, genuinely significant places, flattened into three near-identical
drawings, and nobody had recorded which was which.

**And 38 files were still called `Group-N`.** `Group-6`. `Group-7`. `Group-37`. That is not an
inconsistent naming convention. It is the absence of one, preserved through however many exports
and handovers.

A detail that sums the whole thing up: the archive labelled "SVG sources" turned out to contain PNG
renders. The entire vector inheritance of an 86-icon library was 18 drawings.

### The decision

The obvious move was to fix the top layer. Rename the files. Normalise the strokes. Re-export.
Ship 86 icons, announce a good number, and move on.

We would have had a bigger library and a worse one. And in about a year, somebody would have opened
an issue saying icon 41 has a trademark in it, and we would have discovered we had no way of
knowing whether icons 42 through 86 did too.

So we rebuilt, and — this is the part that actually mattered — we changed what qualifies for
release.

A drawing now ships only if it survives four gates. One is a list a human maintains: a cultural
hold, with a recorded reason. The other three are derived from measured geometry, so nobody has to
remember them. Is the referent confirmed? Does the stroked geometry stay inside the canvas? Does
the drawing stay inside the 2-unit live area?

32 survive all four today. That is the library.

### What we would defend hardest

Not the drawings. The rule that the promises are executable.

An icon library is a set of promises about consistency. One grid. One stroke. One naming scheme.
No type. No trademarks. Every team writes those down in a document, and every document loses to a
deadline eventually, because a document cannot fail a build.

Ours are in `npm run validate`, and it runs in CI on every asset:

- The `viewBox` must be exactly `0 0 24 24`.
- Geometry must sit inside the canvas and inside the 2-unit live area, measured with true curve
  bounds — cubics solved for extrema, arcs converted to cubics — because a sampled measurement lets
  a shallow curve through.
- No text element, no stray text content.
- No hard-coded colour. Every paint is `currentColor` or `none`.
- No `transform`, because a transform hides geometry from bounds checking.
- No element ids, because ids collide when several icons are inlined into one document.
- Nothing that can execute, fetch or embed: no `script`, `image`, `use`, `filter`, `mask`.

And the weight rule, which is the one people argue with. The system specifies four weights and one
is drawn. I will not produce the other three by raising `stroke-width`, because a real weight
redistributes mass and re-solves counters — at 1.0 the counters open up and detail has to go, at
2.0 several of these constructions violate the 1.5-unit counter minimum. Thickened weights would
pass the validator and look wrong at 16 px, which is the worst combination available.

So the validator enforces the only part it can prove: a weight ships for the whole set, or the
build fails.

### The drawing we will not release

There is a cap in our staging folder. It passes every automated check we have. It is, as far as I
can tell, a good drawing.

It is not in the library, because the audit's note on it reads: _"Referent unclear —
crown-on-brim could be several hats. Confirm before naming."_

Calling it `fila` would assert a specific Yoruba cap on the strength of a shape. It might be right.
Nobody has confirmed it, and "probably" is how three rocks become one rock.

So it is held — not deleted, because the drawing is real work and the block is a question rather
than a verdict — and the metadata schema enforces it: an icon whose required cultural review is
outstanding will not parse. The data and the public claim cannot diverge, because the claim is
generated from the data.

The same applies to local names. Two Yoruba names for our talking drum, `gangan` and `dùndún`, came
out of the audit marked pending. They are related instruments, not synonyms, and nobody has told us
which one we drew. Not a single local-language name in this library is confirmed. So the website
shows none, and the local-name search feature — which is built — stays switched off.

That feature working is worth less than that feature being wrong would cost.

### What I would say to anyone building something similar

Two things, and neither is about Nigeria.

**Release less than you have drawn, and publish the difference.** Our status page says
32 released, 1 held, 55 in the backlog, three weights
undrawn, zero illustrations, zero confirmed local names. Every figure is computed from the
repository at build time. It costs a smaller number on launch day and it buys a library nobody has
to audit again.

**Make the promises executable or stop making them.** Everything you cannot check with a command is
a preference, and preferences do not survive contact with a deadline.

A danfo is not hard to draw. Drawing it so it still belongs beside the other 32 in two
years — that is the hard part, and it is not a drawing problem at all.

---

MIT licensed. icons.neustackstudio.com · github.com/neustackdesign/african-icon-library

If you speak Yoruba, Hausa, Igbo or Nigerian Pidgin and would review a 32-row list of
proposed names, that is worth more to this project than anything else anyone could offer.
`icons@neustackstudio.com`
