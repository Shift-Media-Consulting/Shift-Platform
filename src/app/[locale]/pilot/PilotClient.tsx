'use client'

import { useEffect, useRef, useState } from 'react'
import ProductSlide from '@/components/marketing/ProductSlide'

type HeroData = { eyebrow: string; title: string; body: string; subline: string }
type DefinitionData = { lead: string; sub: string; p2: string; p3: string }
type CardData = { id: string; title: string; hook: string; detail: string }
type ProjectTypesData = { eyebrow: string; heading: string; cards: CardData[] }
type PhaseData = { id: string; numeral: string; label: string; duration: string; description: string; deliverable: string }
type TimelineData = { eyebrow: string; heading: string; phases: PhaseData[] }
type ScopeData = { eyebrow: string; heading: string; in_label: string; out_label: string; in_items: string[]; out_items: string[] }
type DeliverableItem = { label: string; body: string }
type DeliverablesData = { eyebrow: string; heading: string; items: DeliverableItem[] }
type ClosingData = { eyebrow: string; title: string; body: string; cta: string }
type RequestData = {
  title: string; subtitle: string;
  field_name: string; field_company: string; field_email: string;
  field_project: string; field_message: string;
  submit: string; success_title: string; success_body: string;
}

interface Props {
  hero: HeroData
  definition: DefinitionData
  projectTypes: ProjectTypesData
  timeline: TimelineData
  scope: ScopeData
  deliverables: DeliverablesData
  closing: ClosingData
  request: RequestData
  productSlideSubhead: string
}

const BODY_GRADIENT = 'linear-gradient(180deg, #004d40 0%, #2a6f5e 22%, #4f9382 50%, #b9d8d2 72%, #f6f5f2 90%)'

// Bold-wrap out-of-scope items — Build, Engine, Campaign, Pilot
function renderOutItem(text: string) {
  const parts = text.split(/(Build|Engine|Campaign|Pilot)/g)
  return (
    <>
      {parts.map((part, i) => {
        if (['Build', 'Engine', 'Campaign', 'Pilot'].includes(part)) {
          return <strong key={i} style={{ color: 'rgba(17,17,17,0.75)', fontWeight: 700 }}>{part}</strong>
        }
        return <span key={i}>{part}</span>
      })}
    </>
  )
}

function useFadeIn() {
  const ref = useRef<HTMLElement | null>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = '1'
          el.style.transform = 'translateY(0)'
          obs.disconnect()
        }
      },
      { threshold: 0.06 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return ref
}

export default function PilotClient({
  hero, definition, projectTypes, timeline, scope, deliverables, closing, request, productSlideSubhead,
}: Props) {
  const [cardModal, setCardModal] = useState<CardData | null>(null)
  const [phaseModal, setPhaseModal] = useState<PhaseData | null>(null)
  const [requestOpen, setRequestOpen] = useState(false)
  const [formData, setFormData] = useState({ name: '', company: '', email: '', project: '', message: '' })
  const [submitState, setSubmitState] = useState<'idle' | 'success'>('idle')
  const [activePhase, setActivePhase] = useState<string>(timeline.phases[0]?.id ?? '')

  const defRef = useFadeIn() as React.RefObject<HTMLElement>
  const typesRef = useFadeIn() as React.RefObject<HTMLElement>
  const timelineRef = useFadeIn() as React.RefObject<HTMLElement>
  const scopeRef = useFadeIn() as React.RefObject<HTMLElement>
  const delRef = useFadeIn() as React.RefObject<HTMLElement>
  const closingRef = useFadeIn() as React.RefObject<HTMLElement>

  const anyModalOpen = !!(cardModal || phaseModal || requestOpen)

  // Close modals on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (requestOpen) { setRequestOpen(false); setSubmitState('idle') }
        else if (phaseModal) setPhaseModal(null)
        else if (cardModal) setCardModal(null)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [cardModal, phaseModal, requestOpen])

  // Prevent body scroll when modal open
  useEffect(() => {
    document.body.style.overflow = anyModalOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [anyModalOpen])

  const openRequest = (projectType = '') => {
    setCardModal(null)
    setFormData({ name: '', company: '', email: '', project: projectType, message: '' })
    setSubmitState('idle')
    setRequestOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const subject = encodeURIComponent(`Pilot Inquiry: ${formData.project || 'General'}`)
    const body = encodeURIComponent(
      `Name: ${formData.name}\nCompany: ${formData.company}\nEmail: ${formData.email}\nProject: ${formData.project}\nMessage: ${formData.message || '—'}`
    )
    window.open(`mailto:hello@shift-media.io?subject=${subject}&body=${body}`, '_blank')
    setSubmitState('success')
  }

  const activePhaseData = timeline.phases.find(p => p.id === activePhase) ?? null

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .pilot-fade-up { animation: fadeUp 0.55s cubic-bezier(0.16,1,0.3,1) both; }
        .fade-section {
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 0.65s cubic-bezier(0.16,1,0.3,1), transform 0.65s cubic-bezier(0.16,1,0.3,1);
        }
        .pilot-card {
          background: rgba(246,245,242,0.07);
          border: 1px solid rgba(246,245,242,0.14);
          border-left: 3px solid transparent;
          padding: 28px 24px;
          cursor: pointer;
          transition: transform 180ms ease, box-shadow 180ms ease, border-left-color 180ms ease, background 180ms ease;
          border-radius: 2px;
        }
        .pilot-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 32px rgba(0,0,0,0.22);
          border-left-color: #00897b;
          background: rgba(246,245,242,0.11);
        }
        .phase-block {
          flex: 1;
          padding: 20px 18px;
          border: 1px solid rgba(246,245,242,0.16);
          border-radius: 2px;
          cursor: pointer;
          transition: background 200ms ease, border-color 200ms ease;
          text-align: center;
        }
        .phase-block.active {
          background: rgba(0,77,64,0.45);
          border-color: #00897b;
        }
        .phase-block:not(.active):hover {
          background: rgba(246,245,242,0.06);
        }
        .scope-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 10px 0;
          border-bottom: 1px solid rgba(17,17,17,0.08);
          font-size: 15px;
          line-height: 1.5;
        }
        .scope-item:last-child { border-bottom: none; }
        .input-field {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #e2e1de;
          border-radius: 2px;
          font-family: var(--font-head);
          font-size: 14px;
          color: #111111;
          background: #faf9f6;
          outline: none;
          box-sizing: border-box;
          transition: border-color 150ms ease;
        }
        .input-field:focus { border-color: #004d40; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <main style={{ background: BODY_GRADIENT, minHeight: '100vh', fontFamily: 'var(--font-head)' }}>

        {/* SECTION A: HERO */}
        <section
          className="pilot-fade-up"
          style={{ padding: 'clamp(120px,16vw,180px) var(--margin-x) clamp(56px,8vw,80px)' }}
        >
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', letterSpacing: '0.20em', color: 'rgba(246,245,242,0.55)', marginBottom: '28px' }}>
            {hero.eyebrow}
          </p>
          <h1 style={{ fontWeight: 700, fontSize: 'clamp(64px,9vw,120px)', lineHeight: 0.92, letterSpacing: '-0.03em', color: '#f6f5f2', margin: '0 0 32px', maxWidth: '900px' }}>
            {hero.title}
          </h1>
          <p style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 'clamp(18px,1.8vw,22px)', color: 'rgba(246,245,242,0.72)', maxWidth: '620px', margin: '0 0 20px' }}>
            {hero.subline}
          </p>
          <p style={{ fontSize: 'clamp(15px,1.5vw,18px)', lineHeight: 1.65, color: 'rgba(246,245,242,0.70)', maxWidth: '560px', margin: 0 }}>
            {hero.body}
          </p>
        </section>

        {/* SECTION B: WHAT PILOT IS */}
        <section
          ref={defRef as React.RefObject<HTMLDivElement>}
          className="fade-section"
          style={{ background: 'rgba(0,60,50,0.40)', padding: 'clamp(72px,9vw,100px) var(--margin-x)' }}
        >
          <div style={{ maxWidth: '720px' }}>
            <h2 style={{ fontWeight: 700, fontSize: 'clamp(22px,2.2vw,28px)', lineHeight: 1.2, letterSpacing: '-0.015em', color: '#f6f5f2', margin: '0 0 8px' }}>
              {definition.lead}
            </h2>
            <p style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 'clamp(17px,1.6vw,20px)', color: 'rgba(246,245,242,0.65)', margin: '0 0 36px' }}>
              {definition.sub}
            </p>
            <p style={{ fontSize: 'clamp(15px,1.4vw,17px)', lineHeight: 1.7, color: 'rgba(246,245,242,0.78)', margin: '0 0 22px' }}>
              {definition.p2}
            </p>
            <p style={{ fontSize: 'clamp(15px,1.4vw,17px)', lineHeight: 1.7, color: 'rgba(246,245,242,0.78)', margin: 0 }}>
              {definition.p3}
            </p>
          </div>
        </section>

        {/* SECTION C: PROJECT TYPE CARDS */}
        <section
          ref={typesRef as React.RefObject<HTMLDivElement>}
          className="fade-section"
          style={{ padding: 'clamp(72px,9vw,100px) var(--margin-x)' }}
        >
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.20em', textTransform: 'uppercase', color: 'rgba(246,245,242,0.45)', marginBottom: '18px' }}>
            {projectTypes.eyebrow}
          </p>
          <h2 style={{ fontWeight: 700, fontSize: 'clamp(32px,4.5vw,56px)', lineHeight: 1.02, letterSpacing: '-0.025em', color: '#f6f5f2', margin: '0 0 48px', maxWidth: '720px' }}>
            {projectTypes.heading}
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))',
            gap: '12px',
          }}>
            {projectTypes.cards.map(card => (
              <div
                key={card.id}
                className="pilot-card"
                onClick={() => setCardModal(card)}
                role="button"
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && setCardModal(card)}
              >
                <h3 style={{ fontWeight: 700, fontSize: 'clamp(17px,1.6vw,20px)', letterSpacing: '-0.01em', color: '#f6f5f2', margin: '0 0 10px', lineHeight: 1.15 }}>
                  {card.title}
                </h3>
                <p style={{ fontSize: '14px', lineHeight: 1.55, color: 'rgba(246,245,242,0.62)', margin: 0 }}>
                  {card.hook}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION D: HOW A PILOT RUNS */}
        <section
          ref={timelineRef as React.RefObject<HTMLDivElement>}
          className="fade-section"
          style={{ padding: 'clamp(72px,9vw,100px) var(--margin-x)', background: 'rgba(0,105,92,0.25)' }}
        >
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.20em', textTransform: 'uppercase', color: 'rgba(246,245,242,0.45)', marginBottom: '18px' }}>
            {timeline.eyebrow}
          </p>
          <h2 style={{ fontWeight: 700, fontSize: 'clamp(32px,4.5vw,56px)', lineHeight: 1.02, letterSpacing: '-0.025em', color: '#f6f5f2', margin: '0 0 48px', maxWidth: '720px' }}>
            {timeline.heading}
          </h2>

          {/* Desktop: horizontal phase row */}
          <div className="hidden md:flex" style={{ gap: '8px', marginBottom: '4px' }}>
            {timeline.phases.map(phase => (
              <div
                key={phase.id}
                className={`phase-block${activePhase === phase.id ? ' active' : ''}`}
                onClick={() => setActivePhase(activePhase === phase.id ? '' : phase.id)}
              >
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(246,245,242,0.45)', margin: '0 0 6px' }}>
                  {phase.numeral}
                </p>
                <p style={{ fontWeight: 700, fontSize: '17px', color: '#f6f5f2', margin: '0 0 4px', letterSpacing: '-0.01em' }}>
                  {phase.label}
                </p>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'rgba(246,245,242,0.55)', margin: 0 }}>
                  {phase.duration}
                </p>
              </div>
            ))}
          </div>

          {/* Desktop: expanded phase detail */}
          <div className="hidden md:block" style={{ minHeight: '180px' }}>
            {activePhaseData && (
              <div style={{
                background: 'rgba(0,77,64,0.35)',
                border: '1px solid rgba(246,245,242,0.14)',
                borderTop: '2px solid #00897b',
                padding: 'clamp(24px,3vw,36px)',
                animation: 'fadeUp 0.3s cubic-bezier(0.16,1,0.3,1) both',
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                  <div>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#00897b', marginBottom: '10px' }}>
                      Description
                    </p>
                    <p style={{ fontSize: '15px', lineHeight: 1.7, color: 'rgba(246,245,242,0.82)', margin: 0 }}>
                      {activePhaseData.description}
                    </p>
                  </div>
                  <div>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#00897b', marginBottom: '10px' }}>
                      Deliverable
                    </p>
                    <p style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '16px', lineHeight: 1.6, color: '#f6f5f2', margin: 0 }}>
                      {activePhaseData.deliverable}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Mobile: accordion */}
          <div className="md:hidden" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {timeline.phases.map(phase => (
              <div key={phase.id} style={{ border: '1px solid rgba(17,17,17,0.12)', borderRadius: '2px', overflow: 'hidden', marginBottom: '8px' }}>
                <button
                  onClick={() => setActivePhase(activePhase === phase.id ? '' : phase.id)}
                  style={{
                    width: '100%',
                    padding: '18px 20px',
                    background: activePhase === phase.id ? 'rgba(0,77,64,0.40)' : 'rgba(246,245,242,0.05)',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    textAlign: 'left',
                  }}
                >
                  <div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.16em', color: 'rgba(246,245,242,0.45)', display: 'block', marginBottom: '4px' }}>
                      {phase.numeral} / {phase.duration}
                    </span>
                    <span style={{ fontWeight: 700, fontSize: '17px', color: '#f6f5f2', letterSpacing: '-0.01em' }}>
                      {phase.label}
                    </span>
                  </div>
                  <span style={{ color: 'rgba(246,245,242,0.55)', fontSize: '18px', transform: activePhase === phase.id ? 'rotate(180deg)' : 'none', transition: 'transform 280ms ease' }}>
                    ↓
                  </span>
                </button>
                {activePhase === phase.id && (
                  <div style={{ padding: '20px', background: 'rgba(0,77,64,0.20)', borderTop: '1px solid rgba(246,245,242,0.10)' }}>
                    <p style={{ fontSize: '14px', lineHeight: 1.7, color: 'rgba(246,245,242,0.78)', margin: '0 0 16px' }}>
                      {phase.description}
                    </p>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#00897b', margin: '0 0 6px' }}>
                      Deliverable
                    </p>
                    <p style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '15px', lineHeight: 1.6, color: '#f6f5f2', margin: 0 }}>
                      {phase.deliverable}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* SECTION E: IN SCOPE / OUT OF SCOPE */}
        <section
          ref={scopeRef as React.RefObject<HTMLDivElement>}
          className="fade-section"
          data-theme="light"
          style={{ background: '#f6f5f2', padding: 'clamp(72px,9vw,100px) var(--margin-x)' }}
        >
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.20em', textTransform: 'uppercase', color: 'rgba(17,17,17,0.40)', marginBottom: '18px' }}>
            {scope.eyebrow}
          </p>
          <h2 style={{ fontWeight: 700, fontSize: 'clamp(32px,4.5vw,56px)', lineHeight: 1.02, letterSpacing: '-0.025em', color: '#111111', margin: '0 0 52px', maxWidth: '720px' }}>
            {scope.heading}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '48px' }}>
            {/* In scope */}
            <div>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#004d40', marginBottom: '16px', fontWeight: 600 }}>
                {scope.in_label}
              </p>
              <div>
                {scope.in_items.map((item, i) => (
                  <div key={i} className="scope-item" style={{ color: '#111111' }}>
                    <span style={{ color: '#004d40', fontWeight: 700, flexShrink: 0, lineHeight: 1.5 }}>✓</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Out of scope */}
            <div>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(17,17,17,0.40)', marginBottom: '16px', fontWeight: 600 }}>
                {scope.out_label}
              </p>
              <div>
                {scope.out_items.map((item, i) => (
                  <div key={i} className="scope-item" style={{ color: 'rgba(17,17,17,0.55)' }}>
                    <span style={{ color: 'rgba(17,17,17,0.30)', flexShrink: 0, lineHeight: 1.5 }}>–</span>
                    <span style={{ fontSize: '14px' }}>{renderOutItem(item)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION F: WHAT YOU GET */}
        <section
          ref={delRef as React.RefObject<HTMLDivElement>}
          className="fade-section"
          style={{ background: '#004d40', padding: 'clamp(72px,9vw,100px) var(--margin-x)' }}
        >
          <div style={{ maxWidth: '1100px' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.20em', textTransform: 'uppercase', color: 'rgba(246,245,242,0.45)', marginBottom: '18px' }}>
              {deliverables.eyebrow}
            </p>
            <h2 style={{
              fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 700,
              fontSize: 'clamp(28px,4vw,52px)', lineHeight: 1.08, letterSpacing: '-0.02em',
              color: '#f6f5f2', margin: '0 0 56px', maxWidth: '720px',
            }}>
              {deliverables.heading}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px,1fr))', gap: '32px 48px' }}>
              {deliverables.items.map((item, i) => (
                <div key={i}>
                  <div style={{ height: '1px', background: 'rgba(246,245,242,0.22)', marginBottom: '20px' }} />
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(246,245,242,0.45)', marginBottom: '10px' }}>
                    — 0{i + 1}
                  </p>
                  <p style={{ fontWeight: 700, fontSize: '17px', color: '#f6f5f2', margin: '0 0 8px', lineHeight: 1.3 }}>
                    {item.label}
                  </p>
                  <p style={{ fontSize: '14px', lineHeight: 1.65, color: 'rgba(246,245,242,0.70)', margin: 0 }}>
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION G: PRODUCT SLIDE */}
        <ProductSlide subhead={productSlideSubhead} />

        {/* SECTION H: CLOSING CTA */}
        <section
          ref={closingRef as React.RefObject<HTMLDivElement>}
          className="fade-section"
          data-theme="light"
          style={{ background: '#f6f5f2', padding: 'clamp(80px,10vw,120px) var(--margin-x)', textAlign: 'center' }}
        >
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.20em', color: 'rgba(17,17,17,0.40)', marginBottom: '24px' }}>
            {closing.eyebrow}
          </p>
          <h2 style={{ fontWeight: 700, fontSize: 'clamp(32px,5vw,64px)', lineHeight: 1.0, letterSpacing: '-0.025em', color: '#111111', margin: '0 0 24px' }}>
            {closing.title}
          </h2>
          <p style={{ fontSize: 'clamp(15px,1.5vw,18px)', lineHeight: 1.6, color: 'rgba(17,17,17,0.65)', maxWidth: '480px', margin: '0 auto 40px' }}>
            {closing.body}
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center' }}>
            <button
              onClick={() => openRequest()}
              style={{
                display: 'inline-block',
                background: '#004d40', color: '#f6f5f2',
                fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '15px', letterSpacing: '-0.2px',
                padding: '14px 32px', borderRadius: '999px',
                border: 'none', cursor: 'pointer',
                transition: 'transform 200ms ease, box-shadow 200ms ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,77,64,0.28)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = ''
                e.currentTarget.style.boxShadow = ''
              }}
            >
              {closing.cta}
            </button>
            <a
              href="mailto:hello@shift-media.io"
              style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', letterSpacing: '0.14em', color: 'rgba(17,17,17,0.55)', textDecoration: 'none' }}
            >
              HELLO@SHIFT-MEDIA.IO
            </a>
          </div>
        </section>

      </main>

      {/* CARD DETAIL MODAL */}
      {cardModal && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 200,
            background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '16px',
          }}
          onClick={() => setCardModal(null)}
        >
          <div
            style={{
              background: '#f6f5f2', color: '#111111',
              borderRadius: '4px',
              maxWidth: '580px', width: '100%',
              maxHeight: '90vh', overflowY: 'auto',
              padding: 'clamp(28px,4vw,48px)',
              position: 'relative',
              animation: 'fadeUp 0.3s cubic-bezier(0.16,1,0.3,1) both',
            }}
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setCardModal(null)}
              style={{
                position: 'absolute', top: '20px', right: '20px',
                background: 'transparent', border: '1px solid rgba(17,17,17,0.20)',
                borderRadius: '999px', width: '32px', height: '32px',
                cursor: 'pointer', fontSize: '16px', color: 'rgba(17,17,17,0.55)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >×</button>

            <h2 style={{ fontWeight: 700, fontSize: 'clamp(22px,3vw,32px)', letterSpacing: '-0.02em', lineHeight: 1.05, color: '#111111', margin: '0 0 12px', paddingRight: '40px' }}>
              {cardModal.title}
            </h2>
            <p style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '17px', lineHeight: 1.55, color: 'rgba(17,17,17,0.65)', margin: '0 0 24px' }}>
              {cardModal.hook}
            </p>

            <div style={{ height: '1px', background: 'rgba(17,17,17,0.10)', marginBottom: '20px' }} />

            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#004d40', marginBottom: '8px' }}>
              What SHIFT covers
            </p>
            <p style={{ fontSize: '15px', lineHeight: 1.7, color: 'rgba(17,17,17,0.80)', margin: '0 0 32px' }}>
              {cardModal.detail}
            </p>

            <button
              onClick={() => openRequest(cardModal.title)}
              style={{
                width: '100%', padding: '15px 24px',
                background: '#004d40', color: '#f6f5f2',
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
              Start a conversation
            </button>
          </div>
        </div>
      )}

      {/* REQUEST MODAL */}
      {requestOpen && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 210,
            background: 'rgba(0,0,0,0.60)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '16px',
          }}
          onClick={() => { setRequestOpen(false); setSubmitState('idle') }}
        >
          <div
            style={{
              background: '#ffffff', color: '#111111',
              borderRadius: '4px',
              maxWidth: '520px', width: '100%',
              maxHeight: '90vh', overflowY: 'auto',
              padding: 'clamp(28px,4vw,44px)',
              position: 'relative',
              animation: 'fadeUp 0.3s cubic-bezier(0.16,1,0.3,1) both',
            }}
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => { setRequestOpen(false); setSubmitState('idle') }}
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
                <h3 style={{ fontWeight: 700, fontSize: '24px', letterSpacing: '-0.02em', color: '#111111', margin: '0 0 12px' }}>
                  {request.success_title}
                </h3>
                <p style={{ fontSize: '15px', lineHeight: 1.6, color: 'rgba(17,17,17,0.65)', margin: '0 0 28px' }}>
                  {request.success_body}
                </p>
                <button
                  onClick={() => { setRequestOpen(false); setSubmitState('idle') }}
                  style={{ padding: '12px 28px', background: '#004d40', color: '#f6f5f2', border: 'none', borderRadius: '999px', fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                <h3 style={{ fontWeight: 700, fontSize: 'clamp(20px,2.5vw,26px)', letterSpacing: '-0.02em', color: '#111111', margin: '0 0 8px', paddingRight: '40px' }}>
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
                        className="input-field"
                        value={formData.name}
                        onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(17,17,17,0.50)', marginBottom: '6px' }}>
                        {request.field_company}
                      </label>
                      <input
                        type="text" required
                        className="input-field"
                        value={formData.company}
                        onChange={e => setFormData(p => ({ ...p, company: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(17,17,17,0.50)', marginBottom: '6px' }}>
                      {request.field_email}
                    </label>
                    <input
                      type="email" required
                      className="input-field"
                      value={formData.email}
                      onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(17,17,17,0.50)', marginBottom: '6px' }}>
                      {request.field_project}
                    </label>
                    <input
                      type="text"
                      className="input-field"
                      value={formData.project}
                      onChange={e => setFormData(p => ({ ...p, project: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(17,17,17,0.50)', marginBottom: '6px' }}>
                      {request.field_message}
                    </label>
                    <textarea
                      rows={4}
                      className="input-field"
                      value={formData.message}
                      onChange={e => setFormData(p => ({ ...p, message: e.target.value }))}
                      style={{ resize: 'vertical' }}
                    />
                  </div>
                  <button
                    type="submit"
                    style={{
                      padding: '14px 24px', background: '#004d40', color: '#f6f5f2',
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
