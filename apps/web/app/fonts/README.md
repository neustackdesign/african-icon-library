# Fonts

Geist and Geist Mono, self-hosted so the build never fetches fonts from the network.

| File                      | Source                                                         | Axis           |
| ------------------------- | -------------------------------------------------------------- | -------------- |
| `Geist-400-500.woff2`     | `geist@1.7.2` `dist/fonts/geist-sans/Geist-Variable.woff2`     | `wght` 400–500 |
| `GeistMono-400-500.woff2` | `geist@1.7.2` `dist/fonts/geist-mono/GeistMono-Variable.woff2` | `wght` 400–500 |

Both are subsets of the official variable fonts: Basic Latin, Latin-1, Latin Extended-A,
combining marks, general punctuation, currency symbols, arrows and minus. The weight axis is
limited to the two weights Design System v3 uses. Geist does not draw ₦ (U+20A6); it falls back
to the system face, as it would from any Geist distribution.

To rebuild them (fontTools ≥ 4.66 with brotli):

```python
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from fontTools import subset

UNICODES = "U+0020-007E,U+00A0-017F,U+0300-036F,U+2000-206F,U+20A0-20CF,U+2122,U+2190-21FF,U+2212,U+2215,U+FEFF,U+FFFD"
font = TTFont("Geist-Variable.woff2")
options = subset.Options(flavor="woff2", layout_features=["*"], name_IDs=["*"], notdef_outline=True)
subsetter = subset.Subsetter(options)
subsetter.populate(unicodes=subset.parse_unicodes(UNICODES))
subsetter.subset(font)
font = instancer.instantiateVariableFont(font, {"wght": (400, 500)})
font.flavor = "woff2"
font.save("Geist-400-500.woff2")
```

Licence: SIL Open Font License 1.1, in `OFL.txt`. Copyright (c) 2023 Vercel, in collaboration
with basement.studio.
