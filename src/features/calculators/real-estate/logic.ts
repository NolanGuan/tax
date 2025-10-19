import { calculateCapitalGains } from '@/features/calculators/core';
import type {
  RealEstateCalculatorInput,
  RealEstateCalculatorResult,
  RealEstateTransaction,
  PrimaryResidenceExclusionResult
} from './types';

const SINGLE_EXCLUSION = 250_000;
const MARRIED_EXCLUSION = 500_000;

function determineExclusionLimit(filingStatus: string): number {
  return filingStatus === 'married_joint' ? MARRIED_EXCLUSION : SINGLE_EXCLUSION;
}

function evaluatePrimaryResidenceExclusion(
  transaction: RealEstateTransaction,
  filingStatus: string
): PrimaryResidenceExclusionResult {
  const eligible =
    transaction.isPrimaryResidence &&
    transaction.ownershipMonthsLastFiveYears >= 24 &&
    transaction.useMonthsLastFiveYears >= 24;

  const maxExclusion = eligible ? determineExclusionLimit(filingStatus) : 0;

  return {
    eligible,
    maxExclusion,
    exclusionUsed: 0
  };
}

function computeAdjustedBasis(transaction: RealEstateTransaction): number {
  const base = transaction.purchasePrice + transaction.capitalImprovements;
  return Math.max(0, base - transaction.depreciationRecaptured);
}

function buildCapitalGainTransactions(input: RealEstateCalculatorInput) {
  return input.transactions.map((transaction) => {
    const adjustedBasis = computeAdjustedBasis(transaction);
    const grossGain = transaction.salePrice - transaction.sellingExpenses - adjustedBasis;

    return {
      id: transaction.id,
      label: transaction.label,
      purchasePrice: adjustedBasis,
      salePrice: transaction.salePrice - transaction.sellingExpenses,
      purchaseDate: transaction.purchaseDate,
      saleDate: transaction.saleDate,
      grossGain,
      adjustedBasis
    };
  });
}

export function calculateRealEstateCapitalGains(
  input: RealEstateCalculatorInput
): RealEstateCalculatorResult {
  const transactionsWithBasis = buildCapitalGainTransactions(input);

  const baseResult = calculateCapitalGains({
    taxYear: input.taxYear,
    filingStatus: input.filingStatus,
    taxableIncome: input.taxableIncome,
    state: input.state,
    transactions: transactionsWithBasis.map((tx) => ({
      id: tx.id,
      label: tx.label,
      purchasePrice: tx.purchasePrice,
      salePrice: tx.salePrice,
      purchaseDate: tx.purchaseDate,
      saleDate: tx.saleDate
    }))
  });

  let totalExclusionApplied = 0;
  let totalDepreciationRecapture = 0;

  const detailedTransactions = transactionsWithBasis.map((tx) => {
    const originalTransaction = input.transactions.find((item) => item.id === tx.id);
    if (!originalTransaction) {
      throw new Error('Real estate transaction mismatch');
    }

    const exclusionInfo = evaluatePrimaryResidenceExclusion(originalTransaction, input.filingStatus);

    // IRS rules: exclusion cannot offset depreciation recapture
    const depreciationRecaptureTaxable = Math.min(
      originalTransaction.depreciationRecaptured,
      Math.max(0, tx.grossGain)
    );

    const remainingGain = tx.grossGain - depreciationRecaptureTaxable;
    let exclusionUsed = 0;

    if (exclusionInfo.eligible && remainingGain > 0) {
      exclusionUsed = Math.min(remainingGain, exclusionInfo.maxExclusion);
      exclusionInfo.exclusionUsed = exclusionUsed;
    }

    const taxableGain = Math.max(0, remainingGain - exclusionUsed);
    totalExclusionApplied += exclusionUsed;
    totalDepreciationRecapture += depreciationRecaptureTaxable;

    const holdingPeriodDays = Math.max(
      0,
      Math.floor(
        (Date.parse(originalTransaction.saleDate) - Date.parse(originalTransaction.purchaseDate)) /
          (1000 * 60 * 60 * 24)
      )
    );

    const isLongTerm = holdingPeriodDays > 365;

    return {
      id: tx.id,
      label: tx.label,
      holdingPeriodDays,
      isLongTerm,
      grossGain: tx.grossGain,
      adjustedBasis: tx.adjustedBasis,
      exclusionUsed,
      taxableGain,
      depreciationRecapture: depreciationRecaptureTaxable
    };
  });

  const federalTaxWithRecapture = baseResult.federalTax;
  const stateTaxWithRecapture = baseResult.stateTax;

  return {
    totals: {
      longTermGain: baseResult.longTermGain,
      shortTermGain: baseResult.shortTermGain,
      depreciationRecapture: totalDepreciationRecapture,
      exclusionApplied: totalExclusionApplied,
      netCapitalGain: baseResult.netCapitalGain,
      federalTax: federalTaxWithRecapture,
      stateTax: stateTaxWithRecapture,
      totalTax: baseResult.totalTax
    },
    transactions: detailedTransactions
  };
}
