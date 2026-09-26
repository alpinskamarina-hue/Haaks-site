import { getTranslations } from 'next-intl/server'

import { Link } from '@/i18n/navigation'
import { whatsappLink } from '@/lib/contacts'

export async function Footer() {
  const t = await getTranslations()

  const columns = [
    {
      title: 'Покупателям',
      links: [
        { href: '/catalog', label: t('nav.catalog') },
        { href: '/brands', label: t('nav.brands') },
        { href: '/how-it-works', label: t('nav.how') },
        { href: '/inquiry', label: 'Оптовая заявка' },
      ],
    },
    {
      title: 'Производителям',
      links: [
        { href: '/producers', label: 'Выход на рынок KSA' },
        { href: '/producers#pricing', label: 'Тарифы' },
        { href: '/producers#apply', label: 'Стать партнёром' },
      ],
    },
    {
      title: 'Компания',
      links: [
        { href: '/about', label: t('nav.about') },
        { href: '/register', label: 'Регистрация компании' },
      ],
    },
  ]

  return (
    <footer className="border-line mt-16 border-t bg-white">
      <div className="container-page grid gap-8 py-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div>
          <span className="font-display text-xl font-bold" dir="ltr">
            Green Tree
          </span>
          <p className="text-muted mt-3 max-w-xs text-sm">
            Торговый дом в Джидде. Оптовые поставки продуктов из России и СНГ по всей Саудовской Аравии.
          </p>
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="text-forest mt-4 inline-block text-sm font-semibold underline underline-offset-2"
          >
            Написать в WhatsApp
          </a>
        </div>
        {columns.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h2 className="text-sm font-semibold">{col.title}</h2>
            <ul className="text-muted mt-3 grid gap-2 text-sm">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-forest">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-line border-t">
        <p className="container-page text-muted py-4 text-xs">{t('footer.rights')}</p>
      </div>
    </footer>
  )
}
