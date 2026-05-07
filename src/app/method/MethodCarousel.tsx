'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

const EASE     = 'cubic-bezier(0.65,0,0.35,1)'
const DURATION = 0.8
const GAP      = 28

type CardData = {
  numeral: string
  kind: string
  h3: string
  para: string
}

const CARDS: CardData[] = [
  {
    numeral: 'i.',
    kind: '— The diagnostic',
    h3: 'The diagnostic.',
    para: 'RAG-scored across all six dimensions, with evidence, root-cause analysis, and indicative benchmarks. The picture, not the pitch.',
  },
  {
    numeral: 'ii.',
    kind: '— The roadmap',
    h3: 'The roadmap.',
    para: 'What to fix first. What to fix next. What to leave alone. Sequenced by impact and effort, not by what we\'d like to sell you.',
  },
  {
    numeral: 'iii.',
    kind: '— The recommendation',
    h3: 'A memo.',
    para: 'A clear view on which engagement type comes next — or whether you don\'t need one yet. Signed. On the record.',
  },
]

const CARD_COUNT = CARDS.length

function lerp(a: number, b: number, t: number) { return a + (b - a) * t }

/* ── Card visuals ──────────────────────────────────────────────────── */

function DiagnosticVisual() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', flex: 1 }}>
      <div style={{ position: 'relative', width: '130px', height: '170px' }}>
        {[
          { rot: '-3deg', z: 1, bg: 'rgba(246,245,242,0.06)' },
          { rot: '2deg',  z: 2, bg: 'rgba(246,245,242,0.08)' },
          { rot: '6deg',  z: 3, bg: 'rgba(246,245,242,0.10)' },
        ].map((tile, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '6px',
              background: tile.bg,
              backdropFilter: 'blur(6px)',
              WebkitBackdropFilter: 'blur(6px)',
              border: '1px solid rgba(246,245,242,0.20)',
              transform: `rotate(${tile.rot})`,
              zIndex: tile.z,
            }}
          >
            {i === 2 && (
              <div style={{ padding: '14px 12px' }}>
                <div style={{ height: '2px', background: 'rgba(246,245,242,0.30)', borderRadius: '1px', marginBottom: '8px', width: '70%' }} />
                <div style={{ height: '2px', background: 'rgba(246,245,242,0.20)', borderRadius: '1px', marginBottom: '20px', width: '50%' }} />
                {/* RAG dots */}
                <div style={{ position: 'absolute', top: '14px', right: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {['#d4574a', '#d9a25a', '#6fa37a'].map((c, j) => (
                    <div key={j} style={{ width: '10px', height: '10px', borderRadius: '50%', background: c, boxShadow: `0 0 10px ${c}` }} />
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function RoadmapVisual() {
  const quarters = ['Q1', 'Q2', 'Q3', 'Q4']
  const segments: { offset: string; width: string }[] = [
    { offset: '0%',   width: '60%' },
    { offset: '20%',  width: '55%' },
    { offset: '45%',  width: '40%' },
    { offset: '30%',  width: '50%' },
  ]
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1, justifyContent: 'flex-end' }}>
      {quarters.map((q, i) => (
        <div key={q} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'rgba(246,245,242,0.45)', width: '22px', flexShrink: 0 }}>{q}</span>
          <div style={{ flex: 1, height: '10px', background: 'rgba(246,245,242,0.10)', borderRadius: '3px', position: 'relative', overflow: 'hidden' }}>
            <div style={{
              position: 'absolute',
              left: segments[i].offset,
              width: segments[i].width,
              height: '100%',
              background: 'rgba(246,245,242,0.70)',
              borderRadius: '3px',
              boxShadow: '0 0 12px rgba(246,245,242,0.40)',
            }} />
          </div>
        </div>
      ))}
    </div>
  )
}

function MemoVisual() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', flex: 1 }}>
      <div style={{
        width: '170px',
        height: '175px',
        borderRadius: '6px',
        background: 'rgba(246,245,242,0.08)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        border: '1px solid rgba(246,245,242,0.20)',
        transform: 'rotate(2deg)',
        padding: '16px 14px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.10em', color: 'rgba(246,245,242,0.40)' }}>
          — Memo · Recommendation
        </span>
        <p style={{
          fontFamily: 'var(--font-serif)',
          fontStyle: 'italic',
          fontWeight: 600,
          fontSize: '11px',
          lineHeight: 1.4,
          color: 'rgba(246,245,242,0.85)',
          flex: 1,
        }}>
          You do not need a partner yet. You need to renegotiate one contract.
        </p>
        {[95, 80, 90, 70, 60].map((w, i) => (
          <div key={i} style={{ height: '5px', background: 'rgba(246,245,242,0.15)', borderRadius: '2px', width: `${w}%` }} />
        ))}
      </div>
    </div>
  )
}

const VISUALS = [DiagnosticVisual, RoadmapVisual, MemoVisual]

/* ── Animate helper (no GSAP needed, we'll use CSS transitions + JS) ─ */
function animateTo(
  xRef: React.MutableRefObject<number>,
  target: number,
  durationMs: number,
  onUpdate: () => void,
  onComplete?: () => void
) {
  const start = performance.now()
  const from  = xRef.current

  // Ease: cubic-bezier(0.65,0,0.35,1) approximated
  function ease(t: number) {
    // Simple custom ease approximation
    return t < 0.5
      ? 4 * t * t * t
      : 1 - Math.pow(-2 * t + 2, 3) / 2
  }

  let rafId = 0
  function step(now: number) {
    const elapsed = now - start
    const t       = Math.min(elapsed / durationMs, 1)
    xRef.current  = lerp(from, target, ease(t))
    onUpdate()
    if (t < 1) {
      rafId = requestAnimationFrame(step)
    } else {
      xRef.current = target
      onUpdate()
      onComplete?.()
    }
  }
  rafId = requestAnimationFrame(step)
  return () => cancelAnimationFrame(rafId)
}

export default function MethodCarousel() {
  const trackRef     = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const xRef         = useRef(0)
  const centerRef    = useRef(0)
  const stepRef      = useRef(0)
  const cancelAnim   = useRef<(() => void) | null>(null)
  const goToRef      = useRef<(d: number) => void>(() => {})

  const [activeIndex, setActiveIndex] = useState(0)
  const [isMobile, setIsMobile]       = useState(false)
  const [cardPx, setCardPx]           = useState(460)

  const tripled = [...CARDS, ...CARDS, ...CARDS]

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 900)
    check()
    window.addEventListener('resize', check, { passive: true })
    return () => window.removeEventListener('resize', check)
  }, [])

  const updateCards = useCallback((cardEls: HTMLElement[], activeIdx: number) => {
    cardEls.forEach((el, i) => {
      const src  = i % CARD_COUNT
      const dist = Math.min(Math.abs(src - activeIdx), CARD_COUNT - Math.abs(src - activeIdx))
      el.style.transition = `opacity 500ms ${EASE}, transform 500ms ${EASE}, background 500ms, border-color 500ms, box-shadow 500ms`
      if (dist === 0) {
        el.style.opacity     = '1'
        el.style.transform   = 'scale(1)'
        el.style.background  = 'rgba(246,245,242,0.10)'
        el.style.borderColor = 'rgba(246,245,242,0.45)'
        el.style.boxShadow   = 'inset 0 1px 0 rgba(246,245,242,0.30), 0 30px 80px -25px rgba(0,0,0,0.30)'
      } else if (dist === 1) {
        el.style.opacity     = '0.55'
        el.style.transform   = 'scale(0.97)'
        el.style.background  = 'rgba(246,245,242,0.06)'
        el.style.borderColor = 'rgba(246,245,242,0.30)'
        el.style.boxShadow   = 'none'
      } else {
        el.style.opacity     = '0.30'
        el.style.transform   = 'scale(0.94)'
        el.style.background  = 'rgba(246,245,242,0.06)'
        el.style.borderColor = 'rgba(246,245,242,0.15)'
        el.style.boxShadow   = 'none'
      }
    })
  }, [])

  useEffect(() => {
    const track     = trackRef.current
    const container = containerRef.current
    if (!track || !container) return

    const cardEls = Array.from(track.children) as HTMLElement[]
    const cw      = cardEls[0]?.offsetWidth ?? 460
    setCardPx(cw)
    const step    = cw + GAP
    stepRef.current = step

    const co = Math.max(0, (container.offsetWidth - cw) / 2)
    centerRef.current = co

    xRef.current = -(step * CARD_COUNT) + co
    track.style.transform = `translateX(${xRef.current}px)`
    updateCards(cardEls, 0)

    const wrap = () => {
      const co2 = centerRef.current
      const st  = stepRef.current
      if (xRef.current <= -(st * CARD_COUNT * 2) + co2) {
        xRef.current += st * CARD_COUNT
        track.style.transform = `translateX(${xRef.current}px)`
      } else if (xRef.current >= co2) {
        xRef.current -= st * CARD_COUNT
        track.style.transform = `translateX(${xRef.current}px)`
      }
      const k         = Math.round((-xRef.current + co2) / st)
      const newActive = ((k % CARD_COUNT) + CARD_COUNT) % CARD_COUNT
      setActiveIndex(newActive)
      updateCards(cardEls, newActive)
    }

    const goTo = (delta: number) => {
      cancelAnim.current?.()
      const co2    = centerRef.current
      const st     = stepRef.current
      const target = xRef.current - delta * st
      cancelAnim.current = animateTo(
        xRef,
        target,
        DURATION * 1000,
        () => { track.style.transform = `translateX(${xRef.current}px)`; wrap() }
      )
    }
    goToRef.current = goTo

    /* Pointer drag */
    let startX = 0
    let isDragging = false
    const onDown = (e: PointerEvent) => {
      isDragging = true
      startX = e.clientX
      container.setPointerCapture(e.pointerId)
      cancelAnim.current?.()
    }
    const onMove = (e: PointerEvent) => {
      if (!isDragging) return
      const dx = e.clientX - startX
      xRef.current += dx
      startX = e.clientX
      track.style.transform = `translateX(${xRef.current}px)`
      wrap()
    }
    const onUp = () => {
      if (!isDragging) return
      isDragging = false
      const co2    = centerRef.current
      const st     = stepRef.current
      const k      = Math.round((-xRef.current + co2) / st)
      const target = -k * st + co2
      cancelAnim.current = animateTo(
        xRef,
        target,
        DURATION * 1000,
        () => { track.style.transform = `translateX(${xRef.current}px)`; wrap() }
      )
    }

    container.addEventListener('pointerdown', onDown)
    container.addEventListener('pointermove', onMove)
    container.addEventListener('pointerup', onUp)
    container.addEventListener('pointercancel', onUp)

    /* Keyboard */
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft')  goTo(-1)
      if (e.key === 'ArrowRight') goTo(1)
    }
    window.addEventListener('keydown', onKey)

    /* Resize */
    const onResize = () => {
      const newCw   = (Array.from(track.children)[0] as HTMLElement)?.offsetWidth ?? cw
      const newStep = newCw + GAP
      stepRef.current   = newStep
      setCardPx(newCw)
      const newCo       = Math.max(0, (container.offsetWidth - newCw) / 2)
      centerRef.current = newCo
      xRef.current      = -(newStep * CARD_COUNT) + newCo
      track.style.transform = `translateX(${xRef.current}px)`
      updateCards(Array.from(track.children) as HTMLElement[], 0)
      setActiveIndex(0)
    }
    window.addEventListener('resize', onResize, { passive: true })

    return () => {
      cancelAnim.current?.()
      container.removeEventListener('pointerdown', onDown)
      container.removeEventListener('pointermove', onMove)
      container.removeEventListener('pointerup', onUp)
      container.removeEventListener('pointercancel', onUp)
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', onResize)
    }
  }, [isMobile, updateCards])

  const handleArrow = (dir: 1 | -1) => { goToRef.current(dir) }
  const handleDot   = (i: number) => {
    const diff = i - activeIndex
    if (diff !== 0) goToRef.current(diff)
  }

  const mask = isMobile
    ? 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)'
    : 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)'

  return (
    <section
      data-mth
      style={{ padding: 'clamp(56px,7vw,88px) 0' }}
    >
      {/* Header */}
      <div
        className="mth-r mth-carousel-header"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 'clamp(32px, 4vw, 64px)',
          alignItems: 'end',
          padding: '0 var(--margin-x)',
          marginBottom: 'clamp(40px, 5vw, 64px)',
        }}
      >
        <div>
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '13px',
            letterSpacing: '0.18em',
            color: 'rgba(246,245,242,0.55)',
            marginBottom: '20px',
          }}>
            — 04 / Deliverables · Three documents
          </p>
          <h2 style={{
            fontFamily: 'var(--font-head)',
            fontWeight: 600,
            fontSize: 'clamp(40px, 5vw, 72px)',
            lineHeight: 1.0,
            letterSpacing: '-0.025em',
            color: '#f6f5f2',
            margin: 0,
          }}>
            Three documents. Yours to keep.
          </h2>
        </div>
        <p style={{
          fontSize: '17px',
          lineHeight: 1.65,
          color: 'rgba(246,245,242,0.70)',
          maxWidth: '420px',
          alignSelf: 'end',
        }}>
          At the end of the Method, you walk away with a defensible picture of
          your operation — regardless of what engagement comes next, or whether
          any does.
        </p>
      </div>

      {/* Slider */}
      <div className="mth-r" style={{ position: 'relative' }}>
        {/* Glow */}
        <div style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background: 'radial-gradient(ellipse 45% 60% at 50% 50%, rgba(246,245,242,0.05), transparent 70%)',
        }} />

        <div
          ref={containerRef}
          style={{
            overflow: 'hidden',
            touchAction: 'none',
            userSelect: 'none',
            cursor: 'grab',
            WebkitMaskImage: mask,
            maskImage: mask,
          }}
        >
          <div
            ref={trackRef}
            style={{
              display: 'flex',
              gap: `${GAP}px`,
              willChange: 'transform',
            }}
          >
            {tripled.map((card, i) => {
              const src    = i % CARD_COUNT
              const Visual = VISUALS[src]
              return (
                <div
                  key={i}
                  style={{
                    flex: `0 0 clamp(460px, 38vw, 560px)`,
                    minWidth: isMobile ? '82vw' : '460px',
                    aspectRatio: '4/5',
                    borderRadius: '24px',
                    background: 'rgba(246,245,242,0.06)',
                    border: '1px solid rgba(246,245,242,0.30)',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                    padding: '48px 44px 40px',
                    display: 'flex',
                    flexDirection: 'column',
                    pointerEvents: 'none',
                    flexShrink: 0,
                  }}
                >
                  {/* Numeral */}
                  <p style={{
                    fontFamily: 'var(--font-serif)',
                    fontStyle: 'italic',
                    fontWeight: 600,
                    fontSize: '26px',
                    color: 'rgba(246,245,242,0.50)',
                    marginBottom: '8px',
                  }}>
                    {card.numeral}
                  </p>

                  {/* Kind tag */}
                  <p style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    letterSpacing: '0.14em',
                    color: 'rgba(246,245,242,0.45)',
                    marginBottom: '20px',
                  }}>
                    {card.kind}
                  </p>

                  {/* h3 */}
                  <h3 style={{
                    fontFamily: 'var(--font-head)',
                    fontWeight: 600,
                    fontSize: 'clamp(36px, 4vw, 56px)',
                    lineHeight: 1.0,
                    letterSpacing: '-0.025em',
                    color: '#f6f5f2',
                    marginBottom: '16px',
                  }}>
                    {card.h3}
                  </h3>

                  {/* Para */}
                  <p style={{
                    fontSize: '15px',
                    lineHeight: 1.6,
                    color: 'rgba(246,245,242,0.70)',
                    maxWidth: '360px',
                    marginBottom: '28px',
                  }}>
                    {card.para}
                  </p>

                  {/* Visual area */}
                  <Visual />
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div
        className="mth-r"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '24px var(--margin-x) 0',
        }}
      >
        {/* Dots */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {CARDS.map((_, i) => (
            <button
              key={i}
              onClick={() => handleDot(i)}
              aria-label={`Go to slide ${i + 1}`}
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                background: i === activeIndex ? 'rgba(246,245,242,0.85)' : 'rgba(246,245,242,0.25)',
                transition: 'background 300ms, transform 300ms',
                transform: i === activeIndex ? 'scale(1.3)' : 'scale(1)',
              }}
            />
          ))}
        </div>

        {/* Arrows */}
        {!isMobile && (
          <div style={{ display: 'flex', gap: '8px' }}>
            {(['‹', '›'] as const).map((ch, i) => (
              <button
                key={ch}
                onClick={() => handleArrow(i === 0 ? -1 : 1)}
                aria-label={i === 0 ? 'Previous' : 'Next'}
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  border: '1px solid rgba(246,245,242,0.45)',
                  background: 'transparent',
                  color: 'rgba(246,245,242,0.80)',
                  fontSize: '18px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background 200ms, border-color 200ms',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(246,245,242,0.08)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent' }}
              >
                {ch}
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
