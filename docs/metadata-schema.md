# Metadata schema

The canonical definition is `packages/metadata/src/schema.ts`. It is Zod, so the types and the
runtime validation come from one source and cannot disagree. This document explains the shape and,
more usefully, why each field exists.

## Public and internal

The canonical records carry internal maintenance fields (`provenance`, `culturalReview`, category
`auditKey`) and the repository keeps the audit records. These are for maintenance, validation and
audit traceability, and **never leave the repository**. Every public surface — the
`@african-icon-library/metadata` package, the website, the Figma plugin, the release ZIPs and the
standalone metadata JSON — uses the public contract in `packages/metadata/src/public.ts`:

| Shape            | Fields                                                                                                               |
| ---------------- | -------------------------------------------------------------------------------------------------------------------- |
| `Icon`           | `id`, `name`, `description`, `category`, `tier`, `regions`, `weights`, `keywords`, `localNames`, `status`, `addedIn` |
| `Category`       | `id`, `label`, `description`                                                                                         |
| `Region`         | `code`, `label`                                                                                                      |
| `CountryMap`     | `id`, `name`, `officialName?`, `iso2`, `iso3`, `region`, `aliases`, `keywords`, `status`, `addedIn`                  |
| `MapRegion`      | `id`, `label`                                                                                                        |
| `LibrarySummary` | `version`, `icons`, `categories`, `maps`, `mapRegions`, `weights`                                                    |

Generators project canonical records through `toPublicIcon` / `toPublicCategory` /
`toPublicRegion`. The package builds only its public entry points (`src/index.ts`,
`src/search.ts`), so `schema.ts` and `src/data/` are not in the tarball. `npm run verify:public`
scans the website build, served downloads, release ZIPs and JSON, the Figma plugin bundle and
packed npm tarballs, and fails on any internal field or per-record value; `npm run release:verify`
checks every release metadata file has exactly the public shapes.

## Files

| File                          | Contents                                         | Public?                         |
| ----------------------------- | ------------------------------------------------ | ------------------------------- |
| `src/data/icons.json`         | Released icons, canonical (with internal fields) | Projected — exported as `icons` |
| `src/data/categories.json`    | The nine-category taxonomy                       | Projected — `categories`        |
| `src/data/regions.json`       | Regions in use                                   | Projected — `regions`           |
| `src/data/maps.json`          | The 54 country maps, in master order             | Yes — exported as `maps`        |
| `src/data/map-regions.json`   | AIL's regional grouping for maps                 | Yes — `mapRegions`              |
| `src/data/audit-records.json` | All 86 audit rows, verdicts and notes verbatim   | **No**                          |
| `src/generated/data.ts`       | The public projections and `library` summary     | Yes                             |

`audit-records.json` is the internal working record. It stays in the repository — the design
history is worth reading, and provenance tests check against it — but it is not exported from the
package root, is excluded from the published `files` list, and never reaches a public surface.
A test asserts that no held drawing's id or component name appears in any generated output.

## `Icon`

```ts
{
  id: string;                    // lower-case kebab-case, names the concept
  name: string;                  // display name, English
  description: string;           // what the glyph depicts, one line
  category: string;              // -> categories[].id
  tier: 'icon' | 'illustration';
  regions: string[];             // ISO 3166-1 alpha-2
  weights: Weight[];             // weights that exist as drawn assets
  keywords: string[];            // search aliases, English
  localNames: LocalName[];
  status: 'released';            // public metadata is released-only, by type
  addedIn: string;               // semver of first release
  culturalReview: CulturalReview;
  provenance: {
    auditSourceFile: string;     // e.g. "Group-27.png"
    auditVerdict: AuditVerdict;
    referentConfirmed: boolean;
  };
}
```

### `id`

Names the concept, not the file and not the drawing style. `talking-drum`, never
`Talking Drum Outline` or `talking-drum-line`. One id spans every weight and both tiers, which is
what makes "the same concept at a different fidelity" expressible at all.

The regex rejects leading digits, double hyphens and trailing hyphens, so an id is always a safe
identifier, filename and URL segment.

### `weights`

Lists weights that **exist as drawn assets**. It is validated against the file system in both
directions, and set-wide: a weight ships for the entire library or not at all.

This field is where the library's core honesty rule lives. A weight is never synthesised by
changing `stroke-width`, and `weights` must never claim one that has not been drawn.

### `keywords` vs `localNames`

`keywords` are plain English search terms — "minibus", "banknote", "skewer". They make no cultural
claim and need no review.

`localNames` are names in a Nigerian or African language, and each carries a `review` state:

```ts
{ language: 'yo', value: 'gangan', review: 'pending' }
```

Only `confirmed` entries are rendered publicly. Pending ones still feed the search index, with
diacritics stripped, so the work is useful while it waits. See
[cultural-review.md](./cultural-review.md).

### `culturalReview`

```ts
{ required: boolean; status: 'not-required' | 'pending' | 'approved'; note?: string }
```

`releasedIconSchema` refuses to parse an icon where `required` is true and `status` is not
`approved`. The invariant is enforced by the type, not by a habit.

### `provenance`

Points back to the audit row the drawing descends from. `referentConfirmed` mirrors whether the
audit flagged the name with a warning; a test asserts no released icon has it false.

## `Category`

```ts
{
  id: string;
  label: string;
  description: string;
  auditKey: string;
}
```

`auditKey` retains the audit's short key (`fas`, `mus`, `pla`…) so audit rows stay traceable after
the rename to stable public ids.

Nine categories are defined. The website and the plugin show only those containing at least one
released icon — an empty filter is a promise the product cannot keep.

## `CountryMap`

```ts
{
  id: string;           // slug, e.g. 'cote-d-ivoire' — stable, separate from the name
  name: string;         // display name, e.g. 'Côte d’Ivoire'
  officialName: string;
  iso2: string;         // ISO 3166-1 alpha-2
  iso3: string;         // ISO 3166-1 alpha-3
  region: string;       // a map-regions.json id
  keywords: string[];
  aliases: string[];    // common alternative names: 'Ivory Coast', 'DRC'…
  status: 'released';
  addedIn: string;      // version, e.g. '0.3.0'
}
```

Regions are AIL's regional grouping for browsing, not a political or UN classification. Map ids,
names and ISO codes are unique, and every record has exactly one SVG in `packages/maps/svg`
(enforced by `npm run validate`). `searchMaps` matches every query token against the name,
official name, aliases, ISO2/ISO3 (exact code ranks first) and region label.

## `LibrarySummary`

```ts
{
  (version, icons, categories, maps, mapRegions, weights);
}
```

Public facts about the release: what ships, never how it was made. Audit, hold and backlog counts
are maintenance data and stay with the repository's own tooling.

## Search

`searchIcons(icons, query, options)` lives in the metadata package so the website and the Figma
plugin rank identically. It:

- requires every token to match something, so "jollof rice" cannot be satisfied by an icon that
  only matches "rice";
- ranks exact id and name matches above prefixes, above id segments, above keywords, above
  descriptions;
- strips diacritics, so "dundun" reaches "dùndún";
- breaks ties alphabetically, so ordering is stable across runs and surfaces.

## Adding a field

1. Add it to the schema with a doc comment saying why it exists.
2. Add it to every record in `icons.json` (the schema will tell you which are missing).
3. Run `npm run generate` and commit the regenerated output.
4. Add a test if the field carries an invariant. Most do.
