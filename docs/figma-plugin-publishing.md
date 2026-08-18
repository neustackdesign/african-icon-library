# Figma plugin — publishing pack

Ready-to-use listing copy and the final pre-publication checks for the African Icon Library plugin.

## Listing copy

**Plugin name**  
`African Icon Library`

**Tagline**  
`Search and place open-source icons for African everyday life — directly in Figma.`

**Description**

> Search the African Icon Library and place editable vectors directly onto your canvas.
>
> V2 starts with 30 icons across seven categories, including everyday objects, food, transport,
> culture, identity, fashion, commerce and play. Every released icon follows the same 24-pixel
> drawing system and comes from the same canonical source as the website and downloadable SVG set.
>
> **What you can do**
>
> - Search icon names and keywords
> - Filter by category
> - Insert editable vectors at 16, 24, 32 or 48 px
> - Restyle the inserted vector like any other Figma layer
>
> The plugin is intentionally offline: it requests no network access, collects no personal data,
> uses no analytics and requires no account.
>
> MIT licensed. Free for personal and commercial use.
>
> Website: icons.neustackstudio.com  
> Source: github.com/neustackdesign/african-icon-library

**Tags**  
`icons`, `icon library`, `african`, `nigeria`, `culture`, `open source`, `svg`, `vector`,
`design system`, `ui`, `offline`, `insert`

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
3. Category filtering across several distinctive V2 icons.
4. The same icons shown in a realistic interface at 20–24 px.
5. Website + Community file + plugin as the three ways to use the same library.

Do not show unreleased icons, unsupported weights or mock functionality.

## Publish sequence

1. Run `npm run build -w @african-icon-library/figma-plugin`.
2. Import `apps/figma-plugin/manifest.json` as a development plugin in Figma Desktop.
3. Test search, category filtering and insertion at 16, 24, 32 and 48 px with nothing selected, a frame selected and a locked layer selected.
4. Publish from Figma Desktop.
5. Replace the placeholder `id` in `apps/figma-plugin/manifest.json` with the Figma-assigned plugin id and commit it.
6. Add the published Community URL to the website and README.

The repository is the source of truth. If the Figma file is edited or new icons are added during final cleanup, those changes must be promoted back into the canonical SVG/metadata source and regenerated before publication; do not let the Community file become a separate fork of V2.
