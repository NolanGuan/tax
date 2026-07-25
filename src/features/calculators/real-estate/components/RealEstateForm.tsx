'use client';

import { useMemo, useState } from 'react';
import { calculateRealEstateCapitalGains } from '@/features/calculators/real-estate';
import type {
  RealEstateCalculatorInput,
  RealEstateCalculatorResult,
  RealEstateTransaction
} from '@/features/calculators/real-estate';
import { CURRENT_TAX_YEAR, type FilingStatus } from '@/features/calculators/core';
import { EnglishDateField } from '@/features/forms';

interface FormState extends Omit<RealEstateCalculatorInput, 'transactions'> {
  transactions: Array<RealEstateTransaction & { key: string }>;
}

const DEFAULT_TRANSACTION: RealEstateTransaction = {
  id: '',
  label: 'Primary home',
  purchasePrice: 300000,
  salePrice: 550000,
  purchaseDate: '2018-01-01',
  saleDate: '2026-02-01',
  capitalImprovements: 25000,
  sellingExpenses: 20000,
  depreciationRecaptured: 0,
  isPrimaryResidence: true,
  ownershipMonthsLastFiveYears: 48,
  useMonthsLastFiveYears: 48
};

const DEFAULT_STATE: FormState = {
  taxYear: CURRENT_TAX_YEAR,
  filingStatus: 'married_joint',
  taxableIncome: 120000,
  state: 'CA',
  transactions: [
    {
      ...DEFAULT_TRANSACTION,
      id: 'primary-home',
      key: 'primary-home-key'
    }
  ]
};

const STATES = ['CA', 'NY', 'TX', 'FL', 'WA', 'MA', 'IL', 'NJ', 'OR', 'CO'];

const FILING_STATUS_OPTIONS: Array<{ value: FilingStatus; label: string }> = [
  { value: 'single', label: 'Single' },
  { value: 'married_joint', label: 'Married filing jointly' },
  { value: 'married_separate', label: 'Married filing separately' },
  { value: 'head_of_household', label: 'Head of household' }
];

function parseAmount(value: string): number {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function RealEstateForm() {
  const [form, setForm] = useState<FormState>(DEFAULT_STATE);
  const [errors, setErrors] = useState<string[]>([]);
  const [result, setResult] = useState<RealEstateCalculatorResult | null>(null);

  const canSubmit = useMemo(() => {
    return form.transactions.length > 0;
  }, [form.transactions.length]);

  function updateTransaction(key: string, patch: Partial<RealEstateTransaction>) {
    setForm((previous) => ({
      ...previous,
      transactions: previous.transactions.map((transaction) =>
        transaction.key === key
          ? {
              ...transaction,
              ...patch
            }
          : transaction
      )
    }));
  }

  function addTransaction() {
    const uniqueKey = `property-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
    setForm((previous) => ({
      ...previous,
      transactions: [
        ...previous.transactions,
        {
          ...DEFAULT_TRANSACTION,
          id: uniqueKey,
          label: 'Additional property',
          key: uniqueKey
        }
      ]
    }));
  }

  function removeTransaction(key: string) {
    setForm((previous) => ({
      ...previous,
      transactions: previous.transactions.filter((transaction) => transaction.key !== key)
    }));
  }

  function validateForm(): string[] {
    const issues: string[] = [];

    if (!form.transactions.length) {
      issues.push('Please add at least one property.');
    }

    for (const transaction of form.transactions) {
      if (!transaction.purchaseDate || !transaction.saleDate) {
        issues.push(`Transaction ${transaction.label ?? transaction.id} is missing dates.`);
      } else {
        const purchase = Date.parse(transaction.purchaseDate);
        const sale = Date.parse(transaction.saleDate);
        if (Number.isNaN(purchase) || Number.isNaN(sale)) {
          issues.push(`Transaction ${transaction.label ?? transaction.id} has invalid dates.`);
        } else if (sale <= purchase) {
          issues.push(`Sale date must come after purchase date for ${transaction.label ?? transaction.id}.`);
        } else if (new Date(sale).getUTCFullYear() !== CURRENT_TAX_YEAR) {
          issues.push(`Sale date must be in tax year ${CURRENT_TAX_YEAR} for ${transaction.label ?? transaction.id}.`);
        }
      }

      if (transaction.purchasePrice < 0) {
        issues.push(`Purchase price cannot be negative for ${transaction.label ?? transaction.id}.`);
      }
      if (transaction.salePrice <= 0) {
        issues.push(`Sale price must be greater than zero for ${transaction.label ?? transaction.id}.`);
      }
      if (transaction.capitalImprovements < 0 || transaction.sellingExpenses < 0) {
        issues.push(`Improvements and selling expenses must be zero or positive for ${transaction.label ?? transaction.id}.`);
      }
      if (transaction.depreciationRecaptured < 0) {
        issues.push(`Depreciation recapture cannot be negative for ${transaction.label ?? transaction.id}.`);
      }
    }

    return issues;
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationIssues = validateForm();
    if (validationIssues.length) {
      setErrors(validationIssues);
      setResult(null);
      return;
    }

    const input: RealEstateCalculatorInput = {
      taxYear: form.taxYear,
      filingStatus: form.filingStatus,
      taxableIncome: form.taxableIncome,
      state: form.state,
      transactions: form.transactions.map((transaction) => ({
        ...transaction,
        id: transaction.id || transaction.key
      }))
    };

    const calculation = calculateRealEstateCapitalGains(input);
    setErrors([]);
    setResult(calculation);
  }

  return (
    <div className="space-y-6">
      <form className="space-y-6" onSubmit={handleSubmit}>
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">Filing details</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-2 text-sm font-medium text-gray-700">
              Filing status
              <select
                value={form.filingStatus}
                onChange={(event) => setForm((previous) => ({
                  ...previous,
                  filingStatus: event.target.value as FilingStatus
                }))}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              >
                {FILING_STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-2 text-sm font-medium text-gray-700">
              Taxable income (excluding property sale)
              <input
                type="number"
                value={form.taxableIncome}
                min={0}
                onChange={(event) => setForm((previous) => ({
                  ...previous,
                  taxableIncome: parseAmount(event.target.value)
                }))}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm font-medium text-gray-700">
              State
              <select
                value={form.state}
                onChange={(event) => setForm((previous) => ({
                  ...previous,
                  state: event.target.value
                }))}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              >
                {STATES.map((stateCode) => (
                  <option key={stateCode} value={stateCode}>
                    {stateCode}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Properties</h2>
            <button
              type="button"
              onClick={addTransaction}
              className="inline-flex items-center rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:border-blue-500 hover:text-blue-600"
            >
              Add property
            </button>
          </div>

          {form.transactions.map((transaction) => (
            <div key={transaction.key} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">{transaction.label}</h3>
                {form.transactions.length > 1 ? (
                  <button
                    type="button"
                    onClick={() => removeTransaction(transaction.key)}
                    className="text-xs font-semibold uppercase text-red-500 hover:text-red-600"
                  >
                    Remove
                  </button>
                ) : null}
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <label className="flex flex-col gap-2 text-sm font-medium text-gray-700">
                  Label
                  <input
                    type="text"
                    value={transaction.label ?? ''}
                    onChange={(event) => updateTransaction(transaction.key, { label: event.target.value })}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                </label>

                <label className="flex flex-col gap-2 text-sm font-medium text-gray-700">
                  Purchase price
                  <input
                    type="number"
                    min={0}
                    value={transaction.purchasePrice}
                    onChange={(event) => updateTransaction(transaction.key, {
                      purchasePrice: parseAmount(event.target.value)
                    })}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                </label>

                <label className="flex flex-col gap-2 text-sm font-medium text-gray-700">
                  Sale price
                  <input
                    type="number"
                    min={0}
                    value={transaction.salePrice}
                    onChange={(event) => updateTransaction(transaction.key, {
                      salePrice: parseAmount(event.target.value)
                    })}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                </label>

                <EnglishDateField
                  id={`${transaction.key}-purchase-date`}
                  label="Purchase date"
                  value={transaction.purchaseDate}
                  onChange={(purchaseDate) => updateTransaction(transaction.key, { purchaseDate })}
                  required
                />

                <EnglishDateField
                  id={`${transaction.key}-sale-date`}
                  label="Sale date"
                  value={transaction.saleDate}
                  min={`${CURRENT_TAX_YEAR}-01-01`}
                  max={`${CURRENT_TAX_YEAR}-12-31`}
                  onChange={(saleDate) => updateTransaction(transaction.key, { saleDate })}
                  helpText={`Use a date in tax year ${CURRENT_TAX_YEAR}.`}
                  required
                />

                <label className="flex flex-col gap-2 text-sm font-medium text-gray-700">
                  Capital improvements
                  <input
                    type="number"
                    min={0}
                    value={transaction.capitalImprovements}
                    onChange={(event) => updateTransaction(transaction.key, {
                      capitalImprovements: parseAmount(event.target.value)
                    })}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                </label>

                <label className="flex flex-col gap-2 text-sm font-medium text-gray-700">
                  Selling expenses
                  <input
                    type="number"
                    min={0}
                    value={transaction.sellingExpenses}
                    onChange={(event) => updateTransaction(transaction.key, {
                      sellingExpenses: parseAmount(event.target.value)
                    })}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                </label>

                <label className="flex flex-col gap-2 text-sm font-medium text-gray-700">
                  Depreciation recaptured
                  <input
                    type="number"
                    min={0}
                    value={transaction.depreciationRecaptured}
                    onChange={(event) => updateTransaction(transaction.key, {
                      depreciationRecaptured: parseAmount(event.target.value)
                    })}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                </label>

                <label className="flex flex-col gap-2 text-sm font-medium text-gray-700">
                  Primary residence
                  <select
                    value={transaction.isPrimaryResidence ? 'yes' : 'no'}
                    onChange={(event) => updateTransaction(transaction.key, {
                      isPrimaryResidence: event.target.value === 'yes'
                    })}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  >
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </label>

                {transaction.isPrimaryResidence ? (
                  <>
                    <label className="flex flex-col gap-2 text-sm font-medium text-gray-700">
                      Ownership months in last 5 years
                      <input
                        type="number"
                        min={0}
                        max={60}
                        value={transaction.ownershipMonthsLastFiveYears}
                        onChange={(event) => updateTransaction(transaction.key, {
                          ownershipMonthsLastFiveYears: Number.parseInt(event.target.value, 10) || 0
                        })}
                        className="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      />
                    </label>
                    <label className="flex flex-col gap-2 text-sm font-medium text-gray-700">
                      Use months in last 5 years
                      <input
                        type="number"
                        min={0}
                        max={60}
                        value={transaction.useMonthsLastFiveYears}
                        onChange={(event) => updateTransaction(transaction.key, {
                          useMonthsLastFiveYears: Number.parseInt(event.target.value, 10) || 0
                        })}
                        className="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      />
                    </label>
                  </>
                ) : null}
              </div>
            </div>
          ))}
        </section>

        <button
          type="submit"
          disabled={!canSubmit}
          className="inline-flex items-center rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
        >
          Calculate real estate tax impact
        </button>
      </form>

      {errors.length ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
          <p className="font-semibold">Please resolve the following issues:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {result ? (
        <div className="space-y-6">
          <section className="rounded-2xl border border-blue-100 bg-blue-50 p-6 text-blue-900">
            <h2 className="text-xl font-semibold">Summary</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div>
                <p className="text-sm uppercase tracking-wide text-blue-300">Gains</p>
                <p>Long-term gain: ${result.totals.longTermGain.toLocaleString('en-US')}</p>
                <p>Short-term gain: ${result.totals.shortTermGain.toLocaleString('en-US')}</p>
                <p>Depreciation recapture: ${result.totals.depreciationRecapture.toLocaleString('en-US')}</p>
                <p>Primary residence exclusion applied: ${result.totals.exclusionApplied.toLocaleString('en-US')}</p>
              </div>
              <div>
                <p className="text-sm uppercase tracking-wide text-blue-300">Tax impact</p>
                <p>Federal tax: ${result.totals.federalTax.toLocaleString('en-US')}</p>
                <p>State tax: ${result.totals.stateTax.toLocaleString('en-US')}</p>
                <p>Total tax: ${result.totals.totalTax.toLocaleString('en-US')}</p>
              </div>
            </div>
            <p className="mt-4 text-xs text-blue-800">
              Educational {CURRENT_TAX_YEAR} estimate. Depreciation recapture uses the 25% federal maximum and the
              selected state headline rate. NIIT, local tax, partial exclusions, nonqualified use, installment sales,
              and other property-specific rules are not modeled.
            </p>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">Per-property breakdown</h2>
            <div className="mt-4 space-y-4 text-sm text-gray-600">
              {result.transactions.map((transaction) => (
                <div key={transaction.id} className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <h3 className="text-lg font-semibold text-gray-900">{transaction.label ?? transaction.id}</h3>
                  <div className="mt-3 grid gap-2 md:grid-cols-2">
                    <p>Holding period: {Math.round(transaction.holdingPeriodDays / 30)} months ({transaction.isLongTerm ? 'long-term' : 'short-term'})</p>
                    <p>Adjusted basis: ${transaction.adjustedBasis.toLocaleString('en-US')}</p>
                    <p>Gross gain: ${transaction.grossGain.toLocaleString('en-US')}</p>
                    <p>Depreciation recapture: ${transaction.depreciationRecapture.toLocaleString('en-US')}</p>
                    <p>Primary residence exclusion used: ${transaction.exclusionUsed.toLocaleString('en-US')}</p>
                    <p>Taxable gain after exclusions: ${transaction.taxableGain.toLocaleString('en-US')}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
}
