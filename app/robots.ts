/**
 * Robots.txt generation
 * 
 * Automatically generates robots.txt based on SEO configuration.
 * Handles different environments and integrates with sitemap.
 */

import type { MetadataRoute } from 'next';
import { getGlobalSeoConfig, getRobotsConfig } from '@/config/seo';

export default function robots(): MetadataRoute.Robots {
  const globalConfig = getGlobalSeoConfig();
  const robotsConfig = getRobotsConfig();

  const rules: MetadataRoute.Robots['rules'] = [
    {
      userAgent: '*',
      allow: robotsConfig.defaultAllow,
      disallow: robotsConfig.defaultDisallow
    },
    ...(robotsConfig.extraRules ?? []).map((rule) => ({
      userAgent: rule.userAgent,
      allow: rule.allow,
      disallow: rule.disallow
    }))
  ];

  return {
    rules,
    sitemap: `${globalConfig.siteUrl}/sitemap.xml`,
    host: globalConfig.siteUrl
  };
}
