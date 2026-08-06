# X — standalone short posts

A bank of single posts, for the days between threads. Each stands alone, each is under 280
characters after substitution at plausible counts, and each makes one point.

**Rules for all of them:**

- One idea per post. If it needs a second sentence to explain the first, it is a thread.
- Never claim four weights. Never claim an unlaunched channel.
- An image only if the image is a real drawing or a real screenshot.
- Do not schedule more than three of these a week. This is a small library, not a content machine.

Recount characters after token substitution.

---

## Phase 2 — the site goes live

**Site live**

```
You can now search a danfo, a suya skewer and a talking drum, and copy the SVG.

32 open-source icons for African life. One 24px grid. MIT.

icons.neustackstudio.com
```

**The status page**

```
Our website has a page whose only job is to be unflattering.

1 drawing held from release. 55 concepts in the backlog. 3 of 4
weights undrawn. 0 illustrations. 0 confirmed local names.

Every number computed from the repo at build time.
```

**The empty state** _(image: the empty-state screenshot)_

```
Search our icon library for something we do not have, and it tells you the library ships
32 icons so far.

Most searches will come back empty. That is the honest state of a set this size. Hiding it just
moves the disappointment later.
```

---

## Phase 3 — the plugin

**Plugin live**

```
Figma plugin is live. Search 32 icons for African life, place them as editable vectors.

It cannot reach the network. Manifest declares "allowedDomains": ["none"], and the build fails if
fetch, XHR, WebSocket, EventSource or an http URL reaches the bundle.
```

**The offline claim**

```
Most plugins have a privacy policy.

Ours has a failing build: apps/figma-plugin/build.ts scans both bundles for fetch, XMLHttpRequest,
WebSocket, EventSource, importScripts and absolute http(s) URLs, and refuses to build if it finds
one.

Source is public. Try to break it.
```

**The struck-through weights** _(image: the weight picker)_

```
Two reviewers told us to hide the weights we have not drawn.

The picker shows thin, bold and fill struck through instead. The library has drawn one weight of
the four it specifies, and finding that out after adopting a set is worse than finding out in a
dropdown.
```

---

## Evergreen — the icons

**One icon, one fact** — a repeatable format. Post the glyph, name what it is, name one drawing
decision. Never more than four of these in a month.

```
danfo — the yellow minibus that carries most of Lagos.

Drawn as one object, no scene, no ground line, no second subject. At most three levels of internal
detail, because a fourth stops reading at 24px.

MIT. icons.neustackstudio.com
```

```
agogo — paired bells joined by a sprung handle.

The hard part was the handle. A spring is a curve that has to survive at 16px without becoming a
smudge, and the counter between the coils has to stay above 1.5 units or it fills in.
```

```
suya — spiced meat, skewered, over coals.

Every icon in this library paints with currentColor. No hex, no rgb(), no gradients. The heat is
implied by geometry, because a colour would not survive a dark theme.
```

```
naira-note.

The library bans letters and numerals inside a glyph — type is illegible at icon size and cannot
be localised. The naira mark is the single exception, and it is drawn as geometry, not set as a
character.
```

**The grid** _(image: `talking-drum` on the 24-unit grid)_

```
24×24 canvas. 2-unit live area. 1.5 stroke, round caps, 1.5-unit minimum counter.

The live area is measured on true curve bounds — cubics solved for extrema — so a curve that bulges
past the edge is caught even when both its endpoints are inside.
```

---

## Evergreen — the argument

**The weights**

```
"Just increase the stroke width for bold."

At 2.0 several of these constructions violate the 1.5-unit counter minimum. At 1.0 the counters
open up and internal detail has to go.

A weight redistributes mass. It is icon design, not a build step.
```

**The naming rule**

```
There is a drawing in our staging folder that passes every automated check and will not ship.

It is a cap. The audit's note: "crown-on-brim could be several hats. Confirm before naming."

Calling it fila would assert a specific Yoruba cap on the strength of a shape.
```

**On the Noun Project**

```
The Noun Project has more African icons than we ever will, and you should use it.

What it does not have is 32 of them on one grid, with one stroke, one licence and one
naming process. Put six marketplace icons in a toolbar and you can see the seams.
```

**On Phosphor and Lucide**

```
Phosphor and Lucide draw the general interface set better than we ever will. Use them.

We draw the things they have no reason to draw — a danfo, a suya skewer, an agogo. Same 24px grid,
same 1.5 stroke, so they sit together.
```

**Group-N** _(image: a plain screenshot of the audit filenames)_

```
38 of the 86 drawings we audited were still named Group-6, Group-7, Group-37.

Three of them were rocks. One was probably Olumo, one probably Zuma, one probably Aso. Nobody had
written down which.

That is why our library ships 32 icons.
```

---

## The ask — post this more often than anything else

```
The most useful thing anyone could give this project is not a drawing.

Zero local-language names in our icon library are confirmed. If you speak Yoruba, Hausa, Igbo or
Nigerian Pidgin and would review a 32-row list, we would like half an hour.

icons@neustackstudio.com
```

```
gangan or dùndún?

Both came out of the audit as names for the drum we drew. They are related instruments, not
synonyms. Both are marked pending in our metadata and neither is shown on the site.

If you know, tell us. That is the whole ask.
```

---

## Posts that must never be written

- Anything starting "Excited to share".
- A milestone post about stars, downloads or followers.
- "Coming soon" about anything in Figma review.
- A count that was not substituted from repository state that morning.
- A reply that promises a weight, an icon or a date that is not in the repository.
- A quote-post of praise with no added information. Say thank you in the replies instead.
