import type {
  FederalRatesConfig,
  FilingStatus,
  LongTermCapitalGainsBracket,
  OrdinaryIncomeBracket
} from '../../features/calculators/core/types';

const ordinaryIncomeBrackets: Record<FilingStatus, OrdinaryIncomeBracket[]> = {
  single: [
    { min: 0, max: 12400, rate: 0.1 },
    { min: 12400, max: 50400, rate: 0.12 },
    { min: 50400, max: 105700, rate: 0.22 },
    { min: 105700, max: 201775, rate: 0.24 },
    { min: 201775, max: 256225, rate: 0.32 },
    { min: 256225, max: 640600, rate: 0.35 },
    { min: 640600, rate: 0.37 }
  ],
  married_joint: [
    { min: 0, max: 24800, rate: 0.1 },
    { min: 24800, max: 100800, rate: 0.12 },
    { min: 100800, max: 211400, rate: 0.22 },
    { min: 211400, max: 403550, rate: 0.24 },
    { min: 403550, max: 512450, rate: 0.32 },
    { min: 512450, max: 768700, rate: 0.35 },
    { min: 768700, rate: 0.37 }
  ],
  married_separate: [
    { min: 0, max: 12400, rate: 0.1 },
    { min: 12400, max: 50400, rate: 0.12 },
    { min: 50400, max: 105700, rate: 0.22 },
    { min: 105700, max: 201775, rate: 0.24 },
    { min: 201775, max: 256225, rate: 0.32 },
    { min: 256225, max: 384350, rate: 0.35 },
    { min: 384350, rate: 0.37 }
  ],
  head_of_household: [
    { min: 0, max: 17700, rate: 0.1 },
    { min: 17700, max: 67450, rate: 0.12 },
    { min: 67450, max: 105700, rate: 0.22 },
    { min: 105700, max: 201750, rate: 0.24 },
    { min: 201750, max: 256200, rate: 0.32 },
    { min: 256200, max: 640600, rate: 0.35 },
    { min: 640600, rate: 0.37 }
  ]
};

const longTermCapitalGainsBrackets: Record<FilingStatus, LongTermCapitalGainsBracket[]> = {
  single: [
    { min: 0, max: 49450, rate: 0 },
    { min: 49450, max: 545500, rate: 0.15 },
    { min: 545500, rate: 0.2 }
  ],
  married_joint: [
    { min: 0, max: 98900, rate: 0 },
    { min: 98900, max: 613700, rate: 0.15 },
    { min: 613700, rate: 0.2 }
  ],
  married_separate: [
    { min: 0, max: 49450, rate: 0 },
    { min: 49450, max: 306850, rate: 0.15 },
    { min: 306850, rate: 0.2 }
  ],
  head_of_household: [
    { min: 0, max: 66200, rate: 0 },
    { min: 66200, max: 579600, rate: 0.15 },
    { min: 579600, rate: 0.2 }
  ]
};

export const FEDERAL_CAPITAL_GAINS_RATES_2026: FederalRatesConfig = {
  ordinaryIncome: ordinaryIncomeBrackets,
  longTermCapitalGains: longTermCapitalGainsBrackets,
  dataYear: 2026,
  dataSource: 'IRS Rev. Proc. 2025-32, sections 4.01 and 4.03',
  dataSourceUrl: 'https://www.irs.gov/irb/2025-45_IRB'
};
