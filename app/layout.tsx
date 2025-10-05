import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import './globals.css';
import { SiteShell } from '@/features/layout';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  metadataBase: new URL(`https://${siteConfig.domain}`),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`
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
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased">
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
