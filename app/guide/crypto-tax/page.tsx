import type { Metadata } from 'next';
import { buildPageMetadata } from '@/config/seo';
import { SEOHead, StructuredData } from '@/features/seo';
import { Breadcrumbs } from '@/features/layout/components/Breadcrumbs';
import { FAQSection } from '@/features/faq/FAQSection';
import { guidesMetadata } from '@/content/metadata/guides';
import { EditorialMetadata } from '@/features/trust';

export const metadata: Metadata = buildPageMetadata('blog', {
  title: 'Crypto tax guide',
  description:
    'Learn how the IRS treats crypto trades, swaps, staking rewards, airdrops, and record keeping requirements.',
  path: '/guide/crypto-tax'
});

export default function CryptoTaxGuidePage() {
  const meta = guidesMetadata['crypto-tax'];
  const faqItems = [
    {
      question: 'Do crypto-to-crypto trades trigger tax?',
      answer: 'Yes. Swapping one token for another is treated as selling the first token at fair market value and buying the second at that same value.'
    },
    {
      question: 'How are staking or airdrop rewards taxed?',
      answer: 'You include the USD value of the reward as ordinary income at the time you gain dominion and control. That amount also becomes the basis for future disposals.'
    },
    {
      question: 'What records should I keep?',
      answer: 'Maintain a ledger of dates, quantities, wallet/exchange IDs, USD values, and fees for every transaction. Download CSV exports each tax year before exchanges rotate history.'
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
    { id: 'crypto-categories', label: 'Transaction categories' },
    { id: 'crypto-cost-basis', label: 'Cost basis and lot selection' },
    { id: 'crypto-reporting', label: 'Reporting' },
    { id: 'crypto-records', label: 'Keeping clean records' },
    { id: 'crypto-next-steps', label: 'Use the calculator to plan ahead' }
  ];

  return (
    <div className="mx-auto max-w-3xl space-y-10 px-4 py-16">
      <SEOHead
        pageKey="blog"
        title="Crypto tax guide"
        description="Learn how cryptocurrency transactions are taxed, how to track basis, and how to prepare records for 2026 reporting."
        canonical="/guide/crypto-tax"
      />
      <StructuredData data={faqSchema} id="crypto-guide-faq" />

      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Guide', href: '/guide' },
          { label: 'Crypto tax guide' }
        ]}
      />

      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">Guide</p>
        <h1 className="text-4xl font-bold text-gray-900">Crypto tax essentials</h1>
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
          The IRS classifies cryptocurrency as property, so every disposal is a taxable event. Depending on how you earn or spend tokens, you may owe both ordinary income tax and capital gains tax.
        </p>

        <h2 id="crypto-categories" className="text-2xl font-semibold text-gray-900">Transaction categories</h2>
        <ul className="list-disc space-y-2 pl-6 text-sm">
          <li><span className="font-semibold">Buys:</span> Paying fiat currency for crypto establishes cost basis.</li>
          <li><span className="font-semibold">Sells, trades, spending:</span> Trigger capital gains or losses using the difference between proceeds and cost basis.</li>
          <li><span className="font-semibold">Income events:</span> Mining, staking, airdrops, or receiving crypto as payment create ordinary income based on USD value at receipt.</li>
          <li><span className="font-semibold">Forks:</span> Hard fork tokens usually carry zero basis and the USD value becomes ordinary income once you control the new asset.</li>
        </ul>

        <h2 id="crypto-cost-basis" className="text-2xl font-semibold text-gray-900">Cost basis and lot selection</h2>
        <p>
          This site calculator uses FIFO lots. Tax-return basis rules and specific-identification requirements depend on current IRS guidance and your records, so do not assume the calculator’s FIFO result is the only permitted or required result.
        </p>

        <h2 id="crypto-reporting" className="text-2xl font-semibold text-gray-900">Reporting</h2>
        <p>
          Use Form 8949 and Schedule D for capital gains. The reporting location for staking, mining, or payment income depends on the facts. Review current Form 1099-DA instructions and reconcile any broker forms with your wallet and exchange records.</p>

        <p className="text-sm text-gray-600">IRS references: Notice 2014-21, Revenue Ruling 2019-24, and draft Instructions for Form 1099-DA.</p>

        <h2 id="crypto-records" className="text-2xl font-semibold text-gray-900">Keeping clean records</h2>
        <ul className="list-disc space-y-2 pl-6 text-sm">
          <li>Export CSV files from every exchange quarterly.</li>
          <li>Tag transfers between your own wallets to avoid double counting.</li>
          <li>Note network fees—they increase basis for buys and reduce proceeds for disposals.</li>
        </ul>

        <h2 id="crypto-next-steps" className="text-2xl font-semibold text-gray-900">Use the calculator to plan ahead</h2>
        <p>
          Enter representative records in the crypto calculator to create a preliminary 2026 estimate. Record the displayed disposal breakdown and reconcile it with complete exchange and wallet history before review by a qualified professional.
        </p>
      </section>

      <FAQSection items={faqItems} />

      <section className="rounded-2xl border border-gray-200 bg-white p-6 text-sm text-gray-600 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900">Take action with these tools</h2>
        <ul className="mt-3 space-y-2">
          <li>
            <a href="/calculator/crypto-tax" className="text-blue-600 hover:underline">
              Crypto tax calculator
            </a>
          </li>
          <li>
            <a href="/calculator/capital-gains" className="text-blue-600 hover:underline">
              Capital gains tax calculator
            </a>
          </li>
          <li>
            <a href="/guide/tax-planning-scenarios" className="text-blue-600 hover:underline">
              Capital gains scenario playbook
            </a>
          </li>
        </ul>
      </section>
    </div>
  );
}
