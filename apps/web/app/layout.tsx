import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';

import { Analytics } from '@/components/Analytics';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import { DARK } from '@/lib/brand';
import { LIBRARY, SITE, plural } from '@/lib/site';

import './globals.css';

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();

// Design System v3: Geist at 400/500 for everything, Geist Mono for facts.
// Self-hosted from app/fonts (OFL-1.1, see app/fonts/README.md) rather than
// fetched from Google at build time, so a build never depends on the network.
// next/font still generates metric-matched fallbacks, so the swap causes no
// layout shift.
const sans = localFont({
  src: './fonts/Geist-400-500.woff2',
  weight: '400 500',
  display: 'swap',
  variable: '--font-geist',
  fallback: ['ui-sans-serif', 'system-ui', 'Arial'],
});

const mono = localFont({
  src: './fonts/GeistMono-400-500.woff2',
  weight: '400 500',
  display: 'swap',
  variable: '--font-geist-mono',
  fallback: ['ui-monospace', 'Menlo', 'monospace'],
  // next/font can only size-adjust Arial or Times as a fallback. For a mono
  // face the system monospace is the closer stand-in during the swap.
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — icons for African life`,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  keywords: [
    'african icons',
    'nigerian icons',
    'svg icon library',
    'open source icons',
    'figma plugin',
    'react icons',
    'design system',
  ],
  authors: [{ name: SITE.maintainer, url: SITE.repository }],
  creator: SITE.maintainer,
  publisher: SITE.maintainer,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: SITE.name,
    locale: SITE.locale,
    url: SITE.url,
    title: `${SITE.name} — icons for African life`,
    description: SITE.description,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE.name} — icons for African life`,
    description: SITE.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  category: 'design',
};

export const viewport: Viewport = {
  themeColor: DARK.canvas,
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareSourceCode',
  name: SITE.name,
  description: SITE.description,
  codeRepository: SITE.repository,
  license: 'https://opensource.org/licenses/MIT',
  programmingLanguage: 'TypeScript',
  version: LIBRARY.version,
  url: SITE.url,
  author: { '@type': 'Organization', name: SITE.maintainer },
  about: `An open-source SVG icon set covering African subject matter. ${plural(
    LIBRARY.iconCount,
    'icon',
  )} released so far.`,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`}>
      <head>
        {GA_MEASUREMENT_ID ? (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            />
            <script
              id="ail-ga4-init"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  window.gtag = window.gtag || gtag;
                  gtag('js', new Date());
                  gtag('config', '${GA_MEASUREMENT_ID}');
                `,
              }}
            />
          </>
        ) : null}
      </head>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
        <Analytics />
        <script
          type="application/ld+json"
          // Static, build-time constant. No user input reaches this string.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </body>
    </html>
  );
}
