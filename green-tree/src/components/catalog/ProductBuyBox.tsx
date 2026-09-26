'use client'

import { useState } from 'react'

import { useRouter } from '@/i18n/navigation'
import { tiers, units, type Tier, type Unit } from '@/lib/catalog'

import { useInquiry } from '../inquiry/InquiryProvider'

type TierPrice = {
  tier: Tier
  price: string
  perUnit: string
  min: string
  minQty: number
  unit: Unit
}

type Props = {
  productId: number
  slug: string
  name: string
  brand?: string
  prices: TierPrice[]
  packaging: {
    unitsPerBox?: number | null
    boxesPerPallet?: number | null
    palletsPerContainer?: number | null
  }
  pricesNote: string
}

// Tier choice, quantity and unit for one product, as in the product mockup
export function ProductBuyBox({
  productId,
  slug,
  name,
  brand,
  prices,
  packaging,
  pricesNote,
}: Props) {
  const { add } = useInquiry()
  const router = useRouter()
  const [tier, setTier] = useState<Tier>('small')
  const current = prices.find((p) => p.tier === tier)!
  const [quantity, setQuantity] = useState(current.minQty)
  const [unit, setUnit] = useState<Unit>(current.unit)
  const [status, setStatus] = useState<'idle' | 'added'>('idle')

  function chooseTier(next: Tier) {
    const p = prices.find((x) => x.tier === next)!
    setTier(next)
    setQuantity(p.minQty)
    setUnit(p.unit)
  }

  function addToInquiry() {
    add({ productId, slug, name, brand, tier, quantity, unit })
    setStatus('added')
    setTimeout(() => setStatus('idle'), 2000)
  }

  return (
    <div className="card p-5 md:p-7">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-lg font-semibold">Оптовые цены</h2>
        <p className="text-muted text-xs">{pricesNote}</p>
      </div>

      <fieldset className="mt-4 grid gap-3">
        <legend className="sr-only">Уровень опта</legend>
        {tiers.map((t) => {
          const p = prices.find((x) => x.tier === t.value)!
          const active = tier === t.value
          return (
            <label
              key={t.value}
              className={`flex cursor-pointer flex-wrap items-center gap-x-4 gap-y-2 rounded-2xl border p-4 transition-colors ${
                active
                  ? 'border-forest bg-forest-soft/60 border-2'
                  : 'border-line hover:border-forest/40'
              }`}
            >
              <input
                type="radio"
                name="tier"
                value={t.value}
                checked={active}
                onChange={() => chooseTier(t.value)}
                className="accent-forest size-5"
              />
              <span className="min-w-40 flex-1">
                <span className="block font-semibold">{t.label}</span>
                <span className="text-muted text-sm">{t.audience}</span>
              </span>
              <span className="text-sm">{p.min}</span>
              <span className="ms-auto text-end">
                <span className="font-display block text-lg font-bold whitespace-nowrap">
                  {p.price}
                </span>
                <span className="text-muted text-xs">{p.perUnit}</span>
              </span>
            </label>
          )
        })}
      </fieldset>

      <div className="mt-5 flex flex-wrap items-end gap-3">
        <div>
          <span className="text-muted mb-1.5 block text-sm" id="qty-label">
            Количество
          </span>
          <div
            className="border-line flex h-12 items-center rounded-xl border bg-white"
            role="group"
            aria-labelledby="qty-label"
          >
            <button
              type="button"
              aria-label="Меньше"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="h-full px-4 text-lg"
            >
              −
            </button>
            <input
              id="quantity"
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
              className="w-14 bg-transparent text-center font-semibold outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
            />
            <button
              type="button"
              aria-label="Больше"
              onClick={() => setQuantity((q) => q + 1)}
              className="h-full px-4 text-lg"
            >
              +
            </button>
          </div>
        </div>
        <div>
          <label htmlFor="unit" className="text-muted mb-1.5 block text-sm">
            Единица
          </label>
          <select
            id="unit"
            value={unit}
            onChange={(e) => setUnit(e.target.value as Unit)}
            className="border-line h-12 rounded-xl border bg-white px-3"
          >
            {units.map((u) => (
              <option key={u.value} value={u.value}>
                {u.label}
              </option>
            ))}
          </select>
        </div>
        <button type="button" onClick={addToInquiry} className="btn-primary h-12">
          {status === 'added' ? 'Добавлено в заявку' : 'Добавить в заявку'}
        </button>
        <button
          type="button"
          onClick={() => {
            add({ productId, slug, name, brand, tier, quantity, unit })
            router.push('/inquiry?quote=1')
          }}
          className="btn-outline h-12"
        >
          Запросить КП
        </button>
      </div>
      {current.minQty > 0 && quantity < current.minQty && unit === current.unit && (
        <p className="mt-3 text-sm text-[#9a3b1b]">
          Минимальный объём для этого уровня: {current.min}.
        </p>
      )}

      {(packaging.unitsPerBox || packaging.boxesPerPallet || packaging.palletsPerContainer) && (
        <dl className="border-line mt-5 flex flex-wrap gap-x-6 gap-y-1 border-t pt-4 text-sm">
          <div className="flex gap-1">
            <dt className="font-semibold">Коробка:</dt>
            <dd>{packaging.unitsPerBox ?? '—'} шт</dd>
          </div>
          <div className="flex gap-1">
            <dt className="font-semibold">Паллета:</dt>
            <dd>{packaging.boxesPerPallet ?? '—'} коробок</dd>
          </div>
          <div className="flex gap-1">
            <dt className="font-semibold">Контейнер 40′:</dt>
            <dd>{packaging.palletsPerContainer ?? '—'} паллет</dd>
          </div>
        </dl>
      )}
    </div>
  )
}
