import type { Metadata } from 'next';
import { buildPageMetadata } from '@/config/seo';
import { SEOHead, StructuredData } from '@/features/seo';
import { Breadcrumbs } from '@/features/layout/components/Breadcrumbs';
import { FAQSection } from '@/features/faq/FAQSection';
import { guidesMetadata } from '@/content/metadata/guides';
import { EditorialMetadata } from '@/features/trust';

export const metadata: Metadata = buildPageMetadata('blog', {
  title: 'Capital gains tax basics',
  description:
    'Foundational guide explaining capital gains calculations, short-term and long-term treatment, and key 2026 federal thresholds.',
  path: '/guide/capital-gains-tax-basics'
});

export default function CapitalGainsTaxBasicsGuidePage() {
  const meta = guidesMetadata['capital-gains-tax-basics'];
  const faqItems = [
    {
      question: 'When do long-term capital gains rates apply?',
      answer: 'You must hold the asset for more than one year. The clock starts the day after acquisition and includes the sale date.'
    },
    {
      question: 'Do I owe tax if I reinvest the proceeds immediately?',
      answer: 'Yes. Selling or swapping an asset triggers tax even if you reinvest the proceeds into another investment right away.'
    },
    {
      question: 'What if my capital losses exceed my gains?',
      answer: 'You can offset gains dollar for dollar. After that you may deduct up to $3,000 of net capital losses against ordinary income each year and carry the remainder forward.'
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
    { id: 'taxable-events', label: 'What counts as a taxable event?' },
    { id: 'holding-periods', label: 'Short-term vs. long-term holding periods' },
    { id: 'cost-basis', label: 'How cost basis works' },
    { id: 'thresholds-2026', label: 'Key 2026 thresholds' },
    { id: 'next-steps', label: 'Putting the rules to work' }
  ];

  return (
    <div className="mx-auto max-w-3xl space-y-10 px-4 py-16">
      <SEOHead
        pageKey="blog"
        title="Capital gains tax basics"
        description="Understand how capital gains are calculated, when long-term rates apply, and which events trigger taxes."
        canonical="/guide/capital-gains-tax-basics"
      />
      <StructuredData data={faqSchema} id="capital-gains-basics-faq" />

      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Guide', href: '/guide' },
          { label: 'Capital gains tax basics' }
        ]}
      />

      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">Guide</p>
        <h1 className="text-4xl font-bold text-gray-900">Capital gains tax basics</h1>
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
          Capital gains tax applies when you dispose of a capital asset for more than its adjusted basis. Stocks, real estate, crypto, NFTs, business interests, and even collectibles fall under the rules. How long you held the asset determines whether the gain is short-term (taxed like ordinary income) or long-term (taxed at the preferential 0%, 15%, or 20% brackets).
        </p>

        <h2 id="taxable-events" className="text-2xl font-semibold text-gray-900">What counts as a taxable event?</h2>
        <ul className="list-disc space-y-2 pl-6 text-sm">
          <li>Selling an investment for cash or converting one crypto asset into another.</li>
          <li>Spending appreciated property on goods or services (for example, paying with crypto).</li>
          <li>Receiving a distribution from a partnership or trust that includes capital gains.</li>
          <li>Being paid out when a company is acquired or a fund is liquidated.</li>
          <li>Claiming casualty or theft losses in excess of basis (rare, but taxable when insurance is involved).</li>
        </ul>

        <p className="text-sm text-gray-600">
          IRS references: Publication 544 (Sales and Other Dispositions of Assets) and Publication 550 (Investment Income and Expenses).
        </p>

        <h2 id="holding-periods" className="text-2xl font-semibold text-gray-900">Short-term vs. long-term holding periods</h2>
        <p>
          Holding periods begin the day after you acquire the asset and include the day you dispose of it. A sale on or before the one-year anniversary is generally short-term; a later sale generally qualifies for long-term capital gains rates.
        </p>
        <p>
          Example: You buy stock on March 1, 2025. The first day of your holding period is March 2. If you sell on March 1, 2026, you held the stock for 365 days and have a short-term holding period. Selling on March 2, 2026 moves the transaction into long-term treatment.
        </p>

        <h2 id="cost-basis" className="text-2xl font-semibold text-gray-900">How cost basis works</h2>
        <p>
          Your adjusted basis is the original purchase price plus the cost of acquiring the asset (commissions, fees) and any capital improvements. Reductions such as depreciation or casualty losses lower basis. Organizing documentation is crucial because a higher basis reduces your taxable gain.
        </p>
        <ul className="list-disc space-y-2 pl-6 text-sm">
          <li>Brokerage statements provide basis for most stock and ETF transactions.</li>
          <li>For real estate, add settlement costs and qualified renovations. Keep receipts.</li>
          <li>Crypto basis tracking depends on exchange exports and wallet records. This site calculator uses FIFO, but tax-return method and identification requirements must be verified separately.</li>
        </ul>

        <h2 id="thresholds-2026" className="text-2xl font-semibold text-gray-900">Key 2026 thresholds</h2>
        <p>The 2026 long-term brackets published in IRS Revenue Procedure 2025-32 are:</p>
        <ul className="list-disc space-y-2 pl-6 text-sm">
          <li>0% rate up to $49,450 (single), $98,900 (married filing jointly).</li>
          <li>15% rate up to $545,500 (single), $613,700 (married filing jointly).</li>
          <li>20% rate above those thresholds.</li>
        </ul>
        <p>
          Short-term gains stack on top of other taxable income, so the marginal rate depends on the ordinary income brackets. Some taxpayers may also owe the 3.8% Net Investment Income Tax; the site calculator does not estimate NIIT.
        </p>

        <h2 id="next-steps" className="text-2xl font-semibold text-gray-900">Putting the rules to work</h2>
        <p>
          Use the capital gains calculator to price out a sale with your actual basis and sale price. Then open the scenario planner to test what happens if you wait until the gain qualifies for long-term treatment, relocate to a different state, or harvest losses to offset the gain.
        </p>
      </section>

      <FAQSection items={faqItems} />

      <section className="rounded-2xl border border-gray-200 bg-white p-6 text-sm text-gray-600 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900">Apply this guide with our tools</h2>
        <ul className="mt-3 space-y-2">
          <li>
            <a href="/calculator/capital-gains" className="text-blue-600 hover:underline">
              Capital gains tax calculator
            </a>
          </li>
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
        </ul>
      </section>
    </div>
  );
}
