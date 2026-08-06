# Roadmap

Last reviewed: **2026 Q3**.

This project was rebuilt because the version before it promised four weights, local-name search and
an illustration tier, and shipped none of them. So this roadmap is written to a stricter standard
than most: **nothing here is a commitment unless it is marked as one, and almost nothing is marked
as one.**

## How to read this

Each item carries a confidence marker. They mean exactly what they say.

| Marker        | Meaning                                                                                                       |
| ------------- | ------------------------------------------------------------------------------------------------------------- |
| **Committed** | This will happen in the stated quarter, or the roadmap will be updated to say why it did not.                 |
| **Intended**  | The work is understood and wanted. The quarter is a plan, not a promise.                                      |
| **Dependent** | Blocked on something outside the maintainer's control. The quarter is where it lands _if_ the blocker clears. |
| **Research**  | Not committed to building at all. The output is a decision about whether to build it.                         |

A dated item with no marker would be a promise, and this project does not make those.

**Counts are deliberately absent.** The released set is growing, and any number written here would
be wrong within a release. `packages/metadata/src/data/icons.json` is the authority on what exists;
the website's status page computes every figure from the repository at build time. If you want to
know how big the library is, read one of those.

---

## 2026 Q3 — now

### Expand the Nigeria set — **Committed**

The core work. The August 2026 audit reviewed far more concepts than the library released, and most
of the backlog needs redrawing rather than repairing: the audit found five fabric rolls drawn five
ways, three snack wrappers, four bridges and three rocks nobody could tell apart.

Priority order within the backlog:

1. **Concepts with a confirmed referent and no naming question.** These can be drawn and released
   without waiting on anyone. This is the bulk of the near-term work.
2. **Shared-construction families.** The fabric rolls need one roll construction with the motif as
   the only variable; the same applies to the wrappers and the bridges. Drawing these as a family is
   less work than drawing them individually and produces a set that reads as one library.
3. **Anything held for icon design.** A drawing held on a geometry blocker — bounds leaving the
   2-unit live area, counters that fill in — is the only kind of hold the maintainer can clear
   alone, so it should never sit. Compare `packages/icons/staging/regular/` against
   `packages/icons/svg/regular/` for the current state; a hold recorded as `icon-design` in the
   audit records is work, not a question.

**Depends on:** icon design time only. Nothing external.

**Explicitly not included:** any concept whose referent the audit flagged as unconfirmed. Those
wait on the confirmation programme below, however long that takes. A drawing may be produced and
held in staging; it does not get released with a guessed name.

### Local-name confirmation programme — **Dependent**

Zero local names are `confirmed` across the released set. Consequently the website makes no
local-name claim at all, and the concept site's "EN + local-name search" line was removed rather
than shipped early.

This is the single highest-value contribution available to the project and the maintainer cannot do
it. What is needed: speakers of **Yoruba, Hausa, Igbo and Nigerian Pidgin** willing to review a list
of the released set and say what each thing is called.

What the project can do without anyone's help, and is doing:

- A [Local-language name](https://github.com/neustackdesign/african-icon-library/issues/new?template=local-name-contribution.yml)
  issue form that captures orthography, the reviewer's relationship to the language, and consent to
  be credited.
- A [cultural-review workflow](docs/governance/cultural-review-workflow.md) with a committed
  three-working-day acknowledgement.
- A [credits ledger](CREDITS.md) so the work is recorded rather than absorbed.

**Depends on:** finding reviewers. No date, because a date here would be a promise about other
people's time.

**Two specific open questions** that a single reviewer could close: the `fila` referent, which is
blocking a drawn and otherwise-valid icon; and whether `gangan` or `dùndún` applies to the drawn
`talking-drum`. Both are in [docs/cultural-review.md](docs/cultural-review.md).

### Governance and release operations — **Committed**

Issue forms, pull-request template, dependency review, CodeQL, and the governance documents in
`docs/governance/`. Largely done as of this quarter.

**Still outstanding, and a prerequisite for the first rename:** the alias and deprecation mechanism
described in [docs/governance/deprecation.md](docs/governance/deprecation.md) does not exist in the
schema yet. The `ayo` / `oware` question is live, and if it resolves as a rename before that work
lands, the rename is a hard break rather than a deprecation. This should be built before it is
needed, not after.

**Depends on:** nothing external.

---

## 2026 Q4

### First publication — **Dependent**

Nothing is on npm, nothing is in the Figma Community, and the website is not deployed. All three
are account actions requiring credentials this repository does not and should not hold. Each one is
itemised in [RELEASE_CHECKLIST.md](RELEASE_CHECKLIST.md) §4.

**Depends on:** npm scope, Figma account, Vercel account and DNS, and confirming
`icons@neustackstudio.com` exists. Not on any technical work — the artefacts build deterministically
in CI today.

### `bold` weight, groundwork — **Intended**

`bold` is the second weight, chosen ahead of `thin` and `fill` for one reason: it is the weight
people actually reach for, and a two-weight library with `regular` and `bold` is genuinely more
useful than a two-weight library with `regular` and `thin`.

Q4 is groundwork, not delivery:

- Establish the `bold` construction rules — stroke width, counter minimums, which levels of internal
  detail survive.
- Draw a proof set of the hardest glyphs in the released set and test them at 16 and 24 px.
- Decide whether the current `regular` constructions can carry a `bold` at all. The audit's note is
  that at 2.0 stroke the 1.5-unit counter minimum is violated by several current constructions.
  Some may need re-solving in `regular` first, which would make the weight a larger piece of work
  than it looks.

**Depends on:** the Nigeria set being stable enough that a weight is not being drawn against a
moving target. This is the real constraint: a weight ships for the entire set or not at all, so
every icon added before the weight completes is another icon to draw twice.

**It will not be faked.** A `bold` produced by raising `stroke-width` on the `regular` assets will
pass the validator — the validator cannot tell a drawn weight from a thickened one — and it will
not be accepted. That is stated in the README, the spec, `CONTRIBUTING.md` and the release
checklist, and it holds here too.

---

## 2027 Q1

### `bold` weight, delivery — **Intended**

The whole released set, drawn. This is the item most likely to slip, and the reason is arithmetic:
the set grows, and the weight has to cover all of it at the moment it ships. If Q4's groundwork
finds that `regular` constructions need re-solving first, this moves.

**Depends on:** Q4 groundwork; a stable released set; icon design time.

**Marked as slipping if:** the set is still growing quickly at the end of Q4. Better to say that
now than to ship a half-set weight, which the validator will reject anyway.

### First non-Nigerian regional pack — **Dependent**

`kente-cloth` is Ghanaian and sits in the backlog. The architecture already treats region as a
first-class axis, so a second region slots in rather than being an exception — but two things must
be settled before the first non-Nigerian icon ships, not after:

1. **The region-tagging convention**, confirmed rather than assumed. Recorded as an open question in
   [docs/cultural-review.md](docs/cultural-review.md).
2. **Reviewers for that region.** Extending to Ghana without Ghanaian reviewers would reproduce
   exactly the failure this library is built to avoid: asserting other people's names on the
   strength of a shape.

Ghana is the likely first because a concept is already in the backlog. That is a reason, not a
decision.

**Depends on:** reviewers for the region, and the tagging convention being settled. Both are people
problems rather than drawing problems.

---

## 2027 Q2 and beyond

### Illustration tier — **Research**

Zero pieces exist. The tier is in the architecture, in the schema (`tier: 'icon' | 'illustration'`)
and nowhere else.

The output of this research is a decision about whether to build it at all, not a set of
illustrations. Questions it has to answer:

- Does the tier need its own grid? The audit's position is a 64-unit grid, and that needs proving
  with real drawings before any concept is committed to it.
- What are its construction rules? Stroke weight, detail budget, whether it uses fill.
- How do the two tiers relate? One id spans both, which is what makes "the same concept at a
  different fidelity" expressible — but nothing has tested whether that holds up in practice.
- Is it wanted? An icon library that also ships illustrations is two products. That may be the right
  answer and it may not.

**Depends on:** the icon tier being in a state where attention can go elsewhere. It is not, and
will not be for some time.

Note that the `Fela Kuti` concept sits at this tier, in the backlog, under the proposed id
`raised-fists`. Even a rights-clean abstraction of it cannot be drawn until this tier exists. See
[docs/governance/rights-policy.md](docs/governance/rights-policy.md).

### `thin` and `fill` weights — **Intended, no quarter**

After `bold` is complete and has survived contact with real use. `fill` is a different drawing
problem entirely — silhouette plus knockout, not a stroke conversion — and is best treated as its
own project rather than as the third of four.

No quarter attached, deliberately. Committing to a fourth weight before the second one exists is
how the previous version got into trouble.

### 1.0 — **No date**

`1.0.0` means the released set is stable enough that removing an icon is a genuinely exceptional
event, and at least one weight beyond `regular` is complete. See
[docs/governance/versioning.md](docs/governance/versioning.md).

Two things also need settling before 1.0, both currently open:

- Confirmation that `nigeria-flag` and `football-jersey` as neutral outlines — no colour, no crest,
  no number, no lettering — are acceptable for the intended distribution. Some jurisdictions
  regulate depictions of national symbols.
- The alias and deprecation mechanism, working, because after 1.0 an id removal is a major version
  and needs the full path.

No date. The version number will arrive when those are true.

---

## Not on the roadmap

Stated so nobody plans around them:

- **Generic icons.** Lucide, Phosphor and Heroicons draw those better and this library is not
  competing with them.
- **Raster assets.** The v2 PNG backlog is not in this repository and is not coming back.
- **A Figma plugin that reaches the network.** Offline by declaration and by build, and that is a
  design decision rather than a limitation.
- **Synthesised weights.** Covered above and everywhere else.
- **Icons carrying letters, numerals or brand marks.** Spec, not scope.
- **An identifiable real person, at any tier.** See
  [rights-policy.md](docs/governance/rights-policy.md).

## What would change this roadmap fastest

In order of impact:

1. **A speaker of Yoruba, Hausa, Igbo or Nigerian Pidgin willing to review a list of names.** This
   unblocks more than any other single contribution, and it needs no code and no design skill.
2. **Anyone who can identify the object in `packages/icons/staging/regular/fila.svg`.** One
   drawn, valid icon is held on exactly that question.
3. **A Ghanaian reviewer**, which would move the second region from "dependent" to "intended".
4. **A second icon designer**, which would make the `bold` weight a Q1 delivery rather than a hope.

[docs/governance/support.md](docs/governance/support.md) says where to start.
