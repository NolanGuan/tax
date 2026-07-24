import { FEDERAL_CAPITAL_GAINS_RATES_2026 } from '../../../config/tax-rates/federal-2026';
import {
  STATE_CAPITAL_GAINS_DATA_SOURCE,
  STATE_CAPITAL_GAINS_DATA_YEAR,
  STATE_CAPITAL_GAINS_RATES_2026
} from '../../../config/tax-rates/state-2026';

export const CURRENT_TAX_YEAR = 2026;
export const FEDERAL_RATES = FEDERAL_CAPITAL_GAINS_RATES_2026;
export {
  STATE_CAPITAL_GAINS_RATES_2026 as STATE_CAPITAL_GAINS_RATES,
  STATE_CAPITAL_GAINS_DATA_SOURCE,
  STATE_CAPITAL_GAINS_DATA_YEAR
};

export function findStateRate(stateCode: string): number {
  const normalized = stateCode.trim().toUpperCase();
  const entry = STATE_CAPITAL_GAINS_RATES_2026.find((item) => item.state === normalized);
  return entry?.rate ?? 0;
}
