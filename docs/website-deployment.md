# Website — deployment and SEO

The site in `apps/web` is built for `icons.neustackstudio.com`. It has not been deployed;
deployment is item 4.4 in [RELEASE_CHECKLIST.md](../RELEASE_CHECKLIST.md).

## Build

The site depends on the workspace packages, so it must be built from the repository root:

```
npm ci
npm run build
```

That builds `metadata` → `icons` → `react` → the Figma plugin → the release artefacts → the site,
in that order. The release step matters: the downloads page reads
`apps/web/public/downloads/manifest.json`, and without it the page renders an honest "not built for
this deployment" state rather than links to files that do not exist.

## Vercel

`vercel.json` at the repository root already sets:

- `buildCommand`: `npm run build`
- `installCommand`: `npm ci`
- `outputDirectory`: `apps/web/.next`
- `framework`: `nextjs`
- security headers: `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`,
  `Permissions-Policy`

Set the project's **root directory to the repository root**, not `apps/web`. Pointing it at the
app directory breaks the workspace resolution.

Then add `icons.neustackstudio.com` as a domain and point the DNS `CNAME` at Vercel.

## What is static

Everything. There are no server-rendered pages, no route handlers and no runtime data source:

- `/` and the document pages are static
- `/icons/[id]` is generated for every released icon via `generateStaticParams`
- `/sitemap.xml`, `/robots.txt`, `/opengraph-image` and `/twitter-image` are generated at build

A new icon reaches the site by being committed and rebuilt, which is the same gate everything else
passes through.

## SEO

- **Titles and descriptions** — per page, with a template on the root layout. Icon pages describe
  the specific glyph rather than repeating the site description.
- **Canonical URLs** — set on every page via `alternates.canonical`.
- **Open Graph and Twitter** — `summary_large_image`, with a 1200 × 630 card generated at build
  time from the real drawings rather than a static mock-up.
- **JSON-LD** — `SoftwareSourceCode` on the root, `CreativeWork` on each icon page, both including
  the MIT licence URL.
- **Sitemap** — every static route plus every icon page.
- **Robots** — allow all, with the sitemap declared.

## Accessibility

- Skip link to `#main`.
- Visible focus rings on every interactive element (`:focus-visible`, 2 px, offset).
- Colour is never the only signal: unavailable weights carry a strike-through and a text label as
  well as a muted colour.
- Every icon rendered as content carries `role="img"` and an `aria-label`; decorative marks are
  `aria-hidden`.
- Result counts and copy confirmations are in `aria-live` regions.
- Light and dark themes are both authored, driven by `prefers-color-scheme`; `color-scheme` is
  declared so form controls follow.
- Transitions are wrapped in `prefers-reduced-motion: no-preference`.
- Layout is fluid from 320 px; tables scroll inside their own container so the page body never
  scrolls horizontally.

## Copy discipline

Every number the site states — icon count, weight count, category count, audit totals — is read
from the metadata package at build time. None is typed into copy. If a claim cannot be computed
from the repository, it does not appear on the site.

This is why the following are absent, all of which the original concept asserted:

- four weights (one is drawn)
- local-name search (no local name is confirmed)
- an illustration tier (zero pieces exist)
- `npm i @ail/icons` (nothing is published to npm)
- the raster backlog in the icon browser (no raster asset is in the product at all)

## Analytics

The site works identically with no analytics provider attached. `apps/web/lib/analytics.ts` is a
total function over an optional `window.ail` global: if nothing defines it, every call is a no-op.

To attach a provider, load a script that defines `window.ail.track(name, properties)`. Plausible
and Fathom both fit that shape in about two lines. Nothing is bundled here, because a library that
ships a tracker by default is not privacy-respecting.

Events, and exactly what each carries:

| Event               | Fires when                                        | Properties                        |
| ------------------- | ------------------------------------------------- | --------------------------------- |
| `search`            | A browser query of two or more characters settles | `results`, `surface`              |
| `icon_copy`         | An icon's SVG is copied                           | `target` (icon id), `surface`     |
| `icon_download`     | A single icon is downloaded                       | `target` (icon id), `surface`     |
| `category_download` | A category pack is downloaded                     | `target` (category id), `surface` |
| `release_download`  | The full bundle or metadata is downloaded         | `target` (artefact), `surface`    |
| `figma_click`       | An outbound link to Figma is followed             | `target`, `surface`               |
| `github_click`      | An outbound link to GitHub is followed            | `target`, `surface`               |

**The search query is never sent.** The result count answers "is search working" and "what are
people failing to find" — a zero-result count is the useful signal — without recording what anyone
typed.

UTM parameters (`utm_source`, `utm_medium`, `utm_campaign`, `utm_content`) are read from the URL
per page load, truncated to 64 characters, and attached to events. They are not persisted: no
cookie, no storage. That makes attribution per-visit and deliberately not a durable identity.

## Favicons

`app/icon.tsx` and `app/apple-icon.tsx` render the talking-drum asset the library actually ships,
at build time. They cannot drift from the set, because they read the same file the packages export.
