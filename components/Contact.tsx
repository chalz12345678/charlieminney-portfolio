import { profile } from '@/lib/content'
import CopyEmail from './CopyEmail'

export default function Contact() {
  return (
    <footer id="contact" className="contact">
      <div className="wrap">
        <p className="label">Contact</p>
        <h2 className="contact__title">Get in touch</h2>
        <a className="contact__email link" href={`mailto:${profile.email}`}>
          {profile.email}
        </a>
        <div className="actions">
          <CopyEmail email={profile.email} />
          <a className="btn btn--ghost" href={profile.linkedin} target="_blank" rel="noreferrer">
            LinkedIn <span aria-hidden="true">↗</span>
          </a>
          <a className="btn btn--ghost" href={profile.resume} target="_blank" rel="noreferrer">
            Resume <span aria-hidden="true">↗</span>
          </a>
        </div>
        <div className="contact__base mono">
          <span>© {new Date().getFullYear()} {profile.name}</span>
          <span>{profile.location}</span>
        </div>
      </div>
    </footer>
  )
}
