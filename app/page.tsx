import type { Metadata } from 'next';
import { buildPageMetadata } from '@/config/seo';
import { SEOHead, StructuredData } from '@/features/seo';
import { homePageSections } from '@/content/home-sections';
import { HeroSection, FeatureGridSection, LinkListSection, CtaSection } from '@/features/sections';

export const metadata: Metadata = buildPageMetadata('home');

export default function HomePage() {
  const { hero, features, quickLinks, cta } = homePageSections;

  return (
    <div className="space-y-10">
      <SEOHead pageKey="home" />
      <StructuredData pageKey="home" id="home-structured-data" />
      <HeroSection {...hero} />
      <FeatureGridSection {...features} />
      <LinkListSection {...quickLinks} />
      <CtaSection {...cta} />
    </div>
  );
}
