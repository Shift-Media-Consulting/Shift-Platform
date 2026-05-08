import type { Metadata } from 'next'
import Nav from '@/components/marketing/Nav'
import Footer from '@/components/marketing/Footer'

export const metadata: Metadata = {
  title: 'Pilot — shift.media',
  description: 'A defined project, start to finish. Independent oversight, embedded alongside your team. Coming soon.',
}

export default function PilotPage() {
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
          — Services · Pilot
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
          Pilot.{' '}
          <em style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>Coming soon.</em>
        </h1>
        <p style={{
          fontSize: 'clamp(16px,1.8vw,20px)',
          lineHeight: 1.55,
          color: 'rgba(246,245,242,0.70)',
          maxWidth: '560px',
        }}>
          A defined project, start to finish. We embed alongside your team,
          run it independently, and leave you with a working blueprint.
        </p>
      </main>
      <Footer />
    </>
  )
}
