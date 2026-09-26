import { getTranslations, setRequestLocale } from 'next-intl/server'

import { BrandCard } from '@/components/catalog/BrandCard'
import { ProductImage } from '@/components/catalog/PhotoPlaceholder'
import { ProductCard } from '@/components/catalog/ProductCard'
import { CheckIcon } from '@/components/icons'
import { SectionHeader } from '@/components/SectionHeader'
import { officialFacts, producerSteps, producerTariffs, tierBlocks } from '@/content/home'
import { Link } from '@/i18n/navigation'
import { whatsappLink } from '@/lib/contacts'
import { getPayloadClient } from '@/lib/payload'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ locale: string }> }

export default async function HomePage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('hero')
  const badges = t.raw('badges') as string[]

  const payload = await getPayloadClient()
  const [categories, brands, popular] = await Promise.all([
    payload.find({ collection: 'categories', limit: 8, sort: 'order', depth: 1 }),
    payload.find({ collection: 'brands', limit: 6, sort: 'since', depth: 1 }),
    payload.find({ collection: 'products', where: { popular: { equals: true } }, limit: 5, depth: 1 }),
  ])

  return (
    <>
      <section className="container-page grid gap-8 py-10 md:py-14 lg:grid-cols-[1.1fr_1fr] lg:items-center">
        <div>
          <p className="text-forest text-xs font-semibold tracking-wider uppercase">{t('eyebrow')}</p>
          <h1 className="font-display mt-4 text-4xl leading-[1.05] font-bold text-balance md:text-6xl">
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

      <section className="container-page py-8">
        <SectionHeader title="Категории" link={{ href: '/catalog', label: 'Весь каталог' }} />
        <ul className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-4 md:overflow-visible md:px-0 lg:grid-cols-8">
          {categories.docs.map((c) => (
            <li key={c.id} className="w-32 shrink-0 snap-start md:w-auto">
              <Link href={`/catalog/${c.slug}`} className="card hover:border-forest/40 block h-full p-2.5">
                <ProductImage image={c.image} className="aspect-[4/3] w-full rounded-lg" />
                <p className="mt-2 text-xs leading-snug font-semibold">{c.name}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="container-page py-8">
        <SectionHeader title="Бренды, которые уже с нами" link={{ href: '/brands', label: 'Все бренды' }} />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          {brands.docs.map((b) => (
            <BrandCard key={b.id} brand={b} compact />
          ))}
        </div>
        <div className="bg-forest-soft rounded-card mt-4 flex flex-wrap items-center justify-between gap-4 px-5 py-4">
          <p className="text-sm">
            <b>Производитель из России или СНГ?</b> Ваш бренд может появиться здесь: мы берём на себя
            регистрацию, ввоз, склад и оптовые продажи.
          </p>
          <Link href="/producers#apply" className="btn-primary py-2.5">
            Стать партнёром
          </Link>
        </div>
      </section>

      <section className="container-page py-8">
        <SectionHeader
          title="Популярное у оптовиков"
          aside="Цены за коробку: чем больше объём, тем ниже цена"
        />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
          {popular.docs.map((p) => (
            <ProductCard key={p.id} product={p} variant="compact" />
          ))}
        </div>
      </section>

      <section className="container-page py-8">
        <div className="rounded-card bg-night p-6 text-white md:p-10">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <p className="text-gold text-xs font-semibold tracking-wider uppercase">Только опт</p>
              <h2 className="font-display mt-3 text-2xl font-bold text-balance md:text-4xl">
                Три уровня опта: цена зависит от объёма
              </h2>
              <p className="mt-3 text-sm text-white/70">
                Зарегистрируйте компанию (CR и VAT), и в каталоге откроются цены вашего уровня, заявки и
                счета ZATCA.
              </p>
            </div>
            <Link href="/register" className="btn bg-gold text-night hover:bg-gold/90">
              Зарегистрировать компанию
            </Link>
          </div>
          <div className="mt-8 grid gap-3 md:grid-cols-3">
            {tierBlocks.map((tier) => (
              <div key={tier.title} className="rounded-2xl bg-white/[0.06] p-5">
                <h3 className="font-display text-lg font-bold">{tier.title}</h3>
                <p className="text-gold mt-1 text-sm font-semibold">{tier.min}</p>
                <p className="mt-3 text-sm text-white/70">{tier.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-8" id="producers">
        <p className="text-forest text-xs font-semibold tracking-wider uppercase">
          Производителям из России и СНГ
        </p>
        <h2 className="font-display mt-3 max-w-3xl text-2xl font-bold text-balance md:text-4xl">
          Полный цикл: от вашего завода до полки в Саудовской Аравии
        </h2>
        <ol className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          {producerSteps.map((step, i) => (
            <li key={step.title} className="card p-4">
              <span className="bg-forest-soft text-forest grid size-8 place-items-center rounded-full text-sm font-bold">
                {i + 1}
              </span>
              <h3 className="mt-3 text-sm font-semibold">{step.title}</h3>
              <p className="text-muted mt-1 text-xs leading-relaxed">{step.text}</p>
            </li>
          ))}
        </ol>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          {producerTariffs.map((tariff) => (
            <div key={tariff.label} className="card p-5">
              <p className="text-forest text-xs font-semibold">{tariff.label}</p>
              <p className="font-display mt-2 text-xl font-bold">{tariff.price}</p>
              <p className="text-muted mt-1 text-xs">{tariff.text}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/producers#apply" className="btn-primary">
            Отправить заявку
          </Link>
          <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="btn-outline">
            Написать в WhatsApp
          </a>
        </div>
      </section>

      <section className="container-page py-8">
        <div className="bg-forest-soft rounded-card p-6 md:p-8">
          <h2 className="font-display text-2xl font-bold">Работаем официально</h2>
          <dl className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {officialFacts.map((fact) => (
              <div key={fact.title} className="rounded-xl bg-white p-4">
                <dt className="text-sm font-semibold">{fact.title}</dt>
                <dd className="text-muted mt-1 text-xs">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </>
  )
}
