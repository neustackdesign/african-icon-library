import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import { Analytics } from '@/components/Analytics';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import { DARK } from '@/lib/brand';
import { LIBRARY, SITE, plural } from '@/lib/site';

import './globals.css';

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();

// Design System v3: Geist at 400/500 for everything, Geist Mono for facts.
// Self-hosted at build time by next/font, with metric-matched fallbacks so the
// swap causes no layout shift.
const sans = Geist({
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
  variable: '--font-geist',
});

const mono = Geist_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
  variable: '--font-geist-mono',
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
