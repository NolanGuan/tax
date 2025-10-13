import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { buildPageMetadata } from '@/config/seo';
import { siteConfig } from '@/config/site';
import {
  getPostBySlug,
  processMarkdownContent,
  getRelatedPosts,
  getPostNavigation,
  listPostSlugs,
  type BlogPost
} from '@/lib/blog-utils';
import { PostHeader, RelatedPosts } from '@/features/blog';
import { SEOHead, StructuredData } from '@/features/seo';
import { Breadcrumbs } from '@/features/layout';

interface BlogPostPageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return listPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = params;
  const post = getPostBySlug(slug);

  if (!post) {
    const fallback = buildPageMetadata('blog');
    return {
      ...fallback,
      title: `Article not found | ${siteConfig.name}`
    };
  }

  return buildPageMetadata('blog', {
    title: post.seo?.title ?? post.title,
    description: post.seo?.description ?? post.excerpt,
    image: post.seo?.image ?? post.coverImage ?? siteConfig.defaultOgImage,
    keywords: post.seo?.keywords,
    path: `/blog/${post.slug}`
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const { htmlContent } = await processMarkdownContent(post.content);
  const relatedPosts = getRelatedPosts(post, 3);
  const navigation = getPostNavigation(post.slug);
  const shareUrl = `https://${siteConfig.domain}/blog/${post.slug}`;

  const seoOverride = {
    title: post.seo?.title ?? post.title,
    description: post.seo?.description ?? post.excerpt,
    keywords: post.seo?.keywords,
    image: post.seo?.image ?? post.coverImage,
    canonical: shareUrl
  };

  const articleStructuredData = buildArticleStructuredData(post, shareUrl);

  return (
    <article className="mx-auto max-w-3xl space-y-12 px-4 py-16">
      <SEOHead pageKey="blog" {...seoOverride} />
      <StructuredData pageKey="blog" data={articleStructuredData} id={`blog-article-${post.slug}`} />
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Blog', href: '/blog' },
          { label: post.title }
        ]}
      />
      <PostHeader post={post} />

      <BlogPostBody html={htmlContent} />

      <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 text-sm text-gray-600 shadow-sm">
        <span>Share:</span>
        <a
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(shareUrl)}`}
          target="_blank"
          rel="noreferrer"
          className="rounded-full border border-gray-300 px-3 py-1 transition-colors hover:border-blue-500 hover:text-blue-600"
        >
          Twitter / X
        </a>
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
          target="_blank"
          rel="noreferrer"
          className="rounded-full border border-gray-300 px-3 py-1 transition-colors hover:border-blue-500 hover:text-blue-600"
        >
          Facebook
        </a>
      </div>

      <nav className="flex flex-col gap-4 border-t border-gray-200 pt-6 text-sm text-blue-600">
        {navigation.prev && (
          <Link href={`/blog/${navigation.prev.slug}`} className="hover:underline">
            ← Previous: {navigation.prev.title}
          </Link>
        )}
        {navigation.next && (
          <Link href={`/blog/${navigation.next.slug}`} className="hover:underline">
            Next: {navigation.next.title} →
          </Link>
        )}
      </nav>

      <RelatedPosts posts={relatedPosts} />
    </article>
  );
}

function BlogPostBody({ html }: { html: string }) {
  return (
    <div className="prose prose-lg max-w-none prose-blue">
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}

function buildArticleStructuredData(post: BlogPost, url: string) {
  const ensureAbsolute = (imagePath?: string) => {
    if (!imagePath) return undefined;
    if (imagePath.startsWith('http')) return imagePath;
    return `https://${siteConfig.domain}${imagePath}`;
  };

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.seo?.title ?? post.title,
    description: post.seo?.description ?? post.excerpt,
    author: {
      '@type': 'Person',
      name: post.author
    },
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    mainEntityOfPage: url,
    image: ensureAbsolute(post.seo?.image ?? post.coverImage),
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: `https://${siteConfig.domain}`
    }
  };
}
