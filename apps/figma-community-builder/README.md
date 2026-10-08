# African Icon Library — Community File Builder

An internal Figma plugin that builds the whole Community file in one action: every page, every
component, every instance, and the frames the Community listing itself needs.

It exists because the Community file has to be rebuilt on every release, and rebuilding it by hand
is how a file drifts from the repository — a stale count here, a component that no longer matches
an id there. This plugin reads the same generated data the public plugin reads, so the file it
produces cannot claim anything the repository does not contain.

It is not published to the Figma Community. It is a tool for whoever holds the Figma account.

## What it builds

**Exactly three pages.** The published Community source file is on Figma's Free plan, which allows
no more than three pages per file, so the builder produces three and never creates a fourth — not
even briefly during a rebuild.

```
01 — Library
02 — Community Listing
03 — Notes & Publishing
```

The page list is fixed. What changes with a release is what is _on_ the pages: every count, icon,
map, group and region is derived from the generated data each time the builder runs.

### `01 — Library`

One long, navigable page. Reading down the main column:

1. **Intro and counts** — what the file is, the three-page structure, and the counts (for the
   current release: 30 icons, 54 country maps).
2. **All Icons** — every released icon as an instance, grouped visually by the category groups in
   the mapping below (a group with no released icon is left out).
3. **Country Maps** — every released map as an instance, grouped by AIL's regional grouping, each at
   its real proportions.

To the right of that column, in a frame named `Components`, sit the canonical components in two
labelled sections:

4. **Components — Icons** — one component per released icon, `african-icons/<category>/<id>`.
5. **Components — Maps** — one component per released map, `ail/maps/<id>`.

The components are created first, because every instance anywhere in the file is made from them.

### `02 — Community Listing`

- `Cover` — 1920 × 960, the **first frame on the page**. Paper `#FAF9F6`, ink `#16150F`, accent
  `#2E7D4F` used once. A row of real icons, a row of real country maps, the library name, and the
  current counts — `30 icons · 54 maps` for this release.
- `Community/Cover` and `Community/Carousel-01` … `-06` — 1920 × 960 each, for the Community
  listing, following [docs/figma-community-file-spec.md](../../docs/figma-community-file-spec.md).
  One carousel slide is the country maps. Figma allows nine carousel images; the builder makes only
  the slides it has real content for, and caps at nine.

### `03 — Notes & Publishing`

Everything that is guidance rather than assets, as sections of one page: drawing and spec guidance,
**Names & Cultural Notes** (one card per icon), the maps' cartographic and boundary policy, licence,
contributions and corrections, source-of-truth guidance, and the release and publishing checklist.
It carries no internal audit or provenance workflow data.

## Category → page mapping

`packages/metadata/src/data/categories.json` defines nine categories. The Library page's **All
Icons** section presents six groups, because three of the nine are folded into a neighbour rather
than given a group that would hold one or two icons.

| Metadata category   | Group                        | Why                                                                               |
| ------------------- | ---------------------------- | --------------------------------------------------------------------------------- |
| `identity-state`    | **Identity & State**         | Direct.                                                                           |
| `defence`           | **Identity & State**         | Armed-forces equipment and insignia are marks the state makes about itself.       |
| `fashion-textiles`  | **Fashion & Textiles**       | Direct.                                                                           |
| `food-drink`        | **Food & Drink**             | Direct.                                                                           |
| `music-art-play`    | **Music, Art & Play**        | Direct.                                                                           |
| `culture-people`    | **Music, Art & Play**        | Ceremony, craft and regalia are the same "things people make and play with" idea. |
| `transport`         | **Transport**                | Direct.                                                                           |
| `commerce-industry` | **Everyday Life & Commerce** | Direct — money, markets, trade.                                                   |
| `places-landmarks`  | **Everyday Life & Commerce** | The built environment ordinary life and trade take place in.                      |

Inside a folded group each metadata category still gets its own labelled section with its real
category label, so `Commerce & Industry` and `Places & Landmarks` are never presented as one thing.
The folding is a presentation decision, not a re-classification of the data. A populated category
that no group claims still appears, as a group of its own.

The mapping lives in `src/plan.ts` (`CATEGORY_PAGE_SPECS`) and is restated independently in
`tests/figma-community-builder.test.ts`, so changing it in one place fails the test rather than
silently making this table wrong.

## Country Maps

The **Country Maps** section of the Library page shows every released country map in subsections by
AIL's regional grouping (North, West, Central, East and Southern Africa), each map at its real
proportions with its name. The cover strip and a dedicated carousel slide on the Community Listing
page announce the maps; their counts are read from the generated data.

## Components

One component per released icon in the **Components — Icons** section of the Library page, named
`african-icons/<category-id>/<icon-id>` — so Figma's asset panel nests them by category and the
names correspond exactly to ids in `packages/metadata/src/data/icons.json`.

Each is a 24 × 24 frame with `Clip content` off and its vectors constrained to `Scale`, so an
instance resized to 48 or 480 stays on-grid and nothing on the edge of the canvas is cut.

**Weights.** A `Weight` variant property is created **only** where more than one weight is genuinely
drawn — that is, where the icon's metadata lists the weight _and_ a real SVG exists for it in the
build. With a single drawn weight the builder makes a plain component with no variant property, and
the Components — Icons section says so in as many words. A one-value `Weight=Regular` property would imply the
other three weights exist somewhere in the file; they do not. The builder never creates a variant
for a weight nobody has drawn, even if the metadata claims it.

One component per released map in the **Components — Maps** section of the Library page, named `ail/maps/<id>` — e.g.
`ail/maps/nigeria`. Each is fitted so its longest side is 24 and the other side follows the map's
real proportions; geography is never stretched to a square. Clip content is off, vectors are
constrained to `Scale`, and the component holds the outline only — no text.

Every icon in the Library page's All Icons section, on the cover, on the name cards and in the
Community frames is an **instance** of one of these components. Nothing is a copy.

## Data source

The builder imports:

- `../../figma-plugin/src/generated/icon-data` — `PLUGIN_ICONS`, `PLUGIN_SVG`, `PLUGIN_CATEGORIES`
  and `PLUGIN_WEIGHTS`, the module `npm run generate` writes for the public plugin;
- `../../figma-plugin/src/generated/map-data` — `PLUGIN_MAPS`, `PLUGIN_MAP_SVG`,
  `PLUGIN_MAP_BOXES` and `PLUGIN_MAP_REGIONS`, likewise generated for the public plugin;
- `@african-icon-library/metadata` — category descriptions, region labels and the pipeline summary.

Reusing the public plugin's generated module is deliberate: a second generator would be a second
thing to keep in sync, and the first release where they disagreed would ship a Community file that
contradicted the plugin. There is therefore **no new generator** and nothing to add to
`npm run generate`.

Nothing in `src/` writes down an icon or map id, an icon or map count, or a category list. Sixteen icons or sixty,
the same code produces the correct file.

Before building, make sure the data is current:

```
npm run generate
npm run build -w @african-icon-library/metadata
```

The first regenerates `icon-data.ts` from the metadata JSON; the second rebuilds the metadata
package's `dist/`, which is what the counts on `01 — Library` and the Community
listing frames are read from.

## Build and run locally

```
npm install
npm run build -w @african-icon-library/figma-community-builder
```

The root `npm run build` does **not** include this app — it is a tool, not a shipped artefact.
Build it explicitly.

Then, in the **Figma desktop app** (this cannot be done in the browser):

1. Open or create the file you want to build into. A blank file is the normal case.
2. Menu → **Plugins → Development → Import plugin from manifest…**
3. Choose `apps/figma-community-builder/manifest.json`.
4. Menu → **Plugins → Development → African Icon Library — Community File Builder**.
5. The panel shows the icon count and the drawn weights it found. Click **Build the file**.
6. Watch the progress bar. When it finishes, the panel reports pages created, components created and
   icons placed, plus any notes.

`npm run dev -w @african-icon-library/figma-community-builder` rebuilds on change; use
**Plugins → Development → Hot reload plugin** to pick up the new bundle.

### Running it twice

The builder writes a marker to `figma.root` with `setPluginData`, and one to every page it creates.
On a second run it refuses to build and tells you the file already contains one, offering **Wipe and
rebuild** instead.

That path **reuses the pages it owns** — identified by the marker, not by matching a page name —
empties them and rebuilds into them, so the file never holds more than three pages at any moment.
(An earlier version of this builder produced thirteen pages; a file built that way is rebuilt into
three, and the surplus pages are removed.) A blank file's untouched default page (`Page 1`, empty)
is reused too. It does not park a scratch page, because on the Free plan there is no room for one.

Pages you added yourself are never touched. Because the Free plan allows only three pages, a file
that holds any page the builder did not make has no room for the three it needs: the builder then
**refuses before changing anything** and says so. Run it in a blank file, or delete the other pages
first.

## What to check by eye before publishing

The automated tests cover structure, naming and counts. These are the things only a person looking
at the file can confirm:

- [ ] The file has exactly three pages, and the `Cover` frame is first on `02 — Community Listing`
      with the thumbnail you expect.
- [ ] The icons on the cover render as real drawings, not empty frames — a Figma SVG import failure
      is reported as a note in the panel, but check anyway.
- [ ] Text on the cover and every carousel slide sits inside 120 px of each edge.
- [ ] No slide has content overflowing its 1920 × 960 frame. Long releases reflow; very long ones may
      need the grid sizes in `gridMetrics()` adjusting.
- [ ] Every stroke is still live — 1.5, round cap, round join. Nothing outlined.
- [ ] No text layer inside any icon component (tested, but cheap to confirm).
- [ ] Pending local names on `09` are visibly labelled `PENDING — unconfirmed`.
- [ ] The counts on `00` and on `Community/Carousel-05` match the repository.
- [ ] Asset panel: components nest under `african-icons › <category> › <icon>`.

Then work through the checklist at the end of
[docs/figma-community-file-spec.md](../../docs/figma-community-file-spec.md).

## Offline by construction

The manifest declares:

```json
"networkAccess": { "allowedDomains": ["none"] }
```

`build.ts` scans both output bundles for `fetch`, `XMLHttpRequest`, `WebSocket`, `EventSource`,
`importScripts` and absolute http(s) URLs, and fails the build on a match — the same assertion
`apps/figma-plugin/build.ts` performs, duplicated rather than imported because that file runs its
own build at the top level. A test asserts the same thing about the sources.

One visible consequence: **the addresses on `01 — Library` and `03 — Notes & Publishing` are
plain text, not clickable Figma hyperlinks.** A hyperlink needs a full `https://…` URL in the
bundle, which the offline assertion forbids. Addresses are written the way the repository's own docs
write them — bare domains a reader can copy. Working around the assertion to make them clickable
would defeat the point of having it.

The builder stores nothing except its own build marker (`setPluginData` on the document root and on
the pages it creates). No `clientStorage`, no analytics.

## Architecture

```
src/main.ts        sandbox thread — the gate: one build at a time, never on top of another
src/builder.ts     the build itself: pages, components, instances, slides
src/plan.ts        pure structure — page list, category mapping, cover selection. No Figma API.
src/copy.ts        every word the file contains, with counts interpolated from the data
src/nodes.ts       thin wrappers over the Figma node API
src/theme.ts       palette, fonts, geometry
src/messages.ts    the UI ↔ sandbox contract, with a type guard
src/ui.html/.css/.ts  the panel; CSS and JS are inlined at build time
build.ts           esbuild bundler + the offline assertion
```

`plan.ts` touches no Figma API, which is what lets the page list, the mapping and the cover
selection be tested without a Figma runtime.

## Fonts

The file is typeset in Inter, which Figma ships. Every style used anywhere — Regular, Medium, Semi
Bold — goes through `figma.loadFontAsync` **before the first text node is created**. If any of them
fails to load the build stops there: nothing has been created, the document is exactly as you left
it, and you get a `figma.notify` naming the font that failed and what to do about it.

## What has not been verified

Everything below is asserted by the test suite against a fake of the Figma API
(`tests/figma-community-builder.test.ts`): exactly three pages and never a fourth (the fake enforces
Figma's Free-plan limit), the page contents, component count and naming,
the single-weight-no-variant rule, the multi-weight variant path, instance placement, the cover
frame's position and size, the Community frame sizes, pending-name labelling, idempotency across
three runs, and graceful failure when fonts reject or the SVG importer throws.

The following **have not been run against a real Figma runtime** in this environment, and this
README does not claim they have:

- That Figma's `createNodeFromSvg` accepts every bundled asset. The builder catches the failure per
  icon and reports it as a note, but which assets survive import is a question only Figma answers.
- Visual layout: auto-layout heights are computed by Figma, so whether a page or a 1920 × 960 slide
  is well-composed at a given release size is a judgement to make with your eyes. `gridMetrics()`
  and the carousel sizing scale with the icon count, but they are heuristics.
- That `figma.root.insertChild` reorders pages in the running app. It is guarded — if it throws, the
  names still carry the order (`01`, `02`, `03`) — but the guard has not been exercised against
  Figma itself.
- That a real Free-plan file accepts the three-page build. The limit is enforced by the test fake,
  not by Figma.
- Whether the thumbnail Figma generates from the `Cover` frame crops acceptably at every Community
  card ratio. The 120 px safe area follows the spec; the result needs looking at.
- Font availability. Inter is bundled with Figma, so the failure path should be rare, but it is the
  path with the least real-world exposure.
