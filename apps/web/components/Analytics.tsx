'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();

type GtagWindow = Window & {
  gtag?: (...args: unknown[]) => void;
};

export function Analytics() {
  const pathname = usePathname();
  const initialPageView = useRef(true);

  useEffect(() => {
    if (!GA_MEASUREMENT_ID) return;
    if (initialPageView.current) {
      initialPageView.current = false;
      return;
    }
    const w = window as GtagWindow;
    w.gtag?.('event', 'page_view', {
      page_path: pathname,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [pathname]);

  if (!GA_MEASUREMENT_ID) return null;

  return (
    <>
      <Script id="ail-ga4-init" strategy="afterInteractive">{`
        window.dataLayer = window.dataLayer || [];
        window.gtag = window.gtag || function(){window.dataLayer.push(arguments);};
        window.gtag('js', new Date());
        window.gtag('config', '${GA_MEASUREMENT_ID}');
      `}</Script>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
    </>
  );
}
