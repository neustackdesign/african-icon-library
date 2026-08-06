# Maintainers

The project has one maintainer. That is a real limitation, not a stage of growth being passed
through quietly, and [GOVERNANCE.md](GOVERNANCE.md) says what follows from it.

## Current

### Neustack Design

**Contact:** `icons@neustackstudio.com`
**Repository:** <https://github.com/neustackdesign/african-icon-library>

Responsible for everything in the repository:

| Area                    | What that covers                                                                                                               |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Icon design             | The drawing spec, the 24-unit grid, weight design, whether a glyph reads at 24 px and sits properly beside its neighbours      |
| Release                 | Version numbers, changelog, tags, artefacts, npm publication, the Figma Community listing                                      |
| Packages                | `@african-icon-library/icons`, `metadata` and `react`, and the schema that binds them                                          |
| Website                 | `apps/web` and its deployment                                                                                                  |
| Figma plugin            | `apps/figma-plugin`, including the offline guarantee and the build check that enforces it                                      |
| Build and validation    | `scripts/`, the validator rules, CI, the generated-output drift gate                                                           |
| Rights                  | Trademark, trade dress, likeness and national-symbol decisions — see [rights-policy.md](docs/governance/rights-policy.md)      |
| Security                | [SECURITY.md](SECURITY.md), and the response to anything reported under it                                                     |
| Code of conduct         | Reports under [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)                                                                         |
| Cultural review process | Running it, acknowledging reports, finding reviewers, recording decisions — **not** deciding the cultural questions themselves |

## Explicitly not held by the maintainer

Cultural authority. The maintainer does not decide what an object is or what it is called in a
language they do not speak, and no amount of maintainership changes that.

That authority sits with cultural reviewers — anyone with relevant knowledge of the referent. There
is no appointment and no roster: the role is filled by whoever answers a given question, and it
lasts as long as that question. See
[cultural-review-workflow.md](docs/governance/cultural-review-workflow.md).

People who exercise it are recorded in [CREDITS.md](CREDITS.md), which is the closest thing this
project has to a list of reviewers, and it is a record of work done rather than a list of
appointments.

## Reviewing areas without a maintainer

Two areas have no one with deep expertise, and it is better to say so than to have someone find out
by getting an unhelpful review:

- **Nigerian languages.** Nobody on the project can confirm a Yoruba, Hausa, Igbo or Nigerian
  Pidgin name. Every local name in the library is `pending` for this reason, and the website
  therefore makes no local-name claim at all.
- **Illustration tier.** It exists in the architecture and has no released pieces, no grid proof
  and no construction rules. A proposal at that tier is a roadmap conversation.

## Becoming a maintainer

Criteria and process are in [GOVERNANCE.md](GOVERNANCE.md#adding-a-maintainer). Short version:
sustained contribution, judgement about the thing this project is most likely to get wrong, and a
demonstrated willingness to say "I do not know enough to decide this" out loud.

A maintainer who steps back is moved to a past section below rather than deleted — who decided what
is part of the record.

## Past maintainers

None. The project is at its first release.
