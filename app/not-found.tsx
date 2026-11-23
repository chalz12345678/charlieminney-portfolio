import Link from 'next/link'

export default function NotFound() {
  return (
    <section className="hero hero--short">
      <div className="wrap">
        <p className="mono muted">404</p>
        <h1 className="project__title">This page doesn&apos;t exist.</h1>
        <Link href="/" className="btn">
          Back to the homepage
        </Link>
      </div>
    </section>
  )
}
