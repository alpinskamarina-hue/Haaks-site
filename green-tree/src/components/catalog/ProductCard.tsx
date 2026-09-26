import { Link } from '@/i18n/navigation'
import { countries, labelOf, storageTypes, type Tier, type Unit } from '@/lib/catalog'
import { asBrand, formatSAR, minQtyText, showPrices, tierPrice } from '@/lib/format'
import type { Product } from '@/payload-types'

import { AddToInquiry } from '../inquiry/AddToInquiry'
import { ProductImage } from './PhotoPlaceholder'

type Props = {
  product: Product
  tier?: Tier
  // "compact" is the home-page card: country and halal on top, round + button
  variant?: 'full' | 'compact' | 'brand'
}

export function ProductCard({ product, tier = 'small', variant = 'full' }: Props) {
  const brand = asBrand(product.brand)
  const price = tierPrice(product, tier)
  const country = labelOf(countries, brand?.country)
  const unitsPerBox = product.packaging?.unitsPerBox

  const meta =
    variant === 'compact'
      ? [country, product.halal ? 'Халяль' : null]
      : variant === 'full'
        ? [`${brand?.name ?? ''} · ${country}`, labelOf(storageTypes, product.storage)]
        : []

  return (
    <article className="card group flex flex-col overflow-hidden">
      <Link href={`/product/${product.slug}`} className="block">
        <ProductImage image={product.images?.[0]} className="aspect-[4/3] w-full" />
      </Link>
      <div className="flex flex-1 flex-col p-4">
        {meta.length > 0 && (
          <p className="text-forest text-xs font-semibold">
            {meta.filter(Boolean).join(' · ')}
          </p>
        )}
        <h3 className="mt-1 text-sm leading-snug font-medium md:text-base">
          <Link href={`/product/${product.slug}`} className="hover:text-forest">
            {product.name}
          </Link>
        </h3>
        <div className="mt-auto flex items-end justify-between gap-3 pt-4">
          <div className="min-w-0">
            <p
              className={`font-display leading-tight font-bold ${
                variant === 'compact' ? 'text-sm md:text-base' : 'text-base md:text-lg'
              }`}
            >
              <span className="whitespace-nowrap">
                {showPrices ? formatSAR(price?.price) : 'Цена по запросу'}
              </span>
              {showPrices && <span className="text-muted font-sans text-xs font-normal whitespace-nowrap"> / кор.</span>}
            </p>
            <p className="text-muted mt-1 text-xs">
              {variant === 'brand' && 'Мелкий опт · '}
              {minQtyText(price?.minQty, price?.unit)}
              {variant === 'full' && unitsPerBox ? ` · ${unitsPerBox} шт в коробке` : ''}
            </p>
          </div>
          <AddToInquiry
            variant={variant === 'compact' ? 'icon' : 'label'}
            productId={product.id}
            slug={product.slug}
            name={product.name}
            brand={brand?.name}
            tier={tier}
            quantity={price?.minQty ?? 1}
            unit={(price?.unit as Unit) ?? 'boxes'}
          />
        </div>
      </div>
    </article>
  )
}

