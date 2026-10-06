'use client';

import type { PublicCategory as Category } from '@/lib/public-icon';

import type { BrowserMap } from '@/lib/maps';

import { IconBrowser } from './IconBrowser';
import { MapBrowser } from './MapBrowser';
import { useBrowser, type AssetMode } from './landing/LibraryProvider';

interface Props {
  categories: Category[];
  weightsShipped: readonly string[];
  proposeHref: string;
  iconCount: number;
  maps: BrowserMap[];
  mapRegions: Array<{ id: string; label: string; count: number }>;
  defaultMap: string;
}

/**
 * The library browser: one surface, two asset types.
 *
 * Both views stay mounted so switching back keeps each view's search and
 * selection. Icons behave exactly as before; maps are a separate view, not an
 * icon category.
 */
export function LibraryBrowser({
  categories,
  weightsShipped,
  proposeHref,
  iconCount,
  maps,
  mapRegions,
  defaultMap,
}: Props) {
  const { mode, setMode } = useBrowser();
  const options: Array<{ value: AssetMode; label: string; count: number }> = [
    { value: 'icons', label: 'Icons', count: iconCount },
    { value: 'maps', label: 'Maps', count: maps.length },
  ];

  return (
    <div className="library">
      <div className="asset-switch" role="group" aria-label="Asset type">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            aria-pressed={mode === option.value}
            onClick={() => setMode(option.value)}
          >
            {option.label}
            <span className="asset-switch__count">{option.count}</span>
          </button>
        ))}
      </div>
      <div hidden={mode !== 'icons'}>
        <IconBrowser
          categories={categories}
          weightsShipped={weightsShipped}
          proposeHref={proposeHref}
          active={mode === 'icons'}
        />
      </div>
      <div hidden={mode !== 'maps'}>
        <MapBrowser
          entries={maps}
          regions={mapRegions}
          defaultSelection={defaultMap}
          active={mode === 'maps'}
        />
      </div>
    </div>
  );
}
