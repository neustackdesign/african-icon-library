# African Icon Library — Figma plugin

Search the library and drop icons onto the canvas as editable vectors. It requests no network
access.

## Build and run locally

```
npm install
npm run build -w @african-icon-library/figma-plugin
```

Then in the Figma desktop app: **Plugins → Development → Import plugin from manifest**, and choose
`apps/figma-plugin/manifest.json`.

`npm run dev:plugin` rebuilds on change; use **Plugins → Development → Hot reload plugin** to pick
up the new bundle.

## Offline by construction

The manifest declares:

```json
"networkAccess": { "allowedDomains": ["none"] }
```

Every icon, label and search term is compiled into the bundle by `npm run generate`. `build.ts`
scans both output bundles for `fetch`, `XMLHttpRequest`, `WebSocket`, `EventSource`,
`importScripts` and absolute http(s) URLs, and fails the build on a match — so the manifest's
claim is enforced rather than asserted. A test checks the same thing about the sources.

The plugin stores nothing: no `clientStorage`, no `setPluginData`, no analytics.

## Architecture

```
src/main.ts              sandbox thread — owns the document
src/ui.ts                iframe thread — search, filters, previews
src/ui.html / ui.css     UI shell; CSS and JS are inlined at build time
src/messages.ts          the message contract between the two, with a type guard
src/generated/           icon data, compiled in
build.ts                 esbuild bundler + the offline assertion
```

Search comes from `@african-icon-library/metadata`, so the plugin and the website rank results
identically.

## Document handling

The sandbox thread assumes the document may be empty, locked, mid-edit or in a state it has never
seen. Insertion resolves a destination in this order — inside a single selected container, beside
a single selected node, then the centre of the viewport — and falls through rather than failing
on: no selection, multiple selection, a removed node, a locked node, a locked ancestor, a node
with no bounding box, and a page that throws when its selection is read.

If Figma cannot parse the markup, or the parent refuses `appendChild`, the user gets a specific
message and any orphan node is removed rather than left at the page origin.

Figma's SVG importer has no notion of `currentColor`, so it is swapped for explicit black at
insert time. The asset on disk keeps `currentColor`.

## Publishing

Listing copy, tags, support contact, cover requirements and the carousel plan are in
[docs/figma-plugin-publishing.md](../../docs/figma-plugin-publishing.md). Nothing has been
published; Figma assigns the plugin id at publish time, replacing the placeholder in the manifest.
