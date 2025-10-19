import type { Metadata, MetadataRoute } from 'next';
import { siteConfig } from './site';

export type PageKey =
  | 'home'
  | 'calculator'
  | 'about'
  | 'blog'
  | 'privacy-policy'
  | 'terms-of-service';

export interface PageSeoConfig {
  title: string;
  description: string;
  /** URL path starting with `/` */
  path: string;
  image?: string;
  robots?: Metadata['robots'];
  structuredData?: Array<Record<string, any>>;
}

interface GlobalSeoConfig {
  siteUrl: string;
  defaultImage: string;
  twitter: {
    site?: string;
    creator?: string;
  };
  pages: Record<PageKey, PageSeoConfig>;
  sitemap: Record<PageKey, {
    priority: number;
    changeFrequency: NonNullable<MetadataRoute.Sitemap[number]['changeFrequency']>;
  }>;
  robots: {
    defaultAllow: string[];
    defaultDisallow: string[];
    extraRules?: Array<{
      userAgent: string | string[];
      allow?: string[];
      disallow?: string[];
    }>;
  };
}

/**
 * SEO configuration
 *
 * - Each pageKey must define title / description / path
 * - Extend structuredData as needed for additional schema blocks
 * - sitemap / robots settings drive the generated sitemap.xml and robots.txt
 */

const siteUrl = `https://${siteConfig.domain}`;

const seoConfig: GlobalSeoConfig = {
  siteUrl,
  defaultImage: siteConfig.defaultOgImage,
  twitter: {
    site: '@GainTaxCalc',
    creator: '@GainTaxCalc'
  },
  pages: {
    home: {
      title: 'Gain Tax Calculator – Capital Gains Tax Calculator & Planning Tools',
      description:
        'Gain Tax Calculator gives you accurate 2025 capital gains tax estimates, state comparisons, and scenario planning for real estate, crypto, and investment portfolios.',
      path: '/',
      structuredData: [
        {
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: siteConfig.name,
          url: siteUrl,
          description:
            'Gain Tax Calculator provides capital gains tax calculators for federal, state, real estate, and cryptocurrency scenarios.',
          applicationCategory: 'BusinessApplication',
          operatingSystem: 'Any',
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD'
          },
          potentialAction: {
            '@type': 'UseAction',
            target: `${siteUrl}/calculator`
          }
        }
      ]
    },
    calculator: {
      title: 'Capital Gains Calculators',
      description:
        'Explore Gain Tax Calculator tools for netting gains, modeling real estate exclusions, estimating crypto taxes, and comparing planning scenarios.',
      path: '/calculator'
    },
    about: {
      title: 'About Gain Tax Calculator',
      description: 'Meet the tax professionals and product team behind Gain Tax Calculator and its capital gains planning tools.',
      path: '/about'
    },
    blog: {
      title: 'Gain Tax Calculator Blog',
      description: 'Expert insights on capital gains taxes, timing strategies, tax-loss harvesting, and state-level planning updates from Gain Tax Calculator.',
      path: '/blog',
      structuredData: [
        {
          '@context': 'https://schema.org',
          '@type': 'Blog',
          name: 'Gain Tax Calculator Blog',
          description: 'Capital gains tax planning guidance, sale timing strategies, and cross-asset insights from Gain Tax Calculator.',
          url: `${siteUrl}/blog`
        }
      ]
    },
    'privacy-policy': {
      title: 'Privacy Policy – Gain Tax Calculator',
      description: 'Learn how Gain Tax Calculator protects your data while delivering secure capital gains tax calculations.',
      path: '/privacy'
    },
    'terms-of-service': {
      title: 'Terms of Service – Gain Tax Calculator',
      description: 'Review the terms and disclaimers that govern use of the Gain Tax Calculator tools and guides.',
      path: '/terms'
    }
  },
  sitemap: {
    home: { priority: 1.0, changeFrequency: 'weekly' },
    calculator: { priority: 0.9, changeFrequency: 'weekly' },
    about: { priority: 0.6, changeFrequency: 'monthly' },
    blog: { priority: 0.8, changeFrequency: 'weekly' },
    'privacy-policy': { priority: 0.4, changeFrequency: 'yearly' },
    'terms-of-service': { priority: 0.4, changeFrequency: 'yearly' }
  },
  robots: {
    defaultAllow: ['/'],
    defaultDisallow: ['/admin', '/api', '/drafts', '/_next'],
    extraRules: [
      {
        userAgent: ['AhrefsBot', 'MJ12bot'],
        disallow: ['/']
      }
    ]
  }
};

export function getPageSeo(page: PageKey): PageSeoConfig {
  return seoConfig.pages[page];
}

export function buildPageMetadata(page: PageKey, overrides?: Partial<PageSeoConfig>): Metadata {
  const pageConfig = {
    ...getPageSeo(page),
    ...overrides
  };

  const normalizedPath = pageConfig.path.startsWith('/') ? pageConfig.path : `/${pageConfig.path}`;
  const canonical = `${seoConfig.siteUrl}${normalizedPath}`;
  const imagePath = pageConfig.image || seoConfig.defaultImage;

  return {
    title: pageConfig.title,
    description: pageConfig.description,
    metadataBase: new URL(seoConfig.siteUrl),
    alternates: {
      canonical
    },
    robots: pageConfig.robots,
    openGraph: {
      title: pageConfig.title,
      description: pageConfig.description,
      url: canonical,
      siteName: siteConfig.name,
      images: [`${seoConfig.siteUrl}${imagePath}`]
    },
    twitter: {
      card: 'summary_large_image',
      title: pageConfig.title,
      description: pageConfig.description,
      site: seoConfig.twitter.site,
      creator: seoConfig.twitter.creator,
      images: [`${seoConfig.siteUrl}${imagePath}`]
    }
  };
}

export function getStructuredDataForPage(page: PageKey): Array<Record<string, any>> {
  return seoConfig.pages[page].structuredData ?? [];
}

export function getSitemapConfig() {
  return seoConfig.sitemap;
}

export function getGlobalSeoConfig() {
  return seoConfig;
}

export function getRobotsConfig() {
  return seoConfig.robots;
}
