import type { StateCapitalGainsRate } from '../../features/calculators/core/types';

export const STATE_CAPITAL_GAINS_RATES_2025: StateCapitalGainsRate[] = [
  { state: 'AL', rate: 0.05, notes: 'Aligned with state income tax rate.' },
  { state: 'AZ', rate: 0.0454 },
  { state: 'CA', rate: 0.133, notes: 'Top marginal rate; no preferential treatment for capital gains.' },
  { state: 'CO', rate: 0.044 },
  { state: 'CT', rate: 0.0699 },
  { state: 'DC', rate: 0.1075, notes: 'Top marginal rate for high-income filers.' },
  { state: 'FL', rate: 0 },
  { state: 'GA', rate: 0.0575 },
  { state: 'IL', rate: 0.0495 },
  { state: 'MA', rate: 0.05, notes: '4% surtax applies to taxable income over $1M.' },
  { state: 'MD', rate: 0.0575 },
  { state: 'NC', rate: 0.0475 },
  { state: 'NJ', rate: 0.1075, notes: 'Regular gross income tax rates apply.' },
  { state: 'NY', rate: 0.0882 },
  { state: 'OH', rate: 0.03675 },
  { state: 'OR', rate: 0.099 },
  { state: 'PA', rate: 0.0307 },
  { state: 'TX', rate: 0 },
  { state: 'WA', rate: 0.07, notes: 'Applies to certain long-term capital gains over $250,000; exemptions exist.' }
];

export const STATE_CAPITAL_GAINS_DATA_SOURCE = 'State Departments of Revenue (accessed Feb 2025); Washington ESSB 5096 guidance.';
