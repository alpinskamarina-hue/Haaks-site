import type { Brand, Category, Media, Product } from '@/payload-types'

import { labelOf, units, type Tier } from './catalog'

// Prices are shown only when the business has decided to open them publicly;
// until buyer verification (stage 2) they can be hidden with SHOW_PRICES=false.
export const showPrices = process.env.SHOW_PRICES !== 'false'

export const formatSAR = (value: number | null | undefined) =>
  value == null
    ? '—'
    : `${value.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} SAR`

export const tierPrice = (p: Product, tier: Tier) => p.prices?.[tier] ?? null

export const unitShort = (unit: string | null | undefined) =>
  units.find((u) => u.value === unit)?.short ?? 'кор.'

export const unitLabel = (unit: string | null | undefined) => labelOf(units, unit)

// Russian plural for "N boxes/pallets": 1 коробка, 2 коробки, 5 коробок
export function plural(n: number, one: string, few: string, many: string) {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return one
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few
  return many
}

export function minQtyText(qty: number | null | undefined, unit: string | null | undefined) {
  if (!qty) return ''
  // Genitive after "от": от 1 коробки, от 21 коробки, но от 2 / 5 / 11 коробок
  const words: Record<string, [string, string]> = {
    boxes: ['коробки', 'коробок'],
    pallets: ['паллеты', 'паллет'],
    containers: ['контейнера', 'контейнеров'],
  }
  const [one, many] = words[unit ?? 'boxes'] ?? words.boxes
  return `от ${qty} ${qty % 10 === 1 && qty % 100 !== 11 ? one : many}`
}

export const asBrand = (b: Product['brand']) => (typeof b === 'object' ? (b as Brand) : null)
export const asCategory = (c: Product['category']) =>
  typeof c === 'object' ? (c as Category) : null
export const asMedia = (m: unknown) => (m && typeof m === 'object' ? (m as Media) : null)
