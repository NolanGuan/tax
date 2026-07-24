import type { Metadata } from 'next';
import Link from 'next/link';
import { buildPageMetadata } from '@/config/seo';
import { SEOHead, StructuredData } from '@/features/seo';
import { Breadcrumbs } from '@/features/layout/components/Breadcrumbs';
import { siteConfig } from '@/config/site';

const PAGE_TITLE = 'Capital gains calculators – Gain Tax Calculator';
const PAGE_DESCRIPTION =
  'Review every Gain Tax Calculator module in one place: capital gains calculator, capital gains estimate, real estate capital gains calculator, crypto tax calculator, and scenario planner.';

export const metadata: Metadata = buildPageMetadata('calculator', {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  path: '/calculator'
});

const calculators = [
  {
    title: 'Capital gains tax calculator',
    description:
      'Estimate 2026 federal and simplified state tax for one asset sale with short-term or long-term treatment.',
    href: '/calculator/capital-gains'
  },
  {
    title: 'Real estate capital gains calculator',
    description:
      'Evaluate primary residence exclusions, capital improvements, and depreciation recapture before listing a property.',
    href: '/calculator/real-estate-capital-gains'
  },
  {
    title: 'Crypto capital gain tax rate calculator',
    description:
      'Model your crypto capital gain tax rate and ordinary income impact using FIFO trade tracking.',
    href: '/calculator/crypto-tax'
  },
  {
    title: 'Scenario planner',
    description:
      'Experiment with sale timing, income adjustments, and loss harvesting to see how strategies change total tax.',
    href: '/calculator/scenario-planner'
  }
];

export default function CalculatorsIndexPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-12 px-4 py-16">
      <SEOHead pageKey="calculator" title={PAGE_TITLE} description={PAGE_DESCRIPTION} canonical="/calculator" />
      <StructuredData pageKey="calculator" id="calculators-structured-data" />

      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Calculator' }
        ]}
      />

      <header className="space-y-4 text-center">
        <h1 className="text-4xl font-bold text-gray-900">Calculators</h1>
        <p className="text-gray-600">
          Explore Gain Tax Calculator’s full suite of calculators designed to model capital gains across assets, states, and timelines. Compare each calculator below to jump straight into the workflow you need.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        {calculators.map((calculator) => (
          <article
            key={calculator.href}
            className="flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="space-y-3">
              <h2 className="text-2xl font-semibold text-gray-900">{calculator.title}</h2>
              <p className="text-sm text-gray-600">{calculator.description}</p>
            </div>
            <Link
              href={calculator.href}
              className="mt-6 inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-800"
            >
              Open calculator
            </Link>
          </article>
        ))}
      </div>

      <section className="rounded-3xl border border-blue-100 bg-blue-50 p-8 text-blue-900">
        <h2 className="text-2xl font-semibold">Looking for a specific scenario?</h2>
        <p className="mt-3 text-sm">
          Email <a className="underline" href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a> with the
          transaction type and states involved—we continuously add new modules based on planner feedback.
        </p>
      </section>
    </div>
  );
}
