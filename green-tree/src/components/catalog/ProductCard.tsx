import { Link } from '@/i18n/navigation'
import { countries, labelOf, storageTypes, type Tier, type Unit } from '@/lib/catalog'
import {
  asBrand,
  formatDate,
  isShortDated,
  minQtyText,
  priceText,
  showPrices,
  tierPrice,
} from '@/lib/format'
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

  const hasPrice = showPrices && price?.price != null
  const meta =
    variant === 'compact'
      ? [brand?.name, country]
      : variant === 'full'
        ? [brand?.name, country, product.storage !== 'ambient' && labelOf(storageTypes, product.storage)]
        : [brand?.name]
  const tags = [product.glutenFree && 'Без глютена', product.organic && 'BIO', product.halal && 'Халяль'].filter(
    Boolean,
  ) as string[]
  const qty = product.stock?.quantity
  const expiry = product.stock?.expiryDate

  return (
    <article className="card group flex flex-col overflow-hidden">
      <Link href={`/product/${product.slug}`} className="relative block">
        <ProductImage image={product.images?.[0]} className="aspect-[4/3] w-full bg-white p-3" />
        {tags.length > 0 && (
          <ul className="absolute start-2 top-2 flex flex-wrap gap-1">
            {tags.map((t) => (
              <li key={t} className="tag bg-forest-soft/95 text-forest px-2 py-0.5 text-[11px]">
                {t}
              </li>
            ))}
          </ul>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-4">
        {meta.some(Boolean) && (
          <p className="text-forest text-xs font-semibold">{meta.filter(Boolean).join(' · ')}</p>
        )}
        <h3 className="mt-1 text-sm leading-snug font-medium md:text-base">
          <Link href={`/product/${product.slug}`} className="hover:text-forest">
            {product.name}
          </Link>
        </h3>
        <div className="mt-auto flex items-end justify-between gap-3 pt-4">
          <div className="min-w-0">
            <p
              className={
                !hasPrice
                  ? 'text-sm font-semibold'
                  : `font-display leading-tight font-bold ${
                      variant === 'compact' ? 'text-sm md:text-base' : 'text-base md:text-lg'
                    }`
              }
            >
              <span className="whitespace-nowrap">{priceText(price?.price)}</span>
              {hasPrice && (
                <span className="text-muted font-sans text-xs font-normal whitespace-nowrap"> / кор.</span>
              )}
            </p>
            {hasPrice && (
              <p className="text-muted mt-1 text-xs">
                {variant === 'brand' && 'Мелкий опт · '}
                {minQtyText(price?.minQty, price?.unit)}
                {variant === 'full' && unitsPerBox ? ` · ${unitsPerBox} шт в коробке` : ''}
              </p>
            )}
            {qty != null && (
              <p className="text-muted mt-1 text-xs">
                На складе: {qty.toLocaleString('ru-RU')} шт
                {expiry && (
                  <>
                    {' · '}
                    <span className={isShortDated(expiry) ? 'font-semibold text-[#9a3b1b]' : ''}>
                      до {formatDate(expiry)}
                    </span>
                  </>
                )}
              </p>
            )}
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

