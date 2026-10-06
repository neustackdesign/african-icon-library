# Country maps — cartographic treatment

AIL follows a documented cartographic treatment for disputed territories. Boundary representations do not imply endorsement of territorial claims.

## Scope

The release covers the 54 UN member states in Africa, one map each. Western Sahara is not a
separate AIL map in this release.

## Where each map comes from

`packages/maps/source/manifest.json` is the source of truth. `npm run maps:ingest` reads it and:

- extracts every map listed in `fromMaster` from `african-country-maps-4x-master.svg`, the original
  AIL master sheet, which stays unchanged as provenance;
- copies every map listed in `overrides` from `overrides/<id>.svg`, which supersedes the master.

All 54 master outlines are still extracted and validated on every run, so a changed master fails
loudly. An override is never overwritten by the master. `--check` fails if a committed SVG differs
from its declared source, and ingest refuses an override that is missing, undeclared, or identical
to the master outline it replaces.

## The four overrides

| Map               | Why                                           | Treatment                                                                                                                                                                                                                                           |
| ----------------- | --------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Morocco           | The master's Morocco includes Western Sahara. | Redrawn from Natural Earth subunit `MAR`, clipped at 27.661439°N, the Morocco–Western Sahara line in the same dataset.                                                                                                                              |
| Tanzania          | The master omits Zanzibar.                    | Master mainland kept; Unguja and Pemba (`TZZ`) added at their true positions.                                                                                                                                                                       |
| Mauritius         | The master omits Rodrigues.                   | Master main island kept; Rodrigues added at its true relative scale and bearing, then moved inward along that bearing until it sits one inset gap clear of the drawing, so the open sea is shortened. Agaléga and other outer islets are not drawn. |
| Equatorial Guinea | The master omits Annobón.                     | Master Río Muni and Bioko kept; Annobón (`GNA`) added at its true relative scale and bearing, then deliberately moved inward along that bearing as an inset, one inset gap clear of the drawing, so the open-sea distance is shortened.             |

Source: [Natural Earth](https://www.naturalearthdata.com/) 1:10m Admin 0 map subunits, v5.1.2
(public domain), pinned by SHA-256 in the manifest. The overrides are derived by
`scripts/ingest/derive-map-overrides.ts`:

```bash
curl -LO https://raw.githubusercontent.com/nvkelso/natural-earth-vector/v5.1.2/geojson/ne_10m_admin_0_map_subunits.geojson
npx tsx scripts/ingest/derive-map-overrides.ts --source ne_10m_admin_0_map_subunits.geojson
npm run maps:ingest
```

The inset gap is 2.5 units in the master's drawing space: the 1.5 stroke plus one clear unit.
Islands are placed against the master's own mainland drawing by fitting Natural Earth's mainland to
it, so the designed mainland geometry is kept. Projection is equirectangular with x scaled by
cos(mean latitude), which matches the master. Every map is normalised to the same longest side,
so maps do not show relative size.

Very small islands, such as Annobón and the Cabo Verde islets, are smaller than the 1.5 stroke and
read as dots at icon sizes. Seychelles and similar archipelagos are not drawn island by island.
