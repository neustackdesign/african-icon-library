# Press release

**Use in phase 4 only.** It links to a live website, a published Figma Community file and a
published plugin. Sending it before those exist turns every link into a broken promise.

Embargo convention: offer the embargo, do not impose it. `Under embargo until 09:00 WAT, Tuesday
20 October 2026.` Drop the embargo line entirely for anyone who has not agreed to it.

Substitute `32`, `7`, `55`, `1` and
`0.2.0` from repository state on the morning it goes out.

---

FOR IMMEDIATE RELEASE
Lagos, Nigeria — Tuesday 20 October 2026

## Nigerian studio releases an open-source icon library for African life — and publishes the list of what it has not drawn

**Neustack Design has released the African Icon Library, an MIT-licensed set of 32
icons for objects that global icon libraries have never had reason to draw: a danfo, a suya
skewer, a talking drum, an agogo, a naira note, a ludo board. The set is deliberately small. It
follows an audit of 86 drawings from an earlier African icon collection, which found no shared
grid, no stroke logic, letters and trademarks baked into the artwork, duplicate concepts and 38
files still named `Group-N`.**

Rather than reissue that set with the files renamed, the studio rebuilt the library from the
ground up and changed what qualifies for release. Every drawing now sits on one 24 × 24 canvas
with a 2-unit live area, a 1.5 stroke, and round caps and joins. Every paint is `currentColor`, so
an icon inherits the colour of the text around it without being edited. The rules are enforced by
a validator that runs in continuous integration on every asset: it checks the `viewBox`, measures
geometry against the canvas and the live area using analytic curve bounds, rejects any text
element or stray text content, rejects any hard-coded colour, and restricts markup to an
allow-list that excludes `script`, `image`, `use`, `filter` and `mask`.

"We started by downloading what already existed. Eighty-six drawings, and we sat with all of them
for a week," said the maintainer at Neustack Design. "The problem was never that they were ugly.
Some of them were lovely. The problem was that they could not sit next to each other in a toolbar
— no shared grid, no stroke logic, letters baked into the artwork, a couple of trademarks that no
library can legally redistribute, and thirty-eight files still called `Group-6`, `Group-7`,
`Group-37`. Three of them were rocks. We could not tell which rock was which."

"We could have renamed everything, normalised the strokes and shipped eighty-six icons. We shipped
32 instead, and wrote down everything we have not drawn."

### The gap the library addresses

Open-source icon libraries such as Phosphor and Lucide are widely adopted and carefully drawn, and
they cover the general interface vocabulary of the places their contributors live. That vocabulary
does not include a danfo — the yellow minibus that carries much of Lagos — or a suya skewer, or an
agogo bell. African products therefore approximate: a generic bowl for jollof rice, an intercity
coach for a danfo, a dollar sign in front of a naira figure.

The usual alternative is a downloadable pack of African clipart, typically raster, typically
without a licence anyone can read. The August 2026 audit that preceded this library was an
examination of exactly that category, and the "SVG sources" it was given turned out to contain PNG
renders rather than vectors.

### What is released, and what is not

The library ships 32 icons across 7 categories, in one drawn weight,
`regular`.

The system specifies four weights — `thin`, `regular`, `bold` and `fill` — and only one is drawn.
The other three will not be produced by raising the stroke width on the existing assets. "A weight
redistributes mass, re-solves counters and often changes how much detail survives," the project's
drawing specification states. "That is icon design, not a build step."

Alongside the released set, the repository states publicly that 1 drawing exists but
are blocked from release, that 55 audited concepts have no drawing meeting the
specification, and that the illustration tier has no released pieces at all. Those figures appear
on a status page on the project website, where each one is computed from the repository at build
time rather than typed by hand.

One drawing is held for a reason the project treats as a first-class bug class: the audit could
not identify the object. It is a cap, and the audit's note reads "crown-on-brim could be several
hats. Confirm before naming." Rather than release it under a Yoruba name nobody had verified, the
library holds it. The metadata schema enforces the rule — an icon whose required cultural review
is outstanding will not parse, so the data and the public claim cannot diverge.

Local-language names carry the same discipline. Two Yoruba names for the talking-drum icon,
`gangan` and `dùndún`, are recorded as pending because no speaker has yet confirmed which applies
to the drawn instrument. Not one local name in the library is confirmed, so the website makes no
local-language claim at all, and a planned local-name search feature remains switched off.

### Nigeria first

Region is a first-class field in the library's metadata rather than a tag added later. Nigeria is
the first region shipped, and the project describes the continent as its roadmap rather than its
current scope. A Ghanaian concept, `kente-cloth`, sits in the backlog specifically because the
region-tagging convention is being confirmed before the first non-Nigerian icon ships.

### Tools

The release includes three npm packages — canonical SVG assets, a typed metadata package with a
shared search implementation, and generated React components — plus a Figma Community file and a
Figma plugin.

The plugin is offline by declaration and by build. Its manifest declares
`"networkAccess": { "allowedDomains": ["none"] }`, all icon data is compiled in at build time, and
the build fails if `fetch`, `XMLHttpRequest`, `WebSocket`, `EventSource`, `importScripts` or any
absolute http(s) URL reaches either bundle. The plugin's weight picker shows the three undrawn
weights struck through as unavailable rather than hiding them.

### Availability

The African Icon Library is available under the MIT licence at
`https://icons.neustackstudio.com` and
`https://github.com/neustackdesign/african-icon-library`. It is free for commercial use with no
attribution required. The licence grants no rights in third-party trademarks or regulated national
symbols; no released icon reproduces either.

The project's stated highest-value contribution is not a drawing. It is a speaker of Yoruba, Hausa,
Igbo or Nigerian Pidgin willing to review a 32-row list of proposed local names.

### About Neustack Design

Neustack Design is a design studio and the maintainer of the African Icon Library. The library is
open source under the MIT licence and accepts contributions; the project documents a report of a
misnamed or misrepresented cultural referent as its highest-priority bug class.

### Media contact

`icons@neustackstudio.com`

Media kit, factsheet, logos and screenshots: see `launch/media-kit/` in the repository.

###

---

## Short version (for outlets that want 200 words)

**Neustack Design has released the African Icon Library**, an MIT-licensed open-source set of
32 icons for African life — a danfo, a suya skewer, a talking drum, an agogo, a naira
note — across 7 categories.

The set follows an August 2026 audit of 86 drawings from an earlier African icon collection, which
found no shared grid, no stroke logic, letters and trademarks baked into the artwork, duplicate
concepts, and 38 files still named `Group-N`. Rather than reissue it, the studio rebuilt and
releases only drawings that pass an automated validator running in CI: fixed 24 × 24 canvas, a
2-unit live area measured on true curve bounds, no text, no hard-coded colour, and a strict markup
allow-list.

It ships one drawn weight of the four it specifies, and says so. It publishes counts of what is
held, what is in the backlog, and how many local-language names are confirmed — currently none, so
the site makes no local-name claim. One drawing is held because the audit could not identify the
object it depicts.

Nigeria is the first region; the continent is the roadmap. Available at
`icons.neustackstudio.com` and `github.com/neustackdesign/african-icon-library`.

Contact: `icons@neustackstudio.com`
