import type { MetadataRoute } from 'next'

const BASE_URL = 'https://shift-media.io'

const ROUTES = ['', '/about', '/services', '/method', '/workshops', '/pilot', '/contact', '/team']

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = []

  for (const route of ROUTES) {
    const isHome = route === ''
    const priority = isHome ? 1.0 : 0.8

    // DE (primary, no prefix)
    entries.push({
      url: `${BASE_URL}${route}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority,
    })

    // EN (prefixed)
    entries.push({
      url: `${BASE_URL}/en${route}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority,
    })
  }

  return entries
}
