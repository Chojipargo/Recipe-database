import { useState } from 'react'
import type { Recipe, RecipeMatch } from '../data/mockData'
import { formatTime, pluralize } from '../lib/format'
import { Avatar } from './Avatar'
import { Icon } from './Icon'

interface RecipeCardProps {
  recipe: Recipe
  match?: RecipeMatch
  authorName?: string
  isFavorite?: boolean
  onOpen: (recipeId: number) => void
  onToggleFavorite?: (recipeId: number) => void
  animationDelay?: number
}

function MatchBadge({ match }: { match: RecipeMatch }) {
  if (match.status === 'none') return null

  if (match.status === 'ready') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-olive-600/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white backdrop-blur-sm">
        <Icon name="check" className="h-3 w-3" strokeWidth={2.5} />
        Ready to cook
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-ink-800 backdrop-blur-sm">
      <Icon name="shoppingBag" className="h-3 w-3 text-paprika-500" />
      {pluralize(match.missingIngredients.length, 'missing')}
    </span>
  )
}

export function RecipeCard({
  recipe,
  match,
  authorName = 'Community cook',
  isFavorite = false,
  onOpen,
  onToggleFavorite,
  animationDelay = 0,
}: RecipeCardProps) {
  const [imageFailed, setImageFailed] = useState(false)

  return (
    <article
      className="group card animate-fade-up flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-cream-200">
        {!imageFailed && recipe.image_url ? (
          <img
            src={recipe.image_url}
            alt={recipe.title}
            loading="lazy"
            onError={() => setImageFailed(true)}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-cream-200 via-butter-100 to-olive-100 text-olive-600">
            <Icon name="chefHat" className="h-14 w-14 opacity-60" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink-900/35 via-transparent to-transparent" />

        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {match && <MatchBadge match={match} />}
        </div>

        {onToggleFavorite && (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              onToggleFavorite(recipe.recipe_id)
            }}
            className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-md transition ${
              isFavorite
                ? 'bg-paprika-500 text-white'
                : 'bg-white/85 text-ink-700 hover:bg-white hover:text-paprika-500'
            }`}
            aria-label={isFavorite ? `Remove ${recipe.title} from saved recipes` : `Save ${recipe.title}`}
            aria-pressed={isFavorite}
          >
            <Icon
              name="heart"
              className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`}
              strokeWidth={2}
            />
          </button>
        )}

        <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-ink-900/75 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
          <Icon name="clock" className="h-3.5 w-3.5" />
          {formatTime(recipe.prep_time + recipe.cook_time)}
        </span>

        {match && match.status !== 'none' && (
          <span className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-[11px] font-bold text-ink-800 backdrop-blur-sm">
            {match.matchPercent}%
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-[22px] font-semibold leading-[1.15] tracking-[-0.02em] text-ink-900">
          <button
            type="button"
            onClick={() => onOpen(recipe.recipe_id)}
            className="text-left transition-colors hover:text-paprika-600"
          >
            {recipe.title}
          </button>
        </h3>

        <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-500">
          <span className="inline-flex items-center gap-1.5">
            <Icon name="clock" className="h-3.5 w-3.5 text-ink-400" />
            {formatTime(recipe.prep_time + recipe.cook_time)}
          </span>
          <span className="h-1 w-1 rounded-full bg-cream-300" />
          <span className="inline-flex items-center gap-1.5">
            <Icon name="users" className="h-3.5 w-3.5 text-ink-400" />
            Serves {recipe.serving}
          </span>
        </div>

        {match &&
          match.status !== 'none' &&
          match.status !== 'ready' &&
          match.missingIngredients.length > 0 && (
          <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-ink-500">
            <span className="font-semibold text-paprika-600">Missing:</span>{' '}
            {match.missingIngredients
              .slice(0, 3)
              .map((ingredient) => ingredient.name.toLowerCase())
              .join(', ')}
            {match.missingIngredients.length > 3
              ? ` +${match.missingIngredients.length - 3} more`
              : ''}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-cream-100 pt-4">
          <div className="flex min-w-0 items-center gap-2">
            <Avatar name={authorName} size="xs" />
            <span className="truncate text-[11px] font-medium text-ink-500">{authorName}</span>
          </div>
          <button
            type="button"
            onClick={() => onOpen(recipe.recipe_id)}
            className="inline-flex items-center gap-1 text-xs font-bold text-paprika-600 transition hover:gap-2 hover:text-paprika-700"
          >
            View recipe
            <Icon name="arrowRight" className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </article>
  )
}
