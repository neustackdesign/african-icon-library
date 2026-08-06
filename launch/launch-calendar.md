# Launch calendar

Today is **Thursday 6 August 2026**. Every date below is relative to that.

The library launches in four stages, and the order is not negotiable. Each stage exists to make
the next one honest: we do not point press at a website that is not deployed, and we do not point
designers at a Figma plugin that is still in review. A stage that has not passed its gate does not
ship, and its copy stays in the drawer.

The machine-readable version is [`launch-calendar.csv`](launch-calendar.csv). The two must agree —
if you change one, change the other in the same commit.

**Owners are roles, not names.** `maintainer`, `design`, `engineering`, `community`, `comms`. Map
them to people before the first task runs; several are the same person on a project this size, and
that is fine as long as it is written down.

---

## The shape of it

| Phase | Name                           | Window                       | Public claim at the end of it                                                |
| ----- | ------------------------------ | ---------------------------- | ---------------------------------------------------------------------------- |
| 0     | Pre-flight                     | Thu 6 Aug – Fri 21 Aug 2026  | Nothing public. The gates are met or they are not.                           |
| 1     | Technical preview              | Tue 25 Aug – Fri 11 Sep 2026 | "The code is public and installable. The website and plugin are not live."   |
| 2     | Website + Figma Community file | Tue 15 Sep – Fri 9 Oct 2026  | "Browse and download at icons.neustackstudio.com. Duplicate the Figma file." |
| 3     | Figma plugin release           | Mon 28 Sep – Fri 23 Oct 2026 | "Search and place the icons inside Figma, offline."                          |
| 4     | Broader campaign (v0.2.0)      | Mon 19 Oct – Mon 7 Dec 2026  | The full story, to press, newsletters and communities, with the larger set.  |

Phase 3 overlaps phase 2 because Figma's review queue is outside our control. The submission goes
in while phase 2 is still running; the announcement waits for approval.

> **A note on "v2".** Phase 4 is the campaign for the **expanded library release, v0.2.0**. It is
> not the old "v2 drawings" the August 2026 audit reviewed — those 86 files are the thing this
> library replaced. Never use "v2" in public copy without that qualifier; it will be misread.

---

## Phase 0 — Pre-flight

**Thu 6 August – Fri 21 August 2026. Nothing is public in this phase.**

Everything here is either a command that must pass or an account that must exist. No copy is
published, no outreach is sent.

| Date       | Item                                                                                                   | Owner       | Depends on |
| ---------- | ------------------------------------------------------------------------------------------------------ | ----------- | ---------- |
| Thu 6 Aug  | `npm ci && npm run check` green from a clean clone                                                     | engineering | —          |
| Thu 6 Aug  | Confirm the released count and category count from repository state; substitute tokens                 | maintainer  | check      |
| Fri 7 Aug  | Create or confirm `icons@neustackstudio.com`, monitored by a human                                     | maintainer  | —          |
| Mon 10 Aug | Decide public vs private on `neustackdesign/african-icon-library` — the answer is public               | maintainer  | —          |
| Mon 10 Aug | Read every file in `launch/platform-copy/` against the repository; kill any stale claim                | comms       | check      |
| Tue 11 Aug | Run `npm run preview`; check `previews/proof-strip-24.svg` reads at 16 px                              | design      | check      |
| Thu 13 Aug | Build the launch images per [`media-kit/asset-manifest.md`](media-kit/asset-manifest.md)               | design      | preview    |
| Thu 13 Aug | Website analytics events implemented to [`tracking/analytics-events.md`](tracking/analytics-events.md) | engineering | —          |
| Fri 14 Aug | Cultural-review recruitment post drafted and reviewed by a Yoruba speaker before it goes out           | community   | —          |
| Mon 17 Aug | Outreach list de-duplicated; every URL opened and confirmed live                                       | community   | —          |
| Tue 18 Aug | Dry-run the Figma plugin locally: empty file, inside a frame, locked selection, no-result search       | design      | check      |
| Thu 20 Aug | UTM links built and checked per [`tracking/utm-conventions.md`](tracking/utm-conventions.md)           | comms       | —          |
| Fri 21 Aug | **Phase 0 gate review**                                                                                | maintainer  | all above  |

### Gate 0 → 1 (go/no-go)

All must be true. Any single failure moves phase 1 by a week; none of them are negotiable.

- [ ] `npm ci && npm run check` passes from a clean clone, on a machine that is not the author's.
- [ ] `npm run validate` exits zero. Zero errors, not "zero blocking errors".
- [ ] `npm run verify:generated` reports no drift.
- [ ] `icons@neustackstudio.com` receives a test message and a human replies to it.
- [ ] No file in `launch/` contains a hard-coded icon or category count.
- [ ] No file in `launch/` promises `thin`, `bold` or `fill` as available.
- [ ] No file in `launch/` states or implies that npm, the Figma Community, the plugin store or the
      website are live.
- [ ] `previews/proof-strip-24.svg` has been looked at by a human at 16 px, and every glyph reads.

---

## Phase 1 — Technical preview

**Tue 25 August – Fri 11 September 2026.**

The audience is developers and designers who will read a repository. There is no press in this
phase, no newsletters, and no reels. The point is to have the thing be real, installable and
criticised by a small number of people who know what they are looking at, before anyone writes
about it.

**What is true at the start of phase 1:** the repository is public and the packages are on npm.
**What is not:** the website is not deployed, the Community file is not published, the plugin is
not in the store. Every piece of phase 1 copy says so.

| Date       | Channel       | Asset                                                                                                                                | Owner       | Depends on  |
| ---------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ----------- | ----------- |
| Mon 24 Aug | GitHub        | Push `main`; enable branch protection requiring the `check` job                                                                      | engineering | gate 0      |
| Tue 25 Aug | GitHub        | Tag `v0.2.0`, publish release with `release/*` attached                                                                        | engineering | push        |
| Tue 25 Aug | GitHub        | [`github-release-notes.md`](platform-copy/github-release-notes.md)                                                                   | comms       | tag         |
| Tue 25 Aug | npm           | Publish `metadata`, then `icons`, then `react` — in that order                                                                       | engineering | tag         |
| Tue 25 Aug | Repository    | Update README's "nothing is published to npm" line — after, not before                                                               | maintainer  | npm publish |
| Wed 26 Aug | LinkedIn      | [`linkedin-launch-post.md`](platform-copy/linkedin-launch-post.md), preview variant                                                  | comms       | npm publish |
| Wed 26 Aug | X             | [`x-launch-thread.md`](platform-copy/x-launch-thread.md), preview variant                                                            | comms       | npm publish |
| Wed 26 Aug | Direct        | 10–15 messages from [`direct-outreach-messages.md`](outreach/direct-outreach-messages.md)                                            | community   | npm publish |
| Thu 27 Aug | Community     | [`cultural-review-recruitment.md`](platform-copy/cultural-review-recruitment.md) to Yoruba / Hausa / Igbo / Pidgin language projects | community   | npm publish |
| Thu 27 Aug | Community     | [`community-contribution-announcement.md`](platform-copy/community-contribution-announcement.md) posted as a pinned GitHub issue     | community   | push        |
| Mon 31 Aug | Iconify       | Submit the icon set for inclusion — requires a public repo and an automatable source                                                 | engineering | npm publish |
| Tue 1 Sep  | Neustack site | [`neustack-project-page.md`](platform-copy/neustack-project-page.md)                                                                 | comms       | npm publish |
| Thu 3 Sep  | Direct        | Second wave of direct outreach; design-system practitioners                                                                          | community   | first wave  |
| Mon 7 Sep  | Repository    | Triage every issue opened so far; label cultural reports first                                                                       | maintainer  | —           |
| Fri 11 Sep | Internal      | **Phase 1 review** — what broke, what was misread, what to change                                                                    | maintainer  | all above   |

### What phase 1 must not do

- No press pitches. There is no website to send anyone to.
- No Product Hunt, no Show HN. Those are one-shot and are wasted before the site exists.
- No paid promotion, ever, on any phase.
- No claim that the plugin is available. It is not, and "coming soon" on a plugin still in review
  is how a launch loses credibility in its first week.

### Gate 1 → 2 (go/no-go)

- [ ] The three packages install from npm into a clean project and render an icon.
- [ ] The repository has had at least one external reader look at `docs/icon-spec.md` and say
      whether it makes sense. If nobody has, phase 2 waits.
- [ ] No open issue reports a misnamed or misrepresented cultural referent. **This is a hard
      blocker.** A naming bug found in phase 1 is the cheapest one we will ever get; shipping past
      it into a website launch makes it permanent.
- [ ] Vercel build succeeds on the real domain, and `/sitemap.xml`, `/robots.txt`,
      `/opengraph-image` and one icon page all return 200.
- [ ] The status page numbers match `npm run validate --json` output.

---

## Phase 2 — Website and Figma Community file

**Tue 15 September – Fri 9 October 2026.**

The audience widens to working designers. This is the first phase with a link that a non-technical
person can use.

| Date       | Channel    | Asset                                                                                                                                     | Owner       | Depends on           |
| ---------- | ---------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ----------- | -------------------- |
| Mon 14 Sep | Vercel     | Deploy to `icons.neustackstudio.com`; DNS `CNAME` pointed                                                                                 | engineering | gate 1               |
| Tue 15 Sep | Website    | [`website-launch-copy.md`](platform-copy/website-launch-copy.md) live                                                                     | comms       | deploy               |
| Tue 15 Sep | Website    | Verify analytics: `search`, `icon_copy`, `icon_download`, `category_download`, `release_download`, `figma_click`, `github_click` all fire | engineering | deploy               |
| Wed 16 Sep | LinkedIn   | [`linkedin-launch-post.md`](platform-copy/linkedin-launch-post.md), website variant                                                       | comms       | deploy               |
| Wed 16 Sep | X          | [`x-short-posts.md`](platform-copy/x-short-posts.md) — the site-live post                                                                 | comms       | deploy               |
| Thu 17 Sep | Figma      | Build the Community file to `docs/figma-community-file-spec.md`; run its pre-publish checklist                                            | design      | deploy               |
| Tue 22 Sep | Figma      | Publish the Community file; [`figma-community-listing.md`](platform-copy/figma-community-listing.md)                                      | design      | file built           |
| Tue 22 Sep | Repository | Add the Community link to `README.md` and the website — after publication, not before                                                     | maintainer  | community file live  |
| Wed 23 Sep | Instagram  | [`instagram-carousel-scripts.md`](platform-copy/instagram-carousel-scripts.md) #1                                                         | comms       | community file live  |
| Thu 24 Sep | Community  | Post to African design communities per [`outreach-strategy.md`](outreach/outreach-strategy.md) segment B                                  | community   | community file live  |
| Mon 28 Sep | Newsletter | [`newsletter-announcement.md`](platform-copy/newsletter-announcement.md) to our own list                                                  | comms       | community file live  |
| Tue 29 Sep | Outreach   | [`newsletter-pitch.md`](outreach/newsletter-pitch.md) to design newsletters — priority 1 only                                             | community   | community file live  |
| Thu 1 Oct  | Instagram  | [`instagram-reel-scripts.md`](platform-copy/instagram-reel-scripts.md) #1 (the 24 px proof)                                               | comms       | assets built         |
| Mon 5 Oct  | Community  | [`designer-testimonial-request.md`](platform-copy/designer-testimonial-request.md) to anyone who has shipped with it                      | community   | 2 weeks of site live |
| Fri 9 Oct  | Internal   | **Phase 2 review**                                                                                                                        | maintainer  | all above            |

### Gate 2 → 3 (go/no-go)

- [ ] The site has been open in a real browser on a 320 px viewport, in dark mode, with keyboard
      only, and nothing is broken.
- [ ] Every analytics event in [`tracking/analytics-events.md`](tracking/analytics-events.md) has
      been observed firing at least once with correct properties.
- [ ] The Community file's component count equals the released icon count. If they differ, the file
      is stale and does not go out.
- [ ] No icon from `packages/icons/staging/` appears anywhere in the Community file.
- [ ] The Figma plugin has been tested against every document state in the `RELEASE_CHECKLIST.md`
      section 4.3 list, on a real Figma desktop build.

---

## Phase 3 — Figma plugin release

**Mon 28 September – Fri 23 October 2026.** Submission is early because review time is not ours.

| Date       | Channel   | Asset                                                                                                            | Owner       | Depends on |
| ---------- | --------- | ---------------------------------------------------------------------------------------------------------------- | ----------- | ---------- |
| Mon 28 Sep | Figma     | `npm run build -w @african-icon-library/figma-plugin`; import from manifest                                      | engineering | gate 2     |
| Tue 29 Sep | Figma     | Manual test pass — empty file, inside a frame, locked layer, text layer, no-result search, all four insert sizes | design      | build      |
| Thu 1 Oct  | Figma     | Cover + carousel per `docs/figma-plugin-publishing.md`; frames 3 and 5 are mandatory, not optional               | design      | test pass  |
| Mon 5 Oct  | Figma     | Submit for review with [`figma-plugin-listing.md`](platform-copy/figma-plugin-listing.md)                        | design      | assets     |
| —          | —         | _Review window. Nothing is announced. Do not pre-announce a review outcome._                                     | —           | —          |
| Tue 13 Oct | Figma     | On approval: replace `REPLACE_WITH_FIGMA_ASSIGNED_PLUGIN_ID` in the manifest and commit it                       | engineering | approval   |
| Tue 13 Oct | Website   | Update the plugin section, which currently says the plugin is not published                                      | engineering | approval   |
| Wed 14 Oct | LinkedIn  | [`linkedin-launch-post.md`](platform-copy/linkedin-launch-post.md), plugin variant                               | comms       | approval   |
| Wed 14 Oct | X         | [`x-short-posts.md`](platform-copy/x-short-posts.md) — the plugin post + the offline-claim post                  | comms       | approval   |
| Thu 15 Oct | Instagram | [`instagram-reel-scripts.md`](platform-copy/instagram-reel-scripts.md) #2 (plugin insertion)                     | comms       | approval   |
| Thu 15 Oct | Community | Plugin announcement to Figma community chapters                                                                  | community   | approval   |
| Fri 23 Oct | Internal  | **Phase 3 review**                                                                                               | maintainer  | all above  |

### If Figma rejects the submission

Do not announce, do not soften, do not appeal in public. Fix what was raised, resubmit, and move
every downstream date by the same number of days. Figma's review most often queries network
access; the manifest's `"allowedDomains": ["none"]` and the build-time assertion in
`apps/figma-plugin/build.ts` answer that in one reply.

### Gate 3 → 4 (go/no-go)

- [ ] The plugin is live in the Community and installs from a clean Figma account.
- [ ] The assigned plugin id is committed. The placeholder must not exist on `main`.
- [ ] The website, README and Community file all link to the plugin, and none of them still say it
      is unpublished.
- [ ] The expanded icon set for v0.2.0 has passed `npm run check`, and its new cultural referents
      are `approved` — not `pending`.

---

## Phase 4 — Broader campaign (v0.2.0)

**Mon 19 October – Mon 7 December 2026.** This is the phase with press in it, and it only works
because phases 1–3 made every link real.

It is deliberately scheduled around **Design Week Lagos, 18–25 October 2026** — not as a partner or
an exhibitor, which we are not, but because the Nigerian design conversation is loudest that week
and a post lands differently in it.

| Date           | Channel    | Asset                                                                                                                                      | Owner       | Depends on              |
| -------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------ | ----------- | ----------------------- |
| Mon 19 Oct     | Repository | Tag and release v0.2.0 with the expanded set                                                                                               | engineering | gate 3                  |
| Mon 19 Oct     | GitHub     | [`github-release-notes.md`](platform-copy/github-release-notes.md), v0.2.0 variant                                                         | comms       | tag                     |
| Tue 20 Oct     | Press      | [`press-release.md`](platform-copy/press-release.md) + [`media-factsheet.md`](platform-copy/media-factsheet.md) under embargo to segment C | comms       | release                 |
| Tue 20 Oct     | Media kit  | [`media-kit/`](media-kit/) published as a downloadable folder                                                                              | design      | assets                  |
| Wed 21 Oct     | LinkedIn   | [`linkedin-founder-essay.md`](platform-copy/linkedin-founder-essay.md)                                                                     | maintainer  | release                 |
| Thu 22 Oct     | X          | [`x-launch-thread.md`](platform-copy/x-launch-thread.md), full variant                                                                     | comms       | release                 |
| Thu 22 Oct     | Instagram  | [`instagram-carousel-scripts.md`](platform-copy/instagram-carousel-scripts.md) #2                                                          | comms       | release                 |
| Mon 26 Oct     | Outreach   | [`press-pitch.md`](outreach/press-pitch.md) to segment C, individually written                                                             | comms       | embargo lifts           |
| Mon 26 Oct     | Outreach   | [`community-admin-pitch.md`](outreach/community-admin-pitch.md) to segment B, wave 2                                                       | community   | release                 |
| Tue 27 Oct     | LinkedIn   | [`linkedin-carousel-script.md`](platform-copy/linkedin-carousel-script.md)                                                                 | comms       | release                 |
| Thu 29 Oct     | Newsletter | [`newsletter-pitch.md`](outreach/newsletter-pitch.md) to priority 2 newsletters                                                            | community   | priority 1 responses    |
| Mon 2 Nov      | Community  | Cultural-review recruitment, second push — the ask that actually matters                                                                   | community   | —                       |
| Thu 5 Nov      | Instagram  | Reel #3 (a danfo drawn from photo to glyph)                                                                                                | comms       | assets                  |
| Mon 9 Nov      | Outreach   | Follow-ups: one per contact, never two                                                                                                     | community   | 10 working days elapsed |
| Fri 13 Nov     | Community  | DevFest Lagos week — a developer-framed post, not a repeat of the design one                                                               | comms       | —                       |
| Mon 16 Nov     | Internal   | One-month metrics review per [`tracking/launch-metrics.md`](tracking/launch-metrics.md)                                                    | maintainer  | phase 4 start           |
| Mon 7 Dec      | Internal   | **Phase 4 close.** Decide what the next release is for, based on what people asked for.                                                    | maintainer  | all above               |
| Thu 4 Feb 2027 | Internal   | Three-month metrics review                                                                                                                 | maintainer  | —                       |

### What phase 4 is for

Not downloads. The honest goal of phase 4 is **three or four confirmed local-name reviewers and
two or three real product screenshots**. Everything else is noise that looks like progress. See
[`tracking/launch-metrics.md`](tracking/launch-metrics.md).

---

## Dependencies at a glance

```
npm run check green
    └── repo public ──── npm publish ──── Iconify submission
                    │              └── phase 1 social + direct outreach
                    └── Vercel deploy ──── website live ──── phase 2 social
                                                        │
                                                        └── Community file ──── design-community outreach
                                                                            │
plugin build ──── manual test pass ──── cover + carousel ──── Figma submission ──┴── Figma approval ──── plugin announcement
                                                                                                    │
expanded set passes check + cultural reviews approved ──────────────────────────────────────────────┴── v0.2.0 ──── press
```

Read it as: **press is five dependencies deep.** Anyone who suggests pitching a journalist in
August is asking to send them to a 404.

## Standing rules

- **One follow-up per contact, ever.** Ten working days after the first message. Then stop.
- **Never announce a thing on the day it goes live.** Give it a day to be broken quietly.
- **Never post a count that has not been substituted from repository state that morning.**
- **A cultural-naming issue outranks every date on this page.** If one is opened, the phase pauses
  until it is resolved or explicitly triaged with a public note.
- **No paid promotion in any phase.** If the thing is not interesting enough to pass along, more
  impressions will not fix it.
