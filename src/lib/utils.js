import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Merge conditional class names, letting later Tailwind utilities win. */
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

const currencyFormatters = {
  USD: { locale: 'en-US', currency: 'USD', rate: 1 },
  EUR: { locale: 'de-DE', currency: 'EUR', rate: 0.92 },
  GBP: { locale: 'en-GB', currency: 'GBP', rate: 0.79 },
  JPY: { locale: 'ja-JP', currency: 'JPY', rate: 151 },
}

export const CURRENCIES = Object.keys(currencyFormatters)

/** Format a USD base price into the shopper's selected currency. */
export function formatPrice(usd, code = 'USD') {
  const conf = currencyFormatters[code] ?? currencyFormatters.USD
  const value = usd * conf.rate
  return new Intl.NumberFormat(conf.locale, {
    style: 'currency',
    currency: conf.currency,
    maximumFractionDigits: conf.currency === 'JPY' ? 0 : 2,
    minimumFractionDigits: conf.currency === 'JPY' ? 0 : 2,
  }).format(value)
}
