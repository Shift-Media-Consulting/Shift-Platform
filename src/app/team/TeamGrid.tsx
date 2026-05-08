'use client'

import { useState } from 'react'

type Founder = {
  id: string
  name: string
  email: string
  hook: string
  discipline: string
  bio: string[]
  linkedin: string   // placeholder: supply URL
  previously: string // placeholder: supply content
}

type Partner = {
  id: string
  discipline: string
  description: string
}

const founders: Founder[] = [
  {
    id: 'justin',
    name: 'Justin Stiebel',
    email: 'justin@shift-media.io',
    hook: 'Justin runs the controlling side of shift.media — budgets, costs, vendor terms, and the Shift Platform.',
    discipline: 'Strategy, Production Leadership & Advisory',
    bio: [
      'Production controlling and advisory specialist with deep market knowledge across German and European TVC, content, and campaign production.',
      'Has built and managed production budgets across formats, from small social campaigns to large-scale international shoots. Knows what things cost, what gets padded, and where clients are being underserved.',
      'Specialist in the German market: its rates, its production companies, its directors, and its dynamics.',
    ],
    linkedin: 'https://linkedin.com/in/[PLACEHOLDER — Justin to supply]',
    previously: '[PLACEHOLDER — Justin to supply]',
  },
  {
    id: 'cornelius',
    name: 'Cornelius Roenz',
    email: 'cornelius@shift-media.io',
    hook: 'Cornelius runs the strategy and organisational design side of shift.media — operating models, in-house builds, executive production.',
    discipline: 'Strategy, Organisational Design & Executive Production',
    bio: [
      'Production leader with extensive experience building and running production functions at agency and brand level across Europe.',
      'Has operated at every level of high-end commercial production, from the set to the boardroom. Knows what it takes to deliver creatively demanding, commercially complex campaigns, and what it takes to lead the organisations that produce them through growth, transition, and change.',
      'Specialist in production strategy, organisational transformation, and sustainable structures for brands and agencies navigating a shifting market.',
    ],
    linkedin: 'https://linkedin.com/in/[PLACEHOLDER — Cornelius to supply]',
    previously: '[PLACEHOLDER — Cornelius to supply]',
  },
  {
    id: 'jankel',
    name: 'Jankel Huppertz',
    email: 'jankel@shift-media.io',
    hook: 'Jankel runs the production leadership and operations side of shift.media — process, structure, delivery.',
    discipline: 'Production Leadership, Operations & Advisory',
    bio: [
      'Production leader with deep experience across agency production. Understands how TVC, content, and campaign production works, from idea to execution.',
      'Has built and managed production across formats and scales, from agile content to large international campaigns. Knows how to run complex productions, align teams, and deliver against creative and commercial demands.',
      'Specialist in production structures, processes, budgets, and where value is created or lost.',
    ],
    linkedin: 'https://linkedin.com/in/[PLACEHOLDER — Jankel to supply]',
    previously: '[PLACEHOLDER — Jankel to supply]',
  },
]

const teamStats = [
  { value: '[XX]+', label: 'years on production combined' },
  { value: '[XX]+', label: 'productions delivered' },
  { value: '€[XX]M+', label: 'in production budget overseen' },
  { value: '[XX]',  label: 'markets worked across' },
  { value: '[XX]',  label: 'languages across the team' },
]

const partners: Partner[] = [
  { id: 'p1', discipline: 'Finance & Treasury',          description: 'Independent financial oversight, treasury structures, and procurement strategy for production-heavy organisations.' },
  { id: 'p2', discipline: 'Strategy & Brand',            description: 'Senior strategic counsel on brand positioning, content strategy, and how production serves the wider marketing system.' },
  { id: 'p3', discipline: 'AI & Technology',             description: 'Hands-on practitioners across generative AI, production tooling, and the integration of technology into creative workflows.' },
  { id: 'p4', discipline: 'Creative Direction',          description: 'Award-winning creative leadership for projects requiring senior creative oversight from concept through delivery.' },
  { id: 'p5', discipline: 'Sustainable Production',      description: 'Specialists in carbon budgeting, sustainable supplier selection, and ESG reporting across film and content production.' },
  { id: 'p6', discipline: 'Legal & Rights',              description: 'Music licensing, talent buyouts, IP frameworks, and the legal architecture behind compliant, modern production.' },
  { id: 'p7', discipline: 'Post-Production & VFX',       description: 'Senior post supervisors and VFX leads who advise on pipeline design, vendor evaluation, and quality control.' },
  { id: 'p8', discipline: 'International Production',    description: 'Specialists in cross-border production structures, offshore execution, and multi-market campaign delivery.' },
]

/* LinkedIn icon — standard mark */
function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg
      width="16" height="16" viewBox="0 0 24 24"
      fill="currentColor" aria-hidden="true"
      className={className}
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  )
}

export default function TeamGrid() {
  const [open, setOpen] = useState<string | null>(null)

  return (
    <>
      {/* FOUNDERS */}
      <section
        className="px-8 sm:px-10 md:px-14 lg:px-20 xl:px-24"
        style={{ paddingTop: 'clamp(56px, 10vw, 80px)', paddingBottom: 'clamp(56px, 10vw, 80px)' }}
      >
        <div className="max-w-[1200px]">
          <h2
            className="font-bold text-ink leading-[1.0] tracking-[-0.02em] mb-12 sm:mb-16 max-w-[900px]"
            style={{ fontSize: 'clamp(32px, 4.5vw, 60px)' }}
          >
            Three founders.{' '}
            <em className="not-italic font-bold text-teal-mid" style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>
              One independent firm.
            </em>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {founders.map(f => {
              const isOpen = open === f.id
              return (
                <button
                  key={f.id}
                  onClick={() => setOpen(isOpen ? null : f.id)}
                  className={[
                    'group relative text-left rounded-2xl p-7 sm:p-9 cursor-pointer',
                    'transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
                    'flex flex-col gap-5 min-h-[200px] border-0',
                    isOpen
                      ? 'bg-teal text-cream shadow-[0_20px_50px_rgba(0,0,0,0.18)]'
                      : 'bg-transparent text-ink hover:bg-cream/30',
                  ].join(' ')}
                  style={{ fontFamily: 'inherit' }}
                >
                  <div className="flex justify-between items-start">
                    <p
                      className={`text-[11px] tracking-[2px] transition-colors ${isOpen ? 'text-cream/65' : 'text-gray-warm'}`}
                      style={{ fontFamily: 'var(--font-mono)' }}
                    >
                      CO-FOUNDER
                    </p>
                    <span
                      className={`text-[22px] leading-none inline-block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isOpen ? 'rotate-45 text-cream' : 'rotate-0 text-gray-warm'}`}
                    >
                      +
                    </span>
                  </div>

                  <h3
                    className={`font-bold leading-[1.0] tracking-[-0.025em] ${isOpen ? 'text-cream' : 'text-ink'}`}
                    style={{ fontSize: 'clamp(24px, 3vw, 32px)' }}
                  >
                    {f.name}
                  </h3>

                  <div
                    className="overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col gap-5"
                    style={{
                      maxHeight: isOpen ? '800px' : '0',
                      opacity: isOpen ? 1 : 0,
                    }}
                  >
                    {/* Role hook */}
                    <p
                      className="font-bold text-cream/90 leading-[1.4] tracking-[-0.01em]"
                      style={{
                        fontFamily: 'var(--font-serif)',
                        fontStyle: 'italic',
                        fontSize: 'clamp(14px, 1.4vw, 16px)',
                      }}
                    >
                      {f.hook}
                    </p>

                    <p
                      className="text-[11px] tracking-[1px] leading-[1.5] text-cream/70"
                      style={{ fontFamily: 'var(--font-mono)' }}
                    >
                      {f.discipline.toUpperCase()}
                    </p>

                    {f.bio.map((para, i) => (
                      <p key={i} className="font-medium text-[14px] leading-[1.65] text-cream/85">
                        {para}
                      </p>
                    ))}

                    {/* Previously */}
                    <p
                      className="font-medium text-[12px] text-cream/50 leading-[1.5]"
                      style={{ fontFamily: 'var(--font-mono)' }}
                    >
                      PREVIOUSLY: {f.previously}
                    </p>

                    {/* Contact + LinkedIn */}
                    <div className="flex items-center gap-4 mt-1">
                      <a
                        href={`mailto:${f.email}`}
                        onClick={e => e.stopPropagation()}
                        className="font-bold text-[14px] text-cream no-underline border-b border-cream/40 pb-1"
                      >
                        {f.email}
                      </a>
                      <a
                        href={f.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={e => e.stopPropagation()}
                        aria-label={`${f.name} on LinkedIn`}
                        className="text-cream/60 hover:text-cream transition-colors"
                      >
                        <LinkedInIcon />
                      </a>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* TEAM IN NUMBERS */}
      <section
        className="px-8 sm:px-10 md:px-14 lg:px-20 xl:px-24"
        style={{ paddingTop: 'clamp(56px, 10vw, 80px)', paddingBottom: 'clamp(56px, 10vw, 80px)' }}
      >
        <div className="max-w-[1200px]">
          <h2
            className="font-bold text-ink leading-[1.0] tracking-[-0.02em] mb-12 sm:mb-16"
            style={{ fontSize: 'clamp(32px, 4.5vw, 60px)' }}
          >
            The team{' '}
            <em className="not-italic font-bold text-teal-mid" style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>
              in numbers.
            </em>
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-y-10 gap-x-8">
            {teamStats.map((stat, i) => (
              <div key={i} className="flex flex-col gap-2">
                <p
                  className="font-bold text-ink leading-[1.0] tracking-[-0.03em]"
                  style={{ fontSize: 'clamp(28px, 4vw, 48px)' }}
                >
                  {stat.value}
                </p>
                <p className="font-medium text-[13px] text-gray-warm leading-[1.5]">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          <p
            className="mt-8 text-[11px] text-gray-soft"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            Numbers to be confirmed by the founders.
          </p>
        </div>
      </section>

      {/* PARTNER NETWORK */}
      <section
        className="px-8 sm:px-10 md:px-14 lg:px-20 xl:px-24"
        style={{ paddingTop: 'clamp(56px, 10vw, 80px)', paddingBottom: 'clamp(80px, 14vw, 120px)' }}
      >
        <div className="max-w-[1200px]">
          <p className="font-medium text-[16px] sm:text-[17px] text-gray-warm leading-[1.6] max-w-[640px] mb-12 sm:mb-14">
            Our partner network is a curated group of senior specialists we
            engage on specific projects. They are independent (not staff, not employees) and they extend our expertise where it is needed.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-10 sm:gap-y-12 gap-x-8">
            {partners.map(p => (
              <div key={p.id} className="flex flex-col">
                <p className="text-[11px] tracking-[2px] text-teal-mid mb-4" style={{ fontFamily: 'var(--font-mono)' }}>
                  PARTNER
                </p>
                <h3 className="font-bold text-[18px] text-ink leading-[1.1] tracking-[-0.015em] mb-3.5">
                  {p.discipline}
                </h3>
                <p className="font-medium text-[13px] text-gray-warm leading-[1.6]">
                  {p.description}
                </p>
              </div>
            ))}
          </div>

          <p
            className="mt-12 font-medium text-[14px] text-gray-warm leading-[1.55]"
          >
            We engage senior partners by project, not by retainer.
            Names available under NDA.
          </p>
        </div>
      </section>
    </>
  )
}
