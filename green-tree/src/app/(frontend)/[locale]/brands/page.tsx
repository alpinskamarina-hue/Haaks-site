import type { Metadata } from 'next'
import { getLocale, setRequestLocale } from 'next-intl/server'
import type { Where } from 'payload'

import { Breadcrumbs } from '@/components/Breadcrumbs'
import { AutoSubmitForm } from '@/components/catalog/AutoSubmitForm'
import { BrandCard } from '@/components/catalog/BrandCard'
import { SearchIcon } from '@/components/icons'
import { Link } from '@/i18n/navigation'
import { countries } from '@/lib/catalog'
import { getPayloadClient } from '@/lib/payload'

export const metadata: Metadata = { title: 'Бренды — Green Tree' }

type Props = {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ country?: string; category?: string; q?: string }>
}

export default async function BrandsPage({ params, searchParams }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const sp = await searchParams
  const country = countries.some((c) => c.value === sp.country) ? sp.country : undefined
  const q = sp.q?.trim() || undefined
  const action = `/${await getLocale()}/brands`

  const payload = await getPayloadClient()
  const categories = await payload.find({ collection: 'categories', limit: 100, sort: 'order', depth: 0 })
  const category = categories.docs.find((c) => c.slug === sp.category)

  // A brand belongs to a category when it has products there
  let brandIdsInCategory: number[] | undefined
  if (category) {
    const inCategory = await payload.find({
      collection: 'products',
      where: { category: { equals: category.id } },
      limit: 1000,
      depth: 0,
      select: { brand: true },
    })
    brandIdsInCategory = [...new Set(inCategory.docs.map((p) => p.brand as number))]
  }

  const and: Where[] = []
  if (country) and.push({ country: { equals: country } })
  if (q) and.push({ name: { like: q } })
  if (brandIdsInCategory) and.push({ id: { in: brandIdsInCategory } })

  const [brands, allProducts] = await Promise.all([
    payload.find({ collection: 'brands', where: and.length ? { and } : {}, limit: 200, sort: 'name', depth: 1 }),
    payload.find({ collection: 'products', limit: 2000, depth: 0, select: { brand: true } }),
  ])

  const counts = new Map<number, number>()
  for (const p of allProducts.docs) {
    const id = p.brand as number
    counts.set(id, (counts.get(id) ?? 0) + 1)
  }

  const chipHref = (value?: string) => {
    const qs = new URLSearchParams()
    if (value) qs.set('country', value)
    if (category) qs.set('category', category.slug)
    if (q) qs.set('q', q)
    const s = qs.toString()
    return `/brands${s ? `?${s}` : ''}`
  }

  return (
    <div className="container-page py-6 md:py-8">
      <Breadcrumbs items={[{ label: 'Бренды' }]} />

      <div className="mt-4 flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-3xl">
          <h1 className="font-display text-3xl leading-tight font-bold text-balance md:text-5xl">
            Бренды, которые уже с нами работают
          </h1>
          <p className="text-muted mt-4 text-base leading-relaxed md:text-lg">
            Каждый бренд прошёл регистрацию в SFDA и халяль-сертификацию. Товары хранятся на нашем складе в
            Джидде и продаются мелким, средним и крупным оптом.
          </p>
        </div>
        <form action={action} method="get" className="w-full md:w-80" role="search">
          {country && <input type="hidden" name="country" value={country} />}
          {category && <input type="hidden" name="category" value={category.slug} />}
          <label className="border-line text-muted flex h-12 items-center gap-2 rounded-xl border bg-white px-3">
            <SearchIcon width={18} height={18} />
            <span className="sr-only">Найти бренд</span>
            <input
              id="brand-search"
              name="q"
              type="search"
              defaultValue={q}
              placeholder="Найти бренд"
              className="text-ink w-full bg-transparent outline-none"
            />
          </label>
        </form>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <nav aria-label="Страна" className="flex flex-wrap gap-2">
          {[{ value: undefined, label: 'Все страны' }, ...countries].map((c) => {
            const active = c.value === country
            return (
              <Link
                key={c.label}
                href={chipHref(c.value)}
                aria-current={active ? 'true' : undefined}
                className={`rounded-full border px-5 py-2.5 text-sm font-semibold ${
                  active ? 'bg-forest border-forest text-white' : 'border-line bg-white hover:border-forest/40'
                }`}
              >
                {c.label}
              </Link>
            )
          })}
        </nav>
        <AutoSubmitForm action={action} className="flex items-center gap-2 text-sm">
          {country && <input type="hidden" name="country" value={country} />}
          {q && <input type="hidden" name="q" value={q} />}
          <label htmlFor="brand-category" className="text-muted">
            Категория
          </label>
          <select
            id="brand-category"
            name="category"
            defaultValue={category?.slug ?? ''}
            className="border-line h-11 rounded-xl border bg-white px-3"
          >
            <option value="">Все категории</option>
            {categories.docs.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </AutoSubmitForm>
      </div>

      {brands.docs.length ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {brands.docs.map((b) => (
            <BrandCard key={b.id} brand={b} productCount={counts.get(b.id)} />
          ))}
        </div>
      ) : (
        <div className="card text-muted mt-6 p-10 text-center">
          Брендов с такими условиями пока нет.{' '}
          <Link href="/brands" className="text-forest font-semibold underline">
            Показать все
          </Link>
        </div>
      )}

      <section className="rounded-card bg-forest mt-12 flex flex-wrap items-center justify-between gap-6 p-6 text-white md:p-10">
        <div>
          <h2 className="font-display text-2xl font-bold md:text-3xl">Ваш бренд может быть следующим</h2>
          <p className="mt-2 text-sm text-white/80 md:text-base">
            Производителям из России и СНГ: регистрация, ввоз, склад и оптовые продажи в Саудовской Аравии под
            ключ.
          </p>
        </div>
        <Link href="/producers#apply" className="btn-light">
          Отправить заявку
        </Link>
      </section>
    </div>
  )
}
