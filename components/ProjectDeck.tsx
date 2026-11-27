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
    let top = 0 // the section's page offset, cached so scrolling never forces a layout read
    let w = 0 // card width, cached for the same reason
    let narrow = false
    let lastW = 0
    let lastH = 0
    let current = 0
    let frame = 0
    let idle = 0
    let heading: number | null = null // card a click, key or swipe is gliding to
    let headingTimer = 0
    // Visual offset (in cards) added on top of the scroll position. A finger drag moves
    // only this, never the page scroll, so it can't fight the phone's own touch scrolling.
    let offset = 0
    let dragging = false
    let tween = 0

    const scrolled = () => window.scrollY - top
    const pinned = () => {
      const s = scrolled()
      return s >= -2 && s <= step * (n - 1) + 2
    }

    const update = () => {
      frame = 0
      const raw = scrolled() / step + offset
      // rubber-band a little past the first and last card while dragging
      const p = raw < 0 ? raw * 0.3 : raw > n - 1 ? n - 1 + (raw - n + 1) * 0.3 : raw
      const pos = clamp(p, -0.4, n - 0.6)
      // measured from the reference: first side card ~1.1 widths out, the rest
      // peek out ~0.23 widths each; tighter on phones so a slice of each side shows
      const gapNear = narrow ? 0.78 : 1.09
      const gapFar = narrow ? 0.12 : 0.23
      cards.forEach((card, i) => {
        const d = i - pos
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
      const idx = clamp(Math.round(pos), 0, n - 1)
      if (idx !== current) {
        current = idx
        setActive(idx)
      }
    }
    const requestUpdate = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    type Glide = { duration?: number; easing?: (t: number) => number; force?: boolean }
    const inOut = (t: number) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2)
    const out = (t: number) => 1 - (1 - t) ** 3

    const lock = (to: number, seconds: number) => {
      // remember where we're headed so the settle-on-nearest snap can't hijack the glide
      heading = to
      clearTimeout(headingTimer)
      headingTimer = window.setTimeout(() => (heading = null), seconds * 1000 + 200)
    }

    const go = (i: number, opts: Glide = {}) => {
      // one glide at a time: presses while a card is still moving are ignored
      if (heading !== null && !opts.force) return
      const to = clamp(i, 0, n - 1)
      const p = scrolled() / step
      if (to === Math.round(p) && Math.abs(p - to) < 0.02) return
      const duration = opts.duration ?? Math.min(1.2, 0.5 + Math.abs(to - p) * 0.15) // longer for longer trips
      lock(to, duration)
      const target = top + to * step
      const lenis = getLenis()
      if (lenis) lenis.scrollTo(target, { duration, easing: opts.easing ?? inOut, force: true, onComplete: () => (heading = null) })
      else window.scrollTo({ top: target, behavior: 'smooth' })
    }
    goTo.current = go

    // how far a finger or trackpad has to travel to move one card: the distance
    // between the centre card and the first side card, so cards track 1:1
    const spacing = () => w * (narrow ? 0.78 : 1.09)

    const measure = () => {
      // phones fire resize whenever the address bar slides in or out; re-measuring then
      // would jump the page mid-scroll, so only react to real size changes
      const vw = window.innerWidth
      const vh = window.innerHeight
      if (lastW && vw === lastW && Math.abs(vh - lastH) < 160) return
      lastW = vw
      lastH = vh
      narrow = vw < 700
      // every card as tall as the tallest one's content, so no text gets cut off
      cards.forEach((c) => (c.style.height = ''))
      const h = Math.max(...cards.map((c) => c.offsetHeight))
      cards.forEach((c) => (c.style.height = `${h}px`))
      row.style.height = `${h}px`
      w = cards[0].offsetWidth
      step = Math.round(vh * 0.5)
      el.style.height = `${vh + step * (n - 1)}px`
      top = el.getBoundingClientRect().top + window.scrollY
      update()
    }
    // content above (fonts, the experience accordion) can move the section; keep `top` fresh
    const ro = new ResizeObserver(() => {
      top = el.getBoundingClientRect().top + window.scrollY
    })
    ro.observe(document.body)

    const onScroll = () => {
      requestUpdate()
      // settle on the nearest card once scrolling stops
      clearTimeout(idle)
      idle = window.setTimeout(() => {
        if (!pinned() || heading !== null || dragging) return
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

    // sideways trackpad swipe: cards follow the fingers, then settle on the nearest one
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY) || !pinned()) return
      e.preventDefault() // also stops the browser's swipe-to-go-back
      e.stopPropagation() // keep the swipe's small vertical drift away from smooth scroll
      heading = null // the user takes over from any glide in progress
      const y = top + clamp(scrolled() / step + e.deltaX / spacing(), 0, n - 1) * step
      const lenis = getLenis()
      if (lenis) lenis.scrollTo(y, { immediate: true, force: true })
      else window.scrollTo(0, y)
    }

    // sideways finger drag: cards follow the finger 1:1, and a flick carries on with momentum
    let startX = 0
    let startY = 0
    let startPos = 0
    let axis: 'x' | 'y' | null = null
    let samples: { t: number; x: number }[] = []
    const onTouchStart = (e: TouchEvent) => {
      axis = null
      samples = []
      // only when the coverflow is (nearly) pinned on screen
      const s = scrolled()
      if (s < -60 || s > step * (n - 1) + 60) return
      cancelAnimationFrame(tween)
      startX = e.touches[0].clientX
      startY = e.touches[0].clientY
      startPos = scrolled() / step + offset // pick up exactly where the cards are now
      samples = [{ t: performance.now(), x: startX }]
    }
    const onTouchMove = (e: TouchEvent) => {
      if (!samples.length) return
      const x = e.touches[0].clientX
      const dx = x - startX
      const dy = e.touches[0].clientY - startY
      if (!axis) {
        if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return
        axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y' // lock to whichever way the finger first moves
        if (axis === 'x') {
          heading = null
          dragging = true
        }
      }
      if (axis !== 'x') return
      // move the cards only; the page scroll is left alone during the drag
      offset = startPos - dx / spacing() - scrolled() / step
      requestUpdate()
      const now = performance.now()
      samples.push({ t: now, x })
      samples = samples.filter((s) => now - s.t < 100)
    }
    const onTouchEnd = () => {
      const wasX = axis === 'x'
      axis = null
      dragging = false
      if (!wasX) return (samples = [])
      const first = samples[0]
      const last = samples[samples.length - 1]
      const v = last && first && last.t > first.t ? (last.x - first.x) / (last.t - first.t) : 0 // px per ms
      samples = []
      const pos = scrolled() / step + offset
      // project the flick forward, then settle on that card (at most one past where you let go)
      const projected = pos - (v * 200) / spacing()
      const to = clamp(clamp(Math.round(projected), Math.floor(pos) - 1, Math.ceil(pos) + 1), 0, n - 1)
      // Move the page scroll straight to that card. The section is pinned, so this jump is
      // invisible; then ease the visual offset down to zero so the cards glide into place.
      const lenis = getLenis()
      const y = top + to * step
      if (lenis) lenis.scrollTo(y, { immediate: true, force: true })
      else window.scrollTo(0, y)
      offset = pos - to
      const from = offset
      const duration = 0.45 + Math.min(0.35, Math.abs(from) * 0.25)
      lock(to, duration)
      const start = performance.now()
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / (duration * 1000))
        offset = from * (1 - out(t))
        update()
        if (t < 1) tween = requestAnimationFrame(tick)
        else {
          offset = 0
          heading = null
        }
      }
      tween = requestAnimationFrame(tick)
    }

    measure()
    lastW = 0 // let the font-ready pass re-measure once
    document.fonts?.ready.then(measure) // text height can change once the font loads
    el.addEventListener('wheel', onWheel, { passive: false })
    // passive: the browser never waits on this code before scrolling, which keeps
    // vertical scrolling smooth; touch-action: pan-y keeps sideways drags off the page
    row.addEventListener('touchstart', onTouchStart, { passive: true })
    row.addEventListener('touchmove', onTouchMove, { passive: true })
    row.addEventListener('touchend', onTouchEnd, { passive: true })
    row.addEventListener('touchcancel', onTouchEnd, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', measure)
    window.addEventListener('keydown', onKey)
    return () => {
      el.style.height = ''
      ro.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', measure)
      window.removeEventListener('keydown', onKey)
      el.removeEventListener('wheel', onWheel)
      row.removeEventListener('touchstart', onTouchStart)
      row.removeEventListener('touchmove', onTouchMove)
      row.removeEventListener('touchend', onTouchEnd)
      row.removeEventListener('touchcancel', onTouchEnd)
      cancelAnimationFrame(frame)
      cancelAnimationFrame(tween)
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
