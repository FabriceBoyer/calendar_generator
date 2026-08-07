import type { Locale, PaperSize } from '../types'

export function detectLocale(): Locale {
  const nav = typeof navigator !== 'undefined' ? navigator.language : 'en'
  return nav.toLowerCase().startsWith('fr') ? 'fr' : 'en'
}

const LETTER_COUNTRIES = ['US', 'CA', 'MX', 'PH', 'CL', 'CO', 'VE', 'PR']

export function detectPaperSize(): PaperSize {
  const nav = typeof navigator !== 'undefined' ? navigator.language : 'en-US'
  const region = nav.split('-')[1]?.toUpperCase()
  if (region && LETTER_COUNTRIES.includes(region)) return 'Letter'
  return 'A4'
}
