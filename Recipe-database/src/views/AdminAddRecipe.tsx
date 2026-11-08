import { useMemo, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import type {
  Ingredient,
  IngredientCategory,
  User,
} from '../data/mockData'
import { INGREDIENT_CATEGORIES, UNITS } from '../data/mockData'
import {
  categoryEmoji,
  formatQuantity,
  formatTime,
  pluralize,
} from '../lib/format'
import type {
  AddIngredientToDictionary,
  NewRecipePayload,
} from '../lib/payloads'
import type { Route } from '../lib/routes'
import { Avatar } from '../components/Avatar'
import { Icon } from '../components/Icon'
import { Modal } from '../components/Modal'

interface FormState {
  title: string
  prep_time: string
  cook_time: string
  serving: string
  image_url: string
  instructions: string
}

interface IngredientRow {
  key: string
  ingredient_id: string
  quantity: string
  unit: string
}

interface RowErrors {
  ingredient?: string
  quantity?: string
  unit?: string
}

interface AdminAddRecipeProps {
  ingredients: Ingredient[]
  currentUser: User
  onAddRecipe: (payload: NewRecipePayload) => number
  onAddIngredientToDictionary: AddIngredientToDictionary
  onOpenRecipe: (recipeId: number) => void
  onNavigate: (route: Route) => void
  notify: (message: string, tone?: 'success' | 'error' | 'info', description?: string) => void
}

const initialForm: FormState = {
  title: '',
  prep_time: '',
  cook_time: '',
  serving: '4',
  image_url: '',
  instructions: '',
}

function makeRow(overrides: Partial<IngredientRow> = {}): IngredientRow {
  return {
    key: `row-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    ingredient_id: '',
    quantity: '',
    unit: 'g',
    ...overrides,
  }
}

function PreviewImage({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false)

  if (!src || failed) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-cream-200 via-butter-100 to-olive-100 text-olive-600">
        <Icon name="image" className="h-9 w-9 opacity-60" />
        <p className="text-[9px] font-bold uppercase tracking-[0.14em] opacity-60">
          Image preview
        </p>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setFailed(true)}
      className="h-full w-full object-cover"
    />
  )
}

export function AdminAddRecipe({
  ingredients,
  currentUser,
  onAddRecipe,
  onAddIngredientToDictionary,
  onOpenRecipe,
  onNavigate,
  notify,
}: AdminAddRecipeProps) {
  const [form, setForm] = useState<FormState>(initialForm)
  const [rows, setRows] = useState<IngredientRow[]>([makeRow()])
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [rowErrors, setRowErrors] = useState<Record<string, RowErrors>>({})
  const [success, setSuccess] = useState<{ id: number; title: string; count: number } | null>(null)
  const [ingredientModalOpen, setIngredientModalOpen] = useState(false)
  const [newIngredientName, setNewIngredientName] = useState('')
  const [newIngredientCategory, setNewIngredientCategory] =
    useState<IngredientCategory>('Produce')
  const [newIngredientError, setNewIngredientError] = useState('')
  const errorRef = useRef<HTMLDivElement>(null)

  const errorCount =
    Object.keys(errors).length +
    Object.values(rowErrors).reduce((total, row) => total + Object.keys(row).length, 0)

  const selectedRows = useMemo(
    () =>
      rows
        .map((row) => ({
          ...row,
          ingredient: ingredients.find(
            (ingredient) => String(ingredient.ingredient_id) === row.ingredient_id,
          ),
        }))
        .filter((row) => row.ingredient && Number(row.quantity) > 0),
    [rows, ingredients],
  )

  function updateField(field: keyof FormState, value: string) {
    setForm((previous) => ({ ...previous, [field]: value }))
    setErrors((previous) => {
      if (!previous[field]) return previous
      const next = { ...previous }
      delete next[field]
      return next
    })
  }

  function updateRow(
    key: string,
    field: 'ingredient_id' | 'quantity' | 'unit',
    value: string,
  ) {
    setRows((previous) =>
      previous.map((row) => (row.key === key ? { ...row, [field]: value } : row)),
    )
    setRowErrors((previous) => {
      const current = previous[key]
      if (!current) return previous
      const errorField = field === 'ingredient_id' ? 'ingredient' : field
      if (!current[errorField]) return previous
      const nextRow = { ...current }
      delete nextRow[errorField]
      const next = { ...previous }
      if (Object.keys(nextRow).length === 0) delete next[key]
      else next[key] = nextRow
      return next
    })
  }

  function addRow() {
    setRows((previous) => [...previous, makeRow()])
  }

  function removeRow(key: string) {
    setRows((previous) => previous.filter((row) => row.key !== key))
    setRowErrors((previous) => {
      const next = { ...previous }
      delete next[key]
      return next
    })
  }

  function resetForm() {
    setForm(initialForm)
    setRows([makeRow()])
    setErrors({})
    setRowErrors({})
    setSuccess(null)
  }

  function validate(): NewRecipePayload | null {
    const nextErrors: Record<string, string> = {}
    const nextRowErrors: Record<string, RowErrors> = {}

    if (form.title.trim().length < 3) {
      nextErrors.title = 'Give your recipe a title of at least 3 characters.'
    }

    const prep = Number(form.prep_time)
    if (!form.prep_time.trim() || !Number.isFinite(prep) || prep < 1) {
      nextErrors.prep_time = 'Prep time is required and must be at least 1 minute.'
    } else if (prep > 1440) {
      nextErrors.prep_time = 'Prep time looks too long — keep it under 24 hours.'
    }

    const cook = Number(form.cook_time)
    if (!form.cook_time.trim() || !Number.isFinite(cook) || cook < 0) {
      nextErrors.cook_time = 'Cook time is required (use 0 for a no-cook recipe).'
    } else if (cook > 1440) {
      nextErrors.cook_time = 'Cook time looks too long — keep it under 24 hours.'
    }

    const servings = Number(form.serving)
    if (!form.serving.trim() || !Number.isInteger(servings) || servings < 1) {
      nextErrors.serving = 'Servings must be a whole number of 1 or more.'
    } else if (servings > 50) {
      nextErrors.serving = 'That is a lot of mouths — keep servings at 50 or fewer.'
    }

    if (form.image_url.trim() && !/^(https?:\/\/|\/)/i.test(form.image_url.trim())) {
      nextErrors.image_url = 'Use a full http(s) image URL or a local /path.'
    }

    if (form.instructions.trim().length < 20) {
      nextErrors.instructions = 'Add step-by-step instructions (at least 20 characters).'
    }

    if (rows.length === 0) {
      nextErrors.ingredients = 'Add at least one ingredient row.'
    }

    const seen = new Map<number, string>()
    rows.forEach((row) => {
      const rowError: RowErrors = {}
      const ingredientId = Number(row.ingredient_id)

      if (!row.ingredient_id) {
        rowError.ingredient = 'Choose an ingredient.'
      } else if (!ingredients.some((ingredient) => ingredient.ingredient_id === ingredientId)) {
        rowError.ingredient = 'Ingredient is not in the dictionary.'
      } else if (seen.has(ingredientId)) {
        rowError.ingredient = 'This ingredient is already on the recipe.'
      } else {
        seen.set(ingredientId, row.key)
      }

      const quantity = Number(row.quantity)
      if (!row.quantity.trim() || !Number.isFinite(quantity) || quantity <= 0) {
        rowError.quantity = 'Enter a quantity above 0.'
      }

      if (!row.unit) {
        rowError.unit = 'Choose a unit.'
      }

      if (Object.keys(rowError).length > 0) {
        nextRowErrors[row.key] = rowError
      }
    })

    setErrors(nextErrors)
    setRowErrors(nextRowErrors)

    if (Object.keys(nextErrors).length > 0 || Object.keys(nextRowErrors).length > 0) {
      const rowIssueCount = Object.values(nextRowErrors).reduce(
        (total, row) => total + Object.keys(row).length,
        0,
      )
      const issueCount = Object.keys(nextErrors).length + rowIssueCount
      notify(
        'Please fix the highlighted fields',
        'error',
        `${issueCount} validation ${issueCount === 1 ? 'issue needs' : 'issues need'} attention.`,
      )
      window.setTimeout(
        () => errorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }),
        60,
      )
      return null
    }

    return {
      title: form.title.trim(),
      prep_time: prep,
      cook_time: cook,
      serving: servings,
      instructions: form.instructions.trim(),
      image_url: form.image_url.trim(),
      ingredients: rows.map((row) => ({
        ingredient_id: Number(row.ingredient_id),
        quantity: Number(row.quantity),
        unit: row.unit,
      })),
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const payload = validate()
    if (!payload) return

    const id = onAddRecipe(payload)
    setSuccess({ id, title: payload.title, count: payload.ingredients.length })
    notify(
      'Recipe added to the catalog',
      'success',
      `${payload.title} · ${pluralize(payload.ingredients.length, 'ingredient row')} saved.`,
    )
    setForm(initialForm)
    setRows([makeRow()])
    setErrors({})
    setRowErrors({})
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleAddIngredient(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const name = newIngredientName.trim()

    if (name.length < 2) {
      setNewIngredientError('Enter an ingredient name of at least 2 characters.')
      return
    }

    const duplicate = ingredients.find(
      (ingredient) => ingredient.name.toLowerCase() === name.toLowerCase(),
    )
    if (duplicate) {
      setNewIngredientError(`“${duplicate.name}” already exists in the dictionary.`)
      return
    }

    const result = onAddIngredientToDictionary(name, newIngredientCategory)
    notify(
      result.created ? 'Ingredient added to the dictionary' : 'Ingredient already exists',
      result.created ? 'success' : 'info',
      `${result.ingredient.name} · ${result.ingredient.category}`,
    )

    setRows((previous) => {
      const emptyRow = previous.find((row) => !row.ingredient_id)
      if (emptyRow) {
        return previous.map((row) =>
          row.key === emptyRow.key
            ? { ...row, ingredient_id: String(result.ingredient.ingredient_id) }
            : row,
        )
      }
      return [
        ...previous,
        makeRow({ ingredient_id: String(result.ingredient.ingredient_id) }),
      ]
    })

    setIngredientModalOpen(false)
    setNewIngredientName('')
    setNewIngredientError('')
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <p className="eyebrow">Admin workspace</p>
            <span className="inline-flex items-center gap-1 rounded-full border border-paprika-200 bg-paprika-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.1em] text-paprika-600">
              <Icon name="shieldCheck" className="h-3 w-3" />
              Catalog editor
            </span>
          </div>
          <h1 className="mt-1 max-w-2xl font-display text-[38px] font-semibold leading-[1.02] tracking-[-0.03em] text-ink-900 sm:text-5xl">
            Add a recipe to <span className="italic text-paprika-500">the catalog.</span>
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-500">
            Create one <span className="font-mono text-[12px]">Recipes</span> record and as many{' '}
            <span className="font-mono text-[12px]">Recipe Ingredients</span> rows as the dish
            needs. Every field is validated before it reaches mock state.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-2xl border border-cream-200 bg-white px-3 py-2 shadow-soft">
          <Avatar name={currentUser.username} size="sm" />
          <div>
            <p className="text-[10px] font-bold text-ink-900">{currentUser.username}</p>
            <p className="text-[9px] text-ink-400">
              Submitting as user_id {currentUser.user_id}
            </p>
          </div>
        </div>
      </div>

      {success && (
        <div className="animate-fade-up flex flex-col gap-3 rounded-2xl border border-olive-200 bg-olive-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-olive-500 text-white">
              <Icon name="checkCircle" className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-bold text-olive-800">Recipe published to the catalog</p>
              <p className="mt-0.5 text-[11px] text-olive-700/80">
                “{success.title}” was saved as recipe #{success.id} with{' '}
                {pluralize(success.count, 'ingredient row')}. The form is ready for the next one.
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2 sm:pl-0">
            <button
              type="button"
              onClick={() => onOpenRecipe(success.id)}
              className="inline-flex items-center gap-1.5 rounded-full bg-olive-700 px-3.5 py-2 text-[11px] font-bold text-white transition hover:bg-olive-600"
            >
              View recipe
              <Icon name="arrowRight" className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setSuccess(null)}
              className="flex h-8 w-8 items-center justify-center rounded-full text-olive-600 transition hover:bg-white/60"
              aria-label="Dismiss success message"
            >
              <Icon name="x" className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {errorCount > 0 && (
        <div
          ref={errorRef}
          role="alert"
          className="rounded-2xl border border-paprika-200 bg-paprika-50 px-4 py-3.5"
        >
          <div className="flex items-start gap-2.5">
            <Icon name="alertCircle" className="mt-0.5 h-4 w-4 shrink-0 text-paprika-600" />
            <div>
              <p className="text-[12px] font-bold text-paprika-700">
                {errorCount} {errorCount === 1 ? 'field needs' : 'fields need'} attention
              </p>
              <ul className="mt-1 space-y-0.5 text-[10px] leading-relaxed text-paprika-700/80">
                {Object.values(errors).map((message) => (
                  <li key={message}>• {message}</li>
                ))}
                {Object.entries(rowErrors).map(([key, row]) =>
                  Object.values(row).map((message) => {
                    const rowIndex = rows.findIndex((row) => row.key === key)
                    return (
                      <li key={`${key}-${message}`}>
                        • Ingredient row {rowIndex + 1}: {message}
                      </li>
                    )
                  }),
                )}
              </ul>
            </div>
          </div>
        </div>
      )}

      <div className="grid items-start gap-5 lg:grid-cols-[1fr_370px] xl:gap-7">
        <form id="recipe-form" onSubmit={handleSubmit} noValidate className="space-y-5">
          <section className="card p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="eyebrow">01 · Recipe basics</p>
                <h2 className="mt-0.5 font-display text-2xl font-semibold text-ink-900">
                  The essentials
                </h2>
              </div>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-paprika-50 text-paprika-600">
                <Icon name="bookOpen" className="h-4 w-4" />
              </span>
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <label htmlFor="recipe-title" className="field-label">
                  Recipe title <span className="text-paprika-500">*</span>
                </label>
                <input
                  id="recipe-title"
                  value={form.title}
                  onChange={(event) => updateField('title', event.target.value)}
                  placeholder="e.g. Sunday Tomato & Basil Pasta"
                  className={`field ${errors.title ? 'field-error' : ''}`}
                  aria-invalid={Boolean(errors.title)}
                  aria-describedby={errors.title ? 'recipe-title-error' : undefined}
                />
                {errors.title && (
                  <p id="recipe-title-error" className="mt-1 text-[10px] font-medium text-paprika-600">
                    {errors.title}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label htmlFor="prep-time" className="field-label">
                    Prep (min) <span className="text-paprika-500">*</span>
                  </label>
                  <input
                    id="prep-time"
                    type="number"
                    min="1"
                    step="1"
                    inputMode="numeric"
                    value={form.prep_time}
                    onChange={(event) => updateField('prep_time', event.target.value)}
                    placeholder="10"
                    className={`field ${errors.prep_time ? 'field-error' : ''}`}
                    aria-invalid={Boolean(errors.prep_time)}
                  />
                  {errors.prep_time && (
                    <p className="mt-1 text-[10px] font-medium text-paprika-600">{errors.prep_time}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="cook-time" className="field-label">
                    Cook (min) <span className="text-paprika-500">*</span>
                  </label>
                  <input
                    id="cook-time"
                    type="number"
                    min="0"
                    step="1"
                    inputMode="numeric"
                    value={form.cook_time}
                    onChange={(event) => updateField('cook_time', event.target.value)}
                    placeholder="25"
                    className={`field ${errors.cook_time ? 'field-error' : ''}`}
                    aria-invalid={Boolean(errors.cook_time)}
                  />
                  {errors.cook_time && (
                    <p className="mt-1 text-[10px] font-medium text-paprika-600">{errors.cook_time}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="servings" className="field-label">
                    Servings <span className="text-paprika-500">*</span>
                  </label>
                  <input
                    id="servings"
                    type="number"
                    min="1"
                    step="1"
                    inputMode="numeric"
                    value={form.serving}
                    onChange={(event) => updateField('serving', event.target.value)}
                    placeholder="4"
                    className={`field ${errors.serving ? 'field-error' : ''}`}
                    aria-invalid={Boolean(errors.serving)}
                  />
                  {errors.serving && (
                    <p className="mt-1 text-[10px] font-medium text-paprika-600">{errors.serving}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="image-url" className="field-label">
                  Image URL <span className="font-normal text-ink-400">(optional)</span>
                </label>
                <div className="relative">
                  <Icon
                    name="image"
                    className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400"
                  />
                  <input
                    id="image-url"
                    type="url"
                    value={form.image_url}
                    onChange={(event) => updateField('image_url', event.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className={`field pl-10 ${errors.image_url ? 'field-error' : ''}`}
                    aria-invalid={Boolean(errors.image_url)}
                  />
                </div>
                {errors.image_url && (
                  <p className="mt-1 text-[10px] font-medium text-paprika-600">{errors.image_url}</p>
                )}
                <p className="mt-1 text-[9px] text-ink-400">
                  Leave blank to use a warm placeholder in the catalog.
                </p>
              </div>
            </div>
          </section>

          <section className="card p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="eyebrow">02 · Method</p>
                <h2 className="mt-0.5 font-display text-2xl font-semibold text-ink-900">
                  Step-by-step instructions
                </h2>
              </div>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-olive-50 text-olive-600">
                <Icon name="utensils" className="h-4 w-4" />
              </span>
            </div>

            <div className="mt-5">
              <label htmlFor="instructions" className="field-label">
                Instructions <span className="text-paprika-500">*</span>
              </label>
              <textarea
                id="instructions"
                value={form.instructions}
                onChange={(event) => updateField('instructions', event.target.value)}
                rows={8}
                placeholder={`Pat the chicken dry and season both sides.\nWarm the olive oil in a skillet over medium-high heat.\nSear for 5–6 minutes per side, then set aside.`}
                className={`field resize-y leading-relaxed ${errors.instructions ? 'field-error' : ''}`}
                aria-invalid={Boolean(errors.instructions)}
              />
              <div className="mt-1.5 flex items-start justify-between gap-3">
                <p className="text-[9px] leading-relaxed text-ink-400">
                  Put each step on a new line. Blank lines are ignored.
                </p>
                <span className="shrink-0 text-[9px] font-medium text-ink-400">
                  {form.instructions.trim().length} chars
                </span>
              </div>
              {errors.instructions && (
                <p className="mt-1 text-[10px] font-medium text-paprika-600">
                  {errors.instructions}
                </p>
              )}
            </div>
          </section>

          <section className="card p-5 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="eyebrow">03 · Recipe Ingredients</p>
                <h2 className="mt-0.5 font-display text-2xl font-semibold text-ink-900">
                  What goes in the dish
                </h2>
              </div>
              <button
                type="button"
                onClick={() => {
                  setNewIngredientName('')
                  setNewIngredientError('')
                  setIngredientModalOpen(true)
                }}
                className="inline-flex items-center gap-1 rounded-full border border-cream-300 bg-white px-3 py-1.5 text-[10px] font-bold text-ink-600 transition hover:border-paprika-300 hover:text-paprika-600"
              >
                <Icon name="plus" className="h-3.5 w-3.5" strokeWidth={2.2} />
                New dictionary ingredient
              </button>
            </div>

            <p className="mt-1.5 text-[11px] leading-relaxed text-ink-500">
              Each row becomes one record in the{' '}
              <span className="font-mono text-[10px]">Recipe Ingredients</span> table, linking this
              recipe to the shared Ingredient dictionary.
            </p>

            {errors.ingredients && (
              <p className="mt-3 rounded-xl bg-paprika-50 px-3 py-2 text-[10px] font-medium text-paprika-700">
                {errors.ingredients}
              </p>
            )}

            <div className="mt-4 space-y-2.5">
              {rows.map((row, index) => {
                const rowError = rowErrors[row.key] ?? {}
                return (
                  <div
                    key={row.key}
                    className={`rounded-2xl border bg-cream-50/60 p-3 transition ${
                      Object.keys(rowError).length > 0
                        ? 'border-paprika-300'
                        : 'border-cream-200'
                    }`}
                  >
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.12em] text-ink-400">
                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white text-[8px] text-ink-500">
                          {index + 1}
                        </span>
                        Ingredient row
                      </span>
                      <button
                        type="button"
                        onClick={() => removeRow(row.key)}
                        disabled={rows.length === 1}
                        className="flex h-7 w-7 items-center justify-center rounded-full text-ink-400 transition hover:bg-paprika-50 hover:text-paprika-600 disabled:opacity-30"
                        aria-label={`Remove ingredient row ${index + 1}`}
                      >
                        <Icon name="trash" className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-[1fr_90px_110px]">
                      <div className="col-span-2 sm:col-span-1">
                        <label
                          htmlFor={`ingredient-${row.key}`}
                          className="mb-1 block text-[9px] font-bold uppercase tracking-[0.1em] text-ink-400"
                        >
                          Ingredient
                        </label>
                        <div className="relative">
                          <select
                            id={`ingredient-${row.key}`}
                            value={row.ingredient_id}
                            onChange={(event) =>
                              updateRow(row.key, 'ingredient_id', event.target.value)
                            }
                            className={`field appearance-none py-2.5 pr-8 ${
                              rowError.ingredient ? 'field-error' : ''
                            }`}
                            aria-invalid={Boolean(rowError.ingredient)}
                          >
                            <option value="">Choose ingredient…</option>
                            {INGREDIENT_CATEGORIES.map((category) => (
                              <optgroup key={category} label={category}>
                                {ingredients
                                  .filter((ingredient) => ingredient.category === category)
                                  .map((ingredient) => (
                                    <option
                                      key={ingredient.ingredient_id}
                                      value={ingredient.ingredient_id}
                                    >
                                      {ingredient.name}
                                    </option>
                                  ))}
                              </optgroup>
                            ))}
                          </select>
                          <Icon
                            name="chevronDown"
                            className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-400"
                          />
                        </div>
                        {rowError.ingredient && (
                          <p className="mt-1 text-[9px] font-medium text-paprika-600">
                            {rowError.ingredient}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor={`quantity-${row.key}`}
                          className="mb-1 block text-[9px] font-bold uppercase tracking-[0.1em] text-ink-400"
                        >
                          Quantity
                        </label>
                        <input
                          id={`quantity-${row.key}`}
                          type="number"
                          min="0.01"
                          step="0.01"
                          inputMode="decimal"
                          value={row.quantity}
                          onChange={(event) => updateRow(row.key, 'quantity', event.target.value)}
                          placeholder="200"
                          className={`field py-2.5 ${rowError.quantity ? 'field-error' : ''}`}
                          aria-invalid={Boolean(rowError.quantity)}
                        />
                        {rowError.quantity && (
                          <p className="mt-1 text-[9px] font-medium text-paprika-600">
                            {rowError.quantity}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor={`unit-${row.key}`}
                          className="mb-1 block text-[9px] font-bold uppercase tracking-[0.1em] text-ink-400"
                        >
                          Unit
                        </label>
                        <div className="relative">
                          <select
                            id={`unit-${row.key}`}
                            value={row.unit}
                            onChange={(event) => updateRow(row.key, 'unit', event.target.value)}
                            className={`field appearance-none py-2.5 pr-8 ${
                              rowError.unit ? 'field-error' : ''
                            }`}
                            aria-invalid={Boolean(rowError.unit)}
                          >
                            {UNITS.map((unit) => (
                              <option key={unit} value={unit}>
                                {unit}
                              </option>
                            ))}
                          </select>
                          <Icon
                            name="chevronDown"
                            className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-400"
                          />
                        </div>
                        {rowError.unit && (
                          <p className="mt-1 text-[9px] font-medium text-paprika-600">
                            {rowError.unit}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <button
              type="button"
              onClick={addRow}
              className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-2xl border border-dashed border-cream-300 bg-cream-50/50 py-3 text-[11px] font-bold text-ink-500 transition hover:border-paprika-300 hover:bg-paprika-50/40 hover:text-paprika-600"
            >
              <Icon name="plus" className="h-4 w-4" strokeWidth={2.2} />
              Add another ingredient row
            </button>
          </section>

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-dashed border-cream-300 bg-cream-100/50 px-4 py-3.5">
            <p className="flex items-center gap-2 text-[10px] text-ink-500">
              <Icon name="info" className="h-4 w-4 text-ink-400" />
              Validated locally — no database writes happen in this prototype.
            </p>
            <div className="flex gap-2">
              <button type="button" onClick={resetForm} className="btn-ghost btn-sm">
                Reset form
              </button>
              <button type="submit" className="btn-primary btn-sm">
                <Icon name="check" className="h-4 w-4" strokeWidth={2.4} />
                Publish recipe
              </button>
            </div>
          </div>
        </form>

        <aside className="space-y-4 lg:sticky lg:top-[94px]">
          <section className="card overflow-hidden">
            <div className="relative aspect-[4/3] bg-cream-200">
              <PreviewImage
                key={form.image_url.trim()}
                src={form.image_url.trim()}
                alt={form.title || 'Recipe preview'}
              />
              <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-ink-600 backdrop-blur-sm">
                Live preview
              </span>
              <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full bg-ink-900/75 px-2.5 py-1 text-[9px] font-semibold text-white backdrop-blur-sm">
                <Icon name="clock" className="h-3 w-3" />
                {formatTime(
                  (Number(form.prep_time) || 0) + (Number(form.cook_time) || 0),
                )}{' '}
                total
              </span>
            </div>
            <div className="p-4">
              <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-paprika-600">
                New recipe
              </p>
              <h2 className="mt-1 font-display text-[23px] font-semibold leading-tight text-ink-900">
                {form.title.trim() || 'Your recipe title'}
              </h2>
              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-ink-400">
                <span className="inline-flex items-center gap-1">
                  <Icon name="users" className="h-3 w-3" />
                  Serves {form.serving || '—'}
                </span>
                <span className="h-0.5 w-0.5 rounded-full bg-cream-300" />
                <span className="inline-flex items-center gap-1">
                  <Icon name="list" className="h-3 w-3" />
                  {selectedRows.length} ingredients
                </span>
              </div>

              <div className="mt-3 rounded-xl bg-cream-50 px-3 py-2.5">
                <div className="flex items-center justify-between">
                  <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-ink-400">
                    Recipe Ingredients
                  </p>
                  <span className="text-[9px] font-bold text-paprika-600">
                    {selectedRows.length} {selectedRows.length === 1 ? 'row' : 'rows'}
                  </span>
                </div>
                {selectedRows.length > 0 ? (
                  <ul className="mt-1.5 space-y-1">
                    {selectedRows.slice(0, 4).map((row) => (
                      <li
                        key={row.key}
                        className="flex items-center justify-between gap-2 text-[10px] text-ink-600"
                      >
                        <span className="truncate">{row.ingredient?.name}</span>
                        <span className="shrink-0 font-semibold text-ink-800">
                          {formatQuantity(Number(row.quantity))} {row.unit}
                        </span>
                      </li>
                    ))}
                    {selectedRows.length > 4 && (
                      <li className="text-[9px] font-medium text-ink-400">
                        +{selectedRows.length - 4} more rows
                      </li>
                    )}
                  </ul>
                ) : (
                  <p className="mt-1.5 text-[10px] text-ink-400">
                    Ingredient rows will appear here as you add them.
                  </p>
                )}
              </div>
            </div>
          </section>

          <section className="card p-4">
            <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-ink-400">
              What gets saved
            </p>
            <div className="mt-2.5 space-y-2">
              <div className="rounded-xl border border-cream-200 bg-cream-50/60 p-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[9px] font-bold uppercase tracking-[0.08em] text-ink-600">
                    Recipes
                  </span>
                  <span className="rounded-full bg-white px-2 py-0.5 text-[8px] font-bold text-ink-500">
                    1 row
                  </span>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-[9px]">
                  <span className="text-ink-400">prep_time</span>
                  <span className="text-right font-semibold text-ink-700">
                    {form.prep_time || '—'} min
                  </span>
                  <span className="text-ink-400">cook_time</span>
                  <span className="text-right font-semibold text-ink-700">
                    {form.cook_time || '—'} min
                  </span>
                  <span className="text-ink-400">serving</span>
                  <span className="text-right font-semibold text-ink-700">
                    {form.serving || '—'}
                  </span>
                  <span className="text-ink-400">submitted_by_user_id</span>
                  <span className="text-right font-semibold text-ink-700">
                    {currentUser.user_id}
                  </span>
                </div>
              </div>

              <div className="rounded-xl border border-cream-200 bg-cream-50/60 p-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[9px] font-bold uppercase tracking-[0.08em] text-ink-600">
                    Recipe Ingredients
                  </span>
                  <span className="rounded-full bg-white px-2 py-0.5 text-[8px] font-bold text-ink-500">
                    {rows.length} {rows.length === 1 ? 'row' : 'rows'}
                  </span>
                </div>
                <p className="mt-2 font-mono text-[8px] leading-relaxed text-ink-400">
                  recipe_id · ingredient_id · quantity · unit
                </p>
              </div>
            </div>

            <button type="submit" form="recipe-form" className="btn-primary mt-3 w-full btn-sm">
              <Icon name="check" className="h-4 w-4" strokeWidth={2.4} />
              Publish recipe
            </button>
            <button type="button" onClick={resetForm} className="btn-ghost mt-1 w-full btn-sm">
              <Icon name="refresh" className="h-3.5 w-3.5" />
              Clear all fields
            </button>
          </section>

          <div className="flex items-start gap-2 rounded-2xl border border-cream-200 bg-white px-3.5 py-3">
            <Icon name="lightbulb" className="mt-0.5 h-4 w-4 shrink-0 text-butter-500" />
            <p className="text-[9px] leading-relaxed text-ink-500">
              Need an ingredient that isn&apos;t listed? Use{' '}
              <span className="font-semibold text-ink-700">New dictionary ingredient</span> in the
              ingredients section. It will be available to every recipe immediately.
            </p>
          </div>
        </aside>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-dashed border-cream-300 bg-cream-100/50 px-4 py-3">
        <p className="flex items-center gap-2 text-[10px] text-ink-500">
          <Icon name="database" className="h-3.5 w-3.5 text-ink-400" />
          New recipe rows live in React state for this prototype — ready to map to PHP/MySQL later.
        </p>
        <button
          type="button"
          onClick={() => onNavigate({ view: 'profile' })}
          className="inline-flex items-center gap-1 text-[10px] font-bold text-paprika-600 transition hover:text-paprika-700"
        >
          View my submissions
          <Icon name="arrowRight" className="h-3.5 w-3.5" />
        </button>
      </div>

      <Modal
        open={ingredientModalOpen}
        onClose={() => setIngredientModalOpen(false)}
        title="Add to the Ingredient dictionary"
        description="New ingredients are shared across every recipe and match calculation."
        footer={
          <>
            <button
              type="button"
              onClick={() => setIngredientModalOpen(false)}
              className="btn-ghost"
            >
              Cancel
            </button>
            <button type="submit" form="new-ingredient-form" className="btn-primary">
              <Icon name="plus" className="h-4 w-4" strokeWidth={2.2} />
              Add ingredient
            </button>
          </>
        }
      >
        <form id="new-ingredient-form" onSubmit={handleAddIngredient} className="space-y-4">
          <div>
            <label htmlFor="new-ingredient-name" className="field-label">
              Ingredient name <span className="text-paprika-500">*</span>
            </label>
            <input
              id="new-ingredient-name"
              value={newIngredientName}
              onChange={(event) => {
                setNewIngredientName(event.target.value)
                setNewIngredientError('')
              }}
              placeholder="e.g. Gochujang"
              className={`field ${newIngredientError ? 'field-error' : ''}`}
              autoFocus
            />
            {newIngredientError && (
              <p className="mt-1 text-[10px] font-medium text-paprika-600">{newIngredientError}</p>
            )}
          </div>

          <div>
            <label htmlFor="new-ingredient-category" className="field-label">
              Category <span className="text-paprika-500">*</span>
            </label>
            <div className="relative">
              <select
                id="new-ingredient-category"
                value={newIngredientCategory}
                onChange={(event) =>
                  setNewIngredientCategory(event.target.value as IngredientCategory)
                }
                className="field appearance-none pr-9"
              >
                {INGREDIENT_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {categoryEmoji[category]} {category}
                  </option>
                ))}
              </select>
              <Icon
                name="chevronDown"
                className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400"
              />
            </div>
          </div>

          <div className="rounded-xl border border-cream-200 bg-cream-50 px-3 py-2.5">
            <p className="text-[9px] leading-relaxed text-ink-500">
              This will add one <span className="font-mono text-[9px]">Ingredient</span> row and make
              the item selectable in the recipe ingredient rows above.
            </p>
          </div>
        </form>
      </Modal>
    </div>
  )
}
