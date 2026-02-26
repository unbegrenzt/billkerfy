const currencySymbolByCode: Record<string, string> = {
  EUR: '€',
  USD: '$',
  GBP: '£',
  MXN: '$',
  COP: '$',
  ARS: '$',
  CLP: '$',
  BRL: 'R$',
  PEN: 'S/',
}

export function getCurrencySymbol(currencyCode: string): string {
  return currencySymbolByCode[currencyCode.toUpperCase()] ?? currencyCode.toUpperCase()
}

export function formatCurrencyAmount(value: number, currencyCode: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode.toUpperCase(),
  }).format(value)
}
