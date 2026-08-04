# Release checklist — v0.1.0

This is the honest ledger for the African Icon Library rebuild. It separates what is finished from
what is waiting, and it names what each waiting item is waiting _on_.

Nothing below is marked complete unless it is complete in this repository and verified by a
command anyone can re-run.

---

## 1. Completed automatically

Everything in this section is done, in the repository, and covered by `npm run check`.

### Repository and toolchain

- [x] npm-workspace monorepo with `apps/web`, `apps/figma-plugin`, `packages/icons`,
      `packages/metadata`, `packages/react`.
- [x] TypeScript strict across every workspace; ESLint 9 flat config; Prettier.
- [x] Vitest suite — 128 tests covering path geometry, SVG parsing, every validation rule,
      metadata invariants, search ranking and the Figma plugin's document handling.
- [x] GitHub Actions CI running lint → format → optimisation drift → validation → generated-output
      drift → type-check → tests → build, and uploading the release artefacts.
- [x] `npm install && npm run check` passes from a clean clone.

### Assets

- [x] All **18** v3 drawings from `icons-data.js` ingested as `regular`-weight candidates, with
      provenance back to the audit row each one descends from.
- [x] **16** released to `packages/icons/svg/regular/`.
- [x] **2** held in `packages/icons/staging/regular/`, each with a recorded blocker and reason.
- [x] Every released asset normalised to one canonical form: fixed root attribute set,
      `stroke="currentColor"`, `fill="none"`, 1.5 stroke, round caps and joins, no ids, no
      transforms, no text.
- [x] No raster asset anywhere in the public product. The v2 PNG backlog is not in this repository.
- [x] No synthesised weights. `thin`, `bold` and `fill` are absent, not faked.

### Metadata

- [x] Typed schema (`packages/metadata/src/schema.ts`) with runtime validation, covering icons,
      categories, regions, local names with review state, cultural review state, and provenance.
- [x] All **86** audit records converted to typed form with verdicts and notes preserved verbatim,
      in `packages/metadata/src/data/audit-records.json`.
- [x] The audit record file is excluded from the published package surface and never rendered in a
      public browser. Only released icons are exported.
- [x] A test proves no held drawing's id or component name appears in any generated surface.

### Validation

- [x] `viewBox` — exactly `0 0 24 24`.
- [x] Bounds — canvas containment including the stroke halo, plus the 2-unit live area, measured
      with analytic curve bounds (cubics solved for extrema, arcs converted to cubics).
- [x] Prohibited text — `text`, `tspan`, `textPath`, `foreignObject`, and stray text content.
- [x] Hard-coded colour — any paint that is not `currentColor` / `none` / `inherit`, plus hex,
      `rgb()`, `hsl()`, `oklch()` and `url()` literals anywhere.
- [x] Missing metadata — assets with no record, and records with no asset.
- [x] Duplicate ids — duplicate icon ids in metadata, duplicate assets claiming one id, and
      duplicate element ids inside a file (element ids are banned outright).
- [x] Unsupported SVG elements — an allow-list, with `script`, `image`, `use`, `filter`, `mask`,
      `pattern`, `clipPath`, `style` and the animation elements rejected by name.
- [x] Missing weight variants — declared-vs-on-disk in both directions, the baseline weight on
      every icon, and set-wide completeness so a half-shipped weight fails the build.

### Scripts

- [x] `ingest` — reproducible ingestion from the vendored audit source.
- [x] `validate` — human and `--json` output, non-zero exit on error.
- [x] `optimize` — in-place canonicalisation, `--check` mode for CI.
- [x] `preview` — contact sheet plus the 24 px proof strip.
- [x] `generate` / `verify:generated` — committed generated code with a drift gate.
- [x] `release:build` — deterministic zip, metadata JSON, and published SHA-256 checksums.

### Figma plugin

- [x] Manifest declares `"networkAccess": { "allowedDomains": ["none"] }` and no permissions.
- [x] The build fails if `fetch`, `XMLHttpRequest`, `WebSocket`, `EventSource`, `importScripts` or
      any absolute http(s) URL reaches either bundle.
- [x] All icon data compiled in at build time; the plugin has no runtime source of data.
- [x] Search and category filtering use the same ranking code as the website.
- [x] Weight selection offers only drawn weights; undrawn weights are shown struck through as
      unavailable rather than hidden.
- [x] Inserts editable vector frames, named from metadata, with `SCALE` constraints.
- [x] Empty and unexpected document states handled: no selection, multiple selection, removed
      node, locked node, locked ancestor, leaf node with no bounding box, a page that throws when
      its selection is read, a failed SVG import, and a page that refuses `appendChild` (the
      orphan is removed rather than left at the origin).
- [x] Keyboard-operable UI, live-region status, theme-aware colours, no web fonts.

### Website

- [x] Next.js App Router site for `icons.neustackstudio.com`.
- [x] Icon browser with search, category filter, preview-size control, copy-to-clipboard, and a
      real empty state that says how many icons exist.
- [x] Per-icon pages (statically generated) with real-size previews, search terms, weight status
      and provenance.
- [x] Downloads page driven by the release manifest, with sizes and SHA-256 checksums.
- [x] Licence, contributing, changelog and spec pages rendered from the canonical repository files,
      so the site cannot drift from the source.
- [x] Status page where every number is computed from the repository at build time.
- [x] SEO: per-page titles and descriptions, canonical URLs, Open Graph and Twitter cards, a
      generated OG image built from the real drawings, JSON-LD, `sitemap.xml` and `robots.txt`.
- [x] Responsive from 320 px up; light and dark themes; skip link; visible focus rings;
      `prefers-reduced-motion` respected; no colour-only signalling.
- [x] Every claim removed that the concept made and the product cannot support — the four-weight
      claim, local-name search, the illustration tier, the `@ail/icons` npm command, and the raster
      backlog in the browser.

### Documentation

- [x] `README.md`, `CONTRIBUTING.md`, `CHANGELOG.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`, `LICENSE`.
- [x] `docs/icon-spec.md`, `docs/metadata-schema.md`, `docs/cultural-review.md`,
      `docs/audit-provenance.md`, `docs/figma-community-file-spec.md`,
      `docs/figma-plugin-publishing.md`, `docs/website-deployment.md`.

---

## 2. Assets still requiring human icon design

No script can draw these. Each one is a specific, bounded piece of work.

| #   | Item                         | Why it is blocked                                                                                                                                                       | Where it lives                                  |
| --- | ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| 2.1 | `clay-pot` redraw            | Geometry reaches y = 22.193, outside the 2-unit live area. It needs a redraw that fits the safe padding — rescaling would make it read smaller than every neighbour.    | `packages/icons/staging/regular/clay-pot.svg`   |
| 2.2 | `thin` weight, whole set     | 16 drawings. Not derivable from `regular`: at 1.0 the counters open up and some internal detail must go.                                                                | —                                               |
| 2.3 | `bold` weight, whole set     | 16 drawings. At 2.0 the 1.5-unit counter minimum is violated by several current constructions; they need re-solving, not thickening.                                    | —                                               |
| 2.4 | `fill` weight, whole set     | 16 drawings. A different drawing problem entirely — silhouette plus knockout, not a stroke conversion.                                                                  | —                                               |
| 2.5 | Backlog redraws              | 61 audited concepts have no drawing that meets the spec. The audit's per-file notes say what each one needs.                                                            | `packages/metadata/src/data/audit-records.json` |
| 2.6 | Shared-construction families | The audit found five fabric rolls drawn five ways, three snack wrappers, four bridges and three rocks. These need one shared construction each before any of them ship. | audit notes                                     |
| 2.7 | Illustration tier            | Zero pieces exist. The tier needs its own 64-unit grid proof before any concept is drawn for it.                                                                        | —                                               |

**Do not** attempt 2.2–2.4 by changing `stroke-width`. The validator will accept the file — it
cannot tell a drawn weight from a thickened one — and the library will be worse for it.

---

## 3. Cultural reviews requiring human approval

These need a person with the relevant knowledge. They are not code review.

| #   | Item                                 | What is needed                                                                                                                                                                                               | Blocks                                              |
| --- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------- |
| 3.1 | `fila` referent                      | The audit flagged the drawing as "crown-on-brim could be several hats" and refused to name it. A Nigerian reviewer needs to identify the object, or confirm the drawing should be redrawn as a specific hat. | Release of a drawn, otherwise-valid icon            |
| 3.2 | Yoruba names for `talking-drum`      | `gangan` and `dùndún` came from the audit and are marked `pending`. A Yoruba speaker needs to confirm which applies to the drawn instrument, and whether both should ship.                                   | Local names appearing publicly                      |
| 3.3 | Local names, whole set               | Zero names are `confirmed` across 16 icons. The website therefore makes no local-name claim at all.                                                                                                          | The local-name search feature                       |
| 3.4 | Backlog renames flagged by the audit | `goje` (filed as "Banjo"), `twin-drums` (filed as "Bongo"), `ayo` vs `oware`, `abeti-aja` (filed as "Traditional Cap"), and the Olumo / Zuma / Aso rock cluster.                                             | Those concepts entering the backlog with real names |
| 3.5 | `Fela Kuti Outline` disposition      | A real-person likeness. The audit's options were to abstract it to raised arms or to clear rights with the estate. Someone has to choose.                                                                    | That concept existing at all                        |
| 3.6 | Region tagging beyond Nigeria        | `kente-cloth` is Ghanaian and sits in the backlog. Confirm the region-tagging convention before the first non-Nigerian icon ships.                                                                           | The second region                                   |
| 3.7 | National-symbol depiction            | `nigeria-flag` and `football-jersey` are released as neutral outlines with no colour and no crest. Confirm that is acceptable for the intended distribution.                                                 | Nothing today; a re-check before 1.0                |

Record every decision in `docs/cultural-review.md` and set the corresponding `culturalReview`
and `localNames[].review` fields. The schema refuses to release an icon whose required review is
still outstanding, so the data and the claim cannot diverge.

---

## 4. Manual publication actions requiring account access

Nothing in this section has been done. Each one needs credentials this repository does not and
should not hold.

### 4.1 GitHub

- [ ] Create `neustackdesign/african-icon-library` and push `main`.
- [ ] Decide public vs private. The repository contains no secrets and is written to be public.
- [ ] Enable branch protection on `main` requiring the `check` job.
- [ ] Tag `v0.1.0` and create the release, attaching `release/*` from the CI artefact.

### 4.2 npm

- [ ] Create or claim the `@african-icon-library` scope.
- [ ] `npm publish --access public` for `metadata`, then `icons`, then `react` — in that order,
      because each depends on the previous.
- [ ] Only after publishing, update the website copy that currently says the packages are not on
      npm. Do not update it first.

### 4.3 Figma

- [ ] Build the plugin: `npm run build -w @african-icon-library/figma-plugin`.
- [ ] Import `apps/figma-plugin/manifest.json` as a development plugin and test insertion on an
      empty file, inside a frame, and with a locked selection.
- [ ] Publish to the Community. Figma assigns the plugin id — replace
      `REPLACE_WITH_FIGMA_ASSIGNED_PLUGIN_ID` in the manifest and commit it.
- [ ] Supply the listing copy, cover image and carousel from
      [docs/figma-plugin-publishing.md](docs/figma-plugin-publishing.md). The cover and carousel
      frames are design work; the copy is written and ready.
- [ ] Build and publish the Community _file_ to
      [docs/figma-community-file-spec.md](docs/figma-community-file-spec.md).

### 4.4 Vercel

- [ ] Import the repository. Root directory: the repository root (not `apps/web`) — the build
      needs the workspace packages.
- [ ] Build command `npm run build`, output `apps/web/.next`, install `npm ci`. Already in
      `vercel.json`.
- [ ] Add `icons.neustackstudio.com` and point the DNS `CNAME` at Vercel.
- [ ] Verify after the first deploy: `/sitemap.xml`, `/robots.txt`, `/opengraph-image`, and one
      icon page.

### 4.5 Contact

- [ ] Create or confirm `icons@neustackstudio.com`. It is published on the website footer and in
      the plugin listing metadata, and it is the support contact Figma requires.

---

## Verification

```
npm ci
npm run check
```

Everything in section 1 is covered by that command. Nothing in sections 2, 3 or 4 is, and no
amount of green CI will change that.
