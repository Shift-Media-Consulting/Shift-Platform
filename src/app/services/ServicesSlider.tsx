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

  // Triple-clone the cards so wrapping is always seamless
  const tripled = [...cards, ...cards, ...cards]
  const CARD_COUNT = cards.length

  useEffect(() => {
    const track = trackRef.current
    const container = containerRef.current
    if (!track || !container) return

    const cardEls = Array.from(track.children) as HTMLElement[]
    const totalCards = cardEls.length // tripled.length
    const cardW = cardEls[0]?.offsetWidth ?? 0
    const gap = 16
    const step = cardW + gap
    const totalW = step * totalCards

    // Start in the middle set so there's room to wrap in both directions
    const startX = -(step * CARD_COUNT)
    xRef.current = startX
    gsap.set(track, { x: startX })

    const wrap = () => {
      // Wrap position to stay in the middle third
      if (xRef.current <= -(step * CARD_COUNT * 2)) {
        xRef.current += step * CARD_COUNT
        gsap.set(track, { x: xRef.current })
      } else if (xRef.current >= 0) {
        xRef.current -= step * CARD_COUNT
        gsap.set(track, { x: xRef.current })
      }
      // Update active index based on current position
      const idx = Math.round((-xRef.current - step * CARD_COUNT) / step)
      setActiveIndex(((idx % CARD_COUNT) + CARD_COUNT) % CARD_COUNT)
    }

    const goTo = (delta: number) => {
      if (animRef.current) animRef.current.kill()
      const target = xRef.current - delta * step
      animRef.current = gsap.to(xRef, {
        current: target,
        duration: 0.6,
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
        // Snap to nearest card
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
      // Swipe
      onLeft: () => goTo(1),
      onRight: () => goTo(-1),
      dragMinimum: 8,
      preventDefault: true,
      lockAxis: true,
    })

    // Expose goTo on the container element for the arrow buttons
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
    <div className="flex flex-col gap-5">
      {/* Overline */}
      <p
        className="text-[10px] tracking-[2.5px] font-medium uppercase"
        style={{ fontFamily: 'var(--font-mono)', color: 'rgba(246,245,242,0.5)' }}
      >
        {label}
      </p>

      {/* Slider viewport — overflow hidden, touch-none prevents scroll hijack on mobile */}
      <div
        ref={containerRef}
        className="relative overflow-hidden rounded-2xl touch-none select-none cursor-grab active:cursor-grabbing"
        style={{ height: '280px' }}
      >
        {/* Track */}
        <div
          ref={trackRef}
          className="absolute top-0 left-0 flex gap-4 will-change-transform"
          style={{ paddingLeft: '0px' }}
        >
          {tripled.map((card, i) => (
            <div
              key={i}
              className="flex-shrink-0 rounded-2xl flex flex-col justify-between p-8"
              style={{
                width: 'min(360px, calc(100vw - 96px))',
                height: '280px',
                background: '#f6f5f2',
                pointerEvents: 'none',
              }}
            >
              <div>
                <h3
                  className="font-bold text-ink leading-[1.0] tracking-[-0.025em] mb-4"
                  style={{ fontSize: 'clamp(28px, 3.5vw, 40px)' }}
                >
                  {card.name}
                </h3>
                <p className="font-medium text-[14px] text-gray-warm leading-[1.65]">
                  {card.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        {/* Dots */}
        <div className="flex items-center gap-2">
          {cards.map((_, i) => (
            <div
              key={i}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === activeIndex ? '20px' : '6px',
                height: '6px',
                background: i === activeIndex ? 'rgba(246,245,242,0.9)' : 'rgba(246,245,242,0.25)',
              }}
            />
          ))}
        </div>

        {/* Arrows */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleArrow(-1)}
            aria-label="Previous"
            className="w-9 h-9 rounded-full flex items-center justify-center text-[18px] leading-none border-0 cursor-pointer transition-all duration-200"
            style={{ background: 'rgba(246,245,242,0.12)', color: 'rgba(246,245,242,0.8)' }}
          >‹</button>
          <button
            onClick={() => handleArrow(1)}
            aria-label="Next"
            className="w-9 h-9 rounded-full flex items-center justify-center text-[18px] leading-none border-0 cursor-pointer transition-all duration-200"
            style={{ background: 'rgba(246,245,242,0.12)', color: 'rgba(246,245,242,0.8)' }}
          >›</button>
        </div>
      </div>
    </div>
  )
}
