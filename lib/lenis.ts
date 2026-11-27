import type Lenis from 'lenis'

// The one Lenis instance, shared so links can scroll smoothly without touching the URL.
let instance: Lenis | null = null

export const setLenis = (l: Lenis | null) => {
  instance = l
}

export const getLenis = () => instance

export const NAV_OFFSET = -72

export function scrollToId(id: string) {
  const el = document.getElementById(id)
  if (!el) return false
  if (instance) instance.scrollTo(el, { offset: NAV_OFFSET })
  else window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + NAV_OFFSET })
  return true
}
