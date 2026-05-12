'use client'

import { useState } from 'react'

type PartnerItem = { role: string; title: string; description: string }
interface Props { items: PartnerItem[]; intro: string }

export default function PartnerNetwork({ items, intro }: Props) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  function handleCardClick(i: number) {
    setActiveIndex(prev => (prev === i ? null : i))
  }

  return (
    <>
      <style>{`
        .partner-card {
          border-radius: 8px;
          padding: 28px 32px;
          cursor: pointer;
          transition: background 200ms ease;
        }
        .partner-card:hover { background: rgba(0,77,64,0.06); }
        .partner-card.active { background: rgba(0,77,64,0.08); }
        .partner-slot {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-top: 20px;
          padding-top: 20px;
          animation: partnerSlotIn 0.3s cubic-bezier(0.16,1,0.3,1) both;
        }
        @keyframes partnerSlotIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 767px) {
          .partner-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* Intro */}
      <p
        className="reveal"
        style={{
          fontSize: '17px',
          color: 'var(--fg-muted)',
          lineHeight: 1.6,
          maxWidth: '700px',
          marginBottom: '48px',
        }}
      >
        {intro}
      </p>

      {/* Grid */}
      <div
        className="partner-grid reveal"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '24px',
        }}
      >
        {items.map((p, i) => {
          const isActive = activeIndex === i
          return (
            <div
              key={i}
              className={`partner-card${isActive ? ' active' : ''}`}
              onClick={() => handleCardClick(i)}
              role="button"
              tabIndex={0}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') handleCardClick(i) }}
              aria-expanded={isActive}
            >
              {/* Header row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <p style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  letterSpacing: '0.2em',
                  color: 'rgba(0,77,64,0.55)',
                }}>
                  {String(i + 1).padStart(2, '0')}
                </p>
                {isActive && (
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '13px',
                      color: 'rgba(17,17,17,0.38)',
                      lineHeight: 1,
                      userSelect: 'none',
                    }}
                    aria-hidden="true"
                  >
                    ×
                  </span>
                )}
              </div>

              {/* Title */}
              <p style={{
                fontFamily: 'var(--font-head)',
                fontWeight: 700,
                fontSize: '22px',
                color: 'var(--fg)',
                marginBottom: '8px',
                lineHeight: 1.2,
              }}>
                {p.title}
              </p>

              {/* Description */}
              <p style={{
                fontSize: '14px',
                color: 'var(--fg-muted)',
                lineHeight: 1.55,
              }}>
                {p.description}
              </p>

              {/* Expanded partner slot */}
              {isActive && (
                <div className="partner-slot">
                  {/* Avatar placeholder */}
                  <div style={{
                    flexShrink: 0,
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'rgba(0,77,64,0.10)',
                  }} />
                  {/* Text */}
                  <div>
                    <p style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      letterSpacing: '0.12em',
                      color: 'rgba(0,77,64,0.65)',
                      marginBottom: '4px',
                    }}>
                      {p.role} · Engaged by name
                    </p>
                    <p style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      letterSpacing: '0.08em',
                      color: 'rgba(17,17,17,0.38)',
                    }}>
                      Details available on request
                    </p>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </>
  )
}
