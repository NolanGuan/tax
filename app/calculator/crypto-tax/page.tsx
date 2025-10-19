import type { Metadata } from 'next';
import { buildPageMetadata } from '@/config/seo';
import { SEOHead, StructuredData } from '@/features/seo';
import { Breadcrumbs } from '@/features/layout/components/Breadcrumbs';
import { CryptoForm } from '@/features/calculators/crypto/components';
import { FAQSection } from '@/features/faq/FAQSection';
import { siteConfig } from '@/config/site';

const PAGE_TITLE = 'Crypto capital gain tax rate calculator';
const PAGE_DESCRIPTION =
  'Model your crypto capital gain tax rate in minutes. Track swaps, staking rewards, and spending with FIFO lots to separate capital gains from ordinary income before filing.';

export const metadata: Metadata = buildPageMetadata('calculator', {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  path: '/calculator/crypto-tax'
});

const roadmap = [
  'CSV import templates for popular exchanges and wallets',
  'Support for LIFO and specific lot identification cost methods',
  'NFT handling with wash sale alerts and royalty adjustments'
];

export default function CryptoCalculatorPage() {
  const faqItems = [
    {
      question: 'Which transactions count as capital gains events?',
      answer: 'Selling crypto for cash, swapping one token for another, or spending crypto on goods and services all trigger capital gains calculations. The tool treats each of these as a disposal.'
    },
    {
      question: 'How does the calculator handle staking or mining rewards?',
      answer: 'Income events are recorded at their fair market value in USD on the receipt date. That amount is treated as ordinary income and also becomes the cost basis for future disposals.'
    },
    {
      question: 'Can I choose FIFO, LIFO, or specific identification?',
      answer: 'The current release uses FIFO. LIFO and specific lot identification are on the roadmap—you can view upcoming features below and let us know which approach you need first.'
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
    name: 'Crypto capital gain tax rate calculator',
    description:
      'Calculator that separates crypto disposals into capital gains and ordinary income events using FIFO lot tracking to surface your capital gain tax rate.',
    serviceType: 'Cryptocurrency tax calculation',
    provider: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: `https://${siteConfig.domain}`
    },
    url: `https://${siteConfig.domain}/calculator/crypto-tax`
  };

  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-16">
      <SEOHead
        pageKey="calculator"
        title={PAGE_TITLE}
        description={PAGE_DESCRIPTION}
        canonical="/calculator/crypto-tax"
      />
      <StructuredData data={[faqSchema, calculatorSchema]} id="crypto-faq" />

      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Calculator', href: '/calculator' },
          { label: 'Crypto capital gain tax rate calculator' }
        ]}
      />

      <header className="space-y-3 text-center">
        <h1 className="text-4xl font-bold text-gray-900">Crypto capital gain tax rate calculator</h1>
        <p className="text-gray-600">
          Feed in buys, sells, swaps, staking rewards, and spending events to reveal your crypto capital gain tax rate alongside ordinary income projections using a FIFO cost basis.
        </p>
      </header>

      <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
        <CryptoForm />
      </section>

      <section className="rounded-3xl border border-blue-100 bg-blue-50 p-8 text-blue-900">
        <h2 className="text-2xl font-semibold">Upcoming enhancements</h2>
        <ul className="mt-4 space-y-2 text-sm">
          {roadmap.map((item) => (
            <li key={item} className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-blue-500" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <FAQSection items={faqItems} />
    </div>
  );
}
