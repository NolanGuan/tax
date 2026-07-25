'use client';

import { useMemo, useState } from 'react';
import { calculateCryptoTaxes } from '@/features/calculators/crypto';
import type {
  CryptoCalculatorInput,
  CryptoCalculatorResult,
  CryptoTransaction,
  CryptoTransactionType
} from '@/features/calculators/crypto';
import { CURRENT_TAX_YEAR, type FilingStatus } from '@/features/calculators/core';
import { EnglishDateField } from '@/features/forms';

interface FormTransaction extends CryptoTransaction {
  key: string;
}

interface FormState extends Omit<CryptoCalculatorInput, 'transactions'> {
  transactions: FormTransaction[];
}

const DEFAULT_TRANSACTIONS: FormTransaction[] = [
  {
    id: 'buy-1',
    key: 'buy-1-key',
    asset: 'BTC',
    type: 'buy',
    date: '2023-05-15',
    quantity: 0.5,
    costUSD: 15000
  },
  {
    id: 'income-1',
    key: 'income-1-key',
    asset: 'ETH',
    type: 'income',
    date: '2024-03-10',
    quantity: 1.2,
    fairMarketValueUSD: 4500,
    notes: 'Staking rewards'
  },
  {
    id: 'sell-1',
    key: 'sell-1-key',
    asset: 'BTC',
    type: 'sell',
    date: '2026-01-20',
    quantity: 0.3,
    proceedsUSD: 21000
  }
];

const DEFAULT_FORM_STATE: FormState = {
  taxYear: CURRENT_TAX_YEAR,
  filingStatus: 'single',
  taxableIncome: 90000,
  state: 'CA',
  transactions: DEFAULT_TRANSACTIONS
};

const STATES = ['CA', 'NY', 'TX', 'FL', 'WA', 'MA', 'IL', 'NJ', 'OR', 'CO'];

const FILING_STATUS_OPTIONS: Array<{ value: FilingStatus; label: string }> = [
  { value: 'single', label: 'Single' },
  { value: 'married_joint', label: 'Married filing jointly' },
  { value: 'married_separate', label: 'Married filing separately' },
  { value: 'head_of_household', label: 'Head of household' }
];

const TRANSACTION_TYPE_OPTIONS: Array<{ value: CryptoTransactionType; label: string }> = [
  { value: 'buy', label: 'Buy (adds to basis)' },
  { value: 'sell', label: 'Sell / dispose' },
  { value: 'trade', label: 'Crypto-to-crypto trade' },
  { value: 'spend', label: 'Spend on goods/services' },
  { value: 'income', label: 'Income (mining/staking/airdrop)' }
];

function parseNumber(value: string): number {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function requiresProceeds(type: CryptoTransactionType): boolean {
  return type === 'sell' || type === 'trade' || type === 'spend';
}

function requiresCost(type: CryptoTransactionType): boolean {
  return type === 'buy';
}

function requiresFairMarketValue(type: CryptoTransactionType): boolean {
  return type === 'income';
}

export function CryptoForm() {
  const [form, setForm] = useState<FormState>(DEFAULT_FORM_STATE);
  const [errors, setErrors] = useState<string[]>([]);
  const [result, setResult] = useState<CryptoCalculatorResult | null>(null);

  const canSubmit = useMemo(() => form.transactions.length > 0, [form.transactions.length]);

  function updateTransaction(key: string, patch: Partial<FormTransaction>) {
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
    const generated = `tx-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
    setForm((previous) => ({
      ...previous,
      transactions: [
        ...previous.transactions,
        {
          id: generated,
          key: generated,
          asset: 'BTC',
          type: 'sell',
          date: '2026-06-01',
          quantity: 0.1,
          proceedsUSD: 7000
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
      issues.push('Please enter at least one crypto transaction.');
    }

    form.transactions.forEach((transaction) => {
      if (!transaction.asset.trim()) {
        issues.push(`Transaction ${transaction.id} requires an asset symbol.`);
      }
      if (!transaction.date) {
        issues.push(`Transaction ${transaction.id} requires a date.`);
      }
      if (
        requiresProceeds(transaction.type) &&
        transaction.date &&
        new Date(transaction.date).getUTCFullYear() !== CURRENT_TAX_YEAR
      ) {
        issues.push(`Disposal ${transaction.id} must occur in tax year ${CURRENT_TAX_YEAR}.`);
      }
      if (transaction.quantity <= 0) {
        issues.push(`Transaction ${transaction.id} must have a quantity greater than zero.`);
      }
      if (requiresCost(transaction.type) && (!transaction.costUSD || transaction.costUSD <= 0)) {
        issues.push(`Buy transaction ${transaction.id} must include total cost in USD.`);
      }
      if (requiresProceeds(transaction.type) && (!transaction.proceedsUSD || transaction.proceedsUSD <= 0)) {
        issues.push(`Disposal ${transaction.id} must include proceeds in USD.`);
      }
      if (requiresFairMarketValue(transaction.type) && (!transaction.fairMarketValueUSD || transaction.fairMarketValueUSD <= 0)) {
        issues.push(`Income transaction ${transaction.id} must include fair market value in USD.`);
      }
    });

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

    const input: CryptoCalculatorInput = {
      taxYear: form.taxYear,
      filingStatus: form.filingStatus,
      taxableIncome: form.taxableIncome,
      state: form.state,
      transactions: form.transactions.map(({ key, ...transaction }) => ({
        ...transaction,
        id: transaction.id || key
      }))
    };

    const calculation = calculateCryptoTaxes(input);
    setErrors([]);
    setResult(calculation);
  }

  function resetForm() {
    setForm(DEFAULT_FORM_STATE);
    setErrors([]);
    setResult(null);
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
              Taxable income (excluding crypto)
              <input
                type="number"
                min={0}
                value={form.taxableIncome}
                onChange={(event) => setForm((previous) => ({
                  ...previous,
                  taxableIncome: parseNumber(event.target.value)
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
            <h2 className="text-xl font-semibold text-gray-900">Transactions</h2>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={addTransaction}
                className="inline-flex items-center rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:border-blue-500 hover:text-blue-600"
              >
                Add transaction
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="inline-flex items-center rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-500 transition-colors hover:border-blue-400 hover:text-blue-600"
              >
                Reset sample data
              </button>
            </div>
          </div>

          {form.transactions.map((transaction) => (
            <div key={transaction.key} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{transaction.id}</h3>
                  <p className="text-xs uppercase tracking-wide text-gray-400">{transaction.asset}</p>
                </div>
                <button
                  type="button"
                  onClick={() => removeTransaction(transaction.key)}
                  className="text-xs font-semibold uppercase text-red-500 hover:text-red-600"
                >
                  Remove
                </button>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <label className="flex flex-col gap-2 text-sm font-medium text-gray-700">
                  Transaction ID / label
                  <input
                    type="text"
                    value={transaction.id}
                    onChange={(event) => updateTransaction(transaction.key, { id: event.target.value })}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                </label>

                <label className="flex flex-col gap-2 text-sm font-medium text-gray-700">
                  Asset
                  <input
                    type="text"
                    value={transaction.asset}
                    onChange={(event) => updateTransaction(transaction.key, { asset: event.target.value.toUpperCase() })}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                </label>

                <label className="flex flex-col gap-2 text-sm font-medium text-gray-700">
                  Type
                  <select
                    value={transaction.type}
                    onChange={(event) => updateTransaction(transaction.key, {
                      type: event.target.value as CryptoTransactionType
                    })}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  >
                    {TRANSACTION_TYPE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>

                <EnglishDateField
                  id={`${transaction.key}-date`}
                  label="Date"
                  value={transaction.date}
                  onChange={(date) => updateTransaction(transaction.key, { date })}
                  required
                />

                <label className="flex flex-col gap-2 text-sm font-medium text-gray-700">
                  Quantity
                  <input
                    type="number"
                    min={0}
                    step="any"
                    value={transaction.quantity}
                    onChange={(event) => updateTransaction(transaction.key, { quantity: parseNumber(event.target.value) })}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                </label>

                {requiresCost(transaction.type) ? (
                  <label className="flex flex-col gap-2 text-sm font-medium text-gray-700">
                    Total cost (USD)
                    <input
                      type="number"
                      min={0}
                      step="any"
                      value={transaction.costUSD ?? 0}
                      onChange={(event) => updateTransaction(transaction.key, { costUSD: parseNumber(event.target.value) })}
                      className="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                  </label>
                ) : null}

                {requiresProceeds(transaction.type) ? (
                  <label className="flex flex-col gap-2 text-sm font-medium text-gray-700">
                    Proceeds / FMV received (USD)
                    <input
                      type="number"
                      min={0}
                      step="any"
                      value={transaction.proceedsUSD ?? 0}
                      onChange={(event) => updateTransaction(transaction.key, {
                        proceedsUSD: parseNumber(event.target.value)
                      })}
                      className="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                  </label>
                ) : null}

                {requiresFairMarketValue(transaction.type) ? (
                  <label className="flex flex-col gap-2 text-sm font-medium text-gray-700">
                    Fair market value (USD)
                    <input
                      type="number"
                      min={0}
                      step="any"
                      value={transaction.fairMarketValueUSD ?? 0}
                      onChange={(event) => updateTransaction(transaction.key, {
                        fairMarketValueUSD: parseNumber(event.target.value)
                      })}
                      className="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                  </label>
                ) : null}

                <label className="md:col-span-2 flex flex-col gap-2 text-sm font-medium text-gray-700">
                  Notes
                  <textarea
                    value={transaction.notes ?? ''}
                    onChange={(event) => updateTransaction(transaction.key, { notes: event.target.value })}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    rows={2}
                  />
                </label>
              </div>
            </div>
          ))}
        </section>

        <button
          type="submit"
          disabled={!canSubmit}
          className="inline-flex items-center rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
        >
          Calculate crypto tax impact
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
                <p className="text-sm uppercase tracking-wide text-blue-300">Capital gains</p>
                <p>Long-term gain: ${result.capitalGains.longTermGain.toLocaleString('en-US')}</p>
                <p>Short-term gain: ${result.capitalGains.shortTermGain.toLocaleString('en-US')}</p>
                <p>Net gain: ${result.capitalGains.netCapitalGain.toLocaleString('en-US')}</p>
                <p>Capital tax: ${result.capitalGains.totalTax.toLocaleString('en-US')}</p>
              </div>
              <div>
                <p className="text-sm uppercase tracking-wide text-blue-300">Ordinary income</p>
                <p>Income from mining/staking/etc.: ${result.ordinaryIncomeUSD.toLocaleString('en-US')}</p>
                <p>Federal tax on ordinary income: ${result.ordinaryIncomeFederalTax.toLocaleString('en-US')}</p>
                <p>State tax on ordinary income: ${result.ordinaryIncomeStateTax.toLocaleString('en-US')}</p>
                <p className="font-semibold">Total estimated tax: ${result.totalEstimatedTax.toLocaleString('en-US')}</p>
              </div>
            </div>
            <p className="mt-4 text-xs text-blue-800">
              Educational {CURRENT_TAX_YEAR} estimate using FIFO lots and simplified selected state rates. Confirm
              wallet transfers and basis before relying on a result. NIIT, fees not entered, local tax, deductions,
              and asset-specific exceptions are not included.
            </p>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">Disposal breakdown</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full table-auto text-left text-sm text-gray-600">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50 text-gray-500">
                    <th className="px-4 py-2">Asset</th>
                    <th className="px-4 py-2">Type</th>
                    <th className="px-4 py-2">Quantity</th>
                    <th className="px-4 py-2">Cost basis</th>
                    <th className="px-4 py-2">Proceeds</th>
                    <th className="px-4 py-2">Gain</th>
                    <th className="px-4 py-2">Holding period</th>
                  </tr>
                </thead>
                <tbody>
                  {result.disposals.map((disposal) => (
                    <tr key={`${disposal.id}-${disposal.lotId}`} className="border-b border-gray-100">
                      <td className="px-4 py-2 font-medium text-gray-800">{disposal.asset}</td>
                      <td className="px-4 py-2">{disposal.transactionType}</td>
                      <td className="px-4 py-2">{disposal.quantity}</td>
                      <td className="px-4 py-2">${disposal.costBasisUSD.toLocaleString('en-US')}</td>
                      <td className="px-4 py-2">${disposal.proceedsUSD.toLocaleString('en-US')}</td>
                      <td className={`px-4 py-2 ${disposal.gainUSD < 0 ? 'text-red-500' : 'text-gray-700'}`}>
                        ${disposal.gainUSD.toLocaleString('en-US')}
                      </td>
                      <td className="px-4 py-2">
                        {Math.round(disposal.holdingPeriodDays / 30)} months ({disposal.isLongTerm ? 'long-term' : 'short-term'})
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {result.warnings.length ? (
            <section className="rounded-2xl border border-yellow-200 bg-yellow-50 p-6 text-sm text-yellow-900">
              <h2 className="text-lg font-semibold">Warnings & assumptions</h2>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                {result.warnings.map((warning) => (
                  <li key={warning}>{warning}</li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
