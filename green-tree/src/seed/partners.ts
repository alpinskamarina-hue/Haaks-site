import type { Country } from '@/lib/catalog'

// Partner brands added by hand (not from the stock list). Photos in ./partners
export const partnerCategory = { slug: 'drinks', name: 'Напитки и вода' }

export const partnerBrands: {
  name: string
  slug: string
  country: Country
  city?: string
  speciality: string
  description: string
  logo: string
}[] = [
  {
    name: 'Natakhtari',
    slug: 'natakhtari',
    country: 'ge',
    speciality: 'Грузинские лимонады',
    description:
      'Грузинские лимонады в стеклянной бутылке. Экспортная линейка с арабским текстом на этикетке: Саперави (виноград) и груша.',
    logo: 'natakhtari-brand.jpg',
  },
  {
    name: 'Tbau Mountain',
    slug: 'tbau',
    country: 'ru',
    city: 'Северная Осетия',
    speciality: 'Горная питьевая вода',
    description:
      'Горная родниковая вода из Северной Осетии. Природная минеральная вода с низким содержанием минералов, без газа, в стеклянной бутылке. Этикетка на английском и арабском.',
    logo: 'tbau-still-1.jpg',
  },
]

export const partnerProducts: {
  slug: string
  name: string
  brand: string
  description: string
  images: string[]
}[] = [
  {
    slug: 'natakhtari-saperavi',
    name: 'Natakhtari Лимонад Саперави (виноград)',
    brand: 'natakhtari',
    description: 'Грузинский лимонад со вкусом винограда Саперави. Стеклянная бутылка, экспортная этикетка.',
    images: ['natakhtari-saperavi.jpg'],
  },
  {
    slug: 'natakhtari-pear',
    name: 'Natakhtari Лимонад Груша',
    brand: 'natakhtari',
    description: 'Грузинский грушевый лимонад. Стеклянная бутылка, экспортная этикетка.',
    images: ['natakhtari-pear.jpg'],
  },
  {
    slug: 'tbau-mountain-still',
    name: 'Tbau Mountain Вода горная негазированная',
    brand: 'tbau',
    description:
      'Природная минеральная вода с низким содержанием минералов из горного источника Северной Осетии. Без газа, стеклянная бутылка.',
    images: ['tbau-still-1.jpg', 'tbau-still-3.jpg', 'tbau-still-2.jpg'],
  },
]
