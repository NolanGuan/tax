'use client';

import Script from 'next/script';

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

interface GoogleAnalyticsProps {
  advertisingConsent: boolean;
}

export function GoogleAnalytics({ advertisingConsent }: GoogleAnalyticsProps) {
  if (!GA_ID) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('consent', 'default', {
            analytics_storage: 'granted',
            ad_storage: '${advertisingConsent ? 'granted' : 'denied'}',
            ad_user_data: '${advertisingConsent ? 'granted' : 'denied'}',
            ad_personalization: '${advertisingConsent ? 'granted' : 'denied'}'
          });
          gtag('js', new Date());
          gtag('config', '${GA_ID}', { anonymize_ip: true, allow_google_signals: ${advertisingConsent} });
        `}
      </Script>
    </>
  );
}
