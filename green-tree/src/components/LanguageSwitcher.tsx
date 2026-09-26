'use client'

import { useLocale } from 'next-intl'

import { Link, usePathname } from '@/i18n/navigation'
import { localeLabels, routing } from '@/i18n/routing'

export function LanguageSwitcher({ className = '' }: { className?: string }) {
  const locale = useLocale()
  const pathname = usePathname()

  return (
    <nav className={`flex items-center gap-3 ${className}`} aria-label="Language">
      {routing.locales.map((l) => (
        <Link
          key={l}
          href={pathname}
          locale={l}
          lang={l}
          aria-current={l === locale ? 'true' : undefined}
          className={l === locale ? 'underline underline-offset-2' : 'opacity-80 hover:opacity-100'}
        >
          {localeLabels[l]}
        </Link>
      ))}
    </nav>
  )
}
