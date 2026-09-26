import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'

import { SimplePage } from '@/components/SimplePage'
import { Link } from '@/i18n/navigation'

export const metadata: Metadata = { title: 'Личный кабинет — Green Tree', robots: { index: false } }

// Stage 2: buyer accounts with CR/VAT verification
export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  setRequestLocale((await params).locale)
  return (
    <SimplePage title="Личный кабинет" lead="Кабинет покупателя с заказами, счетами ZATCA и документами появится на следующем этапе.">
      <div className="flex flex-wrap gap-3">
        <Link href="/inquiry" className="btn-primary">
          Отправить заявку
        </Link>
        <Link href="/catalog" className="btn-outline">
          Открыть каталог
        </Link>
      </div>
    </SimplePage>
  )
}
