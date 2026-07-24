import type { Metadata } from 'next';
import { buildPageMetadata } from '@/config/seo';
import { SEOHead, StructuredData } from '@/features/seo';
import { Breadcrumbs } from '@/features/layout/components/Breadcrumbs';
import { QuickEstimateForm } from '@/features/calculators/quick-start';
import { FAQSection } from '@/features/faq/FAQSection';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = buildPageMetadata('calculator', {
  title: 'Capital gains tax calculator',
  description:
    'Estimate 2026 federal and simplified state capital gains tax for one asset sale and compare short-term with long-term treatment.',
  path: '/calculator/capital-gains'
});

export default function CapitalGainsCalculatorPage() {
  const faqItems = [
    {
      question: 'Does this calculator include short-term and long-term tax rates?',
      answer:
        'Yes. Assets sold on or before the one-year anniversary generally use ordinary income brackets, while later sales use the 0%, 15%, or 20% long-term brackets for the selected filing status.'
    },
    {
      question: 'Are state capital gains taxes included?',
      answer:
        'We apply the top state capital gains or income rate for the chosen jurisdiction. Because a few states have surtaxes or exemptions, review the notes on the tax rates page before filing.'
    },
    {
      question: 'How are losses handled?',
      answer:
        'If this sale produces a loss, the estimate caps tax at zero. It does not calculate the annual ordinary-income deduction or carryforwards. Use the scenario planner for a preliminary loss-harvesting comparison.'
    }
  ];

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer
      }
    }))
  };

  const calculatorSchema = {
    '@context': 'https://schema.org',
    '@type': 'FinancialProduct',
    name: 'Capital gains tax calculator',
    description:
      'Interactive calculator that estimates 2026 federal and simplified state capital gains tax for one asset sale.',
    serviceType: 'Capital gains tax calculation',
    provider: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: `https://${siteConfig.domain}`
    },
    url: `https://${siteConfig.domain}/calculator/capital-gains`
  };

  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-16">
      <SEOHead
        pageKey="calculator"
        title="Capital gains tax calculator"
        description="Estimate federal and state capital gains taxes, net gains across assets, and review a detailed breakdown of short-term and long-term rates."
        canonical="/calculator/capital-gains"
      />
      <StructuredData data={[faqSchema, calculatorSchema]} id="capital-gains-faq" />

      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Calculator', href: '/calculator' },
          { label: 'Capital gains tax calculator' }
        ]}
      />

      <header className="space-y-3 text-center">
        <h1 className="text-4xl font-bold text-gray-900">Capital gains tax calculator</h1>
        <p className="text-gray-600">
          Model a 2026 federal and simplified state estimate for one asset sale. Enter purchase and sale details to preview holding-period treatment and tax outcomes.
        </p>
      </header>

      <QuickEstimateForm />

      <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-semibold text-gray-900">What this calculator covers</h2>
        <ul className="mt-4 grid gap-3 text-sm text-gray-600 md:grid-cols-2">
          <li className="rounded-xl border border-gray-200 bg-gray-50 p-4">Short-term vs. long-term classification based on holding period.</li>
          <li className="rounded-xl border border-gray-200 bg-gray-50 p-4">Federal marginal rate calculations using 2026 brackets and filing status.</li>
          <li className="rounded-xl border border-gray-200 bg-gray-50 p-4">State-level capital gains rates for high-impact jurisdictions.</li>
          <li className="rounded-xl border border-gray-200 bg-gray-50 p-4">Effective rate and tax-to-proceeds comparisons for strategic planning.</li>
        </ul>
      </section>

      <FAQSection items={faqItems} />
    </div>
  );
}
