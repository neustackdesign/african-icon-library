# Launch metrics

What success looks like at one week, one month and three months — scoped honestly for a
32-icon library with no users, no budget, no distribution and no prior audience.

**Read this before setting any target.** The numbers below are deliberately small. A project that
sets ambitious launch targets and misses them concludes that the work was wrong, when the actual
finding was that the targets were invented. These are set at the level where hitting them means
something and missing them tells you something.

---

## The hierarchy

Three tiers. **They are not weighted equally and the difference matters more than any individual
number.**

### Tier 1 — outcomes that change the library

The only metrics that are genuinely worth optimising.

| Metric                                                  | Why it is tier 1                                                                                  |
| ------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| **Confirmed local-language names**                      | Currently zero. Each one unblocks a claim the library cannot otherwise make, and is a changelog event. |
| **Cultural-naming issues opened**                       | The highest-priority bug class. An open one is the launch working, not failing.                     |
| **Distinct zero-result search queries**                 | The most honest roadmap input available. It is the users writing the backlog.                        |
| **Icons drawn as a result of external input**            | The library got bigger because someone told us what was missing.                                     |
| **Screenshots of the icons in a real shipped product**   | The only real evidence of adoption. One is worth more than a thousand downloads.                     |

### Tier 2 — signals that someone engaged

Real, weaker, worth watching.

Release downloads · npm installs · Figma Community duplications · plugin installs · GitHub issues
and pull requests opened · directory listings that actually send traffic · newsletter inclusions ·
press pieces that get the audit story right.

### Tier 3 — numbers that will be quoted at us

Sessions, page views, stars, followers, likes, impressions. **Record them, never target them,
never celebrate them.** A thousand stars and zero confirmed names is a failed launch that looks
like a successful one, and that failure mode is the one this project is most exposed to, because
the story is more shareable than the tool.

---

## One week

**Review: Tuesday 27 October 2026** (one week after the phase 4 press send).

| Metric                                     | Target       | Notes                                                                         |
| ------------------------------------------ | ------------ | ------------------------------------------------------------------------------- |
| Confirmed local-language names             | **1**        | One. From an organisation contacted in phase 1, two months earlier.            |
| Cultural-naming issues opened              | 1+           | Zero here is more likely a reach problem than a correctness one                |
| Distinct zero-result search queries        | 25+          | Needs meaningful browser traffic; a low number means nobody arrived            |
| GitHub issues opened, any kind             | 3+           | Any engaged reader opens something                                             |
| Release downloads                          | 40+          | Includes CI, bots and curiosity. Weak signal, tracked for shape not size       |
| npm installs, all three packages           | 60+          | Mostly bots and mirrors in week one. Do not read anything into it              |
| Figma Community duplications               | 30+          | Live for five weeks by then                                                    |
| Plugin installs                            | 25+          | Live for two weeks by then                                                     |
| Newsletter inclusions                      | 2+           | Of nine submissions. Sidebar and TOOOLS are the likeliest                      |
| Press pieces published                     | 1+           | One correct piece beats three vague ones                                       |
| Product screenshots in the wild            | 0            | **Expected. Nobody ships in a week.**                                          |

**What a bad week one looks like, and what each means:**

- **Traffic, no issues, no searches with substance.** The story travelled and the tool did not. The
  copy is working and the product page is not.
- **Press coverage that says "icons for Africa" or "four weights".** Correct it in writing that
  day, and fix whatever in the pitch invited it.
- **Zero zero-result searches.** Either nobody used the browser, or the search is broken. Check the
  second before assuming the first.

---

## One month

**Review: Monday 16 November 2026.**

| Metric                                          | Target        | Notes                                                                   |
| ----------------------------------------------- | ------------- | ------------------------------------------------------------------------- |
| Confirmed local-language names                  | **4**         | Enough for the website to render local names for the first time          |
| Languages with at least one confirmed name      | 2             | Yoruba plus one of Hausa, Igbo or Pidgin                                 |
| The held cap identified                         | yes / no      | Binary. A yes unblocks a released icon and is a changelog event.          |
| Audit renames resolved                          | 2 of 5        | goje/garaya, bàtá/gbedu, ayo/oware, abetí ajá, the three rocks           |
| Cultural-naming issues opened                   | 3+            | Cumulative                                                               |
| External pull requests merged                   | 1+            | One is a genuine result for a month-old repository                       |
| Distinct zero-result search queries             | 120+          | The backlog written by users                                             |
| Icons added from external input                 | 1+            | Not just requested — drawn, validated, released                          |
| Release downloads                               | 250+          |                                                                          |
| npm weekly installs, `@african-icon-library/react` | 80+        | The most meaningful of the three; it implies someone rendered an icon    |
| Figma Community duplications                    | 150+          |                                                                          |
| Plugin installs                                 | 120+          |                                                                          |
| Directory listings live                         | 3+            | Iconify is the one that matters; several others index it                 |
| Press pieces                                    | 3+            | At least one in African tech press, at least one design publication      |
| Product screenshots in the wild                 | 1+            | The first one. Worth more than every other row on this table.            |

**The one-month question that actually matters:** has anything about the library changed because
someone outside the project told us something? If the answer is no, the launch reached people who
enjoyed the story and not people who needed the tool, and the phase 4 close should say so plainly.

---

## Three months

**Review: Thursday 4 February 2027.**

| Metric                                       | Target       | Notes                                                                   |
| -------------------------------------------- | ------------ | ------------------------------------------------------------------------- |
| Confirmed local-language names               | **12**       | Enough that local-name search can plausibly be switched on               |
| Languages with confirmed names               | 3            | Yoruba, Hausa, Igbo — or Pidgin in place of one                          |
| Local-name search shipped                    | yes / no     | Gated entirely on the row above. Not shipped early.                      |
| Cultural reviewers credited                  | 3+           | Named in `docs/cultural-review.md`, with dates                           |
| Held drawings released after review          | 1+           | The cap, ideally                                                         |
| Icons released from the backlog              | 8+           | Prioritised by zero-result searches, not by our taste                    |
| Repeat external contributors                 | 1+           | Someone who came back. The single hardest metric here.                   |
| npm weekly installs, `react`                 | 250+         | Sustained, not a launch spike                                            |
| Figma Community duplications                 | 500+         | Cumulative                                                               |
| Plugin installs                              | 400+         | Cumulative                                                               |
| Weekly active plugin users                   | unknown      | **We cannot measure this and never will.** The plugin sends nothing.     |
| Product screenshots in the wild              | 3+           | Three real interfaces                                                    |
| Non-Nigerian region scoped                   | yes / no     | Region-tagging convention settled and a first concept list drafted       |
| Second weight started                        | yes / no     | Started means drawing has begun, not scheduled                           |

**The three-month question:** would someone adopting this library today be worse off in a year than
someone adopting Phosphor? If any answer involves "we said we would draw X and did not", the
roadmap was over-promised — and the fix is in the copy, not the drawing schedule.

---

## What we deliberately do not measure

- **Stars and followers.** Recorded because GitHub shows them; never a target, never in a report
  headline.
- **Time on page and bounce rate.** A visitor who copies an SVG in eleven seconds and leaves had a
  perfect visit.
- **Conversion rate.** There is nothing to convert to. The library is free and there is no account.
- **Plugin usage after install.** The plugin cannot report anything, by design and by build. That
  is a feature, and we accept the blind spot rather than compromising the claim.
- **Sentiment.** If someone says something specific, act on it. Do not average opinions into a
  number.
- **Anything about individual users.** See [`analytics-events.md`](analytics-events.md).

## Honest caveats on every number above

- **npm and download counts include bots, mirrors and CI.** Treat the shape over time as the
  signal, never the absolute figure.
- **UTM attribution does not survive a copy-paste**, and does not exist at all for `npm install`,
  `git clone` or a Figma duplication.
- **A download is not a use.** A duplication is not a use. An install is not a use. Only a
  screenshot in a shipped product is.
- **Every target above is a guess**, made in August 2026 with no baseline. At the one-month review,
  revise them against reality and record what they were, so the revision is visible rather than
  quiet.

## The single-sentence definition

> **This launch succeeded if, by February 2027, the library says things it could not say in August
> because people who know told us — and if at least three real products have one of these icons in
> them.**

Everything else on this page is instrumentation for that sentence.
