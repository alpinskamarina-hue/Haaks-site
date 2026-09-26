import { Link } from '@/i18n/navigation'

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Навигация" className="text-muted text-sm">
      <ol className="flex flex-wrap items-center gap-1">
        <li>
          <Link href="/" className="underline underline-offset-2">
            Главная
          </Link>
        </li>
        {items.map((item) => (
          <li key={item.label} className="flex items-center gap-1">
            <span aria-hidden>/</span>
            {item.href ? (
              <Link href={item.href} className="underline underline-offset-2">
                {item.label}
              </Link>
            ) : (
              <span aria-current="page">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
