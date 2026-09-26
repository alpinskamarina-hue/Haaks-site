import type { Metadata } from 'next'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { IBM_Plex_Sans_Arabic, Manrope, Unbounded } from 'next/font/google'
import { notFound } from 'next/navigation'
import React from 'react'

import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { MobileTabBar } from '@/components/MobileTabBar'
import { rtlLocales, routing, type Locale } from '@/i18n/routing'
import '../styles.css'

const unbounded = Unbounded({
  subsets: ['latin', 'cyrillic'],
  weight: ['600', '700'],
  variable: '--font-unbounded',
})
const manrope = Manrope({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-manrope',
})
const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-plex-arabic',
})

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'meta' })

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      languages: Object.fromEntries(routing.locales.map((l) => [l, `/${l}`])),
    },
  }
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)

  const dir = rtlLocales.includes(locale as Locale) ? 'rtl' : 'ltr'

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${unbounded.variable} ${manrope.variable} ${plexArabic.variable}`}
    >
      <body className="pb-20 md:pb-0">
        <NextIntlClientProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          <MobileTabBar />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
