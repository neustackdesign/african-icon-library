# Plugin demo — recording script

A 50-second screen recording of the Figma plugin, in Figma desktop, on a real file.

**Records in phase 3, after approval.** A demo of a plugin nobody can install is a demo that
generates frustration.

---

## Setup

| Setting        | Value                                                                             |
| -------------- | ----------------------------------------------------------------------------------- |
| Application    | Figma desktop, current version. Not the browser build.                              |
| Viewport       | 1440 × 900, recorded at 2×, delivered at 1920 × 1080                                |
| Figma theme    | Light for the master take; record a dark take too — the plugin UI is theme-aware    |
| File           | A prepared demo file, described below                                               |
| Cursor         | Visible. No artificial cursor, no click ripples.                                    |
| Motion         | Real speed. Do not speed-ramp.                                                      |
| Audio          | None. Captions burned in.                                                           |

### The demo file

Build it before recording. It has to look like real work, not like a demo.

- A plausible Nigerian product screen: a food-delivery order summary or a transport-booking flow.
- Real-looking content, with **no real customer data and no third-party trademarks**.
- Three or four icon slots deliberately left as empty placeholder squares.
- Existing icons from a general library already in the nav, so the new icon has to sit beside them.
  That is the honest test and it is more convincing than an empty canvas.
- Nothing in the layer panel named `Untitled` or `Frame 427`.

---

## Shot list

### Shot 1 — the problem (0:00–0:06)

The file, open, at a comfortable zoom. Pan slowly across the design and stop on the empty icon
slots.

**Caption:** `A Nigerian product. No icons for it.`

### Shot 2 — open the plugin (0:06–0:10)

Open the plugin from the menu. The panel appears with the icon grid.

**Caption:** `African Icon Library · 32 icons`

**Note:** do not cut the panel opening. It opens instantly because everything is compiled in at
build time, which is the point of the next-but-one shot.

### Shot 3 — search (0:10–0:16)

Type `dr` in the search field. Results narrow to the drum. Backspace, type `bus`. `danfo` appears —
keyword matching, not just name matching.

**Caption:** `Search names, ids and keywords. Same ranking as the website.`

### Shot 4 — category filter (0:16–0:20)

Open the category filter. Show that only categories containing icons are offered. Pick Transport.

**Caption:** `Only categories that actually contain icons.`

### Shot 5 — the weight picker (0:20–0:26)

Open the weight picker. Hold. `regular` is selectable; `thin`, `bold` and `fill` are struck
through. Try to click `bold` — nothing happens. Hold for a beat on that non-response.

**Caption:** `One weight is drawn. The other three are shown as undrawn, not hidden.`

**Note:** the deliberate failed click is the shot. It shows the state is real rather than
decorative. Do not cut it for pace.

### Shot 6 — insert (0:26–0:34)

Select the target frame on the canvas. Choose size 24. Click `danfo`. The icon lands inside the
selected frame, sized and positioned.

**Caption:** `Inserts into your selection, at 16, 24, 32 or 48.`

### Shot 7 — it is a real vector (0:34–0:40)

Expand the layer tree: frame, then vectors, named from the metadata. Select a vector, change the
stroke colour to match the nav text.

**Caption:** `Editable vectors with scale constraints. Named from the library metadata.`

**Note:** the layer names are the proof it is not a flattened import. Make them legible — zoom the
layer panel if necessary, but do not zoom the canvas.

### Shot 8 — the offline claim (0:40–0:47)

Cut away from Figma to a typeset still: the manifest's `networkAccess` block on the left, the build
script's assertion on the right.

```
manifest.json
  "networkAccess": { "allowedDomains": ["none"] }

apps/figma-plugin/build.ts
  fails the build if fetch, XMLHttpRequest, WebSocket,
  EventSource, importScripts or an absolute http(s) URL
  reaches either bundle
```

**Caption:** `It cannot reach the network. Not "does not" — cannot.`

### Shot 9 — end card (0:47–0:50)

```
icons.neustackstudio.com
MIT · no account · no tracking
```

---

## Also capture in the same session

- **Dark theme**, full run — the plugin UI is theme-aware and this is worth showing once.
- **The empty state**: a search with no results, showing the icon count.
- **No selection**: insert with nothing selected; the icon lands at the centre of the viewport.
- **Locked selection**: insert with a locked layer selected; it falls back to the viewport rather
  than failing. Not for the main cut, but a genuinely good clip for a technical audience.
- **Keyboard-only operation**, tabbing through the panel with focus rings visible.

---

## What must not appear

- A weight picker with `bold`, `thin` or `fill` selected. It cannot happen in the product and must
  not appear in a recording.
- Any held or backlog drawing.
- A development-plugin badge, if the take is meant to represent the published plugin.
- `REPLACE_WITH_FIGMA_ASSIGNED_PLUGIN_ID` anywhere on screen.
- Real customer data, unreleased work, or a third-party trademark in the demo file.
- A count that does not match the repository on the day of recording.
- Any network indicator, loading spinner or "fetching…" state. There is nothing to fetch, and a
  spinner would contradict the whole claim.

## Editing notes

- **Cuts only.** One cut away from Figma, for shot 8.
- **Do not speed up the typing.** Search is genuinely fast; speeding it up makes viewers assume it
  is not.
- **Hold shot 5 and shot 7.** They are the two shots that carry claims.
- **Total 50 seconds.** If over, trim shot 1 and shot 4. Never shot 5 or shot 8.
