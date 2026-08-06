# Visual QA — African Icon Library v0.2.0

Reviewed at 16, 20, 24, 32 and 48 px on paper and ink canvases, with every icon rasterised at its
real pixel size and magnified 9× with no interpolation. **That magnified bitmap is the evidence
used below**, not the scaled vector — a vector shown large flatters a drawing that dissolves at the
size people actually use.

Every released icon passes every automated rule. That is not what this review is about. Geometry
compliance says a drawing sits inside the canvas; it says nothing about whether it reads as the
object it names, or whether it belongs to the same family as the icon beside it.

## Method

| Board                                 | What it answers                                            |
| ------------------------------------- | ---------------------------------------------------------- |
| `complete-set-{16,20,24,32,48}px.svg` | Does the set hold together at each size?                   |
| `category-boards/*.svg`               | Does each category read as a group, across all five sizes? |
| `dark-canvas-board.svg`               | Do any drawings thicken or fill in on ink?                 |
| `optical-scale-board.svg`             | Bounds, optical centre and ink mass against the set median |
| `metrics.json`, `coverage.json`       | The numbers behind the judgements                          |

**Ink coverage** is measured by rasterising each icon at 48 px on white and integrating darkness
per pixel, so antialiased edges count partially — which is what the eye does. The set median is
**19.12%**. A figure far from it reads heavier or lighter than its neighbours regardless of what the
grid says.

## Result

| Verdict                     | Count |
| --------------------------- | ----- |
| PASS                        | 18    |
| PASS WITH MINOR CONCERN     | 8     |
| REWORK BEFORE PUBLIC LAUNCH | 4     |
| REMOVE FROM RELEASE         | 2     |

**Recommended release: 30 icons.** Two drawings are removed below. The set is stronger at 30 than at
32, and the count was never the product.

---

## REMOVE FROM RELEASE

### `ludo` — 39.10% ink, 2.04× the median

The heaviest drawing in the set by a wide margin, and the only one that is more than twice the
median. At 16 px the board collapses into a solid dark rectangle with no legible internal
structure; at 20 px it reads as a window frame or a panelled door, not a game. The internal grid is
the entire content of the icon, and the internal grid is exactly what a 16-pixel raster cannot hold.

There is no version of this that survives: a ludo board is _defined_ by a 15×15 cell grid, so
simplifying it enough to read at 16 px stops it being ludo.

It is also the weakest cultural claim in the set. Ludo is played across the world and descends from
Indian pachisi. It is popular in Nigeria, but popularity is not specificity — this is a generic
object carrying a Nigerian label, which is precisely the failure the library exists to correct.

Two independent reasons, either sufficient. Removed.

### `chin-chin-pack` — interior detail becomes noise

At 16 px the interior collapses into a scribble; at 20 px it reads as a box containing static. The
outer bag silhouette is fine, but the bag is not the icon — the chin chin is, and it is unreadable.

The concept deserves a place. This drawing does not earn it. Removed pending a redraw that puts
the chin chin outside the pack, or drops the pack entirely.

---

## REWORK BEFORE PUBLIC LAUNCH

### `passport` — 28.15% ink, 1.47× median

Reads as an undifferentiated dark document at 16 px; the emblem is a blob. It is also generic — a
passport looks the same everywhere, and nothing here says Nigeria. Either make the emblem legible
at 16 px or make the object specific. As drawn it is neither.

### `naira-note` — 24.06% ink, 1.26× median

The ₦ inside the note fills in at 16 px. The single element that makes this a _naira_ note is the
first thing the raster destroys, leaving a generic banknote. Enlarge the ₦ and drop the guilloche
detail; `naira-sign` proves the glyph works at 16 px when given room.

### `shekere` — 24.91% ink, 1.30× median

The netting resolves into a regular chequerboard, so at both small sizes it reads as a football or
basketball. Given that `football-jersey` is in the same release, this collision is worse than it
looks in isolation. Fewer, larger net intersections and a visible gourd neck would fix it.

### `film-clapper` — legible, but wholly generic

The only icon in the set with no Nigerian specificity whatsoever. A clapperboard is a global
film-industry object; Nollywood is the _justification_ but not the _drawing_. It reads perfectly at
every size, which is why this is rework and not removal — but shipping it as-is means the library
contains an icon indistinguishable from any stock set.

---

## PASS WITH MINOR CONCERN

| Icon             | Ink            | Concern                                                                                                                                                                                |
| ---------------- | -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pos-terminal`   | 27.01% (1.41×) | Reads as a clipboard at 16 px. The keypad is the identity and it is the first thing lost. Culturally the POS agent economy is a strong subject; the drawing is not yet specific to it. |
| `aso-oke-fabric` | 22.82% (1.19×) | At 16 px the silhouette — a rounded rectangle divided into vertical bands — is nearly identical to `nigeria-flag`. Two icons in one set should not share a silhouette.                 |
| `broom`          | 20.42% (1.07×) | The bound head renders as a solid block; the whole reads as a mop or a lamp. The Nigerian short broom is distinctive and that distinctiveness is not surviving.                        |
| `agogo`          | 13.93% (0.73×) | Bounds are 13.1 × 12.6 against a 20-unit live area — the smallest footprint in the set, so it looks undersized beside its neighbours. Abstract at 16 px.                               |
| `canoe`          | 13.43% (0.70%) | The hull-plus-diagonal reads ambiguously against `calabash` and `jollof-rice`, all of which present as an open curved vessel at 16 px.                                                 |
| `oil-pumpjack`   | 17.17% (0.90×) | Three overlapping members collide at 16 px into an indistinct diagonal mass.                                                                                                           |
| `jollof-rice`    | 13.23% (0.69×) | 7.8 units tall against 20 available — the flattest drawing in the set. Optically small in a row.                                                                                       |
| `suya`           | 15.04% (0.79×) | 6.5 units wide — the narrowest. Correct for a skewer, but it reads as a smaller icon than its neighbours.                                                                              |

None of these block a launch. All are worth a pass before the set is presented as finished.

---

## PASS

`akara` · `ata-rodo` · `beaded-crown` · `calabash` · `clay-pot` · `cocoa-pod` · `coral-beads` ·
`danfo` · `football-jersey` · `jerry-can` · `kerosene-lantern` · `market-umbrella` · `naira-sign` ·
`nigeria-flag` · `okada` · `pepper-soup` · `talking-drum` · `train-ticket`

These read without a label at 16 px, sit within 0.7–1.3× the median ink mass, and share the family's
corner treatment, cap and join behaviour. `danfo`, `okada`, `suya`, `talking-drum`, `calabash`,
`coral-beads` and `kerosene-lantern` are the strongest in the set — specific, immediately readable,
and not substitutable with a generic equivalent.

---

## Family-level observations

**Stroke density is broadly consistent.** 28 of 32 sit within 0.7–1.3× the median. The outliers are
the four flagged above, and they are outliers because of internal detail, not stroke width — the
1.5-unit stroke is honoured everywhere.

**Caps and joins are uniform.** Round throughout, with no exceptions found on any board.

**Corner and curve treatment is consistent** across the food, vessel and transport groups. The two
groups that feel drawn to a different brief are `identity-state` (flat, document-like, rectangular)
and `music-art-play` (irregular, organic). That is legible as intent rather than as drift.

**Optical scale is the weakest family property.** Bounding boxes range from 6.5 × 19.0 (`suya`) to
19.4 × 12.8 (`okada`). Vector-correct, optically uneven: a row mixing them looks like mixed sizes.
A future pass should normalise perceived area rather than bounding box.

**Cultural specificity splits the set.** Strongly specific: `agogo`, `akara`, `aso-oke-fabric`,
`ata-rodo`, `beaded-crown`, `calabash`, `clay-pot`, `cocoa-pod`, `coral-beads`, `danfo`,
`jollof-rice`, `kerosene-lantern`, `naira-note`, `naira-sign`, `nigeria-flag`, `okada`,
`pepper-soup`, `shekere`, `suya`, `talking-drum`. Generic objects carrying a Nigerian label:
`film-clapper`, `passport`, `train-ticket`, `jerry-can`, `football-jersey`, `pos-terminal`,
`market-umbrella`, `broom`, and the removed `ludo`. That ratio — roughly two-thirds specific — is
defensible for a first release, but the generic tier should not grow.

**No drawing thickens or fills on the dark canvas.** Stroke-only construction with no fills means
light-on-dark behaves identically to dark-on-light.

## What was not assessed here

Local-language naming accuracy and referent confirmation are cultural questions, not visual ones.
They remain open and are tracked separately; nothing in this review substitutes for a Nigerian
reviewer confirming that an object is what the metadata says it is.
