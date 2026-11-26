'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'
import { asset } from '@/lib/asset'
import type { Project } from '@/lib/content'

const pad = (n: number) => String(n).padStart(2, '0')

// Cards start stacked like a deck in the middle of the screen. Scrolling down
// deals them out one by one into a row, then slides the row sideways.
const ease = (t: number) => 1 - Math.pow(1 - t, 3)
const clamp = (t: number) => Math.min(1, Math.max(0, t))
// slight, fixed tilt per card so the stack's edges show
const tilt = [-2.5, 3, -4, 2, -1.5, 4.5, -3, 1]

export default function ProjectDeck({ projects }: { projects: Project[] }) {
  const root = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLOListElement>(null)

  useEffect(() => {
    const el = root.current
    const row = track.current
    if (!el || !row) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    el.classList.add('rail--pinned')
    const cards = [...row.querySelectorAll<HTMLElement>('.rail__card')]
    const n = cards.length
    const stagger = 0.28 // how far apart each card is dealt
    let deal = 0 // scroll distance spent dealing the stack
    let slide = 0 // scroll distance spent sliding the row
    let home: number[] = [] // how far each card sits from the stack centre
    let frame = 0

    const measure = () => {
      const vw = window.innerWidth
      home = cards.map((c, i) => vw / 2 - c.offsetWidth / 2 - c.offsetLeft + (i - (n - 1) / 2) * 6)
      slide = Math.max(0, row.scrollWidth - row.clientWidth)
      deal = window.innerHeight * 1.1
      el.style.height = `${window.innerHeight + deal + slide}px`
      update()
    }

    const update = () => {
      frame = 0
      const scrolled = -el.getBoundingClientRect().top
      const d = clamp(scrolled / deal)
      const x = -clamp((scrolled - deal) / (slide || 1)) * slide
      row.style.setProperty('--x', `${x.toFixed(1)}px`)
      const mid = window.innerWidth / 2
      cards.forEach((card, i) => {
        // top card (01) leaves first, the rest follow
        const e = ease(clamp(d * (1 + stagger * (n - 1)) - stagger * i))
        const left = 1 - e
        card.style.setProperty('--tx', `${(home[i] * left).toFixed(1)}px`)
        card.style.setProperty('--rot', `${(tilt[i % tilt.length] * left).toFixed(2)}deg`)
        card.style.setProperty('--lift', `${(Math.sin(e * Math.PI) * -28).toFixed(1)}px`)
        const centre = card.offsetLeft + x + home[i] * left + card.offsetWidth / 2
        card.style.setProperty('--off', Math.max(-1, Math.min(1, (centre - mid) / mid)).toFixed(4))
      })
    }

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', measure)
    return () => {
      el.classList.remove('rail--pinned')
      el.style.height = ''
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', measure)
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div className="rail" ref={root}>
      <div className="rail__sticky">
        <div className="wrap">
          <div className="section__head">
            <h2 data-reveal="text">
              <span>
                Projects<span className="accent">.</span>
              </span>
            </h2>
          </div>
        </div>
        <ol className="rail__track" ref={track}>
          {projects.map((p, n) => (
            <li key={p.slug} className="rail__card" style={{ zIndex: projects.length - n }}>
              <Link href={`/work/${p.slug}/`} className="rail__link">
                <div className="rail__media">
                  {p.cover2 ? (
                    <div className="rail__split">
                      {[p.cover, p.cover2].map((c, k) => (
                        <div key={c.src}>
                          <img src={asset(c.src)} alt={c.alt} loading="lazy" />
                          <span className="mono rail__part">
                            {String.fromCharCode(65 + k)} · {p.parts?.[k]?.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <img src={asset(p.cover.src)} alt={p.cover.alt} loading={n < 3 ? 'eager' : 'lazy'} />
                  )}
                  <div className="rail__overlay">
                    <p>{p.summary}</p>
                    <span className="rail__cta mono">
                      View project <span aria-hidden="true">→</span>
                    </span>
                  </div>
                </div>
                <div className="rail__info">
                  <span className="mono rail__count">
                    <span className="accent">{pad(n + 1)}</span>
                    <span className="muted"> / {pad(projects.length)}</span>
                  </span>
                  <h3 className="rail__title">{p.title}</h3>
                  <p className="rail__summary">{p.summary}</p>
                  <ul className="tags">
                    {p.tags.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                </div>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
