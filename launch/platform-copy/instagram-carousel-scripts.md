# Instagram carousel scripts

Two carousels. Carousel 1 runs in phase 2 (Wed 23 September 2026), carousel 2 in phase 4
(Thu 22 October 2026).

**Format:** 1080 × 1350 (4:5). Instagram gives 4:5 the most vertical space in feed. 10 slides max;
both scripts use fewer, because a carousel nobody finishes is a carousel that did not work.

**Design:** paper `#FAF9F6`, ink `#16150F`, accent `#2E7D4F` used once per carousel. 120 px safe
margin on all sides — Instagram's UI overlays the bottom on some surfaces. Real drawings only,
exported from the repository per
[`../media-kit/asset-manifest.md`](../media-kit/asset-manifest.md).

**Type:** minimum 40 px body at 1080 wide. Headlines 72–96 px. If the text needs to be smaller, it
is the wrong text.

**Accessibility:** every carousel needs alt text per slide, written in the post's accessibility
settings. Instagram's auto-alt does not read typeset text usefully.

---

## Carousel 1 — "Nobody drew the danfo" (phase 2, 8 slides)

The introduction. Assumes the viewer has never heard of the project and does not care about icon
grids.

### Slide 1 — the hook

**Visual:** `danfo` at 600 px, ink on paper, dead centre. Nothing else on the slide.

**Text (bottom third):**

```
Nobody had drawn this.
```

### Slide 2 — what it is

**Visual:** the same glyph, smaller, top. Body text below.

```
A danfo. The yellow minibus that carries most of Lagos.

It has never appeared as an icon in any major open-source library.
```

### Slide 3 — the pattern

**Visual:** four glyphs in a 2 × 2 grid — `suya`, `talking-drum`, `agogo`, `naira-note`.

```
Neither had a suya skewer. Or a talking drum. Or an agogo. Or a naira note.
```

### Slide 4 — the consequence

**Visual:** a generic bowl glyph beside `jollof-rice`, labelled `what usually ships` and
`what it is`.

```
So products approximate.

A generic bowl for jollof rice. An intercity coach for a danfo. A dollar sign in front of a naira
figure.
```

### Slide 5 — what we did

**Visual:** the contact sheet — every released icon, on paper, in a grid.

```
32 of them. Drawn properly. MIT licensed. Free for commercial use.
```

### Slide 6 — the grid

**Visual:** `talking-drum` on the 24-unit grid with the 2-unit live area marked in accent colour.

```
One 24-pixel canvas. One 1.5 stroke. Round caps and joins.

Every drawing measured against the same rules, by a script, on every commit.
```

### Slide 7 — the honest slide

**Visual:** typeset table, no illustration.

```
And here is what we have not drawn:

3 of 4 weights
1 drawing held from release
55 concepts in the backlog
0 illustrations
0 confirmed local-language names
```

### Slide 8 — the ask

**Visual:** `talking-drum`, with `gangan` and `dùndún` beneath it, both greyed, both marked
`pending`.

```
Two Yoruba names for this drum came out of our audit. They are related instruments, not synonyms.
Nobody has told us which one we drew.

If you know — that is the most useful thing anyone could give this project.
```

### Caption

```
There is a yellow bus in Lagos called a danfo. It carries most of the city, and it has never been
drawn as an icon in any major open-source library. Neither has a suya skewer, an agogo, or a naira
note.

So we drew them. 32 icons for African life, on one 24-pixel grid, MIT licensed, free
for commercial use with no attribution required.

The set is small on purpose. We started by auditing 86 drawings from an earlier African icon set —
no shared grid, no stroke logic, letters baked into the artwork, and 38 files still named Group-N.
We rebuilt rather than renaming, and now a drawing only ships if it passes every automated check.

Everything we have not drawn is listed publicly, including the fact that zero local-language names
in the library are confirmed.

Link in bio. Nigeria first; the continent is the roadmap.
```

**Hashtags** (in the first comment, not the caption): `#designsystems #opensource #iconography
#nigeriandesign #lagosdesign #uidesign #figma`

---

## Carousel 2 — "The one we will not ship" (phase 4, 7 slides)

The follow-up. One idea, told slowly: the cap that will not be released. It is the single most
distinctive thing about the project and it deserves its own carousel rather than a slide.

### Slide 1

**Visual:** a plain paper slide, large type only.

```
There is a drawing in our repository that passes every check we have.

It will not ship.
```

### Slide 2

**Visual:** a silhouette placeholder of a cap, deliberately blurred or greyed. **Do not show the
held asset itself** — it is not in any generated surface and a test asserts that; a marketing image
must not be the exception.

```
It is a cap. Drawn to spec. Inside the live area. No text, no hard-coded colour, no transforms.
```

### Slide 3

**Visual:** the audit note, typeset as a quotation.

```
"Referent unclear — crown-on-brim could be several hats. Confirm before naming."

— the August 2026 audit
```

### Slide 4

```
Calling it fila would assert a specific Yoruba cap on the strength of a shape.

It might be right. Nobody has confirmed it.
```

### Slide 5

**Visual:** a code block, monospace on paper.

```
culturalReview: {
  required: true,
  status: 'pending'
}
```

```
So it is held — and not by a good intention. The metadata schema refuses to parse an icon whose
required review is outstanding. The data cannot contradict the claim.
```

### Slide 6

**Visual:** the three greyed rock silhouettes with question marks. Placeholder art, not library
glyphs.

```
The audit we inherited had three rocks nobody could tell apart. One probably Olumo, one probably
Zuma, one probably Aso.

"Probably" is how three places become one rock.
```

### Slide 7

**Visual:** the contact sheet.

```
32 icons and one honest gap, rather than 32 plus one wrong name.

MIT. icons.neustackstudio.com
```

### Caption

```
The most interesting file in our icon library is one you cannot use.

It is a cap. It passes every automated check — 24×24 canvas, inside the 2-unit live area, no text,
no hard-coded colour. And it is not released, because the audit that produced it could not identify
the object: "crown-on-brim could be several hats. Confirm before naming."

Shipping it as fila would assert a specific Yoruba cap on the strength of a shape. So it sits in
staging with the blocker recorded — held, not deleted, because the drawing is real work and the
block is a question rather than a verdict.

This is enforced rather than intended: our metadata schema refuses to parse an icon whose required
cultural review is outstanding. The claim is generated from the data, so the two cannot diverge.

If you know what that cap is, or you speak Yoruba, Hausa, Igbo or Nigerian Pidgin and would review
a list of proposed names with us — please get in touch. That is worth more to this project than any
drawing.

Link in bio.
```

---

## Rules

- **Never show a held drawing.** A test asserts held ids appear in no generated surface; a social
  image is not an exception. Use greyed placeholder art and say what it is.
- **Never show an icon that is not in the released set.** The audit's rocks, the Fela concept, the
  backlog — all placeholder art, all labelled as such.
- **The honest slide is not optional and does not go last.** It sits at position 7 of 8 in carousel
  1 so people reach it.
- **One ask per carousel**, and it is the local-name review.
- **Alt text per slide**, written by a person.
- **Substitute the tokens the morning of posting**, from repository state.
