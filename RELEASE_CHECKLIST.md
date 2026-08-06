# Release checklist — v0.2.0

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
- [x] Vitest suite covering path geometry, SVG parsing, every validation rule,
      metadata invariants, search ranking and the Figma plugin's document handling.
- [x] GitHub Actions CI running lint → format → optimisation drift → validation → generated-output
      drift → type-check → tests → build, and uploading the release artefacts.
- [x] `npm install && npm run check` passes from a clean clone.

### Assets

- [x] All **18** v3 drawings from `icons-data.js` ingested as `regular`-weight candidates, with
      provenance back to the audit row each one descends from.
- [x] **32** icons released to `packages/icons/svg/regular/`, across 7 of the 9 categories.
- [x] **1** held in `packages/icons/staging/regular/`, with a recorded blocker and reason.
- [x] **1** v3 original superseded by a hand redraw (`clay-pot`), kept in
      `packages/icons/superseded/` for the record. The ingest no longer overwrites it.
- [x] **7** candidates drawn and then rejected rather than shipped weak — see section 2A.
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
| 2.2 | `thin` weight, whole set     | 32 drawings. Not derivable from `regular`: at 1.0 the counters open up and some internal detail must go.                                                                | —                                               |
| 2.3 | `bold` weight, whole set     | 32 drawings. At 2.0 the 1.5-unit counter minimum is violated by several current constructions; they need re-solving, not thickening.                                    | —                                               |
| 2.4 | `fill` weight, whole set     | 32 drawings. A different drawing problem entirely — silhouette plus knockout, not a stroke conversion.                                                                  | —                                               |
| 2.5 | Backlog redraws              | 55 audited concepts still have no drawing that meets the spec. The audit's per-file notes say what each one needs.                                                      | `packages/metadata/src/data/audit-records.json` |
| 2.6 | Shared-construction families | The audit found five fabric rolls drawn five ways, three snack wrappers, four bridges and three rocks. These need one shared construction each before any of them ship. | audit notes                                     |
| 2.7 | Illustration tier            | Zero pieces exist. The tier needs its own 64-unit grid proof before any concept is drawn for it.                                                                        | —                                               |

**Do not** attempt 2.2–2.4 by changing `stroke-width`. The validator will accept the file — it
cannot tell a drawn weight from a thickened one — and the library will be worse for it.

---

## 2A. Candidates drawn and rejected

Seven concepts were drawn to the grid, passed every automated rule, and were then cut because they
did not read as the thing they claimed to be. Geometry compliance is necessary and not sufficient;
a script cannot judge recognition, so a person looked at every one at 16 px and said no.

Each is a real, bounded piece of work for an icon designer. None is blocked on anything else.

| Candidate     | What it read as instead                                                                                                               | What a redraw needs                                                                                                       |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `plantain`    | A leaf, then a horseshoe, across three attempts. The crescent either tapered to points (leaf) or lost its taper entirely (horseshoe). | Blunt, asymmetric ends and a visible stem nub. The audit called it a hero concept; it deserves a designer.                |
| `gele`        | An umbrella, then a hot-air balloon. A symmetrical dome over a band is an umbrella, and that is what a simplified headtie becomes.    | The asymmetric pleat that identifies a gele, kept legible at 24 px — probably with a head silhouette beneath for context. |
| `agbada`      | A bell, then a mountain. The wide robe silhouette without visible sleeve drape is a skirt.                                            | Sleeve wings drawn as distinct masses rather than absorbed into the hem curve.                                            |
| `generator`   | A boombox. A box with a round face and side vents is a radio.                                                                         | The recoil starter, exhaust and fuel cap arranged so the machine reads as an engine, not a speaker.                       |
| `keke`        | A dome with a wheel — closer to a lamp than a tricycle.                                                                               | A silhouette that resolves the three-wheel geometry; the front view hides what makes a keke a keke.                       |
| `ayo`         | A pill with dots; mush at 16 px.                                                                                                      | Fewer, larger pits, or a construction that carries the two end stores without eight small circles.                        |
| `pounded-yam` | A generic bowl with a mound, too close to the existing bowl family.                                                                   | A distinguishing cue — the swallow's texture, or the paired soup bowl — that survives at 24 px.                           |

The rejected drawings are not in the repository. Shipping them as staged assets would imply they
are nearly ready; they are not, and the geometry is not the useful part of the work.

---

## 3. Cultural reviews requiring human approval

These need a person with the relevant knowledge. They are not code review.

| #   | Item                                 | What is needed                                                                                                                                                                                               | Blocks                                              |
| --- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------- |
| 3.1 | `fila` referent                      | The audit flagged the drawing as "crown-on-brim could be several hats" and refused to name it. A Nigerian reviewer needs to identify the object, or confirm the drawing should be redrawn as a specific hat. | Release of a drawn, otherwise-valid icon            |
| 3.2 | Yoruba names for `talking-drum`      | `gangan` and `dùndún` came from the audit and are marked `pending`. A Yoruba speaker needs to confirm which applies to the drawn instrument, and whether both should ship.                                   | Local names appearing publicly                      |
| 3.3 | Local names, whole set               | Zero names are `confirmed` across 32 icons. The website therefore makes no local-name claim at all.                                                                                                          | The local-name search feature                       |
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

- [x] `neustackdesign/african-icon-library` exists and `main` carries the full standalone history.
- [x] GitHub Actions runs on every push: lint, formatting, asset-optimisation drift, icon
      validation, the QA report, generated-output drift, type-check, tests, the full build, and a
      clean-room install of the packed packages. Green on `main`.
- [x] CodeQL, dependency review and Dependabot are configured.
- [ ] **Enable branch protection on `main`** requiring the `Lint, validate, test, build` check.
      Not possible from this environment: the GitHub App backing it has no administration scope.
- [ ] **Create the repository labels** the issue forms reference. GitHub silently drops labels that
      do not exist, so the forms are inert until they are created. The list is in
      `docs/governance/maintainer-guide.md`.
- [ ] **Enable Discussions**, or delete that entry from `.github/ISSUE_TEMPLATE/config.yml` — it is
      a 404 in the issue chooser otherwise.
- [ ] **Enable the dependency graph**, or `dependency-review.yml` is a no-op.
- [ ] **Set the repository description, homepage and topics.** Suggested:
      description `Open-source icons for African life, drawn on one 24-pixel grid. Nigeria first.`,
      homepage `https://icons.neustackstudio.com`, topics `icons`, `icon-set`, `svg`, `react`,
      `figma-plugin`, `design-system`, `african`, `nigeria`, `open-source`.
- [ ] **Tag `v0.2.0` and create the release**, attaching `release/*` from the CI artefact. The
      artefacts are built deterministically, so the checksums in `release/manifest.json` are the
      ones to publish.

### 4.2 npm

- [ ] Create or claim the `@african-icon-library` scope.
- [ ] `npm publish --access public` for `metadata`, then `icons`, then `react` — in that order,
      because each depends on the previous.
- [ ] Only after publishing, update the website copy that currently says the packages are not on
      npm. Do not update it first.

### 4.3 Figma

Both plugins build, pass their offline assertions, and are packaged for submission by
`npm run package:plugins` into `release/figma/`. Each zip contains exactly the files its manifest
references and nothing else.

- [x] The insert plugin builds and is packaged.
- [x] The Community **file builder** is written, tested against a fake Figma runtime, and packaged.
      It creates every page, one component per released icon, the cover and the carousel frames in
      one action. It is data-driven, so it cannot invent a variant for an undrawn weight.
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

No Vercel CLI and no Vercel token exist in the build environment, so no deployment could be made
from here. Everything that does not need account access is done: `vercel.json` is complete, the
production build is verified on every CI run, and every route is static so a deploy cannot fail on
a missing environment variable.

The full step-by-step, the smoke test to run against the preview, and the exact DNS record are in
[docs/vercel-deployment.md](docs/vercel-deployment.md).

- [ ] Import the repository, root directory = repository root (**not** `apps/web`).
- [ ] Deploy a preview and run the smoke test in the deployment doc.
- [ ] Promote to production.
- [ ] Add `icons.neustackstudio.com`, then add the DNS record:
      `CNAME  icons  cname.vercel-dns.com`
- [ ] Verify HTTPS, the canonical redirect, and re-run the smoke test against production.
- [ ] Only then update any copy that says the site is not yet live.

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
