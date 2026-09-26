import type { MetadataRoute } from 'next'

import { routing } from '@/i18n/routing'
import { getPayloadClient } from '@/lib/payload'

export const dynamic = 'force-dynamic'

const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayloadClient()
  const [categories, brands, products] = await Promise.all([
    payload.find({ collection: 'categories', limit: 1000, depth: 0, select: { slug: true } }),
    payload.find({ collection: 'brands', limit: 1000, depth: 0, select: { slug: true } }),
    payload.find({ collection: 'products', limit: 10000, depth: 0, select: { slug: true, updatedAt: true } }),
  ])

  const paths = [
    '',
    '/catalog',
    '/brands',
    '/producers',
    '/how-it-works',
    '/about',
    ...categories.docs.map((c) => `/catalog/${c.slug}`),
    ...brands.docs.map((b) => `/brands/${b.slug}`),
    ...products.docs.map((p) => `/product/${p.slug}`),
  ]

  return routing.locales.flatMap((locale) =>
    paths.map((path) => ({ url: `${base}/${locale}${path}` })),
  )
}
