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
// While pinned, arrow keys step between cards, and clicking a side card glides it to the centre.
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

    const scrolled = () => -el.getBoundingClientRect().top
    const pinned = () => {
      const r = el.getBoundingClientRect()
      return r.top <= 2 && r.bottom >= window.innerHeight - 2
    }

    const update = () => {
      frame = 0
      const p = clamp(scrolled() / step, 0, n - 1)
      const w = cards[0].offsetWidth
      cards.forEach((card, i) => {
        const d = i - p
        const a = Math.abs(d)
        const s = Math.sign(d)
        const near = Math.min(a, 1) // 0 at centre, 1 once it's the first side card
        const far = Math.max(a - 1, 0) // how deep into the side stack
        const x = s * (near * w * 0.92 + far * w * 0.3)
        const z = -(near * 140 + far * 60)
        card.style.transform = `translate3d(${x.toFixed(1)}px,0,${z.toFixed(1)}px) rotateY(${(s * near * 45).toFixed(2)}deg)`
        card.style.zIndex = String(100 - Math.round(a * 10))
        card.style.setProperty('--dim', Math.min(0.9, near * 0.25 + far * 0.18).toFixed(3))
        card.style.opacity = String(clamp(4 - a, 0, 1))
      })
      const idx = Math.round(p)
      if (idx !== current) {
        current = idx
        setActive(idx)
      }
    }

    const go = (i: number) => {
      const target = el.getBoundingClientRect().top + window.scrollY + clamp(i, 0, n - 1) * step
      const lenis = getLenis()
      const dist = Math.abs(i - scrolled() / step)
      if (lenis) lenis.scrollTo(target, { duration: Math.min(1.4, 0.7 + dist * 0.15), easing: (t) => 1 - Math.pow(1 - t, 4) })
      else window.scrollTo({ top: target, behavior: 'smooth' })
    }
    goTo.current = go

    const measure = () => {
      step = Math.round(window.innerHeight * 0.5)
      el.style.height = `${window.innerHeight + step * (n - 1)}px`
      update()
    }

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
      // settle on the nearest card once scrolling stops
      clearTimeout(idle)
      idle = window.setTimeout(() => {
        if (!pinned()) return
        const p = scrolled() / step
        if (Math.abs(p - Math.round(p)) > 0.02) go(Math.round(p))
      }, 180)
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
      if (!pinned() || (e.target as HTMLElement).closest?.('input, textarea')) return
      e.preventDefault()
      go(current + (e.key === 'ArrowRight' ? 1 : -1))
    }

    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', measure)
    window.addEventListener('keydown', onKey)
    return () => {
      el.style.height = ''
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', measure)
      window.removeEventListener('keydown', onKey)
      cancelAnimationFrame(frame)
      clearTimeout(idle)
    }
  }, [n])

  const p = projects[active]

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
                onFocus={() => i !== active && goTo.current(i)}
              >
                <img src={asset(proj.cover.src)} alt={proj.cover.alt} loading={i < 3 ? 'eager' : 'lazy'} />
                <div className="flow__overlay">
                  <p>{proj.summary}</p>
                  <span className="mono flow__cta">
                    View project <span aria-hidden="true">→</span>
                  </span>
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
          <div key={active} className="flow__text" aria-live="polite">
            <span className="mono flow__count">
              {pad(active + 1)} / {pad(n)} · {p.context}
            </span>
            <h3 className="flow__title">
              <Link href={`/work/${p.slug}/`}>{p.title}</Link>
            </h3>
          </div>
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
