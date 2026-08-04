# African Icon Library

Open-source icons for African life, drawn on one 24-pixel grid. Nigeria first; the continent is
the roadmap.

**16 icons. One weight (`regular`). MIT licensed.**

That count is small and it is meant to be. This repository is the rebuild that followed the
August 2026 audit of the v2 set — an audit that reviewed 86 drawings and found two visual species
in one library, no shared grid, no stroke logic, baked-in type and trademarks, duplicate concepts,
and 38 files still named `Group-N`. Rather than re-ship that set with a new coat of paint, the
library now releases only what passes every check, and says plainly what has not been drawn yet.

- **Website** — `apps/web`, intended for [icons.neustackstudio.com](https://icons.neustackstudio.com)
- **Figma plugin** — `apps/figma-plugin`, offline by declaration and by build
- **Assets** — `packages/icons`
- **Metadata** — `packages/metadata`
- **React** — `packages/react`

## Quick start

```
npm install
npm run check
```

`npm run check` runs lint, formatting, icon validation, generated-output verification, type-check,
tests and the full build. CI runs exactly the same thing.

```
npm run dev:web       # the website on http://localhost:3000
npm run dev:plugin    # rebuild the Figma plugin on change
```

## What is actually released

|                                   |                        |
| --------------------------------- | ---------------------- |
| Released icons                    | 16                     |
| Weights drawn                     | `regular`              |
| Weights specified but undrawn     | `thin`, `bold`, `fill` |
| Drawings held for cultural review | 1                      |
| Drawings held for icon design     | 1                      |
| Audited concepts still in backlog | 61                     |
| Concepts merged by the audit      | 3                      |
| Concepts cut by the audit         | 4                      |
| Illustration-tier pieces released | 0                      |

Nothing is published to npm. Nothing is published to the Figma Community. The website is not
deployed. Those are account actions, and they are itemised in
[RELEASE_CHECKLIST.md](RELEASE_CHECKLIST.md).

## Repository layout

```
apps/
  web/               Next.js website (App Router, static-first)
  figma-plugin/      Figma plugin: sandbox thread, UI thread, esbuild bundler
packages/
  icons/             canonical SVG assets + a renderer
    svg/regular/     released drawings
    staging/         drawn but held from release, with a recorded blocker
  metadata/          typed schema, canonical JSON data, shared search
  react/             one generated component per icon
scripts/
  ingest/            one-time-reproducible ingestion of the v3 audit
  lib/               path geometry, SVG parsing, validation rules, generators, zip
tests/               Vitest suites for every script library and the plugin
docs/                spec, metadata schema, cultural review, publishing metadata
```

## The scripts

| Command                    | What it does                                                               |
| -------------------------- | -------------------------------------------------------------------------- |
| `npm run ingest`           | Rebuilds assets and audit records from the vendored v3 source. Idempotent. |
| `npm run validate`         | Runs every icon and metadata rule. Exits non-zero on any error.            |
| `npm run optimize`         | Rewrites assets into canonical optimised form. `-- --check` fails instead. |
| `npm run preview`          | Contact sheet and 24 px proof strip into `previews/`.                      |
| `npm run generate`         | Regenerates React components, plugin data and compiled site documents.     |
| `npm run verify:generated` | Fails if any generated file has drifted from its inputs.                   |
| `npm run release:build`    | Deterministic zip + metadata + checksums into `release/`.                  |

## What the validator checks

Enforced on every released asset, in CI:

- `viewBox` is exactly `0 0 24 24`
- geometry stays inside the canvas _and_ inside the 2-unit live area, measured with true curve
  bounds rather than sampled endpoints
- no text-bearing element and no stray text content
- no hard-coded colour — every paint is `currentColor` or `none`
- only the allow-listed elements and attributes; no `script`, `image`, `use`, `filter`, `mask`,
  `transform`, `id`, `class` or `style`
- no duplicate icon ids, and no duplicate element ids inside a file
- every asset has metadata and every metadata record has an asset
- weight variants are complete: a weight ships for the whole set or not at all

## Weights are drawn, not derived

The system defines `thin`, `regular`, `bold` and `fill`. Only `regular` exists.

The other three will not be produced by changing `stroke-width` on the regular assets. A weight
redistributes mass, re-solves counters and often changes how much detail survives — that is icon
design, not a build step. The validator enforces the only part of this a script can prove: if one
icon gains a weight and the rest do not, the build fails.

## Cultural naming

An icon whose name asserts a cultural referent does not ship until that referent is confirmed by
someone who knows it. One drawing is held on exactly those grounds today. Local-language names
carry an explicit review state and are never presented publicly as authoritative until a speaker
of the language confirms them. See [docs/cultural-review.md](docs/cultural-review.md).

## Licence

[MIT](LICENSE), covering the code, the metadata and the drawings. It does not grant rights in
third-party trademarks or regulated national symbols — no released icon reproduces either, and
none may be added.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Reports of a misnamed or misrepresented cultural referent
are the highest-priority bug class in this project.
