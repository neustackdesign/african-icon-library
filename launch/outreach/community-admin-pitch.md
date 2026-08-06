# Community admin pitch

Segments A and B. Chapter organisers, hub programme leads, open-source community admins.

**The thing to understand about this audience:** they are volunteers, their inboxes are full of
people asking to speak at their events, and they can tell within a sentence whether you want to
give something to their community or take attention from it. Lead with what their members get, and
ask for nothing in the first message.

Always use the community's **published contact route** — the chapter form, the general enquiries
address, the community channel. Never a cold DM to a named organiser.

---

## Template A1 — Figma chapters

Friends of Figma Lagos, Ibadan, Uyo, Nairobi, Accra, and the Africa umbrella account.

**Subject:** `A free Figma file for the chapter — 32 icons for African life`

---

Hello,

I maintain the African Icon Library — an open-source, MIT-licensed set of 32 icons for
things global icon libraries never drew: a danfo, a suya skewer, a talking drum, an agogo, a naira
note, a ludo board.

There is a Figma Community file and a plugin. Both are free, both are MIT, and neither needs an
account. I am not asking the chapter to promote anything — if it is useful to your members, it is
useful; if not, ignore this.

Two things that might be worth more to a chapter than the icons themselves:

**The grid page in the Community file.** The 24-unit canvas with the 2-unit live area and the three
keylines marked, plus every icon at 16, 24, 32 and 48 px. It is a usable teaching artefact for
anyone learning icon construction, independent of whether they ever use these drawings.

**The plugin's weight picker**, which shows three weights struck through as unavailable. The
library specifies four weights and has drawn one. I mention it because two people told me to hide
them, and it turned out to be the detail that made designers trust the rest.

If a chapter session on icon-system fundamentals would be useful — grid, live area, counters at
16 px, why a bold weight is not a `stroke-width` change — I would be glad to do it, in person in
Lagos or remotely. No slides selling anything; the library would be the worked example.

And a real ask, if anyone in the chapter is up for it: **zero local-language names in the library
are confirmed.** If a Yoruba, Hausa, Igbo or Pidgin speaker would go through a 32-row
list, that is half an hour and it is worth more to this project than anything else.

`icons.neustackstudio.com` · MIT · github.com/neustackdesign/african-icon-library

[Name]
Neustack Design · icons@neustackstudio.com

---

## Template A2 — Design hubs, schools and programmes

CcHUB Design Lab, Design Hub Kampala, Africa Design School, IxDF Lagos.

**Subject:** `Free icon set + a drawing spec your students could pull apart`

---

Hello,

I maintain the African Icon Library, an open-source MIT icon set for African life —
32 icons, one 24-pixel grid, free for commercial use.

I am writing because the part of it most useful to a design programme is probably not the drawings.

The whole system is small enough to read end to end: a nine-page drawing spec, a validator that
checks every rule and tells you which one you broke and why, and a public audit trail from an
earlier 86-drawing set that failed most of them. A student can read the spec in twenty minutes,
draw an icon, run `npm run validate`, and get a specific answer — `bounds-live-area`, the drawing
leaves the 2-unit padding — rather than a tutor's opinion.

It is also an unusually honest artefact to study. The library specifies four weights and has drawn
one. It holds a drawing that passes every automated check, because the audit could not identify the
cap it depicts and we will not name a hat we cannot name. All of that is on a status page, computed
from the repository at build time.

Happy to run a session on any of it, or to just leave the links and get out of the way:

`icons.neustackstudio.com/spec` · `github.com/neustackdesign/african-icon-library`

One genuine ask, if it fits your community: **zero local-language names in the library are
confirmed**, so the site shows none. A Yoruba, Hausa, Igbo or Pidgin speaker willing to review a
32-row list would be the most valuable contribution anyone could make. Paid if there is
a way to arrange that.

[Name]
Neustack Design · icons@neustackstudio.com

---

## Template B1 — Open-source communities

Open Source Community Africa, She Code Africa, Open Source Design.

Lead with contribution, not with the product. These communities exist to produce contributors.

**Subject:** `An open-source project with specific, small, non-code tasks`

---

Hello,

I maintain the African Icon Library — MIT, 32 icons, Nigeria-first — and I am writing
because it currently has a set of contribution tasks that are unusually well suited to first-time
contributors, including people who do not write code at all.

**The most valuable one needs no tooling.** Zero local-language names in the library are confirmed.
Two Yoruba names for our talking drum, `gangan` and `dùndún`, are sitting marked `pending` because
nobody has told us which one applies to the instrument we drew. A speaker of Yoruba, Hausa, Igbo or
Nigerian Pidgin can review a 32-row list in about half an hour, in plain text, with no
git involved. Because zero are confirmed, the website makes no local-language claim at all.

**The code tasks are bounded and the errors are specific.** The validator does not say "invalid" —
it says `bounds-live-area`, the drawing leaves the 2-unit padding, at these coordinates. That makes
a first pull request tractable in a way most repositories do not.

**And there are five open naming questions** the audit could not resolve. Which Hausa lute is
drawn. Whether a pair of membrane drums are bàtá or gbedu. Whether a board game should be filed as
`ayo` or `oware` or region-tagged as both. Which of three near-identical rocks is Olumo, which is
Zuma, which is Aso. Any single answer unblocks a concept.

If any of that suits a community event, a contribution drive or a mentorship cohort, I would be
glad to write it up in whatever format is useful, and to be around to review pull requests properly
rather than leaving them for a fortnight.

`github.com/neustackdesign/african-icon-library` · MIT

[Name]
Neustack Design · icons@neustackstudio.com

---

## Template B2 — Design-systems communities

design.systems Slack, zheroes.

Post, do not email. Read the channel rules first — most have a specific place for this and posting
elsewhere is the fastest way to be ignored.

```
Sharing a small open-source icon library, mostly because of how its spec is enforced rather than
what it draws.

It is African icons — a danfo, a suya skewer, a talking drum — which is not going to be useful to
most people here. The bit that might be:

• A weight-completeness rule that fails the build if a weight ships for part of the set. The system
  specifies four weights and one is drawn, and the rule exists so a half-shipped weight cannot
  happen quietly.
• Live-area bounds measured with analytic curve extrema rather than sampled endpoints, so a cubic
  that bulges past the edge is caught even when both its endpoints are inside.
• Generated components committed to the repository with a CI drift gate, so the generated output
  cannot diverge from its inputs.
• Every number on the website computed from the metadata package at build time, so the docs cannot
  overstate the library.

The whole thing is small enough to read: github.com/neustackdesign/african-icon-library

Genuinely interested in where the approach is wrong — particularly the weight rule, which is the
one people argue with.
```

---

## Rules for this segment

- **Ask for nothing in the first message** except, at most, the local-name review — which is a gift
  to the community as much as a request, because it credits the reviewer publicly.
- **Offer something specific.** A talk topic, a teaching artefact, a set of good first issues. "Let
  me know if you would like to collaborate" is not an offer.
- **Never cold-DM an organiser.** Published contact routes only.
- **Do not ask a community to "share with your members".** Give them something worth sharing and
  let them decide.
- **If you offer a session, do it properly.** No slides selling the library. If the session is
  worth an hour of a chapter's evening it has to be worth it without the product in it.
- **Follow up once, then stop.** Volunteers do not owe you a reply.
- **If a community says the framing is wrong** — that Nigeria-first is being read as pan-African,
  that the cultural-review process sounds performative — take it seriously in writing and change
  the copy. That feedback is more valuable than the post would have been.
