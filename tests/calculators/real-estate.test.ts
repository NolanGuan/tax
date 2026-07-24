import { describe, expect, it } from 'vitest';
import { calculateRealEstateCapitalGains } from '@/features/calculators/real-estate';

const baseInput = {
  taxYear: 2026,
  filingStatus: 'married_joint' as const,
  taxableIncome: 125000,
  state: 'CA'
};

describe('calculateRealEstateCapitalGains', () => {
  it('applies the primary residence exclusion when requirements are met', () => {
    const result = calculateRealEstateCapitalGains({
      ...baseInput,
      transactions: [
        {
          id: 'home',
          label: 'Primary residence',
          purchasePrice: 300000,
          salePrice: 600000,
          purchaseDate: '2018-01-01',
          saleDate: '2026-02-01',
          capitalImprovements: 20000,
          sellingExpenses: 15000,
          depreciationRecaptured: 0,
          isPrimaryResidence: true,
          ownershipMonthsLastFiveYears: 48,
          useMonthsLastFiveYears: 48
        }
      ]
    });

    expect(result.transactions[0].exclusionUsed).toBeGreaterThan(0);
    expect(result.totals.exclusionApplied).toBeGreaterThan(0);
  });

  it('does not apply exclusion when residence tests fail', () => {
    const result = calculateRealEstateCapitalGains({
      ...baseInput,
      transactions: [
        {
          id: 'home',
          label: 'Recent move',
          purchasePrice: 400000,
          salePrice: 520000,
          purchaseDate: '2024-01-01',
          saleDate: '2026-01-10',
          capitalImprovements: 10000,
          sellingExpenses: 12000,
          depreciationRecaptured: 0,
          isPrimaryResidence: true,
          ownershipMonthsLastFiveYears: 10,
          useMonthsLastFiveYears: 10
        }
      ]
    });

    expect(result.transactions[0].exclusionUsed).toBe(0);
  });

  it('tracks depreciation recapture separately from exclusions', () => {
    const result = calculateRealEstateCapitalGains({
      ...baseInput,
      filingStatus: 'single',
      transactions: [
        {
          id: 'rental',
          label: 'Converted rental',
          purchasePrice: 200000,
          salePrice: 350000,
          purchaseDate: '2015-01-01',
          saleDate: '2026-01-10',
          capitalImprovements: 15000,
          sellingExpenses: 10000,
          depreciationRecaptured: 40000,
          isPrimaryResidence: true,
          ownershipMonthsLastFiveYears: 30,
          useMonthsLastFiveYears: 28
        }
      ]
    });

    expect(result.transactions[0].depreciationRecapture).toBeGreaterThan(0);
    expect(result.transactions[0].exclusionUsed).toBeLessThanOrEqual(250000);
    expect(result.totals.federalTax).toBeGreaterThanOrEqual(
      result.transactions[0].depreciationRecapture * 0.25
    );
  });

  it('removes the primary residence exclusion before calculating tax', () => {
    const result = calculateRealEstateCapitalGains({
      ...baseInput,
      state: 'TX',
      transactions: [
        {
          id: 'excluded-home',
          purchasePrice: 300000,
          salePrice: 600000,
          purchaseDate: '2018-01-01',
          saleDate: '2026-02-01',
          capitalImprovements: 0,
          sellingExpenses: 0,
          depreciationRecaptured: 0,
          isPrimaryResidence: true,
          ownershipMonthsLastFiveYears: 48,
          useMonthsLastFiveYears: 48
        }
      ]
    });

    expect(result.totals.exclusionApplied).toBe(300000);
    expect(result.totals.netCapitalGain).toBe(0);
    expect(result.totals.totalTax).toBe(0);
  });
});
