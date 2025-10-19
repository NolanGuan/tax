import { describe, expect, it } from 'vitest';
import { calculateCapitalGains } from '@/features/calculators/core';

describe('calculateCapitalGains', () => {
  it('separates short-term and long-term gains based on holding period', () => {
    const result = calculateCapitalGains({
      taxYear: 2025,
      filingStatus: 'single',
      taxableIncome: 60000,
      state: 'CA',
      transactions: [
        {
          id: 'lt',
          purchasePrice: 100000,
          salePrice: 140000,
          purchaseDate: '2022-01-01',
          saleDate: '2024-02-01'
        },
        {
          id: 'st',
          purchasePrice: 50000,
          salePrice: 65000,
          purchaseDate: '2024-05-01',
          saleDate: '2024-12-01'
        }
      ]
    });

    expect(result.longTermGain).toBeCloseTo(40000);
    expect(result.shortTermGain).toBeCloseTo(15000);
    expect(result.netCapitalGain).toBeCloseTo(55000);
    expect(result.details.stateRate).toBeCloseTo(0.133);
  });

  it('applies zero state tax when state has no capital gains tax', () => {
    const result = calculateCapitalGains({
      taxYear: 2025,
      filingStatus: 'married_joint',
      taxableIncome: 90000,
      state: 'TX',
      transactions: [
        {
          id: 'sale',
          purchasePrice: 200000,
          salePrice: 260000,
          purchaseDate: '2023-01-10',
          saleDate: '2024-02-10'
        }
      ]
    });

    expect(result.stateTax).toBe(0);
    expect(result.details.stateRate).toBe(0);
  });

  it('handles net capital losses by capping effective rate at zero', () => {
    const result = calculateCapitalGains({
      taxYear: 2025,
      filingStatus: 'head_of_household',
      taxableIncome: 80000,
      state: 'NY',
      transactions: [
        {
          id: 'loss',
          purchasePrice: 150000,
          salePrice: 130000,
          purchaseDate: '2023-03-01',
          saleDate: '2024-03-01'
        }
      ]
    });

    expect(result.netCapitalGain).toBeLessThan(0);
    expect(result.totalTax).toBe(0);
    expect(result.effectiveRate).toBe(0);
  });
});
