# Browser demo — recording script

A 45-second screen recording of `icons.neustackstudio.com`. Used on the website, in the press kit,
and as the source for reel 1.

**Records against the deployed site in phase 2.** Not a prototype, not localhost with a mocked data
set.

---

## Setup

| Setting            | Value                                                                     |
| ------------------ | --------------------------------------------------------------------------- |
| Viewport           | 1440 × 900, recorded at 2× → 2880 × 1800, delivered at 1920 × 1080         |
| Browser            | Clean profile. No extensions, no bookmarks bar, no other tabs.              |
| Theme              | Light for the master take. Record a full dark take as well.                 |
| Cursor             | Visible, no click-highlight animation, no artificial cursor graphic.        |
| Frame rate         | 60 fps capture, delivered at 30                                             |
| Motion             | Real speed. **Do not speed-ramp the typing.** The search is fast; show it.  |
| Audio              | None. Captions burned in.                                                   |

**Before recording:** hard-refresh so the load is real, and confirm the icon count on screen
matches the repository. A recording with a stale count has to be redone.

---

## Shot list

### Shot 1 — the hero (0:00–0:05)

Load the page. Let it settle for a beat, then scroll slowly to reveal the browser grid.

**Caption:** `icons.neustackstudio.com`

**Note:** do not cut the initial load. The site is static-first; the fact that it appears
immediately is a real property worth showing.

### Shot 2 — the grid (0:05–0:10)

Hold on the icon grid. Slow scroll through the full set, top to bottom, once.

**Caption:** `32 icons. 7 categories. One weight.`

**Note:** the whole set fits in a short scroll. That is the point — do not hide it with a fast pan.

### Shot 3 — search (0:10–0:16)

Click the search field. Type `dr` at natural speed. Results narrow to the drum. Pause. Clear it.
Type `jollof`. One result.

**Caption:** `Search names, ids and keywords.`

**Note:** the result-count line reads `{n} of 32 icons` and updates live. Make sure it
is in frame.

### Shot 4 — the empty state (0:16–0:22)

Type something the library does not have. Use a genuinely plausible miss — `keke` or `okada`, not a
nonsense string. Hold on the empty state long enough to read it.

**Caption:** `Most searches come back empty. The site says so.`

**Note:** this is the most important shot in the recording and the one an instinct will say to cut.
Do not cut it.

### Shot 5 — category filter (0:22–0:26)

Open the category select. Show that only categories containing icons are offered. Pick Food &
Drink. The grid narrows.

**Caption:** `Only categories that actually contain icons.`

### Shot 6 — copy an icon (0:26–0:32)

Click `danfo`. The detail panel opens. Click `Copy SVG`. The button changes to `Copied`.

**Caption:** `Copy the SVG. currentColor, so it takes your text colour.`

**Note:** if the clipboard is refused during the take, keep it — the site says so honestly and that
is a better shot than a retake. If it succeeds, that is fine too.

### Shot 7 — preview size (0:32–0:36)

Change the preview size control: 32 → 24 → 16. The grid re-renders at each.

**Caption:** `Drawn for 24. Holds at 16.`

### Shot 8 — the status page (0:36–0:43)

Navigate to `/status`. Hold on the table long enough to read every row.

**Caption:** `Every number computed from the repository at build time.`

**Note:** this is the shot that carries the positioning. Hold it for seven seconds even though it
feels long. It is the only static table anyone will actually read.

### Shot 9 — end card (0:43–0:45)

Cut to a static card: paper, wordmark, one line.

```
icons.neustackstudio.com
MIT · Nigeria first
```

---

## Alternate takes to capture in the same session

Cheap while everything is set up, expensive to come back for:

- **Dark theme**, full run.
- **Mobile**, 375 px viewport at 2×, shots 1–4 only.
- **Keyboard-only**, tabbing through the browser with focus rings visible. Useful for an
  accessibility-focused audience and proves a real claim.
- **The downloads page**, scrolling past the SHA-256 checksums.
- **The spec page**, scrolling. Source for a still.

---

## What must not appear in the recording

- A count that does not match the repository on the day of recording.
- A weight picker or weight status implying `thin`, `bold` or `fill` are available.
- Any held or backlog drawing.
- A browser with other tabs, extensions or bookmarks visible.
- A staging or localhost URL in the address bar.
- Artificial cursor graphics, click ripples or zoom-punch transitions.
- Music.

## Editing notes

- **Cuts, not transitions.** No cross-fades except into the end card.
- **Captions:** bottom third, ink on a paper-coloured bar at 90% opacity, minimum 28 px at 1080p.
- **No zoom-punches.** If something needs emphasis, hold on it longer.
- **Total length 45 seconds.** If it runs over, cut shot 5 or shot 7 — never shot 4 or shot 8.
