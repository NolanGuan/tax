import type { Metadata } from 'next';
import { buildPageMetadata } from '@/config/seo';
import { SEOHead, StructuredData } from '@/features/seo';
import { getHomePageSections } from '@/content/home-sections';
import { siteConfig } from '@/config/site';
import { HeroSection, FeatureGridSection, LinkListSection, CtaSection } from '@/features/sections';
import { QuickEstimateForm } from '@/features/calculators/quick-start';
import { TrustSignals } from '@/features/trust';

export const metadata: Metadata = buildPageMetadata('home');

export default function HomePage() {
  const { hero, features, quickLinks, cta } = getHomePageSections(siteConfig.defaultLocale);
  const toolHighlights = [
    {
      title: 'Capital gains calculator',
      description: 'Run Gain Tax Calculator estimates with federal, state, and NIIT breakdowns before you execute a trade.',
      href: '/calculator/capital-gains'
    },
    {
      title: 'Scenario planner',
      description: 'Compare holding periods, filing statuses, and residency changes to reveal the lowest tax outcome.',
      href: '/calculator/scenario-planner'
    },
    {
      title: 'Real estate capital gains calculator',
      description: 'Evaluate exclusions, capital improvements, and depreciation recapture before you sell a property.',
      href: '/calculator/real-estate-capital-gains'
    }
  ];

  return (
    <div className="space-y-10">
      <SEOHead pageKey="home" />
      <StructuredData pageKey="home" id="home-structured-data" />
      <HeroSection {...hero} />
      <div className="px-4">
        <div className="mx-auto max-w-5xl">
          <QuickEstimateForm />
        </div>
      </div>
      <FeatureGridSection {...features} />
      <TrustSignals />
      <section className="px-4">
        <div className="mx-auto max-w-6xl rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-gray-900">Gain Tax Calculator modules at a glance</h2>
          <p className="mt-2 text-sm text-gray-600">
            Each module uses the same Gain Tax Calculator engine, so numbers stay consistent whether you start with a quick estimate or a deep planning session.
          </p>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {toolHighlights.map((tool) => (
              <a
                key={tool.href}
                href={tool.href}
                className="rounded-2xl border border-gray-200 bg-gray-50 p-5 text-sm text-gray-700 transition-colors hover:border-blue-500 hover:text-blue-600"
              >
                <h3 className="text-lg font-semibold text-gray-900">{tool.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{tool.description}</p>
              </a>
            ))}
          </div>
        </div>
      </section>
      <LinkListSection {...quickLinks} />
      <CtaSection {...cta} />
    </div>
  );
}
