import { Link } from '@/i18n/navigation'

import { ArrowIcon } from './icons'

export function SectionHeader({
  title,
  link,
  aside,
}: {
  title: string
  link?: { href: string; label: string }
  aside?: string
}) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <h2 className="font-display text-2xl font-bold md:text-3xl">{title}</h2>
      {link && (
        <Link
          href={link.href}
          className="text-forest inline-flex items-center gap-1 text-sm font-semibold underline underline-offset-2"
        >
          {link.label} <ArrowIcon />
        </Link>
      )}
      {aside && <p className="text-muted text-xs">{aside}</p>}
    </div>
  )
}
