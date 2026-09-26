'use client'

import { Link } from '@/i18n/navigation'

import { CartIcon } from '../icons'
import { useInquiry } from './InquiryProvider'

export function InquiryButton({ label }: { label: string }) {
  const { count } = useInquiry()

  return (
    <Link href="/inquiry" className="btn-primary hidden h-10 py-0 md:inline-flex">
      <CartIcon width={18} height={18} />
      {label}
      {count > 0 && (
        <span className="text-forest grid min-w-5 place-items-center rounded-full bg-white px-1.5 text-xs leading-5">
          {count}
        </span>
      )}
    </Link>
  )
}

export function InquiryCount() {
  const { count } = useInquiry()
  if (!count) return null
  return (
    <span className="bg-forest absolute -top-1 end-1/2 translate-x-4 rounded-full px-1.5 text-[10px] leading-4 font-semibold text-white rtl:-translate-x-4">
      {count}
    </span>
  )
}
