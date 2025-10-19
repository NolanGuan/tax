import type { FilingStatus } from '@/features/calculators/core';

export interface RealEstateTransaction {
  id: string;
  label?: string;
  purchasePrice: number;
  salePrice: number;
  purchaseDate: string;
  saleDate: string;
  capitalImprovements: number;
  sellingExpenses: number;
  depreciationRecaptured: number;
  isPrimaryResidence: boolean;
  ownershipMonthsLastFiveYears: number;
  useMonthsLastFiveYears: number;
}

export interface RealEstateCalculatorInput {
  taxYear: number;
  filingStatus: FilingStatus;
  taxableIncome: number;
  state: string;
  transactions: RealEstateTransaction[];
}

export interface RealEstateCalculatorResult {
  totals: {
    longTermGain: number;
    shortTermGain: number;
    depreciationRecapture: number;
    exclusionApplied: number;
    netCapitalGain: number;
    federalTax: number;
    stateTax: number;
    totalTax: number;
  };
  transactions: Array<{
    id: string;
    label?: string;
    holdingPeriodDays: number;
    isLongTerm: boolean;
    grossGain: number;
    adjustedBasis: number;
    exclusionUsed: number;
    taxableGain: number;
    depreciationRecapture: number;
  }>;
}

export interface PrimaryResidenceExclusionResult {
  eligible: boolean;
  maxExclusion: number;
  exclusionUsed: number;
}
