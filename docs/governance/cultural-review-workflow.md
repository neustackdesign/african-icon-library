# Cultural review workflow

[docs/cultural-review.md](../cultural-review.md) is the **register**: the rule, where the state
lives in the data, what is currently under review, and how a decision is written down.

This document is the **process**: what happens between a report arriving and a correction merging,
who does each part, and how long each part should take. Read that one first if you want to know
what the project currently does not know. Read this one if you have a report to make, or a report
to handle.

## The path

```
Report ──▶ Acknowledge ──▶ Triage ──▶ Find a reviewer ──▶ Decide ──▶ Implement ──▶ Record ──▶ Credit
  any        ≤3 days       ≤7 days      varies            varies      normal PR     with the      if
  channel                                                                            decision   consented
```

Only the first three stages have committed turnarounds, because they are the only ones that depend
solely on the maintainers. Finding a Yoruba speaker willing to review a list is not a stage anyone
can put a service level on, and pretending otherwise would be the kind of promise this project
does not make.

## 1. Report

**Anyone. No account of the process required.**

Four ways in, all equally valid:

- The [Cultural correction](https://github.com/neustackdesign/african-icon-library/issues/new?template=cultural-correction.yml)
  issue form — one required field.
- The [Local-language name](https://github.com/neustackdesign/african-icon-library/issues/new?template=local-name-contribution.yml)
  form, for adding, confirming or correcting a name.
- A comment on any existing issue or pull request.
- Email `icons@neustackstudio.com`, if you would rather not post publicly.

**You do not need to be certain and you do not need a citation.** This is the project's stated
position in `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md` and `docs/cultural-review.md`, and it is
repeated here because it is the thing most likely to stop someone reporting. Dismissing a
correction because it arrived without a source is listed as unacceptable behaviour in the code of
conduct.

A report can be a sentence. "That's not a bongo" is a complete report.

## 2. Acknowledge — within 3 working days

**Maintainer.**

Someone replies. Not a triage verdict, not a decision — an acknowledgement that a human has read
it, and a plain statement of what happens next. Label `cultural-correction`, and `high-priority` if
it concerns a **released** icon.

Three days is a commitment. If a report sits unacknowledged for a week the process has failed
regardless of how it eventually resolves, because the reporter has already learned that reporting
does not work.

## 3. Triage — within 7 working days

**Maintainer.**

Three questions, in order:

**Does it concern a released icon or a backlog concept?** A released icon is public and wrong right
now. A backlog concept is a note in a file nobody outside the repository reads. Released icons come
first, always.

**What is the smallest true statement the library can make in the meantime?** This is the most
useful move available and it is almost always possible immediately:

- A `confirmed` local name that turns out to be contested drops to `pending`. It stops being
  rendered publicly the moment that lands.
- An icon whose referent is now in doubt gets `culturalReview.required: true` and
  `status: 'pending'` — which, by the schema, means it cannot be released. If it is already
  released, the choice is between correcting it and pulling it; see below.
- A name nobody can defend is not defended while the review runs.

Reducing a claim is not the same as accepting the report. It is refusing to keep asserting
something the library is no longer confident about, which is the entire principle the project
operates on.

**What would settle it?** Write this down explicitly, in the issue and in the register. "A Yoruba
speaker who knows the instrument" is a findable person. "More research" is not.

### Triage outcomes

| Outcome                  | Meaning                                                              | Next                                  |
| ------------------------ | -------------------------------------------------------------------- | ------------------------------------- |
| **Clear correction**     | The report is plainly right and the fix is unambiguous.              | Straight to Implement.                |
| **Needs a reviewer**     | Plausible, and someone with the relevant knowledge must decide.      | Stage 4.                              |
| **Contested**            | Two credible accounts disagree.                                      | Stage 5, contested path.              |
| **Not a cultural issue** | It is a drawing-quality problem, a spec problem or a rights problem. | Relabel and route. Still answer it.   |
| **No change needed**     | The current name and drawing are right.                              | Close with the reasoning written out. |

"No change needed" still gets a real explanation. A closed issue with no reasoning teaches the next
person not to bother.

## 4. Find a reviewer

**Maintainer, publicly.**

Say in the issue exactly what is needed: which language, which region, what kind of knowledge.
Specific requests get answered; general appeals do not.

A cultural reviewer is anyone with relevant knowledge of the referent — a speaker of the language,
someone who grew up with the object, someone who works with it. There is no application and no
credential check. The local-name form asks about your relationship to the language, and that is
used to decide whether one answer settles a question or whether a second opinion is worth seeking.
It is not a gate.

If the report itself came from someone with that knowledge, they may be the reviewer. Say so rather
than sending them away to find a stranger to confirm what they already told you.

**This stage has no committed turnaround**, and the honest reason is in the register: zero local
names are confirmed across the whole released set, and the project has not yet built the reviewer
network that would make this fast. The local-name confirmation programme in
[ROADMAP.md](../../ROADMAP.md) is the attempt to fix that.

## 5. Decide

**Cultural reviewer decides the cultural question. Maintainer decides the release question.**

Those are two different questions and conflating them is how this goes wrong:

- _Is this drum a bàtá?_ — a cultural question. The maintainer does not have a vote.
- _Does correcting it warrant a rename, and does the rename go out this release or next?_ — a
  release question. The maintainer decides, per [versioning.md](./versioning.md) and
  [deprecation.md](./deprecation.md).

### The contested path

Two credible people disagree. This is normal — languages have regions and objects have local
variants — and it is not a failure of the process.

1. **Write down both positions** in the issue, in the words the people used, without adjudicating.
2. **Check whether it is actually a disagreement.** Very often it is two correct answers about two
   regions, or about two related objects. That is not a conflict; it is a discovery that there are
   two concepts, or that a region tag is doing work the name was doing badly. See the `ayo` /
   `oware` worked example in [naming-conventions.md](./naming-conventions.md).
3. **Seek a third opinion** if it survives step 2. Not to break a tie by majority — to find out
   whether one of the positions is regionally specific.
4. **If it still stands: the library claims less.** The name that survives is the one both parties
   accept, even if it is duller. A descriptive English name with both local names listed as
   `pending` is a legitimate and honest outcome. `twin-drums` exists in the backlog for exactly
   this reason — the audit could not choose between bàtá and gbedu, so it chose neither and
   described what it saw.
5. **The maintainer never resolves a cultural dispute by preference.** If the maintainer has to
   act, it is by removing the claim, not by picking a side. That is the one decision the
   maintainer is qualified to make here.

Escalation beyond this — and what happens if the dispute is about conduct rather than content — is
in [GOVERNANCE.md](../../GOVERNANCE.md).

## 6. Implement

**Anyone. Usually the maintainer; sometimes the reporter.**

A normal pull request, using the pull-request template's cultural-review section. Depending on the
decision:

- **Name confirmed:** set `culturalReview.status` to `approved`, and set the relevant
  `localNames[].review` to `confirmed`.
- **Name wrong, rename needed:** the deprecation path in [deprecation.md](./deprecation.md). The
  old id is aliased, not deleted — note that the alias mechanism has to be built first.
- **Drawing wrong:** a redraw, per [versioning.md](./versioning.md#geometry-change).
- **Held drawing cleared:** move the asset from `packages/icons/staging/regular/` to
  `packages/icons/svg/regular/`, add its metadata record, and remove its entry from
  `CULTURAL_HOLDS` in `scripts/ingest/ingest-v3-audit.ts`. Steps 2–4 of "How to record a decision"
  in the register cover this precisely.
- **Concept should not exist:** remove it, and record why so it is not redrawn by someone who was
  not part of the conversation.

`npm run validate && npm run generate && npm run test` before opening. CI runs the same thing, and
`releasedIconSchema` will refuse an icon whose required review is not approved — the data cannot
contradict the claim.

## 7. Record

**Maintainer, at merge.**

Three places, and all three matter:

1. **`docs/cultural-review.md`** — a dated entry in the relevant section, naming who reviewed it and
   what they decided. This is the durable record and the only one that answers "why is it called
   that?" in two years.
2. **`CHANGELOG.md`** — a confirmed cultural name is a release-worthy event and gets its own line.
3. **The issue** — closed with a link to the merged pull request, not silently.

## 8. Credit

**Maintainer, at merge.**

If the reporter or reviewer consented, add them to the cultural-reviewers ledger in
[CREDITS.md](../../CREDITS.md). Both intake forms ask for consent, and the answer is respected
exactly as given — "no credit" means no entry, including no anonymised entry that could be worked
out from the issue thread.

Crediting the people who confirm names is listed as expected behaviour in the code of conduct, and
it is the only compensation this work carries.

## Roles, in one table

| Role                  | Who                            | Decides                                                         |
| --------------------- | ------------------------------ | --------------------------------------------------------------- |
| **Reporter**          | Anyone                         | Nothing — and needs no expertise to be taken seriously.         |
| **Cultural reviewer** | Anyone with relevant knowledge | The cultural question: what the object is, what it is called.   |
| **Maintainer**        | Neustack Design                | Release timing, versioning, whether a claim is dropped, rights. |

## What this process will not do

- It will not resolve a question faster than someone with the knowledge can be found.
- It will not confirm a name by consensus among people who do not speak the language.
- It will not keep a claim on the website while the claim is in doubt. Reducing a claim is always
  available and is always the first move.
- It will not treat "we already shipped it" as an argument.
