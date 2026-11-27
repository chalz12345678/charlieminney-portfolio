import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import SectionLink from '@/components/SectionLink'
import { asset } from '@/lib/asset'
import { projects } from '@/lib/content'

const pad = (n: number) => String(n).padStart(2, '0')

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }))
}

export const dynamicParams = false

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const p = projects.find((x) => x.slug === slug)
  return p ? { title: p.title, description: p.summary } : {}
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params
  const index = projects.findIndex((p) => p.slug === slug)
  if (index === -1) notFound()
  const p = projects[index]
  const prev = projects[index - 1]
  const next = projects[index + 1]
  const pairs =
    p.challenges && p.solutions && p.challenges.length === p.solutions.length
      ? p.challenges.map((c, i) => ({ c, s: p.solutions![i] }))
      : null

  return (
    <article className="project">
      <header className="project__head wrap">
        <SectionLink id="work" className="back-arrow" style={{ '--i': 0 } as React.CSSProperties}>
          <span aria-hidden="true">←</span>
          <span className="mono">All projects</span>
        </SectionLink>
        <p className="mono muted" style={{ '--i': 0 } as React.CSSProperties}>
          Project {pad(index + 1)} / {pad(projects.length)} · <span className="accent">{p.context}</span>
        </p>
        <h1 style={{ '--i': 1 } as React.CSSProperties}>
          {p.title}
          <span className="accent">.</span>
        </h1>
        <p className="project__summary" style={{ '--i': 2 } as React.CSSProperties}>
          {p.summary}
        </p>
        <dl className="facts" style={{ '--i': 3 } as React.CSSProperties}>
          {p.facts.map((f) => (
            <div key={f.label}>
              <dt className="mono muted">{f.label}</dt>
              <dd>{f.value}</dd>
            </div>
          ))}
        </dl>
      </header>

      <div className="wrap">
        <div className={p.cover2 ? 'project__cover project__cover--pair' : 'project__cover'}>
          {[p.cover, p.cover2].filter(Boolean).map((c, n) => (
            <figure key={c!.src}>
              <img src={asset(c!.src)} alt={c!.alt} />
              {p.parts?.[n] && (
                <figcaption className="mono">
                  <span className="accent">{String.fromCharCode(65 + n)}</span> {p.parts[n].title}
                </figcaption>
              )}
            </figure>
          ))}
        </div>
      </div>

      {p.overview && (
        <section className="block wrap">
          <h2 className="label">Overview</h2>
          <p className="block__text">
            {p.overview}
          </p>
        </section>
      )}

      {pairs && (
        <section className="block wrap">
          <h2 className="label">Challenges &amp; solutions</h2>
          <ol className="pairs">
            {pairs.map(({ c, s }, i) => (
              <li key={c.title} className="pair">
                <span className="mono muted">{pad(i + 1)}</span>
                <div>
                  <p className="mono pair__kind">Challenge</p>
                  <h3>{c.title}</h3>
                  <p>{c.text}</p>
                </div>
                <div>
                  <p className="mono pair__kind pair__kind--fix">Solution</p>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}

      {p.gallery.length > 0 && (
        <section className="block wrap">
          <h2 className="label">Process</h2>
          <div className="gallery">
            {p.gallery.map((g) => (
              <figure key={g.src}>
                <div className="gallery__frame">
                  <img src={asset(g.src)} alt={g.alt} />
                </div>
                {g.caption && <figcaption>{g.caption}</figcaption>}
              </figure>
            ))}
          </div>
        </section>
      )}

      {p.parts?.map((part, n) => (
        <section key={part.title} className="block wrap part">
          <div className="part__label">
            <span className="mono accent">Project {String.fromCharCode(65 + n)}</span>
            <h2>{part.title}</h2>
          </div>
          <div className="part__body">
            <p className="block__text">{part.text}</p>
        <div className="gallery">
              {part.gallery.map((g) => (
                <figure key={g.src}>
                  <div className="gallery__frame">
                    <img src={asset(g.src)} alt={g.alt} />
                  </div>
                  {g.caption && <figcaption>{g.caption}</figcaption>}
                </figure>
              ))}
            </div>
          </div>
        </section>
      ))}

      {p.link && (
        <div className="wrap block block--tight">
          <span aria-hidden="true" />
          <div>
            <a className="btn" href={p.link.href} target="_blank" rel="noreferrer">
              {p.link.label} <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      )}

      <nav className="wrap pager" aria-label="More projects">
        {prev ? (
          <Link href={`/work/${prev.slug}/`} className="pager__link">
            <span className="mono muted">← Previous</span>
            <span className="pager__title">{prev.title}</span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={`/work/${next.slug}/`} className="pager__link pager__link--next">
            <span className="mono muted">Next →</span>
            <span className="pager__title">{next.title}</span>
          </Link>
        ) : (
          <Link href="/art/" className="pager__link pager__link--next">
            <span className="mono muted">Next →</span>
            <span className="pager__title">Art &amp; Photography</span>
          </Link>
        )}
      </nav>
    </article>
  )
}
