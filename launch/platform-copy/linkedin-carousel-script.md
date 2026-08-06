# LinkedIn carousel script

Phase 4, Tuesday 27 October 2026. A PDF document post — LinkedIn renders multi-page PDFs as a
swipeable carousel.

**Format:** 1200 × 1200 px per page, exported as PDF. 10 pages. Square, because LinkedIn crops
4:5 and 1:1 most predictably in-feed.

**Design:** paper `#FAF9F6`, ink `#16150F`, one accent `#2E7D4F`. 100 px margin on every side —
LinkedIn's page-number chrome sits bottom-right and eats about 80 px. Real drawings only, exported
from the repository. No stock photography and no mock-up screenshots.

**Rule for every page:** one idea, under 25 words of body text, and at least one real glyph
visible. If a page needs a paragraph, it is two pages.

See [`../social-assets/README.md`](../social-assets/README.md) for the export specification and
[`../media-kit/asset-manifest.md`](../media-kit/asset-manifest.md) for which script produces the
source art.

---

## Page 1 — cover

**Visual:** `danfo` at 400 px on paper, centred, ink colour. Nothing else.

**Headline (large):**

```
We audited 86 African icons.
We shipped 32.
```

**Footer, small:**

```
African Icon Library · open source · MIT
```

---

## Page 2 — the gap

**Visual:** four real glyphs in a row at 120 px — `danfo`, `suya`, `talking-drum`, `naira-note`.

**Headline:**

```
None of these had ever been drawn in a major open-source icon library.
```

**Body:**

```
Not unreasonably. They are not in the interface vocabulary of the places most icon libraries are
drawn.
```

---

## Page 3 — the workaround

**Visual:** a generic bowl glyph beside `jollof-rice`, same size, a thin rule between them. Label
the left one `what ships today`, the right one `what it is`.

**Headline:**

```
So products approximate.
```

**Body:**

```
A generic bowl for jollof rice. An intercity coach for a danfo. A dollar sign in front of a naira
figure.
```

---

## Page 4 — the audit

**Visual:** a plain typeset list, no illustration. Let it be a wall of findings.

**Headline:**

```
We started by auditing what already existed. 86 drawings.
```

**Body, as a list:**

```
No shared grid
No stroke logic
Type baked into the artwork
Trademarks
Five fabric rolls drawn five ways
Three rocks nobody could tell apart
38 files still named Group-N
```

---

## Page 5 — the rocks

**Visual:** three near-identical rock silhouettes, greyed out, with question marks over them.
Draw these as flat placeholder shapes — **do not use any real library glyph here**, because none of
those rocks is in the library.

**Headline:**

```
One was probably Olumo. One probably Zuma. One probably Aso.
```

**Body:**

```
Three genuinely different places, flattened into three near-identical drawings. Nobody had recorded
which was which.
```

---

## Page 6 — the decision

**Visual:** `86` struck through in the accent colour, `32` set large beside it.

**Headline:**

```
We could have renamed the files and shipped 86.
```

**Body:**

```
We rebuilt instead, and changed what qualifies for release.
```

---

## Page 7 — the gates

**Visual:** `talking-drum` on the 24-unit grid with the 2-unit live area marked in the accent
colour. Generated from the real asset, not redrawn.

**Headline:**

```
A drawing ships only if it survives four gates.
```

**Body:**

```
Referent confirmed. Inside the canvas. Inside the 2-unit live area. No cultural hold. Three of the
four are measured, not remembered.
```

---

## Page 8 — enforced, not documented

**Visual:** a terminal-style block, monospace, on paper.

```
$ npm run validate

viewbox              ✓
bounds-canvas        ✓
bounds-live-area     ✓
prohibited-text      ✓
hard-coded-colour    ✓
unsupported-element  ✓
missing-metadata     ✓
missing-weight-variant ✓
```

**Headline:**

```
Every rule is a command, not a style guide.
```

**Body:**

```
It runs in CI on every asset and exits non-zero. A document loses to a deadline. A failing build
does not.
```

---

## Page 9 — the honest page

**Visual:** the status table, typeset plainly. No illustration.

**Headline:**

```
And we publish what we have not drawn.
```

**Body, as a table:**

```
Released             32
Held from release    1
In the backlog       55
Weights specified    4
Weights drawn        1
Illustrations        0
Confirmed local names 0
```

**Footnote:**

```
Every number computed from the repository at build time.
```

---

## Page 10 — the ask

**Visual:** `talking-drum` at 300 px, with `gangan` and `dùndún` set beneath it, both greyed, both
labelled `pending`.

**Headline:**

```
The most useful thing you could give us is not a drawing.
```

**Body:**

```
Zero local-language names in this library are confirmed. If you speak Yoruba, Hausa, Igbo or
Nigerian Pidgin, we would like half an hour of your time.
```

**Footer:**

```
icons.neustackstudio.com · MIT · icons@neustackstudio.com
```

---

## The post text that accompanies the PDF

Keep it short. The carousel is the content.

---

Ten slides on why our African icon library ships 32 icons instead of 86.

Short version: we audited an existing set, found no shared grid, no stroke logic, type baked into
the artwork, trademarks, and 38 files still named `Group-N`. Renaming them would have produced a
bigger library and a worse one.

The slide I would point at is number nine — the counts of what we have _not_ drawn. It is on the
website too, computed from the repository at build time so it cannot quietly go stale.

MIT. icons.neustackstudio.com

#designsystems #opensource

---

## Accessibility

- Every page needs alt text in the post's document description. LinkedIn does not read PDF page
  content to screen readers.
- Minimum body type 32 px at 1200 × 1200. The carousel is read on phones.
- No colour-only signalling anywhere. Page 3's comparison needs its labels, not just position.
- The struck-through `86` on page 6 needs the word `86` to still be legible under the rule.
