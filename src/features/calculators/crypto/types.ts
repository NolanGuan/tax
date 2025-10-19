import type { FilingStatus } from '@/features/calculators/core';
import type { CapitalGainsBreakdown } from '@/features/calculators/core/types';

export type CryptoTransactionType =
  | 'buy'
  | 'sell'
  | 'trade'
  | 'spend'
  | 'income';

export interface CryptoTransaction {
  id: string;
  asset: string;
  type: CryptoTransactionType;
  date: string;
  quantity: number;
  proceedsUSD?: number; // disposals (sell/trade/spend)
  costUSD?: number; // buy cost basis (total)
  fairMarketValueUSD?: number; // income FMV
  notes?: string;
}

export interface CryptoCalculatorInput {
  taxYear: number;
  filingStatus: FilingStatus;
  taxableIncome: number;
  state: string;
  transactions: CryptoTransaction[];
}

export interface CryptoDisposalDetail {
  id: string;
  asset: string;
  lotId: string;
  quantity: number;
  costBasisUSD: number;
  proceedsUSD: number;
  gainUSD: number;
  holdingPeriodDays: number;
  isLongTerm: boolean;
  transactionType: CryptoTransactionType;
}

export interface CryptoCalculatorResult {
  capitalGains: CapitalGainsBreakdown;
  ordinaryIncomeUSD: number;
  ordinaryIncomeFederalTax: number;
  ordinaryIncomeStateTax: number;
  totalEstimatedTax: number;
  disposals: CryptoDisposalDetail[];
  warnings: string[];
}
