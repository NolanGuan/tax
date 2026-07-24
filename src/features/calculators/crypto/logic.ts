import { FEDERAL_RATES, findStateRate } from '@/features/calculators/core/constants';
import { calculateCapitalGains } from '@/features/calculators/core';
import type {
  CryptoCalculatorInput,
  CryptoCalculatorResult,
  CryptoDisposalDetail,
  CryptoTransaction
} from './types';

interface Lot {
  id: string;
  asset: string;
  quantity: number;
  costPerUnit: number;
  acquiredDate: string;
}

const CAPITAL_EVENT_TYPES = new Set(['sell', 'trade', 'spend']);

function sortTransactions(transactions: CryptoTransaction[]): CryptoTransaction[] {
  return [...transactions].sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
}

function calculateBracketTax(brackets: { min: number; max?: number; rate: number }[], income: number): number {
  if (income <= 0) {
    return 0;
  }

  let tax = 0;
  for (const bracket of brackets) {
    const lower = bracket.min;
    const upper = bracket.max ?? Number.POSITIVE_INFINITY;
    if (income <= lower) {
      break;
    }
    const taxable = Math.min(income, upper) - lower;
    if (taxable <= 0) {
      continue;
    }
    tax += taxable * bracket.rate;
    if (income <= upper) {
      break;
    }
  }
  return tax;
}

function calculateOrdinaryIncrement(
  filingStatus: string,
  baseIncome: number,
  additionalIncome: number
): { federal: number; marginalRate: number } {
  const brackets = FEDERAL_RATES.ordinaryIncome[filingStatus as keyof typeof FEDERAL_RATES.ordinaryIncome];
  if (!brackets) {
    return { federal: 0, marginalRate: 0 };
  }

  const taxBefore = calculateBracketTax(brackets, baseIncome);
  const taxAfter = calculateBracketTax(brackets, baseIncome + additionalIncome);

  let marginalRate = 0;
  for (const bracket of brackets) {
    if (baseIncome + additionalIncome > bracket.min) {
      marginalRate = bracket.rate;
    }
  }

  return {
    federal: taxAfter - taxBefore,
    marginalRate
  };
}

export function calculateCryptoTaxes(input: CryptoCalculatorInput): CryptoCalculatorResult {
  const orderedTransactions = sortTransactions(input.transactions);
  const lotsByAsset = new Map<string, Lot[]>();
  const capitalTransactions: Array<{
    id: string;
    purchaseDate: string;
    saleDate: string;
    purchasePrice: number;
    salePrice: number;
  }> = [];
  const disposals: CryptoDisposalDetail[] = [];
  const warnings: string[] = [];

  let ordinaryIncomeUSD = 0;
  let disposalCounter = 0;

  const addLot = (lot: Lot) => {
    const lots = lotsByAsset.get(lot.asset) ?? [];
    lots.push(lot);
    lotsByAsset.set(lot.asset, lots);
  };

  for (const transaction of orderedTransactions) {
    if (transaction.type === 'buy') {
      if (!transaction.costUSD) {
        warnings.push(`Buy transaction ${transaction.id} is missing costUSD; treated as zero basis.`);
      }
      const costPerUnit = transaction.quantity > 0 ? (transaction.costUSD ?? 0) / transaction.quantity : 0;
      addLot({
        id: transaction.id,
        asset: transaction.asset,
        quantity: transaction.quantity,
        costPerUnit,
        acquiredDate: transaction.date
      });
      continue;
    }

    if (transaction.type === 'income') {
      const fmw = transaction.fairMarketValueUSD ?? 0;
      if (!fmw) {
        warnings.push(`Income transaction ${transaction.id} is missing fairMarketValueUSD; counted as zero.`);
      }
      ordinaryIncomeUSD += fmw;
      const costPerUnit = transaction.quantity > 0 ? fmw / transaction.quantity : 0;
      addLot({
        id: transaction.id,
        asset: transaction.asset,
        quantity: transaction.quantity,
        costPerUnit,
        acquiredDate: transaction.date
      });
      continue;
    }

    if (CAPITAL_EVENT_TYPES.has(transaction.type)) {
      const proceeds = transaction.proceedsUSD ?? 0;
      if (!proceeds) {
        warnings.push(`Disposal ${transaction.id} has zero proceeds; gain may be inaccurate.`);
      }
      let remainingQuantity = transaction.quantity;
      const lots = lotsByAsset.get(transaction.asset) ?? [];
      const proceedsPerUnit = transaction.quantity > 0 ? proceeds / transaction.quantity : 0;

      while (remainingQuantity > 0) {
        if (!lots.length) {
          warnings.push(`Not enough basis for disposal ${transaction.id} on ${transaction.asset}; remaining quantity treated with zero basis.`);
          const lotQuantity = remainingQuantity;
          const costBasis = 0;
          const saleAmount = proceedsPerUnit * lotQuantity;

          capitalTransactions.push({
            id: `${transaction.id}-lot-${++disposalCounter}`,
            purchaseDate: transaction.date,
            saleDate: transaction.date,
            purchasePrice: costBasis,
            salePrice: saleAmount
          });

          disposals.push({
            id: transaction.id,
            asset: transaction.asset,
            lotId: 'unmatched',
            quantity: lotQuantity,
            costBasisUSD: costBasis,
            proceedsUSD: saleAmount,
            gainUSD: saleAmount,
            holdingPeriodDays: 0,
            isLongTerm: false,
            transactionType: transaction.type
          });
          break;
        }

        const lot = lots[0];
        const lotQuantity = Math.min(lot.quantity, remainingQuantity);
        const costBasis = lot.costPerUnit * lotQuantity;
        const saleAmount = proceedsPerUnit * lotQuantity;
        const holdingPeriodDays = Math.max(
          0,
          Math.floor((Date.parse(transaction.date) - Date.parse(lot.acquiredDate)) / (1000 * 60 * 60 * 24))
        );

        capitalTransactions.push({
          id: `${transaction.id}-lot-${++disposalCounter}`,
          purchaseDate: lot.acquiredDate,
          saleDate: transaction.date,
          purchasePrice: costBasis,
          salePrice: saleAmount
        });

        disposals.push({
          id: transaction.id,
          asset: transaction.asset,
          lotId: lot.id,
          quantity: lotQuantity,
          costBasisUSD: costBasis,
          proceedsUSD: saleAmount,
          gainUSD: saleAmount - costBasis,
          holdingPeriodDays,
          isLongTerm: holdingPeriodDays > 365,
          transactionType: transaction.type
        });

        lot.quantity -= lotQuantity;
        remainingQuantity -= lotQuantity;
        if (lot.quantity <= 1e-8) {
          lots.shift();
        }
      }

      continue;
    }

    warnings.push(`Unhandled transaction type ${transaction.type} for ${transaction.id}.`);
  }

  const capitalGainResult = calculateCapitalGains({
    taxYear: input.taxYear,
    filingStatus: input.filingStatus,
    taxableIncome: input.taxableIncome,
    state: input.state,
    transactions: capitalTransactions.length
      ? capitalTransactions.map((tx) => ({
          id: tx.id,
          purchaseDate: tx.purchaseDate,
          saleDate: tx.saleDate,
          purchasePrice: tx.purchasePrice,
          salePrice: tx.salePrice,
          label: tx.id
        }))
      : [
          {
            id: 'placeholder',
            label: 'No disposals',
            purchasePrice: 0,
            salePrice: 0,
            purchaseDate: `${input.taxYear}-01-01`,
            saleDate: `${input.taxYear}-01-01`
          }
        ]
  });

  const ordinaryIncrement = calculateOrdinaryIncrement(
    input.filingStatus,
    input.taxableIncome + Math.max(capitalGainResult.shortTermGain, 0),
    ordinaryIncomeUSD
  );

  const stateRate = findStateRate(input.state);
  const ordinaryStateTax = ordinaryIncomeUSD * stateRate;

  const totalEstimatedTax =
    capitalGainResult.totalTax + ordinaryIncrement.federal + ordinaryStateTax;

  return {
    capitalGains: capitalGainResult,
    ordinaryIncomeUSD,
    ordinaryIncomeFederalTax: ordinaryIncrement.federal,
    ordinaryIncomeStateTax: ordinaryStateTax,
    totalEstimatedTax,
    disposals,
    warnings
  };
}
