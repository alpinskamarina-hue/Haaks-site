'use client'

import { useTranslations } from 'next-intl'

import { Link, usePathname } from '@/i18n/navigation'

import { CartIcon, GridIcon, HomeIcon, TagIcon, UserIcon } from './icons'

export function MobileTabBar() {
  const t = useTranslations('nav')
  const pathname = usePathname()

  const tabs = [
    { href: '/', label: t('home'), Icon: HomeIcon },
    { href: '/catalog', label: t('categories'), Icon: GridIcon },
    { href: '/brands', label: t('brands'), Icon: TagIcon },
    { href: '/inquiry', label: t('inquiry'), Icon: CartIcon },
    { href: '/account', label: t('account'), Icon: UserIcon },
  ]

  return (
    <nav className="border-line fixed inset-x-0 bottom-0 z-40 border-t bg-white md:hidden">
      <ul className="grid grid-cols-5">
        {tabs.map(({ href, label, Icon }) => {
          const active = href === '/' ? pathname === '/' : pathname.startsWith(href)
          return (
            <li key={href}>
              <Link
                href={href}
                className={`flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium ${
                  active ? 'text-forest' : 'text-muted'
                }`}
              >
                <Icon width={22} height={22} />
                {label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
