# Rights policy

The library is MIT licensed and redistributable without permission. That is the whole point, and it
is also the constraint: **anything this project ships, everyone downstream ships too.** A drawing
that would be defensible as a one-off illustration is not defensible as a permanently redistributed
asset in thousands of interfaces, used commercially, without attribution, forever.

The MIT licence covers this project's own work. It cannot and does not grant rights in a third
party's trademark, in a person's likeness, or in a regulated national symbol — and the README says
so. This document is how that stays true.

**This is not legal advice.** It is the project's operating policy, written to keep the library out
of situations where legal advice would be needed.

## The four categories

### 1. Trademarks and logos

**Never shipped.** A registered word mark, figurative mark, or company logo does not enter the
library in any form, in any weight, at any tier.

This includes marks that are locked into lettering, because the spec bans letters and numerals
anyway — the two rules reinforce each other. The audit cut **`Kingfisher`** (filed as
`kingfisher-badge`) on exactly this basis: a fabric-brand badge with locked lettering. Its note
records the disposition and the alternative:

> Fabric-brand badge with locked lettering. Cut — or salvage as a kingfisher bird icon.

That is the pattern for this category. The **brand** is out. The **thing the brand is named after**
is not, and a kingfisher is a bird anyone may draw. If a salvage is drawn it is a new concept with
a new id, drawn from the bird, not from the badge.

### 2. Trade dress

**Never shipped as distinctive; usually shippable as generic.** Trade dress is the appearance that
identifies a source without carrying a name — a bottle silhouette, a packaging shape, a
colour-and-emblem combination.

Two audit findings sit here, and they resolve differently in detail but the same in principle.

**`Gala`** (filed as `snack-roll`, Food & Drink, backlog):

> Gala is a registered brand. Genericize to an unbranded wrapper or license it.

The sausage roll is an ordinary food. The wrapper's specific look is not. The concept survives as
an unbranded wrapper — a generic twist-wrapped roll with no emblem, no lettering, no distinctive
colour block. Licensing it is theoretically the other option and practically not one: a licensed
asset in an MIT library would need a carve-out the licence has no way to express.

**`Star Lager`** (filed as `lager-bottle`, Food & Drink, backlog):

> Star Lager trade dress (star-in-oval). Neutral emblem or cut.

The bottle is a bottle. The **star-in-oval** is the mark, and it is the part that must not be
drawn. A lager bottle with a plain rectangular label panel and no emblem is a generic lager bottle.
A lager bottle with a star in an oval is Star Lager whatever you call the file.

**The generic test.** Ask: _if you removed the name, would someone still identify the brand?_ If
yes, the identifying element is trade dress and it comes out. Then ask the second question: _with
that element gone, is the drawing still worth having?_ Sometimes the answer is no — the concept was
only ever interesting because it was the brand — and then it is cut rather than shipped as a
watered-down version of itself.

### 3. Real-person likeness

**Never shipped.** Likeness and personality rights do not survive redistribution, and they vary by
jurisdiction in ways an MIT library cannot navigate. This applies to living people and, in several
jurisdictions including Nigeria, to the recently deceased through their estates.

The audit's case is **`Fela Kuti Outline`** (proposed `raised-fists`, illustration tier, backlog):

> Real-person likeness = rights risk in a distributed library. Abstract to a raised-arms silhouette
> or clear rights with the estate.

Both options are on the table and only one is realistic. **Abstraction** means the drawing stops
being a portrait: no recognisable face, no signature hair or costume, no pose so specific to one
performance that it functions as identification. What survives is a raised-arms silhouette that
depicts Afrobeat performance rather than a performer. **Clearing rights** with an estate would
require a licence broad enough to cover unlimited downstream commercial redistribution by
strangers, which is not a thing estates grant.

The concept is in the backlog under `raised-fists` — deliberately named for what would be drawn,
not for whom. Until someone decides, the concept does not exist in the library.

Note also that `raised-fists` is filed at the **illustration tier**, which has zero released pieces
and no grid proof. So even a clean abstraction is a roadmap conversation, not a near-term drawing.

### 4. National symbols and state insignia

**Shipped only as neutral outlines, and re-checked before 1.0.** Some jurisdictions regulate the
depiction, alteration or commercial use of flags, coats of arms, currency and armed-forces
insignia. Nigeria among them.

The **Identity & State** category is where these land, and everything in it ships as a neutral
outline: **no colour, no crest, no number, no lettering.** That is a deliberate choice rather than a
settled question — `docs/cultural-review.md` records it as needing explicit confirmation before 1.0.
Read `packages/metadata/src/data/icons.json` for what is currently in that category; it grows.

The working rules:

- **A flag** is drawn as the shape and its field divisions, with no colour — every paint in the
  library is `currentColor` or `none`, so this falls out of the spec rather than needing
  enforcement.
- **A coat of arms, state seal or currency face** is not drawn. A banknote is a banknote shape
  carrying the naira mark, and the mark is drawn as geometry — the spec's sole exception to the
  no-type rule. The note's actual design is not reproduced.
- **An official document** — a passport, an identity card — is drawn as the object, not as a
  specific country's issue. No coat of arms, no issuing authority, no lettering.
- **A national kit or uniform** carries no crest, no number and no sponsor.
- **Armed-forces insignia** — the Defence category exists and holds equipment, not rank badges or
  unit insignia.
- **Anything that could read as an official endorsement** by a government or agency is out.

If a national symbol icon is requested with colour or a crest, the answer is no, and it is a spec
answer as much as a rights answer.

## The decision procedure

Anyone can raise a rights concern — in an icon proposal, in a pull request, in an issue, or by
email to `icons@neustackstudio.com` if it is sensitive.

**1. Flag it before the drawing, not after.** The icon-proposal form asks the question directly. A
concern raised at proposal costs a comment; the same concern raised after release costs a
deprecation cycle or an emergency removal.

**2. Classify it.** Which of the four categories above? If it fits none, it is probably not a
rights question — say so and move on. Do not manufacture a rights concern to avoid a drawing you
simply do not like; use the proposal-decline path in
[maintainer-guide.md](./maintainer-guide.md#saying-no-to-an-icon-proposal) instead.

**3. Apply the generic test.** Can the concept survive with the identifying element removed, and is
it still worth having? Three outcomes:

| Outcome        | What happens                                                                              |
| -------------- | ----------------------------------------------------------------------------------------- |
| **Genericise** | Redraw without the identifying element. New id naming the generic object. Ships normally. |
| **Cut**        | The concept was only the brand. Closed with the reasoning written down.                   |
| **Abstract**   | Likeness only. Redraw so it depicts an activity or archetype, not a person.               |

**4. Record it.** The decision goes in the issue or pull request, and — if it changes what the
library will or will not draw — in `docs/cultural-review.md` alongside the cultural decisions. A
rights decision that lives only in a closed pull request will be re-litigated in a year.

**5. If uncertain, do not ship.** This is the tie-break and it is not close. An unshipped icon costs
one drawing. A shipped icon with a rights problem costs everyone who redistributed it, and this
library exists to be redistributed.

## Who decides

- **Anyone** may raise a concern, and should.
- **A cultural reviewer** advises on whether a symbol carries meaning that makes a generic
  redrawing inappropriate — some things should not be genericised even where they legally could be.
  Regalia and religious objects are the obvious cases.
- **The maintainer (Neustack Design) decides**, and holds the veto. This is not consensus territory:
  the maintainer is the party that redistributes and the party a claim would reach. See
  [GOVERNANCE.md](../../GOVERNANCE.md).
- **Where a real claim arrives** — a letter, a takedown, a rights holder in contact — the maintainer
  handles it directly and takes actual legal advice. Do not discuss an incoming claim in a public
  issue.

## If something already released turns out to have a rights problem

This is the one case that skips the deprecation schedule.

1. Confirm the problem is real, not a resemblance.
2. Remove or genericise the asset in the next release. If the risk is in continued distribution,
   cut a release for it alone.
3. State it in the release notes: what was removed and that a rights issue required it. State the
   reason; do not publish the details of a third party's claim.
4. Record it in `docs/cultural-review.md` so it is not redrawn by someone who was not there.
5. Note that published artefacts and unpinned installs cannot be recalled. Neither can a git tag.
   That asymmetry — trivially easy to ship, impossible to unship — is the reason step 5 of the
   decision procedure is "do not ship".

## What contributors are agreeing to

By opening a pull request you are confirming the drawing is your own work or is properly licensed
for MIT redistribution, that you have not traced a copyrighted illustration or another icon set,
and that you have raised any rights concern you are aware of. Reference photographs are for
reference: they are not redistributed and a drawing must not be a trace of one.

The pull-request template asks all of this explicitly. It is not paperwork — it is the only point
at which anyone can still catch a problem cheaply.
