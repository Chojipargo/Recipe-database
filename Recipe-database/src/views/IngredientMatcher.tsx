import { useMemo, useRef, useState } from 'react'
import type {
  Ingredient,
  IngredientCategory,
  Recipe,
  RecipeIngredient,
  RecipeMatch,
  User,
} from '../data/mockData'
import { INGREDIENT_CATEGORIES } from '../data/mockData'
import {
  categoryDotStyles,
  categoryEmoji,
  formatTime,
  pluralize,
} from '../lib/format'
import { rankRecipeMatches } from '../lib/matching'
import type { Route } from '../lib/routes'
import { Avatar } from '../components/Avatar'
import { Icon } from '../components/Icon'
import { IngredientSearch } from '../components/IngredientSearch'

type MatchTab = 'all' | 'ready' | 'almost' | 'idea'
type SortMode = 'match' | 'time' | 'missing'

interface MatcherProps {
  recipes: Recipe[]
  ingredients: Ingredient[]
  recipeIngredients: RecipeIngredient[]
  users: User[]
  selectedIds: number[]
  favorites: number[]
  onAddIngredient: (ingredient: Ingredient) => void
  onRemoveIngredient: (ingredientId: number) => void
  onClearPantry: () => void
  onLoadDemo: () => void
  onOpenRecipe: (recipeId: number) => void
  onToggleFavorite: (recipeId: number) => void
  onNavigate: (route: Route) => void
  notify: (message: string, tone?: 'success' | 'error' | 'info', description?: string) => void
}

function MatchStatusBadge({ match }: { match: RecipeMatch }) {
  if (match.status === 'ready') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-olive-100 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-olive-700">
        <Icon name="check" className="h-3 w-3" strokeWidth={2.5} />
        Ready to cook
      </span>
    )
  }

  if (match.status === 'almost') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-butter-100 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-ink-700">
        <Icon name="shoppingBag" className="h-3 w-3 text-butter-500" />
        Almost there
      </span>
    )
  }

  if (match.status === 'idea') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-cream-100 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-ink-500">
        <Icon name="shoppingBag" className="h-3 w-3 text-ink-400" />
        Need a shop
      </span>
    )
  }

  return null
}

interface ResultCardProps {
  match: RecipeMatch
  authorName: string
  isFavorite: boolean
  hasSelection: boolean
  onOpen: (recipeId: number) => void
  onToggleFavorite: (recipeId: number) => void
}

function ResultCard({
  match,
  authorName,
  isFavorite,
  hasSelection,
  onOpen,
  onToggleFavorite,
}: ResultCardProps) {
  const [imageFailed, setImageFailed] = useState(false)
  const { recipe } = match
  const isReady = match.status === 'ready'

  return (
    <article
      className={`card group overflow-hidden transition-all duration-300 hover:shadow-lift ${
        isReady ? 'ring-1 ring-olive-200' : ''
      }`}
    >
      <div className="flex gap-3.5 p-3.5 sm:gap-4 sm:p-4">
        <button
          type="button"
          onClick={() => onOpen(recipe.recipe_id)}
          className="relative h-[92px] w-[92px] shrink-0 overflow-hidden rounded-2xl bg-cream-200 sm:h-32 sm:w-32"
          aria-label={`Open ${recipe.title}`}
        >
          {!imageFailed && recipe.image_url ? (
            <img
              src={recipe.image_url}
              alt=""
              loading="lazy"
              onError={() => setImageFailed(true)}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-cream-200 via-butter-100 to-olive-100 text-olive-500">
              <Icon name="chefHat" className="h-8 w-8" />
            </div>
          )}
          {hasSelection && (
            <span
              className={`absolute bottom-1.5 left-1.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold backdrop-blur-sm ${
                isReady ? 'bg-olive-600/95 text-white' : 'bg-white/90 text-ink-800'
              }`}
            >
              {match.matchPercent}%
            </span>
          )}
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="mb-1 flex flex-wrap items-center gap-1.5">
                <MatchStatusBadge match={match} />
                {isReady && (
                  <span className="text-[9px] font-semibold text-olive-600">
                    Everything in stock
                  </span>
                )}
              </div>
              <h3 className="truncate font-display text-[19px] font-semibold leading-tight tracking-[-0.015em] text-ink-900 sm:text-[22px]">
                <button
                  type="button"
                  onClick={() => onOpen(recipe.recipe_id)}
                  className="text-left transition hover:text-paprika-600"
                >
                  {recipe.title}
                </button>
              </h3>
              <div className="mt-1 flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-[10px] text-ink-400 sm:text-[11px]">
                <span className="inline-flex items-center gap-1">
                  <Icon name="clock" className="h-3 w-3" />
                  {formatTime(recipe.prep_time + recipe.cook_time)}
                </span>
                <span className="h-0.5 w-0.5 rounded-full bg-cream-300" />
                <span className="inline-flex items-center gap-1">
                  <Icon name="users" className="h-3 w-3" />
                  Serves {recipe.serving}
                </span>
                <span className="hidden h-0.5 w-0.5 rounded-full bg-cream-300 sm:inline-block" />
                <span className="hidden sm:inline">{authorName}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onToggleFavorite(recipe.recipe_id)}
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition ${
                isFavorite
                  ? 'bg-paprika-50 text-paprika-500'
                  : 'text-ink-300 hover:bg-cream-50 hover:text-paprika-500'
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
          </div>

          {hasSelection ? (
            <>
              <div className="mt-2.5 sm:mt-3">
                <div className="flex items-center justify-between text-[9px] font-semibold sm:text-[10px]">
                  <span className="text-ink-500">
                    {match.matchedIngredientIds.length} of {match.requiredCount} ingredients
                  </span>
                  <span className={isReady ? 'text-olive-600' : 'text-ink-500'}>
                    {match.matchPercent}% match
                  </span>
                </div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-cream-100">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isReady
                        ? 'bg-olive-500'
                        : match.matchPercent >= 60
                          ? 'bg-butter-400'
                          : 'bg-paprika-300'
                    }`}
                    style={{ width: `${match.matchPercent}%` }}
                  />
                </div>
              </div>

              {isReady ? (
                <p className="mt-2 flex items-center gap-1 text-[10px] font-semibold text-olive-700 sm:text-[11px]">
                  <Icon name="checkCircle" className="h-3.5 w-3.5" />
                  You have everything for this one.
                </p>
              ) : (
                <p className="mt-2 line-clamp-2 text-[10px] leading-relaxed text-ink-500 sm:text-[11px]">
                  <span className="font-semibold text-paprika-600">Missing:</span>{' '}
                  {match.missingIngredients
                    .slice(0, 4)
                    .map((ingredient) => ingredient.name.toLowerCase())
                    .join(', ')}
                  {match.missingIngredients.length > 4
                    ? ` +${match.missingIngredients.length - 4} more`
                    : ''}
                </p>
              )}
            </>
          ) : (
            <p className="mt-2 text-[10px] leading-relaxed text-ink-500 sm:text-[11px]">
              {pluralize(match.requiredCount, 'ingredient')} · {formatTime(recipe.prep_time)} prep ·{' '}
              {formatTime(recipe.cook_time)} cook
            </p>
          )}

          <div className="mt-2.5 flex items-center justify-between gap-2 sm:mt-3">
            <div className="flex min-w-0 items-center gap-1.5">
              <Avatar name={authorName} size="xs" className="h-5 w-5 text-[8px]" />
              <span className="truncate text-[9px] font-medium text-ink-400 sm:text-[10px]">
                {authorName}
              </span>
            </div>
            <button
              type="button"
              onClick={() => onOpen(recipe.recipe_id)}
              className="inline-flex shrink-0 items-center gap-1 text-[10px] font-bold text-paprika-600 transition hover:gap-2 hover:text-paprika-700 sm:text-[11px]"
            >
              View recipe
              <Icon name="arrowRight" className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}

export function IngredientMatcher({
  recipes,
  ingredients,
  recipeIngredients,
  users,
  selectedIds,
  favorites,
  onAddIngredient,
  onRemoveIngredient,
  onClearPantry,
  onLoadDemo,
  onOpenRecipe,
  onToggleFavorite,
  notify,
}: MatcherProps) {
  const [category, setCategory] = useState<IngredientCategory | 'All'>('All')
  const [tab, setTab] = useState<MatchTab>('all')
  const [sortMode, setSortMode] = useState<SortMode>('match')
  const resultsRef = useRef<HTMLDivElement>(null)

  const selectedIngredients = selectedIds
    .map((id) => ingredients.find((ingredient) => ingredient.ingredient_id === id))
    .filter((ingredient): ingredient is Ingredient => Boolean(ingredient))

  const matches = useMemo(
    () => rankRecipeMatches(recipes, recipeIngredients, ingredients, selectedIds),
    [recipes, recipeIngredients, ingredients, selectedIds],
  )

  const hasSelection = selectedIds.length > 0
  const readyCount = matches.filter((match) => match.status === 'ready').length
  const almostCount = matches.filter((match) => match.status === 'almost').length
  const ideaCount = matches.filter((match) => match.status === 'idea').length
  const visibleMatches = hasSelection
    ? matches.filter((match) => match.matchedIngredientIds.length > 0)
    : matches

  const tabMatches =
    tab === 'all' ? visibleMatches : visibleMatches.filter((match) => match.status === tab)

  const displayedMatches = useMemo(() => {
    const copy = [...tabMatches]
    if (sortMode === 'time') {
      copy.sort(
        (a, b) =>
          a.recipe.prep_time +
          a.recipe.cook_time -
          (b.recipe.prep_time + b.recipe.cook_time),
      )
    } else if (sortMode === 'missing') {
      copy.sort((a, b) => a.missingIngredients.length - b.missingIngredients.length)
    } else {
      copy.sort((a, b) => b.matchPercent - a.matchPercent)
    }
    return copy
  }, [tabMatches, sortMode])

  const categoriesToShow =
    category === 'All' ? INGREDIENT_CATEGORIES : ([category] as IngredientCategory[])

  function authorName(userId: number) {
    return users.find((user) => user.user_id === userId)?.username ?? 'Community cook'
  }

  function scrollToResults() {
    resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function handleFindRecipes() {
    if (!hasSelection) {
      notify('Add an ingredient first', 'info', 'Search the dictionary or tap an ingredient below.')
      return
    }
    scrollToResults()
    notify(
      `${visibleMatches.length} ${visibleMatches.length === 1 ? 'recipe' : 'recipes'} ranked`,
      'success',
      `${readyCount} ready to cook with what you have.`,
    )
  }

  function handleDemo() {
    onLoadDemo()
    setTab('all')
    setCategory('All')
    notify('Demo pantry loaded', 'success', 'Ten shakshuka ingredients are ready to match.')
    window.setTimeout(scrollToResults, 120)
  }

  function handleUnknownIngredient(query: string) {
    notify(
      `“${query}” isn't in the Ingredient dictionary`,
      'error',
      'Try a simpler term, or add it from the admin workspace.',
    )
  }

  const tabs: { id: MatchTab; label: string; count: number }[] = [
    { id: 'all', label: 'All matches', count: visibleMatches.length },
    { id: 'ready', label: 'Ready', count: readyCount },
    { id: 'almost', label: 'Almost', count: almostCount },
    { id: 'idea', label: 'Need a shop', count: ideaCount },
  ]

  return (
    <div className="space-y-7">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Ingredient matcher</p>
          <h1 className="mt-1 max-w-2xl font-display text-[38px] font-semibold leading-[1.02] tracking-[-0.03em] text-ink-900 sm:text-5xl">
            Turn your pantry into <span className="italic text-paprika-500">dinner.</span>
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-500">
            Add the ingredients you already have. We compare them against every recipe&apos;s
            Recipe Ingredients rows, rank by match score, and show exactly what&apos;s missing.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={handleDemo} className="btn-secondary btn-sm">
            <Icon name="sparkles" className="h-3.5 w-3.5 text-paprika-500" />
            Demo pantry
          </button>
          {hasSelection && (
            <button
              type="button"
              onClick={() => {
                onClearPantry()
                setTab('all')
                notify('Pantry cleared', 'info')
              }}
              className="btn-ghost btn-sm"
            >
              <Icon name="refresh" className="h-3.5 w-3.5" />
              Reset
            </button>
          )}
        </div>
      </div>

      <div className="grid items-start gap-5 lg:grid-cols-[370px_1fr] xl:gap-7">
        <section className="card p-4 sm:p-5 lg:sticky lg:top-[94px]" aria-label="Pantry selection">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="eyebrow">Step 1</p>
              <h2 className="mt-0.5 font-display text-2xl font-semibold text-ink-900">Your pantry</h2>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-paprika-50 px-2.5 py-1 text-[10px] font-bold text-paprika-600">
              <Icon name="fridge" className="h-3.5 w-3.5" />
              {selectedIds.length} selected
            </span>
          </div>
          <p className="mt-1.5 text-[11px] leading-relaxed text-ink-500">
            Search the Ingredient dictionary or browse by category.
          </p>

          <div className="mt-4">
            <IngredientSearch
              ingredients={ingredients}
              selectedIds={selectedIds}
              onSelect={onAddIngredient}
              onUnknown={handleUnknownIngredient}
              placeholder={`Search ${ingredients.length} pantry ingredients…`}
            />
          </div>

          {selectedIngredients.length > 0 ? (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {selectedIngredients.map((ingredient) => (
                <span
                  key={ingredient.ingredient_id}
                  className="inline-flex items-center gap-1.5 rounded-full border border-cream-200 bg-cream-50 py-1 pl-2 pr-1 text-[10px] font-semibold text-ink-700"
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${categoryDotStyles[ingredient.category]}`}
                  />
                  {ingredient.name}
                  <button
                    type="button"
                    onClick={() => onRemoveIngredient(ingredient.ingredient_id)}
                    className="flex h-4 w-4 items-center justify-center rounded-full text-ink-400 transition hover:bg-paprika-100 hover:text-paprika-700"
                    aria-label={`Remove ${ingredient.name}`}
                  >
                    <Icon name="x" className="h-2.5 w-2.5" strokeWidth={2.5} />
                  </button>
                </span>
              ))}
              <button
                type="button"
                onClick={() => {
                  onClearPantry()
                  setTab('all')
                }}
                className="px-1 text-[10px] font-bold text-ink-400 underline-offset-2 transition hover:text-paprika-600 hover:underline"
              >
                Clear all
              </button>
            </div>
          ) : (
            <div className="mt-3 rounded-2xl border border-dashed border-cream-300 bg-cream-50 px-4 py-4 text-center">
              <span className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-white text-ink-400">
                <Icon name="shoppingBag" className="h-4 w-4" />
              </span>
              <p className="mt-2 text-[11px] font-semibold text-ink-700">Nothing in your basket yet</p>
              <p className="mt-0.5 text-[10px] text-ink-400">
                Add a few ingredients to unlock live matches.
              </p>
            </div>
          )}

          <div className="my-4 h-px bg-cream-100" />

          <div className="flex items-center justify-between gap-2">
            <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-ink-400">
              Browse dictionary
            </p>
            <span className="text-[9px] font-medium text-ink-400">
              {ingredients.length} indexed
            </span>
          </div>

          <div className="no-scrollbar mt-2 flex gap-1.5 overflow-x-auto pb-1">
            {(['All', ...INGREDIENT_CATEGORIES] as const).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-semibold transition ${
                  category === item
                    ? 'border-ink-900 bg-ink-900 text-cream-50'
                    : 'border-cream-200 bg-white text-ink-500 hover:border-cream-300 hover:text-ink-800'
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="mt-2 max-h-[330px] space-y-3 overflow-y-auto pr-1">
            {categoriesToShow.map((categoryName) => {
              const categoryIngredients = ingredients.filter(
                (ingredient) => ingredient.category === categoryName,
              )
              return (
                <div key={categoryName}>
                  {category === 'All' && (
                    <p className="mb-1.5 flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.12em] text-ink-400">
                      <span>{categoryEmoji[categoryName]}</span>
                      {categoryName}
                      <span className="font-medium text-ink-300">{categoryIngredients.length}</span>
                    </p>
                  )}
                  <div className="grid grid-cols-2 gap-1.5">
                    {categoryIngredients.map((ingredient) => {
                      const active = selectedIds.includes(ingredient.ingredient_id)
                      return (
                        <button
                          key={ingredient.ingredient_id}
                          type="button"
                          onClick={() =>
                            active
                              ? onRemoveIngredient(ingredient.ingredient_id)
                              : onAddIngredient(ingredient)
                          }
                          aria-pressed={active}
                          className={`flex min-w-0 items-center gap-1.5 rounded-lg border px-2 py-1.5 text-left text-[10px] font-semibold transition ${
                            active
                              ? 'border-olive-300 bg-olive-50 text-olive-800'
                              : 'border-cream-200 bg-white text-ink-600 hover:border-paprika-200 hover:text-paprika-600'
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 shrink-0 rounded-full ${categoryDotStyles[ingredient.category]}`}
                          />
                          <span className="truncate">{ingredient.name}</span>
                          <Icon
                            name={active ? 'check' : 'plus'}
                            className={`ml-auto h-3 w-3 shrink-0 ${
                              active ? 'text-olive-600' : 'text-ink-300'
                            }`}
                            strokeWidth={2.2}
                          />
                        </button>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-3 flex items-start gap-2 rounded-xl border border-butter-200/70 bg-butter-50 px-3 py-2.5">
            <Icon name="lightbulb" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-butter-500" />
            <p className="text-[9px] leading-relaxed text-ink-500">
              Matches update live as you add or remove ingredients. The percentage is the share of a
              recipe&apos;s required ingredients you already have.
            </p>
          </div>

          <button type="button" onClick={handleFindRecipes} className="btn-primary mt-3 w-full">
            <Icon name="search" className="h-4 w-4" />
            Find recipes
            <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold">
              {visibleMatches.length}
            </span>
          </button>
        </section>

        <section ref={resultsRef} className="scroll-mt-24 space-y-4" aria-label="Matched recipes">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="eyebrow">{hasSelection ? 'Step 2 · Live matches' : 'Browse catalog'}</p>
                {hasSelection && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-olive-200 bg-olive-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.1em] text-olive-700">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-olive-500" />
                    Live
                  </span>
                )}
              </div>
              <h2 className="mt-1 font-display text-[30px] font-semibold leading-tight text-ink-900 sm:text-4xl">
                {hasSelection ? 'Recipes for your pantry' : 'The whole recipe catalog'}
              </h2>
              <p className="mt-1 text-xs text-ink-500">
                {hasSelection
                  ? `${selectedIds.length} ingredients selected · ${readyCount} ready to cook · ${almostCount} almost there`
                  : 'Add ingredients on the left to see match scores and missing items.'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <label htmlFor="sort-recipes" className="sr-only">
                Sort recipes
              </label>
              <div className="relative">
                <Icon
                  name="filter"
                  className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-400"
                />
                <select
                  id="sort-recipes"
                  value={sortMode}
                  onChange={(event) => setSortMode(event.target.value as SortMode)}
                  className="appearance-none rounded-full border border-cream-200 bg-white py-1.5 pl-8 pr-7 text-[10px] font-semibold text-ink-600 outline-none transition focus:border-paprika-400"
                >
                  <option value="match">Best match</option>
                  <option value="time">Quickest</option>
                  <option value="missing">Fewest missing</option>
                </select>
                <Icon
                  name="chevronDown"
                  className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-ink-400"
                />
              </div>
            </div>
          </div>

          {hasSelection && (
            <div className="no-scrollbar flex gap-1.5 overflow-x-auto pb-0.5">
              {tabs.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setTab(item.id)}
                  className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] font-bold transition ${
                    tab === item.id
                      ? 'border-ink-900 bg-ink-900 text-cream-50'
                      : 'border-cream-200 bg-white text-ink-500 hover:border-cream-300 hover:text-ink-800'
                  }`}
                >
                  {item.label}
                  <span
                    className={`rounded-full px-1.5 text-[9px] ${
                      tab === item.id ? 'bg-white/15 text-cream-50' : 'bg-cream-100 text-ink-500'
                    }`}
                  >
                    {item.count}
                  </span>
                </button>
              ))}
            </div>
          )}

          {displayedMatches.length > 0 ? (
            <div className="space-y-3">
              {displayedMatches.map((match) => (
                <ResultCard
                  key={match.recipe.recipe_id}
                  match={match}
                  authorName={authorName(match.recipe.submitted_by_user_id)}
                  isFavorite={favorites.includes(match.recipe.recipe_id)}
                  hasSelection={hasSelection}
                  onOpen={onOpenRecipe}
                  onToggleFavorite={onToggleFavorite}
                />
              ))}
            </div>
          ) : (
            <div className="card flex flex-col items-center px-6 py-12 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cream-100 text-ink-400">
                <Icon name="search" className="h-6 w-6" />
              </span>
              <h3 className="mt-4 font-display text-2xl font-semibold text-ink-900">
                {tab === 'ready' ? 'Nothing fully ready yet' : 'No matches in this view'}
              </h3>
              <p className="mt-1.5 max-w-sm text-xs leading-relaxed text-ink-500">
                {tab === 'ready'
                  ? 'Add a couple more pantry ingredients, or switch to Almost to see the recipes closest to dinner.'
                  : 'Try removing a filter, clearing a few ingredients, or loading the demo pantry to see how matching works.'}
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setTab('all')}
                  className="btn-secondary btn-sm"
                >
                  Show all matches
                </button>
                <button type="button" onClick={handleDemo} className="btn-primary btn-sm">
                  <Icon name="sparkles" className="h-3.5 w-3.5" />
                  Try demo pantry
                </button>
              </div>
            </div>
          )}

          <div className="flex items-start gap-2.5 rounded-2xl border border-dashed border-cream-300 bg-cream-100/50 px-4 py-3.5">
            <Icon name="database" className="mt-0.5 h-4 w-4 shrink-0 text-ink-400" />
            <p className="text-[10px] leading-relaxed text-ink-500">
              <span className="font-semibold text-ink-700">Simulated matching.</span> In the full
              stack, this list would be produced by a backend query joining{' '}
              <span className="font-mono text-[9px]">Recipes</span>,{' '}
              <span className="font-mono text-[9px]">Recipe Ingredients</span>, and{' '}
              <span className="font-mono text-[9px]">Ingredient</span>.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
