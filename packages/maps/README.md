# @african-icon-library/maps

Canonical SVG country maps for the [African Icon Library](https://github.com/neustackdesign/african-icon-library):
one outline for each of 54 African countries, in the library's line language.

> **Not published to npm yet.** Build it from the repository: `npm install && npm run build`.

Maps are a separate asset type from icons, not an icon category. Metadata — names, ISO 3166-1
codes, AIL's regional grouping, aliases — lives in `@african-icon-library/metadata` as `maps`.

## What is in here

```
svg/*.svg        one standalone SVG per country, its own viewBox, currentColor
source/          the design master the SVGs are extracted from (not published)
src/generated/   the drawings compiled into a module
```

`npm run maps:ingest` extracts `svg/` from `source/african-country-maps-4x-master.svg`. It is
deterministic and fails loudly if the master's count, order or drawing treatment changes. Never
edit `svg/` by hand.

## Usage

```ts
import { renderMapSvg, getMapViewBox, fitMapSize, mapIds } from '@african-icon-library/maps';

renderMapSvg('nigeria', { size: 128, title: 'Nigeria' });
// longest side 128 px, the other side follows Nigeria's own proportions

getMapViewBox('gambia'); // { width: 21.1, height: 6.5 }
fitMapSize('gambia', 128); // { width: 128, height: 39.43 }
```

## Rules every map obeys

- One closed outline per country, islands kept as further closed sub-paths.
- A tight viewBox padded by half the stroke, so round caps and joins never clip, and the map's real
  aspect ratio — never stretched into a square.
- `stroke="currentColor"`, `fill="none"`, `stroke-width="1.5"`, round caps and joins. No text, no
  transforms, no background.
