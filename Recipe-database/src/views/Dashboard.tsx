import { useMemo, useState } from 'react'
import type {
  Ingredient,
  Recipe,
  RecipeIngredient,
  User,
} from '../data/mockData'
import { featuredRecipeIds, recentRecipeIds } from '../data/mockData'
import { formatTime, pluralize } from '../lib/format'
import { rankRecipeMatches } from '../lib/matching'
import type { Route } from '../lib/routes'
import { IngredientSearch } from '../components/IngredientSearch'
import { RecipeCard } from '../components/RecipeCard'
import { Icon } from '../components/Icon'

interface DashboardProps {
  recipes: Recipe[]
  ingredients: Ingredient[]
  recipeIngredients: RecipeIngredient[]
  users: User[]
  currentUser: User
  selectedIds: number[]
  favorites: number[]
  onAddIngredient: (ingredient: Ingredient) => void
  onRemoveIngredient: (ingredientId: number) => void
  onClearPantry: () => void
  onLoadDemo: () => void
  onNavigate: (route: Route) => void
  onOpenRecipe: (recipeId: number) => void
  onToggleFavorite: (recipeId: number) => void
}

const quickPickIds = [23, 2, 26, 1, 3]

export function Dashboard({
  recipes,
  ingredients,
  recipeIngredients,
  users,
  currentUser,
  selectedIds,
  favorites,
  onAddIngredient,
  onRemoveIngredient,
  onClearPantry,
  onLoadDemo,
  onNavigate,
  onOpenRecipe,
  onToggleFavorite,
}: DashboardProps) {
  const [unknownIngredient, setUnknownIngredient] = useState('')
  const [heroImageFailed, setHeroImageFailed] = useState(false)

  const matches = useMemo(
    () => rankRecipeMatches(recipes, recipeIngredients, ingredients, selectedIds),
    [recipes, recipeIngredients, ingredients, selectedIds],
  )

  const readyCount = matches.filter((match) => match.status === 'ready').length
  const selectedIngredients = selectedIds
    .map((id) => ingredients.find((ingredient) => ingredient.ingredient_id === id))
    .filter((ingredient): ingredient is Ingredient => Boolean(ingredient))
  const quickPicks = quickPickIds
    .map((id) => ingredients.find((ingredient) => ingredient.ingredient_id === id))
    .filter((ingredient): ingredient is Ingredient => Boolean(ingredient))
    .filter((ingredient) => !selectedIds.includes(ingredient.ingredient_id))

  const featuredRecipes = featuredRecipeIds
    .map((id) => recipes.find((recipe) => recipe.recipe_id === id))
    .filter((recipe): recipe is Recipe => Boolean(recipe))
  const recentRecipes = recentRecipeIds
    .map((id) => recipes.find((recipe) => recipe.recipe_id === id))
    .filter((recipe): recipe is Recipe => Boolean(recipe))

  const heroRecipe = featuredRecipes[0]
  const heroMatch = matches.find((match) => match.recipe.recipe_id === heroRecipe?.recipe_id)

  const averageTime = Math.round(
    recipes.reduce((total, recipe) => total + recipe.prep_time + recipe.cook_time, 0) /
      Math.max(recipes.length, 1),
  )

  const categoryCounts = useMemo(() => {
    const counts = new Map<string, number>()
    ingredients.forEach((ingredient) => {
      counts.set(ingredient.category, (counts.get(ingredient.category) ?? 0) + 1)
    })
    return counts
  }, [ingredients])

  function authorName(userId: number) {
    return users.find((user) => user.user_id === userId)?.username ?? 'Community cook'
  }

  function handleFindRecipes() {
    onNavigate({ view: 'matcher' })
  }

  function handleDemo() {
    onLoadDemo()
    onNavigate({ view: 'matcher' })
  }

  return (
    <div className="space-y-10">
      <section className="hero-surface animate-fade-up relative overflow-hidden rounded-[2rem] border border-cream-200/80 p-5 sm:p-8 lg:p-10">
        <div className="pattern-dots pointer-events-none absolute inset-0 opacity-[0.22] [mask-image:linear-gradient(to_bottom_right,black,transparent_60%)]" />
        <div className="pointer-events-none absolute -right-16 -top-20 h-72 w-72 rounded-full border border-white/50" />
        <div className="pointer-events-none absolute -bottom-24 right-24 h-52 w-52 rounded-full border border-white/40" />

        <div className="relative grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/60 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-ink-600 shadow-sm backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-olive-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-olive-500" />
              </span>
              Smart pantry matching
            </div>

            <h1 className="mt-5 max-w-xl font-display text-[42px] font-semibold leading-[0.98] tracking-[-0.035em] text-ink-900 sm:text-5xl lg:text-[58px]">
              What&apos;s in your fridge <span className="italic text-paprika-500">tonight?</span>
            </h1>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-ink-600 sm:text-[15px]">
              Hi {currentUser.username.split(' ')[0]} — tell us what you already have. We&apos;ll
              rank healthy recipes by the ingredients you can use, so dinner starts with less waste
              and fewer substitutions.
            </p>

            <div className="mt-6 max-w-xl">
              <IngredientSearch
                ingredients={ingredients}
                selectedIds={selectedIds}
                onSelect={(ingredient) => {
                  setUnknownIngredient('')
                  onAddIngredient(ingredient)
                }}
                onUnknown={(query) => setUnknownIngredient(query)}
                placeholder="Try “chicken”, “spinach”, or “canned tomatoes”"
                variant="hero"
              />
              {unknownIngredient && (
                <p className="mt-2 flex items-start gap-1.5 text-xs font-medium text-paprika-700">
                  <Icon name="alertCircle" className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  “{unknownIngredient}” isn&apos;t in the Ingredient dictionary yet. Try a simpler
                  term or add it in the admin workspace.
                </p>
              )}

              {selectedIngredients.length > 0 ? (
                <div className="mt-3 flex flex-wrap items-center gap-1.5">
                  {selectedIngredients.map((ingredient) => (
                    <span
                      key={ingredient.ingredient_id}
                      className="inline-flex items-center gap-1.5 rounded-full border border-paprika-200 bg-white/85 py-1 pl-2.5 pr-1.5 text-[11px] font-semibold text-ink-700 shadow-sm"
                    >
                      {ingredient.name}
                      <button
                        type="button"
                        onClick={() => onRemoveIngredient(ingredient.ingredient_id)}
                        className="flex h-4 w-4 items-center justify-center rounded-full text-ink-400 transition hover:bg-paprika-100 hover:text-paprika-700"
                        aria-label={`Remove ${ingredient.name}`}
                      >
                        <Icon name="x" className="h-3 w-3" strokeWidth={2.4} />
                      </button>
                    </span>
                  ))}
                  <button
                    type="button"
                    onClick={onClearPantry}
                    className="ml-1 text-[11px] font-semibold text-ink-400 underline-offset-2 transition hover:text-paprika-600 hover:underline"
                  >
                    Clear
                  </button>
                </div>
              ) : (
                <div className="mt-3 flex flex-wrap items-center gap-1.5">
                  <span className="mr-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-ink-400">
                    Quick add
                  </span>
                  {quickPicks.map((ingredient) => (
                    <button
                      key={ingredient.ingredient_id}
                      type="button"
                      onClick={() => {
                        setUnknownIngredient('')
                        onAddIngredient(ingredient)
                      }}
                      className="inline-flex items-center gap-1 rounded-full border border-cream-300/80 bg-white/60 px-2.5 py-1 text-[11px] font-semibold text-ink-600 transition hover:border-paprika-300 hover:bg-white hover:text-paprika-600"
                    >
                      <Icon name="plus" className="h-3 w-3" strokeWidth={2.2} />
                      {ingredient.name}
                    </button>
                  ))}
                </div>
              )}

              <div className="mt-5 flex flex-wrap items-center gap-2.5">
                <button type="button" onClick={handleFindRecipes} className="btn-primary">
                  <Icon name="search" className="h-4 w-4" strokeWidth={2.1} />
                  Find recipes
                  {selectedIngredients.length > 0 && (
                    <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold">
                      {selectedIngredients.length}
                    </span>
                  )}
                </button>
                <button type="button" onClick={handleDemo} className="btn-secondary">
                  <Icon name="sparkles" className="h-4 w-4 text-paprika-500" />
                  Try a demo pantry
                </button>
              </div>
            </div>
          </div>

          {heroRecipe && (
            <div className="relative mx-auto w-full max-w-md lg:max-w-none">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem] border-[5px] border-white/60 bg-cream-200 shadow-lift">
                {!heroImageFailed && heroRecipe.image_url ? (
                  <img
                    src={heroRecipe.image_url}
                    alt={heroRecipe.title}
                    onError={() => setHeroImageFailed(true)}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-cream-200 via-butter-100 to-olive-100 text-olive-600">
                    <Icon name="chefHat" className="h-16 w-16 opacity-60" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-ink-900/65 via-ink-900/5 to-transparent" />

                <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.14em] text-ink-700 backdrop-blur-sm">
                  <Icon name="star" className="h-3 w-3 fill-butter-400 text-butter-500" />
                  Tonight&apos;s pick
                </span>

                <div className="absolute inset-x-4 bottom-4 flex items-center gap-3 rounded-2xl border border-white/50 bg-white/90 p-3 shadow-soft backdrop-blur-md">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-olive-100 text-olive-700">
                    <Icon name="utensils" className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <button
                      type="button"
                      onClick={() => onOpenRecipe(heroRecipe.recipe_id)}
                      className="block truncate text-left text-[13px] font-bold text-ink-900 transition hover:text-paprika-600"
                    >
                      {heroRecipe.title}
                    </button>
                    <p className="mt-0.5 text-[10px] font-medium text-ink-500">
                      {formatTime(heroRecipe.prep_time + heroRecipe.cook_time)} · Serves{' '}
                      {heroRecipe.serving}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onOpenRecipe(heroRecipe.recipe_id)}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink-900 text-cream-50 transition hover:bg-paprika-500"
                    aria-label={`Open ${heroRecipe.title}`}
                  >
                    <Icon name="arrowRight" className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="animate-float absolute -left-4 top-8 hidden items-center gap-2.5 rounded-2xl border border-white/70 bg-white/95 p-3 pr-4 shadow-lift backdrop-blur sm:flex">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-olive-100 text-olive-700">
                  <Icon name="checkCircle" className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-[8px] font-bold uppercase tracking-[0.14em] text-ink-400">
                    Pantry match
                  </p>
                  <p className="text-lg font-bold leading-tight text-ink-900">
                    {heroMatch && selectedIds.length > 0
                      ? `${heroMatch.matchPercent}%`
                      : `${recipes.length} recipes`}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4" aria-label="Catalog stats">
        {[
          {
            icon: 'bookOpen' as const,
            value: recipes.length,
            label: 'Recipes in catalog',
            tone: 'bg-paprika-50 text-paprika-600',
          },
          {
            icon: 'database' as const,
            value: ingredients.length,
            label: 'Ingredients indexed',
            tone: 'bg-olive-50 text-olive-600',
          },
          {
            icon: 'checkCircle' as const,
            value: readyCount,
            label: selectedIds.length > 0 ? 'Ready from your pantry' : 'Ready once you pick',
            tone: 'bg-butter-50 text-butter-500',
          },
          {
            icon: 'clock' as const,
            value: `${averageTime} min`,
            label: 'Average total time',
            tone: 'bg-cream-100 text-ink-600',
          },
        ].map((stat) => (
          <div key={stat.label} className="card flex items-center gap-3 p-4 sm:p-5">
            <span
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${stat.tone}`}
            >
              <Icon name={stat.icon} className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="font-display text-[22px] font-semibold leading-none text-ink-900">
                {stat.value}
              </p>
              <p className="mt-1 text-[9px] font-semibold uppercase leading-tight tracking-[0.06em] text-ink-400 sm:text-[10px]">
                {stat.label}
              </p>
            </div>
          </div>
        ))}
      </section>

      <section>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Chef&apos;s picks</p>
            <h2 className="mt-1 font-display text-[30px] font-semibold leading-tight text-ink-900 sm:text-4xl">
              Featured this week
            </h2>
            <p className="mt-1.5 max-w-lg text-sm text-ink-500">
              Crowd-pleasers that come together with pantry staples — matched against your
              ingredients in real time.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate({ view: 'matcher' })}
            className="group inline-flex items-center gap-1.5 text-sm font-bold text-paprika-600 transition hover:text-paprika-700"
          >
            Browse all recipes
            <Icon name="arrowRight" className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </button>
        </div>

        <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {featuredRecipes.map((recipe, index) => (
            <RecipeCard
              key={recipe.recipe_id}
              recipe={recipe}
              match={matches.find((match) => match.recipe.recipe_id === recipe.recipe_id)}
              authorName={authorName(recipe.submitted_by_user_id)}
              isFavorite={favorites.includes(recipe.recipe_id)}
              onOpen={onOpenRecipe}
              onToggleFavorite={onToggleFavorite}
              animationDelay={index * 70}
            />
          ))}
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
        <article className="relative overflow-hidden rounded-3xl bg-ink-900 p-6 text-cream-50 shadow-lift sm:p-7">
          <div className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -bottom-16 -left-10 h-40 w-40 rounded-full border border-white/10" />
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-butter-300">
            From pantry to plate
          </p>
          <h2 className="mt-2 max-w-sm font-display text-3xl font-semibold leading-[1.05] text-white">
            Three steps to a smarter dinner.
          </h2>
          <ol className="mt-6 space-y-4">
            {[
              ['Add what you have', 'Pick ingredients from the shared dictionary.'],
              ['We rank the matches', 'Recipes are scored by overlap and missing items.'],
              ['Cook with confidence', 'See quantities, units, and step-by-step instructions.'],
            ].map(([title, description], index) => (
              <li key={title} className="flex gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/10 text-[11px] font-bold text-butter-200">
                  {index + 1}
                </span>
                <div>
                  <p className="text-[13px] font-semibold text-cream-50">{title}</p>
                  <p className="mt-0.5 text-[11px] leading-relaxed text-cream-200/60">
                    {description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
          <button
            type="button"
            onClick={handleFindRecipes}
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-cream-50 px-4 py-2.5 text-xs font-bold text-ink-900 transition hover:gap-3 hover:bg-white"
          >
            Start matching
            <Icon name="arrowRight" className="h-4 w-4" />
          </button>
        </article>

        <article className="card p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="eyebrow">New in the catalog</p>
              <h2 className="mt-1 font-display text-2xl font-semibold text-ink-900">
                Fresh from the kitchen
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigate({ view: 'matcher' })}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-cream-200 text-ink-500 transition hover:border-paprika-300 hover:text-paprika-600"
              aria-label="Browse all recipes"
            >
              <Icon name="arrowUpRight" className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-3 divide-y divide-cream-100">
            {recentRecipes.map((recipe) => (
              <button
                key={recipe.recipe_id}
                type="button"
                onClick={() => onOpenRecipe(recipe.recipe_id)}
                className="group flex w-full items-center gap-3 py-3.5 text-left first:pt-1 last:pb-0"
              >
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-cream-100">
                  <img
                    src={recipe.image_url}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-bold text-ink-900 transition group-hover:text-paprika-600">
                    {recipe.title}
                  </p>
                  <p className="mt-0.5 text-[10px] text-ink-400">
                    {authorName(recipe.submitted_by_user_id)} ·{' '}
                    {formatTime(recipe.prep_time + recipe.cook_time)} · Serves {recipe.serving}
                  </p>
                </div>
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cream-50 text-ink-400 transition group-hover:bg-paprika-50 group-hover:text-paprika-600">
                  <Icon name="arrowRight" className="h-4 w-4" />
                </span>
              </button>
            ))}
          </div>

          <div className="mt-4 rounded-2xl border border-cream-200 bg-cream-50 p-3.5">
            <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.16em] text-ink-400">
              Browse the pantry
            </p>
            <div className="flex flex-wrap gap-1.5">
              {Array.from(categoryCounts.entries()).map(([category, count]) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => onNavigate({ view: 'matcher' })}
                  className="inline-flex items-center gap-1.5 rounded-full border border-cream-200 bg-white px-2.5 py-1 text-[10px] font-semibold text-ink-600 transition hover:border-paprika-200 hover:text-paprika-600"
                >
                  {category}
                  <span className="text-ink-300">{count}</span>
                </button>
              ))}
            </div>
          </div>
        </article>
      </section>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-dashed border-cream-300 bg-cream-100/60 px-5 py-4">
        <p className="flex items-center gap-2 text-[11px] text-ink-500">
          <Icon name="database" className="h-4 w-4 text-ink-400" />
          Mock state mirrors four relational tables: User, Ingredient, Recipes, and Recipe
          Ingredients.
        </p>
        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-ink-400">
          {pluralize(recipes.length, 'recipe')} · PHP/MySQL-ready prototype
        </p>
      </div>
    </div>
  )
}
