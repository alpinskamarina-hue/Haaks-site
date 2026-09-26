import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { cache } from 'react'

import { Breadcrumbs } from '@/components/Breadcrumbs'
import { ProductImage } from '@/components/catalog/PhotoPlaceholder'
import { ProductBuyBox } from '@/components/catalog/ProductBuyBox'
import { ProductCard } from '@/components/catalog/ProductCard'
import { TruckIcon } from '@/components/icons'
import { SectionHeader } from '@/components/SectionHeader'
import { Link } from '@/i18n/navigation'
import { availabilityTypes, countries, labelOf, storageTypes, tiers, type Unit } from '@/lib/catalog'
import {
  asBrand,
  asCategory,
  asMedia,
  formatDate,
  formatSAR,
  isShortDated,
  minQtyText,
  showPrices,
  tierPrice,
} from '@/lib/format'
import { getPayloadClient } from '@/lib/payload'

type Props = { params: Promise<{ locale: string; slug: string }> }

const getProduct = cache(async (slug: string) => {
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'products',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
  })
  return res.docs[0]
})

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProduct((await params).slug)
  if (!product) return {}
  const brand = asBrand(product.brand)
  return {
    title: `${product.name} оптом — Green Tree`,
    description: `${product.name}${brand ? `, ${brand.name}` : ''}. Оптовые цены для мелкого, среднего и крупного опта со склада в Джидде.`,
  }
}

export default async function ProductPage({ params }: Props) {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const product = await getProduct(slug)
  if (!product) notFound()

  const brand = asBrand(product.brand)
  const category = asCategory(product.category)
  const unitsPerBox = product.packaging?.unitsPerBox

  const prices = tiers.map((t) => {
    const p = tierPrice(product, t.value)
    const known = showPrices && p?.price != null
    const perUnit = !known
      ? 'пришлём в КП'
      : unitsPerBox
        ? `за коробку · ≈ ${formatSAR(p!.price! / unitsPerBox)} за шт`
        : 'за коробку'
    return {
      tier: t.value,
      price: known ? formatSAR(p!.price) : 'по запросу',
      perUnit,
      min: minQtyText(p?.minQty, p?.unit),
      minQty: p?.minQty ?? 1,
      unit: ((p?.unit as Unit) ?? t.unit) as Unit,
    }
  })

  const qty = product.stock?.quantity
  const expiry = product.stock?.expiryDate
  const badges = [
    product.glutenFree && { label: 'Без глютена', tone: 'green' },
    product.organic && { label: 'Органик (BIO)', tone: 'green' },
    product.halal && { label: 'Халяль', tone: 'green' },
    product.sfda && { label: 'Зарегистрирован в SFDA', tone: 'green' },
    product.arabicLabel && { label: 'Этикетка на арабском', tone: 'green' },
    product.temperature && { label: `Хранение ${product.temperature}`, tone: 'blue' },
    { label: labelOf(availabilityTypes, product.availability), tone: 'gold' },
    expiry && isShortDated(expiry) && { label: `Короткий срок: до ${formatDate(expiry)}`, tone: 'red' },
  ].filter(Boolean) as { label: string; tone: 'green' | 'blue' | 'gold' | 'red' }[]

  const toneClass = {
    green: 'bg-forest-soft text-forest',
    blue: 'bg-[#e4e7f3] text-[#2b3a78]',
    gold: 'bg-gold-soft text-[#7a4b00]',
    red: 'bg-[#f7e1da] text-[#9a3b1b]',
  }

  const images = (product.images ?? []).map(asMedia).filter(Boolean)
  const shippingTitle =
    product.storage === 'chilled'
      ? 'Отгрузка в охлаждённом виде'
      : product.storage === 'frozen'
        ? 'Отгрузка в замороженном виде'
        : 'Отгрузка'

  const payload = await getPayloadClient()
  const related = await payload.find({
    collection: 'products',
    where: { and: [{ category: { equals: category?.id } }, { id: { not_equals: product.id } }] },
    limit: 4,
    depth: 1,
  })

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    brand: brand ? { '@type': 'Brand', name: brand.name } : undefined,
    countryOfOrigin: labelOf(countries, brand?.country),
    category: category?.name,
  }

  return (
    <div className="container-page py-6 md:py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Breadcrumbs
        items={[
          ...(category ? [{ label: category.name, href: `/catalog/${category.slug}` }] : []),
          { label: product.name },
        ]}
      />

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_1.05fr]">
        <div>
          <ProductImage
            image={images[0]}
            label="Фото товара"
            className="rounded-card aspect-[5/4] w-full bg-white p-6"
          />
          <div className="mt-3 grid grid-cols-4 gap-3">
            {['', '', 'Этикетка AR', 'Коробка'].map((label, i) =>
              images[i + 1] || i === 0 ? (
                <ProductImage
                  key={i}
                  image={images[i]}
                  className={`aspect-[4/3] w-full rounded-xl ${i === 0 ? 'ring-forest ring-2' : ''}`}
                />
              ) : (
                <div key={i} className="bg-sand text-muted grid aspect-[4/3] place-items-center rounded-xl text-xs">
                  {label}
                </div>
              ),
            )}
          </div>
        </div>

        <div className="grid content-start gap-5">
          <div>
            {brand && (
              <p className="text-forest text-sm font-semibold">
                Бренд:{' '}
                <Link href={`/brands/${brand.slug}`} className="underline underline-offset-2">
                  {brand.name}
                </Link>{' '}
                · {labelOf(countries, brand.country)}
              </p>
            )}
            <h1 className="font-display mt-2 text-3xl leading-tight font-bold text-balance md:text-5xl">
              {product.name}
            </h1>
            <ul className="mt-4 flex flex-wrap gap-2">
              {badges.map((b) => (
                <li key={b.label} className={`tag px-3.5 py-1.5 text-sm ${toneClass[b.tone]}`}>
                  {b.label}
                </li>
              ))}
            </ul>
          </div>

          <ProductBuyBox
            productId={product.id}
            slug={product.slug}
            name={product.name}
            brand={brand?.name}
            prices={prices}
            packaging={product.packaging ?? {}}
            pricesNote={
              prices.some((p) => p.price !== 'по запросу')
                ? 'Цены без НДС 15% · видны после проверки CR и VAT'
                : 'Цены по уровням опта пришлём в коммерческом предложении'
            }
          />

          {qty != null && (
            <dl className="card grid grid-cols-2 gap-4 p-5 text-sm md:p-7">
              <div>
                <dt className="text-muted">На складе в Джидде</dt>
                <dd className="font-display mt-1 text-xl font-bold">{qty.toLocaleString('ru-RU')} шт</dd>
              </div>
              {expiry && (
                <div>
                  <dt className="text-muted">Годен до (ближайшая партия)</dt>
                  <dd
                    className={`font-display mt-1 text-xl font-bold ${isShortDated(expiry) ? 'text-[#9a3b1b]' : ''}`}
                  >
                    {formatDate(expiry)}
                  </dd>
                </div>
              )}
            </dl>
          )}

          <div className="card p-5 md:p-7">
            <p className="flex items-center gap-2 font-semibold">
              <TruckIcon className="text-forest" /> {shippingTitle}
            </p>
            <dl className="mt-3 grid gap-4 text-sm sm:grid-cols-3">
              {tiers.map((t) => (
                <div key={t.value}>
                  <dt className="font-semibold">{t.label}</dt>
                  <dd className="text-muted">{t.delivery}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <InfoCard title="Описание">{product.description}</InfoCard>
        <InfoCard title="Состав и пищевая ценность">{product.composition}</InfoCard>
        <InfoCard title="Хранение и срок годности">
          {[labelOf(storageTypes, product.storage), product.temperature].filter(Boolean).join(', ')}
          {expiry ? `. Партия на складе годна до ${formatDate(expiry)}` : ''}
          {product.shelfLife ? `. ${product.shelfLife}` : ''}
        </InfoCard>
        <InfoCard title="Документы">
          {(product.documents ?? []).length === 0 && 'Сертификаты и спецификацию пришлём по запросу.'}
          <ul className="grid gap-2">
            {(product.documents ?? []).map((d) => {
              const file = asMedia(d.file)
              return (
                <li key={d.id ?? d.title}>
                  {file?.url ? (
                    <a href={file.url} className="text-forest font-semibold underline underline-offset-2">
                      {d.title}
                    </a>
                  ) : (
                    <span className="text-forest/80 font-semibold" title="Файл загружается в админке">
                      {d.title}
                    </span>
                  )}
                </li>
              )
            })}
          </ul>
        </InfoCard>
      </div>

      {related.docs.length > 0 && (
        <section className="mt-14">
          <SectionHeader
            title="Ещё в этой категории"
            link={category ? { href: `/catalog/${category.slug}`, label: 'Смотреть все' } : undefined}
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {related.docs.map((p) => (
              <ProductCard key={p.id} product={p} variant="brand" />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

function InfoCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="card p-6">
      <h2 className="font-semibold">{title}</h2>
      <div className="text-muted mt-2 text-sm leading-relaxed">{children || '—'}</div>
    </section>
  )
}
