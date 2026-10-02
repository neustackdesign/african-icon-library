# African Icon Library — Figma Community V3 design direction

Status: implementation brief for the V2 Community release.

This document defines the presentation layer for the Figma Community file, Community listing media and companion Figma plugin. The repository remains the source of truth for icon geometry, metadata and released counts.

## 1. What we are borrowing from the references

The supplied Ruri/Iconly references are useful for presentation structure, not for brand styling:

- one clear product claim per frame;
- oversized editorial typography with very little supporting copy;
- the actual library/plugin UI as the main proof object;
- generous negative space;
- a strong hero/cover that survives thumbnail scale;
- feature slides that explain the product by showing it, rather than listing features.

Do not copy their gradients, logos, typography, icon counts, feature density or generic SaaS styling.

## 2. AIL visual language

Use the V3 website system as the source of truth.

### Core palette

- dark canvas — `#12110D`
- dark sunken — `#0C0B08`
- dark surface — `#1A1915`
- dark raised — `#23211B`
- dark line — `#3A372F`
- dark text — `#F2F0E9`
- dark secondary text — `#A9A395`
- light canvas — `#EFEDE6`
- light card — `#F8F7F2`
- light ink — `#12110D`
- light secondary ink — `#55514A`
- AIL green — `#79C79A`
- green ink on light — `#2E7D4F`

### Category fields

Category colour is information, not decoration.

- Food & Drink — `#F39762`
- Transport — `#E5C95E`
- Commerce & Industry — `#47C7C7`
- Culture & People — `#EE939B`
- Music, Art & Play — `#B093E5`
- Fashion & Textiles — `#69A1E8`
- Identity & State — `#76C788`

### Type

Use the same hierarchy as the website: large neutral sans headings, restrained metadata and short labels. The generated Community builder may use Inter for reliability inside Figma; the website remains Geist/Geist Mono.

## 3. Positioning

Primary line:

> Icons for African everyday life — starting with Nigeria.

Supporting proof:

> 30 icons · 7 categories · one 24px system · open source

Do not imply the library is comprehensive. Do not use inflated language such as “thousands”, “for every need” or “the definitive African icon library”. The current size is part of the story: a small, coherent, culturally grounded starting set.

## 4. Community file architecture

Keep the existing generated-data architecture. Redesign the presentation, not the source pipeline.

1. `00 — Start Here`
   - cover
   - Community listing frames
   - concise orientation and usage notes
2. `01 — All Icons`
   - all released icons grouped by category
3. populated category pages
4. `Components`
   - canonical editable components
5. `Names & Cultural Notes`
   - description, region and reviewed/pending local names
6. `Licence & Contributions`
   - MIT licence, corrections and contribution route

The file must never contain an icon that is not in canonical released metadata.

## 5. Community listing assets

All listing frames are `1920 × 960` and must remain legible at thumbnail size.

### Cover — “Icons for African everyday life.”

Dark AIL canvas. Use a split composition rather than a centred icon parade.

Left:

- small `AFRICAN ICON LIBRARY · V2` eyebrow;
- headline: `Icons for African everyday life.`;
- supporting line: `Starting with Nigeria · 30 icons · 7 categories · 24px system`;
- small Neustack/Open source attribution.

Right:

- one large light “library browser” panel containing real released icons;
- seven category-colour markers used as navigation/metadata, not abstract blobs;
- no fake product features.

The result should have the confidence of the dark Ruri reference while remaining unmistakably AIL.

### 01 — “30 icons. 7 categories. One system.”

Light editorial ground.

Left third:

- oversized headline;
- one short sentence.

Right two thirds:

- the complete released set in a clean browser/grid;
- category labels and category-colour markers;
- no invented counts.

### 02 — “Search. Filter. Insert.”

Light editorial ground.

Left:

- `Figma Plugin` as the large feature heading;
- short copy: `Search the released set, filter by category, choose a size and place an editable icon without leaving the canvas.`

Right:

- a faithful mockup of the actual V3 plugin UI;
- visible search, category chips, 5-column grid, size control and selected-icon insert bar;
- use real icons and real category names.

### 03 — “One 24px system.”

Light editorial ground.

Left:

- large headline;
- `1.5 stroke · round caps · round joins · live editable vectors`.

Right:

- one representative icon enlarged over the real 24-unit construction grid;
- small row showing the same icon at 16 / 24 / 32 / 48.

### 04 — “Context travels with the icon.”

Light editorial ground.

Left:

- large headline;
- short copy explaining that name, description, region and review state are part of the library rather than hidden metadata.

Right:

- 3–4 real cultural-note cards generated from released metadata;
- use `CONFIRMED` / `PENDING` exactly as the file does;
- never invent a translation or local name.

### 05 — “One library. Several ways in.”

Dark or light ground, whichever gives the sequence better rhythm.

Show four access surfaces as one system:

- Figma Community components;
- Figma plugin;
- website + SVG downloads;
- open-source repository/packages.

Footer proof line:

> One released dataset generates every surface.

## 6. Plugin V3

The plugin should feel like an icon browser, not a settings form.

### Structure

1. compact AIL masthead + release state;
2. prominent search;
3. horizontally scrollable category chips;
4. size segmented control: `16 / 24 / 32 / 48`;
5. weight control only when more than one weight is actually released;
6. 5-column icon browser;
7. sticky selected-icon bar with preview, name, category/region/size and `Insert icon` action;
8. contextual insertion status at the bottom.

### Interaction rules

- click selects;
- double-click inserts;
- Enter inserts the first search result;
- selected category/search changes clear stale selection;
- no network calls, analytics or account requirement;
- labels must remain visible because many AIL referents are culturally specific and cannot be identified reliably from shape alone;
- do not expose undrawn weights as disabled feature promises.

## 7. What not to build

- no colour picker: Figma already edits vector colour better than the plugin can;
- no stroke/customisation panel until there is a real multi-weight/customisation model;
- no favourites/account state for a 30-icon release;
- no animated/3D tabs;
- no fake browser categories or icon counts;
- no separate Figma-only icon geometry;
- no ornamental “African” patterns used as cultural shorthand.

## 8. Release outputs

The Figma work is complete when we have:

- publishable Community file;
- Community cover;
- five Community carousel frames;
- publishable conventional Figma plugin bundle;
- plugin listing icon/thumbnail if Figma requires one;
- plugin screenshot(s) generated from the real V3 UI;
- listing copy and tags;
- final Community URL and plugin URL wired back into the website/README;
- repository vectors confirmed as the same geometry that ships in Figma.

## 9. Final review bar

Before publication:

- every visible icon is released metadata;
- no unsupported cultural claim appears in marketing copy;
- all text survives Community thumbnail crop;
- plugin search/filter/size/insert interactions work at 16/24/32/48;
- no horizontal overflow in the plugin at its production width;
- keyboard focus remains visible;
- dark/light contrast clears normal UI readability;
- file count and plugin count match the released set;
- Community file is a library people can actually use, not only a presentation deck.
