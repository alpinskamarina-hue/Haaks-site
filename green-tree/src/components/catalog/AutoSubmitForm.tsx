'use client'

import React from 'react'

// Filter form that applies itself as soon as a checkbox or select changes.
// Works without JavaScript too: the "Показать" button submits it normally.
export function AutoSubmitForm({
  children,
  ...props
}: React.FormHTMLAttributes<HTMLFormElement> & { children: React.ReactNode }) {
  return (
    <form
      {...props}
      method="get"
      onChange={(e) => {
        const target = e.target as unknown as HTMLInputElement
        if (target.type === 'search' || target.type === 'text') return
        e.currentTarget.requestSubmit()
      }}
    >
      {children}
    </form>
  )
}
