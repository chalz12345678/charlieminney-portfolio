'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import SectionLink from './SectionLink'
import { profile } from '@/lib/content'

type Item = { label: string } & ({ id: string } | { href: string })

const links: Item[] = [
  { id: 'work', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'about', label: 'About' },
  { href: '/art/', label: 'Art' },
  { id: 'contact', label: 'Contact' },
]

export default function Nav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    document.documentElement.classList.toggle('menu-open', open)
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const item = (l: Item, props: { className?: string; style?: React.CSSProperties; close?: boolean }) =>
    'id' in l ? (
      <SectionLink
        key={l.label}
        id={l.id}
        className={props.className}
        style={props.style}
        onNavigate={props.close ? () => setOpen(false) : undefined}
      >
        {l.label}
      </SectionLink>
    ) : (
      <Link
        key={l.label}
        href={l.href}
        className={props.className}
        style={props.style}
        onClick={props.close ? () => setOpen(false) : undefined}
      >
        {l.label}
      </Link>
    )

  return (
    <>
      <header className="nav" data-menu={open}>
        <div className="wrap nav__row">
          <Link href="/" className="nav__mark" aria-label="Charlie Minney, home">
            Charlie Minney
          </Link>
          <nav className="nav__links" aria-label="Main">
            {links.map((l) => item(l, { className: 'link' }))}
          </nav>
          <button
            className="nav__toggle"
            aria-expanded={open}
            aria-controls="menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((o) => !o)}
          >
            <span className="mono">{open ? 'Close' : 'Menu'}</span>
            <span className="nav__burger" aria-hidden="true">
              <i />
              <i />
            </span>
          </button>
        </div>
      </header>
      <div id="menu" className="menu" data-open={open} hidden={!open}>
        <nav className="wrap menu__links" aria-label="Mobile">
          {links.map((l, i) => (
            <div key={l.label} className="menu__item" style={{ '--i': i } as React.CSSProperties}>
              <span className="mono accent">{String(i + 1).padStart(2, '0')}</span>
              {item(l, { close: true })}
            </div>
          ))}
        </nav>
        <div className="wrap menu__foot" style={{ '--i': links.length } as React.CSSProperties}>
          <a href={`mailto:${profile.email}`} className="link">
            {profile.email}
          </a>
          <div className="menu__social mono">
            <a href={profile.linkedin} target="_blank" rel="noreferrer">
              LinkedIn ↗
            </a>
            <a href={profile.resume} target="_blank" rel="noreferrer">
              Resume ↗
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
