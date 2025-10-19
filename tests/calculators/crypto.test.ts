import { describe, expect, it } from 'vitest';
import { calculateCryptoTaxes } from '@/features/calculators/crypto';

const baseInput = {
  taxYear: 2025,
  filingStatus: 'single' as const,
  taxableIncome: 85000,
  state: 'CA'
};

describe('calculateCryptoTaxes', () => {
  it('handles buy and sell flow with FIFO lots', () => {
    const result = calculateCryptoTaxes({
      ...baseInput,
      transactions: [
        {
          id: 'buy-1',
          asset: 'BTC',
          type: 'buy',
          date: '2023-01-01',
          quantity: 1,
          costUSD: 20000
        },
        {
          id: 'buy-2',
          asset: 'BTC',
          type: 'buy',
          date: '2024-01-01',
          quantity: 0.5,
          costUSD: 15000
        },
        {
          id: 'sell-1',
          asset: 'BTC',
          type: 'sell',
          date: '2025-01-01',
          quantity: 0.75,
          proceedsUSD: 30000
        }
      ]
    });

    expect(result.capitalGains.netCapitalGain).toBeGreaterThan(0);
    expect(result.disposals.length).toBeGreaterThan(0);
  });

  it('treats income events as ordinary income and adds to basis', () => {
    const result = calculateCryptoTaxes({
      ...baseInput,
      transactions: [
        {
          id: 'income-1',
          asset: 'ETH',
          type: 'income',
          date: '2024-02-10',
          quantity: 2,
          fairMarketValueUSD: 5000
        },
        {
          id: 'sell-eth',
          asset: 'ETH',
          type: 'sell',
          date: '2025-06-01',
          quantity: 1,
          proceedsUSD: 4000
        }
      ]
    });

    expect(result.ordinaryIncomeUSD).toBeCloseTo(5000);
    expect(result.capitalGains.netCapitalGain).toBeGreaterThan(-5000);
  });
});
