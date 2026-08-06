# Launch and distribution package

Everything needed to take the African Icon Library from a repository that passes CI to a library
people can find, trust and use. Nothing in this folder is published. Nothing in this folder is a
promise the repository cannot keep.

This package was written against the repository as it stands: the drawing spec in
[`docs/icon-spec.md`](../docs/icon-spec.md), the release ledger in
[`RELEASE_CHECKLIST.md`](../RELEASE_CHECKLIST.md), the cultural-review process in
[`docs/cultural-review.md`](../docs/cultural-review.md) and the audit chain in
[`docs/audit-provenance.md`](../docs/audit-provenance.md). Every claim in every file here should be
checkable against one of those. If you find one that is not, it is a bug — fix the copy, not the
repository.

---

## The placeholder tokens

**No file in this folder hard-codes a count.** The set is growing; copy that names a number goes
stale silently and then someone quotes it in a press release six weeks later. Instead, counts are
written as tokens and substituted at publish time from repository state.

| Token                | Means                                                | Computed from                                                  |
| -------------------- | ---------------------------------------------------- | -------------------------------------------------------------- |
| `{{ICON_COUNT}}`    | Released icons                                       | `packages/metadata/src/data/icons.json` — array length         |
| `{{CATEGORY_COUNT}}` | Categories containing at least one released icon     | distinct `category` values across released icons               |
| `{{BACKLOG_COUNT}}` | Audited concepts with no drawing that meets the spec | `pipeline.backlogConcepts` in `@african-icon-library/metadata` |
| `{{HELD_COUNT}}`    | Drawings that exist but are blocked from release     | `pipeline.heldForCulturalReview + pipeline.heldForIconDesign`  |
| `{{VERSION}}`       | The release being announced                          | `version` in the root `package.json`                           |

Substitute them like this, from the repository root:

```sh
node -e '
const fs = require("node:fs");
const icons = JSON.parse(fs.readFileSync("packages/metadata/src/data/icons.json", "utf8"));
const pkg   = JSON.parse(fs.readFileSync("package.json", "utf8"));
const map = {
  "32":     String(icons.length),
  "7": String(new Set(icons.map(i => i.category)).size),
  "0.2.0":        pkg.version,
};
// BACKLOG_COUNT and HELD_COUNT come from the metadata pipeline export; read them
// from the built package rather than guessing:
//   node -e "import(\"@african-icon-library/metadata\").then(m => console.log(m.pipeline))"
for (const f of process.argv.slice(1)) {
  let s = fs.readFileSync(f, "utf8");
  for (const [k, v] of Object.entries(map)) s = s.split(k).join(v);
  fs.writeFileSync(f, s);
}
' $(find launch -type f \( -name "*.md" -o -name "*.csv" \))
```

Run the substitution **on a copy**, never on the files in this folder. The tokens are the source of
truth; the substituted text is a build artefact of a particular day.

### Numbers that are deliberately hard-coded

These are historical facts about the August 2026 audit. They do not move, so they are written out:

- **86** drawings reviewed by the audit
- **38** of those files still named `Group-N`
- **3** concepts merged by the audit, **4** cut by it
- **24 × 24** canvas, **2**-unit live area, **1.5** stroke, **1.5**-unit minimum counter
- **4** weights specified in the system — of which **1**, `regular`, is drawn

---

## What is in here

```
launch/
├── README.md                     this file
├── positioning.md                problem, insight, promise, proof, anti-claims, competitors
├── master-narrative.md           the story, plus the one-line / 50-word / full descriptions
├── launch-calendar.md            four staged phases, dated, with go/no-go gates
├── launch-calendar.csv           the same calendar, machine-readable
├── platform-copy/                one file per surface, ready to paste
├── outreach/                     who to contact, in what order, with what
├── media-kit/                    boilerplate, credits, and the asset manifest
├── demo-scripts/                 shot-by-shot recording scripts
├── social-assets/                image specs tied to the repo scripts that generate them
└── tracking/                     UTM scheme, analytics event contract, honest metrics
```

## How to use it

1. **Read [`positioning.md`](positioning.md) first.** Everything else is downstream of it. If you
   disagree with the positioning, change it there and let the change propagate, rather than
   editing one platform's copy into a different story.
2. **Work the phases in [`launch-calendar.md`](launch-calendar.md) in order.** Each phase has a
   go/no-go gate that is a command or an account action, not an opinion. A phase that has not
   passed its gate does not ship, and the copy for the next phase stays in the drawer.
3. **Paste from `platform-copy/`, substitute the tokens, then read it once more out loud.** The
   copy is written to be used as written. Where a platform has a character limit, the limit is
   noted and the copy is inside it.
4. **Track with `tracking/`.** The UTM scheme and the event names are a contract with the website.
   If the website changes an event name, change it here in the same commit.

## The rules this copy follows

- **Never claim a weight that is not drawn.** `thin`, `bold` and `fill` are specified and undrawn.
  Any sentence that reads as "four weights" is wrong.
- **Never claim a distribution channel that is not live.** Nothing is on npm, the Figma Community
  or the Figma plugin store. The website is not deployed. The copy uses staged framing and names
  what is not yet available.
- **Never let one Nigerian release stand in for a continent.** The library is Nigeria-first and
  Africa-expanding. "African icons, starting with Nigeria" is accurate. "Icons for Africa" alone
  is not.
- **Never assert a cultural referent nobody confirmed.** Local names ship as `pending` until a
  speaker confirms them, and pending names are not presented publicly as authoritative.
- **State the limits in the copy, not the footnotes.** The set is small, the weights are
  incomplete and the roadmap is honest. That is the differentiator, and burying it wastes it.
- British English throughout. Lower-case kebab-case for icon ids, always.

## Contact

Maintainer: Neustack Design · `icons@neustackstudio.com` ·
[github.com/neustackdesign/african-icon-library](https://github.com/neustackdesign/african-icon-library)
