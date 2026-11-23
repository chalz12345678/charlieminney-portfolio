import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import Nav from '@/components/Nav'
import Contact from '@/components/Contact'
import SmoothScroll from '@/components/SmoothScroll'
import { profile } from '@/lib/content'
import './globals.css'

const sans = Geist({ subsets: ['latin'], variable: '--font-sans' })
const mono = Geist_Mono({ subsets: ['latin'], variable: '--font-mono' })

export const metadata: Metadata = {
  title: { default: `${profile.name} | ${profile.role}`, template: `%s | ${profile.name}` },
  description: profile.intro,
  openGraph: { title: profile.name, description: profile.intro, type: 'website' },
}

export const viewport: Viewport = { themeColor: '#0a0a0a' }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`}>
      <body>
        <a href="#main" className="skip">
          Skip to content
        </a>
        <SmoothScroll />
        <Nav />
        <main id="main">{children}</main>
        <Contact />
      </body>
    </html>
  )
}
