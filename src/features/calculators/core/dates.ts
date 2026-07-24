const MILLISECONDS_IN_DAY = 1000 * 60 * 60 * 24;

function parseIsoDate(value: string): Date | null {
  const timestamp = Date.parse(value);
  return Number.isNaN(timestamp) ? null : new Date(timestamp);
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
