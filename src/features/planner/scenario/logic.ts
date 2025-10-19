import { calculateCapitalGains } from '@/features/calculators/core';
import type { BaseScenarioInput, ScenarioAdjustments, ScenarioResult } from './types';

function addDays(date: string, offsetDays: number): string {
  const base = Date.parse(date);
  if (Number.isNaN(base)) {
    return date;
  }
  const adjusted = base + offsetDays * 24 * 60 * 60 * 1000;
  return new Date(adjusted).toISOString().slice(0, 10);
}

function percentAdjust(value: number, percent: number): number {
  return value * (1 + percent / 100);
}

export function evaluateScenario(base: BaseScenarioInput, adjustments: ScenarioAdjustments): ScenarioResult {
  const adjustedSaleDate = addDays(base.saleDate, adjustments.saleDateOffsetDays);
  const adjustedSalePrice = Math.max(0, percentAdjust(base.salePrice, adjustments.salePriceAdjustmentPercent));
  const adjustedState = adjustments.state ?? base.state;
  const adjustedIncome = Math.max(0, base.taxableIncome + adjustments.taxableIncomeAdjustment);
  const additionalLoss = Math.max(0, adjustments.additionalLossHarvestUSD);

  const transactions = [
    {
      id: `${adjustments.label}-primary-sale`,
      label: `${adjustments.label} primary sale`,
      purchasePrice: base.purchasePrice,
      salePrice: adjustedSalePrice,
      purchaseDate: base.purchaseDate,
      saleDate: adjustedSaleDate
    }
  ];

  if (additionalLoss > 0) {
    transactions.push({
      id: `${adjustments.label}-loss-harvest`,
      label: `${adjustments.label} loss harvest`,
      purchasePrice: additionalLoss,
      salePrice: 0,
      purchaseDate: adjustedSaleDate,
      saleDate: adjustedSaleDate
    });
  }

  const capitalGains = calculateCapitalGains({
    taxYear: new Date(adjustedSaleDate).getFullYear(),
    filingStatus: base.filingStatus,
    taxableIncome: adjustedIncome,
    state: adjustedState,
    transactions
  });

  return {
    label: adjustments.label,
    capitalGains,
    totalTax: capitalGains.totalTax
  };
}
