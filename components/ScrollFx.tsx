'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

// Scroll effects for the whole site:
// - [data-reveal] elements animate in once when they enter the viewport
// - [data-speed] elements drift at a fraction of the scroll (parallax)
// - [data-drift] hero lines slide apart as the hero scrolls away
export default function ScrollFx() {
  const pathname = usePathname()

  useEffect(() => {
    const root = document.documentElement
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      root.classList.remove('fx')
      return
    }
    root.classList.add('fx')

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('is-in')
            io.unobserve(e.target)
          }
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.05 }
    )
    // project pages show everything at once, no scroll reveals
    const still = pathname.startsWith('/work/')
    document
      .querySelectorAll('[data-reveal]:not(.is-in)')
      .forEach((el) => (still ? el.classList.add('is-in') : io.observe(el)))

    const speeds = [...document.querySelectorAll<HTMLElement>('[data-speed]')]
    const drifts = [...document.querySelectorAll<HTMLElement>('[data-drift]')]
    let frame = 0
    let lastDrift = -1
    const update = () => {
      frame = 0
      const y = window.scrollY
      const vh = window.innerHeight
      // read every position first, then write, so the browser lays out once per frame
      const moves: [HTMLElement, string][] = []
      for (const el of speeds) {
        // offset from the parent's distance to the viewport centre, so it works anywhere on the page
        const r = (el.parentElement ?? el).getBoundingClientRect()
        if (r.bottom < -vh || r.top > vh * 2) continue
        const fromCentre = r.top + r.height / 2 - vh / 2
        moves.push([el, `${(-fromCentre * Number(el.dataset.speed)).toFixed(1)}px`])
      }
      for (const [el, v] of moves) el.style.setProperty('--py', v)
      // the hero name drift only changes inside the first screen; skip it everywhere else
      const p = Math.round(Math.min(1, y / vh) * 1000) / 1000
      if (p !== lastDrift) {
        lastDrift = p
        for (const el of drifts) {
          el.style.setProperty('--dx', `${(p * 18 * Number(el.dataset.drift)).toFixed(2)}vw`)
          el.style.setProperty('--fade', (1 - p * 0.9).toFixed(3))
        }
      }
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      io.disconnect()
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [pathname])

  return null
}
