# Launch video — storyboard

The one long-form piece. 70 seconds, 1920 × 1080, for the website hero, the press kit, LinkedIn and
YouTube.

**Records in phase 4**, when the site, the Community file and the plugin are all real, because the
video shows all three.

**The rule:** every frame is either a real drawing produced by a repository script, a real screen
recording, or plain typeset text. No stock footage. No abstract motion graphics. No drone shot of
Lagos.

---

## The argument, in order

1. Nobody drew the danfo.
2. So we went looking, and what existed did not work.
3. So we rebuilt, with rules that a script enforces.
4. It is small, and here is exactly how small.
5. Here it is, working.
6. Here is what we need.

If a scene does not advance one of those six, it is cut.

---

## Storyboard

### Scene 1 — 0:00–0:07 · The object

**Visual:** black. Then `danfo` fades up at 600 px, ink on paper, dead centre. Nothing else.

**Text (appears at 0:03):** `This is a danfo.`

**Sound:** silence, then Lagos street ambience at low level. If no clean team-recorded ambience is
available, use silence. Do not use a stock "African market" audio bed.

### Scene 2 — 0:07–0:14 · The gap

**Visual:** three more glyphs slide in beside it — `suya`, `talking-drum`, `naira-note`. Four in a
row, level, on the same baseline.

**Text:** `None of these had ever been drawn in a major open-source icon library.`

### Scene 3 — 0:14–0:22 · The workaround

**Visual:** split frame. Left, a generic bowl glyph. Right, `jollof-rice`. Then left, a generic
coach. Right, `danfo`.

**Text:** `So products approximate.`
**Text (0:19):** `And every team solves it again, on deadline.`

### Scene 4 — 0:22–0:32 · The audit

**Visual:** typeset list on paper, lines appearing one at a time at reading pace. No illustration.

```
86 drawings
No shared grid
No stroke logic
Type baked into the artwork
Trademarks
Five fabric rolls drawn five ways
Three rocks nobody could tell apart
38 files still named Group-N
```

**Text (0:30):** `We could have renamed them and shipped 86.`

**Note:** hold the last two lines longest. `Group-N` and the rocks are what people remember.

### Scene 5 — 0:32–0:42 · The system

**Visual:** the 24-unit grid draws itself. The 2-unit live area marks in the accent colour. Then
`talking-drum` draws on, anchors visible, snapping to keylines.

**Text:** `24 × 24. A 2-unit live area, measured on true curve bounds.`
**Text (0:38):** `1.5 stroke. Round caps. 1.5-unit minimum counter.`

### Scene 6 — 0:42–0:48 · Enforced

**Visual:** cut to a terminal. `npm run validate` runs. Checks pass in sequence. Then a deliberate
failure: one asset fails `bounds-live-area`, in red, with its coordinates.

**Text:** `Not a style guide. A command that fails the build.`

**Note:** show the failure. A green wall of ticks is a screenshot; a real failure is evidence. Use
the actual held `clay-pot` case if it is still the live example — geometry reaching beyond the
live area is the truest possible demonstration.

### Scene 7 — 0:48–0:56 · The size of it

**Visual:** the contact sheet assembles, icon by icon, into the full grid. Then the status table
fades up over it.

**Text:** `32 icons. One weight of the four we specify.`
**Text (0:52):** `1 held. 55 in the backlog. 0 illustrations. 0
confirmed local names.`

### Scene 8 — 0:56–1:04 · Working

**Visual:** three quick real recordings, cut tight — the website search from
[`browser-demo.md`](browser-demo.md), the plugin insertion from [`plugin-demo.md`](plugin-demo.md),
the Community file assets panel from [`community-file-demo.md`](community-file-demo.md).

**Text:** `Website. Figma plugin, offline. Community file. All MIT.`

### Scene 9 — 1:04–1:10 · The ask

**Visual:** `talking-drum`, large, with `gangan` and `dùndún` beneath it, both greyed, both marked
`pending`.

**Text:** `Zero local-language names in this library are confirmed.`
**Text (1:07):** `If you speak Yoruba, Hausa, Igbo or Nigerian Pidgin — we would like half an
hour.`

### Scene 10 — 1:10–1:14 · End card

```
African Icon Library
icons.neustackstudio.com

MIT · Nigeria first, the continent next
icons@neustackstudio.com
```

---

## Production notes

**Typography.** One typeface, the site's. Minimum 36 px at 1080p. Text on paper, never over a busy
frame.

**Motion.** Everything eases in and holds. No spins, no bounces, no parallax. The drawings are
still objects and the video should treat them that way.

**Colour.** Paper `#FAF9F6`, ink `#16150F`, accent `#2E7D4F` — used in scene 5 for the live area
and scene 6 for the failure, and nowhere else.

**Sound.** Ambience in scene 1 only, if it is team-recorded. Otherwise silence throughout. No
licensed music unless the licence is checked and permits commercial use, and it is recorded in
[`../media-kit/credits.md`](../media-kit/credits.md).

**Captions.** Burned in for the text cards. A separate `.srt` for accessibility, matching the
on-screen text exactly.

**Cuts.** Hard cuts everywhere except the fade up in scene 1 and the fade to the end card.

---

## Cut-downs from the same master

| Length | Scenes                     | Used for                             |
| ------ | -------------------------- | -------------------------------------- |
| 70s    | all                        | website hero, press kit, YouTube      |
| 30s    | 1, 4, 7, 8, 10             | LinkedIn, X                            |
| 15s    | 1, 7, 10                   | pre-roll, story placements             |
| 6s     | scene 1 plus the end card  | anywhere a loop is needed              |

Cut down from the master. Do not re-edit from source for each length; the scenes will drift apart.

---

## What must not appear

- Any drawing not in the released set.
- A weight picker showing a selectable `bold`, `thin` or `fill`.
- A coloured `nigeria-flag` or `football-jersey`.
- Stock footage of "Africa".
- A count not substituted from repository state on the day of the final render.
- Music with unverified rights.
- Any claim that a channel is live if it is not live on the publication date.
