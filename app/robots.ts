/**
 * Robots.txt generation
 * 
 * Automatically generates robots.txt based on SEO configuration.
 * Handles different environments and integrates with sitemap.
 */

import type { MetadataRoute } from 'next';
import { getGlobalSeoConfig, getRobotsConfig } from '@/config/seo';

function normalizeRuleValue(value?: string | string[]): string | string[] | undefined {
  if (!value) {
    return undefined;
  }

  if (Array.isArray(value)) {
    const filtered = value.filter(Boolean);
    if (filtered.length === 0) {
      return undefined;
    }
    return filtered.length === 1 ? filtered[0] : filtered;
  }

  return value;
}

export default function robots(): MetadataRoute.Robots {
  const globalConfig = getGlobalSeoConfig();
  const robotsConfig = getRobotsConfig();

  const defaultAllow = normalizeRuleValue(robotsConfig.defaultAllow ?? '/');
  const defaultDisallow = normalizeRuleValue(robotsConfig.defaultDisallow);

  const normalizedRules: MetadataRoute.Robots['rules'] = [
    {
      userAgent: '*',
      ...(defaultAllow ? { allow: defaultAllow } : {}),
      ...(defaultDisallow ? { disallow: defaultDisallow } : {})
    },
    ...((robotsConfig.extraRules ?? []).map((rule) => {
      const allow = normalizeRuleValue(rule.allow);
      const disallow = normalizeRuleValue(rule.disallow);

      return {
        userAgent: rule.userAgent,
        ...(allow ? { allow } : {}),
        ...(disallow ? { disallow } : {})
      };
    }))
  ];

  const trimmedSiteUrl = globalConfig.siteUrl.replace(/\/$/, '');
  let host: string | undefined;

  try {
    const parsed = new URL(trimmedSiteUrl);
    host = parsed.host;
  } catch (error) {
    host = undefined;
  }

  return {
    rules: normalizedRules,
    sitemap: `${trimmedSiteUrl}/sitemap.xml`,
    ...(host ? { host } : {})
  };
}
