import React from 'react'

type IconProps = React.SVGProps<SVGSVGElement>

const base = {
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
}

export const CartIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M3 4h2l2.4 10.2a1 1 0 0 0 1 .8h8.9a1 1 0 0 0 1-.8L20 7H6" />
    <circle cx="9" cy="19" r="1.4" />
    <circle cx="17" cy="19" r="1.4" />
  </svg>
)

export const SearchIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m20 20-4-4" />
  </svg>
)

export const UserIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" />
  </svg>
)

export const HomeIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M3 11 12 4l9 7v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" />
  </svg>
)

export const GridIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <rect x="4" y="4" width="7" height="7" rx="1.5" />
    <rect x="13" y="4" width="7" height="7" rx="1.5" />
    <rect x="4" y="13" width="7" height="7" rx="1.5" />
    <rect x="13" y="13" width="7" height="7" rx="1.5" />
  </svg>
)

export const TagIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M3 12V4h8l10 10-8 8z" />
    <circle cx="7.5" cy="8.5" r="1.3" />
  </svg>
)

export const CheckIcon = (p: IconProps) => (
  <svg {...base} width={14} height={14} strokeWidth={2.4} {...p}>
    <path d="m5 12 5 5 9-10" />
  </svg>
)
