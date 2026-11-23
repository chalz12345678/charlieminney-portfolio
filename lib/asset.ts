// Plain <img> tags don't get Next's basePath, so prefix public files by hand.
export const asset = (path: string) => `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}${path}`
