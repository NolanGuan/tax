import type { Metadata } from 'next';
import { buildPageMetadata } from '@/config/seo';
import { SEOHead } from '@/features/seo';
import { Breadcrumbs } from '@/features/layout/components/Breadcrumbs';
import { QuickEstimateForm } from '@/features/calculators/quick-start';

const PAGE_TITLE = 'Capital gains estimate calculator';
const PAGE_DESCRIPTION =
  'Run a capital gains estimate in minutes by entering one purchase and sale. See federal, state, and NIIT impact before you commit to the transaction.';

export const metadata: Metadata = buildPageMetadata('calculator', {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  path: '/calculator/capital-gains-estimate'
});

export default function QuickEstimatePage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-16">
      <SEOHead
        pageKey="calculator"
        title={PAGE_TITLE}
        description={PAGE_DESCRIPTION}
        canonical="/calculator/capital-gains-estimate"
      />

      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Calculator', href: '/calculator' },
          { label: 'Capital gains estimate calculator' }
        ]}
      />

      <header className="space-y-3 text-center">
        <h1 className="text-4xl font-bold text-gray-900">Capital gains estimate calculator</h1>
        <p className="text-gray-600">
          Enter a purchase price, sale price, key dates, and your filing profile to calculate a capital gains estimate that highlights short-term vs. long-term treatment, state tax impact, and NIIT exposure.
        </p>
      </header>

      <QuickEstimateForm />
    </div>
  );
}
