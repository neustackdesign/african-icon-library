# Deprecating an icon id

An id is an import, a filename, a URL and a metadata key. Retiring one breaks all four, so it is
done on a schedule rather than in a single pull request.

This document covers the whole lifecycle: how an id enters deprecation, how long it stays there,
what remains visible while it does, and what happens on removal.

## The mechanism does not exist yet

**No alias field exists in the schema today.** `packages/metadata/src/schema.ts` has no `aliases`,
no `deprecated` and no `replacedBy`. Nothing in the library has been renamed yet, so nothing has
needed it.

That is fine right now and will not be fine the moment the first cultural correction lands — the
`ayo` / `oware` question and the `fila` referent are both live, and either could produce a rename.
So: **the schema work below is a prerequisite for the first rename, not a follow-up to it.**

What has to exist before any id is deprecated:

1. An `aliases: string[]` field on `Icon`, validated as icon ids, unique across the whole set and
   disjoint from the set of live ids. A test asserting an alias never collides with a real id.
2. A `deprecated` block on `Icon`:
   ```ts
   deprecated?: {
     since: string;        // semver of the release that deprecated it
     removeAfter: string;  // earliest release that may remove it
     replacedBy?: string;  // the live id that supersedes it
     reason: string;       // one line, in plain language
   }
   ```
3. Alias resolution in the metadata package (`resolveIconId`), used by the website router, the
   plugin and the asset renderer, so all three resolve an old id identically.
4. A deprecated re-export in `@african-icon-library/react` carrying an `@deprecated` JSDoc tag, so
   editors surface the warning before the build does.

Until that exists, an id rename means a hard break, and this document's schedule cannot be honoured.
Say so plainly in the pull request rather than shipping the rename and calling it deprecation.

## Why an id gets retired

Roughly in order of how often it will happen:

1. **The name was wrong.** A cultural referent misidentified — the highest-priority bug class in
   this project, and the reason this document exists at all.
2. **Two ids are one concept.** The audit already merged three; more will surface as the backlog
   is drawn.
3. **A rights problem.** A trademark, trade dress or likeness discovered after release. See
   [rights-policy.md](./rights-policy.md).
4. **The drawing became a different picture.** A re-metaphor, per
   [versioning.md](./versioning.md#geometry-change).

## The schedule

| Stage        | When                                                                                    | What happens                                                                                        |
| ------------ | --------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| **Announce** | Release `N`                                                                             | New id ships. Old id becomes an alias. `deprecated` block set. Changelog and release notes name it. |
| **Alias**    | Release `N` onwards                                                                     | Both ids resolve to the same asset. Nothing downstream breaks.                                      |
| **Remove**   | Not before **two further minor releases** and **90 days** after `N`, whichever is later | Alias deleted. Old id 404s. Named in the release notes as a removal.                                |

Two conditions, not one. Two releases in a fortnight is not notice, and 90 days with no release in
between is not notice either. Both have to be satisfied.

**Minimum notice is 90 days.** If a rename is announced and then the project goes quiet for six
months, the alias stays. Silence from the maintainers does not start anyone else's clock.

### When the schedule is skipped

Only one case: a rights problem where continued distribution is itself the risk. Then the asset is
removed in the next release, the alias period is skipped, and the release notes say a rights issue
required immediate removal. The reason is stated; the details may not be, if they concern a
third party's claim.

Nothing else skips the schedule. Not a wrong name, not an embarrassing drawing, not a duplicate.

## What stays in metadata

Deprecation is public record, not deletion. Through the alias period:

- The record for the **new** id is a normal released icon in `icons.json`.
- The **old** id appears in that record's `aliases`, with the `deprecated` block carrying `since`,
  `removeAfter`, `replacedBy` and a one-line reason.
- Search indexes the alias, so someone searching the old name still finds the icon.

After removal:

- The alias is deleted from `icons.json`. The id resolves to nothing.
- **The record of the rename stays in `CHANGELOG.md` permanently.** That is the durable answer to
  "what happened to `oware`?" — a changelog entry is cheap and a confused user is not.
- If the rename came from a cultural correction, the decision also stays in
  `docs/cultural-review.md` with the date and the reviewer, per the recording procedure there.

A retired id is **never reused for a different concept.** Not after the alias period, not ever. A
stale pinned dependency resolving `ayo` to the wrong drawing is worse than it failing to resolve.

## How each surface presents a deprecated id

### The website

- `/icons/<old-id>` **redirects** (308) to `/icons/<new-id>`. It does not 404 and it does not show
  a duplicate page — two URLs for one icon is an SEO problem and a confusion problem.
- The icon's own page shows a line under the name: _"Previously `oware`. Renamed in 0.3.0 because
  in Nigeria this board game is `ayo`; `oware` is the Ghanaian name."_ Plain, dated, and it says
  why.
- Searching the old name returns the icon, with the alias shown as the match reason.
- After removal, `/icons/<old-id>` 404s with the standard not-found page.

### The Figma plugin

- Searching the old name returns the icon. The alias is matched, and the result shows the current
  name.
- The plugin has no persistent document state to migrate: it inserts a named frame and forgets. A
  frame inserted under the old name keeps that name in the user's file, which is theirs to change.
- The plugin never silently renames anything in someone's document.

### The packages

- `@african-icon-library/icons` resolves the old id to the current asset for the alias period.
- `@african-icon-library/react` keeps the old component name as a re-export of the new one, marked
  `@deprecated` with the replacement in the tag, so an editor shows a strikethrough before a build
  ever fails.
- `@african-icon-library/metadata` exposes the alias through `resolveIconId` and includes the
  `deprecated` block on the record, so a consumer can lint their own usage.

### The release artefacts

The zip contains one file per live id. Aliases are not duplicated as extra files — a zip with two
copies of the same drawing under two names is how a set drifts. The alias mapping lives in the
release manifest instead.

## Checklist for the pull request that deprecates an id

- [ ] The new id is added, with a full metadata record and the asset renamed on disk
- [ ] The old id is listed in `aliases` on the new record
- [ ] `deprecated.since` is the version this ships in; `removeAfter` respects both conditions above
- [ ] `deprecated.reason` is one line a stranger can understand
- [ ] `CHANGELOG.md` entry under `### Breaking`, naming both ids
- [ ] The React re-export exists and carries `@deprecated`
- [ ] The website redirect is in place
- [ ] `npm run check` passes
- [ ] If the rename came from a cultural report, the decision is recorded in
      `docs/cultural-review.md` and the reporter is credited in `CREDITS.md` if they consented
