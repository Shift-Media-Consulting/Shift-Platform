import { setRequestLocale, getTranslations, getMessages } from 'next-intl/server'
import { getTranslations as getMeta } from 'next-intl/server'
import Nav from '@/components/marketing/Nav'
import Footer from '@/components/marketing/Footer'
import PageReveal from '@/components/marketing/PageReveal'
import TeamReveal from './TeamReveal'
import PartnerNetwork from './PartnerNetwork'
import CtaSection from '@/components/marketing/CtaSection'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getMeta({ locale, namespace: 'Team.Meta' })
  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: locale === 'de' ? '/team' : '/en/team',
      languages: { 'de-DE': '/team', 'en': '/en/team', 'x-default': '/team' },
    },
  }
}

/* ── Static image / monogram map (visual only, locale-independent) ── */
const FOUNDER_IMAGES = [
  { monogram: 'JS', image: '/team/justin.jpg',   email: 'justin@shift-media.io',    tags: ['Org design', 'Exec production', 'Transformation'], footerLeft: '— EU operator' },
  { monogram: 'CR', image: '/team/cornelius.jpg', email: 'cornelius@shift-media.io', tags: ['Cost control', 'DE/EU rates', 'Procurement'],      footerLeft: '— DE specialist' },
  { monogram: 'JH', image: '/team/jankel.jpeg',   email: 'jankel@shift-media.io',    tags: ['Operations', 'Pipeline', 'Delivery'],              footerLeft: '— Agency-side' },
]

export default async function TeamPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations('Team')
  const messages = await getMessages()

  const foundersItems  = ((messages as any).Team.Founders.items  as Array<{ role: string; name: string; discipline: string; p1: string; p2: string; p3: string; email: string }>)
  const partnersItems  = ((messages as any).Team.Partners.items  as Array<{ role: string; title: string; description: string }>)

  const founders = foundersItems.map((f, i) => ({ ...f, ...FOUNDER_IMAGES[i] }))

  const worksFor = { '@type': 'Organization', name: 'Shift Media GbR', url: 'https://shift-media.io' }
  const teamSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        name: 'Justin Stiebel',
        jobTitle: 'Co-founder, Shift Media GbR',
        description: 'Production controlling and advisory specialist with deep market knowledge across German and European TVC, content, and campaign production.',
        email: 'justin@shift-media.io',
        worksFor,
        url: 'https://shift-media.io/team',
      },
      {
        '@type': 'Person',
        name: 'Cornelius Roenz',
        jobTitle: 'Co-founder, Shift Media GbR',
        description: 'Production leader with extensive experience building and running production functions at agency and brand level across Europe.',
        email: 'cornelius@shift-media.io',
        worksFor,
        url: 'https://shift-media.io/team',
      },
      {
        '@type': 'Person',
        name: 'Jankel Huppertz',
        jobTitle: 'Co-founder, Shift Media GbR',
        description: 'Production leader with deep experience across agency production. Understands how TVC, content, and campaign production works, from idea to execution.',
        email: 'jankel@shift-media.io',
        worksFor,
        url: 'https://shift-media.io/team',
      },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(teamSchema) }} />
      <Nav />
      <PageReveal />
      <TeamReveal />
      <main
        className="tm-main"
        style={{
          background: 'linear-gradient(180deg, #004d40 0%, #2a6f5e 20%, #4f9382 48%, #b9d8d2 78%, #b9d8d2 100%)',
          minHeight: '100vh',
          fontFamily: 'var(--font-head)',
        }}
      >

        {/* ── Section 1: Hero ───────────────────────────────────────────── */}
        <section
          data-t
          style={{ padding: 'clamp(96px,13vw,140px) var(--margin-x) clamp(40px,5vw,60px)' }}
        >
          {/* Rail */}
          <p
            className="reveal"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '13px',
              letterSpacing: '0.2em',
              color: 'rgba(246,245,242,0.55)',
              borderTop: '1px solid rgba(246,245,242,0.35)',
              paddingTop: '16px',
              marginBottom: '40px',
              fontWeight: 400,
            }}
          >
            — 01 / Who we are · Operators, not consultants
          </p>

          {/* H1 */}
          <h1
            className="reveal"
            style={{
              fontFamily: 'var(--font-head)',
              fontWeight: 600,
              fontSize: 'clamp(72px,8vw,104px)',
              lineHeight: 0.95,
              letterSpacing: '-0.025em',
              color: '#f6f5f2',
              maxWidth: '1300px',
              marginBottom: '32px',
            }}
          >
            {t.rich('Hero.title', { em: (c) => <em className="news">{c}</em> })}
          </h1>

          {/* Deck */}
          <p
            className="reveal"
            style={{
              fontSize: '24px',
              lineHeight: 1.45,
              color: 'rgba(246,245,242,0.85)',
              maxWidth: '760px',
              marginBottom: 'clamp(48px,6vw,72px)',
            }}
          >
            {t('Hero.subtitle')}
          </p>

          {/* Meta strip */}
          <div
            className="reveal tm-meta-strip"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4,1fr)',
              gap: '0',
              borderTop: '1px solid rgba(246,245,242,0.35)',
              maxWidth: '900px',
            }}
          >
            {[
              { label: 'Founders', value: 'Three operators' },
              { label: 'Network',  value: 'Eight disciplines' },
              { label: 'Base',     value: 'Hamburg, DE' },
              { label: 'Markets',  value: 'DE · EU · International' },
            ].map(cell => (
              <div
                key={cell.label}
                style={{
                  borderTop: '1px solid rgba(246,245,242,0.35)',
                  paddingTop: '20px',
                  paddingRight: '24px',
                }}
              >
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.14em', color: 'rgba(246,245,242,0.45)', marginBottom: '6px' }}>
                  {cell.label}
                </p>
                <p style={{ fontFamily: 'var(--font-head)', fontSize: '22px', fontWeight: 500, color: '#f6f5f2', lineHeight: 1.2 }}>
                  {cell.value}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Section 2: Founders ───────────────────────────────────────── */}
        <section
          data-t
          style={{ padding: 'clamp(56px,7vw,88px) var(--margin-x)' }}
        >
          {/* Rail */}
          <p
            className="reveal"
            style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', letterSpacing: '0.2em', color: 'rgba(246,245,242,0.55)', marginBottom: '40px', fontWeight: 400 }}
          >
            — 02 / The founders · Three operators · One independent firm
          </p>

          {/* H2 */}
          <h2
            className="reveal"
            style={{ fontFamily: 'var(--font-head)', fontWeight: 600, fontSize: 'clamp(48px,6vw,72px)', letterSpacing: '-0.025em', color: '#f6f5f2', marginBottom: '16px' }}
          >
            {t.rich('Founders.title', { em: (c) => <em className="news">{c}</em> })}
          </h2>

          {/* 3-col founders grid */}
          <div
            className="tm-founders-grid"
            style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '56px', marginTop: '48px' }}
          >
            {founders.map((f, idx) => (
              <div key={idx} className="tm-founder reveal">

                {/* Portrait */}
                <div style={{
                  aspectRatio: '4/5',
                  borderRadius: '6px',
                  position: 'relative',
                  marginBottom: '28px',
                  overflow: 'hidden',
                  background: f.image ? 'transparent' : 'linear-gradient(135deg, rgba(246,245,242,0.10) 0%, rgba(246,245,242,0.04) 100%)',
                  backdropFilter: f.image ? 'none' : 'blur(8px)',
                  WebkitBackdropFilter: f.image ? 'none' : 'blur(8px)',
                  boxShadow: `
                    inset 0  1px 0 rgba(255,240,220,0.35),
                    inset 0 -1px 0 rgba(180,200,255,0.20),
                    inset  1px 0 0 rgba(255,180,180,0.18),
                    inset -1px 0 0 rgba(140,160,255,0.18),
                    0 32px 80px rgba(0,0,0,0.30)
                  `,
                }}>
                  {f.image ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={f.image} alt={f.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} />
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(128deg, rgba(255,255,255,0.13) 0%, rgba(255,255,255,0.05) 28%, transparent 48%, rgba(255,255,255,0.02) 72%, transparent 100%)' }} />
                      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,40,30,0.10)' }} />
                      <div style={{ position: 'absolute', inset: 0, borderRadius: '6px', boxShadow: 'inset 4px 0 10px rgba(255,60,60,0.12), inset -4px 0 10px rgba(60,120,255,0.12), inset 0 3px 16px rgba(255,255,255,0.07)' }} />
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 42%, rgba(0,18,12,0.88) 100%)' }} />
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.12em', color: 'rgba(246,245,242,0.70)', position: 'absolute', bottom: '16px', left: '16px' }}>
                        {f.name}
                      </span>
                    </>
                  ) : (
                    <>
                      <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 600, fontSize: 'clamp(80px,8vw,120px)', color: 'rgba(246,245,242,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                        {f.monogram}
                      </span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.12em', color: 'rgba(246,245,242,0.35)', position: 'absolute', bottom: '16px', left: '16px' }}>
                        {f.name}
                      </span>
                    </>
                  )}
                </div>

                {/* Mono row */}
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.15em', color: 'rgba(246,245,242,0.55)', borderTop: '1px solid rgba(246,245,242,0.40)', paddingTop: '16px', marginBottom: '12px' }}>
                  — {f.role}
                </p>

                {/* Name */}
                <p style={{ fontFamily: 'var(--font-head)', fontWeight: 600, fontSize: '40px', lineHeight: 1.0, color: '#f6f5f2', marginBottom: '10px' }}>
                  {f.name}
                </p>

                {/* Discipline */}
                <p style={{ fontSize: '16px', lineHeight: 1.4, color: 'rgba(246,245,242,0.70)', marginBottom: '16px', fontStyle: 'italic', fontFamily: 'var(--font-serif)', fontWeight: 600 }}>
                  {f.discipline}
                </p>

                {/* Bio paragraphs */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                  <p style={{ fontSize: '15px', color: 'rgba(246,245,242,0.72)', lineHeight: 1.55 }}>{f.p1}</p>
                  <p style={{ fontSize: '15px', color: 'rgba(246,245,242,0.72)', lineHeight: 1.55 }}>{f.p2}</p>
                  <p style={{ fontSize: '15px', color: 'rgba(246,245,242,0.72)', lineHeight: 1.55 }}>{f.p3}</p>
                </div>

                {/* Tag pills */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
                  {f.tags.map(tag => (
                    <span key={tag} style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.16em', border: '1px solid rgba(246,245,242,0.35)', padding: '6px 10px', borderRadius: '999px', color: 'rgba(246,245,242,0.75)', background: 'transparent' }}>
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Dashed footer */}
                <div style={{ borderTop: '1px dashed rgba(246,245,242,0.40)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'rgba(246,245,242,0.50)' }}>{f.footerLeft}</span>
                  <a href={`mailto:${f.email}`} style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'rgba(246,245,242,0.50)', textDecoration: 'underline' }}>
                    {f.email}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Section 3: Partner network ────────────────────────────────── */}
        <section
          data-t
          data-theme="light"
          style={{ padding: 'clamp(56px,7vw,88px) var(--margin-x)' }}
        >
          <p
            className="reveal"
            style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', letterSpacing: '0.2em', color: 'var(--fg-faint)', marginBottom: '40px', fontWeight: 400 }}
          >
            — 03 / The network · A discipline map · Engaged by name
          </p>

          <PartnerNetwork items={partnersItems} intro={t('Partners.intro')} />

          <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--fg-faint)' }}>
              — Eight disciplines · engaged by name
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--fg-faint)' }}>
              shift.media · a network, not a roster
            </span>
          </div>
        </section>

        <CtaSection
          h2={<>Forty-five minutes. <em className="news">No sales pitch.</em></>}
          para="Tell us what you are trying to figure out. We will come back within 24 hours, Monday to Friday, with an honest read on whether we are the right people to help, and which founder you would be working with."
          cta="Request a conversation ›"
        />
      </main>
      <Footer />
    </>
  )
}
