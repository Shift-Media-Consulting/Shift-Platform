import { setRequestLocale, getTranslations, getMessages } from 'next-intl/server'
import { getTranslations as getMeta } from 'next-intl/server'
import Nav from '@/components/marketing/Nav'
import Footer from '@/components/marketing/Footer'
import IntroWrapper from './IntroWrapper'
import HomeReveal from './HomeReveal'
import ServicesSlider from './services/ServicesSlider'
import { Link } from '@/i18n/routing'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getMeta({ locale, namespace: 'Home.Meta' })
  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: locale === 'de' ? '/' : '/en',
      languages: { 'de-DE': '/', 'en': '/en', 'x-default': '/' },
    },
  }
}

const BODY_GRADIENT =
  'linear-gradient(180deg, #004d40 0%, #2a6f5e 20%, #4f9382 48%, #b9d8d2 78%, #b9d8d2 100%)'

const CTA_GRADIENT =
  'linear-gradient(180deg, #b9d8d2 0%, #2a6f5e 60%, #004d40 100%)'

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations('Home')
  const messages = await getMessages()
  const pillarsItems = ((messages as any).Home.Pillars.items as Array<{ number: string; title: string; description: string }>)
  const statsItems   = ((messages as any).Home.Stats.items   as Array<{ value: string; label: string }>)

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
          style={{ padding: `clamp(100px,14vw,150px) var(--margin-x) clamp(56px,7vw,80px)` }}
        >
          {/* Rail */}
          <div
            className="reveal"
            style={{
              borderTop: '1px solid var(--fg-rule)',
              paddingTop: '16px',
              marginBottom: '40px',
              fontFamily: 'var(--font-mono)',
              fontSize: '13px',
              letterSpacing: '0.20em',
              color: 'var(--fg-faint)',
              fontWeight: 400,
            }}
          >
            {t('Hero.kicker')}
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
              color: 'var(--fg)',
              maxWidth: '1500px',
              marginBottom: '32px',
            }}
          >
            {t.rich('Hero.title', { em: (c) => <em className="news">{c}</em> })}
          </h1>

          {/* Deck */}
          <p
            className="reveal"
            style={{
              fontSize: '26px',
              lineHeight: 1.4,
              color: 'var(--fg-muted)',
              maxWidth: '700px',
              marginBottom: '40px',
            }}
          >
            {t.rich('Hero.subtitle', {
              em:    (c) => <>{c}</>,
              brand: (c) => <>{c}</>,
            })}
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
            <Link
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
              {t('Hero.cta_primary')}
            </Link>
          </div>
        </section>

        {/* ── GEO anchor: factual entity description ─────────────────── */}
        <section
          data-hm
          style={{ padding: `0 var(--margin-x) clamp(40px,5vw,56px)` }}
        >
          <p
            className="reveal"
            style={{
              fontSize: 'clamp(15px,1.4vw,17px)',
              lineHeight: 1.75,
              color: 'var(--fg-muted)',
              maxWidth: '720px',
              fontWeight: 400,
              borderLeft: '2px solid rgba(17,17,17,0.12)',
              paddingLeft: '20px',
            }}
          >
            Shift Media GbR is an independent production advisory firm founded by Justin Stiebel, Cornelius Roenz, and Jankel Huppertz — three operators with decades of hands-on experience across German and European TVC, content, and campaign production. Based in Hamburg. Operating across Germany and Europe. No affiliation with any production company, agency, or vendor.
          </p>
        </section>

        {/* ── Section 2: Four Pillars ──────────────────────────────────── */}
        <section
          data-hm
          className="hm-section"
          style={{ padding: `clamp(48px,6vw,72px) var(--margin-x)` }}
        >
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
                color: 'var(--fg)',
                margin: 0,
              }}
            >
              {t.rich('Pillars.title', {
                br: () => <br />,
                em: (c) => <>{c}</>,
              })}
            </h2>
            <div style={{ alignSelf: 'end' }}>
              <p
                style={{
                  fontSize: '19px',
                  lineHeight: 1.55,
                  color: 'var(--fg-muted)',
                  maxWidth: '460px',
                  margin: 0,
                }}
              >
                {t('Pillars.intro')}
              </p>
              <figure style={{ margin: '28px 0 0', padding: '18px 22px', borderLeft: '2px solid var(--accent-warm)' }}>
                <blockquote style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 500, fontSize: '19px', lineHeight: 1.45, margin: 0, maxWidth: '30ch', color: 'var(--fg-muted)' }}>
                  {t('Pillars.pull_quote')}
                </blockquote>
                <figcaption style={{ marginTop: '10px', fontFamily: 'var(--font-mono)', fontSize: '10.5px', letterSpacing: '0.22em', textTransform: 'uppercase', opacity: 0.6, color: 'var(--fg-faint)' }}>
                  {t('Pillars.pull_quote_attr')}
                </figcaption>
              </figure>
            </div>
          </div>

          <ServicesSlider
            compact
            cards={pillarsItems.map(item => ({ name: item.title, desc: item.description }))}
          />
        </section>

        {/* ── Section 3: Conviction beat ───────────────────────────────── */}
        <section
          data-hm
          data-theme="light"
          className="hm-section"
          style={{ padding: `clamp(48px,6vw,72px) var(--margin-x)` }}
        >
          <div
            className="hm-conviction-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 'clamp(48px,6vw,80px)',
              maxWidth: '1400px',
            }}
          >
            <h3
              className="reveal"
              style={{
                fontFamily: 'var(--font-head)',
                fontWeight: 600,
                fontSize: 'clamp(44px,5vw,64px)',
                lineHeight: 1.0,
                color: 'var(--fg)',
                margin: 0,
              }}
            >
              {t.rich('Independence.headline', { em: (c) => <>{c}</> })}
            </h3>

            <div>
              <p
                className="reveal"
                style={{ fontSize: '19px', color: 'var(--fg-muted)', maxWidth: '540px', lineHeight: 1.6, margin: '0 0 20px 0' }}
              >
                {t('Independence.body_p1')}
              </p>
              <p
                className="reveal"
                style={{ fontSize: '19px', color: 'var(--fg-muted)', maxWidth: '540px', lineHeight: 1.6, margin: 0 }}
              >
                {t('Independence.body_p2')}
              </p>
            </div>
          </div>

          {/* Stats strip */}
          <div
            className="hm-stat-grid"
            style={{
              marginTop: 'clamp(56px,7vw,80px)',
              maxWidth: '1400px',
              borderTop: '1px solid var(--fg-rule)',
              paddingTop: '32px',
              display: 'grid',
              gridTemplateColumns: 'repeat(4,1fr)',
              gap: '40px',
            }}
          >
            {statsItems.map(cell => (
              <div key={cell.label} className="stat-cell reveal">
                <span
                  style={{
                    fontFamily: 'var(--font-head)',
                    fontWeight: 600,
                    fontSize: 'clamp(44px,5vw,64px)',
                    letterSpacing: '-0.025em',
                    color: 'var(--fg)',
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
                    color: 'var(--fg-muted)',
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
          <p
            className="reveal"
            style={{
              fontFamily: 'var(--font-head)',
              fontSize: '13px',
              fontWeight: 600,
              letterSpacing: '0.20em',
              textTransform: 'uppercase',
              color: 'rgba(246,245,242,0.80)',
              marginBottom: '24px',
            }}
          >
            — {t('Closing.kicker')} —
          </p>

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
            {t('Closing.title')}
          </h2>

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
            {t('Closing.body')}
          </p>

          <div className="reveal" style={{ display: 'flex', gap: '20px', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
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
              {t('Closing.cta')}
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
