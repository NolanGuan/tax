import type { Metadata } from 'next';
import { buildPageMetadata } from '@/config/seo';
import { getAllPosts } from '@/lib/blog-utils';
import { PostList } from '@/features/blog';
import { SEOHead, StructuredData } from '@/features/seo';

export const metadata: Metadata = buildPageMetadata('blog');

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <div className="mx-auto max-w-5xl space-y-10 px-4 py-16">
      <SEOHead pageKey="blog" />
      <StructuredData pageKey="blog" id="blog-structured-data" />
      <header className="space-y-3 text-center">
        <h1 className="text-4xl font-bold text-gray-900">Blog</h1>
        <p className="text-gray-600">Capital gains tax updates, planning strategies, and expert commentary.</p>
      </header>

      <PostList posts={posts} />
    </div>
  );
}
