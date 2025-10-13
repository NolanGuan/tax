import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeSanitize from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';

const POSTS_DIRECTORY = path.join(process.cwd(), 'content/posts');

const markdownCache = new Map<string, { htmlContent: string; tableOfContents: TocItem[] }>();

export interface BlogPostSeo {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  type?: string;
}

export interface BlogPostFrontmatter {
  title: string;
  excerpt: string;
  author: string;
  publishedAt: string;
  updatedAt?: string;
  tags: string[];
  featured?: boolean;
  coverImage?: string;
  draft?: boolean;
  seo?: BlogPostSeo;
}

export interface BlogPost extends BlogPostFrontmatter {
  slug: string;
  content: string;
  readingTime: string;
  wordCount: number;
}

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

function directoryExists(): boolean {
  return fs.existsSync(POSTS_DIRECTORY);
}

export function getAllPostFiles(): string[] {
  if (!directoryExists()) {
    return [];
  }

  return fs
    .readdirSync(POSTS_DIRECTORY)
    .filter((file) => file.endsWith('.md') || file.endsWith('.mdx'));
}

export function listPostSlugs(): string[] {
  return getAllPostFiles().map(toSlug);
}

function toSlug(filename: string): string {
  return filename.replace(/\.(md|mdx)$/i, '');
}

function loadPostFromFile(filename: string): BlogPost | null {
  const fullPath = path.join(POSTS_DIRECTORY, filename);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);
  const frontmatter = data as BlogPostFrontmatter;

  if (frontmatter.draft) {
    return null;
  }

  const stats = readingTime(content);

  return {
    slug: toSlug(filename),
    content,
    readingTime: stats.text,
    wordCount: stats.words,
    title: frontmatter.title,
    excerpt: frontmatter.excerpt,
    author: frontmatter.author,
    publishedAt: frontmatter.publishedAt,
    updatedAt: frontmatter.updatedAt,
    tags: frontmatter.tags || [],
    featured: frontmatter.featured ?? false,
    coverImage: frontmatter.coverImage,
    draft: frontmatter.draft,
    seo: frontmatter.seo
  };
}

export function getAllPosts(): BlogPost[] {
  const files = getAllPostFiles();
  const posts = files
    .map(loadPostFromFile)
    .filter((post): post is BlogPost => Boolean(post));

  return posts.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export function getPostBySlug(slug: string): BlogPost | null {
  const files = getAllPostFiles();
  const match = files.find((file) => toSlug(file) === slug);
  if (!match) {
    return null;
  }

  return loadPostFromFile(match);
}

export async function processMarkdownContent(content: string): Promise<{
  htmlContent: string;
  tableOfContents: TocItem[];
}> {
  if (markdownCache.has(content)) {
    return markdownCache.get(content)!;
  }

  const toc: TocItem[] = [];

  const result = await remark()
    .use(remarkGfm)
    .use(() => (tree) => {
      const visit = (node: any) => {
        if (node.type === 'heading' && node.depth <= 3) {
          const text = node.children
            .filter((child: any) => child.type === 'text')
            .map((child: any) => child.value)
            .join('');

          if (text) {
            const id = text
              .toLowerCase()
              .replace(/[^\w\s-]/g, '')
              .trim()
              .replace(/\s+/g, '-');

            toc.push({ id, text, level: node.depth });
          }
        }

        if (node.children) {
          node.children.forEach(visit);
        }
      };

      visit(tree);
    })
    .use(remarkRehype)
    .use(rehypeSanitize)
    .use(rehypeStringify)
    .process(content);

  const payload = {
    htmlContent: result.toString(),
    tableOfContents: toc
  };

  markdownCache.set(content, payload);

  return payload;
}

export function getRelatedPosts(currentPost: BlogPost, limit = 4): BlogPost[] {
  return getAllPosts()
    .filter((post) => post.slug !== currentPost.slug)
    .map((post) => {
      const sharedTags = post.tags.filter((tag) => currentPost.tags.includes(tag));
      const score = sharedTags.length;

      return { post, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => {
      if (a.score !== b.score) {
        return b.score - a.score;
      }

      return new Date(b.post.publishedAt).getTime() - new Date(a.post.publishedAt).getTime();
    })
    .slice(0, limit)
    .map(({ post }) => post);
}

export function getPostNavigation(slug: string): {
  prev: BlogPost | null;
  next: BlogPost | null;
} {
  const posts = getAllPosts();
  const index = posts.findIndex((post) => post.slug === slug);

  if (index === -1) {
    return { prev: null, next: null };
  }

  return {
    prev: index < posts.length - 1 ? posts[index + 1] : null,
    next: index > 0 ? posts[index - 1] : null
  };
}

export function getBlogSitemapData() {
  return getAllPosts().map((post) => ({
    url: `/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt || post.publishedAt),
    changeFrequency: 'monthly' as const,
    priority: post.featured ? 0.8 : 0.6
  }));
}
