export type FilingStatus =
  | 'single'
  | 'married_joint'
  | 'married_separate'
  | 'head_of_household';

export interface CapitalGainsTransaction {
  id: string;
  label?: string;
  purchasePrice: number;
  salePrice: number;
  purchaseDate: string; // ISO 8601
  saleDate: string; // ISO 8601
}

export interface CapitalGainsInput {
  taxYear: number;
  filingStatus: FilingStatus;
  taxableIncome: number;
  state: string;
  transactions: CapitalGainsTransaction[];
}

export interface CapitalGainsBreakdown {
  shortTermGain: number;
  longTermGain: number;
  netCapitalGain: number;
  federalTax: number;
  stateTax: number;
  totalTax: number;
  effectiveRate: number;
  details: {
    longTermRate: number;
    shortTermMarginalRate: number;
    stateRate: number;
  };
}

export interface OrdinaryIncomeBracket {
  min: number;
  max?: number;
  rate: number;
}

export interface LongTermCapitalGainsBracket {
  min: number;
  max?: number;
  rate: number;
}

export interface FederalRatesConfig {
  ordinaryIncome: Record<FilingStatus, OrdinaryIncomeBracket[]>;
  longTermCapitalGains: Record<FilingStatus, LongTermCapitalGainsBracket[]>;
  dataYear: number;
  dataSource: string;
}

export interface StateCapitalGainsRate {
  state: string;
  rate: number;
  notes?: string;
}
