import type { CollectionConfig, Field } from 'payload'

import { availabilityTypes, storageTypes, tiers, units } from '@/lib/catalog'

const tierPriceFields: Field[] = tiers.map((tier) => ({
  name: tier.value,
  label: tier.label,
  type: 'group',
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'price',
          label: 'Цена за коробку, SAR без НДС',
          type: 'number',
          min: 0,
        },
        { name: 'minQty', label: 'Минимальный объём', type: 'number', min: 0 },
        {
          name: 'unit',
          label: 'Единица минимума',
          type: 'select',
          defaultValue: tier.unit,
          options: units.map(({ value, label }) => ({ value, label })),
        },
      ],
    },
  ],
}))

export const Products: CollectionConfig = {
  slug: 'products',
  labels: { singular: 'Товар', plural: 'Товары' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'brand', 'category', 'availability', 'popular'],
    group: 'Каталог',
  },
  access: { read: () => true },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Основное',
          fields: [
            { name: 'name', label: 'Название', type: 'text', required: true, localized: true },
            {
              name: 'slug',
              label: 'Адрес (латиницей)',
              type: 'text',
              required: true,
              unique: true,
              index: true,
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'brand',
                  label: 'Бренд',
                  type: 'relationship',
                  relationTo: 'brands',
                  required: true,
                  index: true,
                },
                {
                  name: 'category',
                  label: 'Категория',
                  type: 'relationship',
                  relationTo: 'categories',
                  required: true,
                  index: true,
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'storage',
                  label: 'Хранение',
                  type: 'select',
                  required: true,
                  defaultValue: 'ambient',
                  options: [...storageTypes],
                },
                {
                  name: 'temperature',
                  label: 'Температура хранения',
                  type: 'text',
                  admin: { placeholder: '+2…+6 °C' },
                },
                {
                  name: 'availability',
                  label: 'Наличие',
                  type: 'select',
                  required: true,
                  defaultValue: 'jeddah',
                  options: [...availabilityTypes],
                },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'halal', label: 'Халяль', type: 'checkbox', defaultValue: true },
                { name: 'sfda', label: 'Зарегистрирован в SFDA', type: 'checkbox', defaultValue: true },
                { name: 'arabicLabel', label: 'Этикетка на арабском', type: 'checkbox', defaultValue: true },
                { name: 'popular', label: 'Популярное у оптовиков', type: 'checkbox' },
              ],
            },
            {
              name: 'images',
              label: 'Фото',
              type: 'upload',
              relationTo: 'media',
              hasMany: true,
            },
          ],
        },
        {
          label: 'Цены и упаковка',
          fields: [
            {
              name: 'packaging',
              label: 'Упаковка',
              type: 'group',
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'unitsPerBox', label: 'Штук в коробке', type: 'number', min: 1 },
                    { name: 'boxesPerPallet', label: 'Коробок в паллете', type: 'number', min: 1 },
                    {
                      name: 'palletsPerContainer',
                      label: 'Паллет в контейнере 40′',
                      type: 'number',
                      min: 1,
                    },
                  ],
                },
              ],
            },
            {
              name: 'prices',
              label: 'Цены по уровням опта',
              type: 'group',
              fields: tierPriceFields,
            },
          ],
        },
        {
          label: 'Описание и документы',
          fields: [
            { name: 'description', label: 'Описание', type: 'textarea', localized: true },
            {
              name: 'composition',
              label: 'Состав и пищевая ценность',
              type: 'textarea',
              localized: true,
            },
            { name: 'shelfLife', label: 'Хранение и срок годности', type: 'textarea', localized: true },
            {
              name: 'documents',
              label: 'Документы',
              type: 'array',
              fields: [
                { name: 'title', label: 'Название', type: 'text', required: true, localized: true },
                { name: 'file', label: 'Файл', type: 'upload', relationTo: 'media' },
              ],
            },
          ],
        },
      ],
    },
  ],
}
