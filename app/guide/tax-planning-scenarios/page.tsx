import type { Metadata } from 'next';
import { buildPageMetadata } from '@/config/seo';
import { SEOHead, StructuredData } from '@/features/seo';
import { Breadcrumbs } from '@/features/layout/components/Breadcrumbs';
import { FAQSection } from '@/features/faq/FAQSection';
import { guidesMetadata } from '@/content/metadata/guides';

export const metadata: Metadata = buildPageMetadata('blog', {
  title: 'Capital gains tax planning scenarios',
  description:
    'Explore case studies for sale timing, loss harvesting, and relocation to optimize capital gains tax outcomes.',
  path: '/guide/tax-planning-scenarios'
});

export default function TaxPlanningScenariosGuidePage() {
  const meta = guidesMetadata['tax-planning-scenarios'];
  const faqItems = [
    {
      question: 'How many scenarios should I compare?',
      answer: 'Start with two: your current plan and the most realistic alternative. Once you pick a direction, layer in additional adjustments to refine timing, state changes, and tax-loss harvesting amounts.'
    },
    {
      question: 'Can the scenario planner model federal surtaxes?',
      answer: 'Net Investment Income Tax and the additional Medicare surtax automatically apply once your income crosses the thresholds in our calculators.'
    },
    {
      question: 'Where do I capture partial-year residency moves?',
      answer: 'Use the state selector in each scenario to compare the capital gains rate in your current state versus the state you are moving to. Remember to prorate ordinary income separately with your CPA.'
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

  const tableOfContents = [
    { id: 'scenario-long-term', label: 'Scenario 1: Wait for long-term qualification' },
    { id: 'scenario-relocation', label: 'Scenario 2: Loss harvesting to fund a relocation' },
    { id: 'scenario-options', label: 'Scenario 3: Exercising stock options' },
    { id: 'scenario-next-steps', label: 'Applying the playbook' }
  ];

  return (
    <div className="mx-auto max-w-3xl space-y-10 px-4 py-16">
      <SEOHead
        pageKey="blog"
        title="Capital gains tax planning scenarios"
        description="Walk through real-world examples that use the scenario planner to compare capital gains strategies before year-end."
        canonical="/guide/tax-planning-scenarios"
      />
      <StructuredData data={faqSchema} id="scenario-guide-faq" />

      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Guide', href: '/guide' },
          { label: 'Capital gains tax planning scenarios' }
        ]}
      />

      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">Guide</p>
        <h1 className="text-4xl font-bold text-gray-900">Capital gains tax planning scenarios</h1>
        <p className="text-sm text-gray-500">Updated {meta.lastUpdated} • Next review {meta.nextReview}</p>
      </header>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm text-sm text-gray-600">
        <dl className="grid gap-2 md:grid-cols-2">
          <div>
            <dt className="font-semibold text-gray-900">Author</dt>
            <dd>{meta.author}</dd>
          </div>
          <div>
            <dt className="font-semibold text-gray-900">Reviewer</dt>
            <dd>{meta.reviewer}</dd>
          </div>
          <div className="md:col-span-2">
            <dt className="font-semibold text-gray-900">Sources</dt>
            <dd>
              <ul className="list-disc space-y-1 pl-5">
                {meta.sources.map((source) => (
                  <li key={source}>{source}</li>
                ))}
              </ul>
            </dd>
          </div>
        </dl>
      </section>

      <nav aria-label="Table of contents" className="rounded-2xl border border-blue-100 bg-blue-50 p-6 text-sm text-blue-900">
        <p className="font-semibold">In this guide</p>
        <ul className="mt-3 space-y-2">
          {tableOfContents.map((item) => (
            <li key={item.id}>
              <a href={`#${item.id}`} className="hover:underline">
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <section className="space-y-5 text-gray-700">
        <p>
          Capital gains planning is most effective when you evaluate a few specific levers: timing, income management, relocation, and loss harvesting. The case studies below show how to quantify each lever using the scenario planner and calculators.
        </p>

        <h2 id="scenario-long-term" className="text-2xl font-semibold text-gray-900">Scenario 1: Wait for long-term qualification</h2>
        <p>
          Alex bought a $200,000 stock position on June 1, 2024 and wants to sell in May 2025. By waiting until June 2, 2025 the gain switches from short-term to long-term, dropping the federal rate from 32% to 15%. The scenario planner shows a $10,400 federal tax reduction even after accounting for market drift assumptions.
        </p>

        <h2 id="scenario-relocation" className="text-2xl font-semibold text-gray-900">Scenario 2: Loss harvesting to fund a relocation</h2>
        <p>
          Priya is selling a rental property in California and moving to Texas. By harvesting $15,000 in stock losses before closing and finalizing the sale after establishing Texas residency, she cuts state taxes to zero and offsets part of the gain federally. Model this by setting Scenario B’s state to TX and entering the planned loss harvest amount.
        </p>

        <h2 id="scenario-options" className="text-2xl font-semibold text-gray-900">Scenario 3: Exercising stock options</h2>
        <p>
          Quinn holds incentive stock options (ISOs) with significant AMT exposure. Exercising in January triggers AMT but qualifies for long-term treatment by the following year. Use Scenario A to capture an exercise-and-sell-same-year strategy, and Scenario B to model exercising this year and selling next year once the ISO holding period is satisfied.
        </p>

        <h2 id="scenario-next-steps" className="text-2xl font-semibold text-gray-900">Applying the playbook</h2>
        <ul className="list-disc space-y-2 pl-6 text-sm">
          <li>Benchmark your current plan in Scenario A with actual dates, sale prices, and state.</li>
          <li>Copy the scenario and tweak one lever at a time—timing, income, or loss harvesting—to isolate the savings.</li>
          <li>Record supporting documents (option agreements, improvement receipts, brokerage statements) alongside each scenario for audit readiness.</li>
        </ul>
        <p>
          Share the exported comparison with your CPA or wealth advisor to coordinate estimated payments or withholding changes before year-end.
        </p>
      </section>

      <FAQSection items={faqItems} />

      <section className="rounded-2xl border border-gray-200 bg-white p-6 text-sm text-gray-600 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900">Model your scenarios next</h2>
        <ul className="mt-3 space-y-2">
          <li>
            <a href="/calculator/scenario-planner" className="text-blue-600 hover:underline">
              Capital gains scenario planner
            </a>
          </li>
          <li>
            <a href="/calculator/capital-gains" className="text-blue-600 hover:underline">
              Capital gains tax calculator
            </a>
          </li>
          <li>
            <a href="/calculator/capital-gains-estimate" className="text-blue-600 hover:underline">
              Capital gains estimate calculator
            </a>
          </li>
        </ul>
      </section>
    </div>
  );
}
