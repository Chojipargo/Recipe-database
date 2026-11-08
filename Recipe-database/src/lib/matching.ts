import type {
  Ingredient,
  Recipe,
  RecipeIngredient,
  RecipeMatch,
} from '../data/mockData'

export interface RecipeIngredientDetail extends RecipeIngredient {
  ingredient: Ingredient | undefined
}

export function getRecipeIngredients(
  recipeId: number,
  recipeIngredients: RecipeIngredient[],
  ingredients: Ingredient[],
): RecipeIngredientDetail[] {
  return recipeIngredients
    .filter((row) => row.recipe_id === recipeId)
    .map((row) => ({
      ...row,
      ingredient: ingredients.find(
        (ingredient) => ingredient.ingredient_id === row.ingredient_id,
      ),
    }))
}

export function getRecipeMatch(
  recipe: Recipe,
  recipeIngredients: RecipeIngredient[],
  ingredients: Ingredient[],
  selectedIngredientIds: number[],
): RecipeMatch {
  const required = getRecipeIngredients(recipe.recipe_id, recipeIngredients, ingredients)
  const selected = new Set(selectedIngredientIds)
  const matchedIngredientIds = required
    .filter((row) => selected.has(row.ingredient_id))
    .map((row) => row.ingredient_id)
  const missingIngredients = required
    .filter((row) => !selected.has(row.ingredient_id))
    .map((row) => row.ingredient)
    .filter((ingredient): ingredient is Ingredient => Boolean(ingredient))

  const requiredCount = required.length
  const matchPercent =
    requiredCount === 0 ? 0 : Math.round((matchedIngredientIds.length / requiredCount) * 100)

  let status: RecipeMatch['status'] = 'none'
  if (selectedIngredientIds.length > 0) {
    if (missingIngredients.length === 0) status = 'ready'
    else if (missingIngredients.length <= 2) status = 'almost'
    else status = 'idea'
  }

  return {
    recipe,
    matchedIngredientIds,
    missingIngredients,
    requiredCount,
    matchPercent,
    status,
  }
}

export function rankRecipeMatches(
  recipes: Recipe[],
  recipeIngredients: RecipeIngredient[],
  ingredients: Ingredient[],
  selectedIngredientIds: number[],
): RecipeMatch[] {
  const matches = recipes.map((recipe) =>
    getRecipeMatch(recipe, recipeIngredients, ingredients, selectedIngredientIds),
  )

  if (selectedIngredientIds.length === 0) return matches

  return [...matches].sort((a, b) => {
    if (b.matchPercent !== a.matchPercent) return b.matchPercent - a.matchPercent
    if (a.missingIngredients.length !== b.missingIngredients.length) {
      return a.missingIngredients.length - b.missingIngredients.length
    }
    return (
      a.recipe.prep_time +
      a.recipe.cook_time -
      (b.recipe.prep_time + b.recipe.cook_time)
    )
  })
}

export function countReadyRecipes(matches: RecipeMatch[]): number {
  return matches.filter((match) => match.status === 'ready').length
}

export function countAlmostRecipes(matches: RecipeMatch[]): number {
  return matches.filter((match) => match.status === 'almost').length
}
