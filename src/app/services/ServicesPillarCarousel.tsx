'use client'

import { useState, useRef, useEffect } from 'react'

type Pillar = {
  num: string
  label: string
  name: string
  desc: string
  details: string
  outcome: string
}

export default function ServicesPillarCarousel({ pillars }: { pillars: Pillar[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  /* Animate panel open / close */
  useEffect(() => {
    const el = panelRef.current
    if (!el) return
    if (activeIndex !== null) {
      el.style.display = 'block'
      el.style.maxHeight = '0'
      el.style.opacity = '0'
      requestAnimationFrame(() => {
        el.style.transition = 'max-height 500ms cubic-bezier(0.65,0,0.35,1), opacity 350ms ease'
        el.style.maxHeight = el.scrollHeight + 'px'
        el.style.opacity = '1'
      })
    } else {
      el.style.transition = 'max-height 400ms cubic-bezier(0.65,0,0.35,1), opacity 250ms ease'
      el.style.maxHeight = '0'
      el.style.opacity = '0'
      const tid = setTimeout(() => { if (el) el.style.display = 'none' }, 420)
      return () => clearTimeout(tid)
    }
  }, [activeIndex])

  const handleCard = (idx: number) => {
    setActiveIndex(prev => prev === idx ? null : idx)
  }

  const active = activeIndex !== null ? pillars[activeIndex] : null

  return (
    <div>
      {/* Card row */}
      <div
        className="svc-pillar-carousel"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '1px',
          background: 'rgba(246,245,242,0.15)',
          borderRadius: '16px',
          overflow: 'hidden',
        }}
      >
        {pillars.map((item, idx) => {
          const isActive = activeIndex === idx
          return (
            <button
              key={item.num}
              onClick={() => handleCard(idx)}
              style={{
                all: 'unset',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                padding: 'clamp(24px,3vw,36px)',
                background: isActive
                  ? 'rgba(246,245,242,0.16)'
                  : 'rgba(246,245,242,0.06)',
                transition: 'background 300ms ease',
                position: 'relative',
                minHeight: '260px',
              }}
            >
              {/* Top meta */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '40px',
              }}>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  letterSpacing: '0.20em',
                  color: isActive ? 'rgba(246,245,242,0.70)' : 'rgba(246,245,242,0.40)',
                  transition: 'color 300ms ease',
                }}>
                  [{item.num}] · {item.label}
                </span>
                {/* Expand chevron */}
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '16px',
                  color: isActive ? 'rgba(246,245,242,0.90)' : 'rgba(246,245,242,0.30)',
                  display: 'inline-block',
                  transform: isActive ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 300ms cubic-bezier(0.65,0,0.35,1), color 300ms ease',
                  lineHeight: 1,
                }}>
                  ↓
                </span>
              </div>

              {/* Name */}
              <h3 style={{
                fontFamily: 'var(--font-head)',
                fontWeight: 600,
                fontSize: 'clamp(20px,2vw,26px)',
                letterSpacing: '-0.02em',
                lineHeight: 1.05,
                color: '#f6f5f2',
                marginBottom: '12px',
              }}>
                {item.name}
              </h3>

              {/* Desc */}
              <p style={{
                fontSize: '14px',
                lineHeight: 1.55,
                color: 'rgba(246,245,242,0.68)',
                marginTop: 'auto',
              }}>
                {item.desc}
              </p>

              {/* Active bottom line */}
              {isActive && (
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '2px',
                  background: 'rgba(246,245,242,0.60)',
                }} />
              )}
            </button>
          )
        })}
      </div>

      {/* Expandable detail panel */}
      <div
        ref={panelRef}
        style={{
          display: 'none',
          overflow: 'hidden',
          maxHeight: 0,
          opacity: 0,
          marginTop: '2px',
          borderRadius: '16px',
          background: 'rgba(246,245,242,0.08)',
          border: '1px solid rgba(246,245,242,0.14)',
        }}
      >
        {active && (
          <div style={{ padding: 'clamp(28px,4vw,48px)' }}>
            {/* Panel header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '32px',
              gap: '24px',
              flexWrap: 'wrap',
            }}>
              <div>
                <p style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  letterSpacing: '0.20em',
                  color: 'rgba(246,245,242,0.45)',
                  marginBottom: '8px',
                }}>
                  [{active.num}] · {active.label} · Capabilities
                </p>
                <h4 style={{
                  fontFamily: 'var(--font-head)',
                  fontWeight: 600,
                  fontSize: 'clamp(22px,2.5vw,30px)',
                  letterSpacing: '-0.02em',
                  color: '#f6f5f2',
                  margin: 0,
                }}>
                  {active.name}
                </h4>
              </div>
              {/* Outcome pill */}
              <div style={{
                padding: '10px 20px',
                borderRadius: '9999px',
                border: '1px solid rgba(246,245,242,0.25)',
                fontFamily: 'var(--font-head)',
                fontSize: '13px',
                fontWeight: 500,
                color: 'rgba(246,245,242,0.80)',
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}>
                {active.outcome}
              </div>
            </div>

            {/* Capabilities list */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: '0',
              borderTop: '1px solid rgba(246,245,242,0.15)',
            }}>
              {active.details.split(' · ').map((detail, i) => (
                <div
                  key={i}
                  style={{
                    padding: '14px 16px 14px 0',
                    borderBottom: '1px solid rgba(246,245,242,0.10)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                >
                  <span style={{
                    width: '4px',
                    height: '4px',
                    borderRadius: '50%',
                    background: 'rgba(246,245,242,0.40)',
                    flexShrink: 0,
                  }} />
                  <span style={{
                    fontFamily: 'var(--font-head)',
                    fontSize: '14px',
                    fontWeight: 400,
                    color: 'rgba(246,245,242,0.75)',
                    lineHeight: 1.4,
                  }}>
                    {detail}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Mobile hint */}
      <style>{`
        @media (max-width: 700px) {
          .svc-pillar-carousel {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 440px) {
          .svc-pillar-carousel {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}
