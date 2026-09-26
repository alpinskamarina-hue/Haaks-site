import React from 'react'

type Field = {
  name: string
  label: string
  type?: string
  required?: boolean
  placeholder?: string
  autoComplete?: string
  wide?: boolean
  defaultValue?: string
}

export function ContactFields({ fields, errors }: { fields: Field[]; errors?: Record<string, string> }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {fields.map((f) => (
        <div key={f.name} className={f.wide ? 'sm:col-span-2' : ''}>
          <label htmlFor={f.name} className="mb-1.5 block text-sm font-medium">
            {f.label}
            {f.required && (
              <span aria-hidden className="text-[#9a3b1b]">
                {' *'}
              </span>
            )}
          </label>
          {f.type === 'textarea' ? (
            <textarea
              id={f.name}
              name={f.name}
              rows={4}
              defaultValue={f.defaultValue}
              placeholder={f.placeholder}
              aria-invalid={Boolean(errors?.[f.name])}
              className="border-line focus:border-forest w-full rounded-xl border bg-white px-3 py-2.5 outline-none"
            />
          ) : (
            <input
              id={f.name}
              name={f.name}
              type={f.type ?? 'text'}
              required={f.required}
              placeholder={f.placeholder}
              autoComplete={f.autoComplete}
              defaultValue={f.defaultValue}
              aria-invalid={Boolean(errors?.[f.name])}
              className="border-line focus:border-forest h-12 w-full rounded-xl border bg-white px-3 outline-none aria-invalid:border-[#9a3b1b]"
            />
          )}
          {errors?.[f.name] && <p className="mt-1 text-sm text-[#9a3b1b]">{errors[f.name]}</p>}
        </div>
      ))}
      {/* honeypot for bots */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
    </div>
  )
}
