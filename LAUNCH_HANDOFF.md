# Launch handoff

Short and sequential. Everything below is either done, or is a specific action for a named person
in a specific order. `RELEASE_CHECKLIST.md` holds the long-form detail; this is the operating
document.

**Release: 0.2.0 · 30 icons · 7 categories in use · `regular` weight only.**

---

## What is live

| Surface               | State                                                               |
| --------------------- | ------------------------------------------------------------------- |
| GitHub repository     | Public, CI green — `github.com/neustackdesign/african-icon-library` |
| Website               | Deployed on Vercel at `african-icon-library-48bw2grxi.vercel.app`   |
| Neustack project page | Merged to `neustackstudio-site` `main` as `738ff518`                |
| Everything else       | Built and verified, not published                                   |

---

## What was tested by hand, and how

- **The icon set, by eye.** Every drawing rasterised at its real pixel size and magnified with no
  interpolation, at 16/20/24/32/48 px, on paper and ink. Verdicts per icon in
  `reviews/visual-qa/findings.md`. **Two drawings were withdrawn as a result** — `ludo` and
  `chin-chin-pack` — which is why this is 30 and not 32.
- **The production site**, against a local production build of the deployed commit: all 12 routes,
  every download link, four viewport widths (320/375/768/1280) in both colour schemes, keyboard
  traversal, and the analytics contract with no provider attached. Results below.
- **The packages**, packed and installed into a throwaway consumer (`npm run verify:packages`).
- **The release pipeline**, end to end via a workflow dry run — install, full check, package
  verification, pack, artefact upload. Only the `npm publish` call itself is unproven.
- **The Figma artefacts**, by unpacking both zips and asserting manifest validity, referenced-file
  presence and the offline guarantee against the actual bundle contents.

### Site QA result

```
routes                 12/12 expected status (withdrawn icons correctly 404)
download links          9/9 return 200
responsive              no horizontal overflow, 4 widths x 2 schemes x 5 routes
console                 no errors
keyboard                58 focusable elements, visible focus on 12/12 tab stops
accessible names        0 interactive elements unnamed, 0 images without alt
analytics               no provider attached, no throw
html lang               "en", one h1 per page
```

**One material bug was found this way and fixed**: `apps/web/lib/site.ts` hard-coded
`version: '0.1.0'` while the release was 0.2.0, and the download filenames are interpolated from it.
The downloads page linked to two archives that do not exist. The version is now derived from the
pipeline data. Commit `a0e1298`.

---

## What is waiting on you

Do these in order. Nothing later depends on anything being invented — only on access.

### 1. Point the domain at the deployment

The site is live on its Vercel URL but not on the intended hostname.

1. In Vercel → the `african-icon-library` project → Domains, add `icons.neustackstudio.com`.
2. At whoever hosts DNS for `neustackstudio.com`, add:
   ```
   CNAME   icons   cname.vercel-dns.com
   ```
3. Wait for the certificate, then load `https://icons.neustackstudio.com` and check the header badge
   reads **v0.2.0 · 30 icons**.

**Why not automated:** this environment's egress policy denies `vercel.com` and `api.vercel.com`
at the gateway, and the target hostnames are unreachable from here too, so neither the API call nor
the verification can be performed from the environment.

### 2. Paste the live URL back into the repository

Once step 1 resolves, three places stop being conditional. Search for `icons.neustackstudio.com`
and remove the hedging language:

- `README.md` — the top-of-file link
- `apps/web/lib/site.ts` — already correct, no change needed
- `neustackstudio-site` → `app/work/african-icon-library/page.tsx` — the address currently renders
  as **plain text, not a link**, because it did not resolve. Restore the anchor and add the `/icons`
  vanity redirect that was deliberately left out.

### 3. Fix the site repository's default branch

`neustackstudio-site`'s default branch is still `claude/affectionate-mccarthy-46UUc` — a stale
branch with committed merge-conflict markers that does not build. `main` is the real trunk and
carries the integration.

Set the default branch to `main` in GitHub settings, and confirm Vercel's Production Branch is
`main`. **Until this is checked, the merged integration may only have produced a preview
deployment.**

### 4. Repository presentation and the release

All blocked by the agent proxy, which refuses these API paths regardless of credential — a token
would not help. A human on github.com:

- description, homepage `https://icons.neustackstudio.com`, topics
- enable the dependency graph (this is the sole cause of the one red workflow, on Dependabot's PR #1)
- branch protection on `main` requiring `Lint, validate, test, build`
- tag `v0.2.0` and create the release, attaching `release/*`

Labels are **already done** — all nine exist.

### 5. npm

`registry.npmjs.org` is reachable from CI and the scope `@african-icon-library` is confirmed
unclaimed. An organisation cannot be created by a token, so the order matters:

1. Create the free `african-icon-library` org on npmjs.com.
2. Generate a granular publish token, add it as the **`NPM_TOKEN` repository secret**. It never
   needs to pass through anyone's hands or any chat.
3. Push the tag: `git tag v0.2.0 && git push origin v0.2.0`.

`.github/workflows/release.yml` does the rest — full check, package verification, tag/version
agreement, then publishes metadata → icons → react in dependency order with provenance. **The dry
run passes today**; only the publish call is unproven.

After the first publish, delete the secret: the workflow prefers OIDC trusted publishing whenever
`NPM_TOKEN` is absent, and npm can only attach a trusted publisher to a package that already exists.

### 6. Figma — the deferred channel

Both zips are built, valid and offline-verified: `release/figma/figma-plugin-0.2.0.zip` and
`release/figma/figma-community-builder-0.2.0.zip`. Listing art is in `launch-assets/figma/`.

**Not tested in the real Figma runtime.** This environment has no Figma Desktop, no GUI and no Figma
account, so insertion, search, filtering, selection states, resizing, theming and the generated
Community file have been verified only against a fake-Figma test harness and by static analysis of
the bundles. Treat the joint session as the first real runtime test, not a formality.

---

## Which files are final

| Final                                                             | Not final                                         |
| ----------------------------------------------------------------- | ------------------------------------------------- |
| `reviews/visual-qa/` — boards, metrics, verdicts                  | Redrawn versions of the 4 rework icons            |
| `launch-assets/` — 38 masters, 38 PNGs, 1 PDF, alt text, manifest | Video captures (no GUI here)                      |
| `launch/FINAL_COPY.md` — the approved copy set                    | Local-language names (unconfirmed)                |
| `release/` — 9 artefacts with checksums                           | Figma listing screenshots (need the real runtime) |
| `.github/workflows/release.yml` — dry-run verified                |                                                   |

## Which copy is final

`launch/FINAL_COPY.md`. It supersedes the longer drafts under `launch/platform-copy/` and
`launch/outreach/`; where they disagree, the final file wins. Every number in it is generated from
repository state, so **regenerate rather than hand-edit** if the set changes: `npm run launch:tokens`.

## What triggers a public announcement

Nothing in this repository posts anything. Announcements are manual, and the order is deliberate:

1. Domain live (step 1) → nothing announced yet, just verified.
2. Tag + GitHub release (step 4) → **technical preview** post. Use
   `launch-assets/linkedin/technical-preview.png`.
3. npm published (step 5) → developer channels.
4. Figma approved → **product launch**: the carousel, the X thread, the Instagram set.

Do not run step 2's announcement before the domain resolves — the post links to it.

## Rollback

- **Website:** Vercel → Deployments → promote the previous deployment. Instant, no rebuild.
- **A bad icon:** move its SVG to `packages/icons/staging/regular/`, drop its record from
  `packages/metadata/src/data/icons.json`, set its audit row to `held` with a `hold` reason, then
  `npm run generate && npm run check`. Every derived surface follows. This is exactly what was done
  for `ludo` and `chin-chin-pack`; the commit is a worked example.
- **npm:** `npm deprecate @african-icon-library/<pkg>@0.2.0 "<reason>"`. Do not unpublish — it
  breaks anyone who installed it. Ship a patch instead.
- **Neustack integration:** revert `738ff518` on `main`; it is additive and touches nothing else.

## First-week monitoring

Daily:

- GitHub issues, especially anything labelled `cultural-correction` — those outrank feature work.
- CI on `main` stays green.
- Vercel deployment status and 404 rate on `/icons/*`.

Once, at the end of the week:

- Which icons were downloaded most (the per-category packs make this visible).
- Whether any local name was contested — one contested name is worth more than a hundred stars.
- Whether the four `REWORK BEFORE PUBLIC LAUNCH` icons drew comment.
