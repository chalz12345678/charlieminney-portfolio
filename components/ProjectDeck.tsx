'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { asset } from '@/lib/asset'
import type { Project } from '@/lib/content'
import { getLenis } from '@/lib/lenis'

const pad = (n: number) => String(n).padStart(2, '0')
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))

// Coverflow: the section pins to the screen and scrolling down moves through
// the projects. The centre card faces you; the rest fan back on either side.
// While pinned, arrow keys, sideways swipes, and clicking a side card glide it to the centre.
export default function ProjectDeck({ projects }: { projects: Project[] }) {
  const root = useRef<HTMLDivElement>(null)
  const stage = useRef<HTMLOListElement>(null)
  const goTo = useRef<(i: number) => void>(() => {})
  const [active, setActive] = useState(0)
  const n = projects.length

  useEffect(() => {
    const el = root.current
    const row = stage.current
    if (!el || !row) return
    const cards = [...row.querySelectorAll<HTMLElement>('.flow__card')]
    let step = 0 // scroll distance between two cards
    let current = 0
    let frame = 0
    let idle = 0
    let heading: number | null = null // card a click or arrow key is gliding to
    let headingTimer = 0

    const scrolled = () => -el.getBoundingClientRect().top
    const pinned = () => {
      const r = el.getBoundingClientRect()
      return r.top <= 2 && r.bottom >= window.innerHeight - 2
    }

    const update = () => {
      frame = 0
      const p = clamp(scrolled() / step, 0, n - 1)
      const w = cards[0].offsetWidth
      // measured from the reference: first side card ~1.1 widths out, the rest
      // peek out ~0.23 widths each; tighter on phones so a slice of each side shows
      const narrow = window.innerWidth < 700
      const gapNear = narrow ? 0.78 : 1.09
      const gapFar = narrow ? 0.12 : 0.23
      cards.forEach((card, i) => {
        const d = i - p
        const a = Math.abs(d)
        const s = Math.sign(d)
        const near = Math.min(a, 1) // 0 at centre, 1 once it's the first side card
        const far = Math.max(a - 1, 0) // how deep into the side stack
        const x = s * (near * gapNear + far * gapFar) * w
        const scale = 1 - near * 0.26 - far * 0.02
        card.style.transform = `translate3d(${x.toFixed(1)}px,0,0) scale(${scale.toFixed(3)}) rotateY(${(s * near * 48).toFixed(2)}deg)`
        card.style.zIndex = String(100 - Math.round(a * 10))
        // each card further out fades darker
        card.style.setProperty('--dim', Math.min(0.92, near * 0.08 + far * 0.3).toFixed(3))
        card.style.opacity = String(clamp(4.5 - a, 0, 1))
      })
      const idx = Math.round(p)
      if (idx !== current) {
        current = idx
        setActive(idx)
      }
    }

    const go = (i: number) => {
      // one glide at a time: presses while a card is still moving are ignored
      if (heading !== null) return
      const to = clamp(i, 0, n - 1)
      if (to === Math.round(scrolled() / step) && Math.abs(scrolled() / step - to) < 0.02) return
      const target = el.getBoundingClientRect().top + window.scrollY + to * step
      const dist = Math.abs(to - scrolled() / step)
      const duration = Math.min(1.2, 0.5 + dist * 0.15) // longer for longer trips
      // remember where we're headed so the settle-on-nearest snap can't hijack the glide
      heading = to
      clearTimeout(headingTimer)
      headingTimer = window.setTimeout(() => (heading = null), duration * 1000 + 200)
      const lenis = getLenis()
      if (lenis)
        lenis.scrollTo(target, {
          duration,
          easing: (t) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2),
          onComplete: () => (heading = null),
        })
      else window.scrollTo({ top: target, behavior: 'smooth' })
    }
    goTo.current = go

    const measure = () => {
      // every card as tall as the tallest one's content, so no text gets cut off
      cards.forEach((c) => (c.style.height = ''))
      const h = Math.max(...cards.map((c) => c.offsetHeight))
      cards.forEach((c) => (c.style.height = `${h}px`))
      row.style.height = `${h}px`
      step = Math.round(window.innerHeight * 0.5)
      el.style.height = `${window.innerHeight + step * (n - 1)}px`
      update()
    }

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
      // settle on the nearest card once scrolling stops
      clearTimeout(idle)
      idle = window.setTimeout(() => {
        if (!pinned() || heading !== null) return
        const p = scrolled() / step
        if (Math.abs(p - Math.round(p)) > 0.02) go(Math.round(p))
      }, 180)
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
      if (!pinned() || (e.target as HTMLElement).closest?.('input, textarea')) return
      e.preventDefault()
      go((heading ?? current) + (e.key === 'ArrowRight' ? 1 : -1))
    }

    // sideways trackpad swipe: one card per swipe gesture
    let swipeX = 0
    let lastWheel = 0
    let stepped = false
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return
      e.preventDefault() // also stops the browser's swipe-to-go-back
      e.stopPropagation() // keep the swipe's small vertical drift from reaching smooth scroll and cancelling the glide
      const now = performance.now()
      if (now - lastWheel > 220) {
        swipeX = 0 // a pause means a new swipe
        stepped = false
      }
      lastWheel = now
      swipeX += e.deltaX
      if (!stepped && Math.abs(swipeX) > 40) {
        stepped = true
        go((heading ?? current) + (swipeX > 0 ? 1 : -1))
      }
    }

    // sideways finger swipe on touch screens
    let touchX = 0
    let touchY = 0
    const onTouchStart = (e: TouchEvent) => {
      touchX = e.touches[0].clientX
      touchY = e.touches[0].clientY
    }
    const onTouchEnd = (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - touchX
      const dy = e.changedTouches[0].clientY - touchY
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.2) go((heading ?? current) + (dx < 0 ? 1 : -1))
    }

    measure()
    el.addEventListener('wheel', onWheel, { passive: false })
    row.addEventListener('touchstart', onTouchStart, { passive: true })
    row.addEventListener('touchend', onTouchEnd, { passive: true })
    document.fonts?.ready.then(measure) // text height can change once the font loads
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', measure)
    window.addEventListener('keydown', onKey)
    return () => {
      el.style.height = ''
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', measure)
      window.removeEventListener('keydown', onKey)
      el.removeEventListener('wheel', onWheel)
      row.removeEventListener('touchstart', onTouchStart)
      row.removeEventListener('touchend', onTouchEnd)
      cancelAnimationFrame(frame)
      clearTimeout(idle)
      clearTimeout(headingTimer)
    }
  }, [n])

  return (
    <div className="flow" ref={root}>
      {/* jump target for "View projects": the pinned start, first card centred */}
      <span id="work-cards" className="flow__mark" aria-hidden="true" />
      <div className="flow__sticky">
        <div className="wrap">
          <div className="section__head">
            <h2 data-reveal="text">
              <span>
                Projects<span className="accent">.</span>
              </span>
            </h2>
          </div>
        </div>

        <ol className="flow__stage" ref={stage}>
          {projects.map((proj, i) => (
            <li key={proj.slug} className="flow__card" data-active={i === active}>
              <Link
                href={`/work/${proj.slug}/`}
                className="flow__link"
                aria-label={i === active ? `${proj.title}, view project` : `Show ${proj.title}`}
                onClick={(e) => {
                  if (i !== active) {
                    e.preventDefault()
                    goTo.current(i)
                  }
                }}
                onFocus={(e) => i !== active && e.currentTarget.matches(':focus-visible') && goTo.current(i)}
              >
                <div className="flow__media">
                  <img src={asset(proj.cover.src)} alt={proj.cover.alt} loading={i < 3 ? 'eager' : 'lazy'} />
                  <div className="flow__overlay">
                    <p>{proj.summary}</p>
                    <span className="mono flow__cta">
                      View project <span aria-hidden="true">→</span>
                    </span>
                  </div>
                </div>
                <div className="flow__body">
                  <span className="mono flow__count">
                    <span>
                      {pad(i + 1)} / {pad(n)}
                    </span>
                    <span>{proj.context}</span>
                  </span>
                  <h3 className="flow__title">{proj.title}</h3>
                  <ul className="tags">
                    {proj.tags.slice(0, 3).map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                </div>
              </Link>
            </li>
          ))}
        </ol>

        <div className="wrap flow__info">
          <button
            className="flow__btn"
            aria-label="Previous project"
            disabled={active === 0}
            onClick={() => goTo.current(active - 1)}
          >
            ←
          </button>
          <span className="mono flow__pos" aria-live="polite">
            {pad(active + 1)} / {pad(n)}
          </span>
          <button
            className="flow__btn"
            aria-label="Next project"
            disabled={active === n - 1}
            onClick={() => goTo.current(active + 1)}
          >
            →
          </button>
        </div>
      </div>
    </div>
  )
}
