'use client'

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

import type { Tier, Unit } from '@/lib/catalog'

export type InquiryItem = {
  productId: number
  slug: string
  name: string
  brand?: string
  quantity: number
  unit: Unit
  tier: Tier
}

type InquiryContext = {
  items: InquiryItem[]
  count: number
  ready: boolean
  add: (item: InquiryItem) => void
  update: (productId: number, patch: Partial<Pick<InquiryItem, 'quantity' | 'unit' | 'tier'>>) => void
  remove: (productId: number) => void
  clear: () => void
}

const STORAGE_KEY = 'gt-inquiry'

const Ctx = createContext<InquiryContext | null>(null)

// The inquiry is a wholesale "cart" kept in the browser until it is sent.
export function InquiryProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<InquiryItem[]>([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate from storage once
      if (saved) setItems(JSON.parse(saved))
    } catch {
      // storage unavailable: start with an empty inquiry
    }
    setReady(true)
  }, [])

  useEffect(() => {
    if (!ready) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      // ignore: the inquiry still works for this visit
    }
  }, [items, ready])

  const add = useCallback((item: InquiryItem) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === item.productId)
      if (!existing) return [...prev, item]
      return prev.map((i) =>
        i.productId === item.productId
          ? { ...i, ...item, quantity: i.unit === item.unit ? i.quantity + item.quantity : item.quantity }
          : i,
      )
    })
  }, [])

  const update = useCallback<InquiryContext['update']>((productId, patch) => {
    setItems((prev) => prev.map((i) => (i.productId === productId ? { ...i, ...patch } : i)))
  }, [])

  const remove = useCallback((productId: number) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId))
  }, [])

  const clear = useCallback(() => setItems([]), [])

  const value = useMemo(
    () => ({ items, count: items.length, ready, add, update, remove, clear }),
    [items, ready, add, update, remove, clear],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useInquiry() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useInquiry must be used inside InquiryProvider')
  return ctx
}
