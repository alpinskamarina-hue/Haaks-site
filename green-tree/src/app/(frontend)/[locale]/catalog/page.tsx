import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'

import { CatalogView } from '@/components/catalog/CatalogView'
import type { SearchParams } from '@/lib/catalogQuery'

export const metadata: Metadata = { title: 'Оптовый каталог — Green Tree' }

type Props = {
  params: Promise<{ locale: string }>
  searchParams: Promise<SearchParams>
}

export default async function CatalogPage({ params, searchParams }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  return <CatalogView searchParams={await searchParams} />
}
