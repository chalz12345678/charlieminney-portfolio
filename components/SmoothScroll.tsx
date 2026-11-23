'use client'

import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { NAV_OFFSET, setLenis } from '@/lib/lenis'

export default function SmoothScroll() {
  const lenis = useRef<Lenis | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    // Respect reduced motion: native scrolling only.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const instance = new Lenis({ autoRaf: true, lerp: 0.1 })
    lenis.current = instance
    setLenis(instance)
    return () => {
      instance.destroy()
      lenis.current = null
      setLenis(null)
    }
  }, [])

  // New page: start at the top, or at the #section we came for, then drop the
  // #hash from the address so a reload starts at the top again.
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const l = lenis.current
      const hash = window.location.hash
      const target = hash ? document.getElementById(decodeURIComponent(hash.slice(1))) : null
      // Lenis caches the previous page's height; re-measure before jumping.
      l?.resize()
      if (l) l.scrollTo(target ?? 0, { immediate: true, force: true, offset: target ? NAV_OFFSET : 0 })
      else if (target) window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY + NAV_OFFSET })
      if (hash) history.replaceState(history.state, '', window.location.pathname + window.location.search)
    })
    return () => cancelAnimationFrame(frame)
  }, [pathname])

  return null
}
