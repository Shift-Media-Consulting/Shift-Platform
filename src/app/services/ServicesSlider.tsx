'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { gsap } from 'gsap'
import { Observer } from 'gsap/Observer'

gsap.registerPlugin(Observer)

type Card = { name: string; desc: string }
type Props = { label: string; cards: Card[] }

const EASE            = 'cubic-bezier(0.65,0,0.35,1)'
const DURATION        = 0.8
const AUTO_MS         = 7000
const RESUME_AFTER_MS = 4000
const GAP             = 20

export default function ServicesSlider({ label, cards }: Props) {
  const trackRef        = useRef<HTMLDivElement>(null)
  const containerRef    = useRef<HTMLDivElement>(null)
  const progressFillRef = useRef<HTMLDivElement>(null)
  const xRef            = useRef(0)
  const animRef         = useRef<gsap.core.Tween | null>(null)
  const progAnimRef     = useRef<gsap.core.Tween | null>(null)
  const autoTimerRef    = useRef<ReturnType<typeof setTimeout> | null>(null)
  const resumeTimerRef  = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isPausedRef     = useRef(false)
  const goToRef         = useRef<(d: number) => void>(() => {})

  const [activeIndex, setActiveIndex] = useState(0)
  const [isMobile, setIsMobile]       = useState(false)
  const [cardPx, setCardPx]           = useState(400)

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

  /* Card opacity / scale */
  const updateCards = useCallback((cardEls: HTMLElement[], activeIdx: number) => {
    cardEls.forEach((el, i) => {
      const src  = i % CARD_COUNT
      const dist = Math.min(Math.abs(src - activeIdx), CARD_COUNT - Math.abs(src - activeIdx))
      gsap.to(el, {
        scale:   dist === 0 ? 1.035 : 1,
        opacity: dist === 0 ? 1 : dist === 1 ? 0.55 : 0.28,
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

    const cardEls = Array.from(track.children) as HTMLElement[]
    const cw      = cardEls[0]?.offsetWidth ?? 400
    setCardPx(cw)
    const step = cw + GAP

    xRef.current = -(step * CARD_COUNT)
    gsap.set(track, { x: xRef.current })
    updateCards(cardEls, 0)

    const wrap = () => {
      if (xRef.current <= -(step * CARD_COUNT * 2)) {
        xRef.current += step * CARD_COUNT
        gsap.set(track, { x: xRef.current })
      } else if (xRef.current >= 0) {
        xRef.current -= step * CARD_COUNT
        gsap.set(track, { x: xRef.current })
      }
      const idx       = Math.round((-xRef.current - step * CARD_COUNT) / step)
      const newActive = ((idx % CARD_COUNT) + CARD_COUNT) % CARD_COUNT
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
        const nearest = Math.round(-xRef.current / step) * step
        animRef.current = gsap.to(xRef, {
          current:  -nearest,
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

  const mask = isMobile
    ? 'linear-gradient(to right, black 4%, black 96%, transparent 100%)'
    : 'linear-gradient(to right, black 30%, black 70%, transparent 100%)'

  return (
    <div className="flex flex-col gap-5">

      {/* Header */}
      <div className="flex items-center justify-between px-[var(--margin-x)]">
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '2.5px',
                    fontWeight: 500, textTransform: 'uppercase', color: 'rgba(246,245,242,0.45)' }}>
          {label}
        </p>
        {!isMobile && (
          <div className="flex items-center gap-2 pr-[var(--margin-x)]">
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

      {/* Slider wrapper — relative so progress bar can overlay */}
      <div className="relative">

        {/* Radial highlight behind active card */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: `radial-gradient(ellipse 50% 40% at calc(var(--margin-x) + ${cardPx / 2}px) 50%, rgba(246,245,242,0.08), transparent 70%)`,
        }} />

        {/* Scrolling track */}
        <div
          ref={containerRef}
          className="overflow-hidden touch-none select-none cursor-grab active:cursor-grabbing"
          style={{ paddingLeft: 'var(--margin-x)', WebkitMaskImage: mask, maskImage: mask }}
        >
          <div ref={trackRef} className="flex will-change-transform" style={{ gap: `${GAP}px` }}>
            {tripled.map((card, i) => {
              const src = i % CARD_COUNT
              return (
                <div key={i}
                  className="flex-shrink-0 flex flex-col rounded-2xl overflow-hidden"
                  style={{
                    width:                isMobile ? '82vw' : 'min(400px, calc(100vw - var(--margin-x) - 80px))',
                    height:               '380px',
                    background:           'rgba(246,245,242,0.10)',
                    backdropFilter:       'blur(10px) saturate(1.3)',
                    WebkitBackdropFilter: 'blur(10px) saturate(1.3)',
                    border:               '1px solid rgba(246,245,242,0.28)',
                    boxShadow:            'inset 0 1px 0 rgba(246,245,242,0.25), 0 24px 60px -20px rgba(0,0,0,0.25)',
                    pointerEvents:        'none',
                  }}
                >
                  <div className="flex flex-col h-full" style={{ padding: 'clamp(24px, 2.5vw, 36px)' }}>

                    {/* [01] + hairline */}
                    <div style={{ paddingBottom: '24px', borderBottom: '1px solid rgba(246,245,242,0.25)', marginBottom: '24px' }}>
                      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '14px',
                                  letterSpacing: '0.18em', color: 'rgba(246,245,242,0.55)', fontWeight: 400 }}>
                        [{String(src + 1).padStart(2, '0')}]
                      </p>
                    </div>

                    {/* Title */}
                    <h3 style={{
                      fontSize:      'clamp(52px, 6.5vw, 100px)',
                      lineHeight:    0.92,
                      letterSpacing: '-0.025em',
                      fontWeight:    600,
                      color:         '#f6f5f2',
                      marginBottom:  '20px',
                    }}>
                      {card.name}
                    </h3>

                    {/* Body */}
                    <p style={{ fontSize: '16px', lineHeight: 1.45, maxWidth: '420px',
                                color: 'rgba(246,245,242,0.82)', fontWeight: 400 }}>
                      {card.desc}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Progress bar — floats over the active card, outside overflow:hidden */}
        <div
          className="absolute pointer-events-none"
          style={{
            bottom: 0,
            left:   'var(--margin-x)',
            width:  `min(400px, calc(100vw - var(--margin-x) - 80px))`,
            height: '2px',
            background: 'rgba(246,245,242,0.12)',
          }}
        >
          <div ref={progressFillRef} style={{ height: '100%', background: 'rgba(246,245,242,0.75)', transformOrigin: 'left center' }} />
        </div>
      </div>

      {/* Dots */}
      <div className="flex items-center gap-2 px-[var(--margin-x)]">
        {cards.map((_, i) => (
          <div key={i} className="rounded-full transition-all duration-300" style={{
            width:      i === activeIndex ? '22px' : '5px',
            height:     '5px',
            background: i === activeIndex ? 'rgba(246,245,242,0.85)' : 'rgba(246,245,242,0.2)',
          }} />
        ))}
      </div>

    </div>
  )
}
