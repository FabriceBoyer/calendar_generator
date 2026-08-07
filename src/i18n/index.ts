import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import fr from './locales/fr.json'
import en from './locales/en.json'

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      fr: { translation: fr },
      en: { translation: en },
    },
    fallbackLng: 'en',
    supportedLngs: ['fr', 'en'],
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'calfit_locale',
      caches: ['localStorage'],
      lookupFromPathIndex: 0,
    },
    interpolation: { escapeValue: false },
  })

export function resolveLabel(t: (key: string) => string, value: string): string {
  if (value.startsWith('activities.') || value.startsWith('fields.')) {
    return t(value)
  }
  return value
}

export default i18n
