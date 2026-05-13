import { setRequestLocale, getTranslations, getMessages } from 'next-intl/server'
import { getTranslations as getMeta } from 'next-intl/server'
import Nav from '@/components/marketing/Nav'
import Footer from '@/components/marketing/Footer'
import CtaSection from '@/components/marketing/CtaSection'
import ServicesReveal from './ServicesReveal'
import ServicesSlider from './ServicesSlider'
import ServicesFaq from './ServicesFaq'
import ServicesPillarCarousel from './ServicesPillarCarousel'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getMeta({ locale, namespace: 'Services.Meta' })
  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: locale === 'de' ? '/services' : '/en/services',
      languages: { 'de-DE': '/services', 'en': '/en/services', 'x-default': '/services' },
    },
  }
}

const BODY_GRADIENT = 'linear-gradient(180deg, #004d40 0%, #2a6f5e 20%, #4f9382 48%, #b9d8d2 78%, #b9d8d2 100%)'

export default async function ServicesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations('Services')
  const messages = await getMessages()

  const entryItems       = ((messages as any).Services.Entry.items      as Array<{ number: string; title: string; description: string }>)
  const engagementItems  = ((messages as any).Services.Engagement.items as Array<{ number: string; title: string; description: string }>)
  const pillarsItems     = ((messages as any).Services.Pillars.items    as Array<{
    number: string; category: string; title: string; description: string; capabilities: string[]
  }>)
  const faqItems         = ((messages as any).Services.FAQ.items        as Array<{ question: string; answer: string }>)

  // Map pillars to the shape ServicesPillarCarousel expects
  const pillars = pillarsItems.map(item => ({
    num:     item.number,
    label:   item.category,
    name:    item.title,
    desc:    item.description,
    details: item.capabilities.join(' · '),
    outcome: '',
  }))

  // Map FAQ items to shape ServicesFaq expects
  const faqs = faqItems.map(item => ({ q: item.question, a: item.answer }))

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How is shift.media different from a production company?',
        acceptedAnswer: { '@type': 'Answer', text: 'We don\'t make productions. We advise on them. We have no financial interest in any production going ahead, going bigger, or going to any particular vendor.' },
      },
      {
        '@type': 'Question',
        name: 'How is shift.media different from a consultancy?',
        acceptedAnswer: { '@type': 'Answer', text: 'We\'ve actually run productions. On set. In the edit suite. In the negotiations. Our recommendations are grounded in what happens in production. Not what a slide deck says should happen.' },
      },
      {
        '@type': 'Question',
        name: 'Do you take a cut of vendor fees?',
        acceptedAnswer: { '@type': 'Answer', text: 'No. Never. Our fees come from our clients. That\'s it.' },
      },
      {
        '@type': 'Question',
        name: 'What does an engagement typically cost?',
        acceptedAnswer: { '@type': 'Answer', text: 'We scope each engagement individually. Talk to us. We\'ll tell you what\'s involved before you commit to anything.' },
      },
      {
        '@type': 'Question',
        name: 'Can you work alongside our existing agency?',
        acceptedAnswer: { '@type': 'Answer', text: 'Yes. We work with brands whose agencies are managing the production, brands working directly with production companies, and brands building their own in house function. Independent oversight is the constant.' },
      },
    ],
  }

  const serviceProvider = { '@type': 'Organization', name: 'Shift Media GbR' }
  const servicesSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        name: 'Production Audit',
        description: 'A diagnostic framework across six dimensions of brand content operations, ending in a clear roadmap.',
        provider: serviceProvider,
      },
      {
        '@type': 'Service',
        name: 'Workshops',
        description: 'Focused working sessions on production strategy, cost control, operations, and leadership.',
        provider: serviceProvider,
      },
      {
        '@type': 'Service',
        name: 'Pilot',
        description: 'A defined, time-limited advisory engagement from start to finish.',
        provider: serviceProvider,
      },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesSchema) }} />
      <Nav />
      <ServicesReveal />
      <main
        className="services-main min-h-screen font-[family-name:var(--font-head)]"
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
              className="ab-p text-cream/80 leading-[1.65] max-w-[600px] font-medium"
              style={{ fontSize: 'clamp(16px, 1.6vw, 18px)' }}
            >
              {t('Hero.body_p1')}
              <br /><br />
              {t('Hero.body_p2')}
            </p>
          </div>
        </section>

        {/* CAROUSELS */}
        <section
          data-ab
          style={{
            paddingTop: 'clamp(64px, 10vw, 100px)',
            paddingBottom: 'clamp(64px, 10vw, 100px)',
          }}
        >
          <div className="ab-card flex flex-col gap-20">
            <ServicesSlider
              label={t.rich('Entry.title', { em: (c) => <>{c}</> })}
              cards={entryItems.map(i => ({ name: i.title, desc: i.description }))}
            />
            <ServicesSlider
              label={t.rich('Engagement.title', { em: (c) => <>{c}</> })}
              cards={engagementItems.map(i => ({ name: i.title, desc: i.description }))}
            />
          </div>
        </section>

        {/* FOUR PILLARS */}
        <section
          data-ab
          style={{ padding: 'clamp(56px,7vw,88px) var(--margin-x)' }}
        >
          {/* Header grid */}
          <div
            className="ab-h svc-header-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: '1.2fr 1fr',
              gap: 'clamp(48px,6vw,80px)',
              marginBottom: '64px',
              alignItems: 'end',
            }}
          >
            <h2
              style={{
                fontFamily: 'var(--font-head)',
                fontWeight: 600,
                fontSize: 'clamp(48px,6.5vw,88px)',
                lineHeight: 0.96,
                letterSpacing: '-0.025em',
                color: '#f6f5f2',
                margin: 0,
              }}
            >
              {t.rich('Pillars.title', { br: () => <br /> })}
            </h2>
            <p
              className="ab-p"
              style={{
                fontSize: '19px',
                lineHeight: 1.55,
                color: 'rgba(246,245,242,0.75)',
                maxWidth: '460px',
                alignSelf: 'end',
                margin: 0,
              }}
            >
              {t('Pillars.intro')}
            </p>
          </div>

          {/* Pillar rail */}
          <div
            className="ab-p2"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              borderTop: '1px solid rgba(246,245,242,0.25)',
              paddingTop: '18px',
              marginBottom: '32px',
            }}
          >
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', letterSpacing: '0.20em', color: 'rgba(246,245,242,0.50)' }}>
              — {t('Pillars.kicker').split('·')[0].trim()}
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', letterSpacing: '0.20em', color: 'rgba(246,245,242,0.50)' }}>
              {t('Pillars.kicker').split('·')[1]?.trim()}
            </span>
          </div>

          <ServicesPillarCarousel pillars={pillars} />
        </section>

        {/* FAQ */}
        <section data-ab data-theme="light" style={{ padding: 'clamp(56px,7vw,88px) var(--margin-x)' }}>
          <div style={{ maxWidth: '860px' }}>
            <h2
              className="ab-h"
              style={{
                fontFamily: 'var(--font-head)',
                fontWeight: 600,
                fontSize: 'clamp(32px,4.5vw,56px)',
                lineHeight: 1.0,
                letterSpacing: '-0.02em',
                color: 'var(--fg)',
                marginBottom: 'clamp(40px,5vw,56px)',
              }}
            >
              {t.rich('FAQ.title', { em: (c) => <>{c}</> })}
            </h2>
            <div className="ab-card">
              <ServicesFaq items={faqs} />
            </div>
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
