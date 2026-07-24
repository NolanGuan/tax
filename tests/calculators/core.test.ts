import { describe, expect, it } from 'vitest';
import {
  calculateCapitalGains,
  CURRENT_TAX_YEAR,
  FEDERAL_RATES
} from '@/features/calculators/core';

describe('calculateCapitalGains', () => {
  it('separates short-term and long-term gains based on holding period', () => {
    const result = calculateCapitalGains({
      taxYear: CURRENT_TAX_YEAR,
      filingStatus: 'single',
      taxableIncome: 60000,
      state: 'CA',
      transactions: [
        {
          id: 'lt',
          purchasePrice: 100000,
          salePrice: 140000,
          purchaseDate: '2022-01-01',
          saleDate: '2026-02-01'
        },
        {
          id: 'st',
          purchasePrice: 50000,
          salePrice: 65000,
          purchaseDate: '2025-05-01',
          saleDate: '2026-01-01'
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
      taxYear: CURRENT_TAX_YEAR,
      filingStatus: 'married_joint',
      taxableIncome: 90000,
      state: 'TX',
      transactions: [
        {
          id: 'sale',
          purchasePrice: 200000,
          salePrice: 260000,
          purchaseDate: '2023-01-10',
          saleDate: '2026-02-10'
        }
      ]
    });

    expect(result.stateTax).toBe(0);
    expect(result.details.stateRate).toBe(0);
  });

  it('handles net capital losses by capping effective rate at zero', () => {
    const result = calculateCapitalGains({
      taxYear: CURRENT_TAX_YEAR,
      filingStatus: 'head_of_household',
      taxableIncome: 80000,
      state: 'NY',
      transactions: [
        {
          id: 'loss',
          purchasePrice: 150000,
          salePrice: 130000,
          purchaseDate: '2023-03-01',
          saleDate: '2026-03-01'
        }
      ]
    });

    expect(result.netCapitalGain).toBeLessThan(0);
    expect(result.totalTax).toBe(0);
    expect(result.effectiveRate).toBe(0);
  });

  it('uses the published 2026 federal thresholds', () => {
    expect(FEDERAL_RATES.dataYear).toBe(2026);
    expect(FEDERAL_RATES.ordinaryIncome.single[0]).toEqual({
      min: 0,
      max: 12400,
      rate: 0.1
    });
    expect(FEDERAL_RATES.longTermCapitalGains.married_joint[0].max).toBe(98900);
    expect(FEDERAL_RATES.longTermCapitalGains.single[1].max).toBe(545500);
  });

  it('nets a short-term loss against a long-term gain before calculating federal tax', () => {
    const result = calculateCapitalGains({
      taxYear: CURRENT_TAX_YEAR,
      filingStatus: 'single',
      taxableIncome: 100000,
      state: 'TX',
      transactions: [
        {
          id: 'long-gain',
          purchasePrice: 100000,
          salePrice: 140000,
          purchaseDate: '2024-01-01',
          saleDate: '2026-02-01'
        },
        {
          id: 'short-loss',
          purchasePrice: 30000,
          salePrice: 20000,
          purchaseDate: '2025-10-01',
          saleDate: '2026-02-01'
        }
      ]
    });

    expect(result.longTermGain).toBe(40000);
    expect(result.shortTermGain).toBe(-10000);
    expect(result.netCapitalGain).toBe(30000);
    expect(result.federalTax).toBeCloseTo(4500);
    expect(result.details.shortTermMarginalRate).toBe(0);
  });

  it('nets a long-term loss against a short-term gain before calculating federal tax', () => {
    const result = calculateCapitalGains({
      taxYear: CURRENT_TAX_YEAR,
      filingStatus: 'single',
      taxableIncome: 60000,
      state: 'TX',
      transactions: [
        {
          id: 'short-gain',
          purchasePrice: 10000,
          salePrice: 30000,
          purchaseDate: '2025-10-01',
          saleDate: '2026-02-01'
        },
        {
          id: 'long-loss',
          purchasePrice: 30000,
          salePrice: 20000,
          purchaseDate: '2024-01-01',
          saleDate: '2026-02-01'
        }
      ]
    });

    expect(result.netCapitalGain).toBe(10000);
    expect(result.federalTax).toBeCloseTo(2200);
    expect(result.details.longTermRate).toBe(0);
  });

  it('rejects unsupported years and mismatched sale years', () => {
    const input = {
      taxYear: CURRENT_TAX_YEAR,
      filingStatus: 'single' as const,
      taxableIncome: 0,
      state: 'TX',
      transactions: [
        {
          id: 'sale',
          purchasePrice: 10,
          salePrice: 20,
          purchaseDate: '2024-01-01',
          saleDate: '2026-01-02'
        }
      ]
    };

    expect(() => calculateCapitalGains({ ...input, taxYear: 2025 })).toThrow(/Only tax year 2026/);
    expect(() =>
      calculateCapitalGains({
        ...input,
        transactions: [{ ...input.transactions[0], saleDate: '2027-01-02' }]
      })
    ).toThrow(/must be sold in tax year 2026/);
  });
});
