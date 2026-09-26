import { getTranslations, setRequestLocale } from 'next-intl/server'

import { CheckIcon } from '@/components/icons'
import { Link } from '@/i18n/navigation'

type Props = { params: Promise<{ locale: string }> }

export default async function HomePage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('hero')
  const badges = t.raw('badges') as string[]

  return (
    <section className="container-page grid gap-8 py-10 md:py-16 lg:grid-cols-[1.1fr_1fr] lg:items-center">
      <div>
        <p className="text-forest text-xs font-semibold tracking-wider uppercase">{t('eyebrow')}</p>
        <h1 className="font-display mt-4 text-4xl leading-[1.05] font-bold md:text-6xl">
          {t('title')}
        </h1>
        <p className="text-muted mt-6 max-w-xl text-base leading-relaxed md:text-lg">{t('lead')}</p>
        <ul className="mt-6 flex flex-wrap gap-2">
          {badges.map((b) => (
            <li key={b} className="chip">
              <CheckIcon className="text-forest" />
              {b}
            </li>
          ))}
        </ul>
      </div>

      <div className="grid gap-4">
        <div className="rounded-card bg-forest p-6 text-white md:p-8">
          <span className="tag text-forest bg-white/90">{t('buy.tag')}</span>
          <h2 className="font-display mt-4 text-xl font-bold md:text-2xl">{t('buy.title')}</h2>
          <p className="mt-2 text-sm text-white/80">{t('buy.text')}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/catalog" className="btn-light">
              {t('buy.primary')}
            </Link>
            <Link href="/register" className="btn-ghost-light">
              {t('buy.secondary')}
            </Link>
          </div>
        </div>

        <div className="card p-6 md:p-8">
          <span className="tag bg-gold-soft text-[#7a4b00]">{t('sell.tag')}</span>
          <h2 className="font-display mt-4 text-xl font-bold md:text-2xl">{t('sell.title')}</h2>
          <p className="text-muted mt-2 text-sm">{t('sell.text')}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/producers#apply" className="btn-primary">
              {t('sell.primary')}
            </Link>
            <Link href="/producers#pricing" className="btn-outline">
              {t('sell.secondary')}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
