'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { Observer } from 'gsap/Observer'

gsap.registerPlugin(Observer)

type Card = { name: string; desc: string }
type Props = { label: string; cards: Card[] }

export default function ServicesSlider({ label, cards }: Props) {
  const trackRef     = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const xRef         = useRef(0)
  const animRef      = useRef<gsap.core.Tween | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const tripled   = [...cards, ...cards, ...cards]
  const CARD_COUNT = cards.length

  useEffect(() => {
    const track     = trackRef.current
    const container = containerRef.current
    if (!track || !container) return

    const cardEls = Array.from(track.children) as HTMLElement[]
    const cardW   = cardEls[0]?.offsetWidth ?? 0
    const gap     = 20
    const step    = cardW + gap

    const startX = -(step * CARD_COUNT)
    xRef.current = startX
    gsap.set(track, { x: startX })

    const wrap = () => {
      if (xRef.current <= -(step * CARD_COUNT * 2)) {
        xRef.current += step * CARD_COUNT
        gsap.set(track, { x: xRef.current })
      } else if (xRef.current >= 0) {
        xRef.current -= step * CARD_COUNT
        gsap.set(track, { x: xRef.current })
      }
      const idx = Math.round((-xRef.current - step * CARD_COUNT) / step)
      setActiveIndex(((idx % CARD_COUNT) + CARD_COUNT) % CARD_COUNT)
    }

    const goTo = (delta: number) => {
      if (animRef.current) animRef.current.kill()
      const target = xRef.current - delta * step
      animRef.current = gsap.to(xRef, {
        current: target,
        duration: 0.65,
        ease: 'power3.out',
        onUpdate: () => { gsap.set(track, { x: xRef.current }); wrap() },
      })
    }

    const obs = Observer.create({
      target: container,
      type: 'touch,pointer',
      onDrag: (self: any) => {
        if (animRef.current) animRef.current.kill()
        xRef.current += self.deltaX
        gsap.set(track, { x: xRef.current })
        wrap()
      },
      onDragEnd: () => {
        const nearest = Math.round(-xRef.current / step) * step
        animRef.current = gsap.to(xRef, {
          current: -nearest,
          duration: 0.45,
          ease: 'power2.out',
          onUpdate: () => { gsap.set(track, { x: xRef.current }); wrap() },
        })
      },
      onLeft:  () => goTo(1),
      onRight: () => goTo(-1),
      dragMinimum: 8,
      preventDefault: true,
      lockAxis: true,
    })

    ;(container as HTMLElement & { _goTo?: (d: number) => void })._goTo = goTo

    return () => { obs.kill(); animRef.current?.kill() }
  }, [CARD_COUNT])

  const handleArrow = (dir: 1 | -1) => {
    const c = containerRef.current as HTMLElement & { _goTo?: (d: number) => void }
    c?._goTo?.(dir)
  }

  return (
    <div className="flex flex-col gap-5">

      {/* Header */}
      <div className="flex items-center justify-between px-[var(--margin-x)]">
        <p className="text-[10px] tracking-[2.5px] font-medium uppercase"
           style={{ fontFamily: 'var(--font-mono)', color: 'rgba(246,245,242,0.45)' }}>
          {label}
        </p>
        <div className="flex items-center gap-2 pr-[var(--margin-x)]">
          {['‹','›'].map((ch, i) => (
            <button
              key={ch}
              onClick={() => handleArrow(i === 0 ? -1 : 1)}
              aria-label={i === 0 ? 'Previous' : 'Next'}
              className="w-9 h-9 rounded-full flex items-center justify-center text-[18px] leading-none cursor-pointer transition-all duration-200 hover:bg-white/10"
              style={{ border: '1px solid rgba(246,245,242,0.2)', color: 'rgba(246,245,242,0.7)', background: 'transparent' }}
            >{ch}</button>
          ))}
        </div>
      </div>

      {/* Slider — mask fades right edge cleanly without a coloured overlay */}
      <div
        ref={containerRef}
        className="overflow-hidden touch-none select-none cursor-grab active:cursor-grabbing"
        style={{
          paddingLeft: 'var(--margin-x)',
          WebkitMaskImage: 'linear-gradient(to right, black 78%, transparent 100%)',
          maskImage:       'linear-gradient(to right, black 78%, transparent 100%)',
        }}
      >
        <div ref={trackRef} className="flex will-change-transform" style={{ gap: '20px' }}>
          {tripled.map((card, i) => (
            <div
              key={i}
              className="flex-shrink-0 flex flex-col justify-between rounded-2xl"
              style={{
                width: 'min(400px, calc(100vw - var(--margin-x) - 80px))',
                height: '300px',
                padding: 'clamp(24px, 2.5vw, 36px)',
                /* Proper frosted glass — visible but translucent */
                background:           'rgba(255,255,255,0.13)',
                backdropFilter:       'blur(28px) saturate(1.4)',
                WebkitBackdropFilter: 'blur(28px) saturate(1.4)',
                border:               '1px solid rgba(255,255,255,0.22)',
                boxShadow:            'inset 0 1px 0 rgba(255,255,255,0.18), 0 4px 24px rgba(0,0,0,0.08)',
                pointerEvents: 'none',
              }}
            >
              <div>
                <h3
                  className="font-bold text-cream leading-[1.0] tracking-[-0.025em] mb-4"
                  style={{ fontSize: 'clamp(26px, 3.2vw, 40px)' }}
                >
                  {card.name}
                </h3>
                <p className="font-medium leading-[1.65] text-[14px]"
                   style={{ color: 'rgba(246,245,242,0.82)' }}>
                  {card.desc}
                </p>
              </div>

              <p className="text-[10px] tracking-[1px]"
                 style={{ fontFamily: 'var(--font-mono)', color: 'rgba(246,245,242,0.28)' }}>
                [{String((i % CARD_COUNT) + 1).padStart(2, '0')}]
              </p>
            </div>
          ))}
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
