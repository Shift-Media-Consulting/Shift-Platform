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

// Same gradient as /about — applied to <main> so it maps to page height.
const BODY_GRADIENT =
  'linear-gradient(180deg, #004d40 0%, #2a6f5e 20%, #4f9382 48%, #b9d8d2 78%, #b9d8d2 100%)'

// CtaSection-matching reverse gradient — closing CTA "returns" to dark.
const CTA_GRADIENT =
  'linear-gradient(180deg, #b9d8d2 0%, #2a6f5e 60%, #004d40 100%)'

// Bold-wrap out-of-scope items — Build, Engine, Campaign, Pilot
function renderOutItem(text: string) {
  const parts = text.split(/(Build|Engine|Campaign|Pilot)/g)
  return (
    <>
      {parts.map((part, i) => {
        if (['Build', 'Engine', 'Campaign', 'Pilot'].includes(part)) {
          return <strong key={i} style={{ color: 'var(--fg)', fontWeight: 700 }}>{part}</strong>
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
        .tl-track-bg {
          position: absolute; top: 28px; left: 12.5%; right: 12.5%;
          height: 1px; background: rgba(246,245,242,0.14); z-index: 0;
        }
        .tl-track-fill {
          position: absolute; top: 28px; left: 12.5%;
          height: 1px; background: #00897b; z-index: 0;
          transition: width 0.55s cubic-bezier(0.65,0,0.35,1);
        }
        .tl-node-btn {
          flex: 1; display: flex; flex-direction: column; align-items: center;
          gap: 14px; background: none; border: none; cursor: pointer; padding: 0 8px;
        }
        .tl-node {
          width: 56px; height: 56px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-family: var(--font-mono); font-size: 12px; letter-spacing: 0.06em;
          position: relative; z-index: 1;
          transition: background 0.35s ease, border-color 0.35s ease, color 0.35s ease, box-shadow 0.35s ease;
        }
        .tl-node.active {
          background: #004d40; border: 1.5px solid #00897b; color: #f6f5f2;
          box-shadow: 0 0 0 6px rgba(0,137,123,0.15);
        }
        .tl-node.inactive {
          background: rgba(0,50,42,0.40); border: 1.5px solid rgba(246,245,242,0.16); color: rgba(246,245,242,0.38);
        }
        .tl-node.inactive:hover {
          border-color: rgba(246,245,242,0.40); color: rgba(246,245,242,0.65);
          background: rgba(0,60,50,0.55);
        }
        .tl-label { font-weight: 700; font-size: clamp(13px,1.2vw,15px); letter-spacing: -0.015em; margin: 0 0 4px; transition: color 0.35s ease; text-align: center; }
        .tl-duration { font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(246,245,242,0.32); margin: 0; }
        .tl-detail {
          margin-top: 48px;
          border-left: 2px solid #00897b;
          padding: 0 0 0 28px;
          animation: fadeUp 0.35s cubic-bezier(0.16,1,0.3,1) both;
        }
        /* mobile vertical track */
        .tl-desktop { display: block; }
        .tl-mobile  { display: none; }
        .tl-mobile-item {
          display: flex; gap: 20px; align-items: flex-start;
          padding: 0 0 32px 0;
        }
        .tl-mobile-item:last-child { padding-bottom: 0; }
        .tl-mobile-spine {
          display: flex; flex-direction: column; align-items: center; flex-shrink: 0;
        }
        .tl-mobile-dot {
          width: 40px; height: 40px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.05em;
          background: rgba(0,50,42,0.50); border: 1.5px solid rgba(246,245,242,0.20);
          color: rgba(246,245,242,0.55); flex-shrink: 0;
        }
        .tl-mobile-connector {
          width: 1px; flex: 1; min-height: 28px;
          background: rgba(246,245,242,0.14); margin: 6px 0;
        }
        @media (max-width: 767px) {
          .tl-desktop { display: none; }
          .tl-mobile  { display: flex; flex-direction: column; }
        }
        .scope-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 10px 0;
          border-bottom: 1px solid var(--fg-rule);
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

        .pilot-main {
          min-height: 100vh;
          font-family: var(--font-head);
        }
      `}</style>

      <main className="pilot-main" style={{ background: BODY_GRADIENT }}>

        {/* SECTION A: HERO */}
        <section
          className="pilot-fade-up"
          style={{ padding: 'clamp(120px,16vw,180px) var(--margin-x) clamp(56px,8vw,80px)' }}
        >
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', letterSpacing: '0.20em', color: 'rgba(246,245,242,0.55)', marginBottom: '28px' }}>
            {hero.eyebrow}
          </p>
          <h1 style={{ fontWeight: 700, fontSize: 'clamp(64px,9vw,120px)', lineHeight: 0.92, letterSpacing: '-0.03em', color: 'var(--fg)', margin: '0 0 32px', maxWidth: '900px' }}>
            {hero.title}
          </h1>
          <p style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 'clamp(18px,1.8vw,22px)', color: 'var(--fg-muted)', maxWidth: '620px', margin: '0 0 20px' }}>
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
          style={{ background: 'transparent', padding: 'clamp(72px,9vw,100px) var(--margin-x)' }}
        >
          <div style={{ maxWidth: '720px' }}>
            <h2 style={{ fontWeight: 700, fontSize: 'clamp(22px,2.2vw,28px)', lineHeight: 1.2, letterSpacing: '-0.015em', color: 'var(--fg)', margin: '0 0 8px' }}>
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
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.20em', textTransform: 'uppercase', color: 'var(--fg-faint)', marginBottom: '18px' }}>
            {projectTypes.eyebrow}
          </p>
          <h2 style={{ fontWeight: 700, fontSize: 'clamp(32px,4.5vw,56px)', lineHeight: 1.02, letterSpacing: '-0.025em', color: 'var(--fg)', margin: '0 0 48px', maxWidth: '720px' }}>
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
                <h3 style={{ fontWeight: 700, fontSize: 'clamp(17px,1.6vw,20px)', letterSpacing: '-0.01em', color: 'var(--fg)', margin: '0 0 10px', lineHeight: 1.15 }}>
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
        {(() => {
          const activeIndex = timeline.phases.findIndex(p => p.id === activePhase)
          const progressPct = activeIndex >= 0 ? (activeIndex / (timeline.phases.length - 1)) * 75 : 0
          const activePhaseData = timeline.phases[activeIndex] ?? timeline.phases[0]
          return (
            <section
              ref={timelineRef as React.RefObject<HTMLDivElement>}
              className="fade-section"
              style={{ padding: 'clamp(72px,9vw,100px) var(--margin-x)', background: 'transparent' }}
            >
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.20em', textTransform: 'uppercase', color: 'var(--fg-faint)', marginBottom: '18px' }}>
                {timeline.eyebrow}
              </p>
              <h2 style={{ fontWeight: 700, fontSize: 'clamp(28px,4vw,48px)', lineHeight: 1.02, letterSpacing: '-0.025em', color: 'var(--fg)', margin: '0 0 56px', maxWidth: '600px' }}>
                {timeline.heading}
              </h2>

              {/* ── Desktop track ── */}
              <div className="tl-desktop">
                <div style={{ position: 'relative' }}>
                  <div className="tl-track-bg" />
                  <div className="tl-track-fill" style={{ width: `${progressPct}%` }} />
                  <div style={{ display: 'flex' }}>
                    {timeline.phases.map((phase) => {
                      const isActive = activePhase === phase.id
                      return (
                        <button
                          key={phase.id}
                          className="tl-node-btn"
                          onClick={() => setActivePhase(phase.id)}
                        >
                          <div className={`tl-node ${isActive ? 'active' : 'inactive'}`}>
                            {phase.numeral}
                          </div>
                          <div>
                            <p className="tl-label" style={{ color: isActive ? '#f6f5f2' : 'rgba(246,245,242,0.45)' }}>
                              {phase.label}
                            </p>
                            <p className="tl-duration">{phase.duration}</p>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Detail panel */}
                {activePhaseData && (
                  <div key={activePhaseData.id} className="tl-detail">
                    <p style={{ fontSize: 'clamp(14px,1.3vw,16px)', lineHeight: 1.75, color: 'rgba(246,245,242,0.78)', margin: '0 0 28px', maxWidth: '680px' }}>
                      {activePhaseData.description}
                    </p>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#00897b', margin: '0 0 8px' }}>
                      Deliverable
                    </p>
                    <p style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 'clamp(16px,1.5vw,19px)', lineHeight: 1.6, color: 'var(--fg)', margin: 0 }}>
                      {activePhaseData.deliverable}
                    </p>
                  </div>
                )}
              </div>

              {/* ── Mobile vertical track ── */}
              <div className="tl-mobile">
                {timeline.phases.map((phase, i) => (
                  <div key={phase.id} className="tl-mobile-item">
                    <div className="tl-mobile-spine">
                      <div className="tl-mobile-dot">{phase.numeral}</div>
                      {i < timeline.phases.length - 1 && <div className="tl-mobile-connector" />}
                    </div>
                    <div style={{ paddingTop: '8px', paddingBottom: i < timeline.phases.length - 1 ? '16px' : 0 }}>
                      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(246,245,242,0.38)', margin: '0 0 5px' }}>
                        {phase.duration}
                      </p>
                      <p style={{ fontWeight: 700, fontSize: '16px', color: 'var(--fg)', letterSpacing: '-0.01em', margin: '0 0 10px' }}>
                        {phase.label}
                      </p>
                      <p style={{ fontSize: '14px', lineHeight: 1.7, color: 'var(--fg-muted)', margin: '0 0 12px' }}>
                        {phase.description}
                      </p>
                      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#00897b', margin: '0 0 4px' }}>
                        Deliverable
                      </p>
                      <p style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '15px', lineHeight: 1.6, color: 'var(--fg)', margin: 0 }}>
                        {phase.deliverable}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )
        })()}

        {/* SECTION E: IN SCOPE / OUT OF SCOPE */}
        <section
          ref={scopeRef as React.RefObject<HTMLDivElement>}
          className="fade-section"
          data-theme="light"
          style={{ background: 'transparent', padding: 'clamp(72px,9vw,100px) var(--margin-x)' }}
        >
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.20em', textTransform: 'uppercase', color: 'var(--fg-faint)', marginBottom: '18px' }}>
            {scope.eyebrow}
          </p>
          <h2 style={{ fontWeight: 700, fontSize: 'clamp(32px,4.5vw,56px)', lineHeight: 1.02, letterSpacing: '-0.025em', color: 'var(--fg)', margin: '0 0 52px', maxWidth: '720px' }}>
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
                  <div key={i} className="scope-item" style={{ color: 'var(--fg)' }}>
                    <span style={{ color: '#004d40', fontWeight: 700, flexShrink: 0, lineHeight: 1.5 }}>✓</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Out of scope */}
            <div>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--fg-faint)', marginBottom: '16px', fontWeight: 600 }}>
                {scope.out_label}
              </p>
              <div>
                {scope.out_items.map((item, i) => (
                  <div key={i} className="scope-item" style={{ color: 'var(--fg-muted)' }}>
                    <span style={{ color: 'var(--fg-faint)', flexShrink: 0, lineHeight: 1.5 }}>–</span>
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
          data-theme="light"
          style={{ background: 'transparent', padding: 'clamp(72px,9vw,100px) var(--margin-x)' }}
        >
          <div style={{ maxWidth: '1100px' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.20em', textTransform: 'uppercase', color: 'var(--fg-faint)', marginBottom: '18px' }}>
              {deliverables.eyebrow}
            </p>
            <h2 style={{
              fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 700,
              fontSize: 'clamp(28px,4vw,52px)', lineHeight: 1.08, letterSpacing: '-0.02em',
              color: 'var(--fg)', margin: '0 0 56px', maxWidth: '720px',
            }}>
              {deliverables.heading}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px,1fr))', gap: '32px 48px' }}>
              {deliverables.items.map((item, i) => (
                <div key={i}>
                  <div style={{ height: '1px', background: 'var(--fg-rule)', marginBottom: '20px' }} />
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--fg-faint)', marginBottom: '10px' }}>
                    — 0{i + 1}
                  </p>
                  <p style={{ fontWeight: 700, fontSize: '17px', color: 'var(--fg)', margin: '0 0 8px', lineHeight: 1.3 }}>
                    {item.label}
                  </p>
                  <p style={{ fontSize: '14px', lineHeight: 1.65, color: 'var(--fg-muted)', margin: 0 }}>
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION G: PRODUCT SLIDE */}
        <ProductSlide subhead={productSlideSubhead} />

        {/* SECTION H: CLOSING CTA — mirrors CtaSection: returning gradient, always-dark bg */}
        <section
          ref={closingRef as React.RefObject<HTMLDivElement>}
          className="fade-section"
          style={{
            background: CTA_GRADIENT,
            padding: 'clamp(88px,12vw,140px) var(--margin-x) clamp(100px,14vw,160px)',
            textAlign: 'center',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
          }}
        >
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
            onClick={() => openRequest()}
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
                  style={{ padding: '12px 28px', background: '#004d40', color: 'var(--fg)', border: 'none', borderRadius: '999px', fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}
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
