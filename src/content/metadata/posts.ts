import postsJson from '../../../content/metadata/posts.json';

export type PostKey = keyof typeof postsJson;

export const postsMetadata = postsJson as Record<PostKey, {
  author: string;
  reviewer: string;
  sources: string[];
  lastUpdated: string;
  nextReview: string;
}>;
