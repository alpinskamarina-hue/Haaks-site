import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['ar', 'en', 'ru'],
  defaultLocale: 'ar',
})

export type Locale = (typeof routing.locales)[number]

export const rtlLocales: Locale[] = ['ar']

export const localeLabels: Record<Locale, string> = {
  ar: 'العربية',
  en: 'English',
  ru: 'Русский',
}
