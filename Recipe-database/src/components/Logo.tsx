import { Icon } from './Icon'

interface LogoProps {
  compact?: boolean
  className?: string
}

export function Logo({ compact = false, className = '' }: LogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-paprika-500 text-white shadow-[0_10px_20px_-10px_rgba(201,95,53,0.9)]">
        <Icon name="chefHat" className="h-6 w-6" strokeWidth={1.9} />
      </div>
      {!compact && (
        <div className="leading-none">
          <p className="font-display text-[21px] font-semibold tracking-[-0.03em] text-ink-900">
            Fridge <span className="text-paprika-500">&amp;</span> Fork
          </p>
          <p className="mt-1.5 text-[9px] font-bold uppercase tracking-[0.22em] text-ink-400">
            Smart recipe finder
          </p>
        </div>
      )}
    </div>
  )
}
