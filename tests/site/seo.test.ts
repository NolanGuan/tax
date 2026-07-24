import { describe, expect, it } from 'vitest';
import sitemap from '@/../app/sitemap';
import { getPageSeo, getRobotsConfig } from '@/config/seo';
import { siteConfig } from '@/config/site';
import { guidesMetadata } from '@/content/metadata/guides';
import { processMarkdownContent } from '@/lib/blog-utils';

describe('site trust and crawl configuration', () => {
  it('keeps public assets crawlable and exposes the contact page', () => {
    expect(getRobotsConfig().defaultDisallow).not.toContain('/_next');
    expect(getPageSeo('contact').path).toBe('/contact');
  });

  it('links legal and contact pages from the footer without unsupported social profiles', () => {
    const links = [...(siteConfig.footer.links ?? []), ...(siteConfig.footer.resources ?? [])].map(
      (item) => item.href
    );
    expect(links).toEqual(expect.arrayContaining(['/blog', '/contact', '/privacy', '/terms']));
    expect(siteConfig.social.github).toBe('');
    expect(siteConfig.social.twitter).toBe('');
  });

  it('uses distinct editorial, logo, and social-preview identities', () => {
    expect(siteConfig.editorialUrl).toBe('/about#editorial-method');
    expect(siteConfig.logoImage).toBe('/images/logo.png');
    expect(siteConfig.defaultOgImage).toBe('/images/og-default.png');
    expect(siteConfig.logoImage).not.toBe(siteConfig.defaultOgImage);
  });

  it('does not expose an empty reviewer field', () => {
    Object.values(guidesMetadata).forEach((metadata) => {
      expect(metadata.reviewer === undefined || metadata.reviewer.trim().length > 0).toBe(true);
    });
  });

  it('does not create a self-redirect for legacy blog tag URLs', async () => {
    const { default: nextConfig } = await import('../../next.config.mjs');
    const redirects = await nextConfig.redirects();

    expect(
      redirects.some(
        (redirect) =>
          redirect.source === '/blog' &&
          redirect.has?.some((condition) => condition.type === 'query' && condition.key === 'tag')
      )
    ).toBe(false);
    expect(redirects).toContainEqual({
      source: '/blog/tag/:tag*',
      destination: '/blog',
      permanent: true
    });
  });

  it('uses stable content dates and includes important routes in the sitemap', () => {
    const entries = sitemap();
    const contact = entries.find((entry) => entry.url.endsWith('/contact'));
    const taxRate = entries.find((entry) => entry.url.endsWith('/tax-rate'));

    expect(contact).toBeDefined();
    expect(taxRate).toBeDefined();
    expect(new Date(contact!.lastModified!).toISOString()).toBe('2026-07-24T00:00:00.000Z');
    expect(entries.every((entry) => !Number.isNaN(new Date(entry.lastModified!).getTime()))).toBe(true);
    expect(entries.some((entry) => entry.url.endsWith('/calculator/capital-gains-estimate'))).toBe(false);
  });

  it('renders supported Markdown without exposing raw HTML', async () => {
    const { htmlContent } = await processMarkdownContent(
      `A **clear** limit.

1. First item
2. Second item

<script>alert(1)</script>`
    );

    expect(htmlContent).toContain('<strong>clear</strong>');
    expect(htmlContent).toContain('<ol><li>First item</li><li>Second item</li></ol>');
    expect(htmlContent).toContain('&lt;script&gt;alert(1)&lt;/script&gt;');
    expect(htmlContent).not.toContain('<script>');
  });
});
