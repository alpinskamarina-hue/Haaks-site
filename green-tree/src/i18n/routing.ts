import { defineRouting } from 'next-intl/routing'

// Only Russian is live for now. Arabic (RTL) and English are ready in messages/
// and switch on by adding them back here: ['ar', 'en', 'ru'] with 'ar' as default.
export const allLocales = ['ar', 'en', 'ru'] as const

export const routing = defineRouting({
  locales: ['ru'],
  defaultLocale: 'ru',
})

export type Locale = (typeof allLocales)[number]

export const rtlLocales: readonly string[] = ['ar']

export const localeLabels: Record<Locale, string> = {
  ar: 'العربية',
  en: 'English',
  ru: 'Русский',
}
