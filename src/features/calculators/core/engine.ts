import { FEDERAL_RATES_2025, findStateRate } from './constants';
import type {
  CapitalGainsBreakdown,
  CapitalGainsInput,
  CapitalGainsTransaction,
  FilingStatus,
  LongTermCapitalGainsBracket,
  OrdinaryIncomeBracket
} from './types';

function getHoldingPeriodDays(transaction: CapitalGainsTransaction): number {
  const start = Date.parse(transaction.purchaseDate);
  const end = Date.parse(transaction.saleDate);
  if (Number.isNaN(start) || Number.isNaN(end)) {
    return 0;
  }

  const millisecondsInDay = 1000 * 60 * 60 * 24;
  return Math.max(0, Math.floor((end - start) / millisecondsInDay));
}

function resolveOrdinaryBrackets(status: FilingStatus): OrdinaryIncomeBracket[] {
  return FEDERAL_RATES_2025.ordinaryIncome[status];
}

function resolveLongTermBrackets(status: FilingStatus): LongTermCapitalGainsBracket[] {
  return FEDERAL_RATES_2025.longTermCapitalGains[status];
}

function calculateBracketTax(brackets: OrdinaryIncomeBracket[], income: number): number {
  if (income <= 0) {
    return 0;
  }

  let tax = 0;
  for (const bracket of brackets) {
    const lowerBound = bracket.min;
    const upperBound = bracket.max ?? Number.POSITIVE_INFINITY;

    if (income <= lowerBound) {
      break;
    }

    const taxableAtRate = Math.min(income, upperBound) - lowerBound;
    if (taxableAtRate <= 0) {
      continue;
    }

    tax += taxableAtRate * bracket.rate;

    if (income <= upperBound) {
      break;
    }
  }

  return tax;
}

function calculateOrdinaryIncrement(
  status: FilingStatus,
  baseIncome: number,
  additionalIncome: number
): { tax: number; marginalRate: number } {
  if (additionalIncome <= 0) {
    return { tax: 0, marginalRate: 0 };
  }

  const brackets = resolveOrdinaryBrackets(status);
  const taxBefore = calculateBracketTax(brackets, baseIncome);
  const taxAfter = calculateBracketTax(brackets, baseIncome + additionalIncome);
  const incrementalTax = taxAfter - taxBefore;

  const marginalRate = brackets.reduce((currentRate, bracket) => {
    if ((baseIncome + additionalIncome) > bracket.min) {
      return bracket.rate;
    }
    return currentRate;
  }, brackets[0]?.rate ?? 0);

  return {
    tax: incrementalTax,
    marginalRate
  };
}

function calculateLongTermIncrement(
  status: FilingStatus,
  taxableIncome: number,
  longTermGain: number
): { tax: number; appliedRate: number } {
  if (longTermGain <= 0) {
    return { tax: 0, appliedRate: 0 };
  }

  const brackets = resolveLongTermBrackets(status);

  let remainingGain = longTermGain;
  let tax = 0;
  let appliedRate = 0;

  for (const bracket of brackets) {
    const lower = bracket.min;
    const upper = bracket.max ?? Number.POSITIVE_INFINITY;
    const lowerBoundWithIncome = Math.max(lower, taxableIncome);

    if (taxableIncome >= upper) {
      continue;
    }

    const bracketRoom = Math.max(0, upper - lowerBoundWithIncome);
    if (bracketRoom <= 0) {
      continue;
    }

    const portion = Math.min(remainingGain, bracketRoom);
    tax += portion * bracket.rate;
    if (portion > 0) {
      appliedRate = bracket.rate;
    }
    remainingGain -= portion;
    taxableIncome += portion;

    if (remainingGain <= 0) {
      break;
    }
  }

  return {
    tax,
    appliedRate
  };
}

export function calculateCapitalGains(input: CapitalGainsInput): CapitalGainsBreakdown {
  const transactions = input.transactions.length ? input.transactions : [];

  let longTermGain = 0;
  let shortTermGain = 0;

  for (const transaction of transactions) {
    const holdingDays = getHoldingPeriodDays(transaction);
    const gain = transaction.salePrice - transaction.purchasePrice;

    if (holdingDays > 365) {
      longTermGain += gain;
    } else {
      shortTermGain += gain;
    }
  }

  const netCapitalGain = longTermGain + shortTermGain;

  const { tax: federalShortTermTax, marginalRate } = calculateOrdinaryIncrement(
    input.filingStatus,
    input.taxableIncome,
    Math.max(shortTermGain, 0)
  );

  const { tax: federalLongTermTax, appliedRate } = calculateLongTermIncrement(
    input.filingStatus,
    input.taxableIncome + Math.max(shortTermGain, 0),
    Math.max(longTermGain, 0)
  );

  const nonNegativeNetGain = Math.max(netCapitalGain, 0);
  const stateRate = findStateRate(input.state);
  const stateTax = nonNegativeNetGain * stateRate;

  const federalTax = federalShortTermTax + federalLongTermTax;
  const totalTax = federalTax + stateTax;
  const effectiveRate = nonNegativeNetGain > 0 ? totalTax / nonNegativeNetGain : 0;

  return {
    shortTermGain,
    longTermGain,
    netCapitalGain,
    federalTax,
    stateTax,
    totalTax,
    effectiveRate,
    details: {
      longTermRate: appliedRate,
      shortTermMarginalRate: marginalRate,
      stateRate
    }
  };
}
