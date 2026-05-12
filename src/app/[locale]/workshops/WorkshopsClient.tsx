'use client'

import { useEffect, useRef, useState } from 'react'
import { Link } from '@/i18n/routing'
import ProductSlide from '@/components/marketing/ProductSlide'

type Workshop = {
  id: string; name: string; hook: string;
  why: string; what: string; outcome: string;
  duration: string; cta: string;
}
type TierData = {
  id: string; name: string; tagline: string;
  description: string; followup: string;
  workshops: Workshop[];
}
type HeroData = { eyebrow: string; title: string; body: string; subline: string }
type TierNavData = { strategy: string; diagnostic: string; practice: string; leadership: string }
type DeliverablesData = { title: string; intro: string; items: Array<{ label: string; body: string }> }
type ClosingData = { eyebrow: string; title: string; body: string; cta: string }
type RequestData = {
  title: string; subtitle: string;
  field_name: string; field_company: string; field_email: string;
  field_workshop: string; field_message: string;
  submit: string; success_title: string; success_body: string;
}

interface Props {
  hero: HeroData
  tierNav: TierNavData
  tiers: TierData[]
  deliverables: DeliverablesData
  closing: ClosingData
  request: RequestData
  productSlideSubhead: string
}

// Same gradient as /about — applied to <main> so it maps to page height.
const BODY_GRADIENT =
  'linear-gradient(180deg, #004d40 0%, #2a6f5e 20%, #4f9382 48%, #b9d8d2 78%, #b9d8d2 100%)'

// CtaSection-matching reverse gradient — used by closing CTA so it "returns" to dark.
const CTA_GRADIENT =
  'linear-gradient(180deg, #b9d8d2 0%, #2a6f5e 60%, #004d40 100%)'

export default function WorkshopsClient({ hero, tierNav, tiers, deliverables, closing, request, productSlideSubhead }: Props) {
  const [activeTierId, setActiveTierId] = useState(tiers[0]?.id ?? '')
  const [detailModal, setDetailModal] = useState<{ tier: TierData; workshop: Workshop } | null>(null)
  const [requestModal, setRequestModal] = useState<string | null>(null)
  const [formData, setFormData] = useState({ name: '', company: '', email: '', message: '' })
  const [submitState, setSubmitState] = useState<'idle' | 'success'>('idle')

  const tierRefs = useRef<Record<string, HTMLElement | null>>({})
  const navLabels: Record<string, string> = {
    strategy:   tierNav.strategy,
    diagnostic: tierNav.diagnostic,
    practice:   tierNav.practice,
    leadership: tierNav.leadership,
  }

  // Scroll tracking via IntersectionObserver
  useEffect(() => {
    const observers: IntersectionObserver[] = []
    tiers.forEach(tier => {
      const el = tierRefs.current[tier.id]
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveTierId(tier.id) },
        { rootMargin: '-30% 0px -60% 0px', threshold: 0 }
      )
      obs.observe(el)
      observers.push(obs)
    })
    return () => observers.forEach(o => o.disconnect())
  }, [tiers])

  // Close modals on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (requestModal !== null) { setRequestModal(null); setSubmitState('idle') }
        else if (detailModal) setDetailModal(null)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [detailModal, requestModal])

  // Prevent body scroll when modal open
  useEffect(() => {
    document.body.style.overflow = (detailModal || requestModal !== null) ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [detailModal, requestModal])

  const scrollToTier = (id: string) => {
    const el = tierRefs.current[id]
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const openRequest = (workshopName: string) => {
    setDetailModal(null)
    setFormData({ name: '', company: '', email: '', message: '' })
    setSubmitState('idle')
    setRequestModal(workshopName)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const subject = encodeURIComponent(`Workshop Request: ${requestModal}`)
    const body = encodeURIComponent(
      `Workshop: ${requestModal}\nName: ${formData.name}\nCompany: ${formData.company}\nEmail: ${formData.email}\nMessage: ${formData.message || '—'}`
    )
    window.open(`mailto:hello@shift-media.io?subject=${subject}&body=${body}`, '_blank')
    setSubmitState('success')
  }

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .wk-fade-up { animation: fadeUp 0.55s cubic-bezier(0.16,1,0.3,1) both; }
        .workshop-card {
          background: rgba(246,245,242,0.07);
          border: 1px solid rgba(246,245,242,0.14);
          border-left: 3px solid transparent;
          padding: 28px 24px;
          cursor: pointer;
          transition: transform 180ms ease, box-shadow 180ms ease, border-left-color 180ms ease, background 180ms ease;
          border-radius: 2px;
        }
        .workshop-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 32px rgba(0,0,0,0.22);
          border-left-color: #00897b;
          background: rgba(246,245,242,0.11);
        }
        .workshop-card.light {
          background: #ffffff;
          border-color: #e2e1de;
          border-left: 3px solid transparent;
        }
        .workshop-card.light:hover {
          border-left-color: #004d40;
          box-shadow: 0 8px 24px rgba(0,77,64,0.12);
          background: #faf9f6;
        }
        .tier-tab {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 18px 0;
          border: none;
          border-top: 1px solid rgba(246,245,242,0.14);
          font-family: var(--font-head);
          font-size: clamp(14px,1.4vw,17px);
          font-weight: 600;
          letter-spacing: -0.01em;
          white-space: nowrap;
          cursor: pointer;
          background: transparent;
          color: rgba(246,245,242,0.45);
          transition: color 200ms ease, border-color 200ms ease;
          width: 100%;
          text-align: left;
        }
        .tier-tab .tier-arrow {
          font-size: 18px;
          transition: transform 200ms ease, opacity 200ms ease;
          opacity: 0;
          transform: translateX(-6px);
        }
        .tier-tab.active {
          color: var(--fg);
          border-top-color: #00897b;
        }
        .tier-tab.active .tier-arrow {
          opacity: 1;
          transform: translateX(0);
          color: #00897b;
        }
        .tier-tab:not(.active):hover {
          color: rgba(246,245,242,0.80);
        }
        .tier-tab:not(.active):hover .tier-arrow {
          opacity: 0.5;
          transform: translateX(0);
        }
        .tier-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0 32px;
          margin-top: 56px;
          padding-top: 0;
        }
        @media (max-width: 767px) {
          .tier-grid { grid-template-columns: 1fr 1fr; gap: 0 20px; }
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

        .wk-main {
          min-height: 100vh;
          font-family: var(--font-head);
        }
      `}</style>

      <main className="wk-main" style={{ background: BODY_GRADIENT }}>

        {/* HERO */}
        <section
          className="wk-fade-up"
          style={{
            padding: 'clamp(120px,18vw,180px) var(--margin-x) clamp(56px,8vw,80px)',
          }}
        >
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', letterSpacing: '0.20em', color: 'rgba(246,245,242,0.55)', marginBottom: '28px' }}>
            {hero.eyebrow}
          </p>
          <h1 style={{ fontWeight: 700, fontSize: 'clamp(64px,9vw,120px)', lineHeight: 0.92, letterSpacing: '-0.03em', color: 'var(--fg)', margin: '0 0 32px', maxWidth: '900px' }}>
            {hero.title}
          </h1>
          <p style={{ fontSize: 'clamp(16px,1.6vw,19px)', lineHeight: 1.6, color: 'rgba(246,245,242,0.78)', maxWidth: '580px', margin: '0 0 20px' }}>
            {hero.body}
          </p>
          <p style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 'clamp(17px,1.5vw,20px)', color: 'rgba(246,245,242,0.65)', margin: 0 }}>
            {hero.subline}
          </p>

          {/* Track selector — embedded in hero, no sticky conflict */}
          <div className="tier-grid">
            {tiers.map(tier => (
              <button
                key={tier.id}
                className={`tier-tab${activeTierId === tier.id ? ' active' : ''}`}
                onClick={() => scrollToTier(tier.id)}
              >
                <span className="tier-arrow">›</span>
                {navLabels[tier.id] ?? tier.name}
              </button>
            ))}
          </div>
        </section>

        {/* TIER SECTIONS */}
        {tiers.map((tier, tierIndex) => {
          const isLight = tierIndex >= 2
          const cardClass = isLight ? 'workshop-card light' : 'workshop-card'

          return (
            <section
              key={tier.id}
              id={tier.id}
              ref={el => { tierRefs.current[tier.id] = el }}
              {...(isLight ? { 'data-theme': 'light' } : {})}
              style={{
                background: 'transparent',
                padding: 'clamp(72px,9vw,100px) var(--margin-x)',
                scrollMarginTop: '80px',
              }}
            >
              {/* Tier header */}
              <div style={{ marginBottom: '56px', maxWidth: '880px' }}>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.20em', textTransform: 'uppercase', color: 'var(--fg-faint)', marginBottom: '18px' }}>
                  — 0{tierIndex + 1} / {tier.name}
                </p>
                <h2 style={{ fontWeight: 700, fontSize: 'clamp(40px,5.5vw,72px)', lineHeight: 0.96, letterSpacing: '-0.025em', color: 'var(--fg)', margin: '0 0 16px' }}>
                  {tier.name}
                </h2>
                <p style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 'clamp(18px,1.8vw,22px)', color: 'var(--fg-muted)', margin: '0 0 24px' }}>
                  {tier.tagline}
                </p>
                <div style={{ height: '1px', background: 'var(--fg-rule)', marginBottom: '24px' }} />
                <p style={{ fontSize: 'clamp(15px,1.4vw,17px)', lineHeight: 1.65, color: 'var(--fg-muted)', maxWidth: '680px' }}>
                  {tier.description}
                </p>
              </div>

              {/* Workshop card grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))',
                gap: '12px',
                marginBottom: '56px',
              }}>
                {tier.workshops.map(workshop => (
                  <div
                    key={workshop.id}
                    className={cardClass}
                    onClick={() => setDetailModal({ tier, workshop })}
                    role="button"
                    tabIndex={0}
                    onKeyDown={e => e.key === 'Enter' && setDetailModal({ tier, workshop })}
                  >
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--fg-faint)', marginBottom: '10px' }}>
                      {tier.name}
                    </p>
                    <h3 style={{ fontWeight: 700, fontSize: 'clamp(17px,1.6vw,20px)', letterSpacing: '-0.01em', color: 'var(--fg)', margin: '0 0 10px', lineHeight: 1.15 }}>
                      {workshop.name}
                    </h3>
                    <p style={{ fontSize: '14px', lineHeight: 1.55, color: 'var(--fg-muted)', margin: 0 }}>
                      {workshop.hook}
                    </p>
                  </div>
                ))}
              </div>

              {/* What follows */}
              <div style={{ borderTop: '1px solid var(--fg-rule)', paddingTop: '28px', maxWidth: '640px' }}>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--fg-faint)', marginBottom: '10px' }}>
                  — What follows
                </p>
                <p style={{ fontSize: '15px', lineHeight: 1.65, color: 'var(--fg-muted)', margin: 0 }}>
                  {tier.followup}
                </p>
              </div>
            </section>
          )
        })}

        {/* DELIVERABLES BLOCK */}
        <section data-theme="light" style={{ background: 'transparent', padding: 'clamp(72px,9vw,100px) var(--margin-x)' }}>
          <div style={{ maxWidth: '1100px' }}>
            <h2 style={{
              fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 700,
              fontSize: 'clamp(32px,4.5vw,60px)', lineHeight: 1.02, letterSpacing: '-0.02em',
              color: 'var(--fg)', margin: '0 0 16px',
            }}>
              {deliverables.title}
            </h2>
            <p style={{ fontSize: 'clamp(15px,1.4vw,17px)', lineHeight: 1.6, color: 'var(--fg-muted)', maxWidth: '540px', margin: '0 0 56px' }}>
              {deliverables.intro}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px,1fr))', gap: '32px 48px' }}>
              {deliverables.items.map((item, i) => (
                <div key={i}>
                  <div style={{ height: '1px', background: 'var(--fg-rule)', marginBottom: '20px' }} />
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--fg-faint)', marginBottom: '10px' }}>
                    — 0{i + 1}
                  </p>
                  <p style={{ fontWeight: 700, fontSize: '17px', color: 'var(--fg)', margin: '0 0 8px' }}>
                    {item.label}
                  </p>
                  <p style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--fg-muted)', margin: 0 }}>
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PRODUCT SLIDE */}
        <ProductSlide subhead={productSlideSubhead} />

        {/* CLOSING CTA — mirrors CtaSection: returning gradient, always-dark bg */}
        <section style={{
          background: CTA_GRADIENT,
          padding: 'clamp(88px,12vw,140px) var(--margin-x) clamp(100px,14vw,160px)',
          textAlign: 'center',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
        }}>
          <p style={{ fontFamily: 'var(--font-head)', fontSize: '13px', letterSpacing: '0.20em', textTransform: 'uppercase', color: 'rgba(246,245,242,0.60)', marginBottom: '24px', fontWeight: 600 }}>
            {closing.eyebrow}
          </p>
          <h2 style={{ fontFamily: 'var(--font-head)', fontWeight: 600, fontSize: 'clamp(48px,6.5vw,88px)', lineHeight: 0.96, letterSpacing: '-0.025em', color: '#f6f5f2', maxWidth: '900px', marginBottom: '24px' }}>
            {closing.title}
          </h2>
          <p style={{ fontSize: 'clamp(17px,1.6vw,21px)', lineHeight: 1.5, color: 'rgba(246,245,242,0.82)', maxWidth: '560px', marginBottom: '40px' }}>
            {closing.body}
          </p>
          <button
            onClick={() => openRequest('')}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '18px 36px', borderRadius: '9999px',
              background: '#f6f5f2', color: '#111111',
              fontFamily: 'var(--font-head)', fontWeight: 600, fontSize: '17px',
              border: 'none', cursor: 'pointer',
              transition: 'transform 180ms ease, box-shadow 180ms ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.20)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = ''
              e.currentTarget.style.boxShadow = ''
            }}
          >
            {closing.cta}
          </button>
        </section>
      </main>

      {/* DETAIL MODAL */}
      {detailModal && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 200,
            background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '16px',
          }}
          onClick={() => setDetailModal(null)}
        >
          <div
            style={{
              background: '#f6f5f2', color: '#111111',
              borderRadius: '4px',
              maxWidth: '640px', width: '100%',
              maxHeight: '90vh', overflowY: 'auto',
              padding: 'clamp(28px,4vw,48px)',
              position: 'relative',
              animation: 'fadeUp 0.3s cubic-bezier(0.16,1,0.3,1) both',
            }}
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setDetailModal(null)}
              style={{
                position: 'absolute', top: '20px', right: '20px',
                background: 'transparent', border: '1px solid rgba(17,17,17,0.20)',
                borderRadius: '999px', width: '32px', height: '32px',
                cursor: 'pointer', fontSize: '16px', color: 'rgba(17,17,17,0.55)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >×</button>

            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(17,17,17,0.45)', marginBottom: '12px' }}>
              {detailModal.tier.name}
            </p>
            <h2 style={{ fontWeight: 700, fontSize: 'clamp(24px,3vw,36px)', letterSpacing: '-0.02em', lineHeight: 1.05, color: '#111111', margin: '0 0 28px' }}>
              {detailModal.workshop.name}
            </h2>

            <div style={{ marginBottom: '24px' }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#004d40', marginBottom: '8px' }}>Why</p>
              <p style={{ fontSize: '15px', lineHeight: 1.65, color: 'rgba(17,17,17,0.80)', margin: 0 }}>{detailModal.workshop.why}</p>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#004d40', marginBottom: '8px' }}>What</p>
              <p style={{ fontSize: '15px', lineHeight: 1.65, color: 'rgba(17,17,17,0.80)', margin: 0 }}>
                <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 700, color: '#111111' }}>
                  {detailModal.workshop.duration} —{' '}
                </span>
                {detailModal.workshop.what}
              </p>
            </div>

            <div style={{ marginBottom: '36px' }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#004d40', marginBottom: '8px' }}>Outcome</p>
              <p style={{ fontSize: '15px', lineHeight: 1.65, color: 'rgba(17,17,17,0.80)', margin: 0 }}>{detailModal.workshop.outcome}</p>
            </div>

            <button
              onClick={() => openRequest(detailModal.workshop.name)}
              style={{
                width: '100%', padding: '15px 24px',
                background: '#004d40', color: 'var(--fg)',
                border: 'none', borderRadius: '999px',
                fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '15px',
                cursor: 'pointer', letterSpacing: '-0.2px',
                transition: 'transform 150ms ease, box-shadow 150ms ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,77,64,0.30)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = ''
                e.currentTarget.style.boxShadow = ''
              }}
            >
              {detailModal.workshop.cta} ›
            </button>
          </div>
        </div>
      )}

      {/* REQUEST MODAL */}
      {requestModal !== null && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 210,
            background: 'rgba(0,0,0,0.60)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '16px',
          }}
          onClick={() => { setRequestModal(null); setSubmitState('idle') }}
        >
          <div
            style={{
              background: '#ffffff', color: '#111111',
              borderRadius: '4px',
              maxWidth: '520px', width: '100%',
              padding: 'clamp(28px,4vw,44px)',
              position: 'relative',
              animation: 'fadeUp 0.3s cubic-bezier(0.16,1,0.3,1) both',
            }}
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => { setRequestModal(null); setSubmitState('idle') }}
              style={{
                position: 'absolute', top: '20px', right: '20px',
                background: 'transparent', border: '1px solid rgba(17,17,17,0.20)',
                borderRadius: '999px', width: '32px', height: '32px',
                cursor: 'pointer', fontSize: '16px', color: 'rgba(17,17,17,0.55)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >×</button>

            {submitState === 'success' ? (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <div style={{ fontSize: '40px', marginBottom: '16px' }}>✓</div>
                <h3 style={{ fontWeight: 700, fontSize: '24px', letterSpacing: '-0.02em', color: '#111111', margin: '0 0 12px' }}>{request.success_title}</h3>
                <p style={{ fontSize: '15px', lineHeight: 1.6, color: 'rgba(17,17,17,0.65)', margin: '0 0 28px' }}>{request.success_body}</p>
                <button
                  onClick={() => { setRequestModal(null); setSubmitState('idle') }}
                  style={{ padding: '12px 28px', background: '#004d40', color: 'var(--fg)', border: 'none', borderRadius: '999px', fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                <h3 style={{ fontWeight: 700, fontSize: 'clamp(20px,2.5vw,26px)', letterSpacing: '-0.02em', color: '#111111', margin: '0 0 8px' }}>
                  {request.title}
                </h3>
                <p style={{ fontSize: '14px', lineHeight: 1.55, color: 'rgba(17,17,17,0.60)', margin: '0 0 28px' }}>
                  {request.subtitle}
                </p>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(17,17,17,0.50)', marginBottom: '6px' }}>
                        {request.field_name}
                      </label>
                      <input
                        type="text" required
                        value={formData.name}
                        onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                        style={{ width: '100%', padding: '10px 12px', border: '1px solid #e2e1de', borderRadius: '2px', fontFamily: 'var(--font-head)', fontSize: '14px', color: '#111111', background: '#faf9f6', outline: 'none', boxSizing: 'border-box' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(17,17,17,0.50)', marginBottom: '6px' }}>
                        {request.field_company}
                      </label>
                      <input
                        type="text" required
                        value={formData.company}
                        onChange={e => setFormData(p => ({ ...p, company: e.target.value }))}
                        style={{ width: '100%', padding: '10px 12px', border: '1px solid #e2e1de', borderRadius: '2px', fontFamily: 'var(--font-head)', fontSize: '14px', color: '#111111', background: '#faf9f6', outline: 'none', boxSizing: 'border-box' }}
                      />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(17,17,17,0.50)', marginBottom: '6px' }}>
                      {request.field_email}
                    </label>
                    <input
                      type="email" required
                      value={formData.email}
                      onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                      style={{ width: '100%', padding: '10px 12px', border: '1px solid #e2e1de', borderRadius: '2px', fontFamily: 'var(--font-head)', fontSize: '14px', color: '#111111', background: '#faf9f6', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(17,17,17,0.50)', marginBottom: '6px' }}>
                      {request.field_workshop}
                    </label>
                    <input
                      type="text" readOnly value={requestModal}
                      style={{ width: '100%', padding: '10px 12px', border: '1px solid #e2e1de', borderRadius: '2px', fontFamily: 'var(--font-head)', fontSize: '14px', color: 'rgba(17,17,17,0.55)', background: '#f0efec', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(17,17,17,0.50)', marginBottom: '6px' }}>
                      {request.field_message}
                    </label>
                    <textarea
                      rows={3}
                      value={formData.message}
                      onChange={e => setFormData(p => ({ ...p, message: e.target.value }))}
                      style={{ width: '100%', padding: '10px 12px', border: '1px solid #e2e1de', borderRadius: '2px', fontFamily: 'var(--font-head)', fontSize: '14px', color: '#111111', background: '#faf9f6', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }}
                    />
                  </div>
                  <button
                    type="submit"
                    style={{
                      padding: '14px 24px', background: '#004d40', color: 'var(--fg)',
                      border: 'none', borderRadius: '999px',
                      fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '15px',
                      cursor: 'pointer', letterSpacing: '-0.2px', marginTop: '4px',
                      transition: 'transform 150ms ease',
                    }}
                  >
                    {request.submit}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
