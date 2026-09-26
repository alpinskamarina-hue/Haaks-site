import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'

import { SimplePage } from '@/components/SimplePage'
import { officialFacts } from '@/content/home'

export const metadata: Metadata = { title: 'О компании — Green Tree' }

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  setRequestLocale((await params).locale)
  return (
    <SimplePage
      title="О компании"
      lead="Green Tree — торговый дом в Джидде. Мы импортируем продукты из России и СНГ, регистрируем их в SFDA, храним на собственном складе и продаём оптом по всему Королевству."
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <section className="card p-6">
          <h2 className="font-semibold">Работаем официально</h2>
          <dl className="mt-4 grid gap-3 sm:grid-cols-2">
            {officialFacts.map((f) => (
              <div key={f.title} className="bg-cream rounded-xl p-4">
                <dt className="text-sm font-semibold">{f.title}</dt>
                <dd className="text-muted mt-1 text-xs">{f.value}</dd>
              </div>
            ))}
          </dl>
        </section>
        <section className="card p-6">
          <h2 className="font-semibold">Склад в Джидде</h2>
          <p className="text-muted mt-3 text-sm leading-relaxed">
            [Адрес склада, площадь, температурные зоны: обычная, охлаждённая +2…+6 °C, заморозка −18 °C. Контроль
            сроков годности каждой партии.]
          </p>
        </section>
      </div>
    </SimplePage>
  )
}
