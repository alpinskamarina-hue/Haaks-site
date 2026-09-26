import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

import { getPayload } from 'payload'

import config from '@payload-config'

import type { Country } from '@/lib/catalog'

// Replaces the catalogue with the current Jeddah stock list
// (src/seed/stock/products.json, photos in src/seed/stock/images).
// Run with: npm run seed
const dirname = path.dirname(fileURLToPath(import.meta.url))

type StockItem = {
  sr: number
  name: string
  brand: string
  category: string
  quantity: number
  expiry: string
  image: string
  glutenFree: boolean
  organic: boolean
}

const categories = [
  { slug: 'pasta', name: 'Паста без глютена и из бобовых' },
  { slug: 'sauces', name: 'Соусы, песто и закуски' },
  { slug: 'olive-oil', name: 'Оливковое масло' },
  { slug: 'sweets', name: 'Шоколад и сладости' },
  { slug: 'seeds', name: 'Семена и суперфуды' },
  { slug: 'flour', name: 'Мука без глютена' },
  { slug: 'breakfast', name: 'Завтраки и снеки' },
  { slug: 'bakery', name: 'Хлеб без глютена' },
]

// Country is set only where it is known; the rest stay "Европа" until confirmed
const brands: { name: string; country: Country }[] = [
  { name: 'Probios', country: 'it' },
  { name: 'Felicia', country: 'it' },
  { name: 'Granda Tradizioni', country: 'it' },
  { name: 'La Fabbrica della Pasta', country: 'it' },
  { name: 'Sarchio', country: 'it' },
  { name: 'RAFA Gorrotxategi', country: 'es' },
  { name: 'DeliCatalia', country: 'es' },
  { name: 'Libre Bio', country: 'eu' },
  { name: 'Oliorama', country: 'eu' },
  { name: 'Weizenfrei', country: 'eu' },
]

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

const payload = await getPayload({ config })
const items: StockItem[] = JSON.parse(fs.readFileSync(path.join(dirname, 'stock/products.json'), 'utf8'))

for (const collection of ['products', 'brands', 'categories', 'media'] as const) {
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
    data: { ...b, slug: slugify(b.name), halal: false, sfda: false },
  })
  brandIds.set(b.name, doc.id)
}

const categoryImage = new Map<string, number>()
const usedSlugs = new Set<string>()
for (const item of items) {
  let slug = slugify(`${item.brand} ${item.name}`)
  if (usedSlugs.has(slug)) slug = `${slug}-${item.sr}`
  usedSlugs.add(slug)

  const image = await payload.create({
    collection: 'media',
    data: { alt: item.name },
    filePath: path.join(dirname, 'stock/images', item.image),
  })

  await payload.create({
    collection: 'products',
    data: {
      slug,
      name: item.name,
      brand: brandIds.get(item.brand)!,
      category: categoryIds.get(item.category)!,
      storage: 'ambient',
      availability: 'jeddah',
      // Not confirmed for this stock yet: set in the admin once documents are checked
      halal: false,
      sfda: false,
      arabicLabel: false,
      glutenFree: item.glutenFree,
      organic: item.organic,
      images: [image.id],
      stock: { quantity: item.quantity, expiryDate: item.expiry },
    },
  })
  if (!categoryImage.has(item.category)) categoryImage.set(item.category, image.id)
}

// Until real category photos are uploaded, each tile shows one of its products
for (const [slug, imageId] of categoryImage) {
  await payload.update({ collection: 'categories', id: categoryIds.get(slug)!, data: { image: imageId } })
}

payload.logger.info(
  `Imported ${items.length} products, ${brands.length} brands, ${categories.length} categories`,
)
process.exit(0)
