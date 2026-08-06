# Credits

Attribution for everything in the library and in this media kit, and the standing record of
third-party permissions.

This file is not a formality. The project's entire argument is that it does not ship things it has
no rights to and does not assert things it has not confirmed. An unrecorded asset in the media kit
would be the same failure the audit found in the set this library replaced — trade dress and
likenesses in a redistributable collection, with no record of where anything came from.

---

## The library

**Maintainer:** Neustack Design
**Licence:** MIT, covering the code, the metadata and the drawings. See
[`LICENSE`](../../LICENSE).

The MIT licence grants no rights in third-party trademarks or regulated national symbols. No
released icon reproduces either, and none may be added.

## The drawings

All released icons descend from the August 2026 audit of an earlier African icon set. The audit
reviewed 86 drawings and produced 18 redrawn glyph bodies, which this repository ingests in full;
every released asset was then normalised, measured and — where necessary — redrawn to the
specification in [`docs/icon-spec.md`](../../docs/icon-spec.md).

Provenance is per-drawing and machine-checkable. Each released icon carries a `provenance` record
naming its audit source file, the audit's verdict and whether the referent was confirmed; a test
asserts every released icon's provenance matches its audit row field for field. The chain is
documented in [`docs/audit-provenance.md`](../../docs/audit-provenance.md).

**Where credit is owed and cannot yet be given:** the 86 drawings this library replaced were made
by someone. The audit's findings are about the artefacts, not the person who made them. If the
original author of the v2 set wishes to be credited here, we will add them — `icons@neustackstudio.com`.

## Cultural reviewers

Every person who confirms a cultural referent or a local-language name is credited here and in a
dated entry in [`docs/cultural-review.md`](../../docs/cultural-review.md), unless they ask not to
be.

| Date | Reviewer | Language / referent | What they confirmed | Credited as |
| ---- | -------- | ------------------- | ------------------- | ----------- |
| —    | —        | —                   | —                   | —           |

**The table is empty and that is accurate.** Zero local-language names in this library are
confirmed. It stays empty until a reviewer confirms something, and the first row will be a
release-worthy event noted in `CHANGELOG.md`.

A reviewer's contribution is a naming confirmation. It is not an endorsement of the project, and it
must never be quoted as one.

## Contributors

Code and drawing contributions are credited through the repository's git history and the GitHub
contributors list. A contributor who wants to be named here as well may ask.

---

## Third-party assets in the media kit

Everything used in a launch image, video or social asset that we did not make. **A row here is
required before the asset is used, not after.**

| Asset | Used in | Source | Licence | Permission obtained | Expires | Notes |
| ----- | ------- | ------ | ------- | ------------------- | ------- | ----- |
| Danfo photograph | Reel 3, `instagram-reel-scripts.md` | _to be recorded_ | _to be recorded_ | _to be recorded_ | — | Must be team-shot or licensed for commercial use with the attribution actually provided. Do not shoot the reel until this row is filled in. |
| Typeface(s) in launch compositions | All composited images | _to be recorded_ | _to be recorded_ | _to be recorded_ | — | Licence must permit commercial use and embedding. |

**Rules for this table:**

- No row, no use. If provenance is unclear, the asset does not go in.
- "Found on the internet" is not a source. A URL plus a licence name plus a date is.
- A Creative Commons licence requiring attribution means the attribution must actually appear in
  the published asset, not only in this file.
- Record the expiry for any time-limited permission, and remove the asset when it lapses.

## User screenshots and testimonials

Any image containing a third party's product or interface requires explicit written permission for
the specific image and the specific uses. Recorded here on receipt.

| Date | Person / organisation | Asset | Permitted uses | Credit line | Permission on file |
| ---- | --------------------- | ----- | -------------- | ----------- | ------------------ |
| —    | —                     | —     | —              | —           | —                  |

Before publishing any user screenshot, check the frame for: real customer data, unreleased
features, and any third-party trademark the permission does not cover.

---

## Tools and dependencies

The library is built with, and grateful to: TypeScript, Vitest, ESLint, Prettier, SVGO, Zod, Next.js
and React, and the Figma plugin API. Each is used under its own licence; see
`package.json` and the lockfile for versions, and each project's repository for terms.

## Nominative references

Figma is a trademark of Figma, Inc. GitHub is a trademark of GitHub, Inc. npm is a trademark of npm,
Inc. Vercel is a trademark of Vercel, Inc. Phosphor Icons, Lucide and The Noun Project are named in
the project's positioning material for comparison. All such references are nominative and imply no
affiliation, sponsorship or endorsement in either direction.

## National symbols

`nigeria-flag` and `football-jersey` are released as neutral outlines: no colour, no crest, no
number, no lettering. That is a deliberate choice recorded for explicit re-confirmation before 1.0,
because some jurisdictions regulate depictions of national symbols. Do not add colour or a crest to
either in any media asset.

## Corrections

If anything in this file is wrong, incomplete, or credits the wrong person, tell us and it will be
fixed: `icons@neustackstudio.com`, or open an issue at
[github.com/neustackdesign/african-icon-library/issues](https://github.com/neustackdesign/african-icon-library/issues).
