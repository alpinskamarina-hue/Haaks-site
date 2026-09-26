// Shared vocabularies for the catalogue. Values are stored in the database,
// labels are what people see (Russian for now; AR/EN come with translations).

export const countries = [
  { value: 'ru', label: 'Россия' },
  { value: 'by', label: 'Беларусь' },
  { value: 'kz', label: 'Казахстан' },
  { value: 'uz', label: 'Узбекистан' },
  { value: 'kg', label: 'Кыргызстан' },
] as const

export type Country = (typeof countries)[number]['value']

export const storageTypes = [
  { value: 'ambient', label: 'Обычное' },
  { value: 'chilled', label: 'Охлаждённое' },
  { value: 'frozen', label: 'Замороженное' },
] as const

export type Storage = (typeof storageTypes)[number]['value']

export const availabilityTypes = [
  { value: 'jeddah', label: 'На складе в Джидде' },
  { value: 'to-order', label: 'Под заказ с завода (крупный опт)' },
] as const

export const tiers = [
  {
    value: 'small',
    label: 'Мелкий опт',
    audience: 'Бакалеи, мини-маркеты, кафе',
    unit: 'boxes',
    delivery: 'со склада в Джидде',
  },
  {
    value: 'medium',
    label: 'Средний опт',
    audience: 'Супермаркеты, рестораны, отели',
    unit: 'pallets',
    delivery: 'паллетами по KSA',
  },
  {
    value: 'large',
    label: 'Крупный опт',
    audience: 'Дистрибьюторы и сети',
    unit: 'pallets',
    delivery: 'со склада или контейнер под заказ',
  },
] as const

export type Tier = (typeof tiers)[number]['value']

export const units = [
  { value: 'boxes', label: 'Коробки', short: 'кор.' },
  { value: 'pallets', label: 'Паллеты', short: 'пал.' },
  { value: 'containers', label: 'Контейнеры 40′', short: 'конт.' },
] as const

export type Unit = (typeof units)[number]['value']

export const labelOf = <T extends { value: string; label: string }>(
  list: readonly T[],
  value: string | null | undefined,
) => list.find((i) => i.value === value)?.label ?? ''

export const isTier = (v: unknown): v is Tier => tiers.some((t) => t.value === v)
