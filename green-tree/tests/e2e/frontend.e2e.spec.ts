import { expect, test } from '@playwright/test'

test.describe('Storefront', () => {
  test('root redirects to the visitor language', async ({ browser }) => {
    // Only Russian is live for now, so every visitor lands on /ru
    for (const [lang, locale] of [
      ['ar-SA', 'ru'],
      ['ru-RU', 'ru'],
      ['de-DE', 'ru'],
    ]) {
      const context = await browser.newContext({ locale: lang })
      const page = await context.newPage()
      await page.goto('http://localhost:3000/')
      await expect(page).toHaveURL(new RegExp(`/${locale}$`))
      await context.close()
    }
  })

  for (const [locale, dir, title] of [['ru', 'ltr', /Green Tree/]] as const) {
    test(`home page renders in ${locale}`, async ({ page }) => {
      await page.goto(`http://localhost:3000/${locale}`)
      await expect(page).toHaveTitle(title)
      await expect(page.locator('html')).toHaveAttribute('lang', locale)
      await expect(page.locator('html')).toHaveAttribute('dir', dir)
      await expect(page.locator('h1')).toBeVisible()
    })
  }
})

test.describe('Catalogue', () => {
  test('filters by country and switches tier', async ({ page }) => {
    await page.goto('http://localhost:3000/ru/catalog')
    await page.getByRole('checkbox', { name: 'Казахстан' }).check()
    await expect(page).toHaveURL(/country=kz/)
    await expect(page.getByText('Найдено товаров: 3')).toBeVisible()
    await page.getByRole('link', { name: 'Крупный опт' }).click()
    await expect(page).toHaveURL(/tier=large/)
    await expect(page.getByText(/Крупный опт: от 10 паллет/)).toBeVisible()
  })

  test('product, brand and category pages open', async ({ page }) => {
    for (const path of ['/ru/catalog/dairy', '/ru/product/buckwheat-900', '/ru/brands', '/ru/brands/brand-4']) {
      const res = await page.goto(`http://localhost:3000${path}`)
      expect(res?.status(), path).toBe(200)
      await expect(page.locator('h1')).toBeVisible()
    }
  })
})
