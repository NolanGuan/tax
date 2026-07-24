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
  logoImage: string;
  defaultOgImage: string;
  editorialUrl: string;
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
  tagline: 'Estimate 2026 U.S. capital gains taxes with transparent calculators and source-linked guides.',
  nav: [
    { label: 'Home', href: '/' },
    { label: 'Calculator', href: '/calculator' },
    { label: 'Guide', href: '/guide' },
    { label: 'Tax Rate', href: '/tax-rate' },
    { label: 'Blog', href: '/blog' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' }
  ],
  footer: {
    about:
      'Gain Tax Calculator provides educational 2026 estimates for investors, homeowners, and crypto traders. Results are not tax, legal, or investment advice.',
    copyright: '© 2026 Gain Tax Calculator. All rights reserved.',
    links: [
      { label: 'Capital gains tax calculator', href: '/calculator/capital-gains' },
      { label: 'Real estate capital gains calculator', href: '/calculator/real-estate-capital-gains' },
      { label: 'Crypto capital gain tax rate calculator', href: '/calculator/crypto-tax' }
    ],
    resources: [
      { label: 'Capital gains tax guide', href: '/guide/capital-gains-tax-basics' },
      { label: 'Scenario planning playbook', href: '/guide/tax-planning-scenarios' },
      { label: 'Blog', href: '/blog' },
      { label: 'Contact', href: '/contact' },
      { label: 'Privacy policy', href: '/privacy' },
      { label: 'Terms of service', href: '/terms' },
      { label: 'RSS feed', href: '/feed.xml' }
    ]
  },
  contactEmail: 'support@gaintaxcalculator.com',
  social: {
    github: '',
    twitter: ''
  },
  domain: 'gaintaxcalculator.com',
  logoImage: '/images/logo.png',
  defaultOgImage: '/images/og-default.png',
  editorialUrl: '/about#editorial-method',
  announcement: null,
  defaultLocale: 'en',
  supportedLocales: ['en']
};
