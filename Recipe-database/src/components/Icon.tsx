import type { ReactNode } from 'react'

export type IconName =
  | 'chefHat'
  | 'search'
  | 'sparkles'
  | 'fridge'
  | 'clock'
  | 'users'
  | 'flame'
  | 'plus'
  | 'minus'
  | 'x'
  | 'check'
  | 'checkCircle'
  | 'alertCircle'
  | 'info'
  | 'menu'
  | 'home'
  | 'bookOpen'
  | 'user'
  | 'database'
  | 'leaf'
  | 'chevronRight'
  | 'chevronLeft'
  | 'chevronDown'
  | 'arrowRight'
  | 'arrowLeft'
  | 'arrowUpRight'
  | 'trash'
  | 'heart'
  | 'bookmark'
  | 'eye'
  | 'eyeOff'
  | 'camera'
  | 'filter'
  | 'refresh'
  | 'logOut'
  | 'settings'
  | 'mail'
  | 'lock'
  | 'image'
  | 'star'
  | 'list'
  | 'shoppingBag'
  | 'lightbulb'
  | 'play'
  | 'pencil'
  | 'utensils'
  | 'shieldCheck'
  | 'loader'

const paths: Record<IconName, ReactNode> = {
  chefHat: (
    <>
      <path d="M6.5 17.5a4.5 4.5 0 1 1 1.2-8.8 5.5 5.5 0 0 1 10.6 0 4.5 4.5 0 1 1 1.2 8.8" />
      <path d="M6 17.5h12" />
      <path d="M8 17.5V21h8v-3.5" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </>
  ),
  sparkles: (
    <>
      <path d="m12 3-1.6 4.9a2 2 0 0 1-1.3 1.3L4 10.8l4.9 1.6a2 2 0 0 1 1.3 1.3L12 18.6l1.6-4.9a2 2 0 0 1 1.3-1.3l4.9-1.6-4.9-1.6a2 2 0 0 1-1.3-1.3L12 3Z" />
      <path d="M19 15.5 19.7 18l2.3.7-2.3.7L19 22l-.7-2.6-2.3-.7 2.3-.7.7-2.5Z" />
    </>
  ),
  fridge: (
    <>
      <rect x="5" y="2" width="14" height="20" rx="2" />
      <path d="M5 10h14" />
      <path d="M9 5v3" />
      <path d="M9 14v3" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  users: (
    <>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </>
  ),
  flame: (
    <path d="M12 22c4.4 0 7-2.8 7-6.5 0-3.2-2.1-5.6-4.1-7.4-.5-.4-1.2-.1-1.2.5 0 1.5-.6 3-1.5 3.9-.3.3-.8.2-1-.2-.5-1.1-.9-2.5-.9-4 0-1.9.5-3.7 1.4-5.1.3-.5-.2-1.1-.7-.9C7.7 4.3 5 8.5 5 15.5 5 19.2 7.6 22 12 22Z" />
  ),
  plus: (
    <>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </>
  ),
  minus: <path d="M5 12h14" />,
  x: (
    <>
      <path d="m18 6-12 12" />
      <path d="m6 6 12 12" />
    </>
  ),
  check: <path d="m20 6-11 11-5-5" />,
  checkCircle: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12 2.3 2.3 4.7-4.6" />
    </>
  ),
  alertCircle: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v5" />
      <path d="M12 16.5h.01" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5" />
      <path d="M12 7.5h.01" />
    </>
  ),
  menu: (
    <>
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </>
  ),
  home: (
    <>
      <path d="m3 10 9-7 9 7v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-9Z" />
      <path d="M9 21v-7h6v7" />
    </>
  ),
  bookOpen: (
    <>
      <path d="M12 6.5C10.5 5 8.5 4.3 6 4.3c-.6 0-1 .4-1 1v13.4c0 .6.4 1 1 1 2.5 0 4.5.7 6 2.2 1.5-1.5 3.5-2.2 6-2.2.6 0 1-.4 1-1V5.3c0-.6-.4-1-1-1-2.5 0-4.5.7-6 2.2Z" />
      <path d="M12 6.5V22" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </>
  ),
  database: (
    <>
      <ellipse cx="12" cy="5" rx="8" ry="3" />
      <path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5" />
      <path d="M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" />
    </>
  ),
  leaf: (
    <>
      <path d="M20 4c-8 0-14 3.5-14 10a5 5 0 0 0 5 5c6.5 0 9-6 9-15Z" />
      <path d="M4 21c2-6 6-9 12-12" />
    </>
  ),
  chevronRight: <path d="m9 18 6-6-6-6" />,
  chevronLeft: <path d="m15 18-6-6 6-6" />,
  chevronDown: <path d="m6 9 6 6 6-6" />,
  arrowRight: (
    <>
      <path d="M4 12h16" />
      <path d="m14 6 6 6-6 6" />
    </>
  ),
  arrowLeft: (
    <>
      <path d="M20 12H4" />
      <path d="m10 18-6-6 6-6" />
    </>
  ),
  arrowUpRight: (
    <>
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </>
  ),
  trash: (
    <>
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
    </>
  ),
  heart: (
    <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
  ),
  bookmark: <path d="M6 3h12v18l-6-4-6 4V3Z" />,
  eye: (
    <>
      <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  eyeOff: (
    <>
      <path d="m3 3 18 18" />
      <path d="M10.6 6.2A10.9 10.9 0 0 1 12 6c6.5 0 10 6 10 6a17 17 0 0 1-3 3.6" />
      <path d="M6.3 6.3A17.5 17.5 0 0 0 2 12s3.5 6 10 6a11 11 0 0 0 4.7-1" />
      <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
    </>
  ),
  camera: (
    <>
      <path d="M4 7h3l1.5-2h7L17 7h3a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Z" />
      <circle cx="12" cy="13" r="4" />
    </>
  ),
  filter: <path d="M3 5h18l-7 8v6l-4 2v-8L3 5Z" />,
  refresh: (
    <>
      <path d="M20 11a8 8 0 1 0-2.3 6.3" />
      <path d="M20 4v7h-7" />
    </>
  ),
  logOut: (
    <>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="m16 17 5-5-5-5" />
      <path d="M21 12H9" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1a1.7 1.7 0 0 0 1.9.3A1.7 1.7 0 0 0 10 3V2.8h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </>
  ),
  lock: (
    <>
      <rect x="4" y="10" width="16" height="11" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
      <path d="M12 14v3" />
    </>
  ),
  image: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-5-5L5 21" />
    </>
  ),
  star: <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-2.9-5.6 2.9 1.1-6.2L3 9.6l6.2-.9L12 3Z" />,
  list: (
    <>
      <path d="M8 6h13" />
      <path d="M8 12h13" />
      <path d="M8 18h13" />
      <path d="M3 6h.01" />
      <path d="M3 12h.01" />
      <path d="M3 18h.01" />
    </>
  ),
  shoppingBag: (
    <>
      <path d="M6 7h12l1 14H5L6 7Z" />
      <path d="M9 7a3 3 0 0 1 6 0" />
    </>
  ),
  lightbulb: (
    <>
      <path d="M9 18h6" />
      <path d="M10 22h4" />
      <path d="M8.5 15.5a7 7 0 1 1 7 0c-.7.5-1 1.2-1 2.5h-5c0-1.3-.3-2-1-2.5Z" />
    </>
  ),
  play: <path d="m8 5 11 7-11 7V5Z" />,
  pencil: (
    <>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4L16.5 3.5Z" />
    </>
  ),
  utensils: (
    <>
      <path d="M4 3v7a3 3 0 0 0 6 0V3" />
      <path d="M7 3v18" />
      <path d="M17 3c-2 2-3 5-3 8 0 2 1 3 3 3h1V3h-1Z" />
      <path d="M18 14v7" />
    </>
  ),
  shieldCheck: (
    <>
      <path d="M12 3 4 6v6c0 5 3.4 8.4 8 9 4.6-.6 8-4 8-9V6l-8-3Z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  loader: (
    <>
      <path d="M12 2v4" />
      <path d="m16.2 7.8 2.8-2.8" />
      <path d="M18 12h4" />
      <path d="m16.2 16.2 2.8 2.8" />
      <path d="M12 18v4" />
      <path d="m4.9 19.1 2.8-2.8" />
      <path d="M2 12h4" />
      <path d="m4.9 4.9 2.8 2.8" />
    </>
  ),
}

interface IconProps {
  name: IconName
  className?: string
  strokeWidth?: number
}

export function Icon({ name, className = 'h-5 w-5', strokeWidth = 1.8 }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  )
}
