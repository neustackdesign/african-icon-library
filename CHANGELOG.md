# Releases

Public release notes for the African Icon Library.

## [Unreleased]

- Figma Community file and plugin publication are being prepared for the V2 rollout.

## [0.3.0] — 2026-10-05

Country Maps: a second asset type alongside icons.

### Added

- **54 country maps**, one outline per African country, grouped by AIL's regional grouping (North 7, West 15, Central 8, East 16, Southern 8). Stroked `currentColor` SVGs with real proportions, extracted deterministically from a committed master (`npm run maps:ingest`).
- Map metadata with names, official names, ISO 3166-1 alpha-2/alpha-3 codes and common aliases (Ivory Coast, Cape Verde, Swaziland, DRC…); search by name, alias, ISO code or region.
- New package `@african-icon-library/maps` (`renderMapSvg`, `fitMapSize`, view boxes); `@african-icon-library/metadata` exports `maps`, `mapRegions` and `searchMaps`.
- Website: Icons | Maps switch in the browser, a static page per country at `/maps/<id>`, map pages in the sitemap.
- Figma plugin: Maps mode with region filter and 64–512 px longest-side insertion.
- Community file: Country Maps page, `Components — Maps` with `ail/maps/<id>` components, maps on the cover and carousel.
- Release: `african-icon-library-maps-<v>.zip` and `african-icon-library-complete-<v>.zip`, both in the checksummed manifest.

### Changed

- The Community file's `Components` page is now `Components — Icons`.
- Release metadata JSON and manifest gain `maps` and `mapRegions`. The icon-only ZIP is unchanged.

Minor bump: pre-1.0, the packages' exported shape grows (new exports and a new package) — see docs/governance/versioning.md.

## [0.2.0] — 2026-08-06

V2 rebuilds the African Icon Library around one consistent 24-pixel icon system.

### Added

- **30 released icons** across **7 categories**, all in the `regular` weight.
- Direct SVG bundle downloads plus smaller category packs.
- Published metadata and SHA-256 checksums for release assets.
- Searchable website browser with copyable SVG output.
- Figma plugin and Community-file build tooling driven by the same canonical icon metadata.
- Repository validation, contribution and release automation.

### Changed

- Standardised released drawings to a shared 24 × 24 grid and `currentColor` output.
- Tightened naming, metadata and contribution rules so additions can extend the set without creating a second visual system.
- Refined the release set after visual QA rather than carrying every legacy asset into V2 automatically.

[Unreleased]: https://github.com/neustackdesign/african-icon-library/compare/v0.3.0...HEAD
[0.3.0]: https://github.com/neustackdesign/african-icon-library/releases/tag/v0.3.0
[0.2.0]: https://github.com/neustackdesign/african-icon-library/releases/tag/v0.2.0
