import type { StateCapitalGainsRate } from '../../features/calculators/core/types';

export const STATE_CAPITAL_GAINS_RATES_2026: StateCapitalGainsRate[] = [
  { state: 'AL', rate: 0.05, notes: 'Simplified top individual income-tax rate.' },
  { state: 'AK', rate: 0, notes: 'No individual state income tax.' },
  {
    state: 'AZ',
    rate: 0.025,
    notes: 'Flat individual income-tax rate.',
    sourceUrl: 'https://azdor.gov/individuals/withholding-calculations'
  },
  { state: 'CA', rate: 0.133, notes: 'Top marginal rate including the 1% Mental Health Services Tax; lower brackets usually apply.' },
  { state: 'CO', rate: 0.044, notes: 'Simplified flat individual income-tax rate.' },
  { state: 'CT', rate: 0.0699, notes: 'Top marginal individual income-tax rate.' },
  { state: 'DC', rate: 0.1075, notes: 'Top marginal individual income-tax rate.' },
  {
    state: 'FL',
    rate: 0,
    notes: 'No individual state income tax.',
    sourceUrl: 'https://floridarevenue.com/faq/Pages/FAQDetails.aspx?FAQID=1466'
  },
  {
    state: 'GA',
    rate: 0.0499,
    notes: 'Flat individual income-tax rate for tax year 2026.',
    sourceUrl: 'https://dor.georgia.gov/taxes/important-tax-updates'
  },
  { state: 'IL', rate: 0.0495, notes: 'Flat individual income-tax rate.' },
  { state: 'MA', rate: 0.05, notes: 'Base rate only; a separate 4% surtax can apply above the indexed threshold.' },
  { state: 'MD', rate: 0.0625, notes: 'Top state rate; county income tax is not included.' },
  {
    state: 'NC',
    rate: 0.0399,
    notes: 'Flat individual income-tax rate for tax year 2026.',
    sourceUrl: 'https://www.ncdor.gov/taxes-forms/individual-income-tax/tax-rate-schedules'
  },
  { state: 'NJ', rate: 0.1075, notes: 'Top marginal gross-income-tax rate.' },
  {
    state: 'NY',
    rate: 0.109,
    notes: 'Top marginal state rate; New York City and Yonkers taxes are not included.',
    sourceUrl: 'https://www.tax.ny.gov/data/stats/ter/fiscal-year27/personal-income-tax.htm'
  },
  {
    state: 'OH',
    rate: 0.0275,
    notes: 'Rate on nonbusiness taxable income above the state threshold; local taxes are not included.',
    sourceUrl: 'https://codes.ohio.gov/ohio-revised-code/section-5747.02'
  },
  { state: 'OR', rate: 0.099, notes: 'Top marginal individual income-tax rate.' },
  { state: 'PA', rate: 0.0307, notes: 'Flat individual income-tax rate.' },
  {
    state: 'TX',
    rate: 0,
    notes: 'No individual state income tax.',
    sourceUrl: 'https://comptroller.texas.gov/economy/fiscal-notes/industry/2025/small-biz-info/'
  },
  {
    state: 'WA',
    rate: 0.07,
    notes: 'Simplified first-tier rate for taxable Washington long-term gains; a 9.9% tier applies above $1M after exclusions.',
    sourceUrl: 'https://dor.wa.gov/forms-publications/publications-subject/special-notices/new-tiered-rates-washingtons-capital-gains-tax'
  }
];

export const STATE_CAPITAL_GAINS_DATA_YEAR = 2026;
export const STATE_CAPITAL_GAINS_DATA_SOURCE =
  'Selected official state revenue/tax authorities, reviewed July 2026. Rates are simplified estimates, not complete state returns.';
