import type { Metadata } from 'next';
import { buildPageMetadata } from '@/config/seo';
import { SEOHead, StructuredData } from '@/features/seo';
import { Breadcrumbs } from '@/features/layout/components/Breadcrumbs';
import { ScenarioPlanner } from '@/features/planner/scenario/components';
import { FAQSection } from '@/features/faq/FAQSection';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = buildPageMetadata('calculator', {
  title: 'Capital gains scenario planner',
  description:
    'Compare multiple sale timing, income, and relocation scenarios to see how each choice changes your capital gains tax outcome.',
  path: '/calculator/scenario-planner'
});

export default function ScenarioPlannerPage() {
  const faqItems = [
    {
      question: 'What does the sale timing slider do?',
      answer: 'It moves your target closing date forward or backward. This affects whether a gain is treated as long-term and which tax year the sale lands in.'
    },
    {
      question: 'How is loss harvesting modelled?',
      answer: 'Enter the dollar amount of losses you plan to realise elsewhere. The planner subtracts that value from the net gain to show the impact on total tax owed.'
    },
    {
      question: 'Can I compare more than two scenarios?',
      answer: 'The first release shows two scenarios side by side. Export the results or duplicate the baseline to explore additional combinations quickly.'
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
    name: 'Capital gains scenario planner',
    description:
      'Scenario comparison tool that models sale timing, state residency, income adjustments, and loss harvesting for capital gains decisions.',
    serviceType: 'Capital gains scenario analysis',
    provider: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: `https://${siteConfig.domain}`
    },
    url: `https://${siteConfig.domain}/calculator/scenario-planner`
  };

  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-16">
      <SEOHead
        pageKey="calculator"
        title="Capital gains scenario planner"
        description="Adjust sale timing, income, and state residency to compare the total capital gains tax owed in each scenario."
        canonical="/calculator/scenario-planner"
      />
      <StructuredData data={[faqSchema, calculatorSchema]} id="scenario-faq" />

      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Calculator', href: '/calculator' },
          { label: 'Capital gains scenario planner' }
        ]}
      />

      <header className="space-y-3 text-center">
        <h1 className="text-4xl font-bold text-gray-900">Capital gains scenario planner</h1>
        <p className="text-gray-600">
          Experiment with different sale dates, price expectations, income levels, and state residencies to uncover your best after-tax outcome.
        </p>
      </header>

      <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
        <ScenarioPlanner />
      </section>

      <FAQSection items={faqItems} />
    </div>
  );
}
