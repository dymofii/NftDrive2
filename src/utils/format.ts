export function formatMoney(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toFixed(2)}B`;
  }
  if (abs >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(2)}M`;
  }
  if (abs >= 100_000) {
    return `$${(value / 1_000).toFixed(1)}K`;
  }
  return `$${Math.floor(value).toLocaleString('en-US')}`;
}

export function formatIncomeRate(value: number, perSecSuffix = '/сек'): string {
  if (value >= 100_000) {
    return `+${formatMoney(value)}${perSecSuffix}`;
  }
  if (value >= 100) {
    return `+$${Math.round(value).toLocaleString('en-US')}${perSecSuffix}`;
  }
  const rounded = Math.round(value * 10) / 10;
  return `+$${Number.isInteger(rounded) ? rounded : rounded.toFixed(1)}${perSecSuffix}`;
}
