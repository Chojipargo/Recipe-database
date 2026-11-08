import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { User } from '../data/mockData'
import type { IconName } from './Icon'
import type { Route, ViewName } from '../lib/routes'
import { viewMeta } from '../lib/routes'
import { Avatar } from './Avatar'
import { Icon } from './Icon'
import { Logo } from './Logo'

interface NavItem {
  view: ViewName
  label: string
  icon: IconName
}

const primaryNav: NavItem[] = [
  { view: 'dashboard', label: 'Discover', icon: 'home' },
  { view: 'matcher', label: 'Ingredient matcher', icon: 'search' },
]

const workspaceNav: NavItem[] = [
  { view: 'admin', label: 'Add a recipe', icon: 'plus' },
  { view: 'profile', label: 'My account', icon: 'user' },
]

interface LayoutProps {
  route: Route
  onNavigate: (route: Route) => void
  user: User
  selectedCount: number
  readyCount: number
  children: ReactNode
}

interface SidebarContentProps {
  route: Route
  onNavigate: (route: Route) => void
  user: User
  selectedCount: number
  readyCount: number
  onClose?: () => void
}

function SidebarContent({
  route,
  onNavigate,
  user,
  selectedCount,
  readyCount,
  onClose,
}: SidebarContentProps) {
  const activeView: ViewName = route.view === 'recipe' ? 'dashboard' : route.view

  function go(next: Route) {
    onNavigate(next)
    onClose?.()
  }

  function renderNavItem(item: NavItem) {
    const active = activeView === item.view
    return (
      <button
        key={item.view}
        type="button"
        onClick={() => go({ view: item.view })}
        aria-current={active ? 'page' : undefined}
        className={`group flex w-full items-center gap-3 rounded-2xl px-2.5 py-2 text-left text-[13px] font-semibold transition-all ${
          active
            ? 'bg-white text-ink-900 shadow-soft'
            : 'text-ink-600 hover:bg-white/60 hover:text-ink-900'
        }`}
      >
        <span
          className={`flex h-9 w-9 items-center justify-center rounded-xl transition ${
            active
              ? 'bg-paprika-50 text-paprika-600'
              : 'bg-white/45 text-ink-500 group-hover:bg-white group-hover:text-ink-700'
          }`}
        >
          <Icon name={item.icon} className="h-4 w-4" strokeWidth={active ? 2 : 1.8} />
        </span>
        <span className="flex-1">{item.label}</span>
        {item.view === 'matcher' && selectedCount > 0 && (
          <span className="rounded-full bg-paprika-100 px-2 py-0.5 text-[10px] font-bold text-paprika-700">
            {selectedCount}
          </span>
        )}
        {active && <span className="h-1.5 w-1.5 rounded-full bg-paprika-500" />}
      </button>
    )
  }

  return (
    <div className="flex h-full flex-col overflow-y-auto px-5 pb-5 pt-6">
      <div className="flex items-center justify-between gap-2">
        <button type="button" onClick={() => go({ view: 'dashboard' })} className="text-left">
          <Logo />
        </button>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full text-ink-500 transition hover:bg-white hover:text-ink-900"
            aria-label="Close menu"
          >
            <Icon name="x" className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="mt-8 flex-1">
        <p className="mb-2 px-3 text-[9px] font-bold uppercase tracking-[0.2em] text-ink-400">
          Cook
        </p>
        <nav className="space-y-1" aria-label="Cooking navigation">
          {primaryNav.map(renderNavItem)}
        </nav>

        <p className="mb-2 mt-7 px-3 text-[9px] font-bold uppercase tracking-[0.2em] text-ink-400">
          Workspace
        </p>
        <nav className="space-y-1" aria-label="Workspace navigation">
          {workspaceNav.map(renderNavItem)}
        </nav>

        <div className="relative mt-8 overflow-hidden rounded-3xl bg-olive-700 p-5 text-cream-50 shadow-[0_20px_40px_-24px_rgba(71,82,47,0.9)]">
          <div className="pointer-events-none absolute -right-8 -top-10 h-28 w-28 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -bottom-10 -left-8 h-24 w-24 rounded-full border border-white/10" />
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10">
            <Icon name="leaf" className="h-4 w-4 text-butter-200" />
          </div>
          <p className="mt-3 text-[9px] font-bold uppercase tracking-[0.2em] text-butter-200">
            Tonight&apos;s nudge
          </p>
          <h3 className="mt-1 font-display text-[19px] font-semibold leading-tight text-white">
            {readyCount > 0
              ? `${readyCount} ${readyCount === 1 ? 'recipe is' : 'recipes are'} within reach`
              : selectedCount > 0
                ? 'Keep building your pantry'
                : 'What’s in your fridge?'}
          </h3>
          <p className="mt-1.5 text-[11px] leading-relaxed text-cream-200/75">
            {readyCount > 0
              ? 'You already have everything needed. Dinner is sorted.'
              : selectedCount > 0
                ? `${selectedCount} ingredients picked. Add a few more to unlock dinner.`
                : 'Pick a few ingredients and we’ll rank recipes by what you can make.'}
          </p>
          <button
            type="button"
            onClick={() => go({ view: 'matcher' })}
            className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-cream-50 px-3.5 py-2 text-[11px] font-bold text-olive-700 transition hover:gap-2.5 hover:bg-white"
          >
            Open matcher
            <Icon name="arrowRight" className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="mt-5 space-y-2.5">
        <div className="flex items-center gap-2 rounded-xl border border-cream-200 bg-white/55 px-3 py-2 text-[10px] font-medium text-ink-500">
          <Icon name="database" className="h-3.5 w-3.5 text-ink-400" />
          <span>Prototype · mock relational data</span>
          <span className="ml-auto h-1.5 w-1.5 rounded-full bg-olive-400" />
        </div>

        <button
          type="button"
          onClick={() => go({ view: 'profile' })}
          className="flex w-full items-center gap-2.5 rounded-2xl border border-cream-200 bg-white/70 p-2.5 text-left transition hover:border-cream-300 hover:bg-white"
        >
          <Avatar name={user.username} size="sm" />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[12px] font-bold text-ink-900">
              {user.username}
            </span>
            <span className="block truncate text-[10px] text-ink-400">{user.email}</span>
          </span>
          <Icon name="chevronRight" className="h-4 w-4 shrink-0 text-ink-300" />
        </button>
      </div>
    </div>
  )
}

export function Layout({
  route,
  onNavigate,
  user,
  selectedCount,
  readyCount,
  children,
}: LayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    if (!mobileOpen) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [mobileOpen])

  const mobileNav: NavItem[] = [
    { view: 'dashboard', label: 'Discover', icon: 'home' },
    { view: 'matcher', label: 'Match', icon: 'search' },
    { view: 'admin', label: 'Add', icon: 'plus' },
    { view: 'profile', label: 'Account', icon: 'user' },
  ]
  const activeView: ViewName = route.view === 'recipe' ? 'dashboard' : route.view

  return (
    <div className="min-h-dvh bg-cream-50">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[272px] border-r border-cream-200 bg-cream-100/80 backdrop-blur-xl lg:block">
        <SidebarContent
          route={route}
          onNavigate={onNavigate}
          user={user}
          selectedCount={selectedCount}
          readyCount={readyCount}
        />
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-ink-900/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <aside className="animate-drawer-in absolute inset-y-0 left-0 w-[294px] max-w-[86vw] border-r border-cream-200 bg-cream-100 shadow-lift">
            <SidebarContent
              route={route}
              onNavigate={onNavigate}
              user={user}
              selectedCount={selectedCount}
              readyCount={readyCount}
              onClose={() => setMobileOpen(false)}
            />
          </aside>
        </div>
      )}

      <div className="lg:pl-[272px]">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-cream-200/80 bg-cream-50/90 px-4 backdrop-blur-xl lg:hidden">
          <div className="flex min-w-0 items-center gap-2.5">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-cream-200 bg-white text-ink-700 transition hover:bg-cream-100"
              aria-label="Open menu"
            >
              <Icon name="menu" className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate({ view: 'dashboard' })}
              className="flex min-w-0 items-center gap-2"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-paprika-500 text-white">
                <Icon name="chefHat" className="h-5 w-5" />
              </span>
              <span className="hidden truncate font-display text-lg font-semibold text-ink-900 min-[380px]:inline">
                Fridge &amp; Fork
              </span>
            </button>
          </div>
          <button
            type="button"
            onClick={() => onNavigate({ view: 'profile' })}
            className="shrink-0"
            aria-label="Open profile"
          >
            <Avatar name={user.username} size="sm" />
          </button>
        </header>

        <header className="sticky top-0 z-30 hidden h-[72px] border-b border-cream-200/80 bg-cream-50/85 backdrop-blur-xl lg:block">
          <div className="flex h-full items-center justify-between gap-6 px-8 xl:px-10">
            <div className="flex items-center gap-2 text-[13px]">
              <span className="text-ink-400">Kitchen</span>
              <Icon name="chevronRight" className="h-3.5 w-3.5 text-ink-300" />
              <span className="font-semibold text-ink-700">{viewMeta[route.view].crumb}</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-cream-200 bg-white/75 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-ink-500">
                <Icon name="database" className="h-3.5 w-3.5 text-ink-400" />
                Demo data
              </span>
              <span className="h-6 w-px bg-cream-200" />
              <button
                type="button"
                onClick={() => onNavigate({ view: 'profile' })}
                className="flex items-center gap-2.5 rounded-full py-1 pl-1 pr-3 transition hover:bg-white"
              >
                <Avatar name={user.username} size="sm" />
                <span className="text-left">
                  <span className="block text-[12px] font-bold leading-tight text-ink-900">
                    {user.username}
                  </span>
                  <span className="block text-[10px] leading-tight text-ink-400">Home cook</span>
                </span>
              </button>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1320px] px-4 pb-28 pt-6 sm:px-6 lg:px-10 lg:pb-16 lg:pt-9">
          {children}
        </main>
      </div>

      <nav
        className="fixed inset-x-0 bottom-0 z-40 border-t border-cream-200 bg-white/95 backdrop-blur-xl lg:hidden"
        aria-label="Mobile navigation"
      >
        <div className="grid grid-cols-4 px-2 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-1.5">
          {mobileNav.map((item) => {
            const active = activeView === item.view
            return (
              <button
                key={item.view}
                type="button"
                onClick={() => onNavigate({ view: item.view })}
                aria-current={active ? 'page' : undefined}
                className={`flex flex-col items-center gap-0.5 rounded-xl px-1 py-1.5 transition ${
                  active ? 'text-paprika-600' : 'text-ink-400 hover:text-ink-700'
                }`}
              >
                <span
                  className={`flex h-8 w-12 items-center justify-center rounded-lg transition ${
                    active ? 'bg-paprika-50' : ''
                  }`}
                >
                  <Icon name={item.icon} className="h-[19px] w-[19px]" strokeWidth={active ? 2.1 : 1.8} />
                </span>
                <span className="text-[9px] font-bold uppercase tracking-[0.08em]">{item.label}</span>
              </button>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
