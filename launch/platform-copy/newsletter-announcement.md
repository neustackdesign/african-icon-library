# Newsletter announcement

For Neustack Design's own list. Not a pitch to somebody else's newsletter — that is
[`outreach/newsletter-pitch.md`](../outreach/newsletter-pitch.md).

Two sends. One in phase 2 when the website goes live, one in phase 4 with the expanded set. Do not
send in phase 1: a technical preview email to a general list produces unsubscribes and no
installs.

Plain text or lightly styled HTML. No hero image that has to load before the first sentence makes
sense.

---

## Send 1 — phase 2, website live (Mon 28 September 2026)

**Subject lines, pick one and do not A/B a list this size:**

- `We drew a danfo` ← preferred
- `32 icons nobody else drew`
- `The icon library that lists what it hasn't drawn`

**Preview text:**

```
And a suya skewer, a talking drum, an agogo. Open source, MIT, live today.
```

---

Hello,

There is a yellow bus in Lagos called a danfo. It carries most of the city. It has never been drawn
as an icon in any major open-source library.

Neither has a suya skewer. Or an agogo. Or a ludo board. So Nigerian products approximate them — a
generic bowl for jollof rice, an intercity coach for a danfo, a dollar sign in front of a naira
figure — and the redrawing never accumulates anywhere.

We have put 32 of those objects online, under the MIT licence, at
**icons.neustackstudio.com**.

**The set is small, and that is the interesting part.**

We started by downloading what already existed: 86 drawings from an earlier African icon set. We
spent a week with them. There was no shared grid, so the icons could not sit next to each other in
a toolbar. There was no stroke logic, so a row of them read like a row of different fonts. There
were letters baked into the artwork, which are illegible at 16 px. There were trademarks, which no
redistributable library can ship. There were five fabric rolls drawn five ways and three rocks
nobody could tell apart. And 38 files were still named `Group-N`.

We could have renamed everything and shipped 86 icons. We rebuilt instead, and now a drawing only
ships if it passes every automated check: fixed 24 × 24 canvas, geometry inside a 2-unit live area
measured on true curve bounds, no text, no hard-coded colour, no transforms, no element ids, and a
markup allow-list that excludes anything able to execute, fetch or embed.

32 survive that today. The rest are listed publicly.

**What you get**

- 32 icons across 7 categories, MIT, free for commercial use, no
  attribution required
- One drawn weight, `regular`, at 24 px, holding at 16
- Every paint is `currentColor`, so an icon takes your text colour with no edits
- SVGs, a typed metadata package, generated React components, and a Figma Community file

**What you do not get**

- `thin`, `bold` and `fill`. Specified, not drawn, and they will not be faked by raising a stroke
  width — a real weight redistributes mass and re-solves counters
- Illustrations. The tier exists in the architecture and has zero pieces
- Local-language search. Not one local name in the library is confirmed, so we show none

**One thing you could do that would genuinely help**

Not a star. A name.

Zero local-language names are confirmed across the whole library. Two Yoruba names for the talking
drum — `gangan` and `dùndún` — are sitting marked as pending because nobody has told us which one
is the instrument we drew.

If you speak Yoruba, Hausa, Igbo or Nigerian Pidgin and would go through a 32-row list
with us, reply to this email. It is a half-hour job and it is worth more to this project than
another drawing.

— Neustack Design

**icons.neustackstudio.com** · github.com/neustackdesign/african-icon-library ·
icons@neustackstudio.com

---

## Send 2 — phase 4, expanded set (Wed 21 October 2026)

**Subject:** `32 now, and the part that took longest`

**Preview text:**

```
More icons, a Figma plugin that cannot reach the network, and one drawing we still won't ship.
```

---

Hello,

Three things since the last email.

**1. The set is bigger.** 32 icons across 7 categories. Every new one
passed the same gate as the first: validator clean, geometry inside the live area, no text, no
hard-coded colour, and — where the name asserts a cultural referent — that referent confirmed by a
person rather than assumed by us.

**2. The Figma plugin is live.** Search and place icons without leaving Figma. It runs offline, and
not as a policy: the manifest declares `"networkAccess": { "allowedDomains": ["none"]}`, every icon
is compiled in at build time, and the build fails if `fetch`, `XMLHttpRequest`, `WebSocket`,
`EventSource`, `importScripts` or any absolute http(s) URL reaches either bundle. There is nowhere
for your document to go.

The weight picker shows `thin`, `bold` and `fill` struck through as unavailable rather than hiding
them. That is deliberate, and a couple of people have told us it is the reason they trusted the
rest.

**3. One drawing still is not shipping**, and it is the thing we would most like you to understand
about this project.

It is a cap. It passes every automated check we have. The audit's note on it reads: _"Referent
unclear — crown-on-brim could be several hats. Confirm before naming."_

Shipping it as `fila` would assert a specific Yoruba cap on the strength of a shape. So it sits in
staging with the blocker recorded — held, not deleted, because the drawing is real work and the
block is a question rather than a verdict. The metadata schema enforces it: an icon whose required
cultural review is outstanding will not parse.

We would rather have 32 icons and one honest gap than 32 plus one wrong
name.

**Still the ask:** a speaker of Yoruba, Hausa, Igbo or Nigerian Pidgin to review a list of proposed
names. Reply to this email.

— Neustack Design

**icons.neustackstudio.com** · MIT licensed · Nigeria first, the continent next

---

## Rules for these sends

- **One ask per email.** It is always the local-name review. Downloads take care of themselves.
- **No "we're excited to announce".** Start with the danfo.
- **State a limit in the first half.** If the honest part is at the bottom it reads as a disclaimer;
  in the middle it reads as the point.
- **No tracking pixel.** The Figma plugin makes a privacy claim we can prove; a tracking pixel in
  the email announcing it would be embarrassing. Link clicks with UTMs are enough — see
  [`../tracking/utm-conventions.md`](../tracking/utm-conventions.md).
- **Substitute the tokens on send day**, from repository state, not from the last email.
