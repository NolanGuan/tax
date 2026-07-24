/**
 * Sitemap generation
 * 
 * Automatically generates sitemap.xml based on SEO configuration.
 * Includes all pages with proper multilingual support, priorities,
 * and change frequencies according to SEO best practices.
 */

import type { MetadataRoute } from 'next';
import { getBlogSitemapData } from '@/lib/blog-utils';
import { getGlobalSeoConfig, getPageSeo, getSitemapConfig, type PageKey } from '@/config/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const globalConfig = getGlobalSeoConfig();
  const sitemapConfig = getSitemapConfig();
  const siteContentUpdatedAt = new Date('2026-07-24T00:00:00.000Z');

  const staticEntries = Object.entries(sitemapConfig).map(([pageKey, settings]) => {
    const page = getPageSeo(pageKey as PageKey);
    return {
      url: `${globalConfig.siteUrl}${page.path}`,
      lastModified: siteContentUpdatedAt,
      changeFrequency: settings.changeFrequency,
      priority: settings.priority
    } satisfies MetadataRoute.Sitemap[number];
  });

  const calculatorRoutes = [
    '/calculator',
    '/calculator/capital-gains',
    '/calculator/real-estate-capital-gains',
    '/calculator/crypto-tax',
    '/calculator/scenario-planner'
  ];

  const guideRoutes = [
    '/guide',
    '/guide/capital-gains-tax-basics',
    '/guide/real-estate-capital-gains',
    '/guide/crypto-tax',
    '/guide/tax-planning-scenarios'
  ];

  const auxiliaryRoutes = ['/tax-rate'];

  const additionalEntries: MetadataRoute.Sitemap = [...calculatorRoutes, ...guideRoutes, ...auxiliaryRoutes].map((path) => ({
    url: `${globalConfig.siteUrl}${path}`,
    lastModified: siteContentUpdatedAt,
    changeFrequency: path.startsWith('/guide') ? 'monthly' : 'weekly',
    priority: path === '/calculator' ? 0.9 : path.startsWith('/calculator') ? 0.85 : 0.7
  }));

  const blogEntries = getBlogSitemapData().map((post) => ({
    url: `${globalConfig.siteUrl}${post.url}`,
    lastModified: post.lastModified,
    changeFrequency: post.changeFrequency,
    priority: post.priority
  } satisfies MetadataRoute.Sitemap[number]));

  const combined = [...staticEntries, ...additionalEntries, ...blogEntries];

  const uniqueByUrl = new Map<string, MetadataRoute.Sitemap[number]>();
  combined.forEach((entry) => {
    uniqueByUrl.set(entry.url, entry);
  });

  return Array.from(uniqueByUrl.values());
}
