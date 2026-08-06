# Press pitch

Segment C, phase 4 only. Every one of these must be rewritten before sending — the templates below
are a starting structure and one personalised sentence, not a mail merge.

**Length target: under 200 words.** A journalist decides in the subject line and the first
sentence. Everything after that is for the one in five who kept reading.

Attach nothing. Link to the [`../platform-copy/media-factsheet.md`](../platform-copy/media-factsheet.md)
and the media kit. Attachments get pitches filtered.

---

## Subject lines

Pick per outlet. Never use the same one twice in one market.

- `We audited 86 African icons and shipped 32`
- `The icon library that publishes its own backlog`
- `Nobody had drawn a danfo. We drew one.`
- `A Figma plugin whose privacy claim is a failing build`
- `Why our icon library refuses to name a hat`

Never: "Press release", "For immediate release", "Launching today", "Exciting news".

---

## Template 1 — African tech press

TechCabal, Techpoint Africa, Condia, Technext, Disrupt Africa, Built In Africa.

**Subject:** `We audited 86 African icons and shipped 32`

---

Hello [name],

[**One personalised sentence.** Reference a specific piece they wrote and why it makes this
relevant. Example: "Your piece on why Nigerian fintech interfaces still look imported is the reason
I thought this might be your beat." **If you cannot write this sentence honestly, do not send the
email.**]

Short version: Nigerian products have been redrawing the same objects for years — a danfo, a suya
skewer, jollof rice — because no major open-source icon library ever drew them. We have released
32 of them under MIT at icons.neustackstudio.com.

The part I think is the story is what we did first. We downloaded an existing 86-drawing African
icon set and audited it. No shared grid, so the icons could not sit next to each other in a
toolbar. No stroke logic. Letters baked into the artwork. Trademarks no redistributable library can
ship. Five fabric rolls drawn five ways. Three rocks nobody could tell apart — one probably Olumo,
one probably Zuma, one probably Aso, and nobody had written down which. Thirty-eight files were
still named `Group-N`.

We could have renamed them and shipped 86. We shipped 32 and published the list of what
we have not drawn — including one drawing that passes every automated check and is held because we
cannot identify the cap it depicts.

Factsheet with every number and how to verify it: [link]. Happy to talk, or to answer in writing if
that is easier.

[Name]
Neustack Design · icons@neustackstudio.com

---

## Template 2 — Design press

Smashing Magazine, It's Nice That, AIGA Eye on Design, Design Indaba, Creative Boom, Prototypr.

This is an **article pitch**, not a coverage request. Say what the piece would argue.

**Subject:** `Pitch: who draws the default visual vocabulary`

---

Hello [name],

[**One personalised sentence** about something they published.]

I would like to pitch a piece, roughly 1,400 words.

**The argument:** every icon library encodes the reference set of whoever drew it. Phosphor and
Lucide are excellent and neither has a danfo, a suya skewer or an agogo — reasonably, because those
are not in the vocabulary of the places their contributors live. What is interesting is what
happens downstream: Nigerian products approximate, one deadline at a time, and the approximation
never accumulates anywhere.

**The evidence:** I maintain an open-source icon library that started by auditing 86 drawings from
an earlier African icon set. No shared grid, no stroke logic, type and trademarks baked into the
artwork, and 38 files still named `Group-N`. We rebuilt rather than repainted, and we release only
what passes an automated validator — which is why the library ships 32 icons and
publishes a list of everything it has not drawn.

**The part I would spend the most words on:** a drawing we will not release, because the audit
could not identify the cap it depicts. The metadata schema refuses to parse an icon whose cultural
review is outstanding, so the rule is enforced rather than intended.

I can write it, or you can have the material and assign it. Either works.

[Name]
Neustack Design · icons@neustackstudio.com

---

## Template 3 — Nigerian culture press

Zikoko, Culture Custodian, The NATIVE, The Republic.

Different register. These publications will smell a corporate press release instantly.

**Subject:** `We drew a danfo properly and now we need someone to check a hat`

---

Hello [name],

We drew 32 icons of Nigerian things — a danfo, suya, jollof rice, pepper soup, an
agogo, a ludo board, a naira note — and put them online free, under MIT, for anyone to use in
anything.

[**One personalised sentence** referencing something they published.]

Two things that might make it worth a piece.

**One:** we found the existing African icon sets and they are a mess. We audited 86 drawings. Five
fabric rolls drawn five ways. Three snack wrappers. Three rocks that were supposed to be Olumo,
Zuma and Aso, and nobody could tell which was which. Thirty-eight files still named `Group-6`,
`Group-7`, `Group-37`.

**Two:** there is a cap in our folder that we will not release, because we do not know what it is.
The audit note says "crown-on-brim could be several hats. Confirm before naming." Calling it a fila
would be a guess, and a guess is how three rocks become one rock.

That is a genuine open question and your readers are exactly the people who would know. If a piece
made anyone tell us what that cap is, it would be the most useful coverage this project could get.

Pictures and everything else: [link].

[Name]
Neustack Design · icons@neustackstudio.com

---

## Template 4 — Global tech press

Rest of World and equivalents. Pitch the idea, not the product. Long lead times; expect a slow no.

**Subject:** `What happens when the interface primitives were drawn somewhere else`

---

Hello [name],

A small observation that I think has a bigger story behind it.

Open a Nigerian payments app and there is a reasonable chance a naira figure sits behind a dollar
sign, because that is the glyph the icon set shipped with. A bus-ticketing flow shows an intercity
coach where a danfo belongs. A food app puts a generic bowl next to "jollof rice".

None of that is anyone's negligence. It is what happens when the default visual vocabulary of
software — the icon sets everyone imports — was assembled from the reference set of the places its
contributors live.

I maintain an open-source icon library that exists because of this, and I audited what already
existed first: 86 African icon drawings with no shared grid, no stroke logic, type and trademarks
baked into the artwork, and 38 files still named `Group-N`. We rebuilt, and now ship
32 icons plus a published list of everything we have not drawn.

I am not pitching the library. I am pitching the question of who assembles the defaults, and what
it costs the people who were not in the room. Happy to point you at people working on the same
problem in language technology, where it is much further along.

[Name]
Neustack Design · icons@neustackstudio.com

---

## The embargo

Only for segment C priority 1, only for people who agree to it.

```
I can hold this until 09:00 WAT on Tuesday 20 October if that is useful — the site and the
repository go public then. If you would rather not deal with an embargo, say so and I will send it
when it is live.
```

If someone breaks it: note it, do not escalate, do not offer them an embargo again.

---

## Follow-up — once, ten working days later, then never

```
Hello [name] — following up once on the below, then I will leave it. If it is not for you, no reply
needed.

One thing I did not include: the Figma plugin's privacy claim is enforced by the build. The build
script scans both bundles for fetch, XMLHttpRequest, WebSocket, EventSource, importScripts and
absolute http(s) URLs, and fails if it finds one. It seemed worth mentioning because it is the sort
of claim that is usually a policy document.

[Name]
```

Add one new fact. Do not repeat the original pitch.

---

## If they get it wrong

The likeliest errors, in order, and the correction to send:

**"Icons for Africa" / "the first African icon library"**

```
One correction if you have a moment: the set is Nigeria-first, not pan-African — every released
icon is tagged NG, and a Ghanaian concept is deliberately sitting in our backlog while we settle
the region-tagging convention. And it is not the first; it is a rebuild that followed an audit of
an earlier set. Both matter to the people this is for.
```

**"Four weights"**

```
Small correction: the system specifies four weights and exactly one, regular, is drawn. The other
three are undrawn and will not be produced by changing stroke-width. It is a distinction the
library is quite strict about, so I would rather flag it.
```

**A count that has gone stale**

```
The number has moved since we spoke — it is 32 as of today. The status page computes it
from the repository at build time, so that link will always be right.
```

Send corrections in writing, once, politely, without asking for a retraction unless the error is
substantive. A wrong weight claim is substantive. A rounded-down count is not.
