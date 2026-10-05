'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from 'react';

import { track } from '@/lib/analytics';
import type { BrowserIcon } from '@/lib/icons';

/** Matches the design system's wide breakpoint. */
export const WIDE_QUERY = '(min-width: 1000px)';
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

export const PREVIEW_SIZES = [16, 24, 32, 48] as const;
export type PreviewSize = (typeof PREVIEW_SIZES)[number];

function useMediaQuery(query: string, serverValue: boolean): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const list = window.matchMedia(query);
      list.addEventListener('change', onChange);
      return () => list.removeEventListener('change', onChange);
    },
    () => window.matchMedia(query).matches,
    () => serverValue,
  );
}

/* ---------------- browser state ---------------- */

interface CopyState {
  /** `id` for an icon, `map:<id>` for a map — so the two never collide. */
  id: string;
  /** File name the toast reports. */
  file: string;
  ok: boolean;
}

export type AssetMode = 'icons' | 'maps';

interface BrowserState {
  /** Which asset type the browser is showing. */
  mode: AssetMode;
  setMode: (mode: AssetMode) => void;
  entries: BrowserIcon[];
  byId: Map<string, BrowserIcon>;
  query: string;
  setQuery: (query: string) => void;
  category: string;
  setCategory: (category: string) => void;
  size: PreviewSize;
  setSize: (size: PreviewSize) => void;
  /** The icon the detail panel describes. */
  selectedId: string | null;
  /** Below the wide breakpoint the panel is a sheet that is only shown on request. */
  panelOpen: boolean;
  isWide: boolean;
  /** Tile click: select on wide; open, switch or close the sheet otherwise. */
  toggle: (id: string) => void;
  closePanel: () => void;
  /** Ribbon and specimen: clear filters, select the icon and bring the browser into view. */
  openInBrowser: (id: string) => void;
  /** Category index: filter the browser to one category and bring it into view. */
  showCategory: (categoryId: string) => void;
  copy: (id: string, surface: string) => void;
  /** Copies any SVG document; used by the map view. */
  copyText: (key: string, file: string, text: string, onCopied: () => void) => void;
  copied: CopyState | null;
}

const BrowserContext = createContext<BrowserState | null>(null);

export function useBrowser(): BrowserState {
  const value = useContext(BrowserContext);
  if (!value) throw new Error('useBrowser must be used inside <LibraryProvider>.');
  return value;
}

/* ---------------- specimen state ---------------- */

interface SpecimenState {
  /** Index into the ordered entries. */
  index: number;
  /** Ribbon hover/focus: show this icon and stop cycling for the rest of the visit. */
  point: (index: number) => void;
  /** True once a visitor has driven the specimen themselves. */
  pinned: boolean;
  advance: () => void;
  reducedMotion: boolean;
}

const SpecimenContext = createContext<SpecimenState | null>(null);

export function useSpecimen(): SpecimenState {
  const value = useContext(SpecimenContext);
  if (!value) throw new Error('useSpecimen must be used inside <LibraryProvider>.');
  return value;
}

function scrollToBrowser() {
  // `scroll-padding-top` clears the sticky header; `scroll-behavior` in CSS
  // makes this smooth only when reduced motion is not requested.
  document.getElementById('browse')?.scrollIntoView({ block: 'start' });
}

interface ProviderProps {
  entries: BrowserIcon[];
  /** Selected on wide screens before anyone has chosen, so the panel is never empty on arrival. */
  defaultSelection: string;
  children: ReactNode;
}

export function LibraryProvider({ entries, defaultSelection, children }: ProviderProps) {
  const byId = useMemo(() => new Map(entries.map((entry) => [entry.icon.id, entry])), [entries]);

  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [size, setSize] = useState<PreviewSize>(32);
  const [selectedId, setSelectedId] = useState<string | null>(
    byId.has(defaultSelection) ? defaultSelection : (entries[0]?.icon.id ?? null),
  );
  const [panelOpen, setPanelOpen] = useState(false);
  const [copied, setCopied] = useState<CopyState | null>(null);
  const [mode, setModeState] = useState<AssetMode>('icons');

  const setMode = useCallback((next: AssetMode) => {
    setModeState(next);
    // Keep the URL shareable: /#maps opens the browser in map mode.
    try {
      const hash = next === 'maps' ? '#maps' : '#browse';
      if (window.location.hash !== hash) window.history.replaceState(null, '', hash);
    } catch {
      /* history can be unavailable in sandboxed previews */
    }
  }, []);

  // `/#maps` (from the header, footer or a map page) opens map mode directly.
  useEffect(() => {
    const sync = () => {
      if (window.location.hash === '#maps') {
        setModeState('maps');
        scrollToBrowser();
      }
    };
    sync();
    window.addEventListener('hashchange', sync);
    return () => window.removeEventListener('hashchange', sync);
  }, []);
  const copyTimer = useRef<number | undefined>(undefined);

  // Server-rendered as wide, so the desktop layout arrives complete; narrower
  // screens settle on hydration without a visible panel either way.
  const isWide = useMediaQuery(WIDE_QUERY, true);
  const reducedMotion = useMediaQuery(REDUCED_MOTION_QUERY, true);

  const toggle = useCallback(
    (id: string) => {
      if (isWide) {
        setSelectedId(id);
        return;
      }
      if (panelOpen && selectedId === id) {
        setPanelOpen(false);
        return;
      }
      setSelectedId(id);
      setPanelOpen(true);
    },
    [isWide, panelOpen, selectedId],
  );

  const closePanel = useCallback(() => setPanelOpen(false), []);

  const openInBrowser = useCallback((id: string) => {
    setModeState('icons');
    setQuery('');
    setCategory('all');
    setSelectedId(id);
    setPanelOpen(true);
    scrollToBrowser();
  }, []);

  const showCategory = useCallback((categoryId: string) => {
    setModeState('icons');
    setQuery('');
    setCategory(categoryId);
    scrollToBrowser();
  }, []);

  const copyText = useCallback((key: string, file: string, text: string, onCopied: () => void) => {
    const settle = (ok: boolean) => {
      setCopied({ id: key, file, ok });
      window.clearTimeout(copyTimer.current);
      copyTimer.current = window.setTimeout(() => setCopied(null), ok ? 2000 : 3000);
    };
    if (!text || !navigator.clipboard) {
      settle(false);
      return;
    }
    // Clipboard access can be refused (permissions, insecure context). Say so
    // rather than pretending the copy worked.
    navigator.clipboard.writeText(text).then(
      () => {
        onCopied();
        settle(true);
      },
      () => settle(false),
    );
  }, []);

  const copy = useCallback(
    (id: string, surface: string) => {
      copyText(id, `${id}.svg`, byId.get(id)?.svg ?? '', () =>
        track('icon_copy', { target: id, surface }),
      );
    },
    [byId, copyText],
  );

  useEffect(() => () => window.clearTimeout(copyTimer.current), []);

  const browser = useMemo<BrowserState>(
    () => ({
      mode,
      setMode,
      entries,
      byId,
      query,
      setQuery,
      category,
      setCategory,
      size,
      setSize,
      selectedId,
      panelOpen,
      isWide,
      toggle,
      closePanel,
      openInBrowser,
      showCategory,
      copy,
      copyText,
      copied,
    }),
    [
      mode,
      setMode,
      copyText,
      entries,
      byId,
      query,
      category,
      size,
      selectedId,
      panelOpen,
      isWide,
      toggle,
      closePanel,
      openInBrowser,
      showCategory,
      copy,
      copied,
    ],
  );

  /* specimen */
  const [index, setIndex] = useState(0);
  const [pinned, setPinned] = useState(false);
  const point = useCallback((next: number) => {
    setIndex(next);
    setPinned(true);
  }, []);
  const advance = useCallback(
    () => setIndex((current) => (current + 1) % Math.max(1, entries.length)),
    [entries.length],
  );
  const specimen = useMemo<SpecimenState>(
    () => ({ index, point, pinned, advance, reducedMotion }),
    [index, point, pinned, advance, reducedMotion],
  );

  return (
    <BrowserContext.Provider value={browser}>
      <SpecimenContext.Provider value={specimen}>
        {children}
        <CopyToast copied={copied} />
      </SpecimenContext.Provider>
    </BrowserContext.Provider>
  );
}

/** Clipboard confirmation. Always mounted so screen readers hear each change. */
function CopyToast({ copied }: { copied: CopyState | null }) {
  return (
    <div role="status" aria-live="polite">
      {copied ? (
        <p className="toast label-tag" data-tone={copied.ok ? 'ok' : 'error'}>
          <span className="toast__key" aria-hidden="true" />
          {copied.ok ? `Copied ${copied.file}` : 'Clipboard blocked — use Download'}
        </p>
      ) : null}
    </div>
  );
}
