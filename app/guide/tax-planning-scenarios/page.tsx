import type { Metadata } from 'next';
import { buildPageMetadata } from '@/config/seo';
import { SEOHead, StructuredData } from '@/features/seo';
import { Breadcrumbs } from '@/features/layout/components/Breadcrumbs';
import { FAQSection } from '@/features/faq/FAQSection';
import { guidesMetadata } from '@/content/metadata/guides';
import { EditorialMetadata } from '@/features/trust';

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
      answer: 'No. The planner does not calculate Net Investment Income Tax, the additional Medicare tax, or alternative minimum tax. Evaluate those separately.'
    },
    {
      question: 'Where do I capture partial-year residency moves?',
      answer: 'The state selector only compares simplified selected headline rates. It does not determine domicile, source income, or partial-year allocation; confirm those rules separately.'
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

      <EditorialMetadata author={meta.author} reviewer={meta.reviewer} sources={meta.sources} />

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
          Alex bought a stock position on June 1, 2025 and is considering a sale in May 2026. Waiting until June 2, 2026 changes the holding period from short-term to long-term. The actual difference depends on taxable income, sale price, and filing status, so compare both dates and then verify the result.
        </p>

        <h2 id="scenario-relocation" className="text-2xl font-semibold text-gray-900">Scenario 2: Loss harvesting to fund a relocation</h2>
        <p>
          Priya is considering a move from California to Texas and a $15,000 stock loss. The state selector can illustrate the difference between selected headline rates, while the loss field shows a preliminary federal offset. It cannot determine domicile or source income. For example, gain from California real property can remain California-source after a move, so the zero-rate Texas scenario is not proof that California tax disappears.
        </p>

        <h2 id="scenario-options" className="text-2xl font-semibold text-gray-900">Scenario 3: Know when this tool does not fit</h2>
        <p>
          Incentive stock options, employee stock purchase plans, installment sales, and like-kind exchanges require inputs and rules this planner does not have. It does not calculate option exercise income, alternative minimum tax, ISO holding-period tests, or multi-year tax. Use the planner only for a conventional capital-asset sale inside 2026 and evaluate those specialized transactions separately.
        </p>

        <h2 id="scenario-next-steps" className="text-2xl font-semibold text-gray-900">Applying the playbook</h2>
        <ul className="list-disc space-y-2 pl-6 text-sm">
          <li>Benchmark your current plan in Scenario A with actual dates, sale prices, and state.</li>
          <li>Copy the scenario and tweak one lever at a time—timing, income, or loss harvesting—to isolate the savings.</li>
          <li>Record supporting documents such as improvement receipts and brokerage statements alongside each scenario.</li>
        </ul>
        <p>
          Record the comparison and review it with a qualified tax or financial professional before changing estimated payments or withholding.
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
            <a href="/calculator/capital-gains" className="text-blue-600 hover:underline">
              Capital gains estimate calculator
            </a>
          </li>
        </ul>
      </section>
    </div>
  );
}
