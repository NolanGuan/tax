import type { Metadata, MetadataRoute } from 'next';
import { siteConfig } from './site';

export type PageKey =
  | 'home'
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
    'Umamusume guide',
    'Pretty Derby tutorial',
    'Umamusume racing tips',
    'horse girl game guide'
  ],
  twitter: {
    site: siteConfig.social.twitter,
    creator: '@umamusume_guide'
  },
  pages: {
    home: {
      title: 'Umamusume: Pretty Derby Guide - Complete Training and Racing Guide',
      description:
        'Complete guide to training, racing and winning in Umamusume: Pretty Derby. Learn strategies, stats management, and career mode tips.',
      path: '/',
      keywords: ['Umamusume guide', 'training plans', 'Pretty Derby tips'],
      structuredData: [
        {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: siteConfig.name,
          url: siteUrl,
          description:
            'Complete guide to training, racing and winning in Umamusume: Pretty Derby with strategies, stat optimisation tips and tools.',
          potentialAction: {
            '@type': 'SearchAction',
            target: `${siteUrl}/blog?q={search_term_string}`,
            'query-input': 'required name=search_term_string'
          }
        }
      ]
    },
    about: {
      title: 'About Umamusume Guide',
      description: 'Learn about Umamusume Guide, the ultimate resource for Pretty Derby trainers.',
      path: '/about',
      keywords: ['About Umamusume Guide', 'Pretty Derby community']
    },
    blog: {
      title: 'Umamusume Guide Blog',
      description: 'Stay updated with the latest Umamusume tips, strategies and updates.',
      path: '/blog',
      keywords: ['Umamusume blog', 'Pretty Derby news', 'Umamusume strategies'],
      structuredData: [
        {
          '@context': 'https://schema.org',
          '@type': 'Blog',
          name: 'Umamusume Guide Blog',
          description: 'Latest Umamusume tips, strategies and updates.',
          url: `${siteUrl}/blog`
        }
      ]
    },
    'privacy-policy': {
      title: 'Privacy Policy - Umamusume Guide',
      description: 'Your privacy is our priority. Learn how we protect your data when using Umamusume Guide.',
      path: '/privacy',
      keywords: ['Umamusume privacy policy', 'data protection']
    },
    'terms-of-service': {
      title: 'Terms of Service - Umamusume Guide',
      description: 'Read our terms of service for using Umamusume Guide and related services.',
      path: '/terms',
      keywords: ['Umamusume terms', 'service agreement']
    }
  },
  sitemap: {
    home: { priority: 1.0, changeFrequency: 'weekly' },
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
