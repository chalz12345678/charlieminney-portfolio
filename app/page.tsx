import Link from 'next/link'
import Experience from '@/components/Experience'
import ProjectDeck from '@/components/ProjectDeck'
import { asset } from '@/lib/asset'
import { experience, profile, projects, skills } from '@/lib/content'

const pad = (n: number) => String(n).padStart(2, '0')
const i = (n: number) => ({ '--i': n }) as React.CSSProperties

export default function Home() {
  const featured = projects[0]
  const [first, ...rest] = profile.name.split(' ')

  return (
    <>
      <section className="hero" data-enter>
        <div className="hero__glow" aria-hidden="true">
          <span className="blob blob--a" data-speed="0.25" />
          <span className="blob blob--b" data-speed="-0.15" />
        </div>
        <div className="wrap hero__inner">
          <div className="hero__top mono">
            <span style={i(0)}>{profile.role}</span>
            <span style={i(1)}>{profile.location}</span>
          </div>
          <div className="hero__mid">
            <h1 className="hero__name" aria-label={profile.name}>
              <span className="hero__line" data-drift="-1" aria-hidden="true">
                <span style={i(1)}>{first}</span>
              </span>
              <span className="hero__line hero__line--indent" data-drift="1" aria-hidden="true">
                <span style={i(2)}>
                  {rest.join(' ')}
                  <span className="accent">.</span>
                </span>
              </span>
            </h1>
            <Link href={`/work/${featured.slug}/`} className="hero__feature" style={i(3)} data-speed="-0.12">
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
            <p className="hero__intro" style={i(3)}>
              {profile.intro}
            </p>
            <div className="actions hero__actions" style={i(4)}>
              <Link href="/#work" className="btn">
                View projects
              </Link>
              <a className="btn btn--ghost" href={profile.resume} target="_blank" rel="noreferrer">
                Resume <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </div>
        <span className="scroll-cue mono" aria-hidden="true">
          Scroll
        </span>
      </section>

      <section id="work" className="section section--deck">
        <div className="wrap">
          <div className="section__head">
            <h2 data-reveal="text">
              <span>
                Projects<span className="accent">.</span>
              </span>
            </h2>
            <span className="mono muted">{pad(projects.length)} builds · scroll to flip</span>
          </div>
        </div>
        <ProjectDeck projects={projects} />
      </section>

      <section id="experience" className="section">
        <div className="wrap">
          <div className="section__head">
            <h2 data-reveal="text">
              <span>
                Experience<span className="accent">.</span>
              </span>
            </h2>
            <span className="mono muted">2019 – now</span>
          </div>
          <Experience jobs={experience} />
        </div>
      </section>

      <section id="skills" className="section">
        <div className="wrap">
          <div className="section__head">
            <h2 data-reveal="text">
              <span>
                Skills<span className="accent">.</span>
              </span>
            </h2>
          </div>
          <ul className="skills" data-reveal="stagger">
            {skills.map((s, n) => (
              <li key={s.name} className="skill" style={i(n)}>
                <span className="mono skill__num">{pad(n + 1)}</span>
                <h3>{s.name}</h3>
                <p>{s.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="about" className="section">
        <div className="wrap about">
          <div className="about__photo" data-reveal="image">
            <img
              src={asset(profile.portrait)}
              alt="Charlie standing by a glacial lake with mountains behind"
              loading="lazy"
              data-speed="-0.08"
            />
          </div>
          <div className="about__text">
            <h2 data-reveal="text">
              <span>
                About me<span className="accent">.</span>
              </span>
            </h2>
            {profile.about.map((p) => (
              <p key={p.slice(0, 20)} data-reveal="fade">
                {p}
              </p>
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
