import type { CollectionConfig } from 'payload'

import { countries } from '@/lib/catalog'

export const Brands: CollectionConfig = {
  slug: 'brands',
  labels: { singular: 'Бренд', plural: 'Бренды' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'country', 'speciality', 'since'],
    group: 'Каталог',
  },
  access: { read: () => true },
  defaultSort: 'name',
  fields: [
    { name: 'name', label: 'Название', type: 'text', required: true },
    {
      name: 'slug',
      label: 'Адрес (латиницей)',
      type: 'text',
      required: true,
      unique: true,
      index: true,
    },
    { name: 'logo', label: 'Логотип', type: 'upload', relationTo: 'media' },
    {
      type: 'row',
      fields: [
        {
          name: 'country',
          label: 'Страна',
          type: 'select',
          required: true,
          options: [...countries],
          index: true,
        },
        { name: 'city', label: 'Город производства', type: 'text', localized: true },
        { name: 'since', label: 'На Green Tree с (год)', type: 'number' },
      ],
    },
    {
      name: 'speciality',
      label: 'Специализация',
      type: 'text',
      localized: true,
      admin: { description: 'Коротко, например: «Молочная продукция»' },
    },
    { name: 'description', label: 'О бренде', type: 'textarea', localized: true },
    {
      type: 'row',
      fields: [
        { name: 'halal', label: 'Халяль', type: 'checkbox', defaultValue: true },
        { name: 'sfda', label: 'Зарегистрирован в SFDA', type: 'checkbox', defaultValue: true },
      ],
    },
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
}
