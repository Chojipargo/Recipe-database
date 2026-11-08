import { getInitials } from '../lib/format'

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

const sizeStyles: Record<AvatarSize, string> = {
  xs: 'h-7 w-7 text-[10px]',
  sm: 'h-9 w-9 text-xs',
  md: 'h-11 w-11 text-sm',
  lg: 'h-16 w-16 text-lg',
  xl: 'h-24 w-24 text-2xl',
}

interface AvatarProps {
  name: string
  size?: AvatarSize
  className?: string
}

export function Avatar({ name, size = 'md', className = '' }: AvatarProps) {
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-paprika-400 to-paprika-600 font-bold text-white ring-2 ring-white ${sizeStyles[size]} ${className}`}
      aria-hidden="true"
    >
      {getInitials(name)}
    </div>
  )
}
