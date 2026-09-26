import { getLocale } from 'next-intl/server'

import { Breadcrumbs } from '@/components/Breadcrumbs'
import { Link } from '@/i18n/navigation'
import { availabilityTypes, countries, storageTypes, tiers } from '@/lib/catalog'
import {
  buildWhere,
  parseFilters,
  sortField,
  sortOptions,
  toQuery,
  type SearchParams,
} from '@/lib/catalogQuery'
import { getPayloadClient } from '@/lib/payload'

import { AutoSubmitForm } from './AutoSubmitForm'
import { ProductCard } from './ProductCard'

const PAGE_SIZE = 9

const tierNotes: Record<string, { title: string; text: string }> = {
  small: {
    title: 'Мелкий опт: от 5 коробок.',
    text: 'Для бакалей, мини-маркетов и кафе. Отгрузка со склада в Джидде.',
  },
  medium: {
    title: 'Средний опт: от 1 паллеты.',
    text: 'Для супермаркетов, ресторанов и отелей. Доставка паллетами по всей KSA.',
  },
  large: {
    title: 'Крупный опт: от 10 паллет или контейнер.',
    text: 'Для дистрибьюторов и сетей. Со склада или прямой контейнер с завода под заказ.',
  },
}

export async function CatalogView({
  searchParams,
  presetCategory,
}: {
  searchParams: SearchParams
  presetCategory?: string
}) {
  const f = parseFilters(searchParams, presetCategory)
  const action = `/${await getLocale()}/catalog`
  const payload = await getPayloadClient()

  const [allCategories, allBrands] = await Promise.all([
    payload.find({ collection: 'categories', limit: 100, sort: 'order', depth: 0 }),
    payload.find({ collection: 'brands', limit: 200, sort: 'name', depth: 0 }),
  ])

  const selectedCategories = allCategories.docs.filter((c) => f.categories.includes(c.slug))
  const selectedBrands = allBrands.docs.filter((b) => f.brands.includes(b.slug))

  const products = await payload.find({
    collection: 'products',
    where: buildWhere(f, {
      categories: selectedCategories.map((c) => c.id),
      brands: selectedBrands.map((b) => b.id),
    }),
    sort: sortField(f),
    limit: PAGE_SIZE,
    page: f.page,
    depth: 1,
  })

  const title =
    selectedCategories.length === 1 ? selectedCategories[0].name : f.q ? `Поиск: «${f.q}»` : 'Оптовый каталог'
  const note = tierNotes[f.tier]
  const brandsShown = allBrands.docs.slice(0, 12)
  const extraSelectedBrands = selectedBrands.filter((b) => !brandsShown.includes(b))

  return (
    <div className="container-page py-6 md:py-8">
      <Breadcrumbs
        items={
          selectedCategories.length === 1
            ? [{ label: 'Оптовый каталог', href: '/catalog' }, { label: title }]
            : [{ label: 'Оптовый каталог' }]
        }
      />

      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-display max-w-2xl text-3xl leading-tight font-bold text-balance md:text-5xl">
          {title}
        </h1>
        <div className="flex flex-wrap items-center gap-3">
          <nav aria-label="Уровень опта" className="border-line flex rounded-2xl border bg-white p-1">
            {tiers.map((t) => (
              <Link
                key={t.value}
                href={`/catalog${toQuery(f, { tier: t.value, page: 1 })}`}
                aria-current={f.tier === t.value ? 'true' : undefined}
                className={`rounded-xl px-4 py-2 text-center text-sm font-semibold ${
                  f.tier === t.value ? 'bg-forest text-white' : 'hover:bg-cream'
                }`}
              >
                {t.label}
              </Link>
            ))}
          </nav>
          <AutoSubmitForm action={action} className="flex items-center gap-2 text-sm">
            <HiddenFilters f={f} omit="sort" />
            <label htmlFor="sort" className="text-muted">
              Сортировка
            </label>
            <select
              id="sort"
              name="sort"
              defaultValue={f.sort}
              className="border-line h-11 rounded-xl border bg-white px-3"
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <noscript>
              <button className="btn-outline py-2">OK</button>
            </noscript>
          </AutoSubmitForm>
        </div>
      </div>

      <div className="rounded-card bg-night mt-6 flex flex-wrap items-center justify-between gap-4 px-6 py-5 text-white">
        <p className="text-sm">
          <b>{note.title}</b> {note.text} Цены видны после проверки CR и VAT.
        </p>
        <Link href="/register" className="btn bg-gold text-night hover:bg-gold/90">
          Зарегистрировать компанию
        </Link>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside>
          <details className="card group lg:open:block" open>
            <summary className="flex cursor-pointer items-center justify-between p-5 font-semibold lg:hidden">
              Фильтры
              <span className="text-muted text-sm group-open:hidden">показать</span>
            </summary>
            <AutoSubmitForm action={action} className="grid gap-6 p-5 pt-0 lg:pt-5">
              <input type="hidden" name="tier" value={f.tier === 'small' ? '' : f.tier} />
              <input type="hidden" name="sort" value={f.sort === 'popular' ? '' : f.sort} />
              {f.q && <input type="hidden" name="q" value={f.q} />}

              <FilterGroup title="Категория">
                {allCategories.docs.map((c) => (
                  <Check key={c.id} name="category" value={c.slug} label={c.name} checked={f.categories.includes(c.slug)} />
                ))}
              </FilterGroup>

              <FilterGroup title="Бренд">
                {[...brandsShown, ...extraSelectedBrands].map((b) => (
                  <Check key={b.id} name="brand" value={b.slug} label={b.name} checked={f.brands.includes(b.slug)} />
                ))}
                <Link href="/brands" className="text-forest text-sm font-semibold underline underline-offset-2">
                  Все бренды
                </Link>
              </FilterGroup>

              <FilterGroup title="Страна производства">
                {countries.map((c) => (
                  <Check key={c.value} name="country" value={c.value} label={c.label} checked={f.countries.includes(c.value)} />
                ))}
              </FilterGroup>

              <FilterGroup title="Особенности">
                <Check name="gf" value="1" label="Без глютена" checked={f.glutenFree} />
                <Check name="bio" value="1" label="Органик (BIO)" checked={f.organic} />
                <Check name="halal" value="1" label="Халяль" checked={f.halal} />
              </FilterGroup>

              <FilterGroup title="Наличие">
                <Radio name="availability" value="" label="Любое" checked={!f.availability} />
                {availabilityTypes.map((a) => (
                  <Radio key={a.value} name="availability" value={a.value} label={a.label} checked={f.availability === a.value} />
                ))}
              </FilterGroup>

              <FilterGroup title="Хранение">
                {storageTypes.map((s) => (
                  <Check key={s.value} name="storage" value={s.value} label={s.label} checked={f.storage.includes(s.value)} />
                ))}
              </FilterGroup>

              <div className="flex gap-2">
                <button type="submit" className="btn-primary flex-1 py-2.5">
                  Показать
                </button>
                <Link href="/catalog" className="btn-outline py-2.5">
                  Сбросить
                </Link>
              </div>
            </AutoSubmitForm>
          </details>
        </aside>

        <section aria-label="Товары">
          <p className="text-muted mb-3 text-sm">
            Найдено товаров: {products.totalDocs}
          </p>
          {products.docs.length ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {products.docs.map((p) => (
                <ProductCard key={p.id} product={p} tier={f.tier} />
              ))}
            </div>
          ) : (
            <div className="card text-muted p-10 text-center">
              По этим фильтрам ничего не нашлось.{' '}
              <Link href="/catalog" className="text-forest font-semibold underline">
                Сбросить фильтры
              </Link>
            </div>
          )}

          {products.totalPages > 1 && (
            <nav aria-label="Страницы" className="mt-8 flex justify-center gap-2">
              {Array.from({ length: products.totalPages }, (_, i) => i + 1).map((n) => (
                <Link
                  key={n}
                  href={`/catalog${toQuery(f, { page: n })}`}
                  aria-current={n === f.page ? 'page' : undefined}
                  className={`grid size-11 place-items-center rounded-xl border font-semibold ${
                    n === f.page ? 'bg-forest border-forest text-white' : 'border-line bg-white'
                  }`}
                >
                  {n}
                </Link>
              ))}
            </nav>
          )}
        </section>
      </div>
    </div>
  )
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="grid gap-2.5">
      <legend className="mb-2.5 font-semibold">{title}</legend>
      {children}
    </fieldset>
  )
}

function Check({ name, value, label, checked }: { name: string; value: string; label: string; checked: boolean }) {
  return (
    <label className="flex cursor-pointer items-center gap-3 text-sm">
      <input type="checkbox" name={name} value={value} defaultChecked={checked} className="accent-forest size-4.5" />
      {label}
    </label>
  )
}

function Radio({ name, value, label, checked }: { name: string; value: string; label: string; checked: boolean }) {
  return (
    <label className="flex cursor-pointer items-center gap-3 text-sm">
      <input type="radio" name={name} value={value} defaultChecked={checked} className="accent-forest size-4.5" />
      {label}
    </label>
  )
}

// Keeps the other active filters when a standalone control (sort) submits
function HiddenFilters({ f, omit }: { f: ReturnType<typeof parseFilters>; omit: 'sort' }) {
  const qs = new URLSearchParams(toQuery({ ...f, page: 1 }, omit === 'sort' ? { sort: 'popular' } : {}).slice(1))
  return (
    <>
      {[...qs.entries()].map(([k, v], i) => (
        <input key={`${k}-${i}`} type="hidden" name={k} value={v} />
      ))}
    </>
  )
}
