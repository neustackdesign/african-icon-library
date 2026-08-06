# Versioning

The library follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html), but semver was
written for function signatures and an icon library breaks in ways a function signature cannot.
This document says what a breaking change is here, and what each kind of break costs a consumer.

## Where the version lives

One version number covers the whole repository. `@african-icon-library/icons`, `metadata` and
`react` are released together at the same version, because they are three views of one dataset and
a mismatched pair of them is a bug waiting to happen. The Figma plugin and the website carry the
same number.

## Pre-1.0

The library is pre-1.0 and will stay there for a while. Semver's rule for `0.x` is that anything
may change, which is honest but useless as a policy, so this project narrows it:

| Bump                | What it means                                                                                                                                         |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| **MINOR** (`0.2.0`) | The released set changed. Icons added, icons removed, an id renamed, a drawing redrawn, a weight completed, or a package's exported shape changed.    |
| **PATCH** (`0.2.1`) | Nothing a consumer imports changed. Metadata corrections, keyword and description edits, a confirmed local name, docs, tooling, website, build fixes. |

Note what that table does _not_ do: pre-1.0, it does not distinguish "added an icon" from "removed
an icon". Both are a minor bump because there is no major version to spend. That is a deliberate
consequence of `0.x`, and the compensation is that **every breaking change is listed under a
`### Breaking` heading in `CHANGELOG.md` and named in the release notes**. Read the release notes,
not the version number, before upgrading a pre-1.0 dependency.

There is one hard commitment: **the library will not remove an icon id in a pre-1.0 release
without going through the deprecation path in
[deprecation.md](./deprecation.md).** Pre-1.0 is not a licence to delete things quietly.

## After 1.0

`1.0.0` is reached when the released set is stable enough that removing an icon is a genuinely
exceptional event, and at least one weight beyond `regular` is complete. From then:

| Bump      | Change                                                                                                                            |
| --------- | --------------------------------------------------------------------------------------------------------------------------------- |
| **MAJOR** | Icon id removed after its deprecation period. Package export removed or renamed. A metadata field removed or its meaning changed. |
| **MINOR** | Icon added. Weight completed. Local name confirmed. New metadata field. New package export. A drawing redrawn.                    |
| **PATCH** | Optical correction below the threshold defined below. Metadata text. Docs. Build and tooling.                                     |

## What counts as breaking, for icons

### Id rename

**Breaking.** An id is an import path (`<Danfo />`), a filename (`danfo.svg`), a URL segment
(`/icons/danfo`) and a metadata key. Renaming it breaks all four at once.

A rename is not a bug fix even when the old name was wrong. Getting a cultural referent right is
the highest-priority work in this project, and it is _still_ a breaking change for the person who
shipped the old id in production.

**How it is handled:** the old id is aliased, not deleted. The full procedure — alias period,
notice, what stays in metadata — is in [deprecation.md](./deprecation.md). The short version: the
new id ships in a minor release with the old id resolving to it, and the old id is not removed
until a later major (or, pre-1.0, a later minor at least two releases and 90 days on).

### Id removal

**Breaking, and the most disruptive change available.** A removed id has no fallback: the import
fails to resolve and the build breaks.

Reasons an id is removed:

- A rights problem discovered after release — a trademark or trade dress nobody caught. This is
  the one case that can move fast; see [rights-policy.md](./rights-policy.md).
- A cultural referent that turns out to be wrong in a way a rename cannot fix, because the drawing
  depicts something that should not have been drawn at all.
- Two ids that turn out to be one concept, and one of them is folded into the other.

**How it is handled:** the first case may skip the alias period if counsel or the maintainer judges
continued distribution unwise; everything else takes the full deprecation path. Either way the
removal is named in the release notes with its reason, not just listed in a diff.

### Geometry change

This is the case people underestimate. **Any** change to a committed `d` attribute changes the
file's bytes, which changes its SHA-256 in the release manifest and breaks a byte-comparison
snapshot test downstream. There is no "safe" geometry edit at that level.

So the threshold is not about whether _something_ breaks — something always does — but about how
much attention the change deserves:

| Class                  | Definition                                                                                                                                                                                                              | Bump                                          |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| **Optical correction** | The construction and metaphor are unchanged. No anchor moves more than 0.25 units, the drawing's bounding box moves less than 0.25 units on any edge, and the glyph is indistinguishable from its predecessor at 24 px. | PATCH                                         |
| **Redraw**             | The construction changes: anchors move more than 0.25 units, the bounding box shifts, counters are re-solved, or detail is added or removed. Same object, drawn again.                                                  | MINOR pre-1.0, MINOR after                    |
| **Re-metaphor**        | The glyph now depicts a different object, or the same object by a different device — a portico becoming a rising chart.                                                                                                 | Treat as a rename: new id, old id deprecated. |

A re-metaphor is a rename even when the concept name stays the same, because the thing a consumer
put in their interface is now a different picture. If the change is large enough that someone who
chose the icon for its silhouette would not have chosen the new one, it needs a new id.

**How each is handled:**

- An optical correction is listed in `CHANGELOG.md` under `### Fixed` with the icon named. It does
  not need an announcement.
- A redraw is listed under `### Changed`, names the icon, says why, and **includes a before-and-after
  at 24 px in the release notes**. Someone shipped the old drawing; they should be able to see what
  changed without diffing an SVG path.
- A re-metaphor follows the rename path in [deprecation.md](./deprecation.md).

### Metadata changes

- **Adding** a field, a keyword, a region, or a confirmed local name: not breaking.
- **Changing** `name` or `description`: not breaking for code, but list it — an interface that
  renders `icon.name` will show different text.
- **Changing** `category`: not breaking, but it moves the icon in every filter UI. List it.
- **Removing** a field or narrowing an enum: breaking. Major after 1.0.
- **Promoting** a local name from `pending` to `confirmed`: not breaking, and worth its own
  changelog line. It changes what the website will state publicly, which is the point of the
  review process.

### Weights

Adding a weight is additive and never breaking — `weights` grows, existing assets do not move.

The validator enforces that a weight ships for the whole set or not at all, so there is no
intermediate state to version. A partially drawn weight cannot be released, which means it can
never be a breaking change either.

## What consumers should do

- **Pin exactly** (`0.2.1`, not `^0.2.1`) if you snapshot-test rendered SVG output. Pre-1.0 minor
  releases will change drawings.
- **Use a caret** if you consume the React components by name and do not snapshot. Ids do not
  disappear without a deprecation period.
- **Read the release notes.** Pre-1.0, they carry information the version number cannot.

## Release mechanics

Cutting a release — the order of operations, the checks, the artefacts — is in
[maintainer-guide.md](./maintainer-guide.md). This document only decides which number to use.
