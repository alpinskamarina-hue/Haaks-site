import type { CollectionConfig } from 'payload'

export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: { singular: 'Категория', plural: 'Категории' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'order'],
    group: 'Каталог',
  },
  access: { read: () => true },
  defaultSort: 'order',
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
    { name: 'image', label: 'Фото', type: 'upload', relationTo: 'media' },
    { name: 'order', label: 'Порядок', type: 'number', defaultValue: 0 },
  ],
}
