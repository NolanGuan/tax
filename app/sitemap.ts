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
  const today = new Date();

  const staticEntries = Object.entries(sitemapConfig).map(([pageKey, settings]) => {
    const page = getPageSeo(pageKey as PageKey);
    return {
      url: `${globalConfig.siteUrl}${page.path}`,
      lastModified: today,
      changeFrequency: settings.changeFrequency,
      priority: settings.priority
    } satisfies MetadataRoute.Sitemap[number];
  });

  const blogEntries = getBlogSitemapData().map((post) => ({
    url: `${globalConfig.siteUrl}${post.url}`,
    lastModified: post.lastModified,
    changeFrequency: post.changeFrequency,
    priority: post.priority
  } satisfies MetadataRoute.Sitemap[number]));

  return [...staticEntries, ...blogEntries];
}
