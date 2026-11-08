import { useState } from 'react'
import type { FormEvent } from 'react'
import type {
  Recipe,
  RecipeIngredient,
  User,
} from '../data/mockData'
import { formatTime, pluralize } from '../lib/format'
import type { Route } from '../lib/routes'
import { Avatar } from '../components/Avatar'
import { Icon } from '../components/Icon'

function RecipeThumb({
  recipe,
  imageClassName = 'h-full w-full object-cover',
}: {
  recipe: Recipe
  imageClassName?: string
}) {
  const [failed, setFailed] = useState(false)

  if (recipe.image_url && !failed) {
    return (
      <img
        src={recipe.image_url}
        alt=""
        loading="lazy"
        onError={() => setFailed(true)}
        className={imageClassName}
      />
    )
  }

  return (
    <span className="flex h-full w-full items-center justify-center text-olive-500/70">
      <Icon name="chefHat" className="h-5 w-5" />
    </span>
  )
}

interface UserProfileProps {
  currentUser: User
  users: User[]
  recipes: Recipe[]
  recipeIngredients: RecipeIngredient[]
  favorites: number[]
  selectedIds: number[]
  onUpdateUser: (updates: Partial<Pick<User, 'username' | 'email' | 'password'>>) => void
  onOpenRecipe: (recipeId: number) => void
  onToggleFavorite: (recipeId: number) => void
  onNavigate: (route: Route) => void
  notify: (message: string, tone?: 'success' | 'error' | 'info', description?: string) => void
}

export function UserProfile({
  currentUser,
  users,
  recipes,
  recipeIngredients,
  favorites,
  selectedIds,
  onUpdateUser,
  onOpenRecipe,
  onToggleFavorite,
  onNavigate,
  notify,
}: UserProfileProps) {
  const [username, setUsername] = useState(currentUser.username)
  const [email, setEmail] = useState(currentUser.email)
  const [profileErrors, setProfileErrors] = useState<Record<string, string>>({})
  const [profileSaved, setProfileSaved] = useState(false)

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPasswords, setShowPasswords] = useState(false)
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({})
  const [passwordSaved, setPasswordSaved] = useState(false)

  const submittedRecipes = recipes.filter(
    (recipe) => recipe.submitted_by_user_id === currentUser.user_id,
  )
  const savedRecipes = favorites
    .map((id) => recipes.find((recipe) => recipe.recipe_id === id))
    .filter((recipe): recipe is Recipe => Boolean(recipe))

  const passwordStrength = [
    newPassword.length >= 8,
    /[A-Z]/.test(newPassword),
    /[0-9]/.test(newPassword),
    /[^A-Za-z0-9]/.test(newPassword),
  ].filter(Boolean).length

  function handleProfileSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors: Record<string, string> = {}
    const trimmedUsername = username.trim()
    const trimmedEmail = email.trim().toLowerCase()

    if (trimmedUsername.length < 2) {
      nextErrors.username = 'Enter a username of at least 2 characters.'
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      nextErrors.email = 'Enter a valid email address.'
    } else if (
      users.some(
        (user) =>
          user.user_id !== currentUser.user_id &&
          user.email.toLowerCase() === trimmedEmail,
      )
    ) {
      nextErrors.email = 'That email is already used by another account.'
    }

    setProfileErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      notify('Check your profile details', 'error', 'A couple of fields still need attention.')
      return
    }

    onUpdateUser({ username: trimmedUsername, email: trimmedEmail })
    setProfileSaved(true)
    notify('Profile updated', 'success', `${trimmedUsername} · ${trimmedEmail}`)
  }

  function handlePasswordSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors: Record<string, string> = {}

    if (!currentPassword) {
      nextErrors.currentPassword = 'Enter your current password.'
    } else if (currentPassword !== currentUser.password) {
      nextErrors.currentPassword = 'That doesn’t match the current demo password.'
    }

    if (newPassword.length < 8) {
      nextErrors.newPassword = 'Use at least 8 characters.'
    } else if (newPassword === currentPassword) {
      nextErrors.newPassword = 'Choose a password that differs from the current one.'
    }

    if (confirmPassword !== newPassword) {
      nextErrors.confirmPassword = 'The passwords don’t match yet.'
    }

    setPasswordErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      notify('Password not updated', 'error', 'Please review the password requirements.')
      return
    }

    onUpdateUser({ password: newPassword })
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
    setPasswordSaved(true)
    notify('Password updated', 'success', 'Your mock account credentials were changed.')
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow">User profile</p>
        <h1 className="mt-1 max-w-2xl font-display text-[38px] font-semibold leading-[1.02] tracking-[-0.03em] text-ink-900 sm:text-5xl">
          Your kitchen, <span className="italic text-paprika-500">your way.</span>
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-500">
          Manage the account behind your recipe submissions and saved cookbook. These fields mirror
          the <span className="font-mono text-[12px]">User</span> table.
        </p>
      </div>

      <section className="relative overflow-hidden rounded-[2rem] bg-ink-900 p-6 text-cream-50 shadow-lift sm:p-8">
        <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full border border-white/10" />
        <div className="pointer-events-none absolute -bottom-28 left-1/3 h-56 w-56 rounded-full border border-white/10" />
        <div className="pointer-events-none absolute right-10 top-10 h-24 w-24 rounded-full bg-paprika-500/20 blur-2xl" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <Avatar name={currentUser.username} size="xl" className="ring-4 ring-white/15" />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-display text-3xl font-semibold text-white sm:text-4xl">
                  {currentUser.username}
                </h2>
                <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-butter-200">
                  <Icon name="leaf" className="h-3 w-3" />
                  Home cook
                </span>
              </div>
              <p className="mt-1 text-sm text-cream-200/70">{currentUser.email}</p>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-[10px] font-semibold text-cream-200/60">
                <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1">
                  <Icon name="database" className="h-3 w-3" />
                  user_id {currentUser.user_id}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1">
                  <Icon name="bookOpen" className="h-3 w-3" />
                  {pluralize(submittedRecipes.length, 'submission')}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => onNavigate({ view: 'admin' })}
              className="inline-flex items-center gap-1.5 rounded-full bg-cream-50 px-4 py-2.5 text-xs font-bold text-ink-900 transition hover:bg-white"
            >
              <Icon name="plus" className="h-4 w-4" strokeWidth={2.2} />
              Add a recipe
            </button>
            <button
              type="button"
              onClick={() => onNavigate({ view: 'matcher' })}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/20 px-4 py-2.5 text-xs font-bold text-cream-50 transition hover:bg-white/10"
            >
              <Icon name="search" className="h-4 w-4" />
              Open matcher
            </button>
          </div>
        </div>

        <div className="relative mt-6 grid grid-cols-3 gap-2.5 border-t border-white/10 pt-5">
          {[
            { value: submittedRecipes.length, label: 'Recipes submitted' },
            { value: savedRecipes.length, label: 'Saved recipes' },
            { value: selectedIds.length, label: 'Pantry ingredients' },
          ].map((stat) => (
            <div key={stat.label} className="rounded-2xl bg-white/5 px-3 py-2.5 text-center">
              <p className="font-display text-2xl font-semibold text-white">{stat.value}</p>
              <p className="mt-0.5 text-[8px] font-bold uppercase tracking-[0.1em] text-cream-200/50 sm:text-[9px]">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <div className="grid items-start gap-5 lg:grid-cols-[1.05fr_0.95fr] xl:gap-7">
        <div className="space-y-5">
          <section className="card p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="eyebrow">User table · Account details</p>
                <h2 className="mt-0.5 font-display text-2xl font-semibold text-ink-900">
                  Profile settings
                </h2>
              </div>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-paprika-50 text-paprika-600">
                <Icon name="user" className="h-4 w-4" />
              </span>
            </div>

            <form onSubmit={handleProfileSubmit} noValidate className="mt-5 space-y-4">
              <div>
                <label htmlFor="profile-user-id" className="field-label">
                  User ID
                </label>
                <div className="relative">
                  <input
                    id="profile-user-id"
                    value={currentUser.user_id}
                    disabled
                    className="field bg-cream-50 pr-10 text-ink-400"
                  />
                  <Icon
                    name="lock"
                    className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-300"
                  />
                </div>
                <p className="mt-1 text-[9px] text-ink-400">
                  Primary key — read-only in this prototype.
                </p>
              </div>

              <div>
                <label htmlFor="profile-username" className="field-label">
                  Username <span className="text-paprika-500">*</span>
                </label>
                <input
                  id="profile-username"
                  value={username}
                  onChange={(event) => {
                    setUsername(event.target.value)
                    setProfileSaved(false)
                    setProfileErrors((previous) => {
                      if (!previous.username) return previous
                      const next = { ...previous }
                      delete next.username
                      return next
                    })
                  }}
                  autoComplete="username"
                  className={`field ${profileErrors.username ? 'field-error' : ''}`}
                  aria-invalid={Boolean(profileErrors.username)}
                />
                {profileErrors.username && (
                  <p className="mt-1 text-[10px] font-medium text-paprika-600">
                    {profileErrors.username}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="profile-email" className="field-label">
                  Email <span className="text-paprika-500">*</span>
                </label>
                <div className="relative">
                  <Icon
                    name="mail"
                    className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400"
                  />
                  <input
                    id="profile-email"
                    type="email"
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value)
                      setProfileSaved(false)
                      setProfileErrors((previous) => {
                        if (!previous.email) return previous
                        const next = { ...previous }
                        delete next.email
                        return next
                      })
                    }}
                    autoComplete="email"
                    className={`field pl-10 ${profileErrors.email ? 'field-error' : ''}`}
                    aria-invalid={Boolean(profileErrors.email)}
                  />
                </div>
                {profileErrors.email && (
                  <p className="mt-1 text-[10px] font-medium text-paprika-600">
                    {profileErrors.email}
                  </p>
                )}
              </div>

              {profileSaved && (
                <div className="flex items-center gap-2 rounded-xl border border-olive-200 bg-olive-50 px-3 py-2.5">
                  <Icon name="checkCircle" className="h-4 w-4 shrink-0 text-olive-600" />
                  <p className="text-[10px] font-semibold text-olive-700">
                    Profile details saved to mock state.
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between gap-3 pt-1">
                <p className="text-[9px] text-ink-400">Used for recipe attribution.</p>
                <button type="submit" className="btn-primary btn-sm">
                  <Icon name="check" className="h-3.5 w-3.5" strokeWidth={2.4} />
                  Save changes
                </button>
              </div>
            </form>
          </section>

          <section className="card p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="eyebrow">User table · Security</p>
                <h2 className="mt-0.5 font-display text-2xl font-semibold text-ink-900">
                  Password &amp; security
                </h2>
              </div>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-olive-50 text-olive-600">
                <Icon name="shieldCheck" className="h-4 w-4" />
              </span>
            </div>

            <form onSubmit={handlePasswordSubmit} noValidate className="mt-5 space-y-4">
              <div>
                <label htmlFor="current-password" className="field-label">
                  Current password <span className="text-paprika-500">*</span>
                </label>
                <input
                  id="current-password"
                  type={showPasswords ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(event) => {
                    setCurrentPassword(event.target.value)
                    setPasswordSaved(false)
                    setPasswordErrors((previous) => {
                      if (!previous.currentPassword) return previous
                      const next = { ...previous }
                      delete next.currentPassword
                      return next
                    })
                  }}
                  autoComplete="current-password"
                  placeholder="Demo password: demo1234"
                  className={`field ${passwordErrors.currentPassword ? 'field-error' : ''}`}
                  aria-invalid={Boolean(passwordErrors.currentPassword)}
                />
                {passwordErrors.currentPassword && (
                  <p className="mt-1 text-[10px] font-medium text-paprika-600">
                    {passwordErrors.currentPassword}
                  </p>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="new-password" className="field-label">
                    New password <span className="text-paprika-500">*</span>
                  </label>
                  <input
                    id="new-password"
                    type={showPasswords ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(event) => {
                      setNewPassword(event.target.value)
                      setPasswordSaved(false)
                      setPasswordErrors((previous) => {
                        if (!previous.newPassword) return previous
                        const next = { ...previous }
                        delete next.newPassword
                        return next
                      })
                    }}
                    autoComplete="new-password"
                    placeholder="At least 8 characters"
                    className={`field ${passwordErrors.newPassword ? 'field-error' : ''}`}
                    aria-invalid={Boolean(passwordErrors.newPassword)}
                  />
                  {passwordErrors.newPassword && (
                    <p className="mt-1 text-[10px] font-medium text-paprika-600">
                      {passwordErrors.newPassword}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="confirm-password" className="field-label">
                    Confirm password <span className="text-paprika-500">*</span>
                  </label>
                  <input
                    id="confirm-password"
                    type={showPasswords ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(event) => {
                      setConfirmPassword(event.target.value)
                      setPasswordSaved(false)
                      setPasswordErrors((previous) => {
                        if (!previous.confirmPassword) return previous
                        const next = { ...previous }
                        delete next.confirmPassword
                        return next
                      })
                    }}
                    autoComplete="new-password"
                    placeholder="Repeat new password"
                    className={`field ${passwordErrors.confirmPassword ? 'field-error' : ''}`}
                    aria-invalid={Boolean(passwordErrors.confirmPassword)}
                  />
                  {passwordErrors.confirmPassword && (
                    <p className="mt-1 text-[10px] font-medium text-paprika-600">
                      {passwordErrors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>

              {newPassword.length > 0 && (
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[9px] font-bold uppercase tracking-[0.1em] text-ink-400">
                      Strength
                    </span>
                    <span className="text-[9px] font-semibold text-ink-500">
                      {passwordStrength <= 1
                        ? 'Weak'
                        : passwordStrength === 2
                          ? 'Fair'
                          : passwordStrength === 3
                            ? 'Good'
                            : 'Strong'}
                    </span>
                  </div>
                  <div className="mt-1 flex gap-1">
                    {[1, 2, 3, 4].map((level) => (
                      <span
                        key={level}
                        className={`h-1.5 flex-1 rounded-full transition ${
                          passwordStrength >= level
                            ? passwordStrength <= 1
                              ? 'bg-paprika-400'
                              : passwordStrength === 2
                                ? 'bg-butter-400'
                                : 'bg-olive-500'
                            : 'bg-cream-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}

              {passwordSaved && (
                <div className="flex items-center gap-2 rounded-xl border border-olive-200 bg-olive-50 px-3 py-2.5">
                  <Icon name="checkCircle" className="h-4 w-4 shrink-0 text-olive-600" />
                  <p className="text-[10px] font-semibold text-olive-700">
                    Password updated in mock state.
                  </p>
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setShowPasswords((visible) => !visible)}
                  className="inline-flex items-center gap-1.5 text-[10px] font-bold text-ink-500 transition hover:text-ink-800"
                >
                  <Icon name={showPasswords ? 'eyeOff' : 'eye'} className="h-3.5 w-3.5" />
                  {showPasswords ? 'Hide passwords' : 'Show passwords'}
                </button>
                <button type="submit" className="btn-dark btn-sm">
                  <Icon name="lock" className="h-3.5 w-3.5" />
                  Update password
                </button>
              </div>
            </form>
          </section>
        </div>

        <div className="space-y-5">
          <section className="card p-5 sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="eyebrow">Recipes.submitted_by_user_id</p>
                <h2 className="mt-0.5 font-display text-2xl font-semibold text-ink-900">
                  My submissions
                </h2>
              </div>
              <span className="rounded-full bg-cream-100 px-2.5 py-1 text-[10px] font-bold text-ink-500">
                {submittedRecipes.length}
              </span>
            </div>

            {submittedRecipes.length > 0 ? (
              <div className="mt-3 divide-y divide-cream-100">
                {submittedRecipes.map((recipe) => {
                  const ingredientCount = recipeIngredients.filter(
                    (row) => row.recipe_id === recipe.recipe_id,
                  ).length
                  return (
                    <div key={recipe.recipe_id} className="flex items-center gap-3 py-3 first:pt-1">
                      <button
                        type="button"
                        onClick={() => onOpenRecipe(recipe.recipe_id)}
                        className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-cream-100"
                        aria-label={`Open ${recipe.title}`}
                      >
                        <RecipeThumb
                          recipe={recipe}
                          imageClassName="h-full w-full object-cover transition hover:scale-110"
                        />
                      </button>
                      <button
                        type="button"
                        onClick={() => onOpenRecipe(recipe.recipe_id)}
                        className="min-w-0 flex-1 text-left"
                      >
                        <p className="truncate text-[12px] font-bold text-ink-900 transition hover:text-paprika-600">
                          {recipe.title}
                        </p>
                        <p className="mt-0.5 text-[9px] text-ink-400">
                          #{String(recipe.recipe_id).padStart(3, '0')} ·{' '}
                          {formatTime(recipe.prep_time + recipe.cook_time)} ·{' '}
                          {pluralize(ingredientCount, 'ingredient')}
                        </p>
                      </button>
                      <span className="hidden shrink-0 rounded-full bg-olive-50 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wide text-olive-600 sm:inline-flex">
                        Published
                      </span>
                      <button
                        type="button"
                        onClick={() => onOpenRecipe(recipe.recipe_id)}
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-ink-300 transition hover:bg-cream-50 hover:text-paprika-600"
                        aria-label={`View ${recipe.title}`}
                      >
                        <Icon name="chevronRight" className="h-4 w-4" />
                      </button>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="mt-4 rounded-2xl border border-dashed border-cream-300 bg-cream-50 px-4 py-6 text-center">
                <p className="text-[11px] font-semibold text-ink-700">No recipes yet</p>
                <p className="mt-0.5 text-[10px] text-ink-400">
                  Your published recipes will be linked here by submitted_by_user_id.
                </p>
              </div>
            )}

            <button
              type="button"
              onClick={() => onNavigate({ view: 'admin' })}
              className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-cream-300 py-2.5 text-[10px] font-bold text-ink-500 transition hover:border-paprika-300 hover:text-paprika-600"
            >
              <Icon name="plus" className="h-3.5 w-3.5" strokeWidth={2.2} />
              Submit another recipe
            </button>
          </section>

          <section className="card p-5 sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="eyebrow">Saved cookbook</p>
                <h2 className="mt-0.5 font-display text-2xl font-semibold text-ink-900">
                  Saved recipes
                </h2>
              </div>
              <span className="rounded-full bg-paprika-50 px-2.5 py-1 text-[10px] font-bold text-paprika-600">
                {savedRecipes.length}
              </span>
            </div>

            {savedRecipes.length > 0 ? (
              <div className="mt-3 space-y-1.5">
                {savedRecipes.map((recipe) => (
                  <div
                    key={recipe.recipe_id}
                    className="flex items-center gap-3 rounded-xl p-1.5 transition hover:bg-cream-50"
                  >
                    <button
                      type="button"
                      onClick={() => onOpenRecipe(recipe.recipe_id)}
                      className="h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-cream-100"
                      aria-label={`Open ${recipe.title}`}
                    >
                      <RecipeThumb recipe={recipe} />
                    </button>
                    <button
                      type="button"
                      onClick={() => onOpenRecipe(recipe.recipe_id)}
                      className="min-w-0 flex-1 text-left"
                    >
                      <p className="truncate text-[11px] font-bold text-ink-900 transition hover:text-paprika-600">
                        {recipe.title}
                      </p>
                      <p className="mt-0.5 text-[9px] text-ink-400">
                        {formatTime(recipe.prep_time + recipe.cook_time)} · Serves {recipe.serving}
                      </p>
                    </button>
                    <button
                      type="button"
                      onClick={() => onToggleFavorite(recipe.recipe_id)}
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-paprika-500 transition hover:bg-paprika-50"
                      aria-label={`Remove ${recipe.title} from saved recipes`}
                    >
                      <Icon name="heart" className="h-3.5 w-3.5 fill-current" strokeWidth={2} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-4 rounded-2xl border border-dashed border-cream-300 bg-cream-50 px-4 py-6 text-center">
                <span className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-white text-paprika-400">
                  <Icon name="heart" className="h-4 w-4" />
                </span>
                <p className="mt-2 text-[11px] font-semibold text-ink-700">Nothing saved yet</p>
                <p className="mt-0.5 text-[10px] text-ink-400">
                  Tap the heart on any recipe to build your cookbook.
                </p>
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-dashed border-cream-300 bg-cream-100/50 p-4">
            <p className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.14em] text-ink-400">
              <Icon name="database" className="h-3.5 w-3.5" />
              User schema reflected
            </p>
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {['user_id', 'username', 'email', 'password'].map((field) => (
                <span
                  key={field}
                  className="rounded-full border border-cream-200 bg-white px-2.5 py-1 font-mono text-[9px] text-ink-500"
                >
                  {field}
                </span>
              ))}
            </div>
            <p className="mt-2 text-[9px] leading-relaxed text-ink-400">
              Credentials and profile edits are held in React state only. Production authentication
              would hash passwords and validate server-side.
            </p>
          </section>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-cream-200 bg-white px-4 py-3">
        <p className="flex items-center gap-2 text-[10px] text-ink-500">
          <Icon name="info" className="h-3.5 w-3.5 text-ink-400" />
          This account belongs to the seeded demo user — no real authentication is connected.
        </p>
        <span className="inline-flex items-center gap-1 rounded-full bg-cream-50 px-2.5 py-1 text-[9px] font-bold text-ink-400">
          <span className="h-1.5 w-1.5 rounded-full bg-olive-400" />
          Mock session
        </span>
      </div>
    </div>
  )
}
