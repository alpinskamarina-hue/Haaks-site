import type { Where } from 'payload'

import { availabilityTypes, countries, isTier, storageTypes, type Tier } from './catalog'

export type SearchParams = Record<string, string | string[] | undefined>

const list = (v: string | string[] | undefined) => (v == null ? [] : Array.isArray(v) ? v : [v])
const one = (v: string | string[] | undefined) => list(v)[0]

export const sortOptions = [
  { value: 'popular', label: 'Популярные' },
  { value: 'price-asc', label: 'Сначала дешевле' },
  { value: 'price-desc', label: 'Сначала дороже' },
  { value: 'name', label: 'По названию' },
  { value: 'new', label: 'Новинки' },
] as const

export type CatalogFilters = {
  categories: string[]
  brands: string[]
  countries: string[]
  storage: string[]
  halal: boolean
  availability?: string
  q?: string
  tier: Tier
  sort: string
  page: number
}

// Reads filters from the URL, keeping only values the catalogue knows about
export function parseFilters(sp: SearchParams, presetCategory?: string): CatalogFilters {
  const tier = one(sp.tier)
  const sort = one(sp.sort)
  const availability = one(sp.availability)
  const page = Number(one(sp.page))
  const categories = list(sp.category)

  return {
    categories: presetCategory && categories.length === 0 ? [presetCategory] : categories,
    brands: list(sp.brand),
    countries: list(sp.country).filter((c) => countries.some((x) => x.value === c)),
    storage: list(sp.storage).filter((s) => storageTypes.some((x) => x.value === s)),
    halal: one(sp.halal) === '1',
    availability: availabilityTypes.some((a) => a.value === availability) ? availability : undefined,
    q: one(sp.q)?.trim() || undefined,
    tier: isTier(tier) ? tier : 'small',
    sort: sortOptions.some((s) => s.value === sort) ? sort! : 'popular',
    page: Number.isInteger(page) && page > 0 ? page : 1,
  }
}

export function buildWhere(
  f: CatalogFilters,
  ids: { categories: number[]; brands: number[] },
): Where {
  const and: Where[] = []
  if (f.categories.length) and.push({ category: { in: ids.categories } })
  if (f.brands.length) and.push({ brand: { in: ids.brands } })
  if (f.countries.length) and.push({ 'brand.country': { in: f.countries } })
  if (f.storage.length) and.push({ storage: { in: f.storage } })
  if (f.halal) and.push({ halal: { equals: true } })
  if (f.availability) and.push({ availability: { equals: f.availability } })
  if (f.q) and.push({ name: { like: f.q } })
  return and.length ? { and } : {}
}

export function sortField(f: CatalogFilters) {
  switch (f.sort) {
    case 'price-asc':
      return `prices.${f.tier}.price`
    case 'price-desc':
      return `-prices.${f.tier}.price`
    case 'name':
      return 'name'
    case 'new':
      return '-createdAt'
    default:
      return ['-popular', 'name']
  }
}

// Serialises filters back to a query string, e.g. for tier tabs and pagination
export function toQuery(f: CatalogFilters, patch: Partial<CatalogFilters> = {}) {
  const next = { ...f, ...patch }
  const qs = new URLSearchParams()
  next.categories.forEach((v) => qs.append('category', v))
  next.brands.forEach((v) => qs.append('brand', v))
  next.countries.forEach((v) => qs.append('country', v))
  next.storage.forEach((v) => qs.append('storage', v))
  if (next.halal) qs.set('halal', '1')
  if (next.availability) qs.set('availability', next.availability)
  if (next.q) qs.set('q', next.q)
  if (next.tier !== 'small') qs.set('tier', next.tier)
  if (next.sort !== 'popular') qs.set('sort', next.sort)
  if (next.page > 1) qs.set('page', String(next.page))
  const s = qs.toString()
  return s ? `?${s}` : ''
}
