'use server'

import { isTier, units, type Tier, type Unit } from '@/lib/catalog'
import { getPayloadClient } from '@/lib/payload'

export type InquiryResult =
  | { ok: true; id: number }
  | { ok: false; error: string; fields?: Record<string, string> }

type ItemInput = { productId: number; name: string; quantity: number; unit: Unit; tier: Tier }

const isUnit = (v: unknown): v is Unit => units.some((u) => u.value === v)
const text = (form: FormData, key: string, max = 200) =>
  String(form.get(key) ?? '')
    .trim()
    .slice(0, max)

// Saves an order or partnership request from the site. The admin team sees it
// in /admin → Заявки.
export async function submitInquiry(form: FormData): Promise<InquiryResult> {
  // Bots fill every field; people never see this one
  if (text(form, 'website')) return { ok: true, id: 0 }

  const type = form.get('type') === 'partner' ? 'partner' : 'order'
  const data = {
    company: text(form, 'company'),
    contactName: text(form, 'contactName'),
    phone: text(form, 'phone', 40),
    email: text(form, 'email', 120),
    city: text(form, 'city'),
    crNumber: text(form, 'crNumber', 40),
    vatNumber: text(form, 'vatNumber', 40),
    comment: text(form, 'comment', 3000),
  }

  const fields: Record<string, string> = {}
  if (!data.company) fields.company = 'Укажите название компании'
  if (!data.contactName) fields.contactName = 'Укажите, как к вам обращаться'
  if (data.phone.replace(/\D/g, '').length < 7) fields.phone = 'Укажите телефон с кодом страны'
  if (data.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.email)) fields.email = 'Проверьте email'

  let items: ItemInput[] = []
  try {
    const parsed = JSON.parse(String(form.get('items') ?? '[]'))
    if (Array.isArray(parsed)) {
      items = parsed
        .filter((i) => Number.isInteger(i?.productId) && Number(i?.quantity) > 0)
        .slice(0, 100)
        .map((i) => ({
          productId: i.productId,
          name: String(i.name ?? '').slice(0, 200),
          quantity: Math.min(Math.floor(Number(i.quantity)), 100000),
          unit: isUnit(i.unit) ? i.unit : 'boxes',
          tier: isTier(i.tier) ? i.tier : 'small',
        }))
    }
  } catch {
    // malformed list: treat as empty
  }

  if (type === 'order' && items.length === 0 && !data.comment) {
    fields.items = 'Добавьте товары из каталога или опишите, что нужно, в комментарии'
  }

  if (Object.keys(fields).length) {
    return { ok: false, error: 'Проверьте выделенные поля', fields }
  }

  const payload = await getPayloadClient()

  // Keep only products that still exist; the name is stored as it was seen
  const existing = items.length
    ? await payload.find({
        collection: 'products',
        where: { id: { in: items.map((i) => i.productId) } },
        limit: items.length,
        depth: 0,
        select: { slug: true },
      })
    : { docs: [] }
  const existingIds = new Set(existing.docs.map((d) => d.id))

  // The most common tier among the items describes the request as a whole
  const tier = items.length
    ? (Object.entries(
        items.reduce<Record<string, number>>((acc, i) => ({ ...acc, [i.tier]: (acc[i.tier] ?? 0) + 1 }), {}),
      ).sort((a, b) => b[1] - a[1])[0][0] as Tier)
    : undefined

  try {
    const doc = await payload.create({
      collection: 'inquiries',
      overrideAccess: true,
      data: {
        type,
        status: 'new',
        ...data,
        email: data.email || undefined,
        tier,
        items: items.map((i) => ({
          product: existingIds.has(i.productId) ? i.productId : undefined,
          productName: i.name,
          quantity: i.quantity,
          unit: i.unit,
        })),
      },
    })
    payload.logger.info(`New ${type} inquiry #${doc.id} from ${data.company}`)
    return { ok: true, id: doc.id }
  } catch (err) {
    payload.logger.error({ err }, 'Could not save inquiry')
    return { ok: false, error: 'Не получилось отправить заявку. Попробуйте ещё раз или напишите нам в WhatsApp.' }
  }
}
