# Analytics events — the contract

Seven events. This document is the contract between the website and this launch package: if the
site changes an event name or a property, it changes here in the same commit, and any report built
on the old name is wrong until it is updated.

**The events, in full:**

`search` · `icon_copy` · `icon_download` · `category_download` · `release_download` ·
`figma_click` · `github_click`

There are no others. Adding an eighth is a decision, not a convenience — see "Adding an event"
below.

---

## Principles

The site's own argument is that a Figma plugin should not be able to phone home, and that every
number should be derivable from the repository. Analytics on the website has to be consistent with
that or the position is hollow.

1. **No personal data, ever.** No user identifiers, no cookies used for cross-site tracking, no
   fingerprinting, no IP retention beyond what the host needs to serve a request.
2. **No free-text from a user is recorded verbatim except the search query**, and that is recorded
   because knowing what people search for and do not find is the single most useful signal this
   project can collect. It is a query string, not an identity — but it is treated as sensitive:
   trimmed, lower-cased, truncated, and never joined to anything else.
3. **Properties are bounded.** Every property is either an id from the library's own metadata, a
   short enum, or a small integer. No objects, no URLs, no referrers beyond the UTM parameters.
4. **The Figma plugin sends nothing.** It cannot: `"allowedDomains": ["none"]`, and the build fails
   if a networking call reaches either bundle. There is no plugin analytics section in this
   document because there is no plugin analytics.
5. **If analytics fails, nothing breaks.** Every call is fire-and-forget. A blocked script must
   never prevent a copy, a download or a search.
6. **Respect `Do Not Track` and any consent signal**, and do not restore an event by another route
   when it is refused.

---

## The events

### `search`

**Fires when** the user has stopped typing in the icon search field for 500 ms and the query is at
least two characters. **Debounced** — one event per settled query, never one per keystroke.

| Property        | Type   | Notes                                                                    |
| --------------- | ------ | -------------------------------------------------------------------------- |
| `query`         | string | Trimmed, lower-cased, truncated to 64 characters                          |
| `result_count`  | int    | Number of icons matching after the category filter                        |
| `category`      | string | Category id, or `all`                                                     |
| `has_results`   | bool   | `result_count > 0`. Redundant, and worth it — the zero case is the point. |

**Why it matters most.** A search with zero results is a request for an icon. The library ships
32 icons, so most searches will be zero-result, and that list is the most honest
roadmap input available. Report the top zero-result queries at every review.

**Never** record the query on a page that is not the icon browser, and never join it to a session
identifier.

---

### `icon_copy`

**Fires when** the user copies an icon's SVG to the clipboard.

| Property     | Type   | Notes                                                              |
| ------------ | ------ | -------------------------------------------------------------------- |
| `icon_id`    | string | The kebab-case id, e.g. `talking-drum`                              |
| `weight`     | string | Always `regular` today. Present so the data survives a second weight |
| `surface`    | enum   | `browser` \| `detail-page`                                          |
| `succeeded`  | bool   | `false` if the clipboard API refused                                |

**Fire it on failure too.** The site handles clipboard refusal honestly and tells the user; the
event should reflect that so a broken-clipboard problem is visible rather than showing up as an
absence.

---

### `icon_download`

**Fires when** the user downloads a single icon's SVG file, as opposed to copying it.

| Property  | Type   | Notes                          |
| --------- | ------ | -------------------------------- |
| `icon_id` | string | kebab-case id                   |
| `weight`  | string | `regular`                       |
| `surface` | enum   | `browser` \| `detail-page`      |

---

### `category_download`

**Fires when** the user downloads all icons in one category as a zip.

| Property      | Type   | Notes                                                    |
| ------------- | ------ | ---------------------------------------------------------- |
| `category`    | string | Category id, e.g. `food-drink`                            |
| `icon_count`  | int    | How many icons were in the download at that moment        |

`icon_count` is recorded per event rather than looked up later, because the set grows and a report
run in December must be able to say what a September download actually contained.

---

### `release_download`

**Fires when** the user downloads a release artefact from the downloads page — the full icon zip or
the metadata JSON.

| Property    | Type   | Notes                                                       |
| ----------- | ------ | ------------------------------------------------------------- |
| `artefact`  | enum   | `icons-zip` \| `metadata-json` \| `manifest`                 |
| `version`   | string | The release version, e.g. `0.2.0`                      |

**This is the closest thing the site has to an adoption signal**, and it is still weak — a download
is not a use. Treat it accordingly in [`launch-metrics.md`](launch-metrics.md).

---

### `figma_click`

**Fires when** the user clicks through to the Figma Community file or the plugin.

| Property      | Type   | Notes                                                                 |
| ------------- | ------ | ----------------------------------------------------------------------- |
| `destination` | enum   | `community-file` \| `plugin`                                           |
| `surface`     | enum   | `home` \| `downloads` \| `footer` \| `icon-detail`                     |

Before those are published there is no link, so no event. **Do not implement a placeholder that
fires against an unpublished destination.**

---

### `github_click`

**Fires when** the user clicks through to GitHub.

| Property      | Type   | Notes                                                                      |
| ------------- | ------ | ---------------------------------------------------------------------------- |
| `destination` | enum   | `repository` \| `issues` \| `licence` \| `contributing` \| `changelog`      |
| `surface`     | enum   | `home` \| `footer` \| `status` \| `spec` \| `icon-detail` \| `contributing` |

`destination: issues` is worth watching on its own. Someone clicking through to open an issue is
further down the path that actually matters than someone downloading a zip.

---

## Shared context on every event

Attached automatically, not passed per call.

| Property        | Type   | Notes                                                                       |
| --------------- | ------ | ----------------------------------------------------------------------------- |
| `path`          | string | Pathname only. **No query string** — it may contain a search term.           |
| `utm_source`    | string | If present in the landing URL                                                |
| `utm_medium`    | string | If present                                                                   |
| `utm_campaign`  | string | If present                                                                   |
| `theme`         | enum   | `light` \| `dark`                                                            |
| `viewport`      | enum   | `mobile` \| `tablet` \| `desktop`. Bucketed, never a pixel value.            |
| `library_version` | string | From `LIBRARY.version`, so an event can be tied to the set it happened against |

**Never attached:** user id, session id that persists across visits, referrer URL, IP address,
user-agent string, screen resolution, language, timezone, or anything else that contributes to a
fingerprint.

---

## Implementation notes

- The event names above are exact: lower-case, `snake_case`. `icon_copy`, not `iconCopy` or
  `Icon Copy`.
- Define them once, in one module, as constants. A string literal at a call site is how `icon_copy`
  becomes `icon_copied` in one place and the report silently loses a third of its data.
- Fire-and-forget. No `await`, no retry, no blocking the interaction.
- No event on a page view is defined here — page views come from the host's own request logs, which
  need no client-side script and no cookie.
- If the analytics endpoint is unreachable, the site behaves identically.

## Adding an event

Three questions, and all three must be answerable:

1. **What decision will this change?** If nothing, do not add it.
2. **Can it be answered by an existing event?** `search` with `has_results: false` already answers
   most "what is missing" questions.
3. **Does it record anything about a person?** If yes, it is not added.

Then: add it here first, with its properties, and implement it in the same commit.

## Reviewing

| Question                                         | Event                                               |
| ------------------------------------------------ | ----------------------------------------------------- |
| What do people want that we have not drawn?      | `search` where `has_results: false`, grouped by query |
| Which icons are actually used?                   | `icon_copy` + `icon_download`, grouped by `icon_id`   |
| Is anyone taking the whole set?                  | `release_download`                                    |
| Does the Figma route work?                       | `figma_click` by `surface`                            |
| Is anyone reading the source?                    | `github_click` by `destination`                       |
| Which outreach target sent anyone who did anything? | any event, grouped by `utm_source`                 |

The first row is the important one. Everything else is context for it.
