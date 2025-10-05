'use client';

import Head from 'next/head';
import { getGlobalSeoConfig, getPageSeo, type PageKey } from '@/config/seo';
import { siteConfig } from '@/config/site';

interface SEOHeadProps {
  pageKey: PageKey;
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  canonical?: string;
}

export function SEOHead({
  pageKey,
  title,
  description,
  keywords,
  image,
  canonical
}: SEOHeadProps) {
  const globalConfig = getGlobalSeoConfig();
  const pageConfig = getPageSeo(pageKey);

  const resolvedTitle = title ?? pageConfig.title;
  const resolvedDescription = description ?? pageConfig.description;
  const resolvedKeywords = keywords ?? pageConfig.keywords ?? globalConfig.defaultKeywords;
  const resolvedImage = image ?? pageConfig.image ?? globalConfig.defaultImage;
  const resolvedCanonical = canonical ?? `${globalConfig.siteUrl}${pageConfig.path}`;
  const absoluteImage = resolvedImage.startsWith('http')
    ? resolvedImage
    : `${globalConfig.siteUrl}${resolvedImage}`;

  return (
    <Head>
      <title>{resolvedTitle}</title>
      <meta name="description" content={resolvedDescription} />
      {resolvedKeywords?.length ? (
        <meta name="keywords" content={resolvedKeywords.join(', ')} />
      ) : null}
      <link rel="canonical" href={resolvedCanonical} />

      {/* Open Graph */}
      <meta property="og:title" content={resolvedTitle} />
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
      <meta name="twitter:title" content={resolvedTitle} />
      <meta name="twitter:description" content={resolvedDescription} />
      <meta name="twitter:image" content={absoluteImage} />
    </Head>
  );
}
