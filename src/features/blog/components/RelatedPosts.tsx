import Link from 'next/link';
import type { BlogPost } from '@/lib/blog-utils';

interface RelatedPostsProps {
  posts: BlogPost[];
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">Related articles</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-700 transition-shadow hover:shadow-md"
          >
            <div className="font-semibold text-gray-900">{post.title}</div>
            <p className="mt-2 line-clamp-2 text-gray-600">{post.excerpt}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
