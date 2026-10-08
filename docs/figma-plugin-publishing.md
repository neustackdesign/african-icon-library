# Figma plugin — publishing pack

Listing copy and the update checks for the African Icon Library plugin.

The plugin is live on Figma Community:
[figma.com/community/plugin/1687997071772751842/african-icon-library](https://www.figma.com/community/plugin/1687997071772751842/african-icon-library)
(plugin id `1687997071772751842`, set in `apps/figma-plugin/manifest.json`). Releases are
**updates to this existing plugin**, never a new plugin.

## Listing copy

**Plugin name**  
`African Icon Library`

**Tagline**  
`Search and place open-source icons and African country maps — directly in Figma.`

**Description**

> Search the African Icon Library and place editable vectors directly onto your canvas.
>
> v0.3.0 has two modes. **Icons**: 30 icons across seven categories, including everyday objects,
> food, transport, culture, identity, fashion, commerce and play, all on the same 24-pixel drawing
> system. **Maps**: outline maps of all 54 African countries in the same 1.5 stroke, searchable by
> name, common alias, ISO code or region. Everything comes from the same canonical source as the
> website and downloadable SVG sets.
>
> **What you can do**
>
> - Switch between Icons and Maps
> - Search icons by name and keyword; search maps by name, alias, ISO code or region
> - Filter icons by category and maps by region
> - Insert icons as editable vectors at 16, 24, 32 or 48 px
> - Insert maps at 64, 128, 256 or 512 px on the longest side; every map keeps its real aspect
>   ratio and is never stretched or clipped
> - Restyle the inserted vector like any other Figma layer
>
> AIL follows a documented cartographic treatment for disputed territories. Boundary
> representations do not imply endorsement of territorial claims.
>
> The plugin is intentionally offline: it requests no network access, collects no personal data,
> uses no analytics and requires no account.
>
> MIT licensed. Free for personal and commercial use.
>
> Website: icons.neustackstudio.com  
> Source: github.com/neustackdesign/african-icon-library

**Tags**  
`icons`, `icon library`, `maps`, `country maps`, `african`, `nigeria`, `culture`, `open source`,
`svg`, `vector`, `design system`, `offline`

**Category**  
Icons

**Creator**  
Neustack Design

**Support contact**  
`icons@neustackstudio.com`

**Website**  
`https://icons.neustackstudio.com`

## Privacy and permissions

| Question                 | Answer                                                  |
| ------------------------ | ------------------------------------------------------- |
| Network access           | None — `networkAccess.allowedDomains` is `["none"]`.    |
| Personal data collection | None.                                                   |
| Analytics                | None.                                                   |
| User account required    | No.                                                     |
| Persistent storage       | None.                                                   |
| Editor support           | Figma design files.                                     |
| Document access          | `dynamic-page`; insertion operates on the current page. |

## Listing media

**Cover:** 1920 × 960. Use real released icons and a real plugin screenshot. Keep the composition simple: library name, one-line value proposition, 4–6 distinctive icons, plugin panel.

**Suggested carousel:**

1. Plugin open beside a real canvas with search results visible.
2. An icon inserted as editable vector layers.
3. Maps mode: region filter and a country map inserted at its real proportions.
4. The same icons shown in a realistic interface at 20–24 px.
5. Website + Community file + plugin as the three ways to use the same library.

Do not show unreleased icons, unsupported weights or mock functionality.

## Update sequence (existing plugin)

1. Run `npm run build -w @african-icon-library/figma-plugin` (or `npm run package:plugins` for the
   submission folder). Confirm `apps/figma-plugin/manifest.json` still carries the id
   `1687997071772751842`; a different id would publish a new plugin instead of updating this one.
2. Import `apps/figma-plugin/manifest.json` as a development plugin in Figma Desktop.
3. Icons mode: test search, category filtering and insertion at 16, 24, 32 and 48 px with nothing
   selected, a frame selected and a locked layer selected.
4. Maps mode: test search (a name, an alias such as "Ivory Coast", an ISO code such as "NG"),
   region filtering, and insertion at 64, 128, 256 and 512 px; check the longest side matches the
   size, the aspect ratio is kept and the stroke is not clipped.
5. In Figma Desktop, publish a new version of the existing plugin with the v0.3.0 release notes and
   updated listing copy above.

The repository is the source of truth. If the Figma file is edited or new icons are added during final cleanup, those changes must be promoted back into the canonical SVG/metadata source and regenerated before publication; do not let the Community file become a separate fork of V2.
