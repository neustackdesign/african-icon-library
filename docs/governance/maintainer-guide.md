# Maintainer guide

For whoever is holding the repository. It covers the four things that are hard to do well:
cutting a release, reviewing a pull request, handling a contested cultural report, and declining an
icon proposal without making someone feel small.

Everything here assumes you can push to `main` and publish. If you cannot, most of this is still
worth reading — it is what a maintainer is supposed to be doing, which is a reasonable thing to
hold one to.

## Repository settings

These are set once, in the GitHub UI, and none of them live in this repository.

**Branch protection on `main`:**

- Require a pull request before merging.
- Require the `check` job from `.github/workflows/ci.yml` to pass. That one job covers lint,
  formatting, asset-optimisation drift, icon validation, generated-output drift, type-check, tests
  and the full build.
- Require the `Analyse javascript-typescript` job from `codeql.yml` and `Review dependency changes`
  from `dependency-review.yml`.
- Require branches to be up to date before merging.
- Do not allow force pushes or deletions.

**Other settings:**

- Enable Dependency graph. `dependency-review.yml` does nothing without it.
- Enable Discussions, or delete that entry from `.github/ISSUE_TEMPLATE/config.yml` — a contact
  link to a disabled tab is a 404 in the issue chooser.
- Enable private vulnerability reporting, so `SECURITY.md` has a channel other than email.

**Labels.** Issue forms apply labels only if they already exist; a label that does not exist is
silently skipped. Create these:

| Label                 | For                                                      |
| --------------------- | -------------------------------------------------------- |
| `cultural-correction` | A wrong name, wrong referent, or disrespectful depiction |
| `high-priority`       | Anything wrong in the **released** set                   |
| `cultural-review`     | An open cultural question, including local names         |
| `local-name`          | Local-language name contributions and confirmations      |
| `icon-proposal`       | A proposed concept                                       |
| `bug`                 | Website, plugin, packages, assets                        |
| `rights`              | Trademark, trade dress, likeness, national symbol        |
| `dependencies`        | Applied by Dependabot                                    |
| `ci`                  | Applied by Dependabot for the actions ecosystem          |

## Cutting a release

### Before you start

Know what the release is for. Pre-1.0, the version number carries less information than the release
notes do, so decide what you are going to say before deciding what to number it. See
[versioning.md](./versioning.md).

Do not batch a cultural correction behind unrelated work. If a name is wrong in the released set,
that is the release.

### The sequence

```
npm ci
npm run check
```

`npm run check` is the gate: lint, format, validate, verify:generated, typecheck, test, build. If it
does not pass, there is no release. It is the same command CI runs, so a green CI run on `main` is
the same evidence.

Then, in order:

1. **Confirm the released set is what you think it is.** Read
   `packages/metadata/src/data/icons.json` — it is the only authority on what ships, and the count
   moves. Everything the website and the release notes say about the set is computed from it.

2. **Check nothing held has leaked.** There is a test asserting that no held drawing's id or
   component name appears in any generated surface. It runs in `npm run check`; know that it exists
   so you notice if someone weakens it.

3. **Check the weight claim.** `weights` must list only weights that exist as drawn assets. The
   validator enforces set-wide completeness, so a half-shipped weight cannot pass — but nothing
   catches a `bold` produced by raising `stroke-width` on a `regular`. Only a person catches that.
   If a weight arrives in a release, look at it at 24 px next to the `regular` before you believe
   it.

4. **Update the version.** One number across the repository. `addedIn` on any new icon record must
   match the version it first ships in.

5. **Write `CHANGELOG.md` properly.** Additions, changes, fixes, and a `### Breaking` heading if
   there is anything breaking. Name every icon added, removed or redrawn. For a redraw, include a
   before-and-after at 24 px — `npm run preview` produces the proof strip.

6. **Build the artefacts.** `npm run release:build` produces a deterministic zip, a metadata JSON
   and SHA-256 checksums into `release/`. CI uploads the same artefacts on every run, so you can
   take them from the run rather than from your laptop — and should, because it proves the build is
   reproducible.

7. **Tag and publish the GitHub release.** Attach `release/*`. The release notes are the changelog
   section, expanded — pre-1.0, this is where a consumer actually learns what changed.

8. **Publish to npm in dependency order:** `metadata`, then `icons`, then `react`. Each depends on
   the one before it. `npm publish --access public`.

9. **Only then** update any copy that says the packages are not on npm. Not before. The website's
   claims are computed from the repository precisely so they cannot get ahead of reality, and a
   hand-edit that gets ahead of reality is the failure mode this whole project was rebuilt to
   escape.

10. **Verify the deployed site** after it rebuilds: `/sitemap.xml`, `/robots.txt`,
    `/opengraph-image`, and one icon page.

`RELEASE_CHECKLIST.md` holds the full first-time publication ledger — the account actions, the
Figma Community steps, the DNS. Read it before a first release rather than this section.

### After

- Close the issues the release resolved, with a link to the release.
- Add any new cultural reviewers and contributors to [CREDITS.md](../../CREDITS.md).
- Move anything in [ROADMAP.md](../../ROADMAP.md) that actually shipped.

## Reviewing a pull request

The pull-request template does most of the work. What it cannot do:

**Look at the proof strip.** `npm run preview` and open `previews/proof-strip-24.svg` at real size.
Spec compliance is not legibility, and the validator cannot tell you a glyph turns to mush at
24 px. If the contributor attached a screenshot, still check it yourself.

**Check it against its neighbours.** The audit found five fabric rolls drawn five ways, three snack
wrappers, four bridges and three rocks nobody could tell apart. Two icons in a set that are hard to
distinguish are worse than one, because now the user has to choose.

**Read the naming-confidence answer, and believe it.** A contributor who writes "this is the name I
have heard but someone should check" has given you a gift. Do not merge that as a confirmed name
because the drawing is good. `packages/icons/staging/regular/` exists for exactly this state, and
the schema will refuse to release an icon whose required review is not approved.

**Check the provenance is real.** `provenance.auditSourceFile` should point at an actual row in
`packages/metadata/src/data/audit-records.json`, or the pull request should explain where a new
drawing came from.

**Ask the rights question even when the form says "none".** Trade dress in particular is easy to
miss — the identifying element of a brand is often not the part anyone thinks of as the logo. See
[rights-policy.md](./rights-policy.md).

**Never hand-edit generated output.** If a generated file needs to change, the input changes and it
is regenerated. `npm run verify:generated` catches this, but a reviewer noticing it first saves a
round trip.

## Handling a contested cultural report

The full process is in [cultural-review-workflow.md](./cultural-review-workflow.md). What follows
is the part that is about you rather than the process.

**Answer within three working days.** Not with a verdict — with an acknowledgement. A cultural
report that sits unanswered for a fortnight has already taught the reporter that reporting does not
work, and you will not get the next one.

**Reduce the claim first, decide later.** This is the move that makes everything else unhurried. A
`confirmed` local name in doubt drops to `pending` and stops being rendered publicly. An icon whose
referent is in doubt gets `culturalReview.required: true`, `status: 'pending'`, and by the schema it
cannot be released. You have not conceded anything by doing this. You have stopped asserting
something you are no longer confident about, which is what this library says it does.

**Separate the two questions.** _What is this object called?_ is not yours to answer. _Does the
correction warrant a rename, and when does it ship?_ is. Keep them apart out loud, so the reviewer
can see which one they are being asked.

**Do not ask for a citation.** Dismissing a correction because it came without one is listed as
unacceptable behaviour in the code of conduct, and it is also just wrong: for most of this
material, a person who grew up with the object is a better source than anything written down.

**When two credible people disagree, claim less.** Do not break the tie by preference — you are
not qualified to, and doing it once costs you the reviewers you need. Check first whether it is
actually two correct answers about two regions, which it usually is. If it survives that, the name
that ships is the one both parties accept, even if it is duller. `twin-drums` is in the backlog
because the audit could not choose between bàtá and gbedu and chose to describe what it saw
instead. That is a good outcome, not a failure.

**Say what you are doing and when.** "We are dropping the local name to pending today, and looking
for a Hausa speaker to settle the instrument. I will update here either way by the end of the
month" is a complete answer even though it decides nothing.

**Credit the person.** Ask how they want to be credited, respect the answer including "no", and
actually add the entry. This is the only payment this work carries.

## Saying no to an icon proposal

Most proposals that get declined are declined for one of four reasons, and none of them are "this
is a bad idea".

Some things that are always true and always worth saying:

- The library is small **on purpose**. Declining is the normal outcome, not a judgement.
- A decline is about the library's scope, not the concept's worth.
- Say which reason, specifically. "Out of scope" tells someone nothing and invites the same
  proposal again.
- Do not leave it open for months. A proposal sitting untouched for a year is a worse answer than
  a no, delivered less honestly.

### "It's generic"

The concept is already well served by a general-purpose icon set. Say what would be lost by using
the generic one — usually nothing, which is the whole point.

> Thanks for this. I think a general-purpose set covers this one better than we would: Phosphor and
> Lucide both have a good clipboard and we would just be drawing a fifth. What this library is for
> is the things those sets do not have — a danfo, an agogo, a suya skewer. If you have one of those
> in mind I would very much like to see it.

### "It doesn't survive 24 px"

The concept needs a scene, a crowd, or architectural detail. This is the illustration tier, which
has zero released pieces and no grid proof yet.

> This is a genuinely good concept and I do not think it fits on the 24-unit grid — it needs the
> detail to read as itself, and at 24 px that detail turns into a smudge. That makes it
> illustration-tier work, and the illustration tier has nothing in it yet: no pieces, no grid proof,
> no construction rules. So the honest answer is not "no", it is "not until the tier exists". I have
> linked this from the roadmap so it is not lost.

### "There is a rights problem"

Per [rights-policy.md](./rights-policy.md). Usually the concept survives generically, so lead with
that.

> We cannot draw this one as it stands — the star-in-oval is the trade mark, and an MIT-licensed
> asset gets redistributed by everyone downstream, so a mark in it becomes their problem too. A
> plain lager bottle with an unmarked label panel is fine and I would happily take that. Would that
> still be useful to you?

### "The name isn't confirmed"

This is not a decline. It is the normal state of a proposal here, and the form asks about it
directly precisely so it is not treated as a failure.

> Taking this — and thank you for saying you were not certain about the name, that is exactly the
> right thing to flag. The drawing is not blocked by it; the release is. We will draw it, hold it in
> staging, and look for someone who can name the object. If you know anyone who would know, that is
> the fastest way to unblock it.

### When you are the wrong person to decide

If a proposal turns on a cultural question you cannot answer, say so plainly and route it, rather
than declining it on a proxy reason like scope. "I do not know enough to decide this, and here is
who I am looking for" is a real answer and a much better one than a confident wrong verdict.

## Things that should worry you

- A pull request that weakens a validation rule to make an asset pass. The rule exists because the
  audit found something; changing the rule to fit the drawing inverts the whole arrangement.
- A confirmed local name arriving without a named reviewer.
- A weight appearing on part of the set. The validator catches it. If someone worked around the
  validator, look harder at why.
- Any hand-edit to a file under a `generated/` directory.
- A claim on the website that is not computed from the repository. Every number on the status page
  is derived; a hard-coded one is a claim that will go stale and quietly become a lie.
