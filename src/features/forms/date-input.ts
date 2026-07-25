import { isValidIsoDate } from '@/features/calculators/core';

export interface DateInputParts {
  month: string;
  day: string;
  year: string;
}

export const EMPTY_DATE_PARTS: DateInputParts = {
  month: '',
  day: '',
  year: ''
};

export function splitIsoDate(value: string): DateInputParts {
  if (!isValidIsoDate(value)) {
    return { ...EMPTY_DATE_PARTS };
  }

  const [year, month, day] = value.split('-');
  return { month, day, year };
}

export function composeIsoDate(parts: DateInputParts): string | null {
  if (!parts.month || !parts.day || parts.year.length !== 4) {
    return null;
  }

  const month = Number.parseInt(parts.month, 10);
  const day = Number.parseInt(parts.day, 10);
  const year = Number.parseInt(parts.year, 10);
  const value = [
    String(year).padStart(4, '0'),
    String(month).padStart(2, '0'),
    String(day).padStart(2, '0')
  ].join('-');

  return isValidIsoDate(value) ? value : null;
}

export function parseEnglishDate(value: string): string | null {
  const normalized = value.trim();
  const isoMatch = /^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})$/.exec(normalized);
  if (isoMatch) {
    return composeIsoDate({
      month: isoMatch[2],
      day: isoMatch[3],
      year: isoMatch[1]
    });
  }

  const usMatch = /^(\d{1,2})[-/.\s](\d{1,2})[-/.\s](\d{4})$/.exec(normalized);
  if (!usMatch) {
    return null;
  }

  return composeIsoDate({
    month: usMatch[1],
    day: usMatch[2],
    year: usMatch[3]
  });
}

export function areDatePartsEmpty(parts: DateInputParts): boolean {
  return !parts.month && !parts.day && !parts.year;
}
