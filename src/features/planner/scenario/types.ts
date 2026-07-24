import type { FilingStatus } from '@/features/calculators/core';
import type { CapitalGainsBreakdown } from '@/features/calculators/core/types';

export interface BaseScenarioInput {
  purchasePrice: number;
  purchaseDate: string;
  salePrice: number;
  saleDate: string;
  taxableIncome: number;
  state: string;
  filingStatus: FilingStatus;
}

export interface ScenarioAdjustments {
  label: string;
  saleDateOffsetDays: number;
  salePriceAdjustmentPercent: number;
  taxableIncomeAdjustment: number;
  state?: string;
  additionalLossHarvestUSD: number;
}

export interface ScenarioResult {
  label: string;
  saleDate: string;
  capitalGains: CapitalGainsBreakdown;
  totalTax: number;
}
