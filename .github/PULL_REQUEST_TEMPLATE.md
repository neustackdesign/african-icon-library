# What changed

<!-- One or two sentences. What is different after this merges, and why. -->

Closes #

## Type of change

<!-- Tick what applies. Delete the rest. -->

- [ ] New icon or icons
- [ ] Change to an existing drawing
- [ ] Icon id rename or deprecation
- [ ] Cultural correction (name, referent, local name, region)
- [ ] Metadata only (keywords, description, category)
- [ ] Website
- [ ] Figma plugin
- [ ] Packages, scripts or build
- [ ] Documentation

## Checks run

Paste the result, or tick what you ran. `npm run check` covers everything below in one command,
and CI runs exactly the same thing — so a tick here is a claim CI will verify.

- [ ] `npm run check` passed locally
- [ ] `npm run lint` / `npm run format:check`
- [ ] `npm run optimize -- --check` (assets are already in canonical form)
- [ ] `npm run validate`
- [ ] `npm run verify:generated` (generated output is committed and matches its inputs)
- [ ] `npm run typecheck`
- [ ] `npm test`
- [ ] `npm run build`

<!--
If any of these were skipped, say which and why. "I only changed a doc" is a fine reason.
-->

---

## New icons

<!-- Delete this whole section if this pull request adds no drawings. -->

For each icon added:

**Spec compliance** — see [docs/icon-spec.md](https://github.com/neustackdesign/african-icon-library/blob/main/docs/icon-spec.md)

- [ ] `viewBox="0 0 24 24"`, geometry inside the 2-unit live area, stroke halo inside the canvas
- [ ] `stroke="currentColor"`, `fill="none"`, `stroke-width="1.5"`, round caps and joins
- [ ] No letters or numerals, no `transform`, no `id` / `class` / `style` / `data-*`
- [ ] One object per glyph, at most three levels of internal detail
- [ ] Anchored to whole and half units, then corrected optically

**Validation**

- [ ] `npm run validate` passes with no errors and no warnings I have not explained below
- [ ] The asset is committed in its optimised form (`npm run optimize` produces no diff)
- [ ] Regenerated output committed (`npm run generate`, then `npm run verify:generated`)

**24 px legibility**

- [ ] `npm run preview` run, and `previews/proof-strip-24.svg` checked at real size
- [ ] The glyph is distinct from its neighbours in the released set — not a near-duplicate of one
- [ ] Screenshot of the proof strip attached below

<!-- Attach the 24 px proof here. A reviewer should not have to build the branch to see it. -->

**Metadata**

- [ ] A record added to `packages/metadata/src/data/icons.json` with every required field
- [ ] `id` is lower-case kebab-case, names the concept, and carries no `-line` / `-outline` suffix
- [ ] `weights` lists only weights that exist as drawn assets — no synthesised weight
- [ ] `keywords` are plain English search terms that make no cultural claim
- [ ] `regions` set, and the category is one that already exists
- [ ] `addedIn` set to the version this will first ship in

**Provenance**

- [ ] `provenance.auditSourceFile` points at the real audit row this descends from, or the
      pull request explains where the drawing comes from if it is new work
- [ ] Reference material used is listed below, and I am free to have used it
- [ ] The drawing is my own work, or its origin and licence are stated below

**Cultural review** — see [docs/cultural-review.md](https://github.com/neustackdesign/african-icon-library/blob/main/docs/cultural-review.md)

- [ ] `culturalReview.required` is set honestly. If the name asserts a specific cultural referent —
      a specific hat, a specific drum, a specific rock — it is `true`.
- [ ] If `required` is `true`, `status` is `approved` **only** when a named reviewer has confirmed
      the referent, and the confirmation is recorded in `docs/cultural-review.md`
- [ ] Any `localNames` entries carry an accurate `review` state; `confirmed` means a speaker of the
      language confirmed this exact name for this exact object
- [ ] Any rights concern (trademark, trade dress, real-person likeness, national symbol) is raised
      below rather than assumed to be fine

**How confident are you in the name?**

<!--
Say it plainly. "Certain, this is my language" and "this is the name I have heard but someone
should check" are both useful answers, and only one of them is a release blocker. An unconfirmed
name is not a reason to withhold the drawing — `packages/icons/staging/regular/` exists for
exactly this state.
-->

---

## Anything a reviewer should know

<!--
Trade-offs you made, things you were unsure about, a rule you had to bend. If this changes an
existing drawing's geometry, say so explicitly — it changes the published checksum and will break
snapshot tests downstream. See docs/governance/versioning.md.
-->
