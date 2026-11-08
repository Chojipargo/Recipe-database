import type { IngredientCategory } from '../data/mockData'

const FRACTIONS: Record<string, string> = {
  '0.25': '¼',
  '0.33': '⅓',
  '0.5': '½',
  '0.67': '⅔',
  '0.75': '¾',
}

export function formatQuantity(quantity: number): string {
  const whole = Math.floor(quantity)
  const remainder = Number((quantity - whole).toFixed(2))

  if (remainder === 0) return String(whole)

  const fraction = FRACTIONS[String(remainder)]
  if (fraction) return whole > 0 ? `${whole}${fraction}` : fraction

  return Number(quantity.toFixed(2)).toString()
}

export function formatUnit(unit: string, quantity: number): string {
  if (quantity <= 1) return unit

  const plurals: Record<string, string> = {
    piece: 'pieces',
    clove: 'cloves',
    slice: 'slices',
    can: 'cans',
    bunch: 'bunches',
    pinch: 'pinches',
    cup: 'cups',
  }

  return plurals[unit] ?? unit
}

export function formatTime(minutes: number): string {
  if (minutes < 60) return `${minutes} min`
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  return rest === 0 ? `${hours} hr` : `${hours} hr ${rest} min`
}

export function formatTotalTime(prep: number, cook: number): string {
  return formatTime(prep + cook)
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

export function pluralize(count: number, singular: string, plural?: string): string {
  return `${count} ${count === 1 ? singular : (plural ?? `${singular}s`)}`
}

export const categoryBadgeStyles: Record<IngredientCategory, string> = {
  Produce: 'border-olive-200 bg-olive-50 text-olive-700',
  Protein: 'border-paprika-200 bg-paprika-50 text-paprika-700',
  'Dairy & Eggs': 'border-butter-200 bg-butter-50 text-ink-700',
  Pantry: 'border-cream-300 bg-cream-100 text-ink-700',
  'Spices & Herbs': 'border-paprika-100 bg-paprika-50 text-paprika-600',
  Bakery: 'border-butter-200 bg-butter-50 text-ink-700',
}

export const categoryDotStyles: Record<IngredientCategory, string> = {
  Produce: 'bg-olive-400',
  Protein: 'bg-paprika-400',
  'Dairy & Eggs': 'bg-butter-400',
  Pantry: 'bg-cream-400',
  'Spices & Herbs': 'bg-paprika-300',
  Bakery: 'bg-butter-500',
}

export const categoryEmoji: Record<IngredientCategory, string> = {
  Produce: '🥬',
  Protein: '🍗',
  'Dairy & Eggs': '🥛',
  Pantry: '🫙',
  'Spices & Herbs': '🌿',
  Bakery: '🍞',
}
