export type IngredientCategory =
  | 'Produce'
  | 'Protein'
  | 'Dairy & Eggs'
  | 'Pantry'
  | 'Spices & Herbs'
  | 'Bakery'

export const INGREDIENT_CATEGORIES: IngredientCategory[] = [
  'Produce',
  'Protein',
  'Dairy & Eggs',
  'Pantry',
  'Spices & Herbs',
  'Bakery',
]

export const UNITS = [
  'g',
  'kg',
  'ml',
  'l',
  'tsp',
  'tbsp',
  'cup',
  'piece',
  'clove',
  'slice',
  'can',
  'bunch',
  'pinch',
]

export interface User {
  user_id: number
  username: string
  email: string
  password: string
}

export interface Ingredient {
  ingredient_id: number
  name: string
  category: IngredientCategory
}

export interface Recipe {
  recipe_id: number
  title: string
  prep_time: number
  cook_time: number
  serving: number
  instructions: string
  image_url: string
  submitted_by_user_id: number
}

export interface RecipeIngredient {
  recipe_id: number
  ingredient_id: number
  quantity: number
  unit: string
}

export type MatchStatus = 'ready' | 'almost' | 'idea' | 'none'

export interface RecipeMatch {
  recipe: Recipe
  matchedIngredientIds: number[]
  missingIngredients: Ingredient[]
  requiredCount: number
  matchPercent: number
  status: MatchStatus
}

/* ------------------------------------------------------------------ */
/*  Seed data — mirrors the four relational tables used by the app.    */
/* ------------------------------------------------------------------ */

export const seedUsers: User[] = [
  {
    user_id: 1,
    username: 'Maya Chen',
    email: 'maya.chen@example.com',
    password: 'demo1234',
  },
  {
    user_id: 2,
    username: 'Julian Ortiz',
    email: 'julian.ortiz@example.com',
    password: 'demo1234',
  },
  {
    user_id: 3,
    username: 'Priya Raman',
    email: 'priya.raman@example.com',
    password: 'demo1234',
  },
]

export const seedIngredients: Ingredient[] = [
  { ingredient_id: 1, name: 'Tomato', category: 'Produce' },
  { ingredient_id: 2, name: 'Spinach', category: 'Produce' },
  { ingredient_id: 3, name: 'Garlic', category: 'Produce' },
  { ingredient_id: 4, name: 'Yellow onion', category: 'Produce' },
  { ingredient_id: 5, name: 'Bell pepper', category: 'Produce' },
  { ingredient_id: 6, name: 'Mushroom', category: 'Produce' },
  { ingredient_id: 7, name: 'Carrot', category: 'Produce' },
  { ingredient_id: 8, name: 'Zucchini', category: 'Produce' },
  { ingredient_id: 9, name: 'Lemon', category: 'Produce' },
  { ingredient_id: 10, name: 'Lime', category: 'Produce' },
  { ingredient_id: 11, name: 'Avocado', category: 'Produce' },
  { ingredient_id: 12, name: 'Broccoli', category: 'Produce' },
  { ingredient_id: 13, name: 'Potato', category: 'Produce' },
  { ingredient_id: 14, name: 'Sweet potato', category: 'Produce' },
  { ingredient_id: 15, name: 'Cucumber', category: 'Produce' },
  { ingredient_id: 16, name: 'Basil', category: 'Produce' },
  { ingredient_id: 17, name: 'Parsley', category: 'Produce' },
  { ingredient_id: 18, name: 'Cilantro', category: 'Produce' },
  { ingredient_id: 19, name: 'Ginger', category: 'Produce' },
  { ingredient_id: 20, name: 'Red chili', category: 'Produce' },
  { ingredient_id: 21, name: 'Banana', category: 'Produce' },
  { ingredient_id: 22, name: 'Peas', category: 'Produce' },
  { ingredient_id: 23, name: 'Chicken breast', category: 'Protein' },
  { ingredient_id: 24, name: 'Ground beef', category: 'Protein' },
  { ingredient_id: 25, name: 'Salmon fillet', category: 'Protein' },
  { ingredient_id: 26, name: 'Eggs', category: 'Protein' },
  { ingredient_id: 27, name: 'Firm tofu', category: 'Protein' },
  { ingredient_id: 28, name: 'Chickpeas', category: 'Protein' },
  { ingredient_id: 29, name: 'Black beans', category: 'Protein' },
  { ingredient_id: 30, name: 'Bacon', category: 'Protein' },
  { ingredient_id: 31, name: 'Shrimp', category: 'Protein' },
  { ingredient_id: 32, name: 'Milk', category: 'Dairy & Eggs' },
  { ingredient_id: 33, name: 'Butter', category: 'Dairy & Eggs' },
  { ingredient_id: 34, name: 'Parmesan', category: 'Dairy & Eggs' },
  { ingredient_id: 35, name: 'Cheddar', category: 'Dairy & Eggs' },
  { ingredient_id: 36, name: 'Mozzarella', category: 'Dairy & Eggs' },
  { ingredient_id: 37, name: 'Greek yogurt', category: 'Dairy & Eggs' },
  { ingredient_id: 38, name: 'Heavy cream', category: 'Dairy & Eggs' },
  { ingredient_id: 39, name: 'Buttermilk', category: 'Dairy & Eggs' },
  { ingredient_id: 40, name: 'Olive oil', category: 'Pantry' },
  { ingredient_id: 41, name: 'Pasta', category: 'Pantry' },
  { ingredient_id: 42, name: 'Rice', category: 'Pantry' },
  { ingredient_id: 43, name: 'Quinoa', category: 'Pantry' },
  { ingredient_id: 44, name: 'All-purpose flour', category: 'Pantry' },
  { ingredient_id: 45, name: 'Canned tomatoes', category: 'Pantry' },
  { ingredient_id: 46, name: 'Coconut milk', category: 'Pantry' },
  { ingredient_id: 47, name: 'Soy sauce', category: 'Pantry' },
  { ingredient_id: 48, name: 'Honey', category: 'Pantry' },
  { ingredient_id: 49, name: 'Sugar', category: 'Pantry' },
  { ingredient_id: 50, name: 'Breadcrumbs', category: 'Pantry' },
  { ingredient_id: 51, name: 'Tortillas', category: 'Pantry' },
  { ingredient_id: 52, name: 'Vegetable stock', category: 'Pantry' },
  { ingredient_id: 53, name: 'Rolled oats', category: 'Pantry' },
  { ingredient_id: 54, name: 'Red lentils', category: 'Pantry' },
  { ingredient_id: 55, name: 'Sesame oil', category: 'Pantry' },
  { ingredient_id: 56, name: 'Sourdough bread', category: 'Bakery' },
  { ingredient_id: 57, name: 'Pita bread', category: 'Bakery' },
  { ingredient_id: 58, name: 'Salt', category: 'Spices & Herbs' },
  { ingredient_id: 59, name: 'Black pepper', category: 'Spices & Herbs' },
  { ingredient_id: 60, name: 'Cumin', category: 'Spices & Herbs' },
  { ingredient_id: 61, name: 'Smoked paprika', category: 'Spices & Herbs' },
  { ingredient_id: 62, name: 'Oregano', category: 'Spices & Herbs' },
  { ingredient_id: 63, name: 'Chili flakes', category: 'Spices & Herbs' },
  { ingredient_id: 64, name: 'Cinnamon', category: 'Spices & Herbs' },
  { ingredient_id: 65, name: 'Turmeric', category: 'Spices & Herbs' },
  { ingredient_id: 66, name: 'Curry powder', category: 'Spices & Herbs' },
  { ingredient_id: 67, name: 'Bay leaf', category: 'Spices & Herbs' },
  { ingredient_id: 68, name: 'Nutmeg', category: 'Spices & Herbs' },
  { ingredient_id: 69, name: 'Baking powder', category: 'Pantry' },
  { ingredient_id: 70, name: 'Beef strips', category: 'Protein' },
  { ingredient_id: 71, name: 'Maple syrup', category: 'Pantry' },
]

export const seedRecipes: Recipe[] = [
  {
    recipe_id: 1,
    title: 'Creamy Tuscan Chicken',
    prep_time: 10,
    cook_time: 25,
    serving: 4,
    image_url:
      'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=1200&q=80',
    submitted_by_user_id: 1,
    instructions: `Pat the chicken dry and season both sides generously with salt and black pepper.
Warm the olive oil in a large skillet over medium-high heat. Sear the chicken for 5–6 minutes per side until golden, then transfer to a plate.
Lower the heat and melt the butter. Add the minced garlic and cook for 30 seconds until fragrant, without browning.
Pour in the heavy cream and whisk in the grated parmesan. Simmer for 3–4 minutes until the sauce thickens slightly.
Stir in the spinach and cook until wilted, about 2 minutes. Return the chicken to the pan, spoon the sauce over the top, and simmer for 5 minutes.
Rest for a few minutes, then serve straight from the skillet with crusty bread or pasta.`,
  },
  {
    recipe_id: 2,
    title: 'Smoky Chickpea & Spinach Stew',
    prep_time: 10,
    cook_time: 30,
    serving: 4,
    image_url:
      'https://www.themealdb.com/images/media/meals/xvnx8j1763287209.jpg',
    submitted_by_user_id: 3,
    instructions: `Dice the onion and mince the garlic. Drain and rinse the chickpeas.
Heat the olive oil in a deep pot over medium heat. Soften the onion for 5 minutes, then add the garlic, cumin, and smoked paprika and stir for 1 minute.
Add the canned tomatoes and chickpeas. Simmer gently for 15 minutes so the flavours marry.
Stir in the coconut milk and cook for another 8 minutes until the stew is creamy.
Fold through the spinach in handfuls and cook until just wilted. Season with salt to taste.
Ladle into bowls and finish with a swirl of olive oil and warm flatbread.`,
  },
  {
    recipe_id: 3,
    title: 'Lemon Garlic Salmon',
    prep_time: 10,
    cook_time: 18,
    serving: 2,
    image_url:
      'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=1200&q=80',
    submitted_by_user_id: 3,
    instructions: `Pat the salmon fillets dry and season with salt and pepper. Zest the lemon, then cut it into wedges.
Heat the olive oil in a non-stick pan over medium-high heat. Place the salmon skin-side down and cook for 4 minutes until crisp.
Flip the salmon, add the butter, minced garlic, and lemon zest to the pan, and baste the fish with the foaming butter for 3–4 minutes.
Squeeze over a little lemon juice and scatter with chopped parsley.
Serve immediately with roasted vegetables, rice, or a crisp green salad.`,
  },
  {
    recipe_id: 4,
    title: 'Roasted Tomato & Basil Pasta',
    prep_time: 10,
    cook_time: 30,
    serving: 4,
    image_url:
      'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=1200&q=80',
    submitted_by_user_id: 1,
    instructions: `Heat the oven to 220°C. Halve the tomatoes, toss with olive oil, salt, and chili flakes, and roast for 20 minutes until jammy.
Meanwhile, cook the pasta in well-salted water until al dente. Reserve a mug of pasta water before draining.
Warm a little olive oil in a pan and gently cook the sliced garlic until golden. Add the canned tomatoes and simmer for 8 minutes.
Tip in the roasted tomatoes and torn basil, then add the drained pasta with a splash of pasta water. Toss until glossy.
Finish with grated parmesan, cracked black pepper, and a final drizzle of olive oil.`,
  },
  {
    recipe_id: 5,
    title: 'Golden Banana Oat Pancakes',
    prep_time: 10,
    cook_time: 15,
    serving: 3,
    image_url:
      'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=1200&q=80',
    submitted_by_user_id: 3,
    instructions: `Blitz the rolled oats into a rough flour, then mash the bananas in a large bowl.
Whisk in the eggs, milk, cinnamon, and baking powder until smooth, then fold in the oat flour. Let the batter rest for 5 minutes.
Warm a little butter in a non-stick pan over medium heat. Spoon in small rounds of batter and cook for 2 minutes until bubbles form.
Flip and cook for another 1–2 minutes until golden and cooked through. Repeat with the remaining batter.
Stack the pancakes and drizzle with honey. Add sliced banana or berries if you have them.`,
  },
  {
    recipe_id: 6,
    title: 'Weeknight Chicken Fried Rice',
    prep_time: 15,
    cook_time: 15,
    serving: 3,
    image_url:
      'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=1200&q=80',
    submitted_by_user_id: 2,
    instructions: `Cook the rice if you don't have leftovers, then spread it on a tray to cool. Day-old rice works best.
Dice the chicken, carrot, and garlic. Whisk the eggs with a pinch of salt.
Heat the olive oil in a wok over high heat. Scramble the eggs quickly, then push them to one side and add the chicken. Stir-fry until cooked through.
Add the carrot, peas, garlic, and ginger and cook for 3 minutes, keeping everything moving.
Tip in the rice, soy sauce, and sesame oil. Toss over high heat until the rice is hot and coated.
Taste, adjust the seasoning, and serve with extra soy sauce and sliced spring onion if you have it.`,
  },
  {
    recipe_id: 7,
    title: 'Creamy Mushroom Risotto',
    prep_time: 10,
    cook_time: 35,
    serving: 4,
    image_url:
      'https://images.unsplash.com/photo-1476124369491-e7addf5db371?auto=format&fit=crop&w=1200&q=80',
    submitted_by_user_id: 1,
    instructions: `Warm the vegetable stock in a saucepan and keep it at a gentle simmer.
Slice the mushrooms and cook them in half the olive oil over high heat until deeply golden. Set aside.
In the same pan, soften the diced onion in the remaining oil for 5 minutes. Add the garlic and rice and toast for 1 minute.
Add the stock one ladle at a time, stirring often and waiting for each addition to be absorbed before adding the next.
After about 20 minutes, when the rice is creamy and al dente, stir in the mushrooms, butter, and parmesan.
Season with salt and pepper, cover for 2 minutes, then serve with extra parmesan.`,
  },
  {
    recipe_id: 8,
    title: 'Beef & Broccoli Stir-Fry',
    prep_time: 15,
    cook_time: 15,
    serving: 4,
    image_url:
      'https://www.themealdb.com/images/media/meals/m0p0j81765568742.jpg',
    submitted_by_user_id: 2,
    instructions: `Cook the rice according to the packet instructions and keep warm.
Slice the beef into thin strips and toss with half the soy sauce. Cut the broccoli into small florets.
Whisk the remaining soy sauce with honey and sesame oil to make the sauce.
Heat a wok over high heat with a little oil. Sear the beef in batches for 1–2 minutes until browned, then set aside.
Stir-fry the broccoli for 3 minutes, adding a splash of water to steam it. Add the garlic and ginger and cook for 30 seconds.
Return the beef, pour in the sauce, and toss until everything is glossy. Serve over rice.`,
  },
  {
    recipe_id: 9,
    title: 'Rainbow Buddha Bowl',
    prep_time: 20,
    cook_time: 25,
    serving: 2,
    image_url:
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80',
    submitted_by_user_id: 3,
    instructions: `Heat the oven to 200°C. Cube the sweet potato, toss with olive oil, salt, and pepper, and roast for 25 minutes.
Rinse the quinoa and simmer in double its volume of salted water for 15 minutes. Fluff with a fork.
Drain and rinse the chickpeas. Pat dry and add them to the tray with the sweet potato for the last 10 minutes.
Slice the avocado, cucumber, and lemon. Wash the spinach.
Whisk the lemon juice with olive oil, salt, and pepper to make a bright dressing.
Build bowls with quinoa, spinach, roasted vegetables, chickpeas, avocado, and cucumber. Drizzle with dressing.`,
  },
  {
    recipe_id: 10,
    title: 'Skillet Shakshuka',
    prep_time: 10,
    cook_time: 25,
    serving: 4,
    image_url:
      'https://www.themealdb.com/images/media/meals/g373701551450225.jpg',
    submitted_by_user_id: 1,
    instructions: `Dice the onion and bell pepper. Mince the garlic and roughly chop the cilantro.
Heat the olive oil in a wide skillet over medium heat. Cook the onion and pepper for 7 minutes until soft.
Add the garlic, cumin, and smoked paprika and stir for 1 minute until fragrant.
Pour in the canned tomatoes, season with salt, and simmer for 10 minutes until thickened.
Make small wells in the sauce and crack in the eggs. Cover and cook for 5–7 minutes until the whites are set but the yolks are still soft.
Scatter with cilantro and serve straight from the skillet with warm pita or sourdough.`,
  },
  {
    recipe_id: 11,
    title: 'Caprese Avocado Toast',
    prep_time: 5,
    cook_time: 5,
    serving: 2,
    image_url:
      'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?auto=format&fit=crop&w=1200&q=80',
    submitted_by_user_id: 2,
    instructions: `Toast the sourdough slices until crisp and golden.
Halve, stone, and slice the avocado. Mash half of it with a pinch of salt and a squeeze of lemon.
Spread the mashed avocado over the toast. Layer with sliced tomato and torn mozzarella.
Scatter with basil leaves and season with salt and black pepper.
Finish with a drizzle of olive oil and serve while the toast is still warm.`,
  },
  {
    recipe_id: 12,
    title: 'Coconut Red Lentil Curry',
    prep_time: 10,
    cook_time: 25,
    serving: 4,
    image_url:
      'https://www.themealdb.com/images/media/meals/vpxyqt1511464175.jpg',
    submitted_by_user_id: 3,
    instructions: `Dice the onion and mince the garlic and ginger. Rinse the red lentils until the water runs clear.
Heat the olive oil in a pot and soften the onion for 5 minutes.
Add the garlic, ginger, curry powder, turmeric, and a pinch of salt. Stir for 1 minute until fragrant.
Add the lentils, canned tomatoes, and coconut milk. Bring to a gentle simmer.
Cook for 20 minutes, stirring occasionally, until the lentils are soft and the curry is thick. Add a splash of water if it gets too dry.
Fold in the spinach and cook until wilted. Taste, adjust the seasoning, and serve with rice or warm flatbread.`,
  },
  {
    recipe_id: 13,
    title: 'Garlic Butter Shrimp Pasta',
    prep_time: 10,
    cook_time: 20,
    serving: 3,
    image_url:
      'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=1200&q=80',
    submitted_by_user_id: 1,
    instructions: `Cook the pasta in well-salted water until al dente. Reserve a mug of pasta water and drain.
Pat the shrimp dry and season with salt. Heat the olive oil in a large pan over medium-high heat.
Sear the shrimp for 1–2 minutes per side until pink, then transfer to a plate.
Lower the heat, melt the butter, and cook the minced garlic and chili flakes for 30 seconds.
Add the pasta, shrimp, lemon zest, and a splash of pasta water. Toss until the sauce coats the pasta.
Finish with chopped parsley, a squeeze of lemon, and extra parmesan if you like.`,
  },
]

export const seedRecipeIngredients: RecipeIngredient[] = [
  // 1 — Creamy Tuscan Chicken
  { recipe_id: 1, ingredient_id: 23, quantity: 600, unit: 'g' },
  { recipe_id: 1, ingredient_id: 2, quantity: 120, unit: 'g' },
  { recipe_id: 1, ingredient_id: 3, quantity: 4, unit: 'clove' },
  { recipe_id: 1, ingredient_id: 33, quantity: 30, unit: 'g' },
  { recipe_id: 1, ingredient_id: 34, quantity: 60, unit: 'g' },
  { recipe_id: 1, ingredient_id: 38, quantity: 240, unit: 'ml' },
  { recipe_id: 1, ingredient_id: 40, quantity: 15, unit: 'ml' },
  { recipe_id: 1, ingredient_id: 58, quantity: 1, unit: 'tsp' },
  { recipe_id: 1, ingredient_id: 59, quantity: 0.5, unit: 'tsp' },
  // 2 — Smoky Chickpea & Spinach Stew
  { recipe_id: 2, ingredient_id: 28, quantity: 400, unit: 'g' },
  { recipe_id: 2, ingredient_id: 45, quantity: 400, unit: 'g' },
  { recipe_id: 2, ingredient_id: 46, quantity: 200, unit: 'ml' },
  { recipe_id: 2, ingredient_id: 2, quantity: 100, unit: 'g' },
  { recipe_id: 2, ingredient_id: 4, quantity: 1, unit: 'piece' },
  { recipe_id: 2, ingredient_id: 3, quantity: 3, unit: 'clove' },
  { recipe_id: 2, ingredient_id: 60, quantity: 1, unit: 'tsp' },
  { recipe_id: 2, ingredient_id: 61, quantity: 1, unit: 'tsp' },
  { recipe_id: 2, ingredient_id: 40, quantity: 15, unit: 'ml' },
  { recipe_id: 2, ingredient_id: 58, quantity: 1, unit: 'tsp' },
  // 3 — Lemon Garlic Salmon
  { recipe_id: 3, ingredient_id: 25, quantity: 400, unit: 'g' },
  { recipe_id: 3, ingredient_id: 9, quantity: 1, unit: 'piece' },
  { recipe_id: 3, ingredient_id: 3, quantity: 2, unit: 'clove' },
  { recipe_id: 3, ingredient_id: 33, quantity: 20, unit: 'g' },
  { recipe_id: 3, ingredient_id: 17, quantity: 15, unit: 'g' },
  { recipe_id: 3, ingredient_id: 40, quantity: 10, unit: 'ml' },
  { recipe_id: 3, ingredient_id: 58, quantity: 0.5, unit: 'tsp' },
  { recipe_id: 3, ingredient_id: 59, quantity: 0.25, unit: 'tsp' },
  // 4 — Roasted Tomato & Basil Pasta
  { recipe_id: 4, ingredient_id: 41, quantity: 320, unit: 'g' },
  { recipe_id: 4, ingredient_id: 45, quantity: 400, unit: 'g' },
  { recipe_id: 4, ingredient_id: 1, quantity: 300, unit: 'g' },
  { recipe_id: 4, ingredient_id: 3, quantity: 3, unit: 'clove' },
  { recipe_id: 4, ingredient_id: 16, quantity: 20, unit: 'g' },
  { recipe_id: 4, ingredient_id: 40, quantity: 30, unit: 'ml' },
  { recipe_id: 4, ingredient_id: 34, quantity: 40, unit: 'g' },
  { recipe_id: 4, ingredient_id: 58, quantity: 1, unit: 'tsp' },
  { recipe_id: 4, ingredient_id: 63, quantity: 0.25, unit: 'tsp' },
  // 5 — Golden Banana Oat Pancakes
  { recipe_id: 5, ingredient_id: 21, quantity: 2, unit: 'piece' },
  { recipe_id: 5, ingredient_id: 53, quantity: 150, unit: 'g' },
  { recipe_id: 5, ingredient_id: 26, quantity: 2, unit: 'piece' },
  { recipe_id: 5, ingredient_id: 32, quantity: 120, unit: 'ml' },
  { recipe_id: 5, ingredient_id: 64, quantity: 0.5, unit: 'tsp' },
  { recipe_id: 5, ingredient_id: 69, quantity: 1, unit: 'tsp' },
  { recipe_id: 5, ingredient_id: 33, quantity: 15, unit: 'g' },
  { recipe_id: 5, ingredient_id: 48, quantity: 30, unit: 'ml' },
  // 6 — Weeknight Chicken Fried Rice
  { recipe_id: 6, ingredient_id: 42, quantity: 300, unit: 'g' },
  { recipe_id: 6, ingredient_id: 23, quantity: 300, unit: 'g' },
  { recipe_id: 6, ingredient_id: 26, quantity: 2, unit: 'piece' },
  { recipe_id: 6, ingredient_id: 7, quantity: 1, unit: 'piece' },
  { recipe_id: 6, ingredient_id: 22, quantity: 100, unit: 'g' },
  { recipe_id: 6, ingredient_id: 47, quantity: 30, unit: 'ml' },
  { recipe_id: 6, ingredient_id: 3, quantity: 2, unit: 'clove' },
  { recipe_id: 6, ingredient_id: 19, quantity: 1, unit: 'tsp' },
  { recipe_id: 6, ingredient_id: 55, quantity: 10, unit: 'ml' },
  { recipe_id: 6, ingredient_id: 40, quantity: 15, unit: 'ml' },
  // 7 — Creamy Mushroom Risotto
  { recipe_id: 7, ingredient_id: 42, quantity: 320, unit: 'g' },
  { recipe_id: 7, ingredient_id: 6, quantity: 300, unit: 'g' },
  { recipe_id: 7, ingredient_id: 4, quantity: 1, unit: 'piece' },
  { recipe_id: 7, ingredient_id: 3, quantity: 2, unit: 'clove' },
  { recipe_id: 7, ingredient_id: 34, quantity: 60, unit: 'g' },
  { recipe_id: 7, ingredient_id: 33, quantity: 40, unit: 'g' },
  { recipe_id: 7, ingredient_id: 52, quantity: 900, unit: 'ml' },
  { recipe_id: 7, ingredient_id: 40, quantity: 15, unit: 'ml' },
  { recipe_id: 7, ingredient_id: 58, quantity: 1, unit: 'tsp' },
  { recipe_id: 7, ingredient_id: 59, quantity: 0.5, unit: 'tsp' },
  // 8 — Beef & Broccoli Stir-Fry
  { recipe_id: 8, ingredient_id: 70, quantity: 500, unit: 'g' },
  { recipe_id: 8, ingredient_id: 12, quantity: 300, unit: 'g' },
  { recipe_id: 8, ingredient_id: 47, quantity: 40, unit: 'ml' },
  { recipe_id: 8, ingredient_id: 3, quantity: 2, unit: 'clove' },
  { recipe_id: 8, ingredient_id: 19, quantity: 1, unit: 'tsp' },
  { recipe_id: 8, ingredient_id: 48, quantity: 15, unit: 'ml' },
  { recipe_id: 8, ingredient_id: 42, quantity: 300, unit: 'g' },
  { recipe_id: 8, ingredient_id: 55, quantity: 10, unit: 'ml' },
  // 9 — Rainbow Buddha Bowl
  { recipe_id: 9, ingredient_id: 43, quantity: 150, unit: 'g' },
  { recipe_id: 9, ingredient_id: 14, quantity: 1, unit: 'piece' },
  { recipe_id: 9, ingredient_id: 28, quantity: 200, unit: 'g' },
  { recipe_id: 9, ingredient_id: 11, quantity: 1, unit: 'piece' },
  { recipe_id: 9, ingredient_id: 2, quantity: 60, unit: 'g' },
  { recipe_id: 9, ingredient_id: 15, quantity: 1, unit: 'piece' },
  { recipe_id: 9, ingredient_id: 9, quantity: 1, unit: 'piece' },
  { recipe_id: 9, ingredient_id: 40, quantity: 20, unit: 'ml' },
  { recipe_id: 9, ingredient_id: 58, quantity: 0.5, unit: 'tsp' },
  { recipe_id: 9, ingredient_id: 59, quantity: 0.25, unit: 'tsp' },
  // 10 — Skillet Shakshuka
  { recipe_id: 10, ingredient_id: 26, quantity: 6, unit: 'piece' },
  { recipe_id: 10, ingredient_id: 45, quantity: 800, unit: 'g' },
  { recipe_id: 10, ingredient_id: 5, quantity: 1, unit: 'piece' },
  { recipe_id: 10, ingredient_id: 4, quantity: 1, unit: 'piece' },
  { recipe_id: 10, ingredient_id: 3, quantity: 3, unit: 'clove' },
  { recipe_id: 10, ingredient_id: 60, quantity: 1, unit: 'tsp' },
  { recipe_id: 10, ingredient_id: 61, quantity: 1, unit: 'tsp' },
  { recipe_id: 10, ingredient_id: 18, quantity: 15, unit: 'g' },
  { recipe_id: 10, ingredient_id: 40, quantity: 20, unit: 'ml' },
  { recipe_id: 10, ingredient_id: 58, quantity: 1, unit: 'tsp' },
  // 11 — Caprese Avocado Toast
  { recipe_id: 11, ingredient_id: 56, quantity: 4, unit: 'slice' },
  { recipe_id: 11, ingredient_id: 11, quantity: 1, unit: 'piece' },
  { recipe_id: 11, ingredient_id: 1, quantity: 2, unit: 'piece' },
  { recipe_id: 11, ingredient_id: 36, quantity: 125, unit: 'g' },
  { recipe_id: 11, ingredient_id: 16, quantity: 10, unit: 'g' },
  { recipe_id: 11, ingredient_id: 40, quantity: 10, unit: 'ml' },
  { recipe_id: 11, ingredient_id: 58, quantity: 0.25, unit: 'tsp' },
  { recipe_id: 11, ingredient_id: 59, quantity: 0.25, unit: 'tsp' },
  // 12 — Coconut Red Lentil Curry
  { recipe_id: 12, ingredient_id: 54, quantity: 200, unit: 'g' },
  { recipe_id: 12, ingredient_id: 46, quantity: 400, unit: 'ml' },
  { recipe_id: 12, ingredient_id: 45, quantity: 200, unit: 'g' },
  { recipe_id: 12, ingredient_id: 4, quantity: 1, unit: 'piece' },
  { recipe_id: 12, ingredient_id: 3, quantity: 3, unit: 'clove' },
  { recipe_id: 12, ingredient_id: 19, quantity: 1, unit: 'tbsp' },
  { recipe_id: 12, ingredient_id: 66, quantity: 2, unit: 'tsp' },
  { recipe_id: 12, ingredient_id: 65, quantity: 0.5, unit: 'tsp' },
  { recipe_id: 12, ingredient_id: 2, quantity: 80, unit: 'g' },
  { recipe_id: 12, ingredient_id: 40, quantity: 15, unit: 'ml' },
  { recipe_id: 12, ingredient_id: 58, quantity: 1, unit: 'tsp' },
  // 13 — Garlic Butter Shrimp Pasta
  { recipe_id: 13, ingredient_id: 31, quantity: 400, unit: 'g' },
  { recipe_id: 13, ingredient_id: 41, quantity: 300, unit: 'g' },
  { recipe_id: 13, ingredient_id: 3, quantity: 4, unit: 'clove' },
  { recipe_id: 13, ingredient_id: 33, quantity: 40, unit: 'g' },
  { recipe_id: 13, ingredient_id: 9, quantity: 1, unit: 'piece' },
  { recipe_id: 13, ingredient_id: 17, quantity: 15, unit: 'g' },
  { recipe_id: 13, ingredient_id: 63, quantity: 0.25, unit: 'tsp' },
  { recipe_id: 13, ingredient_id: 40, quantity: 15, unit: 'ml' },
  { recipe_id: 13, ingredient_id: 58, quantity: 0.5, unit: 'tsp' },
]

export const featuredRecipeIds = [1, 10, 9]
export const recentRecipeIds = [13, 12, 11]

export const demoPantryIds = [26, 45, 5, 4, 3, 60, 61, 18, 40, 58]
