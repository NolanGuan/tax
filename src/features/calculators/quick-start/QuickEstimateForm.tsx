'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  calculateCapitalGains,
  CURRENT_TAX_YEAR,
  formatIsoDateEnglish,
  getHoldingPeriodDays,
  getLongTermStartDate,
  isLongTermHoldingPeriod,
  isValidIsoDate,
  type CapitalGainsBreakdown,
  type FilingStatus
} from '@/features/calculators/core';
import { EnglishDateField } from '@/features/forms';

interface FormState {
  purchasePrice: string;
  salePrice: string;
  buyingCosts: string;
  sellingCosts: string;
  purchaseDate: string;
  saleDate: string;
  taxableIncome: string;
  filingStatus: FilingStatus;
  state: string;
}

type FieldErrors = Partial<Record<keyof FormState, string>>;

const DEFAULT_STATE: FormState = {
  purchasePrice: '',
  salePrice: '',
  buyingCosts: '',
  sellingCosts: '',
  purchaseDate: '',
  saleDate: '',
  taxableIncome: '',
  filingStatus: 'single',
  state: ''
};

const STATES = [
  { code: 'AL', name: 'Alabama' },
  { code: 'AK', name: 'Alaska' },
  { code: 'AZ', name: 'Arizona' },
  { code: 'CA', name: 'California' },
  { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' },
  { code: 'DC', name: 'District of Columbia' },
  { code: 'FL', name: 'Florida' },
  { code: 'GA', name: 'Georgia' },
  { code: 'IL', name: 'Illinois' },
  { code: 'MA', name: 'Massachusetts' },
  { code: 'MD', name: 'Maryland' },
  { code: 'NC', name: 'North Carolina' },
  { code: 'NJ', name: 'New Jersey' },
  { code: 'NY', name: 'New York' },
  { code: 'OH', name: 'Ohio' },
  { code: 'OR', name: 'Oregon' },
  { code: 'PA', name: 'Pennsylvania' },
  { code: 'TX', name: 'Texas' },
  { code: 'WA', name: 'Washington' }
];

const FILING_STATUS_LABELS: Record<FilingStatus, string> = {
  single: 'Single',
  married_joint: 'Married filing jointly',
  married_separate: 'Married filing separately',
  head_of_household: 'Head of household'
};

const INPUT_CLASS =
  'rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200';
const ERROR_INPUT_CLASS =
  'rounded-lg border border-red-400 px-4 py-2 text-sm text-gray-900 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-100';

function parseCurrency(value: string): number {
  const number = Number.parseFloat(value.replace(/[$,\s]/g, ''));
  return Number.isFinite(number) ? number : 0;
}

function cleanCurrencyInput(value: string): string {
  const cleaned = value.replace(/[^\d.,]/g, '').replace(/,/g, '');
  const [whole, ...decimals] = cleaned.split('.');
  return decimals.length ? `${whole}.${decimals.join('').slice(0, 2)}` : whole;
}

function formatCurrencyInput(value: string): string {
  if (!value.trim()) {
    return '';
  }

  return parseCurrency(value).toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  });
}

function formatCurrency(value: number): string {
  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  });
}

interface CurrencyFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  error?: string;
  helpText?: string;
  required?: boolean;
}

function CurrencyField({
  id,
  label,
  value,
  onChange,
  placeholder,
  error,
  helpText,
  required = false
}: CurrencyFieldProps) {
  const helpId = helpText ? `${id}-help` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [helpId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <label htmlFor={id} className="flex min-w-0 flex-col gap-2 text-sm font-medium text-gray-700">
      <span>
        {label}
        {required ? <span className="ml-1 text-red-600" aria-hidden="true">*</span> : null}
      </span>
      <span className="relative">
        <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-gray-500" aria-hidden="true">
          $
        </span>
        <input
          id={id}
          type="text"
          inputMode="decimal"
          value={value}
          onChange={(event) => onChange(cleanCurrencyInput(event.target.value))}
          onBlur={() => onChange(formatCurrencyInput(value))}
          placeholder={placeholder}
          aria-describedby={describedBy}
          aria-invalid={error ? 'true' : undefined}
          aria-required={required ? 'true' : undefined}
          className={`${error ? ERROR_INPUT_CLASS : INPUT_CLASS} w-full pl-8`}
        />
      </span>
      {helpText ? (
        <span id={helpId} className="text-xs font-normal text-gray-500">
          {helpText}
        </span>
      ) : null}
      {error ? (
        <span id={errorId} className="text-xs font-medium text-red-700" role="alert">
          {error}
        </span>
      ) : null}
    </label>
  );
}

export function QuickEstimateForm() {
  const [form, setForm] = useState<FormState>(DEFAULT_STATE);
  const [result, setResult] = useState<CapitalGainsBreakdown | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [copyStatus, setCopyStatus] = useState('');
  const [formVersion, setFormVersion] = useState(0);
  const errorSummaryRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLElement>(null);

  const canSubmit = useMemo(() => {
    const purchase = parseCurrency(form.purchasePrice);
    const sale = parseCurrency(form.salePrice);
    return Boolean(
      form.purchasePrice &&
      form.salePrice &&
      form.purchaseDate &&
      form.saleDate &&
      form.state &&
      sale > 0 &&
      purchase >= 0
    );
  }, [form]);

  const holdingPreview = useMemo(() => {
    if (!isValidIsoDate(form.purchaseDate) || !isValidIsoDate(form.saleDate)) {
      return null;
    }

    return {
      days: getHoldingPeriodDays(form.purchaseDate, form.saleDate),
      isLongTerm: isLongTermHoldingPeriod(form.purchaseDate, form.saleDate),
      longTermStartDate: getLongTermStartDate(form.purchaseDate)
    };
  }, [form.purchaseDate, form.saleDate]);

  useEffect(() => {
    if (errors.length) {
      errorSummaryRef.current?.focus();
    }
  }, [errors]);

  useEffect(() => {
    if (result) {
      resultRef.current?.focus();
    }
  }, [result]);

  function handleChange<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((previous) => ({ ...previous, [key]: value }));
    setFieldErrors((previous) => {
      if (!previous[key]) {
        return previous;
      }
      const next = { ...previous };
      delete next[key];
      return next;
    });
    setResult(null);
    setCopyStatus('');
  }

  function validateForm(): { issues: string[]; fields: FieldErrors } {
    const issues: string[] = [];
    const fields: FieldErrors = {};
    const purchasePrice = parseCurrency(form.purchasePrice);
    const salePrice = parseCurrency(form.salePrice);
    const buyingCosts = parseCurrency(form.buyingCosts);
    const sellingCosts = parseCurrency(form.sellingCosts);
    const taxableIncome = parseCurrency(form.taxableIncome);

    if (!form.purchasePrice || purchasePrice < 0) {
      fields.purchasePrice = 'Enter a purchase price of zero or more.';
    }
    if (!form.salePrice || salePrice <= 0) {
      fields.salePrice = 'Enter a sale price greater than zero.';
    }
    if (buyingCosts < 0) {
      fields.buyingCosts = 'Buying costs cannot be negative.';
    }
    if (sellingCosts < 0) {
      fields.sellingCosts = 'Selling costs cannot be negative.';
    }
    if (salePrice - sellingCosts < 0) {
      fields.sellingCosts = 'Selling costs cannot exceed the sale price.';
    }
    if (taxableIncome < 0) {
      fields.taxableIncome = 'Taxable income cannot be negative.';
    }
    if (!form.purchaseDate) {
      fields.purchaseDate = 'Enter the purchase date.';
    }
    if (!form.saleDate) {
      fields.saleDate = 'Enter the sale date.';
    }
    if (!form.state) {
      fields.state = 'Select the state used for this estimate.';
    }

    if (form.purchaseDate && form.saleDate) {
      const purchaseDate = Date.parse(form.purchaseDate);
      const saleDate = Date.parse(form.saleDate);

      if (saleDate <= purchaseDate) {
        fields.saleDate = 'Sale date must be after the purchase date.';
      } else if (new Date(saleDate).getUTCFullYear() !== CURRENT_TAX_YEAR) {
        fields.saleDate = `Sale date must be in tax year ${CURRENT_TAX_YEAR}.`;
      } else {
        const holdingPeriodDays = getHoldingPeriodDays(form.purchaseDate, form.saleDate);
        if (holdingPeriodDays > 365 * 30) {
          issues.push('Holding period exceeds 30 years; verify the transaction dates.');
        }
      }
    }

    const fieldIssues = Object.values(fields);
    if (fieldIssues.length) {
      issues.unshift(...fieldIssues);
    }

    return { issues, fields };
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validation = validateForm();
    if (validation.issues.length) {
      setErrors(validation.issues);
      setFieldErrors(validation.fields);
      setResult(null);
      return;
    }

    const purchasePrice = parseCurrency(form.purchasePrice) + parseCurrency(form.buyingCosts);
    const salePrice = parseCurrency(form.salePrice) - parseCurrency(form.sellingCosts);
    const taxableIncome = parseCurrency(form.taxableIncome);

    const breakdown = calculateCapitalGains({
      taxYear: CURRENT_TAX_YEAR,
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
    setFieldErrors({});
    setResult(breakdown);
  }

  function resetForm() {
    setForm(DEFAULT_STATE);
    setResult(null);
    setErrors([]);
    setFieldErrors({});
    setCopyStatus('');
    setFormVersion((current) => current + 1);
  }

  async function copyResult() {
    if (!result || !holdingPreview) {
      return;
    }

    const summary = [
      `${CURRENT_TAX_YEAR} capital gains estimate`,
      `Total estimated tax: ${formatCurrency(result.totalTax)}`,
      `After-tax gain: ${formatCurrency(result.netCapitalGain - result.totalTax)}`,
      `Effective tax rate: ${(result.effectiveRate * 100).toFixed(1)}%`,
      `Holding period: ${holdingPreview.isLongTerm ? 'Long-term' : 'Short-term'} (${holdingPreview.days.toLocaleString('en-US')} days)`,
      'Educational estimate only — review assumptions before making a tax decision.'
    ].join('\n');

    try {
      await navigator.clipboard.writeText(summary);
      setCopyStatus('Result copied.');
    } catch {
      setCopyStatus('Copy is unavailable in this browser.');
    }
  }

  const missingMessage = canSubmit
    ? 'Ready to calculate.'
    : 'Enter both prices and dates, then select a state to calculate.';

  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8">
      <div className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl font-semibold text-gray-900">Run a quick Gain Tax Calculator estimate</h2>
          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
            {CURRENT_TAX_YEAR} estimate
          </span>
        </div>
        <p className="text-sm text-gray-600">
          Estimate one asset sale with 2026 federal brackets and a simplified selected state rate.
        </p>
        <p className="text-xs text-gray-500">
          Fields marked with <span className="font-semibold text-red-600">*</span> are required.
        </p>
      </div>

      <form className="mt-6 space-y-7" onSubmit={handleSubmit} noValidate>
        <section aria-labelledby="transaction-details-title">
          <div className="border-b border-gray-200 pb-3">
            <h3 id="transaction-details-title" className="text-lg font-semibold text-gray-900">
              1. Transaction details
            </h3>
            <p className="mt-1 text-sm text-gray-500">Enter what you paid, what you expect to receive, and the transaction dates.</p>
          </div>

          <div className="mt-4 grid gap-5 md:grid-cols-2">
            <CurrencyField
              id="purchase-price"
              label="Purchase price"
              value={form.purchasePrice}
              onChange={(value) => handleChange('purchasePrice', value)}
              placeholder="200,000"
              error={fieldErrors.purchasePrice}
              required
            />
            <CurrencyField
              id="sale-price"
              label="Sale price"
              value={form.salePrice}
              onChange={(value) => handleChange('salePrice', value)}
              placeholder="350,000"
              error={fieldErrors.salePrice}
              required
            />

            <EnglishDateField
              key={`purchase-date-${formVersion}`}
              id="purchase-date"
              label="Purchase date"
              value={form.purchaseDate}
              onChange={(value) => handleChange('purchaseDate', value)}
              error={fieldErrors.purchaseDate}
              required
            />
            <EnglishDateField
              key={`sale-date-${formVersion}`}
              id="sale-date"
              label="Sale date"
              value={form.saleDate}
              min={`${CURRENT_TAX_YEAR}-01-01`}
              max={`${CURRENT_TAX_YEAR}-12-31`}
              onChange={(value) => handleChange('saleDate', value)}
              helpText={`Use a sale date in tax year ${CURRENT_TAX_YEAR}.`}
              error={fieldErrors.saleDate}
              required
            />

            {form.purchaseDate && getLongTermStartDate(form.purchaseDate) ? (
              <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-900 md:col-span-2">
                <p className="font-semibold">
                  Long-term treatment starts {formatIsoDateEnglish(getLongTermStartDate(form.purchaseDate) ?? '')}.
                </p>
                {holdingPreview ? (
                  <p className="mt-1">
                    This sale is currently <strong>{holdingPreview.isLongTerm ? 'long-term' : 'short-term'}</strong> after{' '}
                    {holdingPreview.days.toLocaleString('en-US')} days.
                  </p>
                ) : (
                  <p className="mt-1">Enter the sale date to check the holding-period treatment.</p>
                )}
              </div>
            ) : null}

            <details className="rounded-xl border border-gray-200 bg-gray-50 p-4 md:col-span-2">
              <summary className="cursor-pointer text-sm font-semibold text-gray-800">
                Advanced: transaction costs
              </summary>
              <p className="mt-2 text-xs text-gray-500">
                Optional costs adjust the estimated tax basis and net gain.
              </p>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <CurrencyField
                  id="buying-costs"
                  label="Buying costs"
                  value={form.buyingCosts}
                  onChange={(value) => handleChange('buyingCosts', value)}
                  placeholder="0"
                  error={fieldErrors.buyingCosts}
                />
                <CurrencyField
                  id="selling-costs"
                  label="Selling costs"
                  value={form.sellingCosts}
                  onChange={(value) => handleChange('sellingCosts', value)}
                  placeholder="0"
                  error={fieldErrors.sellingCosts}
                />
              </div>
            </details>
          </div>
        </section>

        <section aria-labelledby="tax-profile-title">
          <div className="border-b border-gray-200 pb-3">
            <h3 id="tax-profile-title" className="text-lg font-semibold text-gray-900">
              2. Tax profile
            </h3>
            <p className="mt-1 text-sm text-gray-500">These details determine the federal bracket and simplified state estimate.</p>
          </div>

          <div className="mt-4 grid gap-5 md:grid-cols-2">
            <CurrencyField
              id="taxable-income"
              label="Taxable income excluding this gain"
              value={form.taxableIncome}
              onChange={(value) => handleChange('taxableIncome', value)}
              placeholder="120,000"
              helpText="Use taxable income before adding this transaction."
              error={fieldErrors.taxableIncome}
            />

            <label className="flex flex-col gap-2 text-sm font-medium text-gray-700" htmlFor="filing-status">
              Filing status
              <select
                id="filing-status"
                value={form.filingStatus}
                onChange={(event) => handleChange('filingStatus', event.target.value as FilingStatus)}
                className={INPUT_CLASS}
              >
                {Object.entries(FILING_STATUS_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-2 text-sm font-medium text-gray-700" htmlFor="state">
              <span>
                State
                <span className="ml-1 text-red-600" aria-hidden="true">*</span>
              </span>
              <select
                id="state"
                value={form.state}
                onChange={(event) => handleChange('state', event.target.value)}
                aria-invalid={fieldErrors.state ? 'true' : undefined}
                aria-describedby={fieldErrors.state ? 'state-error' : undefined}
                aria-required="true"
                className={fieldErrors.state ? ERROR_INPUT_CLASS : INPUT_CLASS}
              >
                <option value="" disabled>
                  Select a state
                </option>
                {STATES.map((state) => (
                  <option key={state.code} value={state.code}>
                    {state.name} ({state.code})
                  </option>
                ))}
              </select>
              <span className="text-xs font-normal text-gray-500">
                We apply a simplified selected state rate, not a full state return.
              </span>
              {fieldErrors.state ? (
                <span id="state-error" className="text-xs font-medium text-red-700" role="alert">
                  {fieldErrors.state}
                </span>
              ) : null}
            </label>
          </div>
        </section>

        <div className="flex flex-col gap-3 border-t border-gray-200 pt-5 sm:flex-row sm:items-center">
          <button
            type="submit"
            disabled={!canSubmit}
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-blue-600 px-7 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
          >
            Calculate estimate
          </button>
          <button
            type="button"
            className="inline-flex min-h-11 items-center justify-center px-4 text-sm font-medium text-gray-500 underline-offset-4 hover:text-gray-700 hover:underline"
            onClick={resetForm}
          >
            Reset form
          </button>
          <p className="text-xs text-gray-500" aria-live="polite">
            {missingMessage}
          </p>
        </div>
      </form>

      {errors.length > 0 ? (
        <div
          ref={errorSummaryRef}
          className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
          role="alert"
          tabIndex={-1}
        >
          <p className="font-semibold">Please fix the following before calculating:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {[...new Set(errors)].map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {result && holdingPreview ? (
        <section
          ref={resultRef}
          className="mt-7 rounded-2xl border border-blue-200 bg-blue-50 p-5 text-blue-950 outline-none focus:ring-2 focus:ring-blue-300 sm:p-6"
          aria-labelledby="estimate-result-title"
          aria-live="polite"
          tabIndex={-1}
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">Your estimate</p>
              <h3 id="estimate-result-title" className="mt-1 text-2xl font-semibold">
                Estimated tax outcome
              </h3>
            </div>
            <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-blue-700">
              {CURRENT_TAX_YEAR} rates
            </span>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Estimated total tax</p>
              <p className="mt-2 text-2xl font-bold text-gray-950">{formatCurrency(result.totalTax)}</p>
            </div>
            <div className="rounded-xl bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">After-tax gain</p>
              <p className="mt-2 text-2xl font-bold text-gray-950">
                {formatCurrency(result.netCapitalGain - result.totalTax)}
              </p>
            </div>
            <div className="rounded-xl bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Effective tax rate</p>
              <p className="mt-2 text-2xl font-bold text-gray-950">
                {(result.effectiveRate * 100).toFixed(1)}%
              </p>
            </div>
            <div className="rounded-xl bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Holding period</p>
              <p className="mt-2 text-xl font-bold text-gray-950">
                {holdingPreview.isLongTerm ? 'Long-term' : 'Short-term'}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                {holdingPreview.days.toLocaleString('en-US')} days
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            <div className="rounded-xl border border-blue-100 bg-white/80 p-4 text-sm">
              <h4 className="font-semibold text-gray-900">Tax breakdown</h4>
              <dl className="mt-3 space-y-2 text-gray-700">
                <div className="flex items-center justify-between gap-4">
                  <dt>Net capital gain</dt>
                  <dd className="font-semibold">{formatCurrency(result.netCapitalGain)}</dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt>Federal tax</dt>
                  <dd className="font-semibold">{formatCurrency(result.federalTax)}</dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt>State tax</dt>
                  <dd className="font-semibold">{formatCurrency(result.stateTax)}</dd>
                </div>
              </dl>
            </div>

            <div className="rounded-xl border border-blue-100 bg-white/80 p-4 text-sm">
              <h4 className="font-semibold text-gray-900">Why this result</h4>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-gray-700">
                <li>
                  The sale is treated as {holdingPreview.isLongTerm ? 'long-term' : 'short-term'} based on the dates entered.
                </li>
                <li>
                  The applied federal {holdingPreview.isLongTerm ? 'long-term' : 'short-term marginal'} rate is{' '}
                  {(
                    (holdingPreview.isLongTerm
                      ? result.details.longTermRate
                      : result.details.shortTermMarginalRate) * 100
                  ).toFixed(1)}
                  %.
                </li>
                <li>The simplified selected state rate is {(result.details.stateRate * 100).toFixed(2)}%.</li>
              </ul>
            </div>
          </div>

          <details className="mt-4 rounded-xl border border-blue-100 bg-white/70 p-4 text-sm">
            <summary className="cursor-pointer font-semibold text-gray-900">Assumptions and limitations</summary>
            <p className="mt-2 text-xs leading-5 text-gray-600">
              Educational {CURRENT_TAX_YEAR} estimate only. NIIT, local taxes, deductions, surcharges, carryovers,
              and special asset rules are not included. State tax uses a simplified selected rate. Transaction costs
              are included only when entered above.
            </p>
          </details>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Link
              href="/calculator/scenario-planner"
              className="inline-flex min-h-11 items-center rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Compare sale timing
            </Link>
            <button
              type="button"
              onClick={copyResult}
              className="inline-flex min-h-11 items-center rounded-full border border-blue-300 bg-white px-5 py-2 text-sm font-semibold text-blue-800 hover:border-blue-500"
            >
              Copy result
            </button>
            <span className="text-xs font-medium text-blue-800" role="status" aria-live="polite">
              {copyStatus}
            </span>
          </div>
        </section>
      ) : null}
    </div>
  );
}
