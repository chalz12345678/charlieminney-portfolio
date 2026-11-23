import type { Metadata } from 'next'
import { asset } from '@/lib/asset'
import { artwork } from '@/lib/content'

export const metadata: Metadata = { title: 'Artwork', description: artwork.intro }

export default function ArtPage() {
  return (
    <article className="art">
      <header className="wrap art__head" data-enter>
        <p className="mono muted" style={{ '--i': 0 } as React.CSSProperties}>
          Outside engineering
        </p>
        <h1 style={{ '--i': 1 } as React.CSSProperties}>Artwork</h1>
        <p className="project__summary" style={{ '--i': 2 } as React.CSSProperties}>
          {artwork.intro}
        </p>
      </header>
      <div className="wrap">
        <ul className="masonry">
          {artwork.pieces.map((a, i) => (
            <li key={a.src}>
              <img src={asset(a.src)} alt={a.alt} loading={i < 3 ? 'eager' : 'lazy'} />
            </li>
          ))}
        </ul>
      </div>
    </article>
  )
}
