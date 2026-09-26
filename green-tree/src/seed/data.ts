// Demo content taken from the mockups. Brand names are placeholders until the
// real producers are signed; prices are illustrative SAR figures, not offers.
import type { Country, Storage } from '@/lib/catalog'

export const categories = [
  { slug: 'dairy', name: 'Молочные продукты и сыры' },
  { slug: 'grains', name: 'Крупы и макароны' },
  { slug: 'confectionery', name: 'Кондитерские изделия' },
  { slug: 'honey', name: 'Мёд и варенье' },
  { slug: 'oils', name: 'Масло и соусы' },
  { slug: 'snacks', name: 'Снеки и орехи' },
  { slug: 'tea', name: 'Чай и кофе' },
  { slug: 'frozen', name: 'Замороженные продукты' },
]

type BrandSeed = {
  slug: string
  name: string
  country: Country
  city: string
  speciality: string
  since: number
}

export const brands: BrandSeed[] = [
  { slug: 'brand-1', name: '[Бренд 1]', country: 'by', city: 'Минск', speciality: 'Сыры и молочная продукция', since: 2024 },
  { slug: 'brand-2', name: '[Бренд 2]', country: 'ru', city: 'Вологда', speciality: 'Молочная продукция', since: 2024 },
  { slug: 'brand-3', name: '[Бренд 3]', country: 'ru', city: 'Самара', speciality: 'Кондитерские изделия', since: 2025 },
  { slug: 'brand-4', name: '[Бренд 4]', country: 'kz', city: 'Костанай', speciality: 'Крупы и мука', since: 2025 },
  { slug: 'brand-5', name: '[Бренд 5]', country: 'uz', city: 'Самарканд', speciality: 'Сухофрукты', since: 2025 },
  { slug: 'brand-6', name: '[Бренд 6]', country: 'ru', city: 'Уфа', speciality: 'Мёд', since: 2024 },
  { slug: 'brand-7', name: '[Бренд 7]', country: 'kz', city: 'Алматы', speciality: 'Молочная продукция', since: 2025 },
  { slug: 'brand-8', name: '[Бренд 8]', country: 'kg', city: 'Каракол', speciality: 'Мёд', since: 2025 },
  { slug: 'brand-9', name: '[Бренд 9]', country: 'ru', city: 'Алтайский край', speciality: 'Крупы', since: 2024 },
  { slug: 'brand-10', name: '[Бренд 10]', country: 'ru', city: 'Краснодар', speciality: 'Масло и соусы', since: 2025 },
  { slug: 'brand-11', name: '[Бренд 11]', country: 'ru', city: 'Москва', speciality: 'Чай и кофе', since: 2025 },
  { slug: 'brand-12', name: '[Бренд 12]', country: 'by', city: 'Гродно', speciality: 'Замороженные продукты', since: 2025 },
]

type ProductSeed = {
  slug: string
  name: string
  brand: string
  category: string
  storage: Storage
  temperature?: string
  toOrder?: boolean
  popular?: boolean
  unitsPerBox: number
  boxesPerPallet: number
  price: number // small-wholesale price per box, SAR
}

export const products: ProductSeed[] = [
  { slug: 'semi-hard-cheese-45-200', name: 'Сыр полутвёрдый 45%, 200 г', brand: 'brand-1', category: 'dairy', storage: 'chilled', temperature: '+2…+6 °C', popular: true, unitsPerBox: 20, boxesPerPallet: 90, price: 118 },
  { slug: 'condensed-milk-380', name: 'Молоко сгущённое, 380 г', brand: 'brand-2', category: 'dairy', storage: 'ambient', popular: true, unitsPerBox: 30, boxesPerPallet: 70, price: 96 },
  { slug: 'cottage-cheese-9-350', name: 'Творог 9%, 350 г', brand: 'brand-1', category: 'dairy', storage: 'chilled', temperature: '+2…+6 °C', unitsPerBox: 12, boxesPerPallet: 100, price: 64 },
  { slug: 'sour-cream-20-300', name: 'Сметана 20%, 300 г', brand: 'brand-2', category: 'dairy', storage: 'chilled', temperature: '+2…+6 °C', unitsPerBox: 12, boxesPerPallet: 100, price: 52 },
  { slug: 'whole-milk-powder-500', name: 'Молоко сухое цельное, 500 г', brand: 'brand-7', category: 'dairy', storage: 'ambient', unitsPerBox: 20, boxesPerPallet: 60, price: 210 },
  { slug: 'butter-82-180', name: 'Масло сливочное 82,5%, 180 г', brand: 'brand-1', category: 'dairy', storage: 'chilled', temperature: '+2…+6 °C', unitsPerBox: 20, boxesPerPallet: 90, price: 142 },
  { slug: 'brine-cheese-400', name: 'Сыр рассольный, 400 г', brand: 'brand-1', category: 'dairy', storage: 'chilled', temperature: '+2…+6 °C', unitsPerBox: 10, boxesPerPallet: 90, price: 104 },
  { slug: 'kefir-25-900', name: 'Кефир 2,5%, 900 мл', brand: 'brand-2', category: 'dairy', storage: 'chilled', temperature: '+2…+6 °C', unitsPerBox: 12, boxesPerPallet: 60, price: 58 },
  { slug: 'frozen-syrniki-400', name: 'Сырники замороженные, 400 г', brand: 'brand-12', category: 'frozen', storage: 'frozen', temperature: '−18 °C', unitsPerBox: 12, boxesPerPallet: 80, price: 88 },
  { slug: 'buckwheat-900', name: 'Гречневая крупа, 900 г', brand: 'brand-9', category: 'grains', storage: 'ambient', popular: true, unitsPerBox: 12, boxesPerPallet: 84, price: 62 },
  { slug: 'wheat-flour-2kg', name: 'Мука пшеничная в/с, 2 кг', brand: 'brand-4', category: 'grains', storage: 'ambient', popular: true, unitsPerBox: 6, boxesPerPallet: 80, price: 44 },
  { slug: 'pasta-horns-450', name: 'Макароны «Рожки», 450 г', brand: 'brand-4', category: 'grains', storage: 'ambient', unitsPerBox: 20, boxesPerPallet: 72, price: 50 },
  { slug: 'oat-flakes-500', name: 'Хлопья овсяные, 500 г', brand: 'brand-9', category: 'grains', storage: 'ambient', unitsPerBox: 16, boxesPerPallet: 70, price: 46 },
  { slug: 'dried-fruit-mix-500', name: 'Сухофрукты ассорти, 500 г', brand: 'brand-5', category: 'snacks', storage: 'ambient', popular: true, unitsPerBox: 12, boxesPerPallet: 96, price: 132 },
  { slug: 'walnuts-400', name: 'Грецкий орех очищенный, 400 г', brand: 'brand-5', category: 'snacks', storage: 'ambient', unitsPerBox: 12, boxesPerPallet: 96, price: 168 },
  { slug: 'sunflower-seeds-300', name: 'Семечки жареные, 300 г', brand: 'brand-10', category: 'snacks', storage: 'ambient', unitsPerBox: 24, boxesPerPallet: 60, price: 54 },
  { slug: 'waffles-chocolate-300', name: 'Вафли шоколадные, 300 г', brand: 'brand-3', category: 'confectionery', storage: 'ambient', unitsPerBox: 18, boxesPerPallet: 80, price: 74 },
  { slug: 'gingerbread-400', name: 'Пряники классические, 400 г', brand: 'brand-3', category: 'confectionery', storage: 'ambient', unitsPerBox: 14, boxesPerPallet: 80, price: 58 },
  { slug: 'chocolate-candies-1kg', name: 'Конфеты шоколадные, 1 кг', brand: 'brand-3', category: 'confectionery', storage: 'ambient', toOrder: true, unitsPerBox: 6, boxesPerPallet: 90, price: 186 },
  { slug: 'buckwheat-honey-500', name: 'Мёд гречишный, 500 г', brand: 'brand-6', category: 'honey', storage: 'ambient', unitsPerBox: 12, boxesPerPallet: 90, price: 156 },
  { slug: 'white-honey-500', name: 'Мёд белый горный, 500 г', brand: 'brand-8', category: 'honey', storage: 'ambient', unitsPerBox: 12, boxesPerPallet: 90, price: 178 },
  { slug: 'raspberry-jam-350', name: 'Варенье малиновое, 350 г', brand: 'brand-6', category: 'honey', storage: 'ambient', unitsPerBox: 12, boxesPerPallet: 100, price: 82 },
  { slug: 'sunflower-oil-1l', name: 'Масло подсолнечное, 1 л', brand: 'brand-10', category: 'oils', storage: 'ambient', unitsPerBox: 15, boxesPerPallet: 60, price: 92 },
  { slug: 'mayonnaise-67-400', name: 'Майонез 67%, 400 мл', brand: 'brand-10', category: 'oils', storage: 'ambient', toOrder: true, unitsPerBox: 24, boxesPerPallet: 56, price: 98 },
  { slug: 'black-tea-100', name: 'Чай чёрный листовой, 100 г', brand: 'brand-11', category: 'tea', storage: 'ambient', unitsPerBox: 24, boxesPerPallet: 120, price: 116 },
  { slug: 'instant-coffee-190', name: 'Кофе растворимый, 190 г', brand: 'brand-11', category: 'tea', storage: 'ambient', toOrder: true, unitsPerBox: 12, boxesPerPallet: 120, price: 214 },
  { slug: 'frozen-pelmeni-800', name: 'Пельмени из говядины (халяль), 800 г', brand: 'brand-12', category: 'frozen', storage: 'frozen', temperature: '−18 °C', unitsPerBox: 10, boxesPerPallet: 80, price: 124 },
]
