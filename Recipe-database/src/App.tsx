import { useCallback, useEffect, useMemo, useState } from 'react'
import type {
  Ingredient,
  IngredientCategory,
  Recipe,
  RecipeIngredient,
  User,
} from './data/mockData'
import {
  demoPantryIds,
  seedIngredients,
  seedRecipeIngredients,
  seedRecipes,
  seedUsers,
} from './data/mockData'
import type { AddIngredientResult, NewRecipePayload } from './lib/payloads'
import { countReadyRecipes, rankRecipeMatches } from './lib/matching'
import type { Route } from './lib/routes'
import { parseRoute, routeToHash } from './lib/routes'
import { Layout } from './components/Layout'
import { ToastStack } from './components/Toast'
import type { ToastItem, ToastTone } from './components/Toast'
import { Dashboard } from './views/Dashboard'
import { IngredientMatcher } from './views/IngredientMatcher'
import { RecipeDetail } from './views/RecipeDetail'
import { AdminAddRecipe } from './views/AdminAddRecipe'
import { UserProfile } from './views/UserProfile'

function App() {
  const [recipes, setRecipes] = useState<Recipe[]>(seedRecipes)
  const [recipeIngredients, setRecipeIngredients] =
    useState<RecipeIngredient[]>(seedRecipeIngredients)
  const [ingredients, setIngredients] = useState<Ingredient[]>(seedIngredients)
  const [users, setUsers] = useState<User[]>(seedUsers)
  const [currentUser, setCurrentUser] = useState<User>(seedUsers[0])
  const [favorites, setFavorites] = useState<number[]>([1, 9, 11])
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const [route, setRoute] = useState<Route>(() => parseRoute(window.location.hash))

  const notify = useCallback(
    (message: string, tone: ToastTone = 'success', description?: string) => {
      const id = Date.now() + Math.floor(Math.random() * 1000)
      setToasts((previous) => [...previous.slice(-2), { id, message, tone, description }])
    },
    [],
  )

  const dismissToast = useCallback((id: number) => {
    setToasts((previous) => previous.filter((toast) => toast.id !== id))
  }, [])

  useEffect(() => {
    if (!window.location.hash) {
      window.history.replaceState(null, '', routeToHash({ view: 'dashboard' }))
    }

    function handleHashChange() {
      setRoute(parseRoute(window.location.hash))
      window.scrollTo({ top: 0, behavior: 'auto' })
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const navigate = useCallback((next: Route) => {
    const hash = routeToHash(next)
    if (window.location.hash === hash) {
      setRoute(next)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    window.location.hash = hash
  }, [])

  const openRecipe = useCallback(
    (recipeId: number) => {
      navigate({ view: 'recipe', recipeId })
    },
    [navigate],
  )

  const matches = useMemo(
    () => rankRecipeMatches(recipes, recipeIngredients, ingredients, selectedIds),
    [recipes, recipeIngredients, ingredients, selectedIds],
  )
  const readyCount = countReadyRecipes(matches)

  const addIngredientToPantry = useCallback(
    (ingredient: Ingredient) => {
      if (selectedIds.includes(ingredient.ingredient_id)) {
        notify(
          'Already in your pantry',
          'info',
          `${ingredient.name} is already selected for matching.`,
        )
        return
      }
      setSelectedIds((previous) =>
        previous.includes(ingredient.ingredient_id)
          ? previous
          : [...previous, ingredient.ingredient_id],
      )
    },
    [selectedIds, notify],
  )

  const addIngredientsToPantry = useCallback((ingredientIds: number[]) => {
    setSelectedIds((previous) => {
      const next = new Set(previous)
      ingredientIds.forEach((id) => next.add(id))
      return Array.from(next)
    })
  }, [])

  const removeIngredientFromPantry = useCallback((ingredientId: number) => {
    setSelectedIds((previous) => previous.filter((id) => id !== ingredientId))
  }, [])

  const clearPantry = useCallback(() => {
    setSelectedIds([])
  }, [])

  const loadDemoPantry = useCallback(() => {
    setSelectedIds(demoPantryIds)
  }, [])

  const toggleFavorite = useCallback(
    (recipeId: number) => {
      const recipe = recipes.find((item) => item.recipe_id === recipeId)
      const saved = favorites.includes(recipeId)
      setFavorites((previous) =>
        saved
          ? previous.filter((id) => id !== recipeId)
          : [recipeId, ...previous],
      )
      notify(
        saved ? 'Removed from your cookbook' : 'Saved to your cookbook',
        saved ? 'info' : 'success',
        recipe?.title,
      )
    },
    [favorites, recipes, notify],
  )

  const updateUser = useCallback(
    (updates: Partial<Pick<User, 'username' | 'email' | 'password'>>) => {
      const next = { ...currentUser, ...updates }
      setCurrentUser(next)
      setUsers((previous) =>
        previous.map((user) => (user.user_id === next.user_id ? next : user)),
      )
    },
    [currentUser],
  )

  const addRecipe = useCallback(
    (payload: NewRecipePayload) => {
      const nextId =
        recipes.reduce((highest, recipe) => Math.max(highest, recipe.recipe_id), 0) + 1
      const newRecipe: Recipe = {
        recipe_id: nextId,
        title: payload.title,
        prep_time: payload.prep_time,
        cook_time: payload.cook_time,
        serving: payload.serving,
        instructions: payload.instructions,
        image_url: payload.image_url,
        submitted_by_user_id: currentUser.user_id,
      }

      setRecipes((previous) => [newRecipe, ...previous])
      setRecipeIngredients((previous) => [
        ...previous,
        ...payload.ingredients.map((row) => ({
          recipe_id: nextId,
          ingredient_id: row.ingredient_id,
          quantity: row.quantity,
          unit: row.unit,
        })),
      ])

      return nextId
    },
    [recipes, currentUser.user_id],
  )

  const addIngredientToDictionary = useCallback(
    (name: string, category: IngredientCategory): AddIngredientResult => {
      const existing = ingredients.find(
        (ingredient) => ingredient.name.toLowerCase() === name.trim().toLowerCase(),
      )
      if (existing) {
        return { ingredient: existing, created: false }
      }

      const nextId =
        ingredients.reduce(
          (highest, ingredient) => Math.max(highest, ingredient.ingredient_id),
          0,
        ) + 1
      const ingredient: Ingredient = {
        ingredient_id: nextId,
        name: name.trim(),
        category,
      }
      setIngredients((previous) => [...previous, ingredient])
      return { ingredient, created: true }
    },
    [ingredients],
  )

  return (
    <>
      <Layout
        route={route}
        onNavigate={navigate}
        user={currentUser}
        selectedCount={selectedIds.length}
        readyCount={readyCount}
      >
        {route.view === 'dashboard' && (
          <Dashboard
            recipes={recipes}
            ingredients={ingredients}
            recipeIngredients={recipeIngredients}
            users={users}
            currentUser={currentUser}
            selectedIds={selectedIds}
            favorites={favorites}
            onAddIngredient={addIngredientToPantry}
            onRemoveIngredient={removeIngredientFromPantry}
            onClearPantry={clearPantry}
            onLoadDemo={loadDemoPantry}
            onNavigate={navigate}
            onOpenRecipe={openRecipe}
            onToggleFavorite={toggleFavorite}
          />
        )}

        {route.view === 'matcher' && (
          <IngredientMatcher
            recipes={recipes}
            ingredients={ingredients}
            recipeIngredients={recipeIngredients}
            users={users}
            selectedIds={selectedIds}
            favorites={favorites}
            onAddIngredient={addIngredientToPantry}
            onRemoveIngredient={removeIngredientFromPantry}
            onClearPantry={clearPantry}
            onLoadDemo={loadDemoPantry}
            onOpenRecipe={openRecipe}
            onToggleFavorite={toggleFavorite}
            onNavigate={navigate}
            notify={notify}
          />
        )}

        {route.view === 'recipe' && (
          <RecipeDetail
            recipeId={route.recipeId ?? 0}
            recipes={recipes}
            ingredients={ingredients}
            recipeIngredients={recipeIngredients}
            users={users}
            selectedIds={selectedIds}
            favorites={favorites}
            onAddIngredient={addIngredientToPantry}
            onRemoveIngredient={removeIngredientFromPantry}
            onAddIngredients={addIngredientsToPantry}
            onOpenRecipe={openRecipe}
            onToggleFavorite={toggleFavorite}
            onNavigate={navigate}
            notify={notify}
          />
        )}

        {route.view === 'admin' && (
          <AdminAddRecipe
            ingredients={ingredients}
            currentUser={currentUser}
            onAddRecipe={addRecipe}
            onAddIngredientToDictionary={addIngredientToDictionary}
            onOpenRecipe={openRecipe}
            onNavigate={navigate}
            notify={notify}
          />
        )}

        {route.view === 'profile' && (
          <UserProfile
            currentUser={currentUser}
            users={users}
            recipes={recipes}
            recipeIngredients={recipeIngredients}
            favorites={favorites}
            selectedIds={selectedIds}
            onUpdateUser={updateUser}
            onOpenRecipe={openRecipe}
            onToggleFavorite={toggleFavorite}
            onNavigate={navigate}
            notify={notify}
          />
        )}
      </Layout>

      <ToastStack toasts={toasts} onDismiss={dismissToast} />
    </>
  )
}

export default App
