# Changelog

All notable changes to the African Icon Library are recorded here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and versions follow
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Versions below 1.0.0 mean what they say: the set is small, the weight system is incomplete, and
ids may still move as cultural reviews land. The API shape is stable; the contents are not.

## [Unreleased]

Nothing yet.

## [0.2.0] — 2026-08-06

The set doubles, and the provenance model grows up to describe how.

### Added

- **16 new released icons**, taking the library from 16 to **32**. Each was drawn on the 24-unit
  grid, measured against the 2-unit live area, and reviewed at 16, 20, 24, 32 and 48 px before
  release: `naira-sign`, `coral-beads`, `aso-oke-fabric`, `calabash`, `broom`, `beaded-crown`,
  `kerosene-lantern`, `market-umbrella`, `pos-terminal`, `jerry-can`, `okada`, `shekere`,
  `passport`, `akara`, `ata-rodo`, `clay-pot`.
- **Two previously empty categories are now populated.** `fashion-textiles` gains 2 icons and
  `culture-people` gains 5, taking categories in use from 5 to 7.
- **Category download packs.** One zip per category that actually contains released icons, with
  published SHA-256 checksums alongside the full release.
- **`npm run qa`** — an icon-level QA record: per-icon geometry, provenance and cultural-review
  state, a contact sheet at five sizes in both themes, before-and-after comparisons for superseded
  drawings, and a deterministic `bounds.json` baseline for regression diffing.
- **Governance layer** — issue forms for icon proposals, cultural corrections, bugs and local-name
  contributions; a PR template; CodeQL and dependency-review workflows; Dependabot; and
  `docs/governance/` covering versioning, deprecation, naming, rights, the cultural-review
  workflow, and the maintainer guide.

### Changed

- **`clay-pot` is released.** The v3 original reached y = 22.193 and failed the live-area check, so
  0.1.0 held it. It has been redrawn to fit. The superseded original is kept in
  `packages/icons/superseded/` for the record, and the ingest no longer overwrites an asset that a
  hand redraw has replaced.
- **Provenance now distinguishes three histories**, because collapsing them would misstate all
  three: `v3-audit-drawing` (descends from one of the audit's eighteen vector drawings),
  `v2-asset-redrawn` (the audit judged a raster asset but produced no vector), and
  `v3-audit-roadmap` (a gap the audit named and never drew).
- **Pipeline counts come from the released set**, not from audit dispositions. Dispositions
  describe what happened to the audit's own assets; they never described the size of the library.

### Rejected

Seven concepts were drawn and then cut rather than shipped weak. Each is recorded with its reason
in `RELEASE_CHECKLIST.md`: `plantain`, `gele`, `agbada`, `generator`, `keke`, `ayo`,
`pounded-yam`.

### Still not done

- Nothing is published to npm.
- Nothing is published to the Figma Community.
- The website is not deployed.
- `thin`, `bold` and `fill` remain specified and undrawn.
- No local name has been confirmed by a speaker.

## [0.1.0] — 2026-08-04

The first release of the rebuilt library. It follows the August 2026 audit, which reviewed 86
drawings and found no shared grid, no stroke logic, baked-in type and trademarks, duplicate
concepts, and 38 files still named `Group-N`.

### Added

- **16 released icons**, all in the `regular` weight, all passing the full validation suite:
  agogo, canoe, chin-chin-pack, cocoa-pod, danfo, film-clapper, football-jersey, jollof-rice,
  ludo, naira-note, nigeria-flag, oil-pumpjack, pepper-soup, suya, talking-drum, train-ticket.
- **`@african-icon-library/icons`** — canonical SVG assets plus a renderer that composes the root
  element from one template, so `viewBox`, paint and caps cannot drift between assets.
- **`@african-icon-library/metadata`** — a typed schema for icons, categories, regions and the
  release pipeline, with runtime validation and a shared search implementation.
- **`@african-icon-library/react`** — one generated component per icon, hook-free so they work
  unchanged in React Server Components.
- **Figma plugin** — offline by declaration (`"allowedDomains": ["none"]`) and by build, which
  fails if any networking call reaches the bundle. Search, category filter, weight selection, and
  insertion of editable vector frames.
- **Website** for `icons.neustackstudio.com`: browser, per-icon pages, downloads with published
  checksums, spec, status, licence, contributing and changelog.
- **Validation suite** covering viewBox, true geometric bounds, prohibited text, hard-coded
  colour, unsupported elements and attributes, duplicate ids, metadata/asset agreement and
  weight-variant completeness.
- **Scripts** for ingestion, optimisation, preview sheets, code generation, drift verification
  and deterministic release builds.

### Held back deliberately

- **1 drawing held for cultural review.** The audit could not confirm its referent, so releasing
  it would assert a name nobody has verified.
- **1 drawing held for icon design.** Its geometry leaves the 2-unit live area and needs a redraw,
  not a rescale.
- **61 audited concepts remain backlog.** Their v2 raster originals do not meet the spec and are
  not shown anywhere in the public product.
- **3 weights are specified and undrawn** (`thin`, `bold`, `fill`). They will not be faked by
  changing a stroke width.
- **The illustration tier has zero pieces.** It exists in the architecture and nowhere else.

### Not done

- Nothing is published to npm.
- Nothing is published to the Figma Community.
- The website is not deployed.

Those three need account access. See `RELEASE_CHECKLIST.md`.

[Unreleased]: https://github.com/neustackdesign/african-icon-library/compare/v0.2.0...HEAD
[0.2.0]: https://github.com/neustackdesign/african-icon-library/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/neustackdesign/african-icon-library/releases/tag/v0.1.0
