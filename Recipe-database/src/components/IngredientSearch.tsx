import { useId, useMemo, useRef, useState } from 'react'
import type { FormEvent, KeyboardEvent } from 'react'
import type { Ingredient } from '../data/mockData'
import { categoryDotStyles } from '../lib/format'
import { Icon } from './Icon'

interface IngredientSearchProps {
  ingredients: Ingredient[]
  selectedIds: number[]
  onSelect: (ingredient: Ingredient) => void
  onUnknown?: (query: string) => void
  placeholder?: string
  variant?: 'default' | 'hero'
  autoFocus?: boolean
}

export function IngredientSearch({
  ingredients,
  selectedIds,
  onSelect,
  onUnknown,
  placeholder = 'Search ingredients — try “spinach”',
  variant = 'default',
  autoFocus = false,
}: IngredientSearchProps) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const listId = useId()

  const suggestions = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) return []
    return ingredients
      .filter((ingredient) => ingredient.name.toLowerCase().includes(normalized))
      .slice(0, 7)
  }, [ingredients, query])

  const selected = new Set(selectedIds)

  function choose(ingredient: Ingredient) {
    onSelect(ingredient)
    setQuery('')
    setActiveIndex(-1)
    setOpen(false)
    inputRef.current?.focus()
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const normalized = query.trim().toLowerCase()
    if (!normalized) {
      inputRef.current?.focus()
      return
    }

    const exact = ingredients.find(
      (ingredient) => ingredient.name.toLowerCase() === normalized,
    )
    const target = exact ?? suggestions[0]

    if (target) {
      choose(target)
      return
    }

    onUnknown?.(query.trim())
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setOpen(true)
      setActiveIndex((current) => Math.min(current + 1, suggestions.length - 1))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex((current) => Math.max(current - 1, 0))
    } else if (event.key === 'Enter' && open && activeIndex >= 0 && suggestions[activeIndex]) {
      event.preventDefault()
      choose(suggestions[activeIndex])
    } else if (event.key === 'Escape') {
      setOpen(false)
      setActiveIndex(-1)
    }
  }

  const isHero = variant === 'hero'
  const showDropdown = open && query.trim().length > 0

  return (
    <form
      onSubmit={handleSubmit}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setOpen(false)
          setActiveIndex(-1)
        }
      }}
      className="relative"
      role="search"
    >
      {isHero ? (
        <div className="flex items-center gap-1.5 rounded-2xl border border-white bg-white p-1.5 shadow-lift transition focus-within:ring-4 focus-within:ring-paprika-500/10 sm:p-2">
          <Icon name="search" className="ml-2.5 h-5 w-5 shrink-0 text-ink-400" />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value)
              setOpen(true)
              setActiveIndex(-1)
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            autoFocus={autoFocus}
            autoComplete="off"
            role="combobox"
            aria-expanded={showDropdown}
            aria-controls={listId}
            aria-autocomplete="list"
            className="h-11 min-w-0 flex-1 bg-transparent px-1 text-sm text-ink-900 outline-none placeholder:text-ink-400"
          />
          <button
            type="submit"
            className="flex h-11 shrink-0 items-center gap-1.5 rounded-xl bg-paprika-500 px-3.5 text-sm font-semibold text-white transition hover:bg-paprika-600 sm:px-4"
          >
            <Icon name="plus" className="h-4 w-4" strokeWidth={2.2} />
            <span className="hidden sm:inline">Add</span>
          </button>
        </div>
      ) : (
        <div className="relative">
          <Icon
            name="search"
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400"
          />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value)
              setOpen(true)
              setActiveIndex(-1)
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            autoFocus={autoFocus}
            autoComplete="off"
            role="combobox"
            aria-expanded={showDropdown}
            aria-controls={listId}
            aria-autocomplete="list"
            className="field py-2.5 pl-10 pr-11"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg bg-paprika-500 text-white transition hover:bg-paprika-600"
            aria-label="Add ingredient"
          >
            <Icon name="plus" className="h-4 w-4" strokeWidth={2.2} />
          </button>
        </div>
      )}

      {showDropdown && (
        <div
          id={listId}
          role="listbox"
          className="absolute left-0 right-0 top-[calc(100%+8px)] z-40 max-h-72 overflow-y-auto rounded-2xl border border-cream-200 bg-white p-1.5 shadow-lift"
        >
          {suggestions.length === 0 ? (
            <div className="px-3 py-4 text-center">
              <p className="text-sm font-semibold text-ink-800">No dictionary match</p>
              <p className="mt-1 text-xs leading-relaxed text-ink-500">
                “{query.trim()}” isn&apos;t in the Ingredient table yet. Try a simpler term or add it
                from the admin workspace.
              </p>
            </div>
          ) : (
            suggestions.map((ingredient, index) => {
              const isSelected = selected.has(ingredient.ingredient_id)
              return (
                <button
                  key={ingredient.ingredient_id}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onMouseDown={(event) => event.preventDefault()}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => choose(ingredient)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition ${
                    activeIndex === index ? 'bg-cream-100' : 'hover:bg-cream-50'
                  }`}
                >
                  <span
                    className={`h-2 w-2 shrink-0 rounded-full ${categoryDotStyles[ingredient.category]}`}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-ink-900">
                      {ingredient.name}
                    </span>
                    <span className="block text-[11px] text-ink-400">{ingredient.category}</span>
                  </span>
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-full ${
                      isSelected
                        ? 'bg-olive-100 text-olive-600'
                        : 'bg-cream-100 text-ink-500'
                    }`}
                  >
                    <Icon
                      name={isSelected ? 'check' : 'plus'}
                      className="h-3.5 w-3.5"
                      strokeWidth={2.2}
                    />
                  </span>
                </button>
              )
            })
          )}
        </div>
      )}
    </form>
  )
}
