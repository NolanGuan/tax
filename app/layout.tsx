import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import './globals.css';
import { SiteShell } from '@/features/layout';
import { siteConfig } from '@/config/site';
import { SiteConfigProvider } from '@/config/site-context';
import { OrganizationSchema } from '@/features/seo';
import { GoogleAnalytics, VercelAnalytics } from '@/features/analytics';

export const metadata: Metadata = {
  metadataBase: new URL(`https://${siteConfig.domain}`),
  title: {
    default: siteConfig.name,
    template: '%s | GTC'
  },
  description: siteConfig.tagline,
  icons: {
    icon: '/favicon-32x32.png'
  }
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang={siteConfig.defaultLocale}>
      <head>
        <link rel="alternate" type="application/rss+xml" title="Gain Tax Calculator Blog" href="/feed.xml" />
      </head>
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased">
        <SiteConfigProvider value={siteConfig}>
          <GoogleAnalytics />
          <VercelAnalytics />
          <OrganizationSchema />
          <SiteShell>{children}</SiteShell>
        </SiteConfigProvider>
      </body>
    </html>
  );
}
