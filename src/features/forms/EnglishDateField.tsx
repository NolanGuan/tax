'use client';

import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ClipboardEvent,
  type KeyboardEvent
} from 'react';
import {
  areDatePartsEmpty,
  composeIsoDate,
  parseEnglishDate,
  splitIsoDate,
  type DateInputParts
} from './date-input';
import { formatIsoDateEnglish } from '@/features/calculators/core';

interface EnglishDateFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  helpText?: string;
  error?: string;
  required?: boolean;
  min?: string;
  max?: string;
  className?: string;
}

type DatePartKey = keyof DateInputParts;

const DATE_PART_LIMITS: Record<DatePartKey, number> = {
  month: 2,
  day: 2,
  year: 4
};

const DATE_PART_LABELS: Record<DatePartKey, string> = {
  month: 'Month',
  day: 'Day',
  year: 'Year'
};

function formatConstraint(value: string): string {
  return formatIsoDateEnglish(value) || value;
}

export function EnglishDateField({
  id,
  label,
  value,
  onChange,
  helpText = 'Enter the date as month, day, and four-digit year.',
  error,
  required = false,
  min,
  max,
  className = ''
}: EnglishDateFieldProps) {
  const generatedId = useId();
  const helpId = `${id}-${generatedId}-help`;
  const errorId = `${id}-${generatedId}-error`;
  const fieldsetRef = useRef<HTMLFieldSetElement>(null);
  const monthRef = useRef<HTMLInputElement>(null);
  const dayRef = useRef<HTMLInputElement>(null);
  const yearRef = useRef<HTMLInputElement>(null);
  const lastEmittedValue = useRef(value);
  const [parts, setParts] = useState<DateInputParts>(() => splitIsoDate(value));
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    if (value === lastEmittedValue.current) {
      return;
    }
    lastEmittedValue.current = value;
    setParts(splitIsoDate(value));
    setLocalError('');
  }, [value]);

  const visibleError = error || localError;
  const describedBy = useMemo(
    () => [helpId, visibleError ? errorId : ''].filter(Boolean).join(' '),
    [errorId, helpId, visibleError]
  );

  function emit(nextValue: string) {
    lastEmittedValue.current = nextValue;
    onChange(nextValue);
  }

  function validate(nextParts: DateInputParts): string {
    if (areDatePartsEmpty(nextParts)) {
      return required ? `Enter ${label.toLowerCase()}.` : '';
    }

    const isoDate = composeIsoDate(nextParts);
    if (!isoDate) {
      return `Enter a valid ${label.toLowerCase()}.`;
    }
    if (min && isoDate < min) {
      return `${label} must be on or after ${formatConstraint(min)}.`;
    }
    if (max && isoDate > max) {
      return `${label} must be on or before ${formatConstraint(max)}.`;
    }

    return '';
  }

  function commit(nextParts: DateInputParts) {
    const isoDate = composeIsoDate(nextParts);
    if (isoDate && (!min || isoDate >= min) && (!max || isoDate <= max)) {
      setLocalError('');
      emit(isoDate);
      return;
    }
    emit('');
  }

  function updatePart(part: DatePartKey, rawValue: string) {
    const sanitized = rawValue.replace(/\D/g, '').slice(0, DATE_PART_LIMITS[part]);
    const nextParts = { ...parts, [part]: sanitized };
    setParts(nextParts);
    setLocalError('');
    commit(nextParts);

    if (part === 'month' && sanitized.length === 2) {
      dayRef.current?.focus();
    } else if (part === 'day' && sanitized.length === 2) {
      yearRef.current?.focus();
    }
  }

  function handlePaste(event: ClipboardEvent<HTMLInputElement>) {
    const parsed = parseEnglishDate(event.clipboardData.getData('text'));
    if (!parsed || (min && parsed < min) || (max && parsed > max)) {
      return;
    }

    event.preventDefault();
    const nextParts = splitIsoDate(parsed);
    setParts(nextParts);
    setLocalError('');
    emit(parsed);
    yearRef.current?.focus();
  }

  function handleKeyDown(part: DatePartKey, event: KeyboardEvent<HTMLInputElement>) {
    if (event.key !== 'Backspace' || event.currentTarget.value) {
      return;
    }

    if (part === 'day') {
      monthRef.current?.focus();
    } else if (part === 'year') {
      dayRef.current?.focus();
    }
  }

  function handleGroupBlur() {
    window.requestAnimationFrame(() => {
      if (!fieldsetRef.current?.contains(document.activeElement)) {
        setLocalError(validate(parts));
      }
    });
  }

  const refs = {
    month: monthRef,
    day: dayRef,
    year: yearRef
  };

  return (
    <fieldset
      ref={fieldsetRef}
      className={`min-w-0 ${className}`}
      aria-describedby={describedBy}
      aria-invalid={visibleError ? 'true' : undefined}
      aria-required={required ? 'true' : undefined}
      lang="en-US"
      onBlur={handleGroupBlur}
    >
      <legend className="text-sm font-medium text-gray-700">
        {label}
        {required ? <span className="ml-1 text-red-600" aria-hidden="true">*</span> : null}
      </legend>
      <div className="mt-2 grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.45fr)] gap-2">
        {(Object.keys(DATE_PART_LIMITS) as DatePartKey[]).map((part) => (
          <label key={part} className="min-w-0 text-xs font-medium text-gray-500">
            <span className="block">{DATE_PART_LABELS[part]}</span>
            <input
              ref={refs[part]}
              id={`${id}-${part}`}
              type="text"
              inputMode="numeric"
              autoComplete="off"
              pattern="[0-9]*"
              maxLength={DATE_PART_LIMITS[part]}
              value={parts[part]}
              placeholder={part === 'month' ? 'MM' : part === 'day' ? 'DD' : 'YYYY'}
              aria-label={`${label} ${DATE_PART_LABELS[part].toLowerCase()}`}
              aria-describedby={describedBy}
              aria-invalid={visibleError ? 'true' : undefined}
              onChange={(event) => updatePart(part, event.target.value)}
              onPaste={handlePaste}
              onKeyDown={(event) => handleKeyDown(part, event)}
              className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 ${
                visibleError
                  ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
              }`}
            />
          </label>
        ))}
      </div>
      <p id={helpId} className="mt-2 text-xs font-normal text-gray-500">
        {helpText}
      </p>
      {visibleError ? (
        <p id={errorId} className="mt-1 text-xs font-medium text-red-700" role="alert">
          {visibleError}
        </p>
      ) : null}
    </fieldset>
  );
}
