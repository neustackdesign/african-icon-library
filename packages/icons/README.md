# @african-icon-library/icons

Canonical SVG assets for the [African Icon Library](https://github.com/neustackdesign/african-icon-library).

> **Not published to npm yet.** Build it from the repository: `npm install && npm run build`.

## What is in here

```
svg/regular/*.svg    32 released drawings, 24 x 24, currentColor
staging/regular/     drawn but held from release — never exported
superseded/regular/  v3 originals a later redraw replaced, kept for the record
src/generated/       the drawings compiled into a module
```

Assets ship as inner markup plus one shared root template, so `viewBox`, paint, caps and joins
cannot drift between icons.

## Usage

```ts
import { getIconBody, getIconWeights, renderIconSvg, iconIds } from '@african-icon-library/icons';

renderIconSvg('talking-drum', { size: 32, title: 'Talking drum' });
// -> '<svg xmlns="..." width="32" ... role="img" aria-label="Talking drum">…</svg>'

getIconBody('danfo'); // inner markup only
getIconWeights('danfo'); // ['regular']
iconIds; // every released id
```

`renderIconSvg` returns `undefined` for an unknown id rather than throwing, so a lookup miss is a
value you can branch on.

Omit `title` when the icon sits beside its own visible label — the SVG is then hidden from
assistive technology, which is the correct default.

## Rules every asset obeys

`viewBox="0 0 24 24"`, geometry inside the 2-unit live area, `stroke="currentColor"`,
`fill="none"`, 1.5 stroke, round caps and joins, no text, no ids, no transforms, no colour
literals. Enforced by `npm run validate` in CI. See
[docs/icon-spec.md](../../docs/icon-spec.md).
