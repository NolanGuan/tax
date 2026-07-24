import type { Metadata } from 'next';
import { buildPageMetadata } from '@/config/seo';
import { SEOHead } from '@/features/seo';
import { Breadcrumbs } from '@/features/layout/components/Breadcrumbs';
import {
  CURRENT_TAX_YEAR,
  FEDERAL_RATES,
  STATE_CAPITAL_GAINS_RATES,
  STATE_CAPITAL_GAINS_DATA_SOURCE,
  STATE_CAPITAL_GAINS_DATA_YEAR
} from '@/features/calculators/core';

const PAGE_TITLE = '2026 capital gain tax rate guide';
const PAGE_DESCRIPTION =
  'Reference the 2026 federal long-term capital gains brackets and selected simplified state assumptions used by Gain Tax Calculator.';

export const metadata: Metadata = buildPageMetadata('calculator', {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  path: '/tax-rate'
});

export default function TaxRatesPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-12 px-4 py-16">
      <SEOHead
        pageKey="calculator"
        title={PAGE_TITLE}
        description={PAGE_DESCRIPTION}
        canonical="/tax-rate"
      />

      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Tax rate' }
        ]}
      />

      <header className="space-y-3 text-center">
        <h1 className="text-4xl font-bold text-gray-900">{CURRENT_TAX_YEAR} capital gain tax rate tables</h1>
        <p className="text-gray-600">
          Use these capital gain tax rate references to verify the data that powers Gain Tax Calculator. Always confirm against official IRS and state publications before filing.
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900">Federal long-term capital gains brackets</h2>
        <table className="w-full table-auto overflow-hidden rounded-2xl border border-gray-200 bg-white text-sm shadow-sm">
          <thead className="bg-gray-100 text-left text-gray-700">
            <tr>
              <th className="px-4 py-3">Filing status</th>
              <th className="px-4 py-3">0% up to</th>
              <th className="px-4 py-3">15% up to</th>
              <th className="px-4 py-3">20% over</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(FEDERAL_RATES.longTermCapitalGains).map(([status, brackets]) => {
              const zero = brackets[0];
              const fifteen = brackets[1];
              const twenty = brackets[2];

              return (
                <tr key={status} className="border-t border-gray-100">
                  <td className="px-4 py-3 capitalize text-gray-800">{status.replace(/_/g, ' ')}</td>
                  <td className="px-4 py-3 text-gray-600">${zero.max?.toLocaleString('en-US') ?? '—'}</td>
                  <td className="px-4 py-3 text-gray-600">${fifteen.max?.toLocaleString('en-US') ?? '—'}</td>
                  <td className="px-4 py-3 text-gray-600">${twenty.min.toLocaleString('en-US')}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900">Highlighted state capital gains rates</h2>
        <table className="w-full table-auto overflow-hidden rounded-2xl border border-gray-200 bg-white text-sm shadow-sm">
          <thead className="bg-gray-100 text-left text-gray-700">
            <tr>
              <th className="px-4 py-3">State</th>
              <th className="px-4 py-3">Rate</th>
              <th className="px-4 py-3">Notes</th>
            </tr>
          </thead>
          <tbody>
            {STATE_CAPITAL_GAINS_RATES.map((entry) => (
              <tr key={entry.state} className="border-t border-gray-100">
                <td className="px-4 py-3 font-medium text-gray-800">
                  {entry.sourceUrl ? (
                    <a className="text-blue-600 hover:text-blue-700" href={entry.sourceUrl} target="_blank" rel="noreferrer">
                      {entry.state}
                    </a>
                  ) : entry.state}
                </td>
                <td className="px-4 py-3 text-gray-600">{(entry.rate * 100).toFixed(2)}%</td>
                <td className="px-4 py-3 text-gray-500">{entry.notes ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-xs text-gray-500">
          Federal source:{' '}
          <a className="text-blue-600 hover:text-blue-700" href={FEDERAL_RATES.dataSourceUrl} target="_blank" rel="noreferrer">
            {FEDERAL_RATES.dataSource}
          </a>
          . State assumptions: {STATE_CAPITAL_GAINS_DATA_SOURCE} (data year {STATE_CAPITAL_GAINS_DATA_YEAR}).
        </p>
        <p className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          State results are rough estimates using a selected headline rate applied to net gain. They do not model
          brackets, deductions, local taxes, residency allocation, exemptions, surcharges, or every asset-specific
          rule. NIIT, depreciation recapture rates, and alternative minimum tax are not included in the core federal
          estimate. Verify your facts with official agencies or a qualified professional before filing.
        </p>
      </section>
    </div>
  );
}
