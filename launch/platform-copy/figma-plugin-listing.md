# Figma plugin — listing copy

**Phase 3.** Submit only after the manual test pass in `RELEASE_CHECKLIST.md` §4.3, and only with
the cover and carousel described in `docs/figma-plugin-publishing.md`.

The submission-form answers, permissions table, cover requirements and carousel plan live in
[`docs/figma-plugin-publishing.md`](../../docs/figma-plugin-publishing.md) and are the source of
truth. This file is the listing copy with tokens, plus the review correspondence we expect to need.

---

## Plugin name

```
African Icon Library
```

## Tagline (100 characters max)

```
Search and place open-source icons for African life — offline, no account, no tracking.
```

86 characters.

## Description

> Search 32 icons for African life and drop them straight onto the canvas as editable
> vectors.
>
> **Offline by design.** Every icon is compiled into the plugin at build time. It requests no
> network access at all — the manifest declares `"allowedDomains": ["none"]` — and the build fails
> if any networking call reaches the bundle. Nothing about your document, your search terms or your
> account leaves your machine, because there is nowhere for it to go.
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
> picker as unavailable rather than being hidden, because pretending they exist would be worse than
> saying they do not. They will not be faked by changing a stroke width.
>
> **Why these icons**
> A danfo, a suya skewer, a talking drum, a naira note, an agogo, a ludo board. Things every global
> icon library has skipped. Drawn on one 24-pixel grid with a 2-unit live area so they sit level
> beside the rest of your system.
>
> MIT licensed. Free for commercial use, no attribution required.
>
> Source and roadmap: github.com/neustackdesign/african-icon-library

## Tags (up to 12)

```
icons, icon library, african, nigeria, culture, open source, svg, vector, design system, ui, offline, insert
```

## Category

`Icons` — secondary `Design systems`

## Creator

`Neustack Design`

## Support contact

`icons@neustackstudio.com`

## Website

`https://icons.neustackstudio.com`

## Playground / example file

Link to the published Community file. **Leave blank if the Community file is not live** — a dead
link in a plugin listing is worse than an absent one.

---

## The "not yet drawn" line, and why it stays in

Two of the five carousel frames are about limits: the weight picker with three weights struck
through, and the empty state that says how many icons exist. Reviewers of this listing will
suggest cutting them, because listings do not usually advertise what a tool cannot do.

Keep them. The alternative is a designer installing the plugin, searching for something outside a
32-icon set, finding nothing, and uninstalling with a worse impression than an honest
listing would have given. The frames are not modesty; they are expectation-setting placed before
the install rather than after it.

---

## Expected review correspondence

Figma's plugin review most reliably asks about network access and data handling. Answer once,
precisely, with the verifiable form of the claim.

**If asked about network access:**

> The plugin makes no network requests. `manifest.json` declares
> `"networkAccess": { "allowedDomains": ["none"] }`.
>
> All icon data is compiled into the bundle at build time from the repository's metadata package,
> so there is no runtime data source to fetch from. The build script at
> `apps/figma-plugin/build.ts` scans both the sandbox and UI bundles for `fetch`,
> `XMLHttpRequest`, `WebSocket`, `EventSource`, `importScripts` and absolute http(s) URLs, and
> fails the build if any of them is present. A unit test asserts the same about the sources.
>
> The source is public: github.com/neustackdesign/african-icon-library

**If asked about data collection or storage:**

> None. No analytics, no telemetry, no account, no `clientStorage`, no `setPluginData`. Document
> access is `dynamic-page` and the plugin only touches the current page.

**If asked why the weight picker shows unavailable options:**

> The library specifies four weights and has drawn one. The picker shows `thin`, `bold` and `fill`
> struck through as unavailable rather than hiding them, so users understand the library's real
> shape before adopting it. Selecting them is not possible; they are inert.

**If asked about the icon content and cultural depictions:**

> Every released icon's name is either descriptive English or a cultural referent that has been
> confirmed by a reviewer. The metadata schema refuses to release an icon whose required cultural
> review is outstanding, and one drawing is currently held from release for exactly that reason.
> No icon depicts an identifiable person, a trademark, or a national symbol in colour or with a
> crest. The process is documented at
> github.com/neustackdesign/african-icon-library/blob/main/docs/cultural-review.md

---

## After approval — the checklist that must not be skipped

1. Figma assigns the plugin id. Replace `REPLACE_WITH_FIGMA_ASSIGNED_PLUGIN_ID` in
   `apps/figma-plugin/manifest.json` and **commit it**. The placeholder must never sit on `main`
   after publication.
2. Update the website's plugin section, which says the plugin is not on the Community. Do this
   after approval, never in anticipation of it.
3. Add the Community link to `README.md` and to the Community file's Usage page.
4. Note the release in `CHANGELOG.md`.
5. Only then post the announcement copy in
   [`x-short-posts.md`](x-short-posts.md) and
   [`linkedin-launch-post.md`](linkedin-launch-post.md).

---

## Plugin store update notes

Short, factual, and framed around what changed for the user in the canvas.

**Template:**

> **32 icons now.** New in this build: _[ids, kebab-case]_. Still one drawn weight;
> `thin`, `bold` and `fill` are still specified and undrawn. Still offline — the manifest still
> declares `"allowedDomains": ["none"]` and the build still fails if a networking call reaches the
> bundle.

Do not use update notes to announce roadmap items. The plugin's update log is a record of what the
plugin does, not a newsletter.
