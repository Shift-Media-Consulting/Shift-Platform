import { setRequestLocale, getTranslations, getMessages } from 'next-intl/server'
import { getTranslations as getMeta } from 'next-intl/server'
import Nav from '@/components/marketing/Nav'
import Footer from '@/components/marketing/Footer'
import CtaSection from '@/components/marketing/CtaSection'
import AboutConflict from './AboutConflict'
import AboutAnimations from './AboutAnimations'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getMeta({ locale, namespace: 'About.Meta' })
  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: locale === 'de' ? '/about' : '/en/about',
      languages: { 'de-DE': '/about', 'en': '/en/about', 'x-default': '/about' },
    },
  }
}

const BODY_GRADIENT = 'linear-gradient(180deg, #004d40 0%, #2a6f5e 20%, #4f9382 48%, #b9d8d2 78%, #b9d8d2 100%)'

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations('About')
  const messages = await getMessages()
  const principlesItems = ((messages as any).About.Principles.items as Array<{ number: string; title: string; description: string }>)
  const beliefsItems    = ((messages as any).About.Beliefs.items    as Array<{ claim: string; reality: string }>)

  return (
    <>
      <Nav />
      <AboutAnimations />
      <main
        className="about-main min-h-screen font-[family-name:var(--font-head)]"
        style={{ background: BODY_GRADIENT }}
      >

        {/* HERO */}
        <section
          data-ab
          className="flex flex-col justify-end px-8 sm:px-10 md:px-14 lg:px-20 xl:px-24 min-h-[60vh]"
          style={{
            paddingTop: 'clamp(120px, 18vw, 180px)',
            paddingBottom: 'clamp(56px, 8vw, 80px)',
          }}
        >
          <div className="max-w-[1100px]">
            <h1
              className="ab-h font-bold text-cream leading-[0.95] tracking-[-0.025em] mb-8"
              style={{ fontSize: 'clamp(48px, 7vw, 96px)' }}
            >
              {t.rich('Hero.title', { em: (c) => <em className="news">{c}</em> })}
            </h1>

            <p
              className="ab-p text-cream/80 leading-[1.55] max-w-[600px] font-medium"
              style={{ fontSize: 'clamp(16px, 1.6vw, 18px)' }}
            >
              {t('Hero.subtitle')}
            </p>
          </div>
        </section>

        {/* WHY WE EXIST */}
        <AboutConflict />

        {/* OUR DIFFERENCE */}
        <section
          data-ab
          data-theme="light"
          className="px-8 sm:px-10 md:px-14 lg:px-20 xl:px-24"
          style={{ paddingTop: 'clamp(56px, 10vw, 80px)', paddingBottom: 'clamp(56px, 10vw, 80px)' }}
        >
          <div className="max-w-[1200px]">
            <h2
              className="ab-h font-bold leading-[1.0] tracking-[-0.02em] mb-12 sm:mb-16 max-w-[900px]"
              style={{ fontSize: 'clamp(32px, 4.5vw, 60px)', color: 'var(--fg)' }}
            >
              {t.rich('Principles.title', {
                em: (c) => (
                  <em className="not-italic font-bold" style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', color: 'var(--fg)' }}>
                    {c}
                  </em>
                ),
              })}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-10 sm:gap-y-14 gap-x-8">
              {principlesItems.map(item => (
                <div key={item.number} className="ab-card flex flex-col">
                  <p className="text-[11px] tracking-[1px] mb-5" style={{ fontFamily: 'var(--font-mono)', color: 'var(--fg-faint)' }}>
                    [{item.number}]
                  </p>
                  <h3 className="font-bold text-[20px] leading-[1.05] tracking-[-0.015em] mb-3.5" style={{ color: 'var(--fg)' }}>
                    {item.title}
                  </h3>
                  <p className="font-medium text-[14px] leading-[1.65]" style={{ color: 'var(--fg-muted)' }}>
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WHAT WE BELIEVE */}
        <section
          data-ab
          data-theme="light"
          className="px-8 sm:px-10 md:px-14 lg:px-20 xl:px-24"
          style={{ paddingTop: 'clamp(56px, 10vw, 80px)', paddingBottom: 'clamp(56px, 10vw, 80px)' }}
        >
          <div className="max-w-[900px]">
            <h2
              className="ab-h font-bold leading-[1.0] tracking-[-0.02em] mb-12 sm:mb-16"
              style={{ fontSize: 'clamp(32px, 4.5vw, 60px)', color: 'var(--fg)' }}
            >
              {t.rich('Beliefs.title', {
                em: (c) => (
                  <em className="not-italic font-bold" style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', color: 'var(--fg)' }}>
                    {c}
                  </em>
                ),
              })}
            </h2>

            <div className="flex flex-col gap-10 sm:gap-12">
              {beliefsItems.map((b, i) => (
                <div key={i} className="ab-card border-l-2 pl-7 sm:pl-9" style={{ borderColor: 'rgba(17,17,17,0.18)' }}>
                  <p
                    className="font-bold leading-[1.1] tracking-[-0.02em] mb-2"
                    style={{ fontSize: 'clamp(20px, 2.8vw, 30px)', color: 'var(--fg)' }}
                  >
                    {b.claim}
                  </p>
                  <p
                    className="font-bold leading-[1.1] tracking-[-0.02em]"
                    style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 'clamp(20px, 2.8vw, 30px)', color: 'var(--fg-muted)' }}
                  >
                    {b.reality}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ORIGIN / FOUNDER NOTE */}
        <section
          data-ab
          data-theme="light"
          className="px-8 sm:px-10 md:px-14 lg:px-20 xl:px-24"
          style={{ paddingTop: 'clamp(56px, 10vw, 80px)', paddingBottom: 'clamp(56px, 10vw, 80px)' }}
        >
          <div className="max-w-[760px]">
            <h2
              className="ab-h font-bold leading-[1.0] tracking-[-0.02em] mb-10"
              style={{ fontSize: 'clamp(32px, 4.5vw, 60px)', color: 'var(--fg)' }}
            >
              {t.rich('Origin.title', {
                em: (c) => (
                  <em className="not-italic font-bold" style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', color: 'var(--fg)' }}>
                    {c}
                  </em>
                ),
              })}
            </h2>

            <div className="flex flex-col gap-6 mb-10">
              <p className="ab-p font-medium text-[16px] sm:text-[17px] leading-[1.65]" style={{ color: 'var(--fg-muted)' }}>
                {t('Origin.body_p1')}
              </p>
              <p className="ab-p2 font-medium text-[16px] sm:text-[17px] leading-[1.65]" style={{ color: 'var(--fg-muted)' }}>
                {t('Origin.body_p2')}
              </p>
            </div>

            <figure style={{ margin: '32px 0', padding: '18px 22px', borderLeft: '2px solid var(--accent-warm)' }}>
              <blockquote style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 500, fontSize: '19px', lineHeight: 1.45, margin: 0, maxWidth: '30ch', color: 'var(--fg-muted)' }}>
                {t('Origin.pull_quote')}
              </blockquote>
              <figcaption style={{ marginTop: '10px', fontFamily: 'var(--font-mono)', fontSize: '10.5px', letterSpacing: '0.22em', textTransform: 'uppercase', opacity: 0.6, color: 'var(--fg-faint)' }}>
                {t('Origin.pull_quote_attr')}
              </figcaption>
            </figure>

            <p
              className="ab-name font-bold text-[14px] tracking-[0.3px]"
              style={{ fontFamily: 'var(--font-mono)', color: 'var(--fg-faint)' }}
            >
              — {t('Origin.signature')}
            </p>
          </div>
        </section>

        <CtaSection
          eyebrow={`— ${t('Closing.kicker')} —`}
          h2={t.rich('Closing.title', { em: (c) => <em className="news">{c}</em> })}
          para={t('Closing.body')}
          cta={t('Closing.cta')}
        />

      </main>
      <Footer />
    </>
  )
}
