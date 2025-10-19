import Image from 'next/image';
import type { BlogPost } from '@/lib/blog-utils';

interface PostMetadata {
  author?: string;
  reviewer?: string;
  sources?: string[];
  lastUpdated?: string;
}

interface PostHeaderProps {
  post: BlogPost;
  metadata?: PostMetadata;
}

export function PostHeader({ post, metadata }: PostHeaderProps) {
  const displayAuthor = metadata?.author ?? post.author;
  const lastUpdated = metadata?.lastUpdated ?? post.updatedAt;
  const reviewer = metadata?.reviewer;
  const sources = metadata?.sources ?? [];

  return (
    <header className="space-y-6">
      <div className="space-y-3 text-sm text-gray-500">
        <span>{displayAuthor}</span>
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
        {lastUpdated ? (
          <>
            <span aria-hidden="true">•</span>
            <span>Updated {new Date(lastUpdated).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</span>
          </>
        ) : null}
      </div>
      <h1 className="text-4xl font-bold text-gray-900">{post.title}</h1>
      <p className="text-lg text-gray-600">{post.excerpt}</p>
      {reviewer ? (
        <p className="text-sm text-gray-500">Reviewed by {reviewer}</p>
      ) : null}
      {sources.length ? (
        <div className="text-xs text-gray-500">
          <p className="font-semibold uppercase tracking-wide text-gray-400">Sources</p>
          <ul className="mt-1 list-disc space-y-1 pl-4">
            {sources.map((source) => (
              <li key={source}>{source}</li>
            ))}
          </ul>
        </div>
      ) : null}
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
