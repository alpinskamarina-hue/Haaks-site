import { getTranslations } from 'next-intl/server'

export async function Footer() {
  const t = await getTranslations('footer')

  return (
    <footer className="border-line mt-16 border-t">
      <div className="container-page text-muted flex items-center justify-between py-8 text-sm">
        <span className="font-display text-ink font-bold" dir="ltr">
          Green Tree
        </span>
        <span>{t('rights')}</span>
      </div>
    </footer>
  )
}
