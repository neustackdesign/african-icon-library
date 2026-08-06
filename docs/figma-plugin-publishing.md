# Figma plugin — publishing metadata

Everything the Figma Community submission form asks for, written and ready. Nothing here has been
submitted; publishing is item 4.3 in [RELEASE_CHECKLIST.md](../RELEASE_CHECKLIST.md) and needs
account access.

---

## Listing copy

**Plugin name**
`African Icon Library`

**Tagline** (Figma allows 100 characters)
`Search and place open-source icons for African life — offline, no account, no tracking.`

**Description**

> Search 32 icons for African life and drop them straight onto the canvas as editable
> vectors.
>
> **Offline by design.** Every icon is compiled into the plugin at build time. It requests no
> network access at all — the manifest declares `"allowedDomains": ["none"]` — and the build fails
> if any networking call reaches the bundle. Nothing about your document, your search terms or
> your account leaves your machine, because there is nowhere for it to go.
>
> **What it does**
>
> - Search in English across names, ids and keywords, ranked exactly as on the website
> - Filter by category — only categories that actually contain icons are offered
> - Choose a weight from the weights that are actually drawn
> - Insert at 16, 24, 32 or 48 px, into your selection or the centre of your viewport
> - Icons arrive as editable vector frames with scale constraints, named from the library metadata
>
> **What it does not do, yet**
> The library ships the `regular` weight only. `thin`, `bold` and `fill` appear in the weight
> picker as unavailable rather than being hidden, because pretending they exist would be worse
> than saying they do not. They will not be faked by changing a stroke width.
>
> **Why these icons**
> A danfo, a suya skewer, a talking drum, a naira note, an agogo, a ludo board. Things every
> global icon library has skipped. Drawn on one 24-pixel grid with a 2-unit live area so they sit
> level beside the rest of your system.
>
> MIT licensed. Free for commercial use, no attribution required.
>
> Source and roadmap: github.com/neustackdesign/african-icon-library

**Tags** (up to 12)
`icons`, `icon library`, `african`, `nigeria`, `culture`, `open source`, `svg`, `vector`,
`design system`, `ui`, `offline`, `insert`

**Category**
Icons (secondary: Design systems)

**Creator**
Neustack Design

**Support contact**
`icons@neustackstudio.com`

**Website**
`https://icons.neustackstudio.com`

**Playground / example file**
Link to the Community file once it is published — see
[figma-community-file-spec.md](./figma-community-file-spec.md).

---

## Permissions and privacy answers

Figma's submission form asks these directly. The answers are short because the plugin is short.

| Question                            | Answer                                                    |
| ----------------------------------- | --------------------------------------------------------- |
| Does the plugin access the network? | No. `networkAccess.allowedDomains` is `["none"]`.         |
| Does it collect personal data?      | No.                                                       |
| Does it use analytics?              | No.                                                       |
| Does it require a user account?     | No.                                                       |
| Does it store data?                 | No — not `clientStorage`, not `setPluginData`.            |
| Editor support                      | Figma design files.                                       |
| Document access                     | `dynamic-page`. The plugin only touches the current page. |

The privacy answer is verifiable rather than asserted: `apps/figma-plugin/build.ts` scans both
bundles for `fetch`, `XMLHttpRequest`, `WebSocket`, `EventSource`, `importScripts` and absolute
http(s) URLs, and fails the build on a match. A test asserts the same thing about the sources.

---

## Cover requirements

Figma requires a 1920 × 960 cover image (2:1).

- **Background:** `#FAF9F6`. Ink `#16150F`. One use of `#2E7D4F` as an accent.
- **Safe area:** 120 px from every edge — the card is cropped at several ratios.
- **Composition:**
  - The plugin panel rendered at realistic scale on the right third, showing a real search
    ("dr") with real results.
  - Four to six real icons at large scale on the left.
  - Name and tagline set over the paper.
- **Must not** show a weight picker with `bold` selected, or any icon not in the build. The cover
  is the first place an overstated claim would land.
- **Must not** be a screenshot of a mock-up. Run the plugin, screenshot it, composite it.

Export at 2× and check legibility at 320 px wide, which is roughly how it appears in Community
search results.

---

## Carousel plan

Up to five images, 1920 × 960. Most viewers see the first two.

| #   | Content                                                                                                    | Point it makes                                               |
| --- | ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| 1   | The plugin panel open beside a Figma canvas, mid-search, with results showing                              | This is the thing, working, in situ                          |
| 2   | An icon being inserted into a selected frame, with the resulting layer tree visible — frame, then vectors  | Editable vectors, not flattened images or PNGs               |
| 3   | The weight picker with `regular` active and `thin` / `bold` / `fill` struck through as unavailable         | Honest about what is drawn; sets expectations before install |
| 4   | The empty state after a search that matches nothing, showing the count of icons the library actually ships | The set is small and the plugin says so                      |
| 5   | The manifest's `networkAccess` block beside the build script's offline assertion, typeset plainly          | The offline claim is enforced, not asserted                  |

Frames 3 and 5 are unusual choices for a plugin listing. They are there because the alternative is
a user finding out after install.

---

## Submission steps

1. `npm run build -w @african-icon-library/figma-plugin` — produces `dist/code.js` and
   `dist/ui.html`.
2. In the Figma desktop app: **Plugins → Development → Import plugin from manifest**, choose
   `apps/figma-plugin/manifest.json`.
3. Test, at minimum:
   - an empty file with nothing selected;
   - a frame selected (the icon should land inside it);
   - a locked layer selected (it should fall back to the viewport, not fail);
   - a text layer selected (it should land beside it);
   - a search with no results;
   - insertion at each of 16, 24, 32 and 48 px.
4. **Plugins → Development → Publish**.
5. Figma assigns the plugin id. Replace `REPLACE_WITH_FIGMA_ASSIGNED_PLUGIN_ID` in
   `apps/figma-plugin/manifest.json` and commit it — the placeholder must never reach `main`
   after publication.
6. Paste the listing copy above, upload the cover and carousel, set the support contact.
7. Submit for review. Figma's review typically asks about network access; the manifest answers it.

## After publishing

- [ ] Update the website's plugin section, which currently says the plugin is not on the
      Community. Do not update it before.
- [ ] Add the Community link to `README.md` and to the Community file's Usage page.
- [ ] Note the release in `CHANGELOG.md`.
