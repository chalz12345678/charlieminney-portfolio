'use client'

import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'

export default function SmoothScroll() {
  const lenis = useRef<Lenis | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    // Respect reduced motion: native scrolling only.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const instance = new Lenis({
      autoRaf: true,
      anchors: { offset: -72 },
      lerp: 0.1,
    })
    lenis.current = instance
    return () => {
      instance.destroy()
      lenis.current = null
    }
  }, [])

  // New page: start at the top (or at the hash target) without a smooth glide.
  useEffect(() => {
    const l = lenis.current
    if (!l) return
    // Lenis caches the previous page's height; re-measure after the new page paints,
    // otherwise a jump to /#about from a short page gets clamped partway down.
    const frame = requestAnimationFrame(() => {
      l.resize()
      const hash = window.location.hash
      const target = hash ? document.querySelector<HTMLElement>(hash) : null
      l.scrollTo(target ?? 0, { immediate: true, force: true, offset: target ? -72 : 0 })
    })
    return () => cancelAnimationFrame(frame)
  }, [pathname])

  return null
}
