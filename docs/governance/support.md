# Where to ask what

A short map. If you are unsure, an issue is always an acceptable guess and nobody will mind.

## By what you want to say

| You want to…                                                 | Go to                                                                                                                                                              |
| ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Tell us an icon is named wrong, or depicts the wrong thing   | [Cultural correction](https://github.com/neustackdesign/african-icon-library/issues/new?template=cultural-correction.yml) — one required field, no citation needed |
| Add or confirm a local-language name                         | [Local-language name](https://github.com/neustackdesign/african-icon-library/issues/new?template=local-name-contribution.yml)                                      |
| Propose a new icon                                           | [Icon proposal](https://github.com/neustackdesign/african-icon-library/issues/new?template=icon-proposal.yml)                                                      |
| Report something broken                                      | [Bug report](https://github.com/neustackdesign/african-icon-library/issues/new?template=bug-report.yml)                                                            |
| Report something exploitable                                 | Email `icons@neustackstudio.com`. Do not open a public issue. [SECURITY.md](../../SECURITY.md)                                                                     |
| Report conduct                                               | Email `icons@neustackstudio.com`. [CODE_OF_CONDUCT.md](../../CODE_OF_CONDUCT.md)                                                                                   |
| Ask how to use something, or think out loud before proposing | [Discussions](https://github.com/neustackdesign/african-icon-library/discussions)                                                                                  |
| Contribute a drawing                                         | [CONTRIBUTING.md](../../CONTRIBUTING.md) first, then a pull request                                                                                                |

## By what you want to know

| Question                                            | Answer lives in                                                       |
| --------------------------------------------------- | --------------------------------------------------------------------- |
| What is actually released, right now                | `packages/metadata/src/data/icons.json` — the authority, and it moves |
| How an icon has to be drawn                         | [docs/icon-spec.md](../icon-spec.md)                                  |
| What each metadata field means                      | [docs/metadata-schema.md](../metadata-schema.md)                      |
| Why an icon is called what it is called             | [docs/cultural-review.md](../cultural-review.md) and `CHANGELOG.md`   |
| What is currently under cultural review             | [docs/cultural-review.md](../cultural-review.md)                      |
| What happens after I report a cultural problem      | [cultural-review-workflow.md](./cultural-review-workflow.md)          |
| Which version to pin, and what a breaking change is | [versioning.md](./versioning.md)                                      |
| What happens when an id is renamed                  | [deprecation.md](./deprecation.md)                                    |
| Why a brand or a person cannot be drawn             | [rights-policy.md](./rights-policy.md)                                |
| How ids and local names are chosen                  | [naming-conventions.md](./naming-conventions.md)                      |
| Who decides what, and how a dispute escalates       | [GOVERNANCE.md](../../GOVERNANCE.md)                                  |
| Where a drawing came from                           | [docs/audit-provenance.md](../audit-provenance.md)                    |
| What is planned, and what it depends on             | [ROADMAP.md](../../ROADMAP.md)                                        |
| What still has to happen before publication         | [RELEASE_CHECKLIST.md](../../RELEASE_CHECKLIST.md)                    |

## Things people reasonably expect and should not

Stated plainly so nobody wastes an afternoon:

- **Only the `regular` weight exists.** `thin`, `bold` and `fill` are specified and undrawn. They
  will not be produced by changing a stroke width, and asking will not make them appear sooner —
  though [ROADMAP.md](../../ROADMAP.md) says which one is next and what it is waiting on.
- **The illustration tier has no released pieces.** It exists in the architecture and nowhere else.
- **A concept in the backlog is not a promise.** The audit reviewed far more drawings than the
  library released, and most of them need redrawing before they could ship.
- **Local names are mostly not confirmed yet**, which is why the website makes no local-name claim.
  Confirming them is the single highest-value contribution available.
- **The published state changes.** Whether the packages are on npm, whether the plugin is in the
  Figma Community, whether the site is live — check the repository rather than a document.

## Response times

| Kind                                       | You should hear back                                                  |
| ------------------------------------------ | --------------------------------------------------------------------- |
| Cultural correction on a **released** icon | Acknowledged within 3 working days, triaged within 7                  |
| Security report                            | Acknowledged within 5 working days ([SECURITY.md](../../SECURITY.md)) |
| Code of conduct report                     | As quickly as possible; handled confidentially                        |
| Everything else                            | Best effort, and honestly stated in the issue                         |

These are acknowledgement times, not resolution times. Some things — finding a speaker of a
language willing to review a list, drawing a weight — take as long as they take, and this project
would rather say so than publish a target it cannot hit.

## What this project cannot help with

- Icon requests for general-purpose concepts. Lucide, Phosphor and Heroicons draw those better;
  this library is deliberately not competing with them.
- Design work on your product.
- Advice on whether your own use of a third-party mark is lawful. This library's
  [rights policy](./rights-policy.md) is about what **it** ships, not about your usage.
