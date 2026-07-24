import type { Metadata } from 'next';
import { buildPageMetadata } from '@/config/seo';
import { SEOHead, StructuredData } from '@/features/seo';
import { Breadcrumbs } from '@/features/layout/components/Breadcrumbs';
import { FAQSection } from '@/features/faq/FAQSection';
import { guidesMetadata } from '@/content/metadata/guides';
import { SourceList } from '@/features/sources/SourceList';

export const metadata: Metadata = buildPageMetadata('blog', {
  title: 'Real estate capital gains guide',
  description:
    'Detailed guidance on primary residence exclusions, basis adjustments, depreciation recapture, and state-level rules for property sales.',
  path: '/guide/real-estate-capital-gains'
});

export default function RealEstateCapitalGainsGuidePage() {
  const meta = guidesMetadata['real-estate-capital-gains'];
  const faqItems = [
    {
      question: 'What is the 2-out-of-5 rule?',
      answer: 'To claim the full $250,000/$500,000 exclusion you must have owned and used the home as your primary residence for at least 24 months during the five-year period ending on the sale date.'
    },
    {
      question: 'How do I document capital improvements?',
      answer: 'Keep invoices, contracts, or bank statements showing permanent upgrades that add value (roof replacement, kitchen remodel). Routine repairs do not increase basis.'
    },
    {
      question: 'What happens if the property was a rental?',
      answer: 'Depreciation claimed while renting is “recaptured” and taxed at rates up to 25%, even if you later convert the property back to your primary residence.'
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
    { id: 'ownership-and-use', label: 'Step 1: Confirm ownership and use' },
    { id: 'adjusted-basis', label: 'Step 2: Build your adjusted basis' },
    { id: 'depreciation-recapture', label: 'Step 3: Estimate depreciation recapture' },
    { id: 'partial-exclusions', label: 'Step 4: Evaluate partial exclusions' },
    { id: 'state-considerations', label: 'State-level considerations' },
    { id: 'real-estate-next-steps', label: 'Next steps' }
  ];

  return (
    <div className="mx-auto max-w-3xl space-y-10 px-4 py-16">
      <SEOHead
        pageKey="blog"
        title="Real estate capital gains guide"
        description="Master the rules around primary residence exclusions, capital improvements, and depreciation recapture before you sell property."
        canonical="/guide/real-estate-capital-gains"
      />
      <StructuredData data={faqSchema} id="real-estate-guide-faq" />

      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Guide', href: '/guide' },
          { label: 'Real estate capital gains guide' }
        ]}
      />

      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">Guide</p>
        <h1 className="text-4xl font-bold text-gray-900">Real estate capital gains guide</h1>
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
              <SourceList sources={meta.sources} />
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
          Selling a home or rental property creates a unique blend of capital gains rules, exclusions, and recapture calculations. Careful record keeping can mean the difference between a six-figure exclusion and a surprise tax bill.
        </p>

        <h2 id="ownership-and-use" className="text-2xl font-semibold text-gray-900">Step 1: Confirm ownership and use</h2>
        <p>
          To claim the primary residence exclusion you must satisfy the 2-out-of-5 test. Track the months you owned the property and the months you actually lived in it. Short absences (vacations, work travel) count as use. Longer rentals reduce the available exclusion.
        </p>

        <h2 id="adjusted-basis" className="text-2xl font-semibold text-gray-900">Step 2: Build your adjusted basis</h2>
        <ul className="list-disc space-y-2 pl-6 text-sm">
          <li>Start with the original purchase price plus buyer-side closing costs.</li>
          <li>Add the cost of capital improvements: additions, new roofing, HVAC upgrades, landscaping projects that add value.</li>
          <li>Subtract any depreciation claimed while the property was rented or used for business purposes.</li>
        </ul>
        <p className="text-sm text-gray-600">IRS references: Publication 523 and Publication 527.</p>

        <h2 id="depreciation-recapture" className="text-2xl font-semibold text-gray-900">Step 3: Estimate depreciation recapture</h2>
        <p>
          Depreciation reduces your basis and triggers “recapture” when you sell. The recaptured portion is taxed at a maximum 25% federal rate and cannot be sheltered by the primary residence exclusion. Include improvement schedules from your tax returns to prove the numbers.
        </p>

        <h2 id="partial-exclusions" className="text-2xl font-semibold text-gray-900">Step 4: Evaluate partial exclusions</h2>
        <p>
          If you fail the 2-out-of-5 test because of a work relocation, health reasons, or other IRS-approved hardships, you may still claim a prorated exclusion. Multiply the full exclusion by the fraction of two years you satisfied the test. Publication 523 outlines qualifying scenarios.
        </p>

        <h2 id="state-considerations" className="text-2xl font-semibold text-gray-900">State-level considerations</h2>
        <ul className="list-disc space-y-2 pl-6 text-sm">
          <li><span className="font-semibold">California:</span> Capital gain generally flows through the state income-tax system, while additional taxes and California-source rules can affect the result.</li>
          <li><span className="font-semibold">New York:</span> State brackets and possible New York City tax mean a single headline state rate is not a full calculation.</li>
          <li><span className="font-semibold">Massachusetts:</span> Income tax and a high-income surtax may apply; verify the current threshold and filing-year instructions.</li>
          <li><span className="font-semibold">Washington:</span> Washington uses a tiered capital gains excise tax for covered long-term gains and provides exclusions and deductions. Confirm the current deduction and asset rules with the Department of Revenue.</li>
        </ul>

        <h2 id="real-estate-next-steps" className="text-2xl font-semibold text-gray-900">Next steps</h2>
        <p>
          Use the real estate capital gains calculator to model your sale with actual improvement receipts and rental history. Record the breakdown for review with a qualified professional. If you are considering multiple sale windows inside 2026, use the scenario planner for a preliminary comparison.
        </p>
      </section>

      <FAQSection items={faqItems} />

      <section className="rounded-2xl border border-gray-200 bg-white p-6 text-sm text-gray-600 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900">Tools for your property sale</h2>
        <ul className="mt-3 space-y-2">
          <li>
            <a href="/calculator/real-estate-capital-gains" className="text-blue-600 hover:underline">
              Real estate capital gains calculator
            </a>
          </li>
          <li>
            <a href="/calculator/scenario-planner" className="text-blue-600 hover:underline">
              Scenario planner
            </a>
          </li>
          <li>
            <a href="/tax-rate" className="text-blue-600 hover:underline">
              2026 capital gains tax assumptions by state
            </a>
          </li>
        </ul>
      </section>
    </div>
  );
}
