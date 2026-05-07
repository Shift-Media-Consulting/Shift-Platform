'use client'

import { useState } from 'react'

type Dimension = {
  num: string
  name: string
  desc: string
}

const dimensions: Dimension[] = [
  {
    num: '01',
    name: 'Workflow & Process Efficiency',
    desc: 'We map your end-to-end flow from brief to delivery, identify where time and money are being lost, and quantify waiting time, handoff failures, and process variance. Most production waste is invisible until someone maps it.',
  },
  {
    num: '02',
    name: 'Technology & Systems Integration',
    desc: 'We assess your tech stack, integration health, adoption rates, and whether your technology investment is actually serving your production goals — or creating new complexity.',
  },
  {
    num: '03',
    name: 'Budget & Resource Allocation',
    desc: 'We examine budget structure, cost variance patterns, financial governance, and how resources are modelled and deployed across the production lifecycle.',
  },
  {
    num: '04',
    name: 'Team Structure & Capability',
    desc: 'We map roles, decision rights, capability coverage, key-person risk, and the architecture of progression and retention. Who does what, who decides what, and what happens when someone leaves.',
  },
  {
    num: '05',
    name: 'Content Pipeline & Output Quality',
    desc: 'We trace the path of content from brief through production to archive, evaluate quality control mechanisms, rework rates, and feedback loops. Where does quality get created — and where does it get eroded?',
  },
  {
    num: '06',
    name: 'Vendor & Partner Management',
    desc: 'We segment your vendor portfolio, assess contract structure and service levels, and evaluate the relationships that matter most to your output. Not all vendors are equal — and most brands treat them as if they are.',
  },
]

export default function MethodDimensions() {
  const [open, setOpen] = useState<string | null>(null)

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
      {dimensions.map(item => {
        const isOpen = open === item.num
        return (
          <button
            key={item.num}
            onClick={() => setOpen(isOpen ? null : item.num)}
            className={[
              'group relative text-left rounded-2xl p-7 sm:p-9 cursor-pointer',
              'transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
              'flex flex-col gap-4 min-h-[160px] border-0',
              isOpen
                ? 'bg-teal text-cream shadow-[0_20px_50px_rgba(0,0,0,0.18)]'
                : 'bg-[#f6f5f2] text-ink shadow-[0_1px_6px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)]',
            ].join(' ')}
            style={{ fontFamily: 'inherit' }}
          >
            <div className="flex justify-between items-start">
              <p
                className={`text-[11px] tracking-[1.5px] transition-colors ${isOpen ? 'text-cream/55' : 'text-gray-soft'}`}
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                [{item.num}]
              </p>
              <span
                className={`text-[20px] leading-none inline-block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isOpen ? 'rotate-45 text-cream' : 'rotate-0 text-gray-warm'}`}
              >
                +
              </span>
            </div>

            <h3
              className={`font-bold leading-[1.05] tracking-[-0.015em] ${isOpen ? 'text-cream' : 'text-ink'}`}
              style={{ fontSize: 'clamp(17px, 2vw, 21px)' }}
            >
              {item.name}
            </h3>

            <div
              className="overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{
                maxHeight: isOpen ? '400px' : '0',
                opacity: isOpen ? 1 : 0,
              }}
            >
              <p className="font-medium text-[14px] leading-[1.65] text-cream/85 pt-1">
                {item.desc}
              </p>
            </div>
          </button>
        )
      })}
    </div>
  )
}
