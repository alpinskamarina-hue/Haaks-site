import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'

import { Breadcrumbs } from '@/components/Breadcrumbs'
import { InquiryPageClient } from '@/components/inquiry/InquiryPage'
import { whatsappLink } from '@/lib/contacts'
import { getPayloadClient } from '@/lib/payload'

export const metadata: Metadata = { title: 'Заявка — Green Tree', robots: { index: false } }

type Props = {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ quote?: string; pricelist?: string }>
}

export default async function InquiryPage({ params, searchParams }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const sp = await searchParams

  let presetComment: string | undefined
  if (sp.pricelist) {
    const payload = await getPayloadClient()
    const brand = (
      await payload.find({ collection: 'brands', where: { slug: { equals: sp.pricelist } }, limit: 1, depth: 0 })
    ).docs[0]
    if (brand) presetComment = `Пришлите, пожалуйста, прайс-лист бренда ${brand.name}.`
  } else if (sp.quote) {
    presetComment = 'Прошу коммерческое предложение на товары из заявки.'
  }

  return (
    <div className="container-page py-6 md:py-8">
      <Breadcrumbs items={[{ label: 'Заявка' }]} />
      <h1 className="font-display mt-4 text-3xl font-bold md:text-5xl">
        {sp.quote ? 'Запрос коммерческого предложения' : 'Оптовая заявка'}
      </h1>
      <p className="text-muted mt-3 max-w-2xl">
        Соберите товары и отправьте заявку. Менеджер проверит наличие на складе в Джидде и пришлёт
        коммерческое предложение.
      </p>
      <InquiryPageClient whatsapp={whatsappLink()} presetComment={presetComment} />
    </div>
  )
}
