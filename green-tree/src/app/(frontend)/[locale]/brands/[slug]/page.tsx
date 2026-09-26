import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { cache } from 'react'

import { Breadcrumbs } from '@/components/Breadcrumbs'
import { LogoPlaceholder } from '@/components/catalog/PhotoPlaceholder'
import { ProductCard } from '@/components/catalog/ProductCard'
import { SectionHeader } from '@/components/SectionHeader'
import { Link } from '@/i18n/navigation'
import { countries, labelOf } from '@/lib/catalog'
import { asMedia } from '@/lib/format'
import { getPayloadClient } from '@/lib/payload'

type Props = { params: Promise<{ locale: string; slug: string }> }

const getBrand = cache(async (slug: string) => {
  const payload = await getPayloadClient()
  const res = await payload.find({ collection: 'brands', where: { slug: { equals: slug } }, limit: 1, depth: 1 })
  return res.docs[0]
})

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const brand = await getBrand((await params).slug)
  return brand ? { title: `${brand.name} оптом в Саудовской Аравии — Green Tree` } : {}
}

export default async function BrandPage({ params }: Props) {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const brand = await getBrand(slug)
  if (!brand) notFound()

  const payload = await getPayloadClient()
  const products = await payload.find({
    collection: 'products',
    where: { brand: { equals: brand.id } },
    limit: 8,
    sort: ['-popular', 'name'],
    depth: 1,
  })

  const country = labelOf(countries, brand.country)
  const facts = [
    { label: 'Производство', value: [brand.city, country].filter(Boolean).join(', ') },
    { label: 'Товаров в каталоге', value: String(products.totalDocs) },
    { label: 'Уровни опта', value: 'мелкий, средний, крупный' },
    ...(products.docs.some((p) => (p.stock?.quantity ?? 0) > 0)
      ? [{ label: 'Хранение', value: 'склад в Джидде' }]
      : []),
  ]

  return (
    <div className="container-page py-6 md:py-8">
      <Breadcrumbs items={[{ label: 'Бренды', href: '/brands' }, { label: brand.name }]} />

      <section className="card mt-6 grid gap-8 p-6 md:p-10 lg:grid-cols-[200px_1fr_320px]">
        <LogoPlaceholder logo={brand.logo} className="aspect-square w-40 lg:w-full" />

        <div>
          <p className="text-forest text-sm font-semibold">
            {[country, brand.speciality].filter(Boolean).join(' · ')}
          </p>
          <h1 className="font-display mt-2 text-3xl font-bold md:text-5xl">{brand.name}</h1>
          <ul className="mt-4 flex flex-wrap gap-2">
            {brand.halal && <li className="tag bg-forest-soft text-forest px-3.5 py-1.5 text-sm">Халяль</li>}
            {brand.sfda && (
              <li className="tag bg-forest-soft text-forest px-3.5 py-1.5 text-sm">Зарегистрирован в SFDA</li>
            )}
            {brand.since && (
              <li className="tag bg-gold-soft px-3.5 py-1.5 text-sm text-[#7a4b00]">
                На Green Tree с {brand.since}
              </li>
            )}
          </ul>
          {brand.description && (
            <p className="text-muted mt-4 max-w-2xl leading-relaxed">{brand.description}</p>
          )}
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href={`/catalog?brand=${brand.slug}`} className="btn-primary">
              Все товары бренда
            </Link>
            <Link href={`/inquiry?pricelist=${brand.slug}`} className="btn-outline">
              Запросить прайс-лист
            </Link>
          </div>
        </div>

        <dl className="grid content-start text-sm">
          {facts.map((f) => (
            <div key={f.label} className="border-line flex justify-between gap-4 border-b py-3">
              <dt className="text-muted">{f.label}</dt>
              <dd className="text-end font-semibold">{f.value}</dd>
            </div>
          ))}
          {(brand.documents?.length ?? 0) > 0 && (
            <div className="py-3">
              <dt className="text-muted">Документы</dt>
              <dd className="mt-2 grid gap-1.5">
                {brand.documents!.map((d) => {
                  const file = asMedia(d.file)
                  return file?.url ? (
                    <a key={d.id} href={file.url} className="text-forest font-semibold underline underline-offset-2">
                      {d.title}
                    </a>
                  ) : (
                    <span key={d.id} className="text-forest/80 font-semibold">
                      {d.title}
                    </span>
                  )
                })}
              </dd>
            </div>
          )}
        </dl>
      </section>

      <section className="mt-12">
        <SectionHeader
          title="Товары бренда"
          link={{ href: `/catalog?brand=${brand.slug}`, label: 'Смотреть все' }}
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {products.docs.map((p) => (
            <ProductCard key={p.id} product={p} variant="brand" />
          ))}
        </div>
      </section>
    </div>
  )
}
