# @african-icon-library/metadata

Canonical, typed metadata for the [African Icon Library](https://github.com/neustackdesign/african-icon-library).

```bash
npm install @african-icon-library/metadata
```

## Usage

```ts
import {
  icons,
  categories,
  regions,
  library,
  getIcon,
  getIconsByCategory,
  getPopulatedCategories,
  searchIcons,
} from '@african-icon-library/metadata';

icons.length; // released icons only
getIcon('jollof-rice')?.keywords;
searchIcons(icons, 'jollof rice', { category: 'food-drink' });
library; // { version, icons, categories, maps, mapRegions, weights }
```

Every record is in the public shape:

- **Icon** — `id`, `name`, `description`, `category`, `tier`, `regions`, `weights`, `keywords`,
  `localNames`, `status`, `addedIn`
- **Category** — `id`, `label`, `description`
- **CountryMap**, **MapRegion**, **Region** — as typed

The repository keeps richer internal maintenance records (audit provenance, reviewer notes);
they are not part of this package.

`icons` contains released icons and nothing else — that is enforced by the type, not by
convention. Held and backlog concepts are not exported.

## Search

`searchIcons` and `searchMaps` are shared by the website and the Figma plugin so they rank
identically. They are also available without loading any records:

```ts
import { searchIcons, searchMaps } from '@african-icon-library/metadata/search';
```

Both accept any records with the fields they read (`SearchableIcon`, `SearchableMap`). Every token
must match something, exact ids outrank keywords, diacritics are stripped, and ties break
alphabetically so ordering is stable.

## Schema

The types are plain TypeScript with no runtime dependencies. Validation runs in the repository
against the canonical records, before anything is generated; see
[docs/metadata-schema.md](../../docs/metadata-schema.md).
