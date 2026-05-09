import type { Metadata } from 'next'
import '@/styles/globals.css'

export const metadata: Metadata = {
  icons: {
    icon: '/logo-mark.svg',
    shortcut: '/logo-mark.svg',
    apple: '/logo-mark.svg',
  },
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
