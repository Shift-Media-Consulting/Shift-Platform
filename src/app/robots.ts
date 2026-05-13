import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/api', '/partner', '/client', '/bid', '/(auth)'],
    },
    sitemap: 'https://shift-media.io/sitemap.xml',
  }
}
