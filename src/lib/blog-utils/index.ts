import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';

const POSTS_DIRECTORY = path.join(process.cwd(), 'content/posts');

const markdownCache = new Map<string, { htmlContent: string; tableOfContents: TocItem[] }>();

export interface BlogPostSeo {
  title?: string;
  description?: string;
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

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function normalizeHeading(text: string): { id: string; label: string } {
  const label = text.trim();
  const id = label
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');

  return { id, label };
}

function naiveMarkdownToHtml(content: string): { htmlContent: string; tableOfContents: TocItem[] } {
  const lines = content.split(/\r?\n/);
  const htmlParts: string[] = [];
  const toc: TocItem[] = [];
  let inList = false;

  function closeList() {
    if (inList) {
      htmlParts.push('</ul>');
      inList = false;
    }
  }

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed) {
      closeList();
      continue;
    }

    if (trimmed.startsWith('- ')) {
      const item = escapeHtml(trimmed.slice(2));
      if (!inList) {
        inList = true;
        htmlParts.push('<ul>');
      }
      htmlParts.push(`<li>${item}</li>`);
      continue;
    }

    closeList();

    if (trimmed.startsWith('### ')) {
      const { id, label } = normalizeHeading(trimmed.slice(4));
      toc.push({ id, text: label, level: 3 });
      htmlParts.push(`<h3 id="${id}">${escapeHtml(label)}</h3>`);
      continue;
    }

    if (trimmed.startsWith('## ')) {
      const { id, label } = normalizeHeading(trimmed.slice(3));
      toc.push({ id, text: label, level: 2 });
      htmlParts.push(`<h2 id="${id}">${escapeHtml(label)}</h2>`);
      continue;
    }

    if (trimmed.startsWith('# ')) {
      const { id, label } = normalizeHeading(trimmed.slice(2));
      toc.push({ id, text: label, level: 1 });
      htmlParts.push(`<h1 id="${id}">${escapeHtml(label)}</h1>`);
      continue;
    }

    htmlParts.push(`<p>${escapeHtml(trimmed)}</p>`);
  }

  closeList();

  return {
    htmlContent: htmlParts.join(''),
    tableOfContents: toc
  };
}

export async function processMarkdownContent(content: string): Promise<{
  htmlContent: string;
  tableOfContents: TocItem[];
}> {
  if (markdownCache.has(content)) {
    return markdownCache.get(content)!;
  }

  const parsed = naiveMarkdownToHtml(content);
  markdownCache.set(content, parsed);

  return parsed;
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
