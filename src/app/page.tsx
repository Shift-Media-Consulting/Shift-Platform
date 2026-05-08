import type { Metadata } from 'next'
import Nav from '@/components/marketing/Nav'
import Footer from '@/components/marketing/Footer'
import IntroWrapper from './IntroWrapper'
import HomeReveal from './HomeReveal'
import ServicesSlider from './services/ServicesSlider'

export const metadata: Metadata = {
  title: 'shift.media — Independent Production Advisory',
  description:
    'Independent by design. On your side by choice. Production advisory for brands. Hamburg, DE.',
}

const BODY_GRADIENT =
  'linear-gradient(180deg, #004d40 0%, #2a6f5e 20%, #4f9382 48%, #b9d8d2 78%, #b9d8d2 100%)'

const CTA_GRADIENT =
  'linear-gradient(180deg, #b9d8d2 0%, #2a6f5e 60%, #004d40 100%)'

const MARQUEE_CAPS =
  'Production controlling · Strategic advisory · Organisational setup · AI integration · Sustainable production · International structures · Roster advisory · Buyout management'

export default function HomePage() {
  return (
    <>
      <Nav />
      <IntroWrapper />
      <HomeReveal />

      <main
        className="hm-main"
        style={{
          background: BODY_GRADIENT,
          minHeight: '100vh',
          fontFamily: 'var(--font-head)',
        }}
      >

        {/* ── Section 1: Hero ──────────────────────────────────────────── */}
        <section
          data-hm
          className="hm-section"
          style={{
            padding: `clamp(100px,14vw,150px) var(--margin-x) clamp(56px,7vw,80px)`,
          }}
        >
          {/* Section rail */}
          <div
            className="reveal"
            style={{
              borderTop: '1px solid rgba(246,245,242,0.35)',
              paddingTop: '16px',
              marginBottom: '40px',
              fontFamily: 'var(--font-mono)',
              fontSize: '13px',
              letterSpacing: '0.20em',
              color: 'rgba(246,245,242,0.55)',
              fontWeight: 400,
            }}
          >
            — 01 / Index · Independent by design
          </div>

          {/* H1 */}
          <h1
            className="reveal"
            style={{
              fontFamily: 'var(--font-head)',
              fontWeight: 600,
              fontSize: 'clamp(44px,12vw,132px)',
              lineHeight: 0.92,
              letterSpacing: '-0.03em',
              color: '#f6f5f2',
              maxWidth: '1500px',
              marginBottom: '32px',
            }}
          >
            Independent by design.
            <br />
            <em className="news">On your side by choice.</em>
          </h1>

          {/* Deck */}
          <p
            className="reveal"
            style={{
              fontSize: '26px',
              lineHeight: 1.4,
              color: 'rgba(246,245,242,0.85)',
              maxWidth: '700px',
              marginBottom: '40px',
            }}
          >
            <em className="news">shift.media</em> gives brands an independent voice in
            production, built on expertise, not affiliation.
          </p>

          {/* CTA row */}
          <div
            className="reveal"
            style={{
              display: 'flex',
              gap: '20px',
              alignItems: 'center',
              marginBottom: 'clamp(40px,5vw,56px)',
            }}
          >
            <a
              href="/contact"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '16px 32px',
                borderRadius: '9999px',
                background: '#f6f5f2',
                color: '#111111',
                fontFamily: 'var(--font-head)',
                fontWeight: 600,
                fontSize: '16px',
                textDecoration: 'none',
              }}
            >
              Get in touch ›
            </a>
            <a
              href="/method"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '13px',
                letterSpacing: '0.10em',
                color: 'rgba(246,245,242,0.75)',
                textDecoration: 'underline',
                textUnderlineOffset: '3px',
              }}
            >
              The Shift Method
            </a>
          </div>

        </section>

        {/* ── Section 2: Four Pillars ──────────────────────────────────── */}
        <section
          data-hm
          className="hm-section"
          style={{
            padding: `clamp(48px,6vw,72px) var(--margin-x)`,
          }}
        >
          {/* Header grid */}
          <div
            className="reveal hm-pillar-header"
            style={{
              display: 'grid',
              gridTemplateColumns: '1.2fr 1fr',
              gap: 'clamp(32px,4vw,56px)',
              marginBottom: '48px',
            }}
          >
            <h2
              style={{
                fontFamily: 'var(--font-head)',
                fontWeight: 600,
                fontSize: 'clamp(56px,7vw,96px)',
                lineHeight: 0.96,
                letterSpacing: '-0.025em',
                color: '#f6f5f2',
                margin: 0,
              }}
            >
              Four pillars. <em className="news">One partner.</em>
            </h2>
            <p
              style={{
                fontSize: '19px',
                lineHeight: 1.55,
                color: 'rgba(246,245,242,0.78)',
                maxWidth: '460px',
                alignSelf: 'end',
                margin: 0,
              }}
            >
              A complete operating model for brands that produce, covering the four areas where independent expertise pays for itself fastest.
            </p>
          </div>

          <ServicesSlider
            compact
            cards={[
              { name: 'Production Controlling', desc: 'Cost intelligence and real-time visibility across every production.' },
              { name: 'Strategic Advisory',     desc: 'Shaping how brands commission and plan content at scale.' },
              { name: 'Organisational Setup',   desc: 'Building the production capability you need, from scratch or from inside.' },
              { name: 'AI Integration',         desc: 'From AI experiments to AI-native production. Governed, calibrated, built to last.' },
            ]}
          />
        </section>

        {/* ── Section 3: Conviction beat ───────────────────────────────── */}
        <section
          data-hm
          className="hm-section"
          style={{
            padding: `clamp(48px,6vw,72px) var(--margin-x)`,
          }}
        >
          {/* Inner grid */}
          <div
            className="hm-conviction-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 'clamp(48px,6vw,80px)',
              maxWidth: '1400px',
            }}
          >
            {/* Left H3 */}
            <h3
              className="reveal"
              style={{
                fontFamily: 'var(--font-head)',
                fontWeight: 600,
                fontSize: 'clamp(44px,5vw,64px)',
                lineHeight: 1.0,
                color: '#f6f5f2',
                margin: 0,
              }}
            >
              Most production budgets are negotiated by people paid by the outcome.{' '}
              <em className="news">We are not.</em>
            </h3>

            {/* Right col */}
            <div>
              <p
                className="reveal"
                style={{
                  fontSize: '19px',
                  color: 'rgba(246,245,242,0.78)',
                  maxWidth: '540px',
                  lineHeight: 1.6,
                  margin: '0 0 20px 0',
                }}
              >
                We do not own a production company. We are not part of an agency
                holding group.
              </p>
              <p
                className="reveal"
                style={{
                  fontSize: '19px',
                  color: 'rgba(246,245,242,0.78)',
                  maxWidth: '540px',
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                That is the entire premise. Everything else (the controlling, the advisory, the org design, the AI) works because the foundation is independent.
              </p>
            </div>
          </div>

          {/* Stats strip */}
          <div
            className="hm-stat-grid"
            style={{
              marginTop: 'clamp(56px,7vw,80px)',
              maxWidth: '1400px',
              borderTop: '1px solid rgba(246,245,242,0.25)',
              paddingTop: '32px',
              display: 'grid',
              gridTemplateColumns: 'repeat(4,1fr)',
              gap: '40px',
            }}
          >
            {[
              { value: '€600M+', label: 'Budgets managed' },
              { value: '25+',    label: 'Markets' },
              { value: '3',      label: 'Founders, named on the contract' },
              { value: '0',      label: 'Vendor affiliations' },
            ].map(cell => (
              <div key={cell.label} className="stat-cell reveal">
                <span
                  style={{
                    fontFamily: 'var(--font-head)',
                    fontWeight: 600,
                    fontSize: 'clamp(44px,5vw,64px)',
                    letterSpacing: '-0.025em',
                    color: '#f6f5f2',
                    display: 'block',
                    marginBottom: '8px',
                  }}
                >
                  {cell.value}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '12px',
                    letterSpacing: '0.18em',
                    color: '#111111',
                    display: 'block',
                  }}
                >
                  {cell.label}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Section 4: CTA ───────────────────────────────────────────── */}
        <section
          data-hm
          className="hm-section hm-cta-section"
          style={{
            background: CTA_GRADIENT,
            padding: `clamp(100px,14vw,140px) var(--margin-x) clamp(100px,14vw,160px)`,
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {/* Eyebrow */}
          <p
            className="reveal"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '13px',
              letterSpacing: '0.18em',
              color: 'rgba(246,245,242,0.55)',
              marginBottom: '24px',
            }}
          >
            — Start with a conversation
          </p>

          {/* H2 */}
          <h2
            className="reveal"
            style={{
              fontFamily: 'var(--font-head)',
              fontWeight: 600,
              fontSize: 'clamp(56px,7vw,96px)',
              lineHeight: 0.96,
              letterSpacing: '-0.025em',
              color: '#f6f5f2',
              maxWidth: '1100px',
              marginBottom: '24px',
            }}
          >
            Tell us what you are trying to figure out.
          </h2>

          {/* Para */}
          <p
            className="reveal"
            style={{
              fontSize: '22px',
              lineHeight: 1.5,
              color: 'rgba(246,245,242,0.85)',
              maxWidth: '720px',
              marginBottom: '40px',
            }}
          >
            A 45-minute call. We will come back within 24 hours with an honest read on whether we are the right people to help, and which founder you would be working with.
          </p>

          {/* CTA row */}
          <div
            className="reveal"
            style={{
              display: 'flex',
              gap: '20px',
              alignItems: 'center',
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <a
              href="/contact"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
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
              Request a conversation ›
            </a>
            <a
              href="mailto:hello@shift-media.io"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '13px',
                letterSpacing: '0.10em',
                color: 'rgba(246,245,242,0.65)',
                textDecoration: 'underline',
                textUnderlineOffset: '3px',
              }}
            >
              hello@shift-media.io
            </a>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
