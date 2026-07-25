import { describe, expect, it } from 'vitest';
import {
  composeIsoDate,
  parseEnglishDate,
  splitIsoDate
} from '@/features/forms/date-input';
import {
  formatIsoDateEnglish,
  getLongTermStartDate,
  isValidIsoDate
} from '@/features/calculators/core';

describe('English date input helpers', () => {
  it('converts between segmented US date fields and ISO values', () => {
    expect(composeIsoDate({ month: '2', day: '8', year: '2026' })).toBe('2026-02-08');
    expect(splitIsoDate('2026-12-31')).toEqual({
      month: '12',
      day: '31',
      year: '2026'
    });
  });

  it('accepts pasted US and ISO dates', () => {
    expect(parseEnglishDate('2/28/2025')).toBe('2025-02-28');
    expect(parseEnglishDate('02-28-2025')).toBe('2025-02-28');
    expect(parseEnglishDate('2025-02-28')).toBe('2025-02-28');
  });

  it('rejects incomplete and impossible dates', () => {
    expect(composeIsoDate({ month: '2', day: '29', year: '2025' })).toBeNull();
    expect(parseEnglishDate('13/10/2026')).toBeNull();
    expect(parseEnglishDate('2/2/26')).toBeNull();
    expect(isValidIsoDate('2026-02-30')).toBe(false);
    expect(isValidIsoDate('2026-2-3')).toBe(false);
  });

  it('formats dates in deterministic English', () => {
    expect(formatIsoDateEnglish('2026-03-01')).toBe('March 1, 2026');
  });

  it('returns the first long-term eligible date after the anniversary', () => {
    expect(getLongTermStartDate('2025-02-28')).toBe('2026-03-01');
    expect(getLongTermStartDate('2024-02-29')).toBe('2025-03-02');
    expect(getLongTermStartDate('not-a-date')).toBeNull();
  });
});
