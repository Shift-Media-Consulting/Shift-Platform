'use client'

import { useState } from 'react'

type FaqItem = {
  q: string
  a: string
}

type Props = {
  items: FaqItem[]
}

export default function ServicesFaq({ items }: Props) {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <div className="flex flex-col">
      {items.map((item, i) => {
        const isOpen = open === i
        return (
          <div
            key={i}
            style={{ borderTop: '1px solid rgba(17,17,17,0.12)' }}
            className={i === items.length - 1 ? 'border-b border-ink/[0.12]' : ''}
          >
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              className="w-full text-left flex items-start justify-between gap-6 py-7 cursor-pointer bg-transparent border-0"
              style={{ fontFamily: 'inherit' }}
            >
              <p className="font-bold text-[16px] sm:text-[17px] text-ink leading-[1.4] tracking-[-0.01em]">
                {item.q}
              </p>
              <span
                className={`flex-shrink-0 text-[22px] leading-none text-gray-warm transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] mt-0.5 ${isOpen ? 'rotate-45' : 'rotate-0'}`}
              >
                +
              </span>
            </button>

            <div
              className="overflow-hidden transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{ maxHeight: isOpen ? '300px' : '0', opacity: isOpen ? 1 : 0 }}
            >
              <p className="font-medium text-[15px] text-gray-warm leading-[1.65] pb-7">
                {item.a}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
