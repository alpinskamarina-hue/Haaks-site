import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'

import { CatalogView } from '@/components/catalog/CatalogView'
import type { SearchParams } from '@/lib/catalogQuery'
import { getPayloadClient } from '@/lib/payload'

type Props = {
  params: Promise<{ locale: string; category: string }>
  searchParams: Promise<SearchParams>
}

async function findCategory(slug: string) {
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'categories',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 0,
  })
  return res.docs[0]
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params
  const doc = await findCategory(category)
  return { title: doc ? `${doc.name} оптом — Green Tree` : 'Каталог — Green Tree' }
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { locale, category } = await params
  setRequestLocale(locale)
  if (!(await findCategory(category))) notFound()
  return <CatalogView searchParams={await searchParams} presetCategory={category} />
}
