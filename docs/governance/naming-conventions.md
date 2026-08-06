# Naming conventions

An id is the most permanent thing in this library. Assets get redrawn, descriptions get rewritten,
categories get reshuffled — an id is an import path in somebody else's codebase and it costs a
deprecation cycle to change. This document is how to get it right the first time.

The rules in [docs/icon-spec.md](../icon-spec.md#naming) are the enforceable subset. This document
covers the judgement.

## Id rules

Lower-case kebab-case, naming the **concept**:

```
talking-drum        yes
Talking Drum        no — case and spaces
talking-drum-line   no — describes a drawing style that no longer varies
Group-27            no
danfo-bus-icon      no — "icon" is not part of any concept
```

The regex in `packages/metadata/src/schema.ts` rejects leading digits, double hyphens and trailing
hyphens, so an id is always safe as a JavaScript identifier stem, a filename and a URL segment.
That is enforced. The rest of this section is not, and matters more.

**One concept, one id, across every weight and both tiers.** `danfo` is the same id whether it is
`regular`, a future `bold`, or an illustration-tier piece. Weight lives in metadata and in the
directory layout, never in the id.

**Name the object, not the drawing.** `clay-pot`, not `pot-with-handles`. If two people who both
know the object would call it different things, that is the hard case — see
[choosing between competing names](#choosing-between-competing-regional-names) below.

**No qualifier that only distinguishes it from a near-duplicate.** If you find yourself writing
`talking-drum-2` or `fabric-roll-adire-variant`, the real problem is that the two drawings are not
distinct enough to be two concepts. Fix the drawings or merge the concepts.

**Prefer the local name when it is the name.** `danfo`, `agogo`, `suya`, `naira-note` — these are
what the things are called, and a library about African life that files them under `minibus`,
`bell`, `grilled-meat` and `banknote` has quietly decided whose vocabulary is the default. The
English terms go in `keywords`, where they do their real job: search.

The exception is where the English word is genuinely what people use for the object in the region,
or where the local name is contested. Do not reach for an obscure name to make a point.

## Transliteration and diacritics

Local names live in `localNames`, not in the id. The id is ASCII kebab-case; the local name carries
the language's real orthography.

### The rule

**Write it correctly, and let search handle the keyboard.**

```ts
{ language: 'yo', value: 'dùndún', review: 'pending' }
```

`dùndún`, not `dundun`. The tone marks are not decoration — Yoruba is a tonal language, and
stripping them produces a different word or no word. `searchIcons` strips diacritics when building
its index, so someone typing `dundun` on a plain keyboard still finds it. Correctness in the data,
tolerance in the search: those are separate problems and only one of them is the contributor's.

This applies to Yoruba tone marks and sub-dots (`ẹ`, `ọ`, `ṣ`), Hausa hooked letters (`ɓ`, `ɗ`,
`ƙ`) and glottal marks, Igbo sub-dots and tone marks, and anything else a language needs. If a
contributor supplies a name without diacritics, ask — do not add them yourself by guessing, and do
not silently strip them either.

### Which orthography

Where a language has more than one written standard, prefer the one used in general publishing in
the country the icon is tagged to, and record the alternative in `keywords`. If a contributor and
a reviewer disagree about orthography, that is a legitimate disagreement and it goes through the
same path as any other cultural question — see
[cultural-review-workflow.md](./cultural-review-workflow.md).

### Language codes

ISO 639, two or three letters, as the schema requires: `yo`, `ha`, `ig`, `pcm` for Nigerian Pidgin.
Where a name is specific to one variety of a language, say so in the pull request; the schema has
no field for it yet, and inventing one for a single case is worse than a note in the review record.

### Never present an unconfirmed name as authoritative

A name is `pending` until a speaker of the language confirms it for **this specific drawing**. A
pending name is searchable and invisible; a confirmed name is rendered publicly. The website makes
no local-name claim it cannot stand behind, and that constraint is enforced by the data rather than
by remembering.

## Choosing between competing regional names

This is the hard case, and it is not a tie-break — it is a decision about whose name the library
asserts. Getting it wrong is the highest-priority bug class in this project.

### The worked example: `ayo` and `oware`

The August 2026 audit filed a drawing as _"Oware Board Game Line"_ and noted:

> In Nigeria this is ayo (oware is the Ghanaian name) — rename or region-tag. A top-down 2×6 board
> reads far better small.

One game, two names, two countries, both correct in their own place. The concept is in the backlog
and the decision is still open, which makes it a live example rather than a hypothetical.

Work through the questions in order.

**1. Is it actually one concept?**

Yes. The Yoruba game the audit points at and the Akan `oware` belong to the same two-row mancala
family. The rules differ regionally; the object drawn — a board with two rows of pits — does not.
If the _objects_ differed enough to need different drawings, this would be two ids and no conflict.

**2. Which region is the icon tagged to?**

This is the deciding question in most cases. The id follows the region the icon is filed under. The
library is Nigeria-first, this drawing descends from a Nigerian set, and `regions: ['NG']` is
already the right tag. So the id is **`ayo`**.

That reasoning generalises: _the id follows the region, and the other names become searchable
aliases._ It is not a claim that `ayo` is the more correct name in the world. It is a claim about
what this record is a record of.

**3. Can both names ship?**

Yes, and both should — as `localNames` entries, each tagged with its own language, each with its
own review state:

```ts
localNames: [
  { language: 'yo', value: '<Yoruba name, with its tone marks>', review: 'pending' },
  { language: 'ak', value: 'oware', review: 'pending' },
];
```

Both entries start `pending`, including the written form of the Yoruba name — the diacritics are
part of what a speaker confirms, not something to fill in from a search result.

Plus `oware` and `mancala` in `keywords`, so nobody fails to find the icon because they learned it
under a different name. Findability is never the thing being rationed here; **assertion** is.

**4. If the concept is genuinely equally attached to two regions?**

Then the honest answer may be two icons rather than one id and a compromise. If the boards are
drawn differently in the two traditions and both are worth having, draw both: `ayo` tagged `NG`,
`oware` tagged `GH`, each with its own construction. Two well-observed drawings beat one that
splits the difference and is accurate to neither.

Only merge when the drawings would be identical.

**5. What if there is no regional tiebreak — a diaspora concept, a pan-African object?**

Then it goes to the cultural reviewers, and the decision is recorded with its reasoning in
`docs/cultural-review.md`. Do not decide it in a pull request comment thread that nobody will find
in two years.

### What never decides it

- **Which name is more familiar to an English-speaking audience.** `oware` has more search volume
  in English. That is a reason to put it in `keywords`, not a reason to make it the id.
- **Which name the audit or an existing file happened to use.** The audit filed it as "Oware Board
  Game Line" and then flagged its own filing. The provenance is preserved; the name is not
  inherited.
- **Alphabetical order, or which is shorter.** These are tie-breaks for ordering, not for meaning.
- **Whoever asked first.**

### The other open naming questions

The same procedure applies to each of these, all currently in the backlog and all recorded in
`docs/cultural-review.md`:

| Filed as                | Proposed       | The question                                                            |
| ----------------------- | -------------- | ----------------------------------------------------------------------- |
| Banjo Guitar Outline    | `goje`         | goje or garaya? Which Hausa lute is drawn?                              |
| Bongo Drum Outline      | `twin-drums`   | bàtá, gbedu, or something else? "Bongo" is Afro-Cuban and simply wrong. |
| Traditional Cap Outline | `abeti-aja`    | Confirm abetí ajá, then clarify crown versus flaps.                     |
| Group-6 / 7 / 37        | three rock ids | Which is Olumo, which is Zuma, which is Aso?                            |

Note the shape shared by all four: the _drawing_ exists and the _name_ does not. That is the
normal state of things here, and it is why an unconfirmed name blocks release rather than blocking
the drawing.

## Naming a category or region

Categories use the same kebab-case rule and are deliberately few. Adding a tenth category is a
maintainer decision, not a side effect of an icon proposal — a category that contains one icon is
an empty filter with extra steps.

Regions are ISO 3166-1 alpha-2 codes. The region-tagging convention beyond Nigeria is an open
question in `docs/cultural-review.md` and should be settled before the first non-Nigerian icon
ships, not after.
