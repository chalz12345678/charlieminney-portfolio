import type { Metadata } from 'next'
import Link from 'next/link'
import { asset } from '@/lib/asset'
import { artwork } from '@/lib/content'

export const metadata: Metadata = { title: artwork.title, description: artwork.intro }

export default function ArtPage() {
  return (
    <article className="art">
      <header className="wrap art__head" data-enter>
        <Link href="/" className="back-arrow" aria-label="Back to the homepage" style={{ '--i': 0 } as React.CSSProperties}>
          <span aria-hidden="true">←</span>
          <span className="mono">Back</span>
        </Link>
        <p className="mono muted" style={{ '--i': 0 } as React.CSSProperties}>
          Outside engineering
        </p>
        <h1 style={{ '--i': 1 } as React.CSSProperties}>
          {artwork.title}<span className="accent">.</span>
        </h1>
        <p className="project__summary" style={{ '--i': 2 } as React.CSSProperties}>
          {artwork.intro}
        </p>
      </header>
      <div className="wrap">
        <ul className="masonry">
          {artwork.pieces.map((a, i) => (
            <li key={a.src} data-reveal="image" style={{ '--i': i % 3 } as React.CSSProperties}>
              <img src={asset(a.src)} alt={a.alt} loading={i < 3 ? 'eager' : 'lazy'} />
            </li>
          ))}
        </ul>
      </div>
    </article>
  )
}
