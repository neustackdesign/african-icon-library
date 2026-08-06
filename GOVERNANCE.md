# Governance

This is a small project with one maintainer. Pretending otherwise — inventing a steering committee,
a voting procedure and a quorum — would be ceremony, and ceremony is how a governance document
becomes something nobody reads. What follows is what actually happens, written down so it can be
held to.

The one place this project is genuinely not a benevolent dictatorship is cultural review, and that
is not a courtesy. The maintainer is not qualified to decide what a Yoruba drum is called, and a
governance model that gave them that authority would produce wrong answers with confidence. So
that authority sits elsewhere, deliberately and permanently.

## Roles

### Maintainer

Currently Neustack Design, and only Neustack Design. See [MAINTAINERS.md](MAINTAINERS.md).

Decides:

- What ships and when. Release timing and version numbers, per
  [docs/governance/versioning.md](docs/governance/versioning.md).
- Whether an icon proposal is in scope.
- Whether a drawing meets the spec, reads at 24 px, and sits properly beside its neighbours.
- Rights questions — trademark, trade dress, likeness, national symbols. This is a maintainer veto
  and it is not negotiable, because the maintainer is the party that redistributes and the party a
  claim would reach. See [docs/governance/rights-policy.md](docs/governance/rights-policy.md).
- Code, architecture, tooling, dependencies.
- Whether a claim the library is making should be withdrawn while a question is open. This one is
  a duty rather than a power: the answer is almost always yes, and it is the first move in any
  cultural report.

Does **not** decide:

- What an object is, or what it is called in a language the maintainer does not speak.

### Cultural reviewer

Anyone with relevant knowledge of a referent: a speaker of the language, someone who grew up with
the object, someone who works with it or makes it.

There is no application, no appointment and no credential check. You become a cultural reviewer by
answering a cultural question, and the role lasts exactly as long as that question. Someone who
confirms one Yoruba drum name is a cultural reviewer for that drum name; they have not taken on an
ongoing obligation and they are not on a committee.

Decides:

- What the object is.
- What it is called, how that name is written, and whether a proposed name applies to the specific
  drawing.
- Whether a representation is accurate, and whether it is respectful.
- Whether a symbol carries meaning that makes a generic redrawing inappropriate, even where the
  rights position would allow one.

That is authority, not consultation. A drawing whose name asserts a cultural referent does not ship
until someone who knows that referent confirms it — the maintainer cannot override that by deciding
the drawing is good enough.

The intake forms ask about your relationship to a language. That is used to decide whether one
answer settles a question or whether a second opinion is worth seeking. It is not a gate, and "I
grew up with it" is among the strongest answers available.

### Contributor

Anyone who opens an issue or a pull request. No barrier, no contributor licence agreement, no
assignment of copyright — the project is MIT and contributions arrive under the same terms.

The most valuable contribution here is not a drawing. It is a correction, and the second most
valuable is a confirmed local name. Both are recorded in [CREDITS.md](CREDITS.md).

## How decisions get made

Most decisions are made in the open, in the issue or pull request where the question arose, by
whoever holds the relevant authority above. There is no vote, and there is no quorum to reach.

Three rules govern all of them:

**1. The claim follows the confidence.** If the project is not confident in a name, the project
does not assert it. This is enforced by the data rather than by discipline: `releasedIconSchema`
refuses to parse an icon whose required cultural review is not approved, and only `confirmed` local
names are rendered publicly. The claim is generated from the data, so the two cannot diverge.

**2. When in doubt, claim less.** Reducing a claim — dropping a name to `pending`, describing an
object rather than naming it, holding a drawing in staging — is always available, costs almost
nothing, and is never the wrong first move. Shipping a wrong claim costs everyone who redistributed
it.

**3. A decision nobody can find was not made.** See below.

## How decisions get recorded

| Kind of decision                                     | Recorded in                                                           |
| ---------------------------------------------------- | --------------------------------------------------------------------- |
| A cultural question — name, referent, representation | `docs/cultural-review.md`, dated, naming the reviewer and the verdict |
| A rights decision that changes what will be drawn    | `docs/cultural-review.md`, alongside the cultural decisions           |
| Anything that changes the released set               | `CHANGELOG.md`, and the release notes                                 |
| A rename or removal                                  | `CHANGELOG.md` permanently, per `docs/governance/deprecation.md`      |
| A policy that will apply again                       | The relevant file in `docs/governance/`                               |
| A declined proposal                                  | The issue, closed with the specific reason                            |
| What is planned and what it waits on                 | `ROADMAP.md`                                                          |

A decision that lives only in a closed pull-request thread will be re-litigated within a year by
someone who was not there, and they will be right to re-litigate it, because nothing told them
otherwise. Writing it down is the cheapest part of the whole process.

The single most important entry is the cultural one. `docs/cultural-review.md` is the durable
answer to "why is this called that?", and the audit's own flags are preserved verbatim in
`packages/metadata/src/data/audit-records.json` precisely so nobody has to take a name on trust.

## How disputes escalate

### A disagreement about a drawing, a spec rule, or a release

Raise it in the issue. The maintainer decides. If you think the decision is wrong, say so in the
same thread — a maintainer who cannot be argued with in public is a worse maintainer, and this
project's whole origin is an audit that told it 86 things it did not want to hear.

There is no appeal beyond that, and it would be dishonest to invent one.

### A disagreement about a cultural question

The path is in
[docs/governance/cultural-review-workflow.md](docs/governance/cultural-review-workflow.md). The
short form:

1. Both positions written down in the issue, in the words the people used, unadjudicated.
2. Check whether it is actually two correct answers about two different regions or two related
   objects. It usually is, and that is a discovery rather than a conflict.
3. If it survives that, seek a third opinion — not to win by majority, but to find out whether one
   position is regionally specific.
4. If it still stands, **the library claims less**. The name that ships is the one everyone accepts,
   even if it is duller. A descriptive name with the contested names listed as `pending` is a
   legitimate outcome.

The maintainer never resolves a cultural dispute by preference. If the maintainer has to act, it is
by removing the claim, not by picking a side. That is the one decision the maintainer is qualified
to make in this domain.

### A dispute about conduct

Email `icons@neustackstudio.com`. Handled under [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md),
confidentially, by the maintainers.

Where the conduct concerns a maintainer, use the same address and expect it to be handled by
someone other than the person complained about. With a single maintainer this is a real limitation
and there is no point dressing it up: if you are not comfortable with that, you are also free to
fork. The licence is MIT and the entire history — including the audit that produced the library —
is in the repository.

### A rights claim from a rights holder

Not a dispute in this sense. It goes to `icons@neustackstudio.com`, is handled by the maintainer
directly with actual legal advice, and is not discussed in a public issue. The response procedure
is in [docs/governance/rights-policy.md](docs/governance/rights-policy.md).

## Changing this document

By pull request, like anything else. Governance that cannot be argued with in public is not
governance.

Two changes would need more than a pull request, and both should be announced rather than merged
quietly: adding a maintainer, and changing the licence. The licence is not going to change.

## Adding a maintainer

The project would benefit from more than one, and the honest position is that it has one. If that
changes, the criteria are:

- Sustained contribution over time, of any kind — drawings, code, cultural review, or answering
  issues carefully.
- Demonstrated judgement about the thing this project is most likely to get wrong, which is
  asserting a cultural claim it cannot support.
- Willingness to say "I do not know enough to decide this" in public.

Appointment is by the existing maintainers, announced in [MAINTAINERS.md](MAINTAINERS.md) and in
the changelog. A maintainer who stops being active is moved to a past-maintainers section rather
than removed, because the record of who decided what should not be edited out.

## What this document does not do

- It does not create a committee, a board, or a voting procedure. There are not enough people for
  one to be anything other than theatre.
- It does not promise a decision by any particular date, except the acknowledgement times in
  [docs/governance/support.md](docs/governance/support.md), which are commitments.
- It does not give the maintainer authority over cultural questions. That is the point of writing
  it down.
