import { getLocale, getTranslations } from 'next-intl/server'

import { Link } from '@/i18n/navigation'

import { SearchIcon, UserIcon } from './icons'
import { InquiryButton } from './inquiry/InquiryButton'
import { LanguageSwitcher } from './LanguageSwitcher'

export async function Header() {
  const t = await getTranslations()
  const locale = await getLocale()

  const nav = [
    { href: '/catalog', label: t('nav.catalog') },
    { href: '/brands', label: t('nav.brands') },
    { href: '/producers', label: t('nav.producers') },
    { href: '/how-it-works', label: t('nav.how') },
    { href: '/about', label: t('nav.about') },
  ]

  return (
    <header className="sticky top-0 z-40">
      <div className="bg-forest text-white">
        <div className="container-page flex h-8 items-center justify-between gap-4 text-[11px]">
          <p className="truncate">{t('topbar')}</p>
          <LanguageSwitcher className="hidden shrink-0 md:flex" />
        </div>
      </div>

      <div className="border-line border-b bg-white">
        <div className="container-page flex h-16 items-center gap-6">
          <Link href="/" className="font-display shrink-0 text-xl leading-none font-bold" dir="ltr">
            Green Tree
          </Link>

          <nav className="hidden gap-6 text-sm font-medium lg:flex">
            {nav.map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-forest">
                {item.label}
              </Link>
            ))}
          </nav>

          <form action={`/${locale}/catalog`} className="ms-auto hidden flex-1 md:block md:max-w-xs">
            <label className="bg-cream text-muted flex h-10 items-center gap-2 rounded-xl px-3 text-sm">
              <SearchIcon width={16} height={16} />
              <input
                name="q"
                type="search"
                placeholder={t('nav.search')}
                className="placeholder:text-muted w-full bg-transparent outline-none"
              />
            </label>
          </form>

          <div className="ms-auto flex items-center gap-2 md:ms-0">
            <LanguageSwitcher className="text-xs md:hidden" />
            <Link
              href="/account"
              aria-label={t('nav.account')}
              className="border-line hidden size-10 items-center justify-center rounded-xl border md:flex"
            >
              <UserIcon width={18} height={18} />
            </Link>
            <InquiryButton label={t('nav.inquiry')} />
          </div>
        </div>
      </div>
    </header>
  )
}
