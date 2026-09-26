import { getPayload } from 'payload'

import config from '@payload-config'

import { brands, categories, products } from './data'

// Replaces the catalogue with demo data. Run with: npm run seed
const payload = await getPayload({ config })

for (const collection of ['products', 'brands', 'categories'] as const) {
  await payload.delete({ collection, where: { id: { exists: true } } })
}

const categoryIds = new Map<string, number>()
for (const [order, c] of categories.entries()) {
  const doc = await payload.create({ collection: 'categories', data: { ...c, order } })
  categoryIds.set(c.slug, doc.id)
}

const brandIds = new Map<string, number>()
for (const b of brands) {
  const doc = await payload.create({
    collection: 'brands',
    data: {
      ...b,
      halal: true,
      sfda: true,
      description:
        'О бренде: история, производство, ключевые продукты. Текст готовит производитель в своём кабинете, мы переводим его на арабский и английский.',
      documents: [{ title: 'Халяль-сертификат (PDF)' }, { title: 'Регистрация производителя в SFDA (PDF)' }],
    },
  })
  brandIds.set(b.slug, doc.id)
}

const round = (n: number) => Math.round(n * 100) / 100

for (const p of products) {
  await payload.create({
    collection: 'products',
    data: {
      slug: p.slug,
      name: p.name,
      brand: brandIds.get(p.brand)!,
      category: categoryIds.get(p.category)!,
      storage: p.storage,
      temperature: p.temperature,
      availability: p.toOrder ? 'to-order' : 'jeddah',
      popular: p.popular ?? false,
      halal: true,
      sfda: true,
      arabicLabel: true,
      packaging: {
        unitsPerBox: p.unitsPerBox,
        boxesPerPallet: p.boxesPerPallet,
        palletsPerContainer: 20,
      },
      prices: {
        small: { price: p.price, minQty: 5, unit: 'boxes' },
        medium: { price: round(p.price * 0.92), minQty: 1, unit: 'pallets' },
        large: { price: round(p.price * 0.85), minQty: 10, unit: 'pallets' },
      },
      description:
        'Короткое описание от производителя: вкус, применение, особенности. Заполняется в кабинете производителя.',
      composition: 'Состав, КБЖУ на 100 г, аллергены — по данным производителя.',
      shelfLife: 'Срок годности партии на складе указывается при заказе.',
      documents: [
        { title: 'Халяль-сертификат (PDF)' },
        { title: 'Регистрация SFDA (PDF)' },
        { title: 'Спецификация для закупщиков (PDF)' },
      ],
    },
  })
}

payload.logger.info(
  `Seeded ${categories.length} categories, ${brands.length} brands, ${products.length} products`,
)
process.exit(0)
