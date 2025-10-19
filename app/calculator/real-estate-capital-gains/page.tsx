import type { Metadata } from 'next';
import { buildPageMetadata } from '@/config/seo';
import { SEOHead, StructuredData } from '@/features/seo';
import { Breadcrumbs } from '@/features/layout/components/Breadcrumbs';
import { RealEstateForm } from '@/features/calculators/real-estate/components';
import { FAQSection } from '@/features/faq/FAQSection';
import { siteConfig } from '@/config/site';

const PAGE_TITLE = 'Real estate capital gains calculator';
const PAGE_DESCRIPTION =
  'Use the Real Estate Capital Gains Calculator to model federal and state taxes, primary residence exclusions, capital improvements, and depreciation recapture before you sell.';

export const metadata: Metadata = buildPageMetadata('calculator', {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  path: '/calculator/real-estate-capital-gains'
});

const highlights = [
  'Automatically checks the 2-out-of-5 ownership and use tests for primary residences',
  'Separates capital improvements from basis adjustments and selling expenses',
  'Estimates depreciation recapture that cannot be offset by the primary home exclusion',
  'Supports multiple properties and summarises total federal and state tax impact'
];

export default function RealEstateCalculatorPage() {
  const faqItems = [
    {
      question: 'Can the primary residence exclusion offset depreciation recapture?',
      answer: 'No. Any depreciation claimed while the property was rented is recaptured and taxed, even if you otherwise qualify for the $250,000 or $500,000 exclusion.'
    },
    {
      question: 'How do capital improvements affect my basis?',
      answer: 'Enter documented renovation costs under capital improvements. They are added to your original purchase price to increase basis and reduce taxable gain.'
    },
    {
      question: 'What if I owned the home for less than two years?',
      answer: 'The calculator will flag that you do not meet the 2-out-of-5 ownership or use test. You may qualify for a partial exclusion due to relocation or hardship—consult IRS Publication 523 for exceptions.'
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
    name: 'Real estate capital gains calculator',
    description:
      'Calculator that evaluates real estate sales, including the primary residence exclusion, capital improvements, and depreciation recapture.',
    serviceType: 'Real estate capital gains analysis',
    provider: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: `https://${siteConfig.domain}`
    },
    url: `https://${siteConfig.domain}/calculator/real-estate-capital-gains`
  };

  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-16">
      <SEOHead
        pageKey="calculator"
        title={PAGE_TITLE}
        description={PAGE_DESCRIPTION}
        canonical="/calculator/real-estate-capital-gains"
      />
      <StructuredData data={[faqSchema, calculatorSchema]} id="real-estate-faq" />

      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Calculator', href: '/calculator' },
          { label: 'Real estate capital gains calculator' }
        ]}
      />

      <header className="space-y-3 text-center">
        <h1 className="text-4xl font-bold text-gray-900">Real estate capital gains calculator</h1>
        <p className="text-gray-600">
          Capture every adjustment before you list or close. Model the primary residence exclusion, capital improvements, selling expenses, and depreciation recapture in one workflow.
        </p>
      </header>

      <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
        <RealEstateForm />
      </section>

      <section className="rounded-3xl border border-blue-100 bg-blue-50 p-8 text-blue-900">
        <h2 className="text-2xl font-semibold">What makes this calculator different</h2>
        <ul className="mt-4 space-y-2 text-sm">
          {highlights.map((item) => (
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
