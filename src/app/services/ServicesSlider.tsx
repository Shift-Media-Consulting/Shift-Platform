'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { Observer } from 'gsap/Observer'

gsap.registerPlugin(Observer)

type Card = {
  name: string
  desc: string
}

type Props = {
  label: string
  cards: Card[]
}

export default function ServicesSlider({ label, cards }: Props) {
  const trackRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const xRef = useRef(0)
  const animRef = useRef<gsap.core.Tween | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const tripled = [...cards, ...cards, ...cards]
  const CARD_COUNT = cards.length

  useEffect(() => {
    const track = trackRef.current
    const container = containerRef.current
    if (!track || !container) return

    const cardEls = Array.from(track.children) as HTMLElement[]
    const cardW = cardEls[0]?.offsetWidth ?? 0
    const gap = 20
    const step = cardW + gap

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
        onUpdate: () => {
          gsap.set(track, { x: xRef.current })
          wrap()
        },
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
      onDragEnd: (self: any) => {
        const nearest = Math.round(-xRef.current / step) * step
        animRef.current = gsap.to(xRef, {
          current: -nearest,
          duration: 0.45,
          ease: 'power2.out',
          onUpdate: () => {
            gsap.set(track, { x: xRef.current })
            wrap()
          },
        })
      },
      onLeft: () => goTo(1),
      onRight: () => goTo(-1),
      dragMinimum: 8,
      preventDefault: true,
      lockAxis: true,
    })

    ;(container as HTMLElement & { _goTo?: (d: number) => void })._goTo = goTo

    return () => {
      obs.kill()
      animRef.current?.kill()
    }
  }, [CARD_COUNT])

  const handleArrow = (dir: 1 | -1) => {
    const container = containerRef.current as HTMLElement & { _goTo?: (d: number) => void }
    container?._goTo?.(dir)
  }

  return (
    <div className="flex flex-col gap-6">

      {/* Header row */}
      <div className="flex items-center justify-between px-[var(--margin-x)]">
        <p
          className="text-[10px] tracking-[2.5px] font-medium uppercase"
          style={{ fontFamily: 'var(--font-mono)', color: 'rgba(246,245,242,0.45)' }}
        >
          {label}
        </p>
        {/* Arrows */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleArrow(-1)}
            aria-label="Previous"
            className="w-9 h-9 rounded-full flex items-center justify-center text-[18px] leading-none border cursor-pointer transition-all duration-200 hover:bg-white/10"
            style={{ borderColor: 'rgba(246,245,242,0.2)', color: 'rgba(246,245,242,0.7)', background: 'transparent' }}
          >‹</button>
          <button
            onClick={() => handleArrow(1)}
            aria-label="Next"
            className="w-9 h-9 rounded-full flex items-center justify-center text-[18px] leading-none border cursor-pointer transition-all duration-200 hover:bg-white/10"
            style={{ borderColor: 'rgba(246,245,242,0.2)', color: 'rgba(246,245,242,0.7)', background: 'transparent' }}
          >›</button>
        </div>
      </div>

      {/* Slider viewport */}
      <div className="relative">
        <div
          ref={containerRef}
          className="overflow-hidden touch-none select-none cursor-grab active:cursor-grabbing"
          style={{ paddingLeft: 'var(--margin-x)' }}
        >
          {/* Track */}
          <div
            ref={trackRef}
            className="flex will-change-transform"
            style={{ gap: '20px' }}
          >
            {tripled.map((card, i) => (
              <div
                key={i}
                className="flex-shrink-0 flex flex-col justify-between rounded-3xl"
                style={{
                  width: 'min(460px, calc(100vw - var(--margin-x) - 80px))',
                  height: '340px',
                  padding: 'clamp(28px, 3vw, 40px)',
                  background: 'rgba(255,255,255,0.09)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  pointerEvents: 'none',
                }}
              >
                <div>
                  <h3
                    className="font-bold text-cream leading-[1.0] tracking-[-0.025em] mb-5"
                    style={{ fontSize: 'clamp(32px, 4vw, 48px)' }}
                  >
                    {card.name}
                  </h3>
                  <p
                    className="font-medium leading-[1.65]"
                    style={{ fontSize: '15px', color: 'rgba(246,245,242,0.72)' }}
                  >
                    {card.desc}
                  </p>
                </div>

                {/* Index badge */}
                <p
                  className="text-[11px] tracking-[1px]"
                  style={{ fontFamily: 'var(--font-mono)', color: 'rgba(246,245,242,0.3)' }}
                >
                  [{String(cards.indexOf(card) + 1).padStart(2, '0')}]
                </p>
              </div>
            ))}
          </div>

          {/* Right fade */}
          <div
            className="absolute top-0 right-0 h-full w-24 pointer-events-none"
            style={{ background: 'linear-gradient(to right, transparent, rgba(0,105,92,0.6))' }}
          />
        </div>
      </div>

      {/* Dots */}
      <div className="flex items-center gap-2 px-[var(--margin-x)]">
        {cards.map((_, i) => (
          <div
            key={i}
            className="rounded-full transition-all duration-300"
            style={{
              width: i === activeIndex ? '24px' : '5px',
              height: '5px',
              background: i === activeIndex ? 'rgba(246,245,242,0.85)' : 'rgba(246,245,242,0.2)',
            }}
          />
        ))}
      </div>
    </div>
  )
}
