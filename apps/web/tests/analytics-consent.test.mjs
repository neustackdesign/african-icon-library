import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8')
const layout = read('../app/layout.tsx')
const banner = read('../components/AnalyticsConsent.tsx')
test('Consent Mode v2 defaults denied before the GA4 config call', () => {
  assert.ok(layout.indexOf("gtag('consent','default'") < layout.indexOf("gtag('config'"))
  assert.match(layout, /analytics_storage:'denied'/)
  assert.match(layout, /ad_user_data:'denied'/)
  assert.match(layout, /ad_personalization:'denied'/)
  assert.match(layout, /<AnalyticsConsent \/>/)
})
test('One shared first-party decision covers Neustack sibling domains', () => {
  assert.match(banner, /Domain=\.neustackstudio\.com/)
  assert.match(banner, /Secure; SameSite=Lax/)
  assert.match(banner, /'consent', 'update'/)
  assert.match(banner, /Accept analytics/)
  assert.match(banner, /Decline/)
})
