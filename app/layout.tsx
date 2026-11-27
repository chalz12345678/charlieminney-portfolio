import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import Nav from '@/components/Nav'
import Contact from '@/components/Contact'
import SmoothScroll from '@/components/SmoothScroll'
import ScrollFx from '@/components/ScrollFx'
import { asset } from '@/lib/asset'
import { profile } from '@/lib/content'
import './globals.css'

const sans = Geist({ subsets: ['latin'], variable: '--font-sans' })
const mono = Geist_Mono({ subsets: ['latin'], variable: '--font-mono' })

export const metadata: Metadata = {
  title: { default: `${profile.name} | ${profile.role}`, template: `%s | ${profile.name}` },
  description: profile.intro,
  openGraph: { title: profile.name, description: profile.intro, type: 'website' },
}

export const viewport: Viewport = { themeColor: '#09080c' }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        {/* Turn on scroll effects before first paint so revealed content doesn't flash. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('fx')",
          }}
        />
      </head>
      <body>
        {/* first project's photo, pre-blurred and darkened (public/images/backdrop.jpg), behind the whole site */}
        <div
          className="backdrop"
          aria-hidden="true"
          style={{ backgroundImage: `url(${asset('/images/backdrop.jpg')})` }}
        />
        <a href="#main" className="skip">
          Skip to content
        </a>
        <SmoothScroll />
        <ScrollFx />
        <Nav />
        <main id="main">{children}</main>
        <Contact />
      </body>
    </html>
  )
}
