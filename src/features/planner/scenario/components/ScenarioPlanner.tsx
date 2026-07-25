'use client';

import { useMemo, useState } from 'react';
import { CURRENT_TAX_YEAR, type FilingStatus } from '@/features/calculators/core';
import { EnglishDateField } from '@/features/forms';
import { evaluateScenario } from '@/features/planner/scenario/logic';
import type { BaseScenarioInput, ScenarioAdjustments, ScenarioResult } from '@/features/planner/scenario/types';

const FILING_STATUS_OPTIONS: Array<{ value: FilingStatus; label: string }> = [
  { value: 'single', label: 'Single' },
  { value: 'married_joint', label: 'Married filing jointly' },
  { value: 'married_separate', label: 'Married filing separately' },
  { value: 'head_of_household', label: 'Head of household' }
];

const STATES = ['CA', 'NY', 'TX', 'FL', 'WA', 'MA', 'IL', 'NJ', 'OR', 'CO'];

const DEFAULT_BASE: BaseScenarioInput = {
  purchasePrice: 250000,
  purchaseDate: '2020-01-15',
  salePrice: 420000,
  saleDate: '2026-11-01',
  taxableIncome: 110000,
  state: 'CA',
  filingStatus: 'married_joint'
};

const DEFAULT_SCENARIOS: ScenarioAdjustments[] = [
  {
    label: 'Scenario A',
    saleDateOffsetDays: 0,
    salePriceAdjustmentPercent: 0,
    taxableIncomeAdjustment: 0,
    state: undefined,
    additionalLossHarvestUSD: 0
  },
  {
    label: 'Scenario B',
    saleDateOffsetDays: 60,
    salePriceAdjustmentPercent: -3,
    taxableIncomeAdjustment: -15000,
    state: 'TX',
    additionalLossHarvestUSD: 5000
  }
];

function formatCurrency(value: number): string {
  return `$${value.toLocaleString('en-US')}`;
}

export function ScenarioPlanner() {
  const [base, setBase] = useState<BaseScenarioInput>(DEFAULT_BASE);
  const [scenarios, setScenarios] = useState<ScenarioAdjustments[]>(DEFAULT_SCENARIOS);

  const results = useMemo<ScenarioResult[]>(
    () => scenarios.map((scenario) => evaluateScenario(base, scenario)),
    [base, scenarios]
  );

  const difference = useMemo(() => {
    if (results.length < 2) {
      return null;
    }
    const [first, second] = results;
    return {
      taxDifference: second.totalTax - first.totalTax,
      netGainDifference: second.capitalGains.netCapitalGain - first.capitalGains.netCapitalGain
    };
  }, [results]);

  function updateScenario(index: number, patch: Partial<ScenarioAdjustments>) {
    setScenarios((previous) => previous.map((scenario, idx) => (idx === index ? { ...scenario, ...patch } : scenario)));
  }

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900">Baseline transaction</h2>
        <p className="mt-1 text-sm text-gray-500">
          Set the base purchase and sale assumptions that both scenarios will build from.
        </p>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm font-medium text-gray-700">
            Purchase price
            <input
              type="number"
              min={0}
              value={base.purchasePrice}
              onChange={(event) => setBase((previous) => ({ ...previous, purchasePrice: Number.parseFloat(event.target.value) || 0 }))}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </label>

          <EnglishDateField
            id="scenario-purchase-date"
            label="Purchase date"
            value={base.purchaseDate}
            onChange={(purchaseDate) => setBase((previous) => ({ ...previous, purchaseDate }))}
            required
          />

          <label className="flex flex-col gap-2 text-sm font-medium text-gray-700">
            Expected sale price
            <input
              type="number"
              min={0}
              value={base.salePrice}
              onChange={(event) => setBase((previous) => ({ ...previous, salePrice: Number.parseFloat(event.target.value) || 0 }))}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </label>

          <EnglishDateField
            id="scenario-sale-date"
            label="Target sale date"
            value={base.saleDate}
            min={`${CURRENT_TAX_YEAR}-01-01`}
            max={`${CURRENT_TAX_YEAR}-12-31`}
            onChange={(saleDate) => setBase((previous) => ({ ...previous, saleDate }))}
            helpText={`Use a date in tax year ${CURRENT_TAX_YEAR}.`}
            required
          />

          <label className="flex flex-col gap-2 text-sm font-medium text-gray-700">
            Other taxable income
            <input
              type="number"
              min={0}
              value={base.taxableIncome}
              onChange={(event) => setBase((previous) => ({ ...previous, taxableIncome: Number.parseFloat(event.target.value) || 0 }))}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </label>

          <label className="flex flex-col gap-2 text-sm font-medium text-gray-700">
            Filing status
            <select
              value={base.filingStatus}
              onChange={(event) => setBase((previous) => ({ ...previous, filingStatus: event.target.value as FilingStatus }))}
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
            State
            <select
              value={base.state}
              onChange={(event) => setBase((previous) => ({ ...previous, state: event.target.value }))}
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

      <p className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        This planner uses {CURRENT_TAX_YEAR} federal tables and simplified selected state rates. Keep every adjusted
        sale date inside {CURRENT_TAX_YEAR}; adjustments outside that range are capped to the first or last day of
        the year. NIIT and many state-specific rules are not included.
      </p>

      <section className="grid gap-6 md:grid-cols-2">
        {scenarios.map((scenario, index) => {
          const saleTimingId = `${scenario.label.replace(/\s+/g, '-').toLowerCase()}-timing`; // for aria-describedby
          const priceAdjustmentId = `${scenario.label.replace(/\s+/g, '-').toLowerCase()}-price`;
          return (
            <div key={scenario.label} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">{scenario.label}</h3>
              </div>

              <div className="mt-4 space-y-4 text-sm text-gray-600">
                <label className="flex flex-col gap-2">
                  Sale timing adjustment (days)
                  <input
                    type="range"
                    min={-180}
                    max={180}
                    value={scenario.saleDateOffsetDays}
                    aria-label={`Adjust sale date for ${scenario.label}`}
                    aria-describedby={`${saleTimingId}-help`}
                    onChange={(event) => updateScenario(index, { saleDateOffsetDays: Number.parseInt(event.target.value, 10) })}
                  />
                  <span id={`${saleTimingId}-help`} className="text-xs text-gray-500">
                    {scenario.saleDateOffsetDays} days relative to baseline
                  </span>
                </label>

                <label className="flex flex-col gap-2">
                  Sale price adjustment (%)
                  <input
                    type="range"
                    min={-15}
                    max={15}
                    step={0.5}
                    value={scenario.salePriceAdjustmentPercent}
                    aria-label={`Adjust sale price assumption for ${scenario.label}`}
                    aria-describedby={`${priceAdjustmentId}-help`}
                    onChange={(event) => updateScenario(index, { salePriceAdjustmentPercent: Number.parseFloat(event.target.value) })}
                  />
                  <span id={`${priceAdjustmentId}-help`} className="text-xs text-gray-500">
                    {scenario.salePriceAdjustmentPercent}% vs. baseline price
                  </span>
                </label>

              <label className="flex flex-col gap-2">
                Taxable income adjustment (USD)
                <input
                  type="number"
                  value={scenario.taxableIncomeAdjustment}
                  onChange={(event) => updateScenario(index, { taxableIncomeAdjustment: Number.parseFloat(event.target.value) || 0 })}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
                <span className="text-xs text-gray-500">Use negative values to model income deferral</span>
              </label>

              <label className="flex flex-col gap-2">
                Hypothetical loss harvesting (USD)
                <input
                  type="number"
                  min={0}
                  value={scenario.additionalLossHarvestUSD}
                  onChange={(event) => updateScenario(index, { additionalLossHarvestUSD: Math.max(0, Number.parseFloat(event.target.value) || 0) })}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </label>

              <label className="flex flex-col gap-2">
                Residency for this scenario
                <select
                  value={scenario.state ?? ''}
                  onChange={(event) => updateScenario(index, { state: event.target.value || undefined })}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                >
                  <option value="">Use baseline state ({base.state})</option>
                  {STATES.map((stateCode) => (
                    <option key={stateCode} value={stateCode}>
                      {stateCode}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="mt-6 rounded-xl border border-gray-100 bg-gray-50 p-4 text-sm text-gray-700">
              <p className="font-semibold text-gray-900">Estimated results</p>
              <p className="mt-2">Adjusted sale date: {results[index].saleDate}</p>
              <p className="mt-1">Total tax: {formatCurrency(results[index].totalTax)}</p>
              <p className="mt-1">Net gain: {formatCurrency(results[index].capitalGains.netCapitalGain)}</p>
              <p className="mt-1">Long-term gain: {formatCurrency(results[index].capitalGains.longTermGain)}</p>
              <p className="mt-1">Short-term gain: {formatCurrency(results[index].capitalGains.shortTermGain)}</p>
            </div>
          </div>
          );
        })}
      </section>

      {difference ? (
        <section className="rounded-2xl border border-blue-100 bg-blue-50 p-6 text-blue-900">
          <h2 className="text-xl font-semibold">Scenario comparison</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div>
              <p className="text-sm uppercase tracking-wide text-blue-300">Tax difference</p>
              <p className={difference.taxDifference < 0 ? 'text-green-600 font-semibold' : 'text-blue-900 font-semibold'}>
                {difference.taxDifference < 0 ? '-' : '+'}
                {formatCurrency(Math.abs(difference.taxDifference))}
              </p>
            </div>
            <div>
              <p className="text-sm uppercase tracking-wide text-blue-300">Net gain difference</p>
              <p className={difference.netGainDifference > 0 ? 'text-green-600 font-semibold' : 'text-blue-900 font-semibold'}>
                {difference.netGainDifference > 0 ? '+' : ''}
                {formatCurrency(difference.netGainDifference)}
              </p>
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
