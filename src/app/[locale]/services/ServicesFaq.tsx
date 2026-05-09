'use client'

import { useState } from 'react'

type FaqItem = { q: string; a: string }
type Props   = { items: FaqItem[] }

export default function ServicesFaq({ items }: Props) {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <div className="flex flex-col">
      {items.map((item, i) => {
        const isOpen = open === i
        const isLast = i === items.length - 1
        return (
          <div
            key={i}
            style={{
              borderTop: '1px solid var(--fg-rule)',
              ...(isLast ? { borderBottom: '1px solid var(--fg-rule)' } : {}),
            }}
          >
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              className="w-full text-left flex items-start justify-between gap-6 py-7 cursor-pointer bg-transparent border-0"
              style={{ fontFamily: 'inherit' }}
            >
              <p
                className="font-bold text-[16px] sm:text-[17px] leading-[1.4] tracking-[-0.01em]"
                style={{ color: 'var(--fg)' }}
              >
                {item.q}
              </p>
              <span
                className={`flex-shrink-0 text-[22px] leading-none transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] mt-0.5 ${isOpen ? 'rotate-45' : 'rotate-0'}`}
                style={{ color: 'var(--fg-faint)' }}
              >
                +
              </span>
            </button>

            <div
              className="overflow-hidden transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{ maxHeight: isOpen ? '300px' : '0', opacity: isOpen ? 1 : 0 }}
            >
              <p
                className="font-medium text-[15px] leading-[1.65] pb-7"
                style={{ color: 'var(--fg-muted)' }}
              >
                {item.a}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
