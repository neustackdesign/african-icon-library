'use client'

import { useEffect, useState } from 'react'

type Consent = 'granted' | 'denied'
const KEY = 'ns_ga_consent'

function readConsent(): Consent | null {
  try {
    const entry = document.cookie.split(';').map((item) => item.trim()).find((item) => item.startsWith(KEY + '='))
    const value = entry?.slice(KEY.length + 1)
    return value === 'granted' || value === 'denied' ? value : null
  } catch { return null }
}

/** Reused consent decision across the main Neustack domain and sibling tools. */
export function AnalyticsConsent() {
  // Suppress first-render flicker for returning visitors until hydration.
  const [choice, setChoice] = useState<Consent | null>('denied')
  useEffect(() => {
    const sync = () => {
      if (document.visibilityState === 'hidden') return
      const current = readConsent()
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setChoice(current)
      ;(window as Window & { gtag?: (...args: unknown[]) => void }).gtag?.('consent', 'update', {
        analytics_storage: current === 'granted' ? 'granted' : 'denied',
      })
    }
    sync()
    document.addEventListener('visibilitychange', sync)
    return () => document.removeEventListener('visibilitychange', sync)
  }, [])

  if (choice !== null) return null
  function decide(next: Consent) {
    try {
      document.cookie = KEY + '=' + next + '; Domain=.neustackstudio.com; Path=/; Max-Age=15552000; Secure; SameSite=Lax'
    } catch { /* blocked cookies: still apply consent to this tab */ }
    ;(window as Window & { gtag?: (...args: unknown[]) => void }).gtag?.('consent', 'update', { analytics_storage: next })
    setChoice(next)
  }
  const btn = { padding: '9px 13px', cursor: 'pointer', font: '600 13px/1.2 system-ui,sans-serif', borderRadius: '4px' }
  return (
    <section role="region" aria-label="Analytics preferences" style={{ position: 'fixed', zIndex: 99999, bottom: 16, left: 16, width: 'min(430px, calc(100vw - 32px))', padding: 20, background: '#191919', color: '#fff', border: '1px solid #555', boxShadow: '0 12px 30px #0006', font: '400 14px/1.5 system-ui,sans-serif' }}>
      <p style={{ margin: '0 0 14px' }}>We use optional Google Analytics cookies to understand which tools and pages people use. Choose whether to allow them.</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        <button type="button" style={{ ...btn, background: '#fff', color: '#191919', border: '1px solid #fff' }} onClick={() => decide('granted')}>Accept analytics</button>
        <button type="button" style={{ ...btn, background: 'transparent', color: '#fff', border: '1px solid #aaa' }} onClick={() => decide('denied')}>Decline</button>
      </div>
    </section>
  )
}
