# GitHub release notes

Two variants: the technical preview (`v0.2.0`, phase 1) and the expanded release (`v0.2.0`,
phase 4). Both mirror `CHANGELOG.md` rather than inventing a second voice — if these and the
changelog disagree, the changelog wins and this file is wrong.

Release-note convention: what landed, what is deliberately held back, what is not done. The third
section is the one nobody else writes and the one that makes the first two believable.

---

## Variant A — `v0.2.0` (phase 1, technical preview)

**Release title:** `v0.2.0 — the rebuild`

---

The first release of the rebuilt library: **32 icons across 7
categories, one drawn weight, MIT.**

This release follows the August 2026 audit, which reviewed 86 drawings from the earlier set and
found no shared grid, no stroke logic, baked-in type and trademarks, duplicate concepts, and 38
files still named `Group-N`. Rather than re-ship that set with the files renamed, this repository
releases only what passes every automated check and states plainly what has not been drawn.

### Added

- **32 released icons**, all `regular` weight, all passing the full validation suite.
- **`@african-icon-library/icons`** — canonical SVG assets plus a renderer that composes the root
  element from one template, so `viewBox`, paint and caps cannot drift between assets.
- **`@african-icon-library/metadata`** — a typed schema for icons, categories, regions and the
  release pipeline, with runtime validation and a shared search implementation.
- **`@african-icon-library/react`** — one generated component per icon, hook-free, so they work
  unchanged in React Server Components.
- **Figma plugin** — offline by declaration (`"allowedDomains": ["none"]`) and by build, which
  fails if any networking call reaches the bundle. Search, category filter, weight selection, and
  insertion of editable vector frames.
- **Website** for `icons.neustackstudio.com`: browser, per-icon pages, downloads with published
  checksums, spec, status, licence, contributing and changelog.
- **Validation suite** covering `viewBox`, true geometric bounds, prohibited text, hard-coded
  colour, unsupported elements and attributes, duplicate ids, metadata/asset agreement and
  weight-variant completeness.
- **Scripts** for ingestion, optimisation, preview sheets, code generation, drift verification and
  deterministic release builds.

### Held back deliberately

- **1 drawing is held from release**, each with a recorded blocker. One is held
  because the audit could not confirm its referent — releasing it would assert a name nobody has
  verified. One is held because its geometry leaves the 2-unit live area and needs a redraw rather
  than a rescale.
- **55 audited concepts remain in the backlog.** Their raster originals do not meet
  the spec and are not shown anywhere in the public product.
- **3 weights are specified and undrawn** (`thin`, `bold`, `fill`). They will not be faked by
  changing a stroke width.
- **The illustration tier has zero pieces.** It exists in the architecture and nowhere else.
- **Zero local-language names are confirmed**, so the website makes no local-name claim at all.

### Not done

- The website is not deployed.
- Nothing is published to the Figma Community.
- The Figma plugin is not in the plugin store.

Those need account access and are itemised in `RELEASE_CHECKLIST.md`.

### Verifying this release

```sh
npm ci
npm run check
```

That runs lint, formatting, icon validation, generated-output verification, type-check, tests and
the full build. CI runs exactly the same thing.

The attached artefacts carry SHA-256 checksums in `manifest.json`. Check them:

```sh
shasum -a 256 african-icon-library-icons-0.2.0.zip
```

### The most useful thing you could do with this release

Not star it. Tell us a name is wrong.

Zero local-language names in this library are confirmed. If you speak Yoruba, Hausa, Igbo or
Nigerian Pidgin and would review a 32-row list of proposed names, open an issue or
email `icons@neustackstudio.com`. A misnamed cultural referent is the highest-priority bug class
in this project, ahead of every feature on the roadmap.

---

## Variant B — `v0.2.0` (phase 4, expanded release)

**Release title:** `v0.2.0 — more of the set, same floor`

---

**32 released icons across 7 categories.** Still one drawn weight.
Still MIT.

Every icon added in this release passed the same gate as the first ones: `npm run validate` clean,
geometry inside the 2-unit live area measured on true curve bounds, no text, no hard-coded colour,
metadata record complete, and — where the name asserts a cultural referent — that referent
confirmed by a person rather than assumed by us.

### Added

- New icons in this release: _list the ids, kebab-case, alphabetical, with a one-line description
  each. Do not summarise them as "and more"._
- _Any new category that now contains released icons._
- _Any local-language name that moved from `pending` to `confirmed`, naming the language. This is
  a release-worthy event on its own — say who confirmed it if they are happy to be named._

### Changed

- _Any icon whose id changed, with the old id, the new id and the reason. An id change is a
  breaking change for anyone importing it; say so plainly._

### Still held back

- **1 drawing held**, blockers recorded.
- **55 audited concepts in the backlog.**
- **`thin`, `bold` and `fill` remain undrawn.** No date. They will be drawn, not derived.
- **Illustration tier: still zero pieces.**

### Now available

- The website is live at `https://icons.neustackstudio.com`.
- The Figma Community file is published.
- The Figma plugin is in the Community.

_Delete any line above that is not true on the day you publish. This section is the one most likely
to get ahead of reality._

### Upgrading

```sh
npm install @african-icon-library/react@0.2.0
```

If any id changed, the change is listed above and the old component name is gone. There is no
alias shim — a wrong name that keeps working is a wrong name that spreads.

---

## Conventions for every future release

- **Three sections, always: Added, Held back deliberately, Not done.** The last two are not
  optional and not a weakness. They are the reason anyone believes the first.
- **Never announce a channel in release notes before it is live.** Not "coming to the Figma
  Community" — nothing, until it is there.
- **Never state a count by hand.** Substitute it from `packages/metadata/src/data/icons.json`.
- **A confirmed local name gets its own bullet**, with the language named. It is more significant
  than most drawings.
- **An id change is a breaking change.** Say the old id, the new id and why, in the release notes,
  not just in the diff.
