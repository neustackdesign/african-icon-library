# Credits

Two ledgers. The first is for people who told this library what something actually is; the second
is for everyone else who improved it.

They are separate on purpose. Confirming that a drum is a `dùndún` and not a `gangan` is not a
smaller contribution than writing the code that renders it — it is the contribution this project
cannot do for itself, and the one it is most likely to get wrong without help. It gets its own
ledger and its own heading rather than a line in a list of thanks.

Both ledgers are empty today. That is a true statement about the project, not a formatting
placeholder: no cultural name in the library has been confirmed by anyone, which is exactly why the
website makes no local-name claim.

---

## Cultural reviewers

People who confirmed, corrected or declined to confirm a cultural referent, a local-language name,
a regional attribution, or a representation.

### What earns an entry

Any one of these, once it has been acted on:

- **Confirming a referent** — identifying what a drawing actually depicts, so it can be named and
  released. The `fila` drawing is held in staging today waiting on exactly this.
- **Confirming a local-language name** for a specific drawing, including its correct orthography,
  tone marks and diacritics.
- **Correcting a name** that was wrong, contested, or applied to the wrong object.
- **Declining to confirm**, with a reason. "That is not a bàtá, and I am not sure what it is"
  changes what the library asserts and is worth an entry. A review that stops a wrong name from
  shipping has done the job.
- **Correcting a regional attribution**, or settling which of two regional names an entry should
  carry.
- **Identifying a representation as inaccurate or disrespectful**, whether or not the drawing
  changed as a result.

Being asked and not being sure does not earn an entry, and there is no expectation that it should.

### What does not earn an entry

Being credited requires having changed something in the library. A general discussion, a suggestion
that was not adopted, or an offer to help that was not taken up is welcome and is not recorded
here — a ledger that credits intent stops meaning anything.

### Consent

**Nobody appears here without saying yes.** Both intake forms ask, and the answer is respected as
given:

- **"No credit"** means no entry at all — not an anonymised one that could be worked out from the
  issue number.
- **"Anonymous"** means the contribution is recorded with the reviewer field left as
  _(anonymous, by request)_ and no link to the issue if the issue would identify them.
- Attribution can be changed or withdrawn at any time by emailing `icons@neustackstudio.com`. It
  will be done in the next release without asking why.

Naming a language, a region or an institution is optional too. Some reviewers want their expertise
visible; others do not want to be the person the internet asks about Yoruba tone marks. Both are
fine.

### Ledger

| Date | Reviewer | Language / region | What they confirmed or corrected | Icons affected | Where it is recorded |
| ---- | -------- | ----------------- | -------------------------------- | -------------- | -------------------- |

_No entries yet._

Zero local names are confirmed across the released set, and one drawing sits in
`packages/icons/staging/regular/` because nobody has been able to name what it depicts. The open
questions, and what each one needs, are listed in
[docs/cultural-review.md](docs/cultural-review.md). Reviewing them is the single highest-value
contribution available to this project right now.

**Column notes.** _Date_ is the date the change merged. _Reviewer_ is the name or handle the person
asked for. _Language / region_ may be left blank if the reviewer prefers. _Where it is recorded_ is
the dated entry in `docs/cultural-review.md` that carries the reasoning, plus the pull request.

---

## Contributors

Everyone who improved the library in any other way.

### What earns an entry

- A drawing that was released, or one that is held in staging with a recorded blocker — a held
  drawing is real work and its author is credited for it.
- A redraw that fixed a spec, legibility or family-consistency problem.
- Code: packages, website, Figma plugin, scripts, validation rules, tests.
- A bug report that led to a fix.
- A documentation change that made something clearer or corrected something wrong.
- A rights problem spotted before or after release.
- Sustained work triaging issues or reviewing pull requests.

An entry is earned by a merged change or by a report that produced one. Opening an issue is enough
if the issue led somewhere.

### Ledger

| Date | Contributor | Contribution | Pull request or issue |
| ---- | ----------- | ------------ | --------------------- |

_No entries yet._

The library's first release was produced by Neustack Design from the August 2026 audit of the v2
set. The maintainer is not listed in this ledger — see [MAINTAINERS.md](MAINTAINERS.md).

---

## How entries get added

By the maintainer, at merge, as part of the cultural-review workflow's final step. See
[docs/governance/cultural-review-workflow.md](docs/governance/cultural-review-workflow.md).

If you contributed and you are not here, that is an oversight rather than a judgement. Open an
issue or email `icons@neustackstudio.com` and it will be fixed in the next release.

## Provenance of the original drawings

Every drawing in the library traces to a row in the August 2026 audit of the v2 set. That chain is
documented in [docs/audit-provenance.md](docs/audit-provenance.md), and the per-icon record lives in
`provenance` on each metadata entry. It is a different kind of record from these ledgers — it says
where a drawing came from, not who is owed thanks for it.
