import { asMedia } from '@/lib/format'

import { BoxIcon } from '../icons'

// Product photo, or the box placeholder from the mockups while photos are missing
export function ProductImage({
  image,
  label,
  className = '',
}: {
  image?: unknown
  label?: string
  className?: string
}) {
  const media = asMedia(image)

  if (media?.url) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={media.url} alt={media.alt ?? ''} className={`object-contain ${className}`} />
    )
  }

  return (
    <div className={`bg-sand text-muted/80 flex flex-col items-center justify-center gap-2 ${className}`}>
      <BoxIcon width={36} height={36} strokeWidth={1.4} />
      {label && <span className="text-sm">{label}</span>}
    </div>
  )
}

export function LogoPlaceholder({ logo, className = '' }: { logo?: unknown; className?: string }) {
  const media = asMedia(logo)
  if (media?.url) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={media.url} alt={media.alt ?? ''} className={`object-contain ${className}`} />
    )
  }
  return (
    <div
      className={`bg-cream border-line text-muted flex items-center justify-center rounded-xl border border-dashed text-sm ${className}`}
    >
      Логотип бренда
    </div>
  )
}
