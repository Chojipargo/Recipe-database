export type ViewName = 'dashboard' | 'matcher' | 'recipe' | 'admin' | 'profile'

export interface Route {
  view: ViewName
  recipeId?: number
}

export const viewMeta: Record<ViewName, { label: string; crumb: string }> = {
  dashboard: { label: 'Discover', crumb: 'Dashboard' },
  matcher: { label: 'Ingredient matcher', crumb: 'Matcher' },
  recipe: { label: 'Recipe details', crumb: 'Recipe' },
  admin: { label: 'Add a recipe', crumb: 'Admin workspace' },
  profile: { label: 'My account', crumb: 'Profile' },
}

export function parseRoute(hash: string): Route {
  const path = hash.replace(/^#\/?/, '').split('?')[0]
  const [segment, id] = path.split('/')

  if (segment === 'matcher') return { view: 'matcher' }
  if (segment === 'admin') return { view: 'admin' }
  if (segment === 'profile') return { view: 'profile' }
  if (segment === 'recipe' && id && Number.isFinite(Number(id))) {
    return { view: 'recipe', recipeId: Number(id) }
  }
  return { view: 'dashboard' }
}

export function routeToHash(route: Route): string {
  switch (route.view) {
    case 'matcher':
      return '#/matcher'
    case 'admin':
      return '#/admin'
    case 'profile':
      return '#/profile'
    case 'recipe':
      return route.recipeId ? `#/recipe/${route.recipeId}` : '#/'
    default:
      return '#/'
  }
}
