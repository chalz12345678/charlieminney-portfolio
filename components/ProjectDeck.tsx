'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'
import { asset } from '@/lib/asset'
import type { Project } from '@/lib/content'

const pad = (n: number) => String(n).padStart(2, '0')

// A row of cards pinned to the screen: scrolling down slides the row sideways.
// Each card lifts toward the centre and its photo drifts slightly against the motion.
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
    let distance = 0
    let frame = 0

    const measure = () => {
      distance = Math.max(0, row.scrollWidth - row.clientWidth)
      el.style.height = `${window.innerHeight + distance}px`
      update()
    }

    const update = () => {
      frame = 0
      const top = el.getBoundingClientRect().top
      const p = distance ? Math.min(1, Math.max(0, -top / distance)) : 0
      row.style.setProperty('--x', `${(-p * distance).toFixed(1)}px`)
      const mid = window.innerWidth / 2
      cards.forEach((card) => {
        const r = card.getBoundingClientRect()
        // -1 when a card sits a full screen-half left of centre, +1 to the right
        const off = Math.max(-1, Math.min(1, (r.left + r.width / 2 - mid) / mid))
        card.style.setProperty('--off', off.toFixed(4))
        card.style.setProperty('--abs', Math.abs(off).toFixed(4))
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
            <span className="mono muted">{pad(projects.length)} builds · scroll to browse</span>
          </div>
        </div>
        <ol className="rail__track" ref={track}>
          {projects.map((p, n) => (
            <li key={p.slug} className="rail__card">
              <Link href={`/work/${p.slug}/`} className="rail__link">
                <div className="rail__media">
                  <img src={asset(p.cover.src)} alt={p.cover.alt} loading={n < 3 ? 'eager' : 'lazy'} />
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
