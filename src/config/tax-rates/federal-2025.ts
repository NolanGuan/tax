import type {
  FederalRatesConfig,
  FilingStatus,
  LongTermCapitalGainsBracket,
  OrdinaryIncomeBracket
} from '../../features/calculators/core/types';

const ordinaryIncomeBrackets: Record<FilingStatus, OrdinaryIncomeBracket[]> = {
  single: [
    { min: 0, max: 11600, rate: 0.1 },
    { min: 11600, max: 47150, rate: 0.12 },
    { min: 47150, max: 100525, rate: 0.22 },
    { min: 100525, max: 191950, rate: 0.24 },
    { min: 191950, max: 243725, rate: 0.32 },
    { min: 243725, max: 609350, rate: 0.35 },
    { min: 609350, rate: 0.37 }
  ],
  married_joint: [
    { min: 0, max: 23200, rate: 0.1 },
    { min: 23200, max: 94300, rate: 0.12 },
    { min: 94300, max: 201050, rate: 0.22 },
    { min: 201050, max: 383900, rate: 0.24 },
    { min: 383900, max: 487450, rate: 0.32 },
    { min: 487450, max: 731200, rate: 0.35 },
    { min: 731200, rate: 0.37 }
  ],
  married_separate: [
    { min: 0, max: 11600, rate: 0.1 },
    { min: 11600, max: 47150, rate: 0.12 },
    { min: 47150, max: 100525, rate: 0.22 },
    { min: 100525, max: 191950, rate: 0.24 },
    { min: 191950, max: 243725, rate: 0.32 },
    { min: 243725, max: 365600, rate: 0.35 },
    { min: 365600, rate: 0.37 }
  ],
  head_of_household: [
    { min: 0, max: 16550, rate: 0.1 },
    { min: 16550, max: 63100, rate: 0.12 },
    { min: 63100, max: 100500, rate: 0.22 },
    { min: 100500, max: 191950, rate: 0.24 },
    { min: 191950, max: 243700, rate: 0.32 },
    { min: 243700, max: 609350, rate: 0.35 },
    { min: 609350, rate: 0.37 }
  ]
};

const longTermCapitalGainsBrackets: Record<FilingStatus, LongTermCapitalGainsBracket[]> = {
  single: [
    { min: 0, max: 47025, rate: 0 },
    { min: 47025, max: 518900, rate: 0.15 },
    { min: 518900, rate: 0.2 }
  ],
  married_joint: [
    { min: 0, max: 94050, rate: 0 },
    { min: 94050, max: 583750, rate: 0.15 },
    { min: 583750, rate: 0.2 }
  ],
  married_separate: [
    { min: 0, max: 47025, rate: 0 },
    { min: 47025, max: 291850, rate: 0.15 },
    { min: 291850, rate: 0.2 }
  ],
  head_of_household: [
    { min: 0, max: 63000, rate: 0 },
    { min: 63000, max: 551350, rate: 0.15 },
    { min: 551350, rate: 0.2 }
  ]
};

export const FEDERAL_CAPITAL_GAINS_RATES_2025: FederalRatesConfig = {
  ordinaryIncome: ordinaryIncomeBrackets,
  longTermCapitalGains: longTermCapitalGainsBrackets,
  dataYear: 2025,
  dataSource: 'IRS Publication 17 (2025 projections); Rev. Proc. 2024-23 for inflation adjustments'
};
