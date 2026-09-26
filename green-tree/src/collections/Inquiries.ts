import type { CollectionConfig } from 'payload'

import { tiers, units } from '@/lib/catalog'

// Requests from the site: wholesale orders from buyers and partnership requests
// from producers. Created only from server code; the admin team reads them here.
export const Inquiries: CollectionConfig = {
  slug: 'inquiries',
  labels: { singular: 'Заявка', plural: 'Заявки' },
  admin: {
    useAsTitle: 'company',
    defaultColumns: ['company', 'type', 'status', 'phone', 'createdAt'],
    group: 'Продажи',
  },
  access: {
    create: () => false,
    read: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  defaultSort: '-createdAt',
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'type',
          label: 'Тип',
          type: 'select',
          required: true,
          defaultValue: 'order',
          options: [
            { value: 'order', label: 'Оптовая заявка' },
            { value: 'partner', label: 'Производитель: стать партнёром' },
          ],
        },
        {
          name: 'status',
          label: 'Статус',
          type: 'select',
          required: true,
          defaultValue: 'new',
          options: [
            { value: 'new', label: 'Новая' },
            { value: 'in-progress', label: 'В работе' },
            { value: 'done', label: 'Закрыта' },
          ],
        },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'company', label: 'Компания', type: 'text', required: true },
        { name: 'contactName', label: 'Контактное лицо', type: 'text', required: true },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'phone', label: 'Телефон / WhatsApp', type: 'text', required: true },
        { name: 'email', label: 'Email', type: 'email' },
        { name: 'city', label: 'Город / страна', type: 'text' },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'crNumber', label: 'CR', type: 'text' },
        { name: 'vatNumber', label: 'VAT', type: 'text' },
        {
          name: 'tier',
          label: 'Уровень опта',
          type: 'select',
          options: tiers.map(({ value, label }) => ({ value, label })),
        },
      ],
    },
    {
      name: 'items',
      label: 'Позиции',
      type: 'array',
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'product', label: 'Товар', type: 'relationship', relationTo: 'products' },
            { name: 'productName', label: 'Название на момент заявки', type: 'text' },
            { name: 'quantity', label: 'Количество', type: 'number', min: 1 },
            {
              name: 'unit',
              label: 'Единица',
              type: 'select',
              options: units.map(({ value, label }) => ({ value, label })),
            },
          ],
        },
      ],
    },
    { name: 'comment', label: 'Комментарий', type: 'textarea' },
  ],
}
