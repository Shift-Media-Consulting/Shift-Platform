import type { Metadata } from 'next'
import Nav from '@/components/marketing/Nav'
import Footer from '@/components/marketing/Footer'

export const metadata: Metadata = {
  title: 'Workshops — shift.media',
  description: 'Focused advisory sessions on a single production topic. Coming soon.',
}

export default function WorkshopsPage() {
  return (
    <>
      <Nav />
      <main
        style={{
          background: 'linear-gradient(180deg, #004d40 0%, #2a6f5e 40%, #4f9382 75%, #b9d8d2 100%)',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'clamp(120px,16vw,180px) var(--margin-x) clamp(80px,10vw,120px)',
          textAlign: 'center',
          fontFamily: 'var(--font-head)',
        }}
      >
        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '12px',
          letterSpacing: '0.20em',
          color: 'rgba(246,245,242,0.50)',
          marginBottom: '24px',
        }}>
          — Services · Workshops
        </p>
        <h1 style={{
          fontWeight: 600,
          fontSize: 'clamp(48px,7vw,88px)',
          lineHeight: 0.96,
          letterSpacing: '-0.025em',
          color: '#f6f5f2',
          maxWidth: '900px',
          marginBottom: '28px',
        }}>
          Workshops.{' '}
          <em style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>Coming soon.</em>
        </h1>
        <p style={{
          fontSize: 'clamp(16px,1.8vw,20px)',
          lineHeight: 1.55,
          color: 'rgba(246,245,242,0.70)',
          maxWidth: '560px',
        }}>
          Focused sessions on a single topic. AI readiness, production strategy,
          organisational design, and more. Built around your real briefs.
        </p>
      </main>
      <Footer />
    </>
  )
}
