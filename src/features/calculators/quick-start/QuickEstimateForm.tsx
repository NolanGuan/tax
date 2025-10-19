'use client';

import { useMemo, useState } from 'react';
import { calculateCapitalGains, type CapitalGainsBreakdown, type FilingStatus } from '@/features/calculators/core';

interface FormState {
  purchasePrice: string;
  salePrice: string;
  purchaseDate: string;
  saleDate: string;
  taxableIncome: string;
  filingStatus: FilingStatus;
  state: string;
}

const DEFAULT_STATE: FormState = {
  purchasePrice: '',
  salePrice: '',
  purchaseDate: '',
  saleDate: '',
  taxableIncome: '',
  filingStatus: 'single',
  state: 'CA'
};

const STATES = [
  'AL',
  'AK',
  'AZ',
  'CA',
  'CO',
  'CT',
  'DC',
  'FL',
  'GA',
  'IL',
  'MA',
  'MD',
  'NC',
  'NJ',
  'NY',
  'OH',
  'OR',
  'PA',
  'TX',
  'WA'
];

const FILING_STATUS_LABELS: Record<FilingStatus, string> = {
  single: 'Single',
  married_joint: 'Married filing jointly',
  married_separate: 'Married filing separately',
  head_of_household: 'Head of household'
};

function parseCurrency(value: string): number {
  const number = Number.parseFloat(value.replace(/,/g, ''));
  return Number.isFinite(number) ? number : 0;
}

function formatCurrency(value: number): string {
  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD'
  });
}

export function QuickEstimateForm() {
  const [form, setForm] = useState<FormState>(DEFAULT_STATE);
  const [result, setResult] = useState<CapitalGainsBreakdown | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  const canSubmit = useMemo(() => {
    const purchase = parseCurrency(form.purchasePrice);
    const sale = parseCurrency(form.salePrice);
    return Boolean(
      form.purchasePrice &&
      form.salePrice &&
      form.purchaseDate &&
      form.saleDate &&
      sale > 0 &&
      purchase >= 0
    );
  }, [form]);

  function handleChange<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((previous) => ({ ...previous, [key]: value }));
  }

  function validateForm(): string[] {
    const issues: string[] = [];
    const purchasePrice = parseCurrency(form.purchasePrice);
    const salePrice = parseCurrency(form.salePrice);
    const taxableIncome = parseCurrency(form.taxableIncome);

    if (purchasePrice < 0) {
      issues.push('Purchase price must be zero or positive.');
    }

    if (salePrice <= 0) {
      issues.push('Sale price must be greater than zero.');
    }

    if (taxableIncome < 0) {
      issues.push('Taxable income cannot be negative.');
    }

    if (!form.purchaseDate || !form.saleDate) {
      issues.push('Purchase and sale dates are required.');
    } else {
      const purchaseDate = Date.parse(form.purchaseDate);
      const saleDate = Date.parse(form.saleDate);

      if (Number.isNaN(purchaseDate) || Number.isNaN(saleDate)) {
        issues.push('Dates must be valid calendar dates.');
      } else {
        if (saleDate <= purchaseDate) {
          issues.push('Sale date must be after the purchase date.');
        }

        const maxHoldingPeriodDays = 365 * 30;
        const holdingPeriodDays = Math.floor((saleDate - purchaseDate) / (1000 * 60 * 60 * 24));
        if (holdingPeriodDays > maxHoldingPeriodDays) {
          issues.push('Holding period exceeds 30 years; please verify the transaction dates.');
        }
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

    const purchasePrice = parseCurrency(form.purchasePrice);
    const salePrice = parseCurrency(form.salePrice);
    const taxableIncome = parseCurrency(form.taxableIncome);

    const breakdown = calculateCapitalGains({
      taxYear: 2025,
      filingStatus: form.filingStatus,
      taxableIncome,
      state: form.state,
      transactions: [
        {
          id: 'quick-estimate',
          label: 'Quick estimate',
          purchasePrice,
          salePrice,
          purchaseDate: form.purchaseDate,
          saleDate: form.saleDate
        }
      ]
    });

    setErrors([]);
    setResult(breakdown);
  }

  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-gray-900">Run a quick Gain Tax Calculator estimate</h2>
        <p className="text-sm text-gray-600">
          Enter the basics for a single asset sale to preview 2025 federal and state capital gains tax before you commit to the transaction.
        </p>
      </div>

      <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
        <label className="flex flex-col gap-2 text-sm font-medium text-gray-700">
          Purchase price
          <input
            type="number"
            inputMode="decimal"
            min="0"
            step="0.01"
            value={form.purchasePrice}
            onChange={(event) => handleChange('purchasePrice', event.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            placeholder="200000"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium text-gray-700">
          Sale price
          <input
            type="number"
            inputMode="decimal"
            min="0"
            step="0.01"
            value={form.salePrice}
            onChange={(event) => handleChange('salePrice', event.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            placeholder="350000"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium text-gray-700">
          Purchase date
          <input
            type="date"
            value={form.purchaseDate}
            onChange={(event) => handleChange('purchaseDate', event.target.value)}
            lang="en"
            placeholder="YYYY-MM-DD"
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium text-gray-700">
          Sale date
          <input
            type="date"
            value={form.saleDate}
            onChange={(event) => handleChange('saleDate', event.target.value)}
            lang="en"
            placeholder="YYYY-MM-DD"
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium text-gray-700">
          Taxable income (excluding this gain)
          <input
            type="number"
            inputMode="decimal"
            min="0"
            step="0.01"
            value={form.taxableIncome}
            onChange={(event) => handleChange('taxableIncome', event.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            placeholder="120000"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium text-gray-700">
          Filing status
          <select
            value={form.filingStatus}
            onChange={(event) => handleChange('filingStatus', event.target.value as FilingStatus)}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          >
            {Object.entries(FILING_STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium text-gray-700">
          State
          <select
            value={form.state}
            onChange={(event) => handleChange('state', event.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          >
            {STATES.map((stateCode) => (
              <option key={stateCode} value={stateCode}>
                {stateCode}
              </option>
            ))}
          </select>
        </label>

        <div className="md:col-span-2 flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={!canSubmit}
            className="inline-flex items-center rounded-full bg-blue-600 px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
          >
            Calculate estimate
          </button>
          <button
            type="button"
            className="text-sm font-medium text-gray-500 underline-offset-4 hover:text-gray-700 hover:underline"
            onClick={() => {
              setForm(DEFAULT_STATE);
              setResult(null);
              setErrors([]);
            }}
          >
            Reset form
          </button>
        </div>
      </form>

      {errors.length > 0 ? (
        <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <p className="font-semibold">Please fix the following before calculating:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {result ? (
        <div className="mt-6 grid gap-4 rounded-2xl border border-blue-100 bg-blue-50 p-6 text-sm text-blue-900 md:grid-cols-2">
          <div className="space-y-1">
            <p className="font-semibold uppercase tracking-wide text-xs text-blue-600">Summary</p>
            <p>Net capital gain: {formatCurrency(result.netCapitalGain)}</p>
            <p>Federal tax: {formatCurrency(result.federalTax)}</p>
            <p>State tax: {formatCurrency(result.stateTax)}</p>
            <p>Total tax: {formatCurrency(result.totalTax)}</p>
          </div>
          <div className="space-y-1">
            <p className="font-semibold uppercase tracking-wide text-xs text-blue-600">Key rates</p>
            <p>Short-term marginal rate: {(result.details.shortTermMarginalRate * 100).toFixed(1)}%</p>
            <p>Long-term rate: {(result.details.longTermRate * 100).toFixed(1)}%</p>
            <p>State rate: {(result.details.stateRate * 100).toFixed(2)}%</p>
            <p>Effective rate: {(result.effectiveRate * 100).toFixed(1)}%</p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
