# LinkedIn — launch posts

Three variants, one per phase. Each is a separate post on a separate date; do not merge them into
one "we launched" post, because each phase makes a different thing true.

LinkedIn shows roughly the first 3 lines before "…see more". The first 210 characters have to earn
the click, and none of these open with "I'm excited to announce".

No hashtag walls. Two or three at most, at the bottom, and only ones a human would actually follow.

---

## Variant A — phase 1, technical preview (Wed 26 August 2026)

Audience: developers and designers who will read a repository. Tone: quiet, specific, no launch
energy.

---

There is a yellow bus in Lagos called a danfo. It carries most of the city.

It has never been drawn as an icon in any major open-source library. Neither has a suya skewer, an
agogo, or a naira note.

So we drew them. 32 of them, MIT licensed, public today:
github.com/neustackdesign/african-icon-library

This is a technical preview, so let me be precise about what that means.

**What is real:** the repository is public, the packages are on npm, and `npm run check` passes
from a clean clone — lint, formatting, icon validation, generated-output verification, type-check,
tests and the full build.

**What is not:** the website is not deployed. The Figma Community file is not published. The plugin
is not in the plugin store. Those are account actions and they are on a schedule, not done.

**Why it is only 32 icons.**

We started by auditing 86 drawings from an earlier African icon set. No shared grid, so they could
not sit next to each other in a toolbar. No stroke logic — a row of them read like a row of
different fonts. Letters baked into the artwork. Trademarks. Five fabric rolls drawn five ways.
Three rocks nobody could tell apart. And 38 files still named `Group-6`, `Group-7`, `Group-37`.

We could have renamed them all and shipped 86 icons in a fortnight.

We rebuilt instead. Now a drawing ships only if it passes: fixed 24 × 24 canvas, geometry inside a
2-unit live area measured on true curve bounds, no text elements, no hard-coded colour, no
transforms, no element ids, and a markup allow-list that excludes anything able to execute, fetch
or embed. All of it enforced by `npm run validate` in CI, not by a style guide someone remembers.

32 survive that. Three of the four specified weights are undrawn and I am not going to
fake them with `stroke-width`.

If you build things for a Nigerian audience, I would genuinely like you to tell me what is missing
— and if you speak Yoruba, Hausa, Igbo or Pidgin, I would like you more to tell me a name is wrong.
Zero local names in this library are confirmed.

#opensource #designsystems

---

## Variant B — phase 2, website live (Wed 16 September 2026)

Audience: working designers. First variant with a link a non-technical person can use.

---

You can now search a danfo, a suya skewer and a talking drum, and copy the SVG:
icons.neustackstudio.com

32 open-source icons for African life. One 24-pixel grid. MIT. Nigeria first.

Three things on the site that I would point at:

**The status page.** Every number on it is computed from the repository when the site is built —
released icons, drawings held from release, concepts in the backlog, weights drawn versus
specified, confirmed local-language names. Nothing is typed by hand, which is the only reason it is
worth reading. It currently says zero local names are confirmed, and that is accurate.

**The empty state.** Search something we do not have and the site tells you the library ships
32 icons so far. Most searches will come back empty. That is the honest state of a set
this size, and hiding it behind a friendlier message would just move the disappointment later.

**The weight status.** One weight is drawn. `thin`, `bold` and `fill` are specified and undrawn,
and they are shown as undrawn rather than omitted. A real weight redistributes mass and re-solves
counters — at 2.0 several of these constructions violate the 1.5-unit counter minimum. Raising
`stroke-width` would produce files that pass the validator and look wrong at 16 px.

The Figma Community file is next. The plugin is after that, and it will be announced when it is
approved rather than when it is submitted.

MIT. Free for commercial use, no attribution required.

#designsystems #opensource

---

## Variant C — phase 3, plugin live (Wed 14 October 2026)

Audience: Figma users. The offline claim is the hook, because it is the only part that is unusual.

---

The Figma plugin for the African Icon Library is live. Search 32 icons for African life
and drop them onto the canvas as editable vectors.

It cannot reach the network. Not "does not" — cannot.

- The manifest declares `"networkAccess": { "allowedDomains": ["none"] }`
- Every icon is compiled into the bundle at build time, so there is no runtime data source
- The build script scans both bundles for `fetch`, `XMLHttpRequest`, `WebSocket`, `EventSource`,
  `importScripts` and absolute http(s) URLs, and fails the build if it finds one
- No analytics, no account, no `clientStorage`, no `setPluginData`

Nothing about your document or your search terms leaves your machine, because there is nowhere for
it to go. The source is public if you want to try to break that claim — I would rather you did.

One detail I want to defend, because two reviewers told me to remove it: the weight picker shows
`thin`, `bold` and `fill` struck through as unavailable rather than hiding them. The library has
drawn one weight of the four it specifies. A designer finding that out after adopting the set is
worse than finding out in the picker.

Icons arrive as editable vector frames with scale constraints, named from the library metadata, at
16, 24, 32 or 48 px, into your selection or the centre of your viewport.

MIT. icons.neustackstudio.com

#figma #designsystems

---

## Rules

- **Never open with "I'm excited to announce".** Open with the danfo, the number, or the constraint.
- **The limits go above the fold or near it.** They are the differentiator; putting them at the
  bottom wastes them.
- **One ask per post.** Phase 1: tell us what's missing / a name is wrong. Phase 2: none, just
  browse. Phase 3: none, just install.
- **Never post a count that has not been substituted from repository state that morning.**
- **Never say "four weights".** Ever, in any variant, in any comment reply.
- **Comment replies get the same discipline as the post.** If someone says "amazing, how many
  icons?", the answer is the substituted number and the status-page link, not "loads more coming".
