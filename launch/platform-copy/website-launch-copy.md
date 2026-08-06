# Website launch copy

For `icons.neustackstudio.com`. Phase 2.

**The constraint that governs this file:** the site derives every number from
`packages/metadata` at build time, via `LIBRARY` in `apps/web/lib/site.ts`. Copy that names a count
must interpolate from there, never hard-code. Where this document shows `32`, the
implementation should read `LIBRARY.iconCount`; where it shows `7`,
`LIBRARY.categoryCount`. Same for the rest. If a piece of copy cannot be derived, rewrite the copy
rather than typing the number.

---

## Home page

### Hero

**Headline**

```
Icons for African life.
```

**Sub-headline**

```
32 icons drawn on one 24-pixel grid. One weight. MIT licensed. Nigeria first; the
continent is the roadmap.
```

**Primary action:** `Browse the icons` — scrolls to the browser
**Secondary action:** `Download the set` — `/downloads`
**Tertiary, quiet:** `Read the spec` — `/spec`

**The honest line, directly under the actions, not in a footer:**

```
The set is small on purpose. 1 drawing is held from release, 55
concepts are in the backlog, and three of the four specified weights are not drawn. All of it is on
the status page.
```

### Browser section intro

```
Search across names, ids and keywords. Filter by category — only categories that actually contain
icons are offered. Click any icon to copy its SVG or open its page.
```

**Search placeholder:** `Search jollof, danfo, drum…`

**Result count line (live region):** `{n} of 32 icons`

**Weight status line:** `weight: regular · not drawn yet: thin, bold, fill`

**Empty state:**

```
No icon matches "{query}".

The library ships 32 icons so far, which means most searches will come back empty —
that is the honest state of a set this size, not a bug in the search. If the thing you looked for
should exist here, tell us: it is the most useful signal we get.

[ Request it ]  [ Browse everything ]
```

**Copy-button states:** `Copy SVG` → `Copied` → on failure, `Could not copy — your browser refused
clipboard access. Select the SVG and copy manually.`

### "Why it is small" section

**Heading**

```
32 icons, and a public list of what is missing
```

**Body**

```
In August 2026 we audited 86 drawings from an earlier African icon set. It found two visual species
in one library, no shared grid, no stroke logic, letters and trademarks baked into the artwork,
five fabric rolls drawn five ways, and 38 files still named Group-N.

We could have renamed the files, normalised the strokes and shipped 86 icons. We rebuilt instead,
and the library now releases only what passes every automated check.

Every number on this site is computed from the repository when the site is built. Nothing here is
typed by hand, so nothing here can quietly go stale.
```

**Link:** `See the numbers` → `/status`

### "How it is built" section — three columns

**One grid, enforced**

```
24 × 24 canvas. A 2-unit live area measured on true curve bounds, so a cubic that bulges past the
edge is caught even when its endpoints are inside. Stroke 1.5, round caps and joins, minimum
1.5-unit counter. Checked by npm run validate, in CI, on every asset.
```

**Takes your colour**

```
Every paint is currentColor. No hex, no rgb(), no gradients, no url(). An icon inherits the colour
of the text around it with no overrides and no per-icon edits.
```

**Nothing you cannot inspect**

```
No text elements, no transforms, no element ids, no script, image, use, filter or mask. A
distributed asset should not be able to execute, fetch or embed, so the validator rejects anything
that could.
```

### Weights section

**Heading**

```
One weight is drawn. Three are not.
```

**Body**

```
The system defines thin, regular, bold and fill. Only regular exists.

The others will not be produced by raising stroke-width on these drawings. A weight redistributes
mass, re-solves counters and often changes how much detail survives — at 1.0 the counters open up
and some internal detail has to go; at 2.0 the 1.5-unit counter minimum is violated by several of
these constructions. That is icon design, not a build step.

The validator enforces the only part a script can prove: a weight ships for the whole set, or the
build fails.
```

### Cultural naming section

**Heading**

```
We do not name what we cannot confirm
```

**Body**

```
An icon whose name asserts a cultural referent does not ship until someone who knows that referent
confirms it. The metadata schema enforces it — an icon with an outstanding required review will not
parse — so the data and the claim cannot diverge.

One drawing is held on exactly those grounds today. It passes every automated check. It is a cap,
and the audit could not say which cap.

Local-language names carry an explicit review state. Not one is confirmed, so this site shows none
and makes no local-language claim at all.
```

**Link:** `Read the process` → the cultural-review doc

### The ask

Single call to action. Do not add a second.

```
The most useful thing you could give this project is not a drawing.

Zero local-language names in this library are confirmed. If you speak Yoruba, Hausa, Igbo or
Nigerian Pidgin and would review a 32-row list of proposed names, we would like to hear
from you.

[ Review a name ] → mailto:icons@neustackstudio.com
```

---

## Meta and social

**Home `<title>`**

```
African Icon Library — open-source icons for African life
```

**Home meta description (155 max)**

```
32 MIT-licensed icons for African life, drawn on one 24-pixel grid. One weight.
Nigeria first. Everything not yet drawn is listed publicly.
```

**Open Graph title**

```
African Icon Library
```

**Open Graph description**

```
Open-source icons for African life — a danfo, a suya skewer, a talking drum, a naira note. One
24-pixel grid, one drawn weight, MIT.
```

**Per-icon page `<title>`:** `{Icon name} icon — African Icon Library`

**Per-icon meta description:** `{description} Free SVG under MIT, drawn on a 24-pixel grid with a
1.5 stroke and currentColor paint.`

---

## Downloads page

**Heading:** `Downloads`

**Intro**

```
Every released icon, the metadata, and a checksum for each. The artefacts are built deterministically
— the same repository state produces byte-identical files — so the checksums below are worth
checking.
```

**Verify block**

```
shasum -a 256 african-icon-library-icons-0.2.0.zip
```

```
Compare the result against the SHA-256 in the table. If they differ, do not use the file, and tell
us: icons@neustackstudio.com
```

**npm block — before publication**

```
The packages are not on npm yet. Clone the repository, or download the zip above.
```

**npm block — after publication only**

```
npm install @african-icon-library/react
```

**Empty state, if the release artefacts are missing from a deployment**

```
The download artefacts have not been built for this deployment. Run npm run release:build, or fetch
them from the GitHub release.
```

---

## Status page

The page whose entire purpose is to be unflattering. Every figure computed at build time.

**Heading:** `Status`

**Intro**

```
Every number on this page is computed from the repository when this site is built. None of it is
typed by hand, which is the only reason it is worth reading.
```

| Row                               | Value              |
| --------------------------------- | ------------------ |
| Released icons                    | 32     |
| Categories with released icons    | 7 |
| Weights specified                 | 4                  |
| Weights drawn                     | 1 — `regular`      |
| Drawings held from release        | 1     |
| Audited concepts in the backlog   | 55  |
| Concepts merged by the audit      | 3                  |
| Concepts cut by the audit         | 4                  |
| Illustration-tier pieces released | 0                  |
| Local-language names confirmed    | 0                  |

**Footnote**

```
Held means the drawing exists and is blocked, with the blocker recorded. Backlog means there is no
drawing that meets the spec yet. They are different states and we do not blur them.
```

---

## Plugin section — three versions, use exactly one

**Before submission**

```
A Figma plugin is built and tested. It is not published to the Figma Community yet.

It runs entirely offline: the manifest declares "allowedDomains": ["none"], every icon is compiled
in at build time, and the build fails if any networking call reaches the bundle.
```

**In review**

```
The Figma plugin has been submitted to the Community and is in review. It is not installable yet.
```

**After approval**

```
[ Get the Figma plugin ]

Search and place icons without leaving Figma. Offline: no network access, no account, no tracking.
Icons arrive as editable vector frames, named from the library metadata.
```

Delete the other two versions when you switch. Do not leave a commented-out claim in the markup —
someone will uncomment it.

---

## Footer

```
African Icon Library v0.2.0 · MIT licensed · maintained by Neustack Design · Nigeria first,
the continent next.
```

Links: Browse · Spec · Downloads · Status · Changelog · Contributing · Licence · GitHub · Report an
issue · icons@neustackstudio.com

---

## 404

```
There is no page here.

There might not be an icon either — the library ships 32 icons, so plenty of things
that sound like they should exist do not yet.

[ Browse everything ]  [ See what is in the backlog ]
```

---

## Copy rules for whoever edits this site next

1. **Never type a count.** Interpolate from `LIBRARY` in `apps/web/lib/site.ts`. If you find
   yourself typing a digit that describes the library, stop.
2. **Never promise a weight that is not in `LIBRARY.weightsShipped`.**
3. **Never announce a channel before it is live.** There are three versions of the plugin section
   above for exactly this reason.
4. **Never show a local name that is not `confirmed`.** Pending names may feed search; they may not
   be rendered.
5. **The empty state says how many icons exist.** That is a feature. Do not replace it with a
   friendlier message that hides the number.
6. British English. `licence` the noun, `license` the verb.
