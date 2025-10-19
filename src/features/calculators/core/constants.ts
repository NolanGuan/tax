import { FEDERAL_CAPITAL_GAINS_RATES_2025 } from '../../../config/tax-rates/federal-2025';
import {
  STATE_CAPITAL_GAINS_DATA_SOURCE,
  STATE_CAPITAL_GAINS_RATES_2025
} from '../../../config/tax-rates/state-2025';

export const FEDERAL_RATES_2025 = FEDERAL_CAPITAL_GAINS_RATES_2025;
export { STATE_CAPITAL_GAINS_RATES_2025, STATE_CAPITAL_GAINS_DATA_SOURCE };

export function findStateRate(stateCode: string): number {
  const normalized = stateCode.trim().toUpperCase();
  const entry = STATE_CAPITAL_GAINS_RATES_2025.find((item) => item.state === normalized);
  return entry?.rate ?? 0;
}
