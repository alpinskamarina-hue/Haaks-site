import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'

import { SimplePage } from '@/components/SimplePage'
import { Link } from '@/i18n/navigation'

export const metadata: Metadata = { title: 'Регистрация компании — Green Tree', robots: { index: false } }

// Stage 2: buyer accounts with CR/VAT verification
export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  setRequestLocale((await params).locale)
  return (
    <SimplePage title="Регистрация компании" lead="Регистрация оптовых покупателей с проверкой CR и VAT появится на следующем этапе. Пока отправьте заявку — менеджер откроет вам цены вручную.">
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
