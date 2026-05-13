'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useMessages } from 'next-intl'
import { Link } from '@/i18n/routing'

const EASE = 'cubic-bezier(0.65,0,0.35,1)'
const DURATION = 800
const GAP = 24

type CardData = {
  id: string
  numeral: string
  title: string
  hook: string
  modal_body_1: string
  modal_body_2: string
  modal_body_3: string
  cta: string
}

interface Props {
  subhead: string
}

function lerp(a: number, b: number, t: number) { return a + (b - a) * t }

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

function animateTo(
  xRef: React.MutableRefObject<number>,
  target: number,
  durationMs: number,
  onUpdate: () => void,
  onComplete?: () => void
) {
  const start = performance.now()
  const from = xRef.current
  let rafId = 0
  function step(now: number) {
    const t = Math.min((now - start) / durationMs, 1)
    xRef.current = lerp(from, target, easeInOutCubic(t))
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

export default function ProductSlide({ subhead }: Props) {
  const messages = useMessages()
  const ps = (messages as any).ProductSlide ?? {}
  const eyebrow: string = ps.eyebrow ?? 'What comes next'
  const heading: string = ps.heading ?? subhead
  const cards: CardData[] = ps.cards ?? []

  const CARD_COUNT = cards.length
  const tripled = [...cards, ...cards, ...cards]

  const trackRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const xRef = useRef(0)
  const centerRef = useRef(0)
  const stepRef = useRef(0)
  const cancelAnim = useRef<(() => void) | null>(null)
  const goToRef = useRef<(d: number) => void>(() => {})

  const [activeIndex, setActiveIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [activeModal, setActiveModal] = useState<CardData | null>(null)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check, { passive: true })
    return () => window.removeEventListener('resize', check)
  }, [])

  // Close modal on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveModal(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Prevent body scroll when modal open
  useEffect(() => {
    document.body.style.overflow = activeModal ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [activeModal])

  const updateCards = useCallback((cardEls: HTMLElement[], activeIdx: number) => {
    cardEls.forEach((el, i) => {
      if (CARD_COUNT === 0) return
      const src = i % CARD_COUNT
      const dist = Math.min(
        Math.abs(src - activeIdx),
        CARD_COUNT - Math.abs(src - activeIdx)
      )
      el.style.transition = `opacity 450ms ${EASE}, transform 450ms ${EASE}, background 450ms, border-color 450ms, box-shadow 450ms`
      if (dist === 0) {
        el.style.opacity = '1'
        el.style.transform = 'scale(1)'
        el.style.background = 'rgba(246,245,242,0.12)'
        el.style.borderColor = 'rgba(246,245,242,0.40)'
        el.style.boxShadow = 'inset 0 1px 0 rgba(246,245,242,0.25), 0 24px 64px -20px rgba(0,0,0,0.35)'
        el.style.cursor = 'pointer'
      } else {
        el.style.opacity = dist === 1 ? '0.45' : '0.25'
        el.style.transform = dist === 1 ? 'scale(0.93)' : 'scale(0.88)'
        el.style.background = 'rgba(246,245,242,0.06)'
        el.style.borderColor = 'rgba(246,245,242,0.18)'
        el.style.boxShadow = 'none'
        el.style.cursor = 'pointer'
      }
    })
  }, [CARD_COUNT])

  useEffect(() => {
    if (CARD_COUNT === 0) return
    const track = trackRef.current
    const container = containerRef.current
    if (!track || !container) return

    const cardEls = Array.from(track.children) as HTMLElement[]
    const cw = cardEls[0]?.offsetWidth ?? 420
    const step = cw + GAP
    stepRef.current = step

    const co = Math.max(0, (container.offsetWidth - cw) / 2)
    centerRef.current = co

    xRef.current = -(step * CARD_COUNT) + co
    track.style.transform = `translateX(${xRef.current}px)`
    updateCards(cardEls, 0)

    const wrap = () => {
      const co2 = centerRef.current
      const st = stepRef.current
      if (xRef.current <= -(st * CARD_COUNT * 2) + co2) {
        xRef.current += st * CARD_COUNT
        track.style.transform = `translateX(${xRef.current}px)`
      } else if (xRef.current >= co2) {
        xRef.current -= st * CARD_COUNT
        track.style.transform = `translateX(${xRef.current}px)`
      }
      const k = Math.round((-xRef.current + co2) / st)
      const newActive = ((k % CARD_COUNT) + CARD_COUNT) % CARD_COUNT
      setActiveIndex(newActive)
      updateCards(cardEls, newActive)
    }

    const goTo = (delta: number) => {
      cancelAnim.current?.()
      const st = stepRef.current
      const target = xRef.current - delta * st
      cancelAnim.current = animateTo(
        xRef,
        target,
        DURATION,
        () => { track.style.transform = `translateX(${xRef.current}px)`; wrap() }
      )
    }
    goToRef.current = goTo

    // Pointer drag — clicks handled in onUp via moved flag
    let startX = 0
    let isDragging = false
    let moved = false
    const onDown = (e: PointerEvent) => {
      isDragging = true
      moved = false
      startX = e.clientX
      container.setPointerCapture(e.pointerId)
      cancelAnim.current?.()
    }
    const onMove = (e: PointerEvent) => {
      if (!isDragging) return
      const dx = e.clientX - startX
      if (Math.abs(dx) > 4) moved = true
      xRef.current += dx
      startX = e.clientX
      track.style.transform = `translateX(${xRef.current}px)`
      wrap()
    }
    const onUp = (e: PointerEvent) => {
      if (!isDragging) return
      isDragging = false
      const co2 = centerRef.current
      const st = stepRef.current
      const k = Math.round((-xRef.current + co2) / st)

      if (!moved) {
        // Tap / click — no drag happened. Detect which card was hit
        // and either open modal (active card) or navigate (side card).
        const rect = container.getBoundingClientRect()
        const offsetCards = Math.round(
          (e.clientX - rect.left - rect.width / 2) / st
        )
        const currentActive = ((k % CARD_COUNT) + CARD_COUNT) % CARD_COUNT
        if (offsetCards === 0) {
          setActiveModal(cards[currentActive] ?? null)
        } else {
          goTo(offsetCards)
        }
        return
      }

      // Drag ended — snap to nearest card
      const target = -k * st + co2
      cancelAnim.current = animateTo(
        xRef,
        target,
        DURATION,
        () => { track.style.transform = `translateX(${xRef.current}px)`; wrap() }
      )
    }

    container.addEventListener('pointerdown', onDown)
    container.addEventListener('pointermove', onMove)
    container.addEventListener('pointerup', onUp)
    container.addEventListener('pointercancel', onUp)

    const onResize = () => {
      const newCw = (Array.from(track.children)[0] as HTMLElement)?.offsetWidth ?? cw
      const newStep = newCw + GAP
      stepRef.current = newStep
      const newCo = Math.max(0, (container.offsetWidth - newCw) / 2)
      centerRef.current = newCo
      xRef.current = -(newStep * CARD_COUNT) + newCo
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
      window.removeEventListener('resize', onResize)
    }
  }, [isMobile, updateCards, CARD_COUNT, cards])

  const handleArrow = (dir: 1 | -1) => { goToRef.current(dir) }
  const handleDot = (i: number) => {
    const diff = i - activeIndex
    if (diff !== 0) goToRef.current(diff)
  }

  if (CARD_COUNT === 0) return null

  const mask = 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)'

  return (
    <>
      <style>{`
        @keyframes ps-fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .ps-modal-inner {
          animation: ps-fadeUp 0.3s cubic-bezier(0.16,1,0.3,1) both;
        }
      `}</style>

      <section
        style={{
          background: '#003d33',
          padding: 'clamp(72px,9vw,100px) 0',
          fontFamily: 'var(--font-head)',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div style={{ padding: '0 var(--margin-x)', marginBottom: 'clamp(40px,5vw,64px)' }}>
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            letterSpacing: '0.20em',
            textTransform: 'uppercase',
            color: 'rgba(246,245,242,0.45)',
            marginBottom: '16px',
          }}>
            {eyebrow}
          </p>
          <h2 style={{
            fontWeight: 700,
            fontSize: 'clamp(32px,4.5vw,56px)',
            lineHeight: 1.02,
            letterSpacing: '-0.025em',
            color: '#f6f5f2',
            margin: '0 0 10px',
          }}>
            {heading}
          </h2>
          <p style={{
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            fontSize: 'clamp(16px,1.4vw,19px)',
            color: 'rgba(246,245,242,0.60)',
            margin: 0,
          }}>
            {subhead !== heading ? subhead : ''}
          </p>
        </div>

        {/* Carousel */}
        <div style={{ position: 'relative' }}>
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
                const isClone = i < CARD_COUNT || i >= CARD_COUNT * 2
                return (
                <div
                  key={i}
                  aria-hidden={isClone ? true : undefined}
                  role={isClone ? 'presentation' : undefined}
                  style={{
                    flex: `0 0 clamp(320px, 38vw, 520px)`,
                    minWidth: isMobile ? '80vw' : '320px',
                    borderRadius: '16px',
                    background: 'rgba(246,245,242,0.06)',
                    border: '1px solid rgba(246,245,242,0.18)',
                    padding: 'clamp(32px,3.5vw,52px)',
                    display: 'flex',
                    flexDirection: 'column',
                    flexShrink: 0,
                    transition: 'opacity 450ms, transform 450ms',
                  }}
                >
                  <p style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    letterSpacing: '0.18em',
                    color: 'rgba(246,245,242,0.38)',
                    marginBottom: '20px',
                  }}>
                    [{card.numeral}]
                  </p>
                  <div style={{ height: '1px', background: 'rgba(246,245,242,0.16)', marginBottom: '28px' }} />
                  <h3 style={{
                    fontWeight: 700,
                    fontSize: 'clamp(48px,6vw,80px)',
                    lineHeight: 0.95,
                    letterSpacing: '-0.03em',
                    color: '#f6f5f2',
                    margin: '0 0 28px',
                  }}>
                    {card.title}
                  </h3>
                  <p style={{
                    fontFamily: 'var(--font-serif)',
                    fontStyle: 'italic',
                    fontSize: 'clamp(15px,1.3vw,18px)',
                    lineHeight: 1.6,
                    color: 'rgba(246,245,242,0.62)',
                    margin: '0 0 28px',
                  }}>
                    {card.hook}
                  </p>
                  <div style={{
                    paddingTop: '20px',
                    borderTop: '1px solid rgba(246,245,242,0.12)',
                  }}>
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '10px',
                      letterSpacing: '0.16em',
                      textTransform: 'uppercase',
                      color: 'rgba(246,245,242,0.35)',
                    }}>
                      Click to explore
                    </span>
                  </div>
                </div>
              )})}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '24px var(--margin-x) 0',
        }}>
          {/* Dots */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {cards.map((_, i) => (
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
                    border: '1px solid rgba(246,245,242,0.40)',
                    background: 'transparent',
                    color: 'rgba(246,245,242,0.75)',
                    fontSize: '20px',
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

      {/* Modal */}
      {activeModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 300,
            background: 'rgba(0,0,0,0.60)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: isMobile ? 'flex-end' : 'center',
            justifyContent: 'center',
            padding: isMobile ? '0' : '16px',
          }}
          onClick={() => setActiveModal(null)}
        >
          <div
            className="ps-modal-inner"
            style={{
              background: '#004d40',
              color: '#f6f5f2',
              borderRadius: isMobile ? '16px 16px 0 0' : '12px',
              maxWidth: isMobile ? '100%' : '600px',
              width: '100%',
              maxHeight: isMobile ? '92vh' : '90vh',
              overflowY: 'auto',
              padding: 'clamp(28px,4vw,52px)',
              position: 'relative',
            }}
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveModal(null)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'transparent',
                border: '1px solid rgba(246,245,242,0.25)',
                borderRadius: '999px',
                width: '32px',
                height: '32px',
                cursor: 'pointer',
                fontSize: '16px',
                color: 'rgba(246,245,242,0.65)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >×</button>

            <p style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'rgba(246,245,242,0.45)',
              marginBottom: '12px',
            }}>
              {activeModal.numeral}
            </p>
            <h2 style={{
              fontWeight: 700,
              fontSize: 'clamp(28px,3.5vw,44px)',
              letterSpacing: '-0.025em',
              lineHeight: 1.0,
              color: '#f6f5f2',
              margin: '0 0 14px',
              paddingRight: '40px',
            }}>
              {activeModal.title}
            </h2>
            <p style={{
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
              fontSize: '17px',
              lineHeight: 1.5,
              color: 'rgba(246,245,242,0.70)',
              margin: '0 0 32px',
            }}>
              {activeModal.hook}
            </p>

            <div style={{ height: '1px', background: 'rgba(246,245,242,0.15)', marginBottom: '28px' }} />

            <p style={{ fontSize: '15px', lineHeight: 1.7, color: 'rgba(246,245,242,0.82)', margin: '0 0 18px' }}>
              {activeModal.modal_body_1}
            </p>
            <p style={{ fontSize: '15px', lineHeight: 1.7, color: 'rgba(246,245,242,0.82)', margin: '0 0 18px' }}>
              {activeModal.modal_body_2}
            </p>
            <p style={{
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
              fontSize: '15px',
              lineHeight: 1.65,
              color: 'rgba(246,245,242,0.65)',
              margin: '0 0 36px',
            }}>
              {activeModal.modal_body_3}
            </p>

            <Link
              href="/contact"
              style={{
                display: 'inline-block',
                background: '#f6f5f2',
                color: '#004d40',
                fontFamily: 'var(--font-head)',
                fontWeight: 700,
                fontSize: '15px',
                letterSpacing: '-0.2px',
                padding: '14px 32px',
                borderRadius: '999px',
                textDecoration: 'none',
                transition: 'transform 150ms ease, box-shadow 150ms ease',
              }}
              onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.20)'
              }}
              onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => {
                e.currentTarget.style.transform = ''
                e.currentTarget.style.boxShadow = ''
              }}
            >
              {activeModal.cta}
            </Link>
          </div>
        </div>
      )}
    </>
  )
}
