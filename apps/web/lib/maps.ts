import { getMapBody, getMapViewBox, renderMapSvg } from '@african-icon-library/maps';
import { mapRegions, maps, type CountryMap, type MapRegion } from '@african-icon-library/metadata';

export interface BrowserMap {
  map: CountryMap;
  /** Inner markup. Injected as SVG, never as HTML. */
  body: string;
  /** Native viewBox size — previews keep this aspect ratio. */
  width: number;
  height: number;
  /** The complete, copyable SVG document. */
  svg: string;
}

/**
 * Every released country map, in the master's regional order.
 *
 * Built from `@african-icon-library/metadata` (`maps`) and
 * `@african-icon-library/maps` (the drawings). A metadata row without a
 * drawing fails the build here rather than rendering an empty tile.
 */
export function mapEntries(): BrowserMap[] {
  return maps.map((map) => {
    const body = getMapBody(map.id);
    const box = getMapViewBox(map.id);
    const svg = renderMapSvg(map.id, { title: map.name });
    if (body === undefined || !box || !svg) throw new Error(`no drawing for map "${map.id}"`);
    return { map, body, width: box.width, height: box.height, svg };
  });
}

/** AIL's regional grouping, limited to regions that contain a map, with counts. */
export function populatedMapRegions(): Array<MapRegion & { count: number }> {
  return mapRegions
    .map((region) => ({ ...region, count: maps.filter((map) => map.region === region.id).length }))
    .filter((region) => region.count > 0);
}

export function mapRegionLabel(id: string): string {
  return mapRegions.find((region) => region.id === id)?.label ?? id;
}
