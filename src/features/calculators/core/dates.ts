const MILLISECONDS_IN_DAY = 1000 * 60 * 60 * 24;

function parseIsoDate(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) {
    return null;
  }

  const year = Number.parseInt(match[1], 10);
  const month = Number.parseInt(match[2], 10);
  const day = Number.parseInt(match[3], 10);
  const date = new Date(Date.UTC(year, month - 1, day));

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }

  return date;
}

function formatIsoDate(date: Date): string {
  return [
    date.getUTCFullYear(),
    String(date.getUTCMonth() + 1).padStart(2, '0'),
    String(date.getUTCDate()).padStart(2, '0')
  ].join('-');
}

export function isValidIsoDate(value: string): boolean {
  return parseIsoDate(value) !== null;
}

export function getHoldingPeriodDays(purchaseDate: string, saleDate: string): number {
  const purchase = parseIsoDate(purchaseDate);
  const sale = parseIsoDate(saleDate);
  if (!purchase || !sale) {
    return 0;
  }

  return Math.max(
    0,
    Math.floor((sale.getTime() - purchase.getTime()) / MILLISECONDS_IN_DAY)
  );
}

export function isLongTermHoldingPeriod(purchaseDate: string, saleDate: string): boolean {
  const purchase = parseIsoDate(purchaseDate);
  const sale = parseIsoDate(saleDate);
  if (!purchase || !sale || sale <= purchase) {
    return false;
  }

  const oneYearAnniversary = new Date(
    Date.UTC(
      purchase.getUTCFullYear() + 1,
      purchase.getUTCMonth(),
      purchase.getUTCDate()
    )
  );

  return sale > oneYearAnniversary;
}

export function getLongTermStartDate(purchaseDate: string): string | null {
  const purchase = parseIsoDate(purchaseDate);
  if (!purchase) {
    return null;
  }

  const oneYearAnniversary = new Date(
    Date.UTC(
      purchase.getUTCFullYear() + 1,
      purchase.getUTCMonth(),
      purchase.getUTCDate()
    )
  );
  oneYearAnniversary.setUTCDate(oneYearAnniversary.getUTCDate() + 1);

  return formatIsoDate(oneYearAnniversary);
}

export function formatIsoDateEnglish(value: string): string {
  const date = parseIsoDate(value);
  if (!date) {
    return '';
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC'
  }).format(date);
}
