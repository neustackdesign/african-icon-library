# Drawing spec — icon tier

Every released icon obeys this spec. Most of it is enforced by `npm run validate`; the parts a
script cannot judge are listed at the bottom as review criteria.

## The canvas

- 24 x 24 units. `viewBox="0 0 24 24"`, always, with no exceptions and no alternate sizes.
- A 2-unit live area. All geometry sits within `x [2, 22]` and `y [2, 22]`.
- The stroke halo must stay inside the canvas: a centreline at 23.5 with a 1.5 stroke clips, and
  the validator rejects it.

The live area is what makes icons sit level beside one another. It is measured on the drawing's
true bounds — curves are solved analytically, so a cubic that bulges past the edge is caught even
when both its endpoints are comfortably inside.

## Stroke

- `stroke="currentColor"` on the root. Never a colour value, never a gradient, never a `url()`.
- `fill="none"` on the root. Fills belong to the future `fill` weight, not to line weights.
- `stroke-width="1.5"` at 24 units.
- `stroke-linecap="round"` and `stroke-linejoin="round"` everywhere.
- Minimum 1.5 units of counter between parallel strokes, so the glyph does not fill in at 16 px.

## Geometry

- Anchor to whole and half units. Snap key shapes to the keylines, then correct optically.
- 2-unit outer corner radius as the default.
- One object per glyph. No scenes, no ground lines, no second subject.
- At most three levels of internal detail. If a concept needs more, it is illustration-tier work,
  not an icon.
- No `transform` attributes. Bake the transform into the coordinates — a transform hides the real
  geometry from bounds checking, and the validator rejects it.

## Content

- **No letters or numerals.** Type is illegible at icon size, cannot be localised, and turns to
  dirt in a scaled-down UI. The naira mark is the sole exception, and it is drawn as geometry.
- **No brands or trade dress.** Not a logo, not a distinctive bottle silhouette, not a registered
  emblem. A distributed library cannot ship those.
- **No identifiable real people.** Likeness rights do not survive redistribution.
- **No `id`, `class`, `style` or `data-` attributes.** Element ids collide when several icons are
  inlined into one document.

## Supported markup

Allowed elements: `svg`, `g`, `path`, `circle`, `ellipse`, `rect`, `line`, `polyline`, `polygon`.

Everything else fails validation. `script`, `image`, `use`, `filter`, `mask`, `pattern`,
`clipPath`, `style` and the animation elements are rejected explicitly — a distributed asset must
not be able to execute, fetch or embed.

## Weights

The system defines four weights: `thin`, `regular`, `bold`, `fill`. Weight lives in metadata and
in the directory layout, never in a filename suffix.

A weight is a separately drawn asset. It is not produced by changing `stroke-width` on another
weight: a real weight redistributes mass, re-solves counters, and often changes how much detail
survives. The validator enforces this in the only way a script can — a weight ships for the whole
set or not at all. If one icon has a `bold` and another does not, the build fails.

As of v0.1.0 the library ships `regular` only. The other three are specified and undrawn.

## Naming

- Lower-case kebab-case ids: `talking-drum`, never `Talking Drum` or `talking-drum-line`.
- No `Line` / `Outline` suffixes. Those described a drawing style that no longer varies.
- The id names the concept, not the file. One concept, one id, across every weight and tier.
- A name that asserts a cultural referent needs that referent confirmed. See
  [cultural-review.md](./cultural-review.md).

## What a script cannot check

These are review criteria for a human:

- **Does it read at 24 px?** Run `npm run preview` and look at `previews/proof-strip-24.svg`. If
  the glyph becomes a smudge, no amount of spec compliance saves it.
- **Is it the clearest metaphor for the concept?** One metaphor per glyph. A stock exchange is a
  portico _or_ a rising chart, not both.
- **Is it distinct from its neighbours?** Three rocks nobody can tell apart are one rock.
- **Is the construction shared with its family?** Five fabric rolls should share a roll and differ
  only in motif.
- **Is the referent right?** A drawing can be beautiful and still be the wrong object.
