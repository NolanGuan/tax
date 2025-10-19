import guidesJson from '../../../content/metadata/guides.json';

export type GuideKey = keyof typeof guidesJson;

export const guidesMetadata = guidesJson as Record<GuideKey, {
  author: string;
  reviewer: string;
  sources: string[];
  lastUpdated: string;
  nextReview: string;
}>;
