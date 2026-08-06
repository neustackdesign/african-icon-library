# Direct outreach messages

Short messages to individuals, sent in phase 1 (Wed 26 August) and phase 4. These are the only
messages in this package sent to people rather than organisations, and the constraints are tighter
for that reason.

## Who these go to

**Only people who have a public professional presence and a demonstrable connection to the
subject.** A designer who has posted about Nigerian product design. A developer who maintains an
icon library. A person who wrote the thing you are about to reference.

**Never:**

- Anyone whose contact details were not published by them for professional contact. No addresses
  scraped from a WHOIS record, a conference attendee list, a leaked list, or a personal website's
  "about me" page.
- Anyone who has not made their work public in this area. A cold message to a private individual
  because they are Nigerian and a designer is not outreach, it is an imposition.
- Cultural reviewers, through this route. Those go through
  [`../platform-copy/cultural-review-recruitment.md`](../platform-copy/cultural-review-recruitment.md),
  to organisations first, with payment offered.

Prefer a public reply or a mention in the open over a DM. A DM is a private ask for a favour; a
public reply is a contribution to a conversation.

## Volume

**10–15 messages in phase 1. Not 50.** These are the people whose criticism you want before anyone
writes about the project. If you send 50, you will not read the replies properly, which defeats the
purpose.

---

## Message 1 — a designer working on Nigerian products

**Channel:** wherever they are professionally reachable and have invited contact.

```
Hello [name] — you posted a while back about [specific thing, e.g. redrawing a bus icon for a
transport flow]. That is roughly why I built this.

African Icon Library: 32 open-source icons for African life — a danfo, a suya skewer, a
talking drum, a naira note — on one 24px grid, MIT, free for commercial use.

It is a technical preview, so the site is not deployed yet and the Figma plugin is not published.
The repository is public and the packages are on npm.

I am not asking you to share it. I am asking one question, if you have two minutes: what did you
end up drawing yourself, and is it in here? The backlog is my guess at priorities and I would like
it to be less of a guess.

github.com/neustackdesign/african-icon-library
```

---

## Message 2 — a design-systems practitioner

```
Hello [name] — you have written about [their design-systems work], so you may have an opinion on
this one specifically.

I maintain a small open-source icon library with a rule I have not seen enforced elsewhere: a
weight ships for the whole set or the build fails. The system specifies four weights and one is
drawn, and I refuse to produce the others by raising stroke-width — a weight redistributes mass and
re-solves counters, and at 2.0 several of these constructions violate the 1.5-unit counter minimum.

The validator cannot tell a drawn weight from a thickened one, so the set-wide completeness check
is the only part it can actually prove.

I would like to know where that reasoning is wrong, if it is.

github.com/neustackdesign/african-icon-library/blob/main/docs/icon-spec.md
```

---

## Message 3 — an icon library maintainer

Phosphor, Lucide, or any maintainer of an open icon set. Be a good citizen here: these are people
whose work the project's copy explicitly recommends.

```
Hello — I maintain a small icon library for African objects (a danfo, a suya skewer, a talking
drum), drawn on a 24px grid with a 1.5 stroke, deliberately compatible with [their library] so the
two can sit in one toolbar.

Two reasons for the message.

First, the project's own copy tells people to use [their library] for the general set and us only
for the things you have no reason to draw. That is genuinely what we think, and I would rather you
heard it from me than found it in a comparison table.

Second, a question if you have time: how do you handle a proposed icon whose referent nobody on the
team can verify? We hold ours — there is a cap in our staging folder that passes every check and
will not ship because the audit could not identify it — but I do not know whether that scales.

github.com/neustackdesign/african-icon-library
```

---

## Message 4 — someone who replied to a launch post with a real observation

Fast, same day, no template feel.

```
Thanks — that is a better point than most of the launch feedback. [Answer their point directly, in
one or two sentences, without deflecting.]

If you have five more minutes at some point: what would you have looked for in the set and not
found? That is the thing I most need and least have.
```

---

## Message 5 — someone who found a naming problem

Drop everything. Reply within the hour if you can.

```
Thank you — this is the highest-priority kind of report this project gets, ahead of every feature.

Two questions so I can record it properly:

1. What do you think the object actually is?
2. How confident are you? "Fairly sure" is a completely useful answer — I would rather record
   uncertainty than replace one guess with another.

I will open an issue and link you, unless you would rather not be named. If the name is wrong, the
icon comes out of the released set until it is resolved; the repository has a place for exactly
that state, and there is already one drawing sitting in it.
```

---

## Message 6 — phase 4, to someone who helped in phase 1

The follow-through that most projects skip.

```
Hello [name] — you told me in August that [their specific input]. That went in.

[What actually changed, specifically: the icon that got drawn, the name that got corrected, the
backlog item that got reprioritised.]

No ask. I just think people should hear what happened to the thing they gave.
```

---

## Rules

- **One message per person, ever, unless they reply.** No follow-up on a cold direct message. A
  follow-up to a stranger is a second imposition.
- **Reference something real and specific** in the first line, or do not send it. If the message
  would work with the name swapped out, it is not outreach.
- **Ask a question, do not make a request.** "What did you have to draw yourself?" outperforms
  "would you share this?" and is worth more when it is answered.
- **Never ask for a share, a star, an upvote or a repost.** Not once, not softly, not "if you think
  it's useful". If it is useful they will do it.
- **Never send the same message to two people who know each other.** They compare notes and it
  reads as a mail merge, because it is one.
- **Answer criticism as criticism.** If someone says 32 is too few to be useful, that
  is a real position. "It is deliberately small, and here is the backlog" is the answer. Do not
  defend, do not oversell, do not promise a date.
- **Do not attach anything.** Links only.
- **Keep it under 150 words.** Every message above is.
