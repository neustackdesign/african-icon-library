# X — launch threads

Two variants: a short technical-preview thread for phase 1, and the full thread for phase 4.

**Constraints.** 280 characters per post. Every post below is inside that after token substitution
at plausible values — but **re-count after substituting**, because a two-digit count becoming
three-digit will break a couple of them. Character counts are noted where a post is tight.

**Media.** Posts with images travel further, but a thread of nine images travels worse than a
thread with three good ones. Images are specified where they earn their place; the rest are text.

**Do not** put the link in post 1. Put it where someone who has read the argument will click it.

---

## Variant A — phase 1, technical preview (Wed 26 August 2026)

Five posts. Quiet. The audience is people who will open a repository.

**1/5** _(image: `danfo` glyph at 400 px on paper)_

```
There is a yellow bus in Lagos called a danfo. It carries most of the city.

It has never been drawn as an icon in any major open-source library. Neither has a suya skewer, an
agogo, or a naira note.

So we drew them. 32, MIT licensed.
```

_~250 chars_

**2/5**

```
Technical preview, so precisely:

The repo is public. The packages are on npm. `npm run check` passes from a clean clone.

The website is not deployed. The Figma Community file is not published. The plugin is not in the
store. Those are scheduled, not done.
```

_~255 chars_

**3/5**

```
Why only 32?

We audited 86 drawings from an earlier African icon set first. No shared grid. No stroke logic.
Type baked into the artwork. Trademarks. Five fabric rolls drawn five ways. 38 files still named
Group-N.
```

_~230 chars_

**4/5**

```
We could have renamed them and shipped 86.

Instead: fixed 24×24 canvas, geometry inside a 2-unit live area measured on true curve bounds, no
text, no hard-coded colour, no transforms, no element ids.

Enforced by npm run validate, in CI, on every asset.
```

_~255 chars_

**5/5**

```
Three of the four specified weights are undrawn and I won't fake them with stroke-width.

Zero local-language names are confirmed, so we show none.

If you speak Yoruba, Hausa, Igbo or Pidgin — tell us a name is wrong.

github.com/neustackdesign/african-icon-library
```

_~270 chars. Tight — check after substitution._

---

## Variant B — phase 4, full thread (Thu 22 October 2026)

Eleven posts. This is the one that carries the whole argument. Post it once, in the morning WAT,
and do not repost it three days later with a different first line.

**1/11** _(image: four glyphs in a row — `danfo`, `suya`, `talking-drum`, `naira-note`)_

```
None of these had ever been drawn in a major open-source icon library.

A danfo. A suya skewer. A talking drum. A naira note.

We spent a week auditing 86 existing African icon drawings before we drew a single line. Here is
what we found. 🧵
```

_~250 chars_

**2/11**

```
No shared grid.

Two visual species in one library. Put six of them in a toolbar and one is always the wrong size —
not because it is badly drawn, but because nobody had agreed what size meant.
```

_~195 chars_

**3/11**

```
No stroke logic.

Weight varied per drawing. A row of them reads like a row of different fonts. You feel it before
you can name it.
```

_~130 chars_

**4/11**

```
Type baked into the artwork.

Letters inside the SVG. Illegible at 16px, impossible to localise, dirt when scaled down.

And trademarks — which no redistributable library can ship under any licence.
```

_~200 chars_

**5/11** _(image: three near-identical grey rock silhouettes with question marks — placeholder art,
not library glyphs)_

```
Five fabric rolls drawn five ways. Three snack wrappers. Four bridges.

And three rocks nobody could tell apart. One was probably Olumo. One probably Zuma. One probably
Aso. Three real, different places. Nobody had written down which was which.
```

_~250 chars_

**6/11**

```
38 of the files were still named Group-6, Group-7, Group-37.

That is not an inconsistent naming convention. It is the absence of one, preserved through every
export and handover.
```

_~180 chars_

**7/11**

```
And the archive labelled "SVG sources" contained PNG renders.

The entire vector inheritance of an 86-icon library was 18 drawings.
```

_~135 chars_

**8/11**

```
Obvious move: rename the files, normalise the strokes, re-export, ship 86 icons. Two weeks. Good
number.

We rebuilt instead, and changed what qualifies for release.

32 icons pass every check today. That is the library.
```

_~235 chars_

**9/11** _(image: `talking-drum` on the 24-unit grid, live area marked)_

```
24×24 canvas. 2-unit live area, measured on true curve bounds — cubics solved for extrema, so a
bulging curve is caught even when its endpoints are inside.

1.5 stroke. Round caps. 1.5-unit minimum counter so nothing fills in at 16px.
```

_~235 chars_

**10/11**

```
The system specifies four weights. One is drawn.

I will not produce the others by raising stroke-width. A real weight redistributes mass and
re-solves counters — at 2.0, several of these constructions violate the counter minimum.

Drawn, not derived.
```

_~250 chars_

**11/11** _(image: the status page screenshot)_

```
And we publish what we have not drawn: 1 held, 55 in backlog, 3 weights
undrawn, 0 illustrations, 0 confirmed local names.

Every number computed from the repo at build time.

MIT. icons.neustackstudio.com
```

_~235 chars. Tight — re-count after substitution._

---

## Reply bank

Threads generate the same five replies. Pre-written so nobody improvises a promise at 11pm.

**"only 32? that's nothing"**

```
Correct, and deliberate. The alternative was 86 drawings that could not sit in one toolbar. The
backlog is public: icons.neustackstudio.com/status
```

**"add bold pls"**

```
Not by thickening these — at 2.0 several of these constructions break the 1.5-unit counter minimum.
It has to be drawn. On the roadmap, no date, because a date would be invented.
```

**"why not just use the noun project"**

```
Genuinely, do — it has more African icons than we ever will. What it does not have is
32 of them on one grid, one stroke, one licence and one naming process. That is the
whole difference.
```

**"is this only Nigeria?"**

```
Today, yes. Region is a first-class field in the metadata, so other countries slot in rather than
getting bolted on. A Ghanaian concept is in the backlog while we settle the region-tagging
convention first.
```

**"can I use it commercially?"**

```
Yes. MIT, no attribution required.
```

**"[icon] is named wrong"**

```
Thank you — that is our highest-priority bug class, ahead of every feature. Please open an issue,
you do not need to be certain:
github.com/neustackdesign/african-icon-library/issues
```

---

## Rules

- **Never claim four weights.** Not in a post, not in a reply, not in a quote-tweet.
- **Never say a channel is live before it is.** No "coming soon" on anything in Figma review.
- **Substitute the counts the morning of, from repository state.** Then re-count characters.
- **One thread per phase.** Do not re-post the same thread with a new hook.
- **Do not argue about the number of icons.** State the reason once and link the status page.
