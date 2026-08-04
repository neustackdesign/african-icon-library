# Security policy

## Scope

This project ships static SVG assets, a metadata package, generated React components, an offline
Figma plugin and a static website. It has no server, no database, no authentication and no user
data.

The realistic risk surface is small and specific:

- **A malicious asset.** An SVG that carries a `<script>`, an external reference, or an embedded
  image. The validator rejects those by element name and the build fails, but a bypass would be a
  genuine vulnerability.
- **The Figma plugin reaching the network.** The manifest declares `"allowedDomains": ["none"]` and
  the build scans both bundles for networking calls and absolute URLs. A way around that would be a
  genuine vulnerability.
- **Supply chain.** A compromised dependency reaching the published packages or the plugin bundle.

## Reporting

Email `icons@neustackstudio.com` with the details and, if you can, a reproduction. Please do not
open a public issue for anything you believe is exploitable.

We will acknowledge within five working days.

## Supported versions

The library is pre-1.0. Only the latest release is supported.
