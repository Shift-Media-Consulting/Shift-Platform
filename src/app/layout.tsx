import type { Metadata } from 'next'
import '@/styles/globals.css'

export const metadata: Metadata = {
  icons: {
    icon: '/logo-mark.svg',
    shortcut: '/logo-mark.svg',
    apple: '/logo-mark.svg',
  },
  openGraph: {
    siteName: 'shift.media',
    locale: 'de_DE',
    alternateLocale: 'en_US',
    type: 'website',
    images: [{ url: 'https://shift-media.io/opengraph-image', width: 1200, height: 630, alt: 'shift.media' }],
  },
  twitter: { card: 'summary_large_image', images: ['https://shift-media.io/opengraph-image'] },
}

const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Shift Media GbR',
  url: 'https://shift-media.io',
  logo: 'https://shift-media.io/logo-mark.svg',
  description: 'Independent production advisory and production controlling for brands. Hamburg, Germany.',
  address: { '@type': 'PostalAddress', addressLocality: 'Hamburg', addressCountry: 'DE' },
  contactPoint: { '@type': 'ContactPoint', email: 'hello@shift-media.io', contactType: 'customer service' },
  sameAs: ['https://shift-media.io'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // suppressHydrationWarning: lang attr is set client-side by LangSetter
    // inside the [locale] layout, after hydration.
    <html suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;500&family=Onest:wght@400;500;700&family=Newsreader:ital,wght@1,700&display=swap"
          rel="stylesheet"
        />
      </head>
      {/* Dark teal prevents flash of white before IntroAnimation mounts */}
      <body style={{ background: '#004d40' }}>{children}</body>
    </html>
  )
}
