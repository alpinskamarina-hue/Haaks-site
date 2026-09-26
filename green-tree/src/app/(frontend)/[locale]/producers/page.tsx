import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'

import { Breadcrumbs } from '@/components/Breadcrumbs'
import { PartnerForm } from '@/components/inquiry/PartnerForm'
import { producerSteps, producerTariffs } from '@/content/home'
import { whatsappLink } from '@/lib/contacts'

export const metadata: Metadata = {
  title: 'Производителям: выход на рынок Саудовской Аравии — Green Tree',
  description:
    'Регистрация SFDA, халяль, арабская маркировка, логистика, таможня, склад в Джидде и оптовые продажи для производителей из России и СНГ.',
}

const services = [
  'Регистрация продукции в SFDA',
  'Халяль-сертификация',
  'Арабская маркировка',
  'Логистика и таможня, мы — импортёр',
  'Склад в Джидде с контролем сроков',
  'Продажи мелким, средним и крупным оптом',
]

export default async function ProducersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <div className="container-page py-6 md:py-8">
      <Breadcrumbs items={[{ label: 'Производителям' }]} />

      <section className="mt-4 grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-end">
        <div>
          <p className="text-forest text-xs font-semibold tracking-wider uppercase">
            Производителям из России и СНГ
          </p>
          <h1 className="font-display mt-3 text-3xl leading-tight font-bold text-balance md:text-5xl">
            Выход на рынок Саудовской Аравии под ключ
          </h1>
          <p className="text-muted mt-4 max-w-2xl text-base leading-relaxed md:text-lg">
            Мы берём на себя всё, что между вашим заводом и полкой магазина в Королевстве. Вы видите каждый шаг
            в кабинете производителя: регистрацию товаров, партии в пути, остатки на складе, продажи и выплаты.
          </p>
        </div>
        <ul className="grid gap-2 sm:grid-cols-2">
          {services.map((s) => (
            <li key={s} className="chip justify-start rounded-xl px-4 py-3 text-sm">
              <span className="text-forest">✓</span> {s}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12" aria-labelledby="steps">
        <h2 id="steps" className="font-display text-2xl font-bold md:text-3xl">
          Полный цикл в 6 шагов
        </h2>
        <ol className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          {producerSteps.map((step, i) => (
            <li key={step.title} className="card p-4">
              <span className="bg-forest-soft text-forest grid size-8 place-items-center rounded-full text-sm font-bold">
                {i + 1}
              </span>
              <h3 className="mt-3 text-sm font-semibold">{step.title}</h3>
              <p className="text-muted mt-1 text-xs leading-relaxed">{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-12" id="pricing" aria-labelledby="pricing-title">
        <h2 id="pricing-title" className="font-display text-2xl font-bold md:text-3xl">
          Тарифы
        </h2>
        <p className="text-muted mt-2">Точную стоимость считаем после анализа ассортимента.</p>
        <div className="mt-6 grid gap-3 md:grid-cols-3">
          {producerTariffs.map((t) => (
            <div key={t.label} className="card p-6">
              <p className="text-forest text-xs font-semibold">{t.label}</p>
              <p className="font-display mt-2 text-2xl font-bold">{t.price}</p>
              <p className="text-muted mt-1 text-sm">{t.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-card bg-forest-soft mt-12 grid gap-8 p-6 md:p-10 lg:grid-cols-[1fr_1.4fr]" id="apply">
        <div>
          <h2 className="font-display text-2xl font-bold md:text-3xl">Оставить заявку</h2>
          <p className="text-muted mt-3">
            Расскажите о компании и ассортименте. Мы оценим спрос и цену на полке в KSA и предложим план выхода
            на рынок.
          </p>
          <a
            href={whatsappLink('Здравствуйте! Хотим вывести нашу продукцию на рынок Саудовской Аравии.')}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline mt-6"
          >
            Написать в WhatsApp
          </a>
        </div>
        <PartnerForm />
      </section>
    </div>
  )
}
