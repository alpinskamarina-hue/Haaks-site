import { expect, test } from '@playwright/test'

test('buyer adds a product and sends an inquiry', async ({ page }) => {
  await page.goto('http://localhost:3000/ru/product/semi-hard-cheese-45-200')
  await page.getByRole('radio', { name: /Средний опт/ }).check()
  await page.getByRole('button', { name: 'Добавить в заявку' }).click()
  await expect(page.getByRole('button', { name: 'Добавлено в заявку' })).toBeVisible()

  await page.goto('http://localhost:3000/ru/inquiry')
  await expect(page.getByRole('link', { name: 'Сыр полутвёрдый 45%, 200 г' })).toBeVisible()

  // Required fields are checked on the server
  await page.getByRole('button', { name: 'Отправить заявку' }).click()
  await expect(page.getByText('Укажите название компании')).toBeVisible()

  await page.getByRole('textbox', { name: 'Компания', exact: true }).fill('Тестовая бакалея')
  await page.getByRole('textbox', { name: 'Контактное лицо' }).fill('Ахмед')
  await page.getByRole('textbox', { name: 'Телефон / WhatsApp' }).fill('+966 50 000 0000')
  await page.getByRole('button', { name: 'Отправить заявку' }).click()

  await expect(page.getByRole('heading', { name: 'Заявка отправлена' })).toBeVisible()
  await expect(page.getByText(/Номер заявки: \d+/)).toBeVisible()
})
