'use client'

import { useState } from 'react'

import type { Tier, Unit } from '@/lib/catalog'

import { useInquiry } from './InquiryProvider'

type Props = {
  productId: number
  slug: string
  name: string
  brand?: string
  tier: Tier
  quantity: number
  unit: Unit
  variant?: 'label' | 'icon'
}

// Quick add from a product card: puts the tier minimum into the inquiry.
export function AddToInquiry({ variant = 'label', ...item }: Props) {
  const { add } = useInquiry()
  const [added, setAdded] = useState(false)

  function onClick() {
    add(item)
    setAdded(true)
    setTimeout(() => setAdded(false), 1600)
  }

  if (variant === 'icon') {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={`Добавить в заявку: ${item.name}`}
        className="bg-forest hover:bg-forest/90 grid size-10 shrink-0 place-items-center rounded-xl text-xl text-white"
      >
        {added ? '✓' : '+'}
      </button>
    )
  }

  return (
    <button type="button" onClick={onClick} className="btn-primary shrink-0 px-4 py-2.5">
      {added ? 'Добавлено' : 'В заявку'}
    </button>
  )
}
