import { describe, expect, it } from 'vitest';
import { evaluateScenario } from '@/features/planner/scenario/logic';

const baseInput = {
  purchasePrice: 250000,
  purchaseDate: '2020-01-15',
  salePrice: 420000,
  saleDate: '2026-11-01',
  taxableIncome: 110000,
  state: 'CA',
  filingStatus: 'married_joint' as const
};

describe('evaluateScenario', () => {
  it('shifts sale date and price adjustments', () => {
    const result = evaluateScenario(baseInput, {
      label: 'Scenario A',
      saleDateOffsetDays: 30,
      salePriceAdjustmentPercent: 5,
      taxableIncomeAdjustment: 0,
      state: undefined,
      additionalLossHarvestUSD: 0
    });

    expect(result.capitalGains.netCapitalGain).toBeGreaterThan(0);
    expect(result.saleDate).toBe('2026-12-01');
  });

  it('applies loss harvesting as an additional transaction', () => {
    const withLoss = evaluateScenario(baseInput, {
      label: 'Scenario B',
      saleDateOffsetDays: 0,
      salePriceAdjustmentPercent: 0,
      taxableIncomeAdjustment: 0,
      state: undefined,
      additionalLossHarvestUSD: 10000
    });

    const withoutLoss = evaluateScenario(baseInput, {
      label: 'Scenario C',
      saleDateOffsetDays: 0,
      salePriceAdjustmentPercent: 0,
      taxableIncomeAdjustment: 0,
      state: undefined,
      additionalLossHarvestUSD: 0
    });

    expect(withLoss.capitalGains.netCapitalGain).toBeLessThan(withoutLoss.capitalGains.netCapitalGain);
  });

  it('caps adjusted dates to the supported tax year', () => {
    const result = evaluateScenario(
      { ...baseInput, saleDate: '2026-12-20' },
      {
        label: 'Year boundary',
        saleDateOffsetDays: 60,
        salePriceAdjustmentPercent: 0,
        taxableIncomeAdjustment: 0,
        state: undefined,
        additionalLossHarvestUSD: 0
      }
    );

    expect(result.saleDate).toBe('2026-12-31');
  });
});
