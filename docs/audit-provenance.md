# Audit provenance

Every drawing in this library can be traced to a row in the August 2026 audit. This document
explains the chain, so anyone can check it rather than take it on trust.

## The source

`scripts/ingest/source/icons-data.v3-audit.js` is the audit's data file, vendored verbatim and
never edited. It contains:

- `CATS` — the audit's nine category keys
- `DATA` — 86 rows: source filename, proposed id, category, tier, verdict, note
- `V3` — 18 redrawn glyph bodies, the only vector output the audit produced

The audit itself notes that the "SVG sources" zip it was given contained PNG renders rather than
vectors. Those 18 bodies are therefore the entire vector inheritance of the v2 set, and this
repository ingests all 18.

## The ingest

`npm run ingest` reads that file and writes three things:

1. `packages/icons/svg/regular/*.svg` — released drawings
2. `packages/icons/staging/regular/*.svg` — drawings held from release
3. `packages/metadata/src/data/audit-records.json` — all 86 rows, typed, verdicts and notes
   preserved verbatim

It is idempotent: assets are emitted in the same canonical optimised form `npm run optimize`
produces, so re-running it never dirties the tree.

## How a drawing is released

The ingest never promotes a drawing past a block, and only one of the blocks is a list a human
maintains:

1. **Cultural hold** — a named entry in `CULTURAL_HOLDS`, with a reason.
2. **Unconfirmed referent** — derived. Any audit id the audit marked with a warning is held
   automatically. Nobody has to remember to add it.
3. **Outside the canvas** — derived from measured geometry, including the stroke halo.
4. **Outside the live area** — derived from measured geometry.

Only a drawing that survives all four is released. Bounds are measured analytically — cubics
solved for extrema, arcs converted to cubics first — because a sampled measurement would let a
shallow curve through.

## What happened to the 86

| Disposition | Count | Meaning                                                    |
| ----------- | ----- | ---------------------------------------------------------- |
| `released`  | 16    | Drawn, measured, named, shipped                            |
| `held`      | 2     | Drawn, but blocked — one cultural, one geometric           |
| `backlog`   | 61    | Audited concept with no drawing that meets the spec        |
| `merged`    | 3     | Near-duplicate folded into another concept by the audit    |
| `dropped`   | 4     | Cut by the audit as off-brief, brand-locked or type-locked |

A test asserts these sum to 86, that every released icon's provenance matches its audit row field
for field, and that no unconfirmed referent was released.

## Why the audit records are not public API

`audit-records.json` holds verdicts and notes about drawings that are not in the product —
proposed names for concepts nobody has confirmed, criticisms of specific drawings, and the
identities the audit guessed at. Publishing that as part of the package would be publishing a
premature name under the library's authority.

So it stays in the repository, where it is design history anyone can read in context, and it is
excluded from the package's `files` list, not exported from the package root, and never rendered
in the website or the plugin. A test asserts no held drawing's id or component name appears in any
generated output.

The public surface gets aggregate counts instead — `pipeline` in the metadata package — which is
enough to state the library's limits precisely without naming anything prematurely.
