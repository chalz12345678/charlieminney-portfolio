'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'
import { asset } from '@/lib/asset'
import type { Project } from '@/lib/content'

const pad = (n: number) => String(n).padStart(2, '0')

// A stack of sticky cards: each new card slides up over the last,
// which tips back, shrinks and dims like the deck behind it.
export default function ProjectDeck({ projects }: { projects: Project[] }) {
  const deck = useRef<HTMLOListElement>(null)

  useEffect(() => {
    const el = deck.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const cards = [...el.querySelectorAll<HTMLElement>('.deck__card')]
    let frame = 0

    const update = () => {
      frame = 0
      cards.forEach((card, n) => {
        const next = cards[n + 1]
        if (!next) return
        const rect = card.getBoundingClientRect()
        const nextTop = next.getBoundingClientRect().top
        // 0 while the next card is below, 1 once it fully covers this one
        const covered = Math.min(1, Math.max(0, (rect.bottom - nextTop) / rect.height))
        // cards further back in the stack recede more
        const depth = Math.min(1, covered)
        card.style.setProperty('--covered', depth.toFixed(4))
      })
    }

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <ol className="deck wrap" ref={deck}>
      {projects.map((p, n) => (
        <li key={p.slug} className="deck__slot" style={{ '--n': n } as React.CSSProperties}>
          <Link href={`/work/${p.slug}/`} className="deck__card">
            <div className="deck__info">
              <div className="deck__count mono">
                <span className="accent">{pad(n + 1)}</span>
                <span className="muted"> / {pad(projects.length)}</span>
              </div>
              <div>
                <h3 className="deck__title">{p.title}</h3>
                <p className="deck__summary">{p.summary}</p>
              </div>
              <ul className="tags">
                {p.tags.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
              <span className="deck__cta">
                View project <span aria-hidden="true">→</span>
              </span>
            </div>
            <div className="deck__media">
              <img src={asset(p.cover.src)} alt={p.cover.alt} loading={n < 2 ? 'eager' : 'lazy'} />
            </div>
          </Link>
        </li>
      ))}
    </ol>
  )
}
