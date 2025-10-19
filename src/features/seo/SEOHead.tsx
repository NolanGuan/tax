'use client';

import Head from 'next/head';
import { getGlobalSeoConfig, getPageSeo, type PageKey } from '@/config/seo';
import { siteConfig } from '@/config/site';

interface SEOHeadProps {
  pageKey: PageKey;
  title?: string;
  description?: string;
  image?: string;
  canonical?: string;
}

export function SEOHead({
  pageKey,
  title,
  description,
  image,
  canonical
}: SEOHeadProps) {
  const globalConfig = getGlobalSeoConfig();
  const pageConfig = getPageSeo(pageKey);

  function toAbsoluteUrl(value: string | undefined) {
    if (!value) {
      return `${globalConfig.siteUrl}${pageConfig.path.startsWith('/') ? pageConfig.path : `/${pageConfig.path}`}`;
    }

    if (value.startsWith('http://') || value.startsWith('https://')) {
      return value;
    }

    const normalized = value.startsWith('/') ? value : `/${value}`;
    return `${globalConfig.siteUrl}${normalized}`;
  }

  const resolvedTitle = title ?? pageConfig.title;
  const brandSuffix = ' | GTC';
  const titleWithBrand = resolvedTitle?.endsWith(brandSuffix)
    ? resolvedTitle
    : `${resolvedTitle}${brandSuffix}`;
  const resolvedDescription = description ?? pageConfig.description;
  const resolvedImage = image ?? pageConfig.image ?? globalConfig.defaultImage;
  const resolvedCanonical = toAbsoluteUrl(canonical);
  const absoluteImage = resolvedImage.startsWith('http')
    ? resolvedImage
    : `${globalConfig.siteUrl}${resolvedImage}`;

  return (
    <Head>
      <title>{titleWithBrand}</title>
      <meta name="description" content={resolvedDescription} />
      <link rel="canonical" href={resolvedCanonical} />

      {/* Open Graph */}
      <meta property="og:title" content={titleWithBrand} />
      <meta property="og:description" content={resolvedDescription} />
      <meta property="og:url" content={resolvedCanonical} />
      <meta property="og:site_name" content={siteConfig.name} />
      <meta property="og:image" content={absoluteImage} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      {globalConfig.twitter.site ? (
        <meta name="twitter:site" content={globalConfig.twitter.site} />
      ) : null}
      {globalConfig.twitter.creator ? (
        <meta name="twitter:creator" content={globalConfig.twitter.creator} />
      ) : null}
      <meta name="twitter:title" content={titleWithBrand} />
      <meta name="twitter:description" content={resolvedDescription} />
      <meta name="twitter:image" content={absoluteImage} />
    </Head>
  );
}
