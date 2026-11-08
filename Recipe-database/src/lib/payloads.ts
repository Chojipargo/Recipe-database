import type { Ingredient, IngredientCategory } from '../data/mockData'

export interface NewRecipeIngredientInput {
  ingredient_id: number
  quantity: number
  unit: string
}

export interface NewRecipePayload {
  title: string
  prep_time: number
  cook_time: number
  serving: number
  instructions: string
  image_url: string
  ingredients: NewRecipeIngredientInput[]
}

export interface AddIngredientResult {
  ingredient: Ingredient
  created: boolean
}

export type AddIngredientToDictionary = (
  name: string,
  category: IngredientCategory,
) => AddIngredientResult
