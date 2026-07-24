import {
  calculateCapitalGains,
  findStateRate,
  getHoldingPeriodDays,
  isLongTermHoldingPeriod
} from '@/features/calculators/core';
import type {
  RealEstateCalculatorInput,
  RealEstateCalculatorResult,
  RealEstateTransaction,
  PrimaryResidenceExclusionResult
} from './types';

const SINGLE_EXCLUSION = 250_000;
const MARRIED_EXCLUSION = 500_000;
const MAX_UNRECAPTURED_SECTION_1250_RATE = 0.25;

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

  return {
    eligible,
    maxExclusion: eligible ? determineExclusionLimit(filingStatus) : 0,
    exclusionUsed: 0
  };
}

function computeAdjustedBasis(transaction: RealEstateTransaction): number {
  const base = transaction.purchasePrice + transaction.capitalImprovements;
  return Math.max(0, base - transaction.depreciationRecaptured);
}

export function calculateRealEstateCapitalGains(
  input: RealEstateCalculatorInput
): RealEstateCalculatorResult {
  let totalExclusionApplied = 0;
  let totalDepreciationRecapture = 0;

  const detailedTransactions = input.transactions.map((transaction) => {
    const adjustedBasis = computeAdjustedBasis(transaction);
    const grossGain = transaction.salePrice - transaction.sellingExpenses - adjustedBasis;
    const exclusionInfo = evaluatePrimaryResidenceExclusion(transaction, input.filingStatus);

    // Depreciation previously allowed reduces basis and cannot be sheltered by §121.
    const depreciationRecapture = Math.min(
      transaction.depreciationRecaptured,
      Math.max(0, grossGain)
    );
    const gainEligibleForExclusion = grossGain - depreciationRecapture;
    const exclusionUsed =
      exclusionInfo.eligible && gainEligibleForExclusion > 0
        ? Math.min(gainEligibleForExclusion, exclusionInfo.maxExclusion)
        : 0;

    // Loss on a personal residence is not deductible. Rental/investment losses remain in the estimate.
    const gainAfterExclusion = gainEligibleForExclusion - exclusionUsed;
    const taxableGain = transaction.isPrimaryResidence
      ? Math.max(0, gainAfterExclusion)
      : gainAfterExclusion;

    totalExclusionApplied += exclusionUsed;
    totalDepreciationRecapture += depreciationRecapture;

    const holdingPeriodDays = getHoldingPeriodDays(
      transaction.purchaseDate,
      transaction.saleDate
    );

    return {
      id: transaction.id,
      label: transaction.label,
      purchaseDate: transaction.purchaseDate,
      saleDate: transaction.saleDate,
      holdingPeriodDays,
      isLongTerm: isLongTermHoldingPeriod(
        transaction.purchaseDate,
        transaction.saleDate
      ),
      grossGain,
      adjustedBasis,
      exclusionUsed,
      taxableGain,
      depreciationRecapture
    };
  });

  const capitalGainResult = calculateCapitalGains({
    taxYear: input.taxYear,
    filingStatus: input.filingStatus,
    taxableIncome: input.taxableIncome,
    state: input.state,
    transactions: detailedTransactions.map((transaction) => ({
      id: transaction.id,
      label: transaction.label,
      purchasePrice: 0,
      salePrice: transaction.taxableGain,
      purchaseDate: transaction.purchaseDate,
      saleDate: transaction.saleDate
    }))
  });

  // Unrecaptured §1250 gain is taxed at a maximum 25%; this deliberately uses that
  // ceiling and is labeled as an estimate in the UI.
  const federalRecaptureEstimate =
    totalDepreciationRecapture * MAX_UNRECAPTURED_SECTION_1250_RATE;
  const stateRecaptureEstimate =
    totalDepreciationRecapture * findStateRate(input.state);
  const federalTax = capitalGainResult.federalTax + federalRecaptureEstimate;
  const stateTax = capitalGainResult.stateTax + stateRecaptureEstimate;

  return {
    totals: {
      longTermGain: capitalGainResult.longTermGain,
      shortTermGain: capitalGainResult.shortTermGain,
      depreciationRecapture: totalDepreciationRecapture,
      exclusionApplied: totalExclusionApplied,
      netCapitalGain: capitalGainResult.netCapitalGain + totalDepreciationRecapture,
      federalTax,
      stateTax,
      totalTax: federalTax + stateTax
    },
    transactions: detailedTransactions.map(({ purchaseDate, saleDate, ...transaction }) => transaction)
  };
}
