# Instagram reel scripts

Three reels. Each is short, has no talking head, and works with the sound off — captions burned in,
because most viewers will never hear the audio.

**Format:** 1080 × 1920, 9:16. Safe area: keep everything important within the middle 1080 × 1420 —
Instagram's UI covers roughly 250 px top and 250 px bottom.

**Length:** 15–30 seconds. A 45-second reel about an icon library is a 45-second reel nobody
finishes.

**Sound:** no licensed music unless the licence is checked and permits commercial use — this is a
project whose entire pitch is that it does not ship things it has no rights to. Use the recorded
sound of the thing where possible (a keyboard, a drum), or silence with burned-in captions.

**Screen recording source:** the real website and the real plugin. Not a prototype, not a mock-up.
See [`../demo-scripts/`](../demo-scripts/) for the shot-by-shot recording scripts these draw from.

---

## Reel 1 — "Does it read at 16 pixels?" (phase 2, Thu 1 October 2026)

**Length:** 20 seconds. The most convincing thing this library can show anyone in under a minute.

| Time      | Shot                                                                                                              | Burned-in caption                               |
| --------- | ------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| 0:00–0:03 | `danfo` at full screen on paper, ink. Static.                                                                       | `Every icon library says it works at small sizes.` |
| 0:03–0:07 | Smooth scale down: 200 px → 96 px → 48 px → 24 px → 16 px, centred, no motion blur.                                | `Here is ours at 16.`                            |
| 0:07–0:11 | Hold at 16 px, then whip-scale back to 400% so the pixel grid is visible. Glyph still legible.                     | `Still a danfo.`                                 |
| 0:11–0:16 | Cut to the proof strip from `previews/proof-strip-24.svg`: every released icon in a row at 24 px, scrolling slowly. | `32 icons. All at 24.`               |
| 0:16–0:20 | Cut to a static end card on paper.                                                                                  | `Minimum 1.5 units of counter, so nothing fills in. MIT. icons.neustackstudio.com` |

**Caption**

```
The only icon test that matters: does it still read at 16 pixels?

Every drawing in this library has a minimum of 1.5 units of counter between parallel strokes, which
is the specific rule that stops a glyph filling into a smudge at small sizes. It is checked in CI,
along with the canvas bounds and the 2-unit live area.

32 open-source icons for African life. MIT. Link in bio.
```

---

## Reel 2 — "Search, place, done" (phase 3, Thu 15 October 2026)

**Length:** 25 seconds. Screen recording of the real plugin, at real speed. Do not speed-ramp the
typing; the point is that it is fast without editing.

| Time      | Shot                                                                                                        | Burned-in caption                              |
| --------- | ------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| 0:00–0:03 | A Figma file, mid-design. A nav bar with three placeholder squares where icons should be.                     | `Nigerian product. No icons for it.`           |
| 0:03–0:06 | Open the plugin. Panel slides in, showing the icon grid.                                                       | —                                              |
| 0:06–0:11 | Type `dr` in the search field. Results narrow to the drum. Real speed, real ranking.                          | `Search`                                       |
| 0:11–0:16 | Click. The icon lands inside the selected frame. Cut to the layer tree — frame, then vectors, named from metadata. | `Editable vectors. Not a flattened image.` |
| 0:16–0:20 | Select the vector, change the stroke colour to match the nav bar text.                                         | `One click to recolour.`                       |
| 0:20–0:25 | Cut to the manifest, typeset: `"networkAccess": { "allowedDomains": ["none"] }`                               | `And it cannot reach the network.`             |

**Caption**

```
Search 32 icons for African life and drop them onto the canvas as editable vectors,
without leaving Figma.

The plugin cannot reach the network. The manifest declares "allowedDomains": ["none"], every icon
is compiled into the bundle at build time, and the build fails if fetch, XMLHttpRequest, WebSocket,
EventSource, importScripts or any absolute http(s) URL reaches either bundle.

No account. No analytics. Nothing about your document leaves your machine, because there is nowhere
for it to go.

MIT. Link in bio.
```

---

## Reel 3 — "From photograph to glyph" (phase 4, Thu 5 November 2026)

**Length:** 30 seconds. The process reel. It exists because people who will never install an icon
library will watch a drawing get made.

| Time      | Shot                                                                                                          | Burned-in caption                                |
| --------- | ----------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| 0:00–0:04 | A photograph of a real danfo on a Lagos road. Held, no movement.                                                    | `This is a danfo.`                               |
| 0:04–0:08 | Cross-fade to the 24-unit grid, empty, with the 2-unit live area marked.                                            | `24 units. Everything inside a 2-unit margin.`   |
| 0:08–0:14 | Time-lapse: the body block, then the windows, then the wheels. Keep the anchors visible while they snap to keylines. | `Anchors on whole and half units.`               |
| 0:14–0:18 | A detail gets added, then deleted.                                                                                  | `At most three levels of detail. This was four.` |
| 0:18–0:23 | The finished glyph, then a scale-down to 16 px and back.                                                            | `It has to survive here.`                        |
| 0:23–0:30 | The glyph joins the contact sheet, sitting level beside its neighbours.                                             | `One grid. 32 icons. MIT.`           |

**Caption**

```
A danfo, from photograph to glyph.

The rules it has to survive: 24 × 24 canvas, everything inside a 2-unit live area measured on true
curve bounds, 1.5 stroke, round caps and joins, at most three levels of internal detail, no text,
no hard-coded colour, no transforms.

The fourth level of detail in the middle of this clip is real. It came out because the icon has to
read at 16 pixels and it did not.

32 icons for African life. Open source, MIT. Link in bio.
```

**Note on the photograph:** it must be a photograph we have the right to use — one taken by the
team, or one under a licence that permits commercial use with the attribution actually provided.
Credit it in [`../media-kit/credits.md`](../media-kit/credits.md). A rights-unclear photograph in a
reel for a library about not shipping things you have no rights to is the worst available own goal.

---

## Rules for every reel

- **Works with sound off.** Captions burned in, always.
- **Real product, real speed.** No prototype, no sped-up typing, no fake cursor.
- **Never show a held or backlog drawing.** Those ids appear in no generated surface and a test
  asserts it.
- **Never show a weight picker with `bold` selected.** Same rule as the Figma cover.
- **No music with unclear rights.**
- **One end card, with the domain, not five links.**
- **Substitute counts the morning of posting.**
