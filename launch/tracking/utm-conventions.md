# UTM conventions

The exact scheme, and the canonical links. Every outbound link in this launch package uses it.

**Why bother on a project this size.** Not to optimise a funnel — there is no funnel. It is to
answer one question honestly at the one-month review: which of the 68 outreach targets actually
sent anyone. Without that, the next campaign is guesswork dressed as a plan.

---

## The scheme

```
https://icons.neustackstudio.com/<path>?utm_source=<source>&utm_medium=<medium>&utm_campaign=<campaign>
```

Three parameters only. No `utm_term`, no `utm_content` unless a specific A/B question needs
answering — and there is no such question on this launch.

### `utm_source` — where the click came from

Lower-case, hyphenated, stable forever. It matches the entity, not the message.

Examples: `techpoint-africa`, `fof-lagos`, `sidebar`, `figmalion`, `iconify`, `osca`,
`yorubanames`, `hacker-news`, `linkedin`, `x`, `instagram`, `newsletter`.

**The source for an organisation is its slug in
[`../outreach/outreach-list.csv`](../outreach/outreach-list.csv).** If it is not in that file, it
does not get a source — add the row first.

### `utm_medium` — the kind of channel

A closed set. Do not invent new values without adding them here.

| Medium            | Use for                                                             |
| ----------------- | --------------------------------------------------------------------- |
| `community`       | Figma chapters, GDGs, hubs, open-source communities, Slack posts     |
| `newsletter`      | third-party newsletters, and our own send                             |
| `press`           | publications and journalists                                          |
| `directory`       | Iconify, Iconduck, SVG Repo and equivalents                           |
| `social`          | our own posts on LinkedIn, X, Instagram                               |
| `forum`           | Hacker News, Product Hunt, Designer News, DEV, Reddit                 |
| `event`           | design weeks and conferences                                          |
| `education`       | schools and programmes                                                |
| `language-project`| YorubaNames, Igbo API, Masakhane, Lanfrica                            |
| `email`           | direct one-to-one messages                                            |

### `utm_campaign` — which phase

| Campaign            | Phase                                        |
| ------------------- | ---------------------------------------------- |
| `ail-preview-2026`  | 1 — technical preview                         |
| `ail-site-2026`     | 2 — website and Figma Community file           |
| `ail-plugin-2026`   | 3 — Figma plugin release                       |
| `ail-v020-2026`     | 4 — broader campaign, v0.2.0                   |

`ail` is the project, the phase is the campaign, the year disambiguates. A link built in phase 2
keeps `ail-site-2026` forever, even if it is clicked in December — the campaign records where the
link was placed, not when it was clicked.

---

## Canonical links

Build every link from this table. Do not hand-assemble one from memory.

### Our own channels

| Placement                     | Link                                                                                                       |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------ |
| LinkedIn post, phase 1        | `https://github.com/neustackdesign/african-icon-library?utm_source=linkedin&utm_medium=social&utm_campaign=ail-preview-2026` |
| LinkedIn post, phase 2        | `https://icons.neustackstudio.com/?utm_source=linkedin&utm_medium=social&utm_campaign=ail-site-2026`        |
| LinkedIn post, phase 3        | `https://icons.neustackstudio.com/?utm_source=linkedin&utm_medium=social&utm_campaign=ail-plugin-2026`      |
| LinkedIn founder essay        | `https://icons.neustackstudio.com/?utm_source=linkedin-essay&utm_medium=social&utm_campaign=ail-v020-2026`  |
| X thread, phase 1             | `https://github.com/neustackdesign/african-icon-library?utm_source=x&utm_medium=social&utm_campaign=ail-preview-2026` |
| X thread, phase 4             | `https://icons.neustackstudio.com/?utm_source=x&utm_medium=social&utm_campaign=ail-v020-2026`               |
| Instagram bio, phase 2        | `https://icons.neustackstudio.com/?utm_source=instagram&utm_medium=social&utm_campaign=ail-site-2026`       |
| Instagram bio, phase 4        | `https://icons.neustackstudio.com/?utm_source=instagram&utm_medium=social&utm_campaign=ail-v020-2026`       |
| Our newsletter, send 1        | `https://icons.neustackstudio.com/?utm_source=own-newsletter&utm_medium=newsletter&utm_campaign=ail-site-2026` |
| Our newsletter, send 2        | `https://icons.neustackstudio.com/?utm_source=own-newsletter&utm_medium=newsletter&utm_campaign=ail-v020-2026` |
| Neustack project page         | `https://icons.neustackstudio.com/?utm_source=neustack-site&utm_medium=social&utm_campaign=ail-preview-2026` |

### Deep links worth tagging separately

The pages that carry the argument. Tagging them separately answers "did anyone read the honest
page" rather than "did anyone arrive".

| Page      | Link                                                                                                     |
| --------- | ---------------------------------------------------------------------------------------------------------- |
| Status    | `https://icons.neustackstudio.com/status?utm_source=<source>&utm_medium=<medium>&utm_campaign=<campaign>` |
| Spec      | `https://icons.neustackstudio.com/spec?utm_source=<source>&utm_medium=<medium>&utm_campaign=<campaign>`   |
| Downloads | `https://icons.neustackstudio.com/downloads?utm_source=<source>&utm_medium=<medium>&utm_campaign=<campaign>` |

Submit `/spec` and `/status` to Sidebar and the design-systems newsletters rather than the home
page. Those are the pages that are unusual, and tagging them tells you whether that instinct was
right.

### Outreach links

Pre-built, per row, in the `utm_link` column of
[`../outreach/outreach-list.csv`](../outreach/outreach-list.csv). Copy from there — do not rebuild
by hand, that is how a typo becomes a permanently unattributable source.

---

## Rules

- **Lower-case everything.** `Sidebar` and `sidebar` are two sources in every analytics tool ever
  built.
- **Hyphens, never underscores or spaces.**
- **One source per organisation, forever.** Techpoint Africa is `techpoint-africa` in phase 1 and
  in phase 4.
- **Never put a UTM on an internal link.** A tagged link from `/` to `/status` restarts the session
  in most tools and destroys the attribution you were trying to measure.
- **Never put a UTM in the repository, the README, the package metadata or the Figma listing.**
  Those links are read by people who did not come from a campaign, and by machines. They stay
  clean.
- **Never put a UTM on a link inside the SVG assets or the metadata.** There are no links in there
  and there never will be.
- **Do not use a link shortener.** It hides the destination, breaks in printed contexts, and adds a
  dependency that can disappear.
- **Do not tag a mailto link.**

---

## What UTMs cannot tell you

Worth writing down, because it is where launch reporting usually goes wrong.

- **They do not survive a copy-paste.** Someone who copies the link out of a newsletter and posts
  it in a Slack becomes `sidebar` traffic. That is fine; do not correct for it, and do not treat
  the number as precise.
- **They do not survive `npm install`.** Package installs, GitHub clones and Figma duplications
  carry no attribution at all — and those are the actions that actually matter. See
  [`launch-metrics.md`](launch-metrics.md).
- **They do not measure the thing this launch is for.** The goal is confirmed local-name reviewers,
  and a reviewer arrives by email, not by a tagged click. No UTM will ever show that.

Treat UTM data as one weak signal among several, and never as the score.

---

## Reviewing the data

At the one-month and three-month reviews, produce one table:

| Source | Medium | Sessions | `icon_copy` | `release_download` | `github_click` | Outcome |
| ------ | ------ | -------- | ----------- | ------------------ | -------------- | ------- |

`Outcome` is written by a person: what actually came of it. "Two issues opened." "One reviewer."
"Nothing." A source that sent 400 sessions and produced nothing is worth less than one that sent
six and produced a Yoruba speaker, and the table should make that visible rather than hide it
behind a sessions column.
