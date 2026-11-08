# Fridge & Fork · Smart Recipe Finder

A modern, responsive React single-page app for the **Smart Recipe Recommender System** ("What's in My Fridge?"). Pick the ingredients you already have and the app ranks recipes by how much of each one you can cook tonight — no backend required.

This prototype was built for a database-systems project and mirrors four relational entities in client-side mock state: **User**, **Ingredient**, **Recipes**, and **Recipe Ingredients**.

## Run locally

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually `http://localhost:5173`).

```bash
npm run build   # type-check + production build
npm run lint    # oxlint
npm run preview # serve the production build
```

## Views

The app uses hash-based routing, so every view is directly linkable.

| Route | View | Purpose |
| --- | --- | --- |
| `#/` | Dashboard / Home | Hero search, quick ingredient picks, catalog stats, featured and recent recipes, demo-pantry shortcut. |
| `#/matcher` | Ingredient Matcher | Search/browse the ingredient dictionary, build a pantry, and watch live recipe rankings update by match percentage. |
| `#/recipe/:id` | Recipe Detail | Hero image, match status, ingredient checklist with have/missing states, numbered method, save action, similar recipes. |
| `#/admin` | Admin Add Recipe | Validated recipe form with dynamic ingredient rows, live preview, ingredient-dictionary modal, and publish success banner. |
| `#/profile` | User Profile | Account edits, password change with strength feedback, submissions, saved cookbook, and schema notes. |

## Component structure

```text
src/
├─ App.tsx                     # App state, hash routing, callbacks, toasts
├─ main.tsx                    # React entry point
├─ index.css                   # Tailwind v4 theme tokens, base styles, utilities
├─ components/
│  ├─ Layout.tsx               # Sidebar, desktop topbar, mobile drawer + bottom nav
│  ├─ RecipeCard.tsx           # Recipe tile with match/missing badges and image fallback
│  ├─ IngredientSearch.tsx     # Accessible autocomplete with keyboard navigation
│  ├─ Avatar.tsx               # Initials avatar
│  ├─ Icon.tsx                 # Inline SVG icon set
│  └─ Toast.tsx                # Success / error / info notifications
├─ views/
│  ├─ Dashboard.tsx
│  ├─ IngredientMatcher.tsx
│  ├─ RecipeDetail.tsx
│  ├─ AdminAddRecipe.tsx
│  └─ UserProfile.tsx
├─ data/
│  └─ mockData.ts              # Schema types + seed users, ingredients, recipes, links
└─ lib/
   ├─ matching.ts              # Match scoring, ranking, and status thresholds
   ├─ format.ts                # Quantity, unit, time, initials, category helpers
   ├─ routes.ts                # Hash-route parsing and view metadata
   └─ payloads.ts              # Form payload types
```

## Mock data model

| Entity | Key fields | Seed size |
| --- | --- | --- |
| `User` | `user_id`, `username`, `email`, `password` | 3 users |
| `Ingredient` | `ingredient_id`, `name`, `category` | 71 ingredients |
| `Recipes` | `recipe_id`, `title`, `prep_time`, `cook_time`, `serving`, `instructions`, `image_url`, `submitted_by_user_id` | 13 recipes |
| `Recipe Ingredients` | `recipe_id`, `ingredient_id`, `quantity`, `unit` | Full join rows for every recipe |

`submitted_by_user_id` and the `Recipe Ingredients` join table are foreign keys in the relational schema; the mock state uses the same shapes so it can map directly to MySQL/PHP later.

## Matching logic

`src/lib/matching.ts` compares the selected pantry ingredient IDs against each recipe's `Recipe Ingredients` rows:

- **Ready to cook** — every required ingredient is selected.
- **Almost there** — at least 60% of required ingredients are selected.
- **A good idea** — at least 30% matched.
- **Out of reach** — below 30%.

Recipes are ranked by match percentage, then by fewest missing ingredients.

## Notes

- All state is in React memory and resets on refresh; there is no server or database connection.
- Authentication is simulated with a seeded demo account (`demo1234`).
- Images are loaded from Unsplash and TheMealDB; every card and thumbnail has a graceful fallback if an image fails.
- Styling uses Tailwind CSS v4 with custom warm cream, paprika, olive, and butter design tokens.
