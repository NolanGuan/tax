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
  keywords?: string[];
  image?: string;
  robots?: Metadata['robots'];
  structuredData?: Array<Record<string, any>>;
}

interface GlobalSeoConfig {
  siteUrl: string;
  defaultImage: string;
  defaultKeywords: string[];
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
 * SEO 配置
 *
 * - 每个 pageKey 应包含 title / description / path
 * - keywords、structuredData 可根据项目需求扩展
 * - sitemap / robots 设置用于自动生成 sitemap.xml 与 robots.txt
 */

const siteUrl = `https://${siteConfig.domain}`;

const seoConfig: GlobalSeoConfig = {
  siteUrl,
  defaultImage: siteConfig.defaultOgImage,
  defaultKeywords: [
    'CPM calculator',
    'cost per mille',
    'digital advertising',
    'marketing ROI',
    'CPM formula',
    'advertising calculator'
  ],
  twitter: {
    site: siteConfig.social.twitter,
    creator: '@cpmcalculation'
  },
  pages: {
    home: {
      title: 'CPM Calculator - Free Online Cost Per Mille Calculator | CPMCalculation',
      description:
        'Free online CPM calculator for digital advertising campaigns. Calculate cost per mille, analyze marketing ROI, and optimize your ad spend with professional tools.',
      path: '/',
      keywords: ['CPM calculator', 'cost per mille calculator', 'digital advertising ROI', 'marketing calculator'],
      structuredData: [
        {
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: siteConfig.name,
          url: siteUrl,
          description:
            'Professional CPM calculator tool for digital marketers. Calculate cost per mille, analyze campaign performance, and optimize advertising budgets.',
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
      title: 'CPM Calculator Tool - Calculate Cost Per Mille | CPMCalculation',
      description: 'Professional CPM calculator tool. Input your campaign cost and impressions to instantly calculate cost per mille and optimize your digital advertising spend.',
      path: '/calculator',
      keywords: ['CPM calculator tool', 'cost per mille calculation', 'advertising ROI', 'digital marketing calculator']
    },
    about: {
      title: 'About CPMCalculation - Professional CPM Calculator Tool',
      description: 'Learn about CPMCalculation, the leading free CPM calculator for digital marketers and advertisers to optimize campaign performance.',
      path: '/about',
      keywords: ['About CPMCalculation', 'CPM calculator team', 'digital marketing tools']
    },
    blog: {
      title: 'CPMCalculation Blog - Digital Marketing Insights & Tips',
      description: 'Expert insights on CPM optimization, digital advertising strategies, and marketing ROI analysis to improve your campaign performance.',
      path: '/blog',
      keywords: ['CPM marketing blog', 'digital advertising tips', 'marketing ROI strategies', 'CPM optimization'],
      structuredData: [
        {
          '@context': 'https://schema.org',
          '@type': 'Blog',
          name: 'CPMCalculation Blog',
          description: 'Expert insights on CPM optimization, digital advertising strategies, and marketing ROI analysis.',
          url: `${siteUrl}/blog`
        }
      ]
    },
    'privacy-policy': {
      title: 'Privacy Policy - CPMCalculation',
      description: 'Your privacy is our priority. Learn how we protect your data when using CPMCalculation and our CPM calculator tools.',
      path: '/privacy',
      keywords: ['CPMCalculation privacy policy', 'calculator data protection']
    },
    'terms-of-service': {
      title: 'Terms of Service - CPMCalculation',
      description: 'Read our terms of service for using CPMCalculation CPM calculator and related digital advertising tools.',
      path: '/terms',
      keywords: ['CPMCalculation terms', 'calculator service agreement']
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

  const canonical = `${seoConfig.siteUrl}${pageConfig.path}`;
  const imagePath = pageConfig.image || seoConfig.defaultImage;
  const keywords = pageConfig.keywords ?? seoConfig.defaultKeywords;

  return {
    title: pageConfig.title,
    description: pageConfig.description,
    metadataBase: new URL(seoConfig.siteUrl),
    alternates: {
      canonical
    },
    keywords,
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
