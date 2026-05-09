'use client'

import { useState } from 'react'

type Card = {
  name: string
  desc: string
  detail?: string
}

type Props = {
  label: string
  cards: Card[]
}

export default function ServicesCarousel({ label, cards }: Props) {
  const [active, setActive] = useState(0)

  const prev = () => setActive(i => (i - 1 + cards.length) % cards.length)
  const next = () => setActive(i => (i + 1) % cards.length)

  const card = cards[active]

  return (
    <div className="flex flex-col gap-4">

      {/* Overline label — cream so it reads on the dark gradient */}
      <p
        className="text-[10px] tracking-[2.5px] font-medium uppercase"
        style={{ fontFamily: 'var(--font-mono)', color: 'rgba(246,245,242,0.5)' }}
      >
        {label}
      </p>

      {/* Card — solid cream so it pops against any teal background */}
      <div
        className="rounded-2xl p-8 sm:p-10 flex flex-col"
        style={{ background: '#f6f5f2', minHeight: '280px' }}
      >
        {/* Counter + dots */}
        <div className="flex items-center justify-between mb-8">
          <span
            className="text-[10px] tracking-[2px] text-gray-soft"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            {String(active + 1).padStart(2, '0')} / {String(cards.length).padStart(2, '0')}
          </span>
          <div className="flex gap-2 items-center">
            {cards.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                aria-label={`Go to slide ${i + 1}`}
                className="border-0 p-0 cursor-pointer transition-all duration-300"
                style={{
                  borderRadius: '9999px',
                  width: i === active ? '20px' : '6px',
                  height: '6px',
                  background: i === active ? 'var(--teal)' : 'rgba(17,17,17,0.2)',
                }}
              />
            ))}
          </div>
        </div>

        {/* Name */}
        <h3
          className="font-bold text-ink leading-[1.0] tracking-[-0.025em] mb-5"
          style={{ fontSize: 'clamp(32px, 4vw, 48px)' }}
        >
          {card.name}
        </h3>

        {/* Description */}
        <p className="font-medium text-[15px] text-gray-warm leading-[1.65] max-w-[460px]">
          {card.desc}
        </p>

        {/* Detail line */}
        {card.detail && (
          <p
            className="mt-5 text-[11px] text-gray-soft leading-[1.8] tracking-[0.3px]"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            {card.detail}
          </p>
        )}

        {/* Spacer + navigation */}
        <div className="mt-auto pt-8 flex items-center gap-3">
          <button
            onClick={prev}
            aria-label="Previous"
            className="w-9 h-9 rounded-full flex items-center justify-center text-[18px] leading-none border-0 cursor-pointer transition-all duration-200"
            style={{
              background: 'rgba(0,77,64,0.08)',
              color: 'var(--teal)',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,77,64,0.15)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(0,77,64,0.08)')}
          >
            ‹
          </button>
          <button
            onClick={next}
            aria-label="Next"
            className="w-9 h-9 rounded-full flex items-center justify-center text-[18px] leading-none border-0 cursor-pointer transition-all duration-200"
            style={{
              background: 'rgba(0,77,64,0.08)',
              color: 'var(--teal)',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,77,64,0.15)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(0,77,64,0.08)')}
          >
            ›
          </button>
        </div>
      </div>
    </div>
  )
}
