# Media factsheet

One page a journalist can quote from without needing a call. Every line is checkable against the
repository; the "verify with" column is not decoration, it is the point.

Substitute tokens from repository state on the day it is sent.

---

## The basics

| Field          | Value                                                                                 |
| -------------- | ------------------------------------------------------------------------------------- |
| **Name**       | African Icon Library                                                                  |
| **What it is** | An open-source icon library for African life                                          |
| **Maintainer** | Neustack Design                                                                       |
| **Licence**    | MIT — code, metadata and drawings                                                     |
| **Repository** | `https://github.com/neustackdesign/african-icon-library`                              |
| **Website**    | `https://icons.neustackstudio.com`                                                    |
| **Contact**    | `icons@neustackstudio.com`                                                            |
| **Version**    | `0.2.0`                                                                         |
| **Origin**     | An August 2026 audit of 86 drawings from an earlier African icon set                  |
| **Scope**      | Nigeria first; region is a first-class axis in the data, the continent is the roadmap |

## The numbers

Every figure is derived from the repository. On the website they are computed at build time, which
is why the status page cannot drift from the source.

| Figure                                     | Value              | Verify with                                           |
| ------------------------------------------ | ------------------ | ----------------------------------------------------- |
| Released icons                             | 32     | `packages/metadata/src/data/icons.json`               |
| Categories containing released icons       | 7 | distinct `category` values in the same file           |
| Weights specified by the system            | 4                  | `docs/icon-spec.md`                                   |
| Weights actually drawn                     | 1 (`regular`)      | `packages/icons/svg/` — there is one weight directory |
| Drawings that exist but are held           | 1     | `packages/icons/staging/`                             |
| Audited concepts with no compliant drawing | 55  | `pipeline` export in `@african-icon-library/metadata` |
| Illustration-tier pieces released          | 0                  | there is no illustration directory                    |
| Local-language names confirmed             | 0                  | every `localNames[].review` is `pending`              |
| Drawings the audit reviewed                | 86                 | `scripts/ingest/source/icons-data.v3-audit.js`        |
| Of those, still named `Group-N`            | 38                 | the audit's own `DATA` rows                           |
| Concepts merged by the audit               | 3                  | `docs/audit-provenance.md`                            |
| Concepts cut by the audit                  | 4                  | `docs/audit-provenance.md`                            |
| Vector drawings the audit produced         | 18                 | the `V3` block of the vendored source                 |

## The drawing specification, in one table

| Rule              | Value                                                                                   |
| ----------------- | --------------------------------------------------------------------------------------- |
| Canvas            | 24 × 24 units, `viewBox="0 0 24 24"`, no alternate sizes                                |
| Live area         | 2 units — all geometry inside `x [2, 22]`, `y [2, 22]`                                  |
| Stroke            | 1.5 units, `currentColor`, round cap, round join                                        |
| Fill              | `none` on the root; fills belong to the undrawn `fill` weight                           |
| Minimum counter   | 1.5 units between parallel strokes, so glyphs do not fill in at 16 px                   |
| Corner radius     | 2 units outer, by default                                                               |
| Detail budget     | at most three levels of internal detail; more than that is illustration-tier work       |
| Type              | none. The naira mark is the sole exception and is drawn as geometry, not as a character |
| Allowed elements  | `svg`, `g`, `path`, `circle`, `ellipse`, `rect`, `line`, `polyline`, `polygon`          |
| Banned attributes | `id`, `class`, `style`, `transform`, `data-*`, event handlers                           |
| Naming            | lower-case kebab-case, naming the concept, not the file or the drawing style            |

## What the validator enforces in CI

`npm run validate`, on every asset, every push. Exits non-zero on any error.

- `viewbox` — the canvas is not exactly `0 0 24 24`
- `bounds-canvas` — the stroked geometry clips the edge of the canvas
- `bounds-live-area` — the drawing leaves the 2-unit padding, measured with cubics solved for
  extrema and arcs converted to cubics, so a shallow curve cannot slip through a sampled check
- `prohibited-text` — `text`, `tspan`, `textPath`, `foreignObject`, or stray text content
- `hard-coded-colour` — any paint that is not `currentColor`, `none` or `inherit`, plus hex,
  `rgb()`, `hsl()`, `oklch()` and `url()` literals anywhere in the file
- `unsupported-element` / `unsupported-attribute` — anything outside the allow-list
- `missing-metadata` / `missing-asset` — an asset with no record, or a record with no asset
- duplicate ids — duplicate icon ids, duplicate assets claiming one id, duplicate element ids
- `missing-weight-variant` — a weight that ships for part of the set fails the whole build

## What ships with it

| Artefact                         | Notes                                                                                |
| -------------------------------- | ------------------------------------------------------------------------------------ |
| `@african-icon-library/icons`    | canonical SVG assets and a renderer that composes the root element from one template |
| `@african-icon-library/metadata` | typed schema with runtime validation, plus the shared search implementation          |
| `@african-icon-library/react`    | one generated component per icon, hook-free, works in React Server Components        |
| Figma plugin                     | offline by declaration and by build                                                  |
| Figma Community file             | components named `african-icons/<category>/<icon-id>`, live strokes, not outlined    |
| Website                          | browser, per-icon pages, downloads with SHA-256 checksums, spec, status, changelog   |
| Release artefacts                | deterministic zip plus metadata JSON, with published SHA-256 checksums               |

## The Figma plugin's offline claim

This is the claim most likely to be tested, so it is stated precisely.

- The manifest declares `"networkAccess": { "allowedDomains": ["none"] }`.
- All icon data is compiled into the plugin at build time. There is no runtime data source.
- `apps/figma-plugin/build.ts` scans both bundles for `fetch`, `XMLHttpRequest`, `WebSocket`,
  `EventSource`, `importScripts` and absolute http(s) URLs, and **fails the build** on a match.
- A test asserts the same thing about the sources.
- No `clientStorage`, no `setPluginData`, no analytics, no account.

The claim is therefore verifiable rather than asserted. Anyone can clone the repository and try to
make the build accept a `fetch`.

## Named icons, for illustration

Useful when a piece needs concrete examples rather than a count: `danfo` (the Lagos minibus),
`suya` (spiced skewered meat over coals), `talking-drum`, `agogo` (paired bells on a sprung
handle), `naira-note`, `ludo`, `jollof-rice`, `pepper-soup`, `cocoa-pod`, `chin-chin-pack`,
`oil-pumpjack`, `canoe`, `train-ticket`, `film-clapper`, `nigeria-flag`, `football-jersey`.

`nigeria-flag` and `football-jersey` ship as neutral outlines: no colour, no crest, no number, no
lettering. That is a deliberate choice, recorded for re-confirmation before 1.0, because some
jurisdictions regulate depictions of national symbols.

## Things the project will not claim

Journalists sometimes improve a story by rounding a claim up. These are the roundings to refuse:

- It does **not** have four weights. It specifies four and draws one.
- It is **not** on npm, the Figma Community or the Figma plugin store until the phase that puts it
  there. Check before writing.
- It does **not** offer local-language search. Zero names are confirmed.
- It is **not** "African icons" in the sense of covering the continent. It is Nigeria-first.
- It does **not** claim users, adoption or downloads it has not measured.
- It is **not** the first African icon set. It is a rebuild that followed an audit of one.

## Suggested angles

| Angle                                        | Why it holds up                                                                                                |
| -------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| The audit, not the launch                    | 86 drawings, 38 named `Group-N`, three indistinguishable rocks. The findings are documented and public.        |
| Shipping less on purpose                     | A library that publishes its own backlog and holds a valid drawing over an unconfirmed name.                   |
| Cultural naming as an engineering constraint | The schema refuses to parse an icon whose required review is outstanding. The claim is enforced, not promised. |
| Offline by build                             | A Figma plugin whose privacy claim is a failing build rather than a privacy policy.                            |
| Who draws the default vocabulary             | Every icon set encodes the reference set of whoever drew it. This one names its own.                           |
