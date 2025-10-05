import Image from 'next/image';
import type { BlogPost } from '@/lib/blog-utils';

interface PostHeaderProps {
  post: BlogPost;
}

export function PostHeader({ post }: PostHeaderProps) {
  return (
    <header className="space-y-6">
      <div className="space-y-3 text-sm text-gray-500">
        <span>{post.author}</span>
        <span aria-hidden="true">•</span>
        <time dateTime={post.publishedAt}>
          {new Date(post.publishedAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </time>
        {post.readingTime && (
          <>
            <span aria-hidden="true">•</span>
            <span>{post.readingTime}</span>
          </>
        )}
      </div>
      <h1 className="text-4xl font-bold text-gray-900">{post.title}</h1>
      <p className="text-lg text-gray-600">{post.excerpt}</p>
      {post.coverImage && (
        <div className="overflow-hidden rounded-2xl border border-gray-200">
          <Image
            src={post.coverImage}
            alt={post.title}
            width={1200}
            height={630}
            className="h-auto w-full object-cover"
            priority
          />
        </div>
      )}
    </header>
  );
}
