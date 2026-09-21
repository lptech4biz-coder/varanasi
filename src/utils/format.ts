/** Format a number as Indian Rupees, e.g. 1234567 -> "₹12,34,567". Rounds to the nearest rupee. */
export function formatINR(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || Number.isNaN(amount)) return '—';
  return `₹${Math.round(amount).toLocaleString('en-IN')}`;
}

/** Format a plain number using Indian digit grouping, e.g. 150000 -> "1,50,000". */
export function formatNumber(value: number | null | undefined, maxDecimals = 2): string {
  if (value === null || value === undefined || Number.isNaN(value)) return '—';
  return value.toLocaleString('en-IN', { maximumFractionDigits: maxDecimals });
}
