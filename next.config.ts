import type { NextConfig } from 'next'

// GitHub Pages serves this repo at /charlieminney-portfolio. The deploy workflow sets
// NEXT_PUBLIC_BASE_PATH; locally it is empty so the dev server runs at "/".
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

const config: NextConfig = {
  output: 'export',
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
}

export default config
