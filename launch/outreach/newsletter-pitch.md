# Newsletter pitch

Segment D. Nine targets, the highest reach-per-effort in the whole outreach list, and the lowest
friction — most of these want one line and a link, submitted through a form.

**The rule that matters here:** a curator picks the link that is easiest to describe in one
sentence. So give them the sentence. Do not give them a paragraph and hope they compress it well.

---

## Which link to submit

Not the home page, in most cases. Curators pick the unusual artefact.

| Newsletter                       | Submit                            | Why                                                                       |
| -------------------------------- | --------------------------------- | --------------------------------------------------------------------------- |
| Sidebar                          | `/spec` or `/status`              | Curates single interesting pages, not products                             |
| TOOOLS.design                    | home page                         | A resource directory — the whole library is the item                       |
| UX Collective                    | the founder essay                 | Favours argument over tools                                                |
| Figmalion                        | the Figma plugin listing          | Figma-only newsletter; the plugin is the item                              |
| Product Disrupt                  | home page or the essay            | Both resources and process writing                                          |
| Design Systems News (both)       | `/spec`                           | Readers care about the validator, not the drawings                          |
| Frontend Focus                   | the repository or `/spec`         | SVG technique is on-beat                                                    |
| JavaScript Weekly                | the npm React package             | The generated-component angle is the only JS story here                    |
| Bytes                            | the repository                    | Conversational; the small-count framing suits their voice                   |
| TLDR Design                      | home page                         | One-line format, technical readership                                       |

---

## The one-line submissions

Use the form. Most of these newsletters have one; using it is more likely to work than an email and
respects the curator's process.

**Design newsletters (Sidebar, TOOOLS, Product Disrupt, TLDR Design):**

```
African Icon Library — 32 open-source icons for African life (a danfo, a suya skewer, a
talking drum, a naira note) on one 24px grid, MIT. One weight drawn of the four specified, and the
site publishes everything not yet drawn.
```

**Design-systems newsletters (news.design.systems, designsystems.news):**

```
African Icon Library — an MIT icon set whose spec is enforced in CI: exact viewBox, geometry
measured against a 2-unit live area with analytic curve bounds, an element allow-list, and a
weight-completeness rule that fails the build if a weight ships for part of the set.
```

**Figma newsletter (Figmalion):**

```
African Icon Library plugin — search 32 icons for African life and insert editable
vectors. Offline by build: the manifest declares "allowedDomains": ["none"] and the build fails if
fetch, XHR, WebSocket, EventSource or an absolute http(s) URL reaches either bundle. The weight
picker shows undrawn weights struck through rather than hiding them.
```

**Developer newsletters (Frontend Focus, JavaScript Weekly, Bytes):**

```
African Icon Library — MIT SVG icons for African life. Every asset validated in CI: exact 24×24
viewBox, bounds measured with cubics solved for extrema, no text elements, no hard-coded colour,
strict element allow-list. Generated hook-free React components with a drift gate.
```

---

## The email version

For newsletters without a form. Keep it to the length below; a long email to a curator is a
misread of their job.

**Subject:** `Submission: open-source African icon library (MIT)`

---

Hello,

A submission for [newsletter], if it fits.

**African Icon Library** — 32 MIT-licensed icons for African life: a danfo, a suya
skewer, a talking drum, an agogo, a naira note. One 24-pixel grid, 1.5 stroke, `currentColor`
paint. One weight drawn of the four specified, and the site publishes a list of everything not yet
drawn.

`https://icons.neustackstudio.com`

The angle, if you want one: it follows an audit of 86 drawings from an earlier African icon set —
no shared grid, no stroke logic, type and trademarks baked into the artwork, 38 files still named
`Group-N` — so the library releases only what passes an automated validator, and says so.

One line if you prefer it pre-written:

> 32 open-source icons for African life on one 24px grid, with a public list of
> everything the library has not drawn.

No follow-up from me either way.

[Name]
Neustack Design · icons@neustackstudio.com

---

## Notes on individual targets

**Sidebar** — five links a day since 2012, and it has taken breaks. Check it is publishing in the
week you submit. It curates pages, so submit `/spec` or `/status` rather than the home page; those
are the pages that are unusual.

**Figmalion** — time this to plugin **approval**, not submission. A Figma newsletter linking to a
plugin that is still in review is the worst possible outcome for both of us.

**UX Collective** — publication and newsletter with different routes. The essay belongs in the
publication; the newsletter picks from what is published. Do not submit the same thing twice.

**Frontend Focus and JavaScript Weekly** — same publisher. Submit to one in a given week. Frontend
Focus is the better fit; JavaScript Weekly only makes sense for the React package.

**Bytes** — large list, conversational voice, low hit rate for libraries with no commercial hook.
Cheap to try, do not expect it.

**TLDR Design** — confirm the design edition is still running and find the current submission route
before writing anything. Marked medium confidence in the list for that reason.

---

## What not to do

- **Do not email a curator who has a form.** The form is how they work.
- **Do not follow up.** Newsletter submissions are a lottery with a published entry process. A
  follow-up does not improve the odds and does annoy people whose inboxes are the job.
- **Do not submit twice.** Once per launch phase, per newsletter, per artefact.
- **Do not pad the count.** If it is 32, say 32. A curator who checks and
  finds fewer will not pick anything of ours again.
- **Do not describe it as "a collection of beautiful African icons".** Every rejected submission
  reads like that. Lead with the grid, the licence and the limits.
- **Do not offer sponsorship** in a submission email, and do not accept an upsell to a paid slot in
  reply. Mark those `declined-paid-only`.
