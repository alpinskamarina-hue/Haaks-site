'use client'

import { useState, useTransition } from 'react'

import { submitInquiry, type InquiryResult } from '@/actions/inquiry'

import { ContactFields } from './ContactFields'

const fields = [
  { name: 'company', label: 'Компания-производитель', required: true, autoComplete: 'organization' },
  { name: 'contactName', label: 'Контактное лицо', required: true, autoComplete: 'name' },
  { name: 'phone', label: 'Телефон / WhatsApp', type: 'tel', required: true, placeholder: '+7 …', autoComplete: 'tel' },
  { name: 'email', label: 'Email', type: 'email', autoComplete: 'email' },
  { name: 'city', label: 'Страна и город производства', wide: true },
  {
    name: 'comment',
    label: 'Ассортимент',
    type: 'textarea',
    placeholder: 'Какие товары хотите вывести в Саудовскую Аравию, объёмы, есть ли халяль-сертификат',
    wide: true,
  },
]

export function PartnerForm() {
  const [result, setResult] = useState<InquiryResult | null>(null)
  const [pending, startTransition] = useTransition()

  if (result?.ok) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center">
        <h3 className="font-display text-xl font-bold">Спасибо, заявка получена</h3>
        <p className="text-muted mt-2">
          Мы изучим ассортимент и свяжемся с вами, чтобы обсудить спрос в KSA и следующие шаги.
        </p>
      </div>
    )
  }

  return (
    <form
      noValidate
      className="rounded-2xl bg-white p-5 md:p-7"
      onSubmit={(e) => {
        e.preventDefault()
        const form = new FormData(e.currentTarget)
        form.set('type', 'partner')
        startTransition(async () => setResult(await submitInquiry(form)))
      }}
    >
      <ContactFields fields={fields} errors={result && !result.ok ? result.fields : undefined} />
      {result && !result.ok && <p className="mt-4 text-sm font-semibold text-[#9a3b1b]">{result.error}</p>}
      <button type="submit" disabled={pending} className="btn-primary mt-5 w-full disabled:opacity-60 sm:w-auto">
        {pending ? 'Отправляем…' : 'Отправить заявку'}
      </button>
    </form>
  )
}
