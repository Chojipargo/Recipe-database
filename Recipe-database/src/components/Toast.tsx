import { useEffect } from 'react'
import { Icon } from './Icon'

export type ToastTone = 'success' | 'error' | 'info'

export interface ToastItem {
  id: number
  message: string
  description?: string
  tone: ToastTone
}

const toneStyles: Record<
  ToastTone,
  { icon: 'checkCircle' | 'alertCircle' | 'info'; iconClass: string }
> = {
  success: { icon: 'checkCircle', iconClass: 'text-olive-300' },
  error: { icon: 'alertCircle', iconClass: 'text-paprika-300' },
  info: { icon: 'info', iconClass: 'text-butter-300' },
}

function ToastCard({ toast, onDismiss }: { toast: ToastItem; onDismiss: (id: number) => void }) {
  const tone = toneStyles[toast.tone]

  useEffect(() => {
    const timer = window.setTimeout(() => onDismiss(toast.id), 4500)
    return () => window.clearTimeout(timer)
  }, [toast.id, onDismiss])

  return (
    <div
      className="animate-slide-in flex items-start gap-3 rounded-2xl bg-ink-900 px-4 py-3.5 text-cream-50 shadow-lift"
      role="status"
    >
      <Icon name={tone.icon} className={`mt-0.5 h-5 w-5 shrink-0 ${tone.iconClass}`} />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold leading-snug">{toast.message}</p>
        {toast.description && (
          <p className="mt-0.5 text-xs leading-relaxed text-cream-200/75">{toast.description}</p>
        )}
      </div>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        className="rounded-full p-1 text-cream-200/60 transition hover:bg-white/10 hover:text-white"
        aria-label="Dismiss notification"
      >
        <Icon name="x" className="h-4 w-4" />
      </button>
    </div>
  )
}

export function ToastStack({
  toasts,
  onDismiss,
}: {
  toasts: ToastItem[]
  onDismiss: (id: number) => void
}) {
  return (
    <div className="pointer-events-none fixed inset-x-4 bottom-24 z-[80] flex flex-col items-end gap-2 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-96">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto w-full">
          <ToastCard toast={toast} onDismiss={onDismiss} />
        </div>
      ))}
    </div>
  )
}
