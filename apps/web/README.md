# African Icon Library — website

The production site for `icons.neustackstudio.com`.

## Run it

From the repository root, because the site depends on the workspace packages:

```
npm install
npm run build       # builds the packages, plugin and release artefacts first
npm run dev:web
```

## Pages

| Route                                     | Contents                                                                               |
| ----------------------------------------- | -------------------------------------------------------------------------------------- |
| `/`                                       | Hero, icon browser, developer section, plugin section, an explicit statement of limits |
| `/icons/[id]`                             | Per-icon page, statically generated: real-size previews, keywords, weights, provenance |
| `/downloads`                              | Release artefacts with sizes and SHA-256 checksums, read from the release manifest     |
| `/spec`                                   | The drawing spec, rendered from `docs/icon-spec.md`                                    |
| `/status`                                 | Every pipeline count, computed from the repository at build time                       |
| `/changelog`, `/contributing`, `/licence` | Rendered from the canonical repository files                                           |

Document pages render the repository's own Markdown, compiled in by `npm run generate`, so the
site cannot drift from the source and never reads outside its own directory at build time.

## Copy discipline

Every number the site states is read from `@african-icon-library/metadata` at build time. None is
typed into copy. A claim that cannot be computed from the repository does not appear.

See [docs/website-deployment.md](../../docs/website-deployment.md) for the deployment steps, the
SEO surface and the accessibility commitments.
