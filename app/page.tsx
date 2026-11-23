import Link from 'next/link'
import Experience from '@/components/Experience'
import { asset } from '@/lib/asset'
import { experience, profile, projects, skills } from '@/lib/content'

const pad = (n: number) => String(n).padStart(2, '0')

export default function Home() {
  const current = experience[0]
  const featured = projects[0]

  return (
    <>
      <section className="hero" data-enter>
        <div className="wrap hero__inner">
          <div className="hero__top mono">
            <span style={{ '--i': 0 } as React.CSSProperties}>{profile.role}</span>
            <span style={{ '--i': 1 } as React.CSSProperties}>{profile.location}</span>
          </div>
          <div className="hero__mid">
            <h1 className="hero__name" style={{ '--i': 1 } as React.CSSProperties}>
              {profile.name}
            </h1>
            <Link
              href={`/work/${featured.slug}/`}
              className="hero__feature"
              style={{ '--i': 2 } as React.CSSProperties}
            >
              <div className="hero__feature-media">
                <img src={asset(featured.cover.src)} alt={featured.cover.alt} />
              </div>
              <span className="mono hero__feature-label">
                <span className="muted">Featured</span>
                <span>{featured.title} →</span>
              </span>
            </Link>
          </div>
          <div className="hero__foot">
            <p className="hero__intro" style={{ '--i': 2 } as React.CSSProperties}>
              {profile.intro}
            </p>
            <div className="hero__side" style={{ '--i': 3 } as React.CSSProperties}>
              <p className="hero__now">
                <span className="dot" aria-hidden="true" />
                <span>
                  {current.role}, {current.company}
                  <span className="muted"> · {current.years}</span>
                </span>
              </p>
              <div className="actions">
                <Link href="/#work" className="btn">
                  View projects
                </Link>
                <a className="btn btn--ghost" href={profile.resume} target="_blank" rel="noreferrer">
                  Resume <span aria-hidden="true">↗</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="work" className="section">
        <div className="wrap">
          <div className="section__head">
            <h2>Projects</h2>
            <span className="mono muted">{pad(projects.length)} builds</span>
          </div>
          <ul className="work">
            {projects.map((p, i) => (
              <li key={p.slug}>
                <Link href={`/work/${p.slug}/`} className="card">
                  <div className="card__media">
                    <img src={asset(p.cover.src)} alt={p.cover.alt} loading={i < 2 ? 'eager' : 'lazy'} />
                  </div>
                  <div className="card__meta">
                    <span className="mono muted">{pad(i + 1)}</span>
                    <div>
                      <h3 className="card__title">{p.title}</h3>
                      <p className="card__summary">{p.summary}</p>
                      <ul className="tags">
                        {p.tags.map((t) => (
                          <li key={t}>{t}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="experience" className="section">
        <div className="wrap">
          <div className="section__head">
            <h2>Experience</h2>
            <span className="mono muted">2019 – now</span>
          </div>
          <Experience jobs={experience} />
        </div>
      </section>

      <section id="skills" className="section">
        <div className="wrap">
          <div className="section__head">
            <h2>Skills</h2>
          </div>
          <ul className="skills">
            {skills.map((s, i) => (
              <li key={s.name} className="skill">
                <span className="mono muted">{pad(i + 1)}</span>
                <h3>{s.name}</h3>
                <p>{s.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="about" className="section">
        <div className="wrap about">
          <div className="about__photo">
            <img src={asset(profile.portrait)} alt="Charlie standing by a glacial lake with mountains behind" loading="lazy" />
          </div>
          <div className="about__text">
            <h2>About me</h2>
            {profile.about.map((p) => (
              <p key={p.slice(0, 20)}>{p}</p>
            ))}
            <Link href="/art/" className="link about__art">
              See my artwork <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
