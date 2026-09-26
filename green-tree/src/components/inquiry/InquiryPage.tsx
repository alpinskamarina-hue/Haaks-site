'use client'

import { useState, useTransition } from 'react'

import { submitInquiry, type InquiryResult } from '@/actions/inquiry'
import { Link } from '@/i18n/navigation'
import { tiers, units, type Tier, type Unit } from '@/lib/catalog'

import { ContactFields } from './ContactFields'
import { useInquiry } from './InquiryProvider'

const contactFields = [
  { name: 'company', label: 'Компания', required: true, autoComplete: 'organization' },
  { name: 'contactName', label: 'Контактное лицо', required: true, autoComplete: 'name' },
  { name: 'phone', label: 'Телефон / WhatsApp', type: 'tel', required: true, placeholder: '+966 …', autoComplete: 'tel' },
  { name: 'email', label: 'Email', type: 'email', autoComplete: 'email' },
  { name: 'crNumber', label: 'CR (коммерческая регистрация)' },
  { name: 'vatNumber', label: 'VAT (номер плательщика НДС)' },
  { name: 'city', label: 'Город доставки', placeholder: 'Джидда, Эр-Рияд, Даммам…', wide: true },
  { name: 'comment', label: 'Комментарий', type: 'textarea', wide: true },
]

export function InquiryPageClient({
  whatsapp,
  intro,
  presetComment,
}: {
  whatsapp: string
  intro?: string
  presetComment?: string
}) {
  const { items, update, remove, clear, ready } = useInquiry()
  const [result, setResult] = useState<InquiryResult | null>(null)
  const [sentSummary, setSentSummary] = useState('')
  const [pending, startTransition] = useTransition()

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    form.set('type', 'order')
    form.set('items', JSON.stringify(items))
    const summary = [
      `Заявка Green Tree от ${form.get('company')}`,
      ...items.map((i) => `• ${i.name}: ${i.quantity} ${units.find((u) => u.value === i.unit)?.short}`),
    ].join('\n')

    startTransition(async () => {
      const res = await submitInquiry(form)
      setResult(res)
      if (res.ok) {
        setSentSummary(summary + (res.id ? `\nНомер заявки: ${res.id}` : ''))
        clear()
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    })
  }

  if (result?.ok) {
    const wa = `${whatsapp}?text=${encodeURIComponent(sentSummary)}`
    return (
      <div className="card mx-auto mt-8 max-w-2xl p-8 text-center">
        <p className="bg-forest-soft text-forest mx-auto grid size-14 place-items-center rounded-full text-2xl">✓</p>
        <h2 className="font-display mt-4 text-2xl font-bold">Заявка отправлена</h2>
        <p className="text-muted mt-2">
          {result.id ? `Номер заявки: ${result.id}. ` : ''}Менеджер свяжется с вами в течение рабочего дня и
          пришлёт коммерческое предложение с ценами вашего уровня опта.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <a href={wa} target="_blank" rel="noopener noreferrer" className="btn-primary">
            Продублировать в WhatsApp
          </a>
          <Link href="/catalog" className="btn-outline">
            Вернуться в каталог
          </Link>
        </div>
      </div>
    )
  }

  const errors = result && !result.ok ? result.fields : undefined

  return (
    <form onSubmit={onSubmit} className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_1fr]" noValidate>
      <section className="card p-5 md:p-7" aria-labelledby="items-title">
        <h2 id="items-title" className="text-lg font-semibold">
          Товары в заявке
        </h2>
        {intro && <p className="text-muted mt-1 text-sm">{intro}</p>}

        {!ready ? null : items.length === 0 ? (
          <div className="bg-cream mt-4 rounded-xl p-6 text-sm">
            <p>Заявка пока пустая.</p>
            <p className="text-muted mt-1">
              Добавьте товары из{' '}
              <Link href="/catalog" className="text-forest font-semibold underline">
                каталога
              </Link>{' '}
              или опишите, что нужно, в комментарии справа.
            </p>
          </div>
        ) : (
          <ul className="divide-line mt-4 divide-y">
            {items.map((item) => (
              <li key={item.productId} className="grid gap-3 py-4 sm:grid-cols-[1fr_auto] sm:items-center">
                <div>
                  <Link href={`/product/${item.slug}`} className="hover:text-forest font-medium">
                    {item.name}
                  </Link>
                  {item.brand && <p className="text-muted text-xs">{item.brand}</p>}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <label className="sr-only" htmlFor={`qty-${item.productId}`}>
                    Количество
                  </label>
                  <input
                    id={`qty-${item.productId}`}
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) => update(item.productId, { quantity: Math.max(1, Number(e.target.value) || 1) })}
                    className="border-line h-10 w-20 rounded-lg border bg-white px-2 text-center"
                  />
                  <label className="sr-only" htmlFor={`unit-${item.productId}`}>
                    Единица
                  </label>
                  <select
                    id={`unit-${item.productId}`}
                    value={item.unit}
                    onChange={(e) => update(item.productId, { unit: e.target.value as Unit })}
                    className="border-line h-10 rounded-lg border bg-white px-2 text-sm"
                  >
                    {units.map((u) => (
                      <option key={u.value} value={u.value}>
                        {u.label}
                      </option>
                    ))}
                  </select>
                  <label className="sr-only" htmlFor={`tier-${item.productId}`}>
                    Уровень опта
                  </label>
                  <select
                    id={`tier-${item.productId}`}
                    value={item.tier}
                    onChange={(e) => update(item.productId, { tier: e.target.value as Tier })}
                    className="border-line h-10 rounded-lg border bg-white px-2 text-sm"
                  >
                    {tiers.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => remove(item.productId)}
                    className="text-muted hover:text-ink px-2 text-sm underline"
                  >
                    Убрать
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
        {errors?.items && <p className="mt-3 text-sm text-[#9a3b1b]">{errors.items}</p>}
        <p className="text-muted mt-4 text-xs">
          Цены без НДС 15%. Итоговые цены и сроки менеджер подтвердит в коммерческом предложении.
        </p>
      </section>

      <section className="card p-5 md:p-7" aria-labelledby="contact-title">
        <h2 id="contact-title" className="text-lg font-semibold">
          Ваша компания
        </h2>
        <p className="text-muted mt-1 mb-4 text-sm">
          CR и VAT нужны, чтобы открыть цены вашего уровня и выставлять счета ZATCA. Можно указать позже.
        </p>
        <ContactFields
          fields={contactFields.map((f) => (f.name === 'comment' ? { ...f, defaultValue: presetComment } : f))}
          errors={errors}
        />
        {result && !result.ok && <p className="mt-4 text-sm font-semibold text-[#9a3b1b]">{result.error}</p>}
        <button type="submit" disabled={pending} className="btn-primary mt-5 w-full disabled:opacity-60">
          {pending ? 'Отправляем…' : 'Отправить заявку'}
        </button>
      </section>
    </form>
  )
}
