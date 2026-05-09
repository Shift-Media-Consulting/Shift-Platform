'use client'

import { useEffect, useRef, useState, useCallback, ReactNode } from 'react'
import { gsap } from 'gsap'
import { Observer } from 'gsap/Observer'

gsap.registerPlugin(Observer)

type Card = { name: string; desc: string }
type Props = { label?: ReactNode; cards: Card[]; compact?: boolean }

const EASE            = 'cubic-bezier(0.65,0,0.35,1)'
const DURATION        = 0.8
const AUTO_MS         = 7000
const RESUME_AFTER_MS = 4000
const GAP             = 24

export default function ServicesSlider({ label, cards, compact = false }: Props) {
  const trackRef        = useRef<HTMLDivElement>(null)
  const containerRef    = useRef<HTMLDivElement>(null)
  const progressFillRef = useRef<HTMLDivElement>(null)
  const xRef            = useRef(0)
  const centerRef       = useRef(0)   // (containerW - cardW) / 2
  const animRef         = useRef<gsap.core.Tween | null>(null)
  const progAnimRef     = useRef<gsap.core.Tween | null>(null)
  const autoTimerRef    = useRef<ReturnType<typeof setTimeout> | null>(null)
  const resumeTimerRef  = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isPausedRef     = useRef(false)
  const goToRef         = useRef<(d: number) => void>(() => {})
  const stepRef         = useRef(0)

  const [activeIndex, setActiveIndex] = useState(0)
  const [isMobile, setIsMobile]       = useState(false)
  const [cardPx, setCardPx]           = useState(540)

  const tripled    = [...cards, ...cards, ...cards]
  const CARD_COUNT = cards.length

  /* Mobile detection */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 900)
    check()
    window.addEventListener('resize', check, { passive: true })
    return () => window.removeEventListener('resize', check)
  }, [])

  /* Progress bar */
  const startProgress = useCallback(() => {
    const fill = progressFillRef.current
    if (!fill) return
    if (progAnimRef.current) progAnimRef.current.kill()
    if (autoTimerRef.current) clearTimeout(autoTimerRef.current)
    gsap.set(fill, { scaleX: 0, transformOrigin: 'left center' })
    progAnimRef.current = gsap.to(fill, { scaleX: 1, duration: AUTO_MS / 1000, ease: 'none' })
    autoTimerRef.current = setTimeout(() => {
      if (!isPausedRef.current) goToRef.current(1)
    }, AUTO_MS)
  }, [])

  const pauseAll = useCallback(() => {
    isPausedRef.current = true
    progAnimRef.current?.pause()
    if (autoTimerRef.current)  clearTimeout(autoTimerRef.current)
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current)
  }, [])

  const scheduleResume = useCallback(() => {
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current)
    resumeTimerRef.current = setTimeout(() => {
      isPausedRef.current = false
      startProgress()
    }, RESUME_AFTER_MS)
  }, [startProgress])

  /* Card opacity / scale based on distance from active */
  const updateCards = useCallback((cardEls: HTMLElement[], activeIdx: number) => {
    cardEls.forEach((el, i) => {
      const src  = i % CARD_COUNT
      const dist = Math.min(Math.abs(src - activeIdx), CARD_COUNT - Math.abs(src - activeIdx))
      // Update shadow immediately (not animated — string values)
      el.style.boxShadow = dist === 0
        ? 'inset 0 1px 0 rgba(246,245,242,0.28), 0 40px 100px -10px rgba(0,0,0,0.55), 0 8px 32px rgba(0,0,0,0.3)'
        : 'inset 0 1px 0 rgba(246,245,242,0.15), 0 24px 60px -20px rgba(0,0,0,0.15)'

      gsap.to(el, {
        scale:   dist === 0 ? 1.035 : 1,
        opacity: dist === 0 ? 1 : dist === 1 ? 0.5 : 0.2,
        duration: DURATION,
        ease:     EASE,
        transformOrigin: 'center center',
        overwrite: 'auto',
      })
    })
  }, [CARD_COUNT])

  /* Main effect */
  useEffect(() => {
    const track     = trackRef.current
    const container = containerRef.current
    if (!track || !container) return

    const cardEls  = Array.from(track.children) as HTMLElement[]
    const cw       = cardEls[0]?.offsetWidth ?? 540
    setCardPx(cw)
    const step     = cw + GAP
    stepRef.current = step

    // Center offset: how far left the track needs to be so active card is centred
    const co = Math.max(0, (container.offsetWidth - cw) / 2)
    centerRef.current = co

    // Start position: middle set, first card, centred
    xRef.current = -(step * CARD_COUNT) + co
    gsap.set(track, { x: xRef.current })
    updateCards(cardEls, 0)

    const wrap = () => {
      // Wrap bounds adjusted for centerOffset
      if (xRef.current <= -(step * CARD_COUNT * 2) + co) {
        xRef.current += step * CARD_COUNT
        gsap.set(track, { x: xRef.current })
      } else if (xRef.current >= co) {
        xRef.current -= step * CARD_COUNT
        gsap.set(track, { x: xRef.current })
      }
      // Active index: k = how many steps from position 0
      const k       = Math.round((-xRef.current + co) / step)
      const newActive = ((k % CARD_COUNT) + CARD_COUNT) % CARD_COUNT
      setActiveIndex(newActive)
      updateCards(cardEls, newActive)
    }

    const goTo = (delta: number) => {
      if (animRef.current) animRef.current.kill()
      animRef.current = gsap.to(xRef, {
        current:  xRef.current - delta * step,
        duration: DURATION,
        ease:     EASE,
        onUpdate:  () => { gsap.set(track, { x: xRef.current }); wrap() },
        onComplete: () => startProgress(),
      })
    }
    goToRef.current = goTo

    const obs = Observer.create({
      target: container,
      type: 'touch,pointer',
      onDrag: (self: any) => {
        pauseAll()
        animRef.current?.kill()
        xRef.current += self.deltaX
        gsap.set(track, { x: xRef.current })
        wrap()
      },
      onDragEnd: () => {
        const co2    = centerRef.current
        const st     = stepRef.current
        const k      = Math.round((-xRef.current + co2) / st)
        const target = -k * st + co2
        animRef.current = gsap.to(xRef, {
          current:  target,
          duration: DURATION,
          ease:     EASE,
          onUpdate:  () => { gsap.set(track, { x: xRef.current }); wrap() },
          onComplete: () => scheduleResume(),
        })
      },
      onLeft:  () => { pauseAll(); goTo(1);  scheduleResume() },
      onRight: () => { pauseAll(); goTo(-1); scheduleResume() },
      dragMinimum: 8,
      preventDefault: true,
      lockAxis: true,
    })

    container.addEventListener('mouseenter', pauseAll)
    container.addEventListener('mouseleave', scheduleResume)
    startProgress()

    return () => {
      obs.kill()
      animRef.current?.kill()
      progAnimRef.current?.kill()
      if (autoTimerRef.current)  clearTimeout(autoTimerRef.current)
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current)
      container.removeEventListener('mouseenter', pauseAll)
      container.removeEventListener('mouseleave', scheduleResume)
    }
  }, [CARD_COUNT, isMobile, updateCards, pauseAll, scheduleResume, startProgress])

  const handleArrow = (dir: 1 | -1) => { pauseAll(); goToRef.current(dir); scheduleResume() }

  // Two-sided mask: fades left AND right so adjacent cards show ~50%
  const mask = isMobile
    ? 'linear-gradient(to right, transparent 2%, black 10%, black 90%, transparent 98%)'
    : 'linear-gradient(to right, transparent 0%, black 14%, black 86%, transparent 100%)'

  return (
    <div className="flex flex-col gap-8">

      {/* Bold section heading — only rendered if label is provided */}
      {label && (
        <div className="px-8 sm:px-10 md:px-14 lg:px-20 xl:px-24">
          <h2
            className="font-bold text-fg leading-[1.0] tracking-[-0.025em]"
            style={{ fontSize: 'clamp(36px, 5vw, 72px)', color: 'var(--fg)' }}
          >
            {label}
          </h2>
        </div>
      )}

      {/* Slider */}
      <div className="relative">

        {/* Radial glow centred on active card */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: `radial-gradient(ellipse 45% 60% at 50% 50%, rgba(246,245,242,0.07), transparent 70%)`,
        }} />

        {/* Track container — full width, no horizontal padding */}
        <div
          ref={containerRef}
          className="overflow-hidden touch-none select-none cursor-grab active:cursor-grabbing"
          style={{ WebkitMaskImage: mask, maskImage: mask }}
        >
          <div ref={trackRef} className="flex will-change-transform" style={{ gap: `${GAP}px` }}>
            {tripled.map((card, i) => {
              const src = i % CARD_COUNT
              return (
                <div key={i}
                  className="flex-shrink-0 flex flex-col rounded-2xl overflow-hidden"
                  style={{
                    width:                isMobile ? '82vw' : 'min(540px, 80vw)',
                    height:               compact ? '280px' : '400px',
                    background:           'rgba(246,245,242,0.10)',
                    backdropFilter:       'blur(10px) saturate(1.3)',
                    WebkitBackdropFilter: 'blur(10px) saturate(1.3)',
                    border:               '1px solid rgba(246,245,242,0.28)',
                    boxShadow:            'inset 0 1px 0 rgba(246,245,242,0.15), 0 24px 60px -20px rgba(0,0,0,0.15)',
                    pointerEvents:        'none',
                    flexShrink:           0,
                  }}
                >
                  <div className="flex flex-col h-full" style={{
                    padding: compact ? 'clamp(20px, 2vw, 28px)' : 'clamp(28px, 3vw, 40px)',
                    alignItems: compact ? 'center' : undefined,
                    textAlign:  compact ? 'center'  : undefined,
                    justifyContent: compact ? 'center' : undefined,
                  }}>

                    {/* [01] + hairline */}
                    <div style={{ paddingBottom: compact ? '12px' : '20px', borderBottom: '1px solid rgba(246,245,242,0.2)', marginBottom: compact ? '16px' : '24px', width: '100%' }}>
                      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '13px',
                                  letterSpacing: '0.18em', color: 'rgba(246,245,242,0.45)', fontWeight: 400 }}>
                        [{String(src + 1).padStart(2, '0')}]
                      </p>
                    </div>

                    {/* Title */}
                    <h3 style={{
                      fontSize:      compact ? 'clamp(32px, 4vw, 52px)' : 'clamp(56px, 7vw, 100px)',
                      lineHeight:    0.96,
                      letterSpacing: '-0.025em',
                      fontWeight:    600,
                      color:         '#f6f5f2',
                      marginBottom:  '16px',
                    }}>
                      {card.name}
                    </h3>

                    {/* Body */}
                    <p style={{ fontSize: '15px', lineHeight: 1.5, maxWidth: compact ? '320px' : '420px',
                                color: 'rgba(246,245,242,0.78)', fontWeight: 400 }}>
                      {card.desc}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Progress bar — centred over active card */}
        <div
          className="absolute pointer-events-none"
          style={{
            bottom: 0,
            left:   `calc(50% - ${cardPx / 2}px)`,
            width:  `${cardPx}px`,
            height: '2px',
            background: 'rgba(246,245,242,0.12)',
          }}
        >
          <div ref={progressFillRef}
               style={{ height: '100%', background: 'rgba(246,245,242,0.75)', transformOrigin: 'left center' }} />
        </div>
      </div>

      {/* Controls row */}
      <div className="flex items-center justify-between px-8 sm:px-10 md:px-14 lg:px-20 xl:px-24">
        {/* Dots */}
        <div className="flex items-center gap-2">
          {cards.map((_, i) => (
            <div key={i} className="rounded-full transition-all duration-300" style={{
              width:      i === activeIndex ? '22px' : '5px',
              height:     '5px',
              background: i === activeIndex ? 'rgba(246,245,242,0.85)' : 'rgba(246,245,242,0.2)',
            }} />
          ))}
        </div>

        {/* Arrows — hidden on mobile */}
        {!isMobile && (
          <div className="flex items-center gap-2">
            {(['‹', '›'] as const).map((ch, i) => (
              <button key={ch} onClick={() => handleArrow(i === 0 ? -1 : 1)}
                aria-label={i === 0 ? 'Previous' : 'Next'}
                className="w-9 h-9 rounded-full flex items-center justify-center text-[18px] leading-none cursor-pointer transition-all duration-200 hover:bg-white/10"
                style={{ border: '1px solid rgba(246,245,242,0.2)', color: 'rgba(246,245,242,0.7)', background: 'transparent' }}>
                {ch}
              </button>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}
