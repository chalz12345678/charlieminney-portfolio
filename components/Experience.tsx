'use client'

import { useState } from 'react'
import type { Job } from '@/lib/content'

export default function Experience({ jobs }: { jobs: Job[] }) {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <ol className="jobs">
      {jobs.map((job, i) => {
        const isOpen = open === i
        const id = `job-${i}`
        return (
          <li
            key={job.company}
            className="job"
            data-open={isOpen}
            data-reveal="fade"
            style={{ '--i': i } as React.CSSProperties}
          >
            <button
              className="job__head"
              aria-expanded={isOpen}
              aria-controls={id}
              onClick={() => setOpen(isOpen ? null : i)}
            >
              <span className="job__years mono">{job.years}</span>
              <span className="job__title">
                <span className="job__role">{job.role}</span>
                <span className="job__company">{job.company}</span>
              </span>
              <span className="job__loc mono">{job.location}</span>
              <span className="job__icon" aria-hidden="true" />
            </button>
            <div className="job__body" id={id} role="region" aria-label={`${job.role} at ${job.company}`}>
              <div className="job__inner">
                <div className="job__text">
                  <p className="job__about">{job.about}</p>
                  {job.points.map((p) => (
                    <p key={p.slice(0, 24)}>{p}</p>
                  ))}
                </div>
              </div>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
