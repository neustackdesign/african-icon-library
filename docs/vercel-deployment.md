# Deploying the website

The site has **not** been deployed. Deployment is item 4.4 in
[RELEASE_CHECKLIST.md](../RELEASE_CHECKLIST.md). Everything that can be prepared without account
access is prepared, and the production build is verified on every CI run.

## Why this could not be automated

Not for want of a token. The build environment's egress policy denies `vercel.com` and
`api.vercel.com` at the gateway — every request fails with `CONNECT tunnel failed, response 403`
before a credential is ever offered — so no `vercel` CLI invocation can reach the API from there at
any level of authorisation.

Use the dashboard rather than the CLI, because the connection already half exists: the **Vercel
GitHub App is installed on the `neustackdesign` organisation** (`neustackstudio-site` has a live
`Vercel Preview Comments` check on its pull requests). This repository has simply never been
imported — it reports 0 deployments and no Vercel check on `main`. Importing it takes about two
minutes, needs no token, and wires up automatic production and preview deployments in the same
step.

## What is already done

- `vercel.json` at the repository root sets the build command, install command, output directory,
  framework and security headers. Nothing needs editing.
- The production build runs clean: `npm run build` from the repository root builds the packages,
  both plugins, the release artefacts and the site, in that order.
- Every route is static. There is no server-rendered page, no route handler and no runtime data
  source, so a deployment cannot fail on a missing environment variable.

## Steps, in order

1. **Import the repository.** In Vercel, add `neustackdesign/african-icon-library`.
2. **Set the root directory to the repository root**, not `apps/web`. Pointing it at the app
   directory breaks workspace resolution and the build will fail on the first internal import.
3. **Leave the build settings alone.** `vercel.json` already declares:
   - build command `npm run build`
   - install command `npm ci`
   - output directory `apps/web/.next`
   - framework `nextjs`
4. **Deploy a preview** from `main` and check it before promoting.
5. **Smoke-test the preview** — every one of these must pass:
   - `/` renders and the icon browser shows the full released set
   - `/icons/talking-drum` renders with real-size previews
   - `/downloads` lists the full bundle, the metadata file and every category pack, each with a
     SHA-256 that matches `release/manifest.json`
   - a category pack actually downloads and unzips
   - `/sitemap.xml` lists every icon page
   - `/robots.txt` points at the sitemap
   - `/opengraph-image` returns a PNG showing real drawings
   - `/spec`, `/status`, `/changelog`, `/contributing`, `/licence` all render
   - a deliberately wrong URL renders the 404 page
6. **Promote to production.**
7. **Add the domain** `icons.neustackstudio.com` in the Vercel project.

## DNS

This environment has no DNS access. The record to add at the `neustackstudio.com` zone is:

```
Type   Name    Value                 TTL
CNAME  icons   cname.vercel-dns.com  3600
```

Vercel will show the exact target in the project's Domains tab once the domain is added — use the
value it shows if it differs. Then:

- verify HTTPS is issued (Vercel provisions the certificate automatically once DNS resolves)
- verify `http://icons.neustackstudio.com` redirects to `https://`
- verify the apex or `www` host does not serve this site by accident

## After the first production deploy

- [ ] Re-run the smoke test above against the production host.
- [ ] Check the Open Graph card renders by pasting the URL into a Slack message or a card validator.
- [ ] Run Lighthouse on `/` and on one icon page. The site ships no client-side data fetching and a
      single font family, so anything below 90 on performance is a regression worth investigating,
      not a baseline to accept.
- [ ] Only then update any copy that says the site is not yet live.

## Attaching analytics

Optional and off by default. See [website-deployment.md](./website-deployment.md#analytics) for the
event contract. The site behaves identically with no provider attached.
