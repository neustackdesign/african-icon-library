# Outreach strategy

68 targets in [`outreach-list.csv`](outreach-list.csv). This document says who to contact, in what
order, with what, and — more usefully — what not to do.

The governing principle: **this project has one genuinely scarce ask and it is not attention.** It
is a speaker of Yoruba, Hausa, Igbo or Nigerian Pidgin who will spend half an hour on a naming
list. Outreach that produces a thousand page views and no reviewer has failed. Outreach that
produces two reviewers and no traffic has succeeded.

---

## Segmentation

Six segments. Each gets a different message, a different phase and a different definition of
success.

### Segment A — The people who need the icons (20 rows)

`nigerian-design-community`, `nigerian-tech-community`, `african-design-community`,
`design-education`

Figma chapters, GDG chapters, design hubs, design weeks, design schools. These are the actual
users. They are also, critically, the people best placed to tell us a drawing is wrong.

**Phase:** 1 for the hubs and communities, 2 once there is a website and a Community file to point
at. **Message:** [`community-admin-pitch.md`](community-admin-pitch.md).
**Success:** a chapter posts it, or one person says which object we should have drawn.

### Segment B — The people who care how it was built (12 rows)

`open-source-community`, `design-systems`, `icon-directory` (partly)

OSCA, She Code Africa, Open Source Design, the design-systems Slacks. These people do not need
African icons; they need the validator, the drift gate and the weight rule. Pitch the method.

**Phase:** 1. **Message:** [`community-admin-pitch.md`](community-admin-pitch.md), method variant.
**Success:** someone reads `docs/icon-spec.md` and tells us where it is wrong.

### Segment C — Press (17 rows)

`african-tech-press`, `design-press`, `nigerian-culture-press`, `global-tech-press`

**Phase:** 4 and only 4. Press is five dependencies deep — see the dependency graph in
[`../launch-calendar.md`](../launch-calendar.md). A journalist who clicks through to a 404 will not
click again.
**Message:** [`press-pitch.md`](press-pitch.md), individually rewritten per outlet.
**Success:** one piece that gets the audit story right. Not five that call it "African icons
launched".

### Segment D — Newsletters (9 rows)

`design-newsletter`, `dev-newsletter`

Sidebar, TOOOLS, Figmalion, UX Collective, Frontend Focus and the rest. Highest reach per unit of
effort in the whole list, and the lowest-friction ask — most have a submission form and want one
line.

**Phase:** 2 for the design newsletters, 3 for Figmalion (time it to plugin approval), 1 for the
developer ones.
**Message:** [`newsletter-pitch.md`](newsletter-pitch.md).
**Success:** inclusion. That is all; there is no relationship to build here.

### Segment E — Directories (6 rows)

`icon-directory`

Iconify, Iconduck, SVG Repo, Icônes, Iconbuddy, the curated GitHub list. These are not outreach in
the normal sense — they are submissions against published criteria. Iconify's criteria (open
licence, automatable source, genuinely reusable icons) are already met.

**Phase:** 1, immediately after npm publish. Iconify first; several others index Iconify's
collections, so acceptance there propagates.
**Success:** listed. Track which listings actually send traffic — most will not.

### Segment F — Language and cultural-review projects (5 rows)

`language-project`

YorubaNames, Igbo API, Masakhane, Lanfrica, the Nigerian Wikimedia community. **The most important
segment in the list, and the smallest.**

**Phase:** 1, before any press, so that if a name is wrong we find out before it is printed.
**Message:** [`../platform-copy/cultural-review-recruitment.md`](../platform-copy/cultural-review-recruitment.md).
**Success:** one confirmed name. That is a release-worthy event.

---

## Sequencing

```
Phase 1  ──  Segment F (language projects)     ← first, always
             Segment B (open source, design systems)
             Segment E (directories, after npm)
             Segment A, hubs only

Phase 2  ──  Segment A, chapters and communities
             Segment D, design newsletters

Phase 3  ──  Figmalion and the Figma-specific slice of A
             Show HN, Product Hunt (one shot each)

Phase 4  ──  Segment C (press), individually written
             Segment D, second tier
             Segment A, wave 2
```

**Segment F goes first for a specific reason.** If a name in the library is wrong, the cheapest
moment to discover it is before a journalist has repeated it. Every day between press coverage and
a correction is a day the wrong name propagates into other people's codebases.

---

## Volume and pacing

- **Maximum 10 messages a day**, across all segments. This is a small project and a burst of 40
  identical emails looks like exactly what it is.
- **One follow-up per contact, ever.** Ten working days after the first message. Then stop, mark
  `no-reply`, and move on.
- **Never contact the same organisation twice in one phase** through two different channels.
- **Never send the same message to two outlets in the same market on the same day.** TechCabal and
  Techpoint should not receive identical pitches in the same hour; they will notice.

## Personalisation, and what counts as it

Every message in segment C must contain at least one sentence that could not appear in any other
message. Not "I love your publication" — a specific reference to something they published and why
it makes this relevant.

The `suggested_angle` column in the CSV is the starting point, not the sentence. It says what to
argue; you still have to read something they wrote and say why.

**A message with no personalised sentence does not get sent.** It is not worth the goodwill.

---

## What NOT to do

This section is longer than the strategy on purpose. Most launch damage is done by things that
seemed like good ideas.

### Never

- **Never claim four weights.** In an email, in a DM, in a reply, in a follow-up. One weight is
  drawn.
- **Never say a channel is live before it is.** No "launching on the Figma Community next week"
  while it is in review. No "coming to npm". Say what exists today.
- **Never let one Nigeria-first release stand in for the continent.** If an editor writes "icons
  for Africa" in a headline, correct it politely and in writing. It is the single most likely
  misreport and the one that costs the most credibility with the audience that matters.
- **Never mass-BCC.** Not press, not communities, not newsletters. If it is worth sending it is
  worth sending once.
- **Never pitch press before phase 4.** Five dependencies deep. This is not a judgement call.
- **Never send an embargo to someone who did not agree to one.** Offer it, do not impose it.
- **Never use a personal email address found on a personal site or a WHOIS record.** Organisation
  contact routes, published editorial addresses, submission forms and public accounts only. That
  rule is why this list is organisations rather than individuals.
- **Never DM an individual community organiser cold.** Use the chapter's published contact route.
  Organisers are volunteers and their DMs are already full.
- **Never offer payment for coverage**, or accept a "sponsored post" upgrade offered in reply to a
  press pitch. If an outlet only takes paid placements, mark it `declined-paid-only` and move on.
- **Never ask a cultural reviewer for a testimonial.** They answered a naming question. That is
  not an endorsement and turning it into one is a betrayal of the ask.
- **Never argue about the icon count in public.** State the reason once, link the status page,
  stop.
- **Never post to a subreddit or forum without reading its self-promotion rules.** A removed post
  costs more than the post was worth.
- **Never follow up twice.** One follow-up. Silence is an answer.

### Also avoid

- **Do not lead with representation.** "Africa deserves better icons" is true, unfalsifiable, and
  it makes the project sound like a campaign rather than a tool. Lead with the danfo and the
  validator; the significance is obvious and does not need asserting.
- **Do not send to everyone at once to "see what sticks".** Wave 1 is 8–12 contacts. Read what
  comes back. Rewrite. Then wave 2.
- **Do not treat a listing in a directory as a result.** Track it in
  [`../tracking/launch-metrics.md`](../tracking/launch-metrics.md) and see whether it sends anyone.
- **Do not chase volume in segment C.** One correct piece beats five vague ones and costs less to
  clean up afterwards.

---

## Handling replies

| Reply                            | Response                                                                                                             |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| "Not for us"                     | One-line thank you. Mark `declined`. Do not ask why.                                                                    |
| "Send more info"                 | Send the factsheet and the media kit link. Do not send a second pitch.                                                  |
| "Can we get an exclusive?"       | Yes, for segment C priority 1, if they will publish within a week. Say who else has it and when the embargo lifts.       |
| "Do you have a founder to quote?" | Use the statement in [`../master-narrative.md`](../master-narrative.md). Do not write a new, more excitable one.        |
| "Can you sponsor / advertise?"   | Decline. Mark `declined-paid-only`. This project has no promotion budget and would not spend one here.                  |
| "This name is wrong"             | Drop everything. That is the highest-priority bug class. Thank them, open the issue yourself if they will not, fix it.   |
| Silence                          | One follow-up at ten working days. Then `no-reply`, permanently.                                                        |

## Status values for the CSV

`not-started` · `queued` · `sent` · `followed-up` · `replied` · `covered` · `listed` · `declined` ·
`declined-paid-only` · `no-reply` · `do-not-contact`

`do-not-contact` is permanent and needs a reason in the notes. Once set, it is never reversed
without the maintainer's explicit agreement.

## Confidence flags in the notes column

Several rows carry a note about URL or domain confidence. **Every one of those must be resolved
before the message is sent**, in the phase 0 task on Mon 17 August: open the URL, confirm the
organisation is active, confirm the contact route exists. A row whose entity cannot be confirmed is
deleted, not guessed at.
