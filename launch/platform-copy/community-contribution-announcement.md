# Community contribution announcement

Posted as a pinned GitHub issue in phase 1 (Thu 27 August 2026), and reused as the "Contribute"
section on the website and in the Community file's About page.

The point of this document is to make contribution **specific**. "Contributions welcome" produces
nothing. A named, bounded, correctly-sized task produces contributions.

---

## Pinned issue

**Title:** `How to help — and what would help most`

**Labels:** `pinned`, `good first issue`, `help wanted`, `cultural-review`

---

This library ships 32 icons in 7 categories, in one drawn weight, and
publishes a list of everything it has not drawn. There is a lot of that list. Here is what would
actually move it, in order of how much it would help.

### 1. Confirm a local-language name — the highest-value thing available

**Zero** local-language names in this library are confirmed. Not one.

Two Yoruba names for `talking-drum` — `gangan` and `dùndún` — came out of the audit and are marked
`pending`. They are related instruments, not synonyms, and nobody has told us which one applies to
the drum we drew, or whether both should ship as aliases.

Because zero names are confirmed, the website renders no local names at all and makes no
local-language claim. The search feature that would use them is built and switched off.

**What we need:** a speaker of Yoruba, Hausa, Igbo or Nigerian Pidgin willing to go through a
32-row list and tell us, per row: is this name right, is it the right register, and is
the diacritic correct.

**What it costs you:** about half an hour. You do not need to know anything about SVG, Figma or
git — comment on this issue or email `icons@neustackstudio.com` and we will send you a list you
can reply to in plain text.

**What you get:** credit in `docs/cultural-review.md` and in the changelog, if you want it. A
confirmed cultural name is a release-worthy event in this project and is noted as one.

### 2. Tell us a name is wrong

A misnamed or misrepresented cultural referent is the **highest-priority bug class in this
project**, ahead of every feature on the roadmap.

You do not need to be sure. A false report costs a conversation. A shipped mistake costs everyone
who uses the library, permanently, because names propagate into other people's codebases.

Open an issue. Say what the icon is called, what you think it actually is, and how confident you
are. "I think that is not a fila but I am not certain" is a completely acceptable issue.

### 3. Identify the cap

There is a drawing in `packages/icons/staging/regular/` that passes every automated check we have
and is not released, because the audit could not identify it. Its note reads:

> _"Referent unclear — crown-on-brim could be several hats. Confirm before naming."_

We need a Nigerian reviewer to either identify the object, or tell us the drawing should be redrawn
as a specific, named hat. Either answer unblocks it. Neither answer is available from a search
engine, which is why it is still held.

### 4. Settle the audit's open renames

The audit flagged five naming questions in the backlog and could not resolve any of them:

| Filed as                     | The audit's reading                          | The question                                 |
| ---------------------------- | -------------------------------------------- | -------------------------------------------- |
| Banjo Guitar Outline         | goje / garaya (Hausa lute)                   | Which instrument is drawn?                   |
| Bongo Drum Outline           | paired membrane drums, not Afro-Cuban bongos | bàtá? gbedu? something else?                 |
| Oware Board Game Line        | `ayo` in Nigeria, `oware` in Ghana           | Rename, or region-tag both?                  |
| Traditional Cap Outline      | possibly abetí ajá                           | Confirm, then clarify crown vs flaps         |
| Group-6 / Group-7 / Group-37 | three near-identical rocks                   | Which is Olumo, which is Zuma, which is Aso? |

Answering any single row here unblocks a concept. The rocks in particular have been three
indistinguishable drawings since before this repository existed.

### 5. Draw an icon

Read [`CONTRIBUTING.md`](../../CONTRIBUTING.md) and [`docs/icon-spec.md`](../../docs/icon-spec.md) first,
and **open an issue before you draw**. Two questions decide whether a concept belongs here:

- **Is it specific?** A generic clipboard belongs in Phosphor or Lucide, which draw it better. A
  danfo, a talking drum, an ayo board — those are the reason this library exists.
- **Does it survive 24 px?** If the concept only reads with architectural detail or a scene, it is
  illustration-tier work — and the illustration tier has zero released pieces, so that is a roadmap
  conversation rather than a pull request.

The spec is short and the validator tells you exactly which rule you broke and why. The most common
first failure is `bounds-live-area`: the drawing leaves the 2-unit padding. Fix it by redrawing,
not by rescaling — a rescale makes your icon read smaller than every one of its neighbours.

### 6. What we will decline, so nobody wastes an afternoon

- Icons carrying letters, numerals or a brand mark.
- Icons depicting an identifiable living person. `Fela Kuti Outline` is in the audit and does not
  exist in this library for exactly this reason; the options were to abstract it to raised arms or
  clear rights with the estate, and nobody has chosen.
- **A weight synthesised from another weight.** Do not submit a `bold` produced by raising
  `stroke-width`. The validator will accept it — it cannot tell a drawn weight from a thickened one
  — and the library will be worse for it. Weights also ship for the entire set at once, so a pull
  request adding `bold` to one icon fails validation by design.
- Anything that reaches the network from the Figma plugin.
- Hand-edits to a generated file. Change the input and regenerate.
- A raster asset of any kind. There is no PNG anywhere in this product and there will not be.

### 7. Non-drawing contributions that are genuinely useful

- **Tell us what is missing.** If you built a Nigerian product and had to redraw something, tell us
  what it was. That list is worth more than our guesses.
- **Use it and report what broke.** Especially at small sizes, in dark themes, and inside real
  layouts.
- **Check the spec reads correctly** to someone who did not write it.
- **Region-tagging convention.** `kente-cloth` is Ghanaian and sits in the backlog while we settle
  how region tagging should work before the first non-Nigerian icon ships. If you have done this in
  another library, we would like to hear how it went.

---

## Ground rules

- **Open an issue before you draw.** The concept matters more than the drawing, and we would rather
  disagree with you before you spend an evening on it.
- **`npm run check` must pass before you open a pull request.** CI runs the same thing, so it will
  find out either way.
- **Say how confident you are** about any cultural name in your pull request. An unconfirmed name
  is not a blocker for the drawing — it is a blocker for release, and the repository has a place
  for drawings in exactly that state.
- **Be kind about the audit.** The 86 drawings this library replaced were made by someone. The
  findings are about the artefacts, not the person, and comments that forget that will be moderated.
- Code of conduct applies to every surface: issues, pull requests, discussions, and anywhere the
  project's name is attached.

---

## Short version, for the website and the Community file

```
The most useful thing you could give this project is not a drawing.

Zero local-language names in this library are confirmed, so the site shows none. If you speak
Yoruba, Hausa, Igbo or Nigerian Pidgin and would review a 32-row list of proposed
names, that is about half an hour of your time and it is worth more than another icon.

Second most useful: telling us a name is wrong. You do not need to be sure. A misrepresented
cultural referent is the highest-priority bug class in this project.

icons@neustackstudio.com · github.com/neustackdesign/african-icon-library/issues
```
