# Green Tree

B2B-платформа оптовых поставок продуктов из России и СНГ в Саудовскую Аравию (склад в Джидде).
Один домен и один каталог товаров, четыре зоны: публичный сайт, оптовый магазин, кабинет производителя, админка.

Стек: Next.js 16 (App Router) · Payload CMS 3 (админка на `/admin`) · Postgres · Tailwind CSS 4 · next-intl (AR / EN / RU, арабский — RTL и язык по умолчанию).

## Запуск локально

```bash
cp .env.example .env          # укажите DATABASE_URL и PAYLOAD_SECRET
npm install
npm run dev                   # http://localhost:3000 → /ar, админка: /admin
```

Нужен Postgres. Пример создания базы:

```sql
create user greentree with password 'greentree' createdb;
create database greentree owner greentree;
```

При первом заходе в `/admin` Payload создаст таблицы и предложит завести первого администратора.

## Проверки

```bash
npx tsc --noEmit
npm run lint
npm run build
npm run test:e2e              # Playwright; путь к Chromium можно задать через PLAYWRIGHT_CHROMIUM_PATH
```

## Структура

```
messages/{ar,en,ru}.json          тексты интерфейса
src/i18n/                         языки, маршрутизация, навигация
src/proxy.ts                      редирект / → /{язык}
src/app/(frontend)/[locale]/      страницы витрины
src/app/(frontend)/styles.css     дизайн-токены (цвета, шрифты, кнопки, карточки)
src/components/                   шапка, переключатель языков, мобильное меню, футер
src/app/(payload)/                админка и API Payload
src/collections/                  коллекции Payload
```

## Этапы

1. Витрина: главная, каталог с фильтрами и тремя уровнями опта, карточка товара, бренды, заявка. ← сейчас
2. Оптовый магазин: регистрация компании (CR/VAT), цены по уровню, кабинет покупателя, оплата, ZATCA.
3. Кабинет производителя: регистрация товаров, поставки, склад, продажи, выплаты.
4. Операционная админка: модерация, заказы, склад (FEFO), CRM, финансы.
