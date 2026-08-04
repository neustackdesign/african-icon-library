# Cultural review

An icon library that draws other people's culture carries a specific obligation: not to assert
things it does not know. This document is how that obligation is operationalised, so it is a
process rather than a good intention.

## The rule

**A drawing whose name asserts a cultural referent does not ship until someone who knows that
referent confirms it.**

The August 2026 audit already applied this to itself. Where it could not identify an object, it
marked the proposed name with a warning rather than guessing — "crown-on-brim could be several
hats", "confirm (bata? gbedu?)", "referent unidentifiable". Those flags are preserved verbatim in
`packages/metadata/src/data/audit-records.json` and they are load-bearing: the ingest script
refuses to release any drawing whose referent the audit left unconfirmed.

## Where the state lives

Two fields carry it, and both are part of the typed schema rather than a convention:

```ts
culturalReview: {
  required: boolean;
  status: 'not-required' | 'pending' | 'approved';
  note?: string;
}

localNames: Array<{
  language: string;              // ISO 639
  value: string;
  review: 'confirmed' | 'pending';
}>;
```

`releasedIconSchema` refuses to parse an icon where `culturalReview.required` is true and
`status` is anything other than `approved`. The data cannot contradict the claim, because the
claim is generated from the data.

The website renders only `confirmed` local names. Pending ones still feed the search index —
diacritics stripped, so "dundun" finds "dùndún" — because making a name findable is not the same
as presenting it as authoritative.

## The three states a drawing can be in

**Released.** Referent confirmed, no outstanding review. Public.

**Held for cultural review.** The drawing exists in `packages/icons/staging/regular/` with a
recorded blocker and reason. It is not exported, not on the website, not in the plugin, and a test
asserts its id appears in no generated surface. It is not deleted either — the drawing is real
work, and the block is a question, not a verdict.

**Backlog.** No drawing that meets the spec yet. Its audit note usually says what a reviewer would
need to decide first.

## Open reviews

### 1. `fila` — referent unconfirmed (blocks release)

The audit: _"Referent unclear — crown-on-brim could be several hats. Confirm before naming."_

The drawing passes every automated check. What it does not have is a name anyone has verified.
Shipping it as `fila` would assert a specific Yoruba cap on the strength of a shape.

**Needed:** a Nigerian reviewer to identify the object, or to say the drawing should be redrawn as
a specific, named hat.

**File:** `packages/icons/staging/regular/fila.svg`

### 2. Yoruba names for `talking-drum`

`gangan` and `dùndún` were carried over from the audit and are marked `pending`. They are related
but not interchangeable, and the drawn instrument may correspond to one more than the other.

**Needed:** a Yoruba speaker to confirm which applies, and whether both should ship as aliases.

### 3. Local names across the whole set

Zero names are `confirmed` across 16 icons. Consequently the website makes no local-name claim at
all — the concept site's "EN + local-name search" line was removed rather than shipped early.

**Needed:** speakers of Yoruba, Hausa, Igbo and Nigerian Pidgin willing to review a 16-row list.
This is the single highest-value cultural contribution available right now.

### 4. Renames the audit flagged, in the backlog

| Filed as                     | Audit's reading                              | Question                                     |
| ---------------------------- | -------------------------------------------- | -------------------------------------------- |
| Banjo Guitar Outline         | goje / garaya (Hausa lute)                   | Which instrument is drawn?                   |
| Bongo Drum Outline           | paired membrane drums, not Afro-Cuban bongos | bàtá? gbedu? something else?                 |
| Oware Board Game Line        | `ayo` in Nigeria, `oware` in Ghana           | Rename, or region-tag both?                  |
| Traditional Cap Outline      | possibly abetí ajá                           | Confirm, then clarify crown vs flaps         |
| Group-6 / Group-7 / Group-37 | three near-identical rocks                   | Which is Olumo, which is Zuma, which is Aso? |

### 5. `Fela Kuti Outline` — likeness

A real-person likeness in a redistributable library is a rights problem, not a style problem. The
audit's options were to abstract the drawing to a raised-arms silhouette or to clear rights with
the estate.

**Needed:** a decision. Until then the concept does not exist in the library.

### 6. Region tagging beyond Nigeria

`kente-cloth` is Ghanaian and sits in the backlog. The architecture already treats region as a
first-class axis, so it has a home — but the convention should be confirmed before the first
non-Nigerian icon ships, not after.

### 7. National symbols

`nigeria-flag` and `football-jersey` ship as neutral outlines: no colour, no crest, no number, no
lettering. That is a deliberate choice and worth an explicit confirmation before 1.0, since some
jurisdictions regulate depictions of national symbols.

## How to record a decision

1. Add a dated entry to the relevant section above, naming who reviewed it and what they decided.
2. Update `packages/metadata/src/data/icons.json`: set `culturalReview.status`, and set any
   `localNames[].review` to `confirmed`.
3. For a held drawing, move the asset from `packages/icons/staging/regular/` to
   `packages/icons/svg/regular/`, add its metadata record, and remove its entry from
   `CULTURAL_HOLDS` in `scripts/ingest/ingest-v3-audit.ts`.
4. Run `npm run validate && npm run generate && npm run test`.
5. Note it in `CHANGELOG.md`. A confirmed cultural name is a release-worthy event.

## Reporting a problem

If an icon in this library is named wrong, drawn wrong, or represents something in a way that is
inaccurate or disrespectful, please
[open an issue](https://github.com/neustackdesign/african-icon-library/issues). You do not need to
be sure. A false report costs a conversation; a shipped mistake costs everyone who uses the
library.
