'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

const links = [
  { href: '/#work', label: 'Work' },
  { href: '/#experience', label: 'Experience' },
  { href: '/#about', label: 'About' },
  { href: '/art/', label: 'Art' },
  { href: '#contact', label: 'Contact' },
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

  return (
    <header className="nav">
      <div className="wrap nav__row">
        <Link href="/" className="nav__mark" aria-label="Charlie Minney, home">
          Charlie Minney
        </Link>
        <nav className="nav__links" aria-label="Main">
          {links.map((l) => (
            <Link key={l.label} href={l.href} className="link">
              {l.label}
            </Link>
          ))}
        </nav>
        <button
          className="nav__toggle"
          aria-expanded={open}
          aria-controls="menu"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? 'Close' : 'Menu'}
        </button>
      </div>
      <div id="menu" className="menu" data-open={open} hidden={!open}>
        <nav className="wrap menu__links" aria-label="Mobile">
          {links.map((l, i) => (
            <Link
              key={l.label}
              href={l.href}
              onClick={() => setOpen(false)}
              style={{ '--i': i } as React.CSSProperties}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
