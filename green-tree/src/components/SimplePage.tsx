import { Breadcrumbs } from './Breadcrumbs'

export function SimplePage({
  title,
  lead,
  children,
}: {
  title: string
  lead?: string
  children?: React.ReactNode
}) {
  return (
    <div className="container-page py-6 md:py-8">
      <Breadcrumbs items={[{ label: title }]} />
      <h1 className="font-display mt-4 max-w-3xl text-3xl leading-tight font-bold text-balance md:text-5xl">
        {title}
      </h1>
      {lead && <p className="text-muted mt-4 max-w-2xl text-base leading-relaxed md:text-lg">{lead}</p>}
      <div className="mt-8">{children}</div>
    </div>
  )
}
