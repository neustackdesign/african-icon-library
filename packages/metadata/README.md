# @african-icon-library/metadata

Canonical, typed metadata for the [African Icon Library](https://github.com/neustackdesign/african-icon-library).

> **Not published to npm yet.** Build it from the repository: `npm install && npm run build`.

## Usage

```ts
import {
  icons,
  categories,
  regions,
  pipeline,
  getIcon,
  getIconsByCategory,
  getPopulatedCategories,
  searchIcons,
} from '@african-icon-library/metadata';

icons.length; // released icons only
getIcon('jollof-rice')?.keywords;
searchIcons(icons, 'jollof rice', { category: 'food-drink' });
pipeline.weightsPlanned; // ['thin', 'bold', 'fill'] — specified, not drawn
```

`icons` contains released icons and nothing else — that is enforced by the type, not by
convention. Held and backlog concepts are not exported.

## Search

`searchIcons` is shared by the website and the Figma plugin so they rank identically. Every token
must match something, exact ids outrank keywords, diacritics are stripped, and ties break
alphabetically so ordering is stable.

## Schema

The schema is Zod, so types and runtime validation come from one definition. See
[docs/metadata-schema.md](../../docs/metadata-schema.md) for the field-by-field rationale.

Two fields carry the project's honesty rules:

- `weights` lists weights that exist as **drawn** assets, validated against the file system in
  both directions and set-wide.
- `culturalReview` refuses to let an icon with an outstanding review parse as released.
