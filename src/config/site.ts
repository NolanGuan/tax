/**
 * Base site configuration
 *
 * Before launch, double-check the following fields:
 * - domain: production hostname used for canonical URLs and the sitemap
 * - contactEmail: public contact address
 * - announcement: optional top-of-page banner (set to null to disable)
 * - nav / footer: navigation and footer links
 */

export interface NavItem {
  label: string;
  href: string;
}

export interface FooterConfig {
  about: string;
  copyright: string;
  links?: NavItem[];
  resources?: NavItem[];
}

export interface SiteConfig {
  name: string;
  tagline: string;
  nav: NavItem[];
  footer: FooterConfig;
  contactEmail: string;
  social: {
    github: string;
    twitter: string;
  };
  domain: string;
  defaultOgImage: string;
  announcement?: {
    message: string;
    href?: string;
    label?: string;
  } | null;
  defaultLocale: string;
  supportedLocales: string[];
}

export const siteConfig: SiteConfig = {
  name: 'Gain Tax Calculator',
  tagline: 'Plan U.S. capital gains tax moves with accurate calculators and expert guides.',
  nav: [
    { label: 'Home', href: '/' },
    { label: 'Calculator', href: '/calculator' },
    { label: 'Guide', href: '/guide' },
    { label: 'Tax Rate', href: '/tax-rate' },
    { label: 'About', href: '/about' }
  ],
  footer: {
    about:
      'Gain Tax Calculator delivers trusted calculators and strategies for investors, homeowners, and crypto traders seeking clarity on U.S. capital gains tax rules.',
    copyright: '© 2025 Gain Tax Calculator. All rights reserved.',
    links: [
      { label: 'Capital gains tax calculator', href: '/calculator/capital-gains' },
      { label: 'Real estate capital gains calculator', href: '/calculator/real-estate-capital-gains' },
      { label: 'Crypto capital gain tax rate calculator', href: '/calculator/crypto-tax' }
    ],
    resources: [
      { label: 'Capital gains tax guide', href: '/guide/capital-gains-tax-basics' },
      { label: 'Scenario planning playbook', href: '/guide/tax-planning-scenarios' },
      { label: 'RSS feed', href: '/feed.xml' }
    ]
  },
  contactEmail: 'support@gaintaxcalculator.com',
  social: {
    github: 'https://github.com/gaintaxcalculator',
    twitter: 'https://twitter.com/GainTaxCalc'
  },
  domain: 'gaintaxcalculator.com',
  defaultOgImage: '/images/og-default.jpg',
  announcement: null,
  defaultLocale: 'en',
  supportedLocales: ['en']
};
