# Contributing

The library is small on purpose. Every icon in it has been measured, and every claim on the
website is computed from the repository. Contributions are welcome on those terms.

## Before you draw

Open an issue first for anything that adds or renames a concept. Two questions decide whether an
icon belongs here:

1. **Is it specific?** A generic clipboard belongs in Phosphor or Lucide, which draw it better. A
   danfo, a talking drum, an ayo board — those are the reason this library exists.
2. **Does it survive 24 px?** If the concept only reads with architectural detail or a scene, it
   is illustration-tier work. The illustration tier has no released pieces yet, so an
   illustration-tier proposal is a roadmap conversation, not a pull request.

## Setup

```
npm install
npm run generate
npm run check
```

`npm run check` runs lint, type-check, tests and the full build. It must pass before you open a
pull request; CI runs the same thing.

## Adding an icon

1. Draw it to [the spec](docs/icon-spec.md) on a 24-unit canvas with a 2-unit live area.
2. Save it to `packages/icons/svg/regular/<icon-id>.svg`.
3. Add a record to `packages/metadata/src/data/icons.json`. Every field is required; the schema in
   `packages/metadata/src/schema.ts` is the source of truth for what each one means.
4. Run:

```
npm run optimize
npm run validate
npm run generate
npm run test
```

`npm run optimize` rewrites your asset into canonical form — sources _are_ the optimised files,
so there is no second copy to drift. `npm run generate` rebuilds the React components, the plugin
data and the website's compiled documents. Commit the generated output: CI fails if it has drifted.

## What the validator will tell you

Each rule fails with the reason, not just a rule name:

- `viewbox` — the canvas is not `0 0 24 24`
- `bounds-canvas` — the stroked geometry clips
- `bounds-live-area` — the drawing leaves the 2-unit padding
- `prohibited-text` — a text element or stray text content
- `hard-coded-colour` — a paint that is not `currentColor` or `none`
- `unsupported-element` / `unsupported-attribute` — outside the allow-list
- `prohibited-attribute` — `id`, `class`, `style`, `transform`, `data-*` or an event handler
- `missing-metadata` / `missing-asset` — the two sides disagree
- `missing-weight-variant` — a weight is declared but not drawn, or shipped for part of the set

## Weights

A weight is drawn, never derived. Do not submit a `bold` produced by raising `stroke-width` on the
`regular` asset — the whole point of a weight is that mass is redistributed and counters are
re-solved.

Weights ship for the entire set at once. A pull request that adds `bold` to one icon will fail
validation, and that is intended: a half-shipped weight is worse than no weight.

## Naming and cultural review

Ids are lower-case kebab-case and name the concept, never the file or the drawing style.

If a name asserts a cultural referent — a specific hat, a specific drum, a specific rock — that
referent needs confirming by someone who knows it. Say in your pull request how confident you are.
An unconfirmed name is not a blocker for the drawing; it is a blocker for release, and the
repository has a place for drawings in exactly that state (`packages/icons/staging`). See
[docs/cultural-review.md](docs/cultural-review.md).

Local-language names live in `localNames` with an explicit `review` state. Only a `confirmed`
entry is presented publicly. If you are a speaker of the language and can confirm one, that is a
genuinely valuable contribution on its own.

## Things that will be declined

- Icons carrying letters, numerals or a brand mark.
- Icons depicting an identifiable living person.
- A weight synthesised from another weight.
- Anything that reaches the network from the Figma plugin.
- Hand-edits to a generated file. Change the input and regenerate.

## Code

TypeScript, strict. ESLint and Prettier configs are in the repository; `npm run lint` and
`npm run format:check` are the arbiters. Tests live in `tests/` and run with Vitest.

Comments should explain why, not what. If a rule exists because of something the audit found, say
so — that context is the difference between a rule people follow and a rule people delete.

## Reporting a problem

Open an issue at
[github.com/neustackdesign/african-icon-library/issues](https://github.com/neustackdesign/african-icon-library/issues).

A misnamed or misrepresented cultural referent is the highest-priority bug class in this project.
Please report those even if you are not sure.
