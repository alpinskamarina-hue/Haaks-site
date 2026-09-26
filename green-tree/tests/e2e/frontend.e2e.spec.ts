import { expect, test } from '@playwright/test'

test.describe('Storefront', () => {
  test('root redirects to the visitor language', async ({ browser }) => {
    for (const [lang, locale] of [
      ['ar-SA', 'ar'],
      ['ru-RU', 'ru'],
      ['de-DE', 'ar'], // unsupported language falls back to Arabic
    ]) {
      const context = await browser.newContext({ locale: lang })
      const page = await context.newPage()
      await page.goto('http://localhost:3000/')
      await expect(page).toHaveURL(new RegExp(`/${locale}$`))
      await context.close()
    }
  })

  for (const [locale, dir, title] of [
    ['ar', 'rtl', /Green Tree/],
    ['en', 'ltr', /Green Tree/],
    ['ru', 'ltr', /Green Tree/],
  ] as const) {
    test(`home page renders in ${locale}`, async ({ page }) => {
      await page.goto(`http://localhost:3000/${locale}`)
      await expect(page).toHaveTitle(title)
      await expect(page.locator('html')).toHaveAttribute('lang', locale)
      await expect(page.locator('html')).toHaveAttribute('dir', dir)
      await expect(page.locator('h1')).toBeVisible()
    })
  }
})
