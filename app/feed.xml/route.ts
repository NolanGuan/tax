import { NextResponse } from 'next/server';
import { getAllPosts } from '@/lib/blog-utils';
import { getGlobalSeoConfig } from '@/config/seo';

export const dynamic = 'force-static';

export function GET() {
  const posts = getAllPosts();
  const globalSeo = getGlobalSeoConfig();
  const siteUrl = globalSeo.siteUrl;

  const items = posts
    .map((post) => {
      const postUrl = `${siteUrl}/blog/${post.slug}`;
      const pubDate = new Date(post.publishedAt).toUTCString();
      const description = post.seo?.description ?? post.excerpt;
      return `
        <item>
          <title><![CDATA[${post.title}]]></title>
          <link>${postUrl}</link>
          <guid>${postUrl}</guid>
          <pubDate>${pubDate}</pubDate>
          <description><![CDATA[${description}]]></description>
        </item>
      `;
    })
    .join('');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
    <rss version="2.0">
      <channel>
        <title>Gain Tax Calculator Blog</title>
        <link>${siteUrl}/blog</link>
        <description>Capital gains tax planning updates and strategies from Gain Tax Calculator.</description>
        ${items}
      </channel>
    </rss>`;

  return new NextResponse(rss, {
    status: 200,
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate'
    }
  });
}
