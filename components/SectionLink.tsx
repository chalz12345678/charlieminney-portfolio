'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { scrollToId } from '@/lib/lenis'

type Props = {
  id: string // section id, e.g. "about"
  className?: string
  style?: React.CSSProperties
  onNavigate?: () => void
  children: React.ReactNode
}

// Links to a section without leaving "#id" in the address bar,
// so reloading the page starts at the top.
export default function SectionLink({ id, className, style, onNavigate, children }: Props) {
  const pathname = usePathname()
  const router = useRouter()
  // the footer is on every page, so #contact scrolls in place everywhere
  const href = id === 'contact' ? '#contact' : `/#${id}`

  const onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
    e.preventDefault()
    onNavigate?.()
    if ((pathname === '/' || id === 'contact') && scrollToId(id)) return
    router.push(`/#${id}`, { scroll: false })
  }

  return (
    <Link href={href} className={className} style={style} onClick={onClick} scroll={false}>
      {children}
    </Link>
  )
}
