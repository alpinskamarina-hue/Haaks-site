import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'

import { SimplePage } from '@/components/SimplePage'
import { tierBlocks } from '@/content/home'
import { Link } from '@/i18n/navigation'

export const metadata: Metadata = { title: 'Как это работает — Green Tree' }

const buyerSteps = [
  { title: 'Регистрация компании', text: 'Укажите CR и VAT. Мы проверим данные и откроем цены вашего уровня опта.' },
  { title: 'Заявка', text: 'Соберите товары в каталоге и отправьте заявку или запрос КП.' },
  { title: 'Подтверждение и счёт', text: 'Менеджер подтвердит наличие и сроки, выставит счёт ZATCA.' },
  { title: 'Оплата', text: 'Банковский перевод, Mada. Для постоянных клиентов — отсрочка.' },
  { title: 'Доставка', text: 'Со склада в Джидде или паллетами по всей KSA. Крупный опт — контейнер под заказ.' },
]

export default async function HowItWorksPage({ params }: { params: Promise<{ locale: string }> }) {
  setRequestLocale((await params).locale)
  return (
    <SimplePage
      title="Как это работает"
      lead="Для оптовых покупателей в Саудовской Аравии: от регистрации компании до доставки."
    >
      <ol className="grid gap-3 md:grid-cols-5">
        {buyerSteps.map((s, i) => (
          <li key={s.title} className="card p-5">
            <span className="bg-forest-soft text-forest grid size-8 place-items-center rounded-full text-sm font-bold">
              {i + 1}
            </span>
            <h2 className="mt-3 font-semibold">{s.title}</h2>
            <p className="text-muted mt-1 text-sm">{s.text}</p>
          </li>
        ))}
      </ol>
      <h2 className="font-display mt-12 text-2xl font-bold">Уровни опта</h2>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {tierBlocks.map((t) => (
          <div key={t.title} className="card p-5">
            <h3 className="font-semibold">{t.title}</h3>
            <p className="text-forest mt-1 text-sm font-semibold">{t.min}</p>
            <p className="text-muted mt-2 text-sm">{t.text}</p>
          </div>
        ))}
      </div>
      <p className="mt-8">
        Производитель?{' '}
        <Link href="/producers" className="text-forest font-semibold underline">
          Как мы выводим бренды на рынок KSA
        </Link>
      </p>
    </SimplePage>
  )
}
