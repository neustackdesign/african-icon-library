# Cultural review recruitment

The single most important piece of copy in this folder. Everything else asks for attention; this
asks for expertise, from people who are routinely asked for it for free.

**Before this goes anywhere: have a Yoruba speaker read it.** It is a message about not asserting
things you have not checked, and sending it unchecked would be the obvious failure.

Runs in phase 1 (Thu 27 August 2026) and again in phase 4 (Mon 2 November 2026).

---

## The principles behind the ask

1. **Be specific about the work.** "Help us with cultural review" is unanswerable. "Tell us whether
   this drum is a gangan or a dùndún" is answerable in one sentence.
2. **Bound the time.** A 32-row list is roughly half an hour. Say so, and mean it.
3. **Say what happens to their answer.** It goes into a dated entry in `docs/cultural-review.md`,
   a `confirmed` field in the metadata, and a changelog line. Not into a marketing quote.
4. **Offer credit and accept refusal.** Some reviewers will want their name on it; some will not.
   Both are fine and neither changes the work.
5. **Do not perform gratitude in advance.** No "we would be so honoured". Ask plainly.
6. **Never imply they represent their language.** One Yoruba speaker is one Yoruba speaker. Where
   a name varies by region or register, that variation is data, not a problem to resolve.

**On payment.** Offer it. This is expert work and the default expectation that cultural knowledge
is donated is exactly the pattern this project should not repeat. If the budget is genuinely zero,
say the budget is zero rather than implying the work is small. Do not offer "exposure".

---

## Message 1 — to a language project or organisation

For the Yorùbá Name Project, the Igbo API / Nkọwa okwu, Wikimedia user groups, Masakhane and
similar. These are organisations with a documented interest in exactly this problem.

**Subject:** `32 icon names that need a speaker's eye`

---

Hello,

I maintain the African Icon Library — an open-source, MIT-licensed icon set for African life. It
ships 32 icons drawn to a single spec: a danfo, a suya skewer, a talking drum, an
agogo, a naira note.

I am writing because the library currently has **zero confirmed local-language names**, and I would
rather ask than guess.

**The specific problem.** Our metadata has a `localNames` field with a review state on every
entry — `confirmed` or `pending`. Everything in it is `pending`, because the names came out of a
design audit rather than from speakers. For example, `gangan` and `dùndún` are both recorded
against our talking-drum icon. They are related instruments, not synonyms, and I do not know which
one we drew.

Because nothing is confirmed, the website renders no local names at all and makes no
local-language claim. The search feature that would use them is built and switched off. That is
the correct state, but it is not a good permanent state.

**What I am asking for.** Someone who speaks Yoruba, Hausa, Igbo or Nigerian Pidgin to go through a
32-row list — icon, English name, our proposed local name, the drawing — and tell us
per row whether the name is right, whether the register is right, and whether the diacritics are
right. Plain text reply is completely fine; no git, no Figma, no tooling.

It is about half an hour of work. I am happy to pay for it at a rate you name, and if you would
rather it be unpaid and credited, or unpaid and anonymous, that works too.

**What happens to the answer.** It goes into a dated entry in our public cultural-review document,
into a `confirmed` field in the metadata, and into the changelog — we treat a confirmed cultural
name as a release-worthy event. Reviewers are named if they want to be. It does not become a
marketing quote.

**One thing I want to be clear about**, because it is the reason I am writing to an organisation
rather than posting a general call: I am not asking anyone to speak for a language. Where a name
varies by region or register, that variation is useful to us — it is data, not a problem I need you
to resolve.

If this is not something you do, I would be glad of a pointer to who might. And if the framing is
wrong, I would rather hear that than not.

Thank you,
Neustack Design
`icons@neustackstudio.com`
github.com/neustackdesign/african-icon-library

---

## Message 2 — public post (LinkedIn, X, community channels)

Shorter, and it leads with the concrete question rather than the project.

---

```
gangan or dùndún?

Both names came out of the audit for the talking drum we drew. They are related instruments, not
synonyms. Both are marked "pending" in our metadata, and neither is shown anywhere on the site.

Our open-source icon library has zero confirmed local-language names across 32 icons.
Because zero are confirmed, the website makes no local-language claim at all and the local-name
search is built but switched off.

I would like to fix that properly rather than guessing.

If you speak Yoruba, Hausa, Igbo or Nigerian Pidgin and would go through a 32-row list
— icon, English name, our proposed local name, the drawing — it is about half an hour. Plain text
reply, no tooling. Paid if you want it to be, credited if you want it to be, anonymous if you
prefer.

It is the most useful contribution available to this project, and more valuable than another
drawing.

icons@neustackstudio.com
```

---

## Message 3 — the follow-up to someone who said yes

Do not send a form. Send the actual work, immediately, in the format you promised.

**Subject:** `The list — 32 rows`

---

Thank you. Here is the list.

One row per icon: the icon id, the English name, our proposed local name (if we have one), and a
link to the drawing on the website so you can see what we actually drew rather than what we called
it.

For each row, anything you can tell me is useful:

- **Is the name right for this object?** If not, what is it?
- **Is the register right?** If this is the formal word and people say something else, both are
  interesting.
- **Are the diacritics right?**
- **Does it vary by region?** Say so — I would rather record two entries than pick one.
- **Is the drawing wrong?** Sometimes the name is fine and the object is not. That is a more
  serious bug and I would want to know.

"I do not know" is a completely valid answer for any row. It is more useful than a guess, because a
guess is what got us here.

Reply in whatever form is easiest — annotate the list, write prose, send a voice note. I will do
the transcription.

Two more things:

**Credit.** Tell me how you would like to appear, or that you would rather not appear. The entry
goes in `docs/cultural-review.md` with a date.

**Payment.** _[State the actual offer here. If there is a budget, name the amount. If there is no
budget, say "I do not have a budget for this and I am not going to pretend otherwise" — do not
leave it unmentioned.]_

Thank you,
Neustack Design

---

## Message 4 — the cap

A separate, narrower ask. It is one question and it unblocks one drawing, which makes it a much
easier thing to say yes to than a list.

---

```
A question for anyone who knows Nigerian headwear.

We have a drawing in our icon library that passes every automated check and will not ship, because
the audit that produced it could not identify the object:

  "Referent unclear — crown-on-brim could be several hats. Confirm before naming."

Calling it "fila" would assert a specific Yoruba cap on the strength of a shape. So it sits in
staging, held rather than deleted, with the blocker recorded.

Two answers would unblock it. Either: that is a [name], here is why. Or: that drawing is not a
specific hat and should be redrawn as one.

Either is genuinely useful. Neither is available from a search engine, which is why it is still
sitting there.

icons@neustackstudio.com
```

---

## What to do with the answers

1. Add a dated entry to the relevant section of `docs/cultural-review.md`, naming who reviewed it
   and what they decided — or noting that the reviewer chose not to be named.
2. Update `packages/metadata/src/data/icons.json`: set `culturalReview.status`, set the relevant
   `localNames[].review` to `confirmed`.
3. For a held drawing that is now unblocked, move the asset out of
   `packages/icons/staging/regular/`, add its metadata record, and remove its entry from
   `CULTURAL_HOLDS` in the ingest script.
4. `npm run validate && npm run generate && npm run test`.
5. Note it in `CHANGELOG.md`. A confirmed cultural name is a release-worthy event and gets its own
   bullet with the language named.
6. Tell the reviewer it landed, with a link. People who give expert time for free rarely hear what
   happened to it.

## What not to do with the answers

- Do not aggregate several reviewers into "confirmed by the community".
- Do not publish a name as confirmed on the strength of one uncertain reply. `pending` is a real
  state and it is fine to stay in it.
- Do not turn a reviewer's message into a testimonial. They answered a naming question; they did
  not endorse a product.
- Do not ask the same person for a second, larger favour in the same thread.
