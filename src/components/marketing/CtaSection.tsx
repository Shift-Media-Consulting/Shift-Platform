/**
 * Shared returning-teal CTA block — used on every page except /contact.
 * Sits at the bottom of <main> before <Footer />.
 * Has its own background gradient (pale teal → mid teal → deep teal)
 * so it "returns" from the pale band.
 */

import { ReactNode } from 'react'
import { Link } from '@/i18n/routing'

const CTA_GRADIENT =
  'linear-gradient(180deg, #b9d8d2 0%, #2a6f5e 60%, #004d40 100%)'

type Props = {
  h2?: ReactNode
  para?: string
  eyebrow?: string
  cta?: string
}

export default function CtaSection({
  eyebrow = '— Start with a conversation —',
  h2 = <>Forty-five minutes. <em className="news">No sales pitch.</em></>,
  para = "Tell us what you are trying to figure out. We will come back within 24 hours, Monday to Friday, with an honest read on whether we are the right people to help, and which founder you would be working with.",
  cta = 'Request a conversation ›',
}: Props) {
  return (
    <section
      style={{
        background: CTA_GRADIENT,
        padding: 'clamp(88px,12vw,140px) var(--margin-x) clamp(100px,14vw,160px)',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {/* Eyebrow */}
      <p
        style={{
          fontFamily: 'var(--font-head)',
          fontSize: '13px',
          letterSpacing: '0.20em',
          textTransform: 'uppercase' as const,
          color: 'rgba(246,245,242,0.60)',
          marginBottom: '24px',
          fontWeight: 600,
        }}
      >
        {eyebrow}
      </p>

      {/* H2 */}
      <h2
        style={{
          fontFamily: 'var(--font-head)',
          fontWeight: 600,
          fontSize: 'clamp(48px,6.5vw,88px)',
          lineHeight: 0.96,
          letterSpacing: '-0.025em',
          color: '#f6f5f2',
          maxWidth: '1100px',
          marginBottom: '24px',
        }}
      >
        {h2}
      </h2>

      {/* Para */}
      <p
        style={{
          fontSize: 'clamp(17px,1.6vw,21px)',
          lineHeight: 1.5,
          color: 'rgba(246,245,242,0.82)',
          maxWidth: '680px',
          marginBottom: '40px',
          fontWeight: 400,
        }}
      >
        {para}
      </p>

      {/* Button */}
      <Link
        href="/contact"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '18px 36px',
          borderRadius: '9999px',
          background: '#f6f5f2',
          color: '#111111',
          fontFamily: 'var(--font-head)',
          fontWeight: 600,
          fontSize: '17px',
          textDecoration: 'none',
        }}
      >
        {cta}
      </Link>

    </section>
  )
}
