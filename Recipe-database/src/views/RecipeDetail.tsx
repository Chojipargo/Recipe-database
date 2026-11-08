import { useMemo, useRef, useState } from 'react'
import type {
  Ingredient,
  Recipe,
  RecipeIngredient,
  User,
} from '../data/mockData'
import {
  categoryDotStyles,
  formatQuantity,
  formatTime,
  formatUnit,
  pluralize,
} from '../lib/format'
import { getRecipeIngredients, getRecipeMatch } from '../lib/matching'
import type { Route } from '../lib/routes'
import { Avatar } from '../components/Avatar'
import { Icon } from '../components/Icon'
import { RecipeCard } from '../components/RecipeCard'

interface RecipeDetailProps {
  recipeId: number
  recipes: Recipe[]
  ingredients: Ingredient[]
  recipeIngredients: RecipeIngredient[]
  users: User[]
  selectedIds: number[]
  favorites: number[]
  onAddIngredient: (ingredient: Ingredient) => void
  onRemoveIngredient: (ingredientId: number) => void
  onAddIngredients: (ingredientIds: number[]) => void
  onOpenRecipe: (recipeId: number) => void
  onToggleFavorite: (recipeId: number) => void
  onNavigate: (route: Route) => void
  notify: (message: string, tone?: 'success' | 'error' | 'info', description?: string) => void
}

export function RecipeDetail({
  recipeId,
  recipes,
  ingredients,
  recipeIngredients,
  users,
  selectedIds,
  favorites,
  onAddIngredient,
  onRemoveIngredient,
  onAddIngredients,
  onOpenRecipe,
  onToggleFavorite,
  onNavigate,
  notify,
}: RecipeDetailProps) {
  const [imageFailed, setImageFailed] = useState(false)
  const methodRef = useRef<HTMLDivElement>(null)

  const recipe = recipes.find((item) => item.recipe_id === recipeId)

  const rows = useMemo(
    () => (recipe ? getRecipeIngredients(recipe.recipe_id, recipeIngredients, ingredients) : []),
    [recipe, recipeIngredients, ingredients],
  )

  const match = useMemo(
    () =>
      recipe ? getRecipeMatch(recipe, recipeIngredients, ingredients, selectedIds) : null,
    [recipe, recipeIngredients, ingredients, selectedIds],
  )

  const similarRecipes = useMemo(() => {
    if (!recipe) return []
    const currentIngredientIds = new Set(rows.map((row) => row.ingredient_id))
    return recipes
      .filter((item) => item.recipe_id !== recipe.recipe_id)
      .map((item) => {
        const shared = recipeIngredients.filter(
          (row) => row.recipe_id === item.recipe_id && currentIngredientIds.has(row.ingredient_id),
        ).length
        return { recipe: item, shared }
      })
      .filter((entry) => entry.shared > 0)
      .sort((a, b) => b.shared - a.shared)
      .slice(0, 3)
      .map((entry) => entry.recipe)
  }, [recipe, recipes, recipeIngredients, rows])

  if (!recipe || !match) {
    return (
      <div className="card mx-auto max-w-lg px-6 py-14 text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-cream-100 text-ink-400">
          <Icon name="fridge" className="h-7 w-7" />
        </span>
        <h1 className="mt-5 font-display text-3xl font-semibold text-ink-900">Recipe not found</h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-500">
          We couldn&apos;t find recipe #{recipeId} in the catalog. It may have been removed, or the
          link may be out of date.
        </p>
        <button
          type="button"
          onClick={() => onNavigate({ view: 'matcher' })}
          className="btn-primary mt-6"
        >
          <Icon name="search" className="h-4 w-4" />
          Browse recipes
        </button>
      </div>
    )
  }

  const author = users.find((user) => user.user_id === recipe.submitted_by_user_id)
  const authorName = author?.username ?? 'Community cook'
  const totalTime = recipe.prep_time + recipe.cook_time
  const steps = recipe.instructions.split(/\n+/).filter(Boolean)
  const isFavorite = favorites.includes(recipe.recipe_id)
  const isReady = match.status === 'ready'
  const missingIds = match.missingIngredients.map((ingredient) => ingredient.ingredient_id)

  const progressColor = isReady
    ? 'var(--color-olive-500)'
    : match.matchPercent >= 60
      ? 'var(--color-butter-400)'
      : 'var(--color-paprika-300)'

  function handleAddMissing() {
    if (missingIds.length === 0) return
    onAddIngredients(missingIds)
    notify(
      `${pluralize(missingIds.length, 'ingredient')} added to your pantry`,
      'success',
      isReady ? 'Everything was already selected.' : 'Your match score just improved.',
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => onNavigate({ view: 'matcher' })}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-500 transition hover:text-paprika-600"
        >
          <Icon name="arrowLeft" className="h-4 w-4" />
          Back to matcher
        </button>
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-ink-400">
          Discover <span className="mx-1 text-ink-300">/</span> Recipe #
          {String(recipe.recipe_id).padStart(3, '0')}
        </p>
      </div>

      <section className="grid items-center gap-6 lg:grid-cols-[1.02fr_0.98fr] lg:gap-9">
        <div className="relative overflow-hidden rounded-[2rem] border-[6px] border-white bg-cream-200 shadow-lift">
          <div className="relative aspect-[4/3]">
            {!imageFailed && recipe.image_url ? (
              <img
                src={recipe.image_url}
                alt={recipe.title}
                onError={() => setImageFailed(true)}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-cream-200 via-butter-100 to-olive-100 text-olive-500">
                <Icon name="chefHat" className="h-16 w-16" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-ink-900/45 via-transparent to-transparent" />

            <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.14em] text-ink-700 backdrop-blur-sm">
              Recipe #{String(recipe.recipe_id).padStart(3, '0')}
            </span>

            <button
              type="button"
              onClick={() => onToggleFavorite(recipe.recipe_id)}
              className={`absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full backdrop-blur-md transition ${
                isFavorite
                  ? 'bg-paprika-500 text-white'
                  : 'bg-white/90 text-ink-700 hover:bg-white hover:text-paprika-500'
              }`}
              aria-label={isFavorite ? 'Remove from saved recipes' : 'Save recipe'}
              aria-pressed={isFavorite}
            >
              <Icon
                name="heart"
                className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`}
                strokeWidth={2}
              />
            </button>

            <div className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-ink-900/80 px-3 py-1.5 text-[10px] font-semibold text-white backdrop-blur-sm">
                <Icon name="clock" className="h-3.5 w-3.5" />
                {formatTime(totalTime)} total
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-[10px] font-semibold text-ink-700 backdrop-blur-sm">
                <Icon name="users" className="h-3.5 w-3.5" />
                Serves {recipe.serving}
              </span>
            </div>
          </div>
        </div>

        <div>
          <p className="eyebrow">From the recipe catalog</p>
          <h1 className="mt-2 font-display text-[40px] font-semibold leading-[0.98] tracking-[-0.035em] text-ink-900 sm:text-5xl">
            {recipe.title}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Avatar name={authorName} size="sm" />
              <div>
                <p className="text-[11px] font-bold text-ink-800">{authorName}</p>
                <p className="text-[9px] text-ink-400">Recipe contributor</p>
              </div>
            </div>
            <span className="h-7 w-px bg-cream-200" />
            <p className="text-[11px] font-medium text-ink-500">
              {pluralize(rows.length, 'ingredient')} · {steps.length} steps
            </p>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-2.5">
            {[
              { icon: 'clock' as const, value: formatTime(recipe.prep_time), label: 'Prep' },
              { icon: 'flame' as const, value: formatTime(recipe.cook_time), label: 'Cook' },
              { icon: 'users' as const, value: `${recipe.serving}`, label: 'Servings' },
            ].map((meta) => (
              <div
                key={meta.label}
                className="rounded-2xl border border-cream-200 bg-white px-3 py-3 text-center shadow-soft"
              >
                <Icon name={meta.icon} className="mx-auto h-4 w-4 text-paprika-500" />
                <p className="mt-1.5 text-[13px] font-bold text-ink-900">{meta.value}</p>
                <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-ink-400">
                  {meta.label}
                </p>
              </div>
            ))}
          </div>

          <div
            className={`mt-4 rounded-2xl border p-4 ${
              isReady
                ? 'border-olive-200 bg-olive-50'
                : selectedIds.length > 0
                  ? 'border-cream-200 bg-cream-50'
                  : 'border-cream-200 bg-white'
            }`}
          >
            {selectedIds.length > 0 ? (
              <div className="flex items-center gap-3.5">
                <div
                  className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full"
                  style={{
                    background: `conic-gradient(${progressColor} ${match.matchPercent}%, var(--color-cream-200) 0)`,
                  }}
                >
                  <div className="flex h-[42px] w-[42px] items-center justify-center rounded-full bg-white">
                    <span className="text-[12px] font-bold text-ink-900">{match.matchPercent}%</span>
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-bold text-ink-900">
                    {isReady
                      ? 'You can make this right now'
                      : `${match.missingIngredients.length} ${match.missingIngredients.length === 1 ? 'ingredient' : 'ingredients'} missing`}
                  </p>
                  <p className="mt-0.5 text-[10px] leading-relaxed text-ink-500">
                    {match.matchedIngredientIds.length} of {match.requiredCount} required
                    ingredients are in your pantry.
                  </p>
                  {!isReady && (
                    <p className="mt-1 line-clamp-1 text-[9px] text-ink-400">
                      Missing: {match.missingIngredients.map((item) => item.name.toLowerCase()).join(', ')}
                    </p>
                  )}
                </div>
                {!isReady && (
                  <button
                    type="button"
                    onClick={handleAddMissing}
                    className="hidden shrink-0 items-center gap-1 rounded-full bg-paprika-500 px-3 py-1.5 text-[10px] font-bold text-white transition hover:bg-paprika-600 sm:inline-flex"
                  >
                    <Icon name="plus" className="h-3 w-3" strokeWidth={2.4} />
                    Add missing
                  </button>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-cream-100 text-ink-500">
                  <Icon name="fridge" className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-bold text-ink-900">Match this recipe to your pantry</p>
                  <p className="mt-0.5 text-[10px] text-ink-500">
                    Add ingredients to see exactly what you already have.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate({ view: 'matcher' })}
                  className="shrink-0 rounded-full border border-cream-300 bg-white px-3 py-1.5 text-[10px] font-bold text-ink-700 transition hover:border-paprika-300 hover:text-paprika-600"
                >
                  Open matcher
                </button>
              </div>
            )}
          </div>

          <div className="mt-5 flex flex-wrap gap-2.5">
            <button
              type="button"
              onClick={() => methodRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              className="btn-primary"
            >
              <Icon name="play" className="h-4 w-4" />
              Start cooking
            </button>
            <button
              type="button"
              onClick={() => onToggleFavorite(recipe.recipe_id)}
              className="btn-secondary"
            >
              <Icon
                name="heart"
                className={`h-4 w-4 ${isFavorite ? 'fill-paprika-500 text-paprika-500' : 'text-paprika-500'}`}
              />
              {isFavorite ? 'Saved' : 'Save recipe'}
            </button>
            {!isReady && missingIds.length > 0 && (
              <button type="button" onClick={handleAddMissing} className="btn-ghost">
                <Icon name="shoppingBag" className="h-4 w-4" />
                Add {pluralize(missingIds.length, 'missing item')}
              </button>
            )}
          </div>
        </div>
      </section>

      <div className="flex flex-wrap items-start justify-between gap-3 rounded-2xl border border-cream-200 bg-white px-4 py-3.5 shadow-soft sm:px-5">
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cream-100 text-ink-500">
            <Icon name="database" className="h-4 w-4" />
          </span>
          <p className="max-w-3xl text-[10px] leading-relaxed text-ink-500 sm:text-[11px]">
            <span className="font-bold text-ink-800">Prototype recipe view.</span> Everything on this
            page is mock state shaped like the <span className="font-mono text-[10px]">Recipes</span>{' '}
            and <span className="font-mono text-[10px]">Recipe Ingredients</span> tables. In the full
            stack, a backend query would supply the title, times, servings, instructions, and
            quantities.
          </p>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-cream-200 bg-cream-50 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.1em] text-ink-400">
          <span className="h-1.5 w-1.5 rounded-full bg-olive-400" />
          Simulated data
        </span>
      </div>

      <div className="grid items-start gap-5 lg:grid-cols-[360px_1fr] xl:gap-7">
        <section className="card p-5 lg:sticky lg:top-[94px]" aria-label="Recipe ingredients">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="eyebrow">Recipe Ingredients</p>
              <h2 className="mt-0.5 font-display text-2xl font-semibold text-ink-900">What you need</h2>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-cream-100 px-2.5 py-1 text-[10px] font-bold text-ink-600">
              <Icon name="users" className="h-3.5 w-3.5" />
              {recipe.serving}
            </span>
          </div>

          <p className="mt-1.5 text-[10px] leading-relaxed text-ink-500">
            Tap any ingredient to mark it as available in your pantry.
          </p>

          <ul className="mt-4 space-y-1">
            {rows.map((row) => {
              const ingredient = row.ingredient
              if (!ingredient) return null
              const available = selectedIds.includes(ingredient.ingredient_id)
              return (
                <li key={`${row.recipe_id}-${row.ingredient_id}`}>
                  <button
                    type="button"
                    onClick={() =>
                      available
                        ? onRemoveIngredient(ingredient.ingredient_id)
                        : onAddIngredient(ingredient)
                    }
                    aria-pressed={available}
                    className={`flex w-full items-center gap-2.5 rounded-xl px-2 py-2 text-left transition ${
                      available ? 'bg-olive-50/70' : 'hover:bg-cream-50'
                    }`}
                  >
                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition ${
                        available
                          ? 'border-olive-500 bg-olive-500 text-white'
                          : 'border-cream-300 bg-white text-transparent'
                      }`}
                    >
                      <Icon name="check" className="h-3 w-3" strokeWidth={2.8} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span
                        className={`block truncate text-[12px] font-semibold ${
                          available ? 'text-olive-800' : 'text-ink-800'
                        }`}
                      >
                        {ingredient.name}
                      </span>
                      <span className="mt-0.5 flex items-center gap-1 text-[9px] text-ink-400">
                        <span
                          className={`h-1 w-1 rounded-full ${categoryDotStyles[ingredient.category]}`}
                        />
                        {ingredient.category}
                      </span>
                    </span>
                    <span className="shrink-0 text-right">
                      <span className="text-[11px] font-bold text-ink-800">
                        {formatQuantity(row.quantity)}
                      </span>{' '}
                      <span className="text-[9px] font-medium text-ink-400">
                        {formatUnit(row.unit, row.quantity)}
                      </span>
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>

          {missingIds.length > 0 && (
            <button type="button" onClick={handleAddMissing} className="btn-secondary mt-4 w-full btn-sm">
              <Icon name="plus" className="h-3.5 w-3.5" strokeWidth={2.2} />
              Add {pluralize(missingIds.length, 'missing ingredient')} to pantry
            </button>
          )}

          {missingIds.length === 0 && selectedIds.length > 0 && (
            <div className="mt-4 flex items-center gap-2 rounded-xl border border-olive-200 bg-olive-50 px-3 py-2.5">
              <Icon name="checkCircle" className="h-4 w-4 shrink-0 text-olive-600" />
              <p className="text-[10px] font-semibold text-olive-700">
                Pantry complete — you&apos;re ready to cook.
              </p>
            </div>
          )}
        </section>

        <section ref={methodRef} className="card scroll-mt-24 p-5 sm:p-7" aria-label="Instructions">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="eyebrow">Method</p>
              <h2 className="mt-0.5 font-display text-3xl font-semibold text-ink-900">
                Let&apos;s cook
              </h2>
            </div>
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-paprika-50 text-paprika-600">
              <Icon name="utensils" className="h-5 w-5" />
            </span>
          </div>

          <div className="mt-6 space-y-5">
            {steps.map((step, index) => (
              <div key={`${recipe.recipe_id}-step-${index}`} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink-900 text-[11px] font-bold text-cream-50">
                    {index + 1}
                  </span>
                  {index < steps.length - 1 && (
                    <span className="mt-1 w-px flex-1 bg-cream-200" />
                  )}
                </div>
                <p className="pt-1 text-[13px] leading-relaxed text-ink-600">{step}</p>
              </div>
            ))}
          </div>

          <div className="mt-7 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-cream-50 px-4 py-3.5">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-paprika-500">
                <Icon name="lightbulb" className="h-4 w-4" />
              </span>
              <p className="text-[10px] leading-relaxed text-ink-500">
                <span className="font-bold text-ink-800">Cook&apos;s tip:</span> prep everything
                before you start — this recipe moves quickly once the pan is hot.
              </p>
            </div>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-ink-500">
              <Icon name="clock" className="h-3.5 w-3.5" />
              {formatTime(totalTime)} start to finish
            </span>
          </div>
        </section>
      </div>

      {similarRecipes.length > 0 && (
        <section className="pt-2">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="eyebrow">Keep cooking</p>
              <h2 className="mt-1 font-display text-3xl font-semibold text-ink-900">
                More like this
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigate({ view: 'matcher' })}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-paprika-600 transition hover:text-paprika-700"
            >
              See all recipes
              <Icon name="arrowRight" className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {similarRecipes.map((similar) => (
              <RecipeCard
                key={similar.recipe_id}
                recipe={similar}
                authorName={users.find((user) => user.user_id === similar.submitted_by_user_id)?.username}
                isFavorite={favorites.includes(similar.recipe_id)}
                onOpen={onOpenRecipe}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
