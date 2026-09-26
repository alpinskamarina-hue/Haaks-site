import { Link } from '@/i18n/navigation'
import { countries, labelOf } from '@/lib/catalog'
import { plural } from '@/lib/format'
import type { Brand } from '@/payload-types'

import { ArrowIcon } from '../icons'
import { LogoPlaceholder } from './PhotoPlaceholder'

export function BrandCard({
  brand,
  productCount,
  compact = false,
}: {
  brand: Brand
  productCount?: number
  compact?: boolean
}) {
  const subtitle = [labelOf(countries, brand.country), brand.speciality].filter(Boolean).join(' · ')

  if (compact) {
    return (
      <Link href={`/brands/${brand.slug}`} className="card hover:border-forest/40 block p-3">
        <LogoPlaceholder logo={brand.logo} className="aspect-[5/3] w-full" />
        <p className="mt-3 text-sm font-semibold">{brand.name}</p>
        <p className="text-muted text-xs">{subtitle}</p>
      </Link>
    )
  }

  return (
    <article className="card flex flex-col p-5">
      <LogoPlaceholder logo={brand.logo} className="aspect-[5/2] w-full" />
      <h3 className="mt-4 text-lg font-semibold">{brand.name}</h3>
      <p className="text-muted text-sm">{subtitle}</p>
      <div className="border-line mt-4 flex items-center justify-between border-t pt-4 text-sm">
        <span className="text-muted">
          {productCount ?? 0} {plural(productCount ?? 0, 'товар', 'товара', 'товаров')}
        </span>
        <Link
          href={`/brands/${brand.slug}`}
          className="text-forest inline-flex items-center gap-1 font-semibold underline underline-offset-2"
        >
          Товары бренда <ArrowIcon />
        </Link>
      </div>
    </article>
  )
}
