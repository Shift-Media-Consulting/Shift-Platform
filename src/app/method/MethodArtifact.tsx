'use client'

import { useEffect, useRef } from 'react'

type RagRow = {
  num: string
  label: string
  pct: number
  color: string
}

const RAG_ROWS: RagRow[] = [
  { num: '01', label: 'Workflow & Process',    pct: 78, color: '#d4574a' },
  { num: '02', label: 'Technology & Systems',  pct: 54, color: '#d9a25a' },
  { num: '03', label: 'Budget & Resource',     pct: 82, color: '#d4574a' },
  { num: '04', label: 'Team & Capability',     pct: 47, color: '#d9a25a' },
  { num: '05', label: 'Content Pipeline',      pct: 28, color: '#6fa37a' },
  { num: '06', label: 'Vendor & Partner',      pct: 71, color: '#d4574a' },
]

const GLASS = {
  background: 'rgba(246,245,242,0.10)',
  border: '1px solid rgba(246,245,242,0.28)',
  backdropFilter: 'blur(14px)',
  WebkitBackdropFilter: 'blur(14px)',
  boxShadow: 'inset 0 1px 0 rgba(246,245,242,0.30), 0 40px 80px -30px rgba(0,0,0,0.35)',
}

export default function MethodArtifact() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduced) {
      section.classList.add('is-built')
      return
    }

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          section.classList.add('is-built')
          obs.disconnect()
        }
      },
      { threshold: 0.4 }
    )
    obs.observe(section)
    return () => obs.disconnect()
  }, [])

  return (
    <>
      <style>{`
        .mth-artifact .rag-bar-fill {
          transform-origin: left center;
          transform: scaleX(0);
          transition: transform 1100ms cubic-bezier(.22,.61,.36,1);
        }
        .mth-artifact.is-built .rag-bar-fill {
          transform: scaleX(1);
        }
        .mth-artifact .rag-dot {
          opacity: 0;
          transform: scale(0.4);
          transition: opacity 700ms cubic-bezier(.22,.61,.36,1),
                      transform 700ms cubic-bezier(.22,.61,.36,1);
        }
        .mth-artifact.is-built .rag-dot {
          opacity: 1;
          transform: scale(1);
        }
        ${RAG_ROWS.map((_, i) => `
          .mth-artifact.is-built .rag-bar-fill-${i} {
            transition-delay: ${i * 120}ms;
          }
          .mth-artifact.is-built .rag-dot-${i} {
            transition-delay: ${700 + i * 120}ms;
          }
        `).join('')}
        @media (prefers-reduced-motion: reduce) {
          .mth-artifact .rag-bar-fill,
          .mth-artifact .rag-dot {
            transform: scaleX(1) !important;
            opacity: 1 !important;
            transition: none !important;
          }
          .mth-artifact .rag-dot {
            transform: scale(1) !important;
          }
        }
      `}</style>

      <section
        ref={sectionRef}
        data-mth
        className="mth-artifact"
        style={{
          padding: 'clamp(56px,7vw,88px) var(--margin-x)',
        }}
      >
        {/* Two-column layout */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '480px 1fr',
            gap: 'clamp(48px, 6vw, 96px)',
            alignItems: 'center',
          }}
        >
          {/* Left copy */}
          <div>
            <p
              className="mth-r"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '13px',
                letterSpacing: '0.18em',
                color: 'rgba(246,245,242,0.55)',
                marginBottom: '32px',
              }}
            >
              — 03 / The artifact · The diagnostic document
            </p>

            <h2
              className="mth-r"
              style={{
                fontFamily: 'var(--font-head)',
                fontWeight: 600,
                fontSize: 'clamp(36px, 4vw, 56px)',
                lineHeight: 1.0,
                letterSpacing: '-0.025em',
                color: '#f6f5f2',
                marginBottom: '24px',
              }}
            >
              The diagnosis is a document.
            </h2>

            <p
              className="mth-r"
              style={{
                fontSize: '17px',
                lineHeight: 1.65,
                color: 'rgba(246,245,242,0.78)',
                marginBottom: '40px',
                maxWidth: '440px',
              }}
            >
              Not a slide deck. Not a workshop report. A RAG-scored diagnostic
              document: evidence weighted, benchmark referenced, and written to
              be understood by a CFO as clearly as a production director.
              Yours to keep — regardless of what comes next.
            </p>

            {/* Meta list */}
            <div
              className="mth-r"
              style={{ display: 'flex', flexDirection: 'column', gap: '0' }}
            >
              {[
                { label: 'Scoring',     value: 'RAG — Red / Amber / Green per dimension' },
                { label: 'Benchmarks',  value: 'Against comparable operations by size and sector' },
                { label: 'Ownership',   value: 'Client-owned. Ours to write. Yours to keep.' },
                { label: 'Use',         value: 'Board-ready. Procurement-ready. Internally actionable.' },
              ].map((row, i) => (
                <div
                  key={i}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '120px 1fr',
                    gap: '16px',
                    borderTop: '1px solid rgba(246,245,242,0.15)',
                    padding: '16px 0',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      letterSpacing: '0.12em',
                      color: 'rgba(246,245,242,0.45)',
                      paddingTop: '2px',
                    }}
                  >
                    {row.label}
                  </span>
                  <span style={{ fontSize: '14px', lineHeight: 1.5, color: 'rgba(246,245,242,0.80)' }}>
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: glass document mock */}
          <div className="mth-r" style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '560px' }}>

            {/* Back page */}
            <div
              style={{
                ...GLASS,
                position: 'absolute',
                width: 'min(420px, 100%)',
                minHeight: '520px',
                borderRadius: '8px',
                transform: 'rotate(2.5deg) translateY(12px)',
                zIndex: 1,
              }}
            />

            {/* Front page */}
            <div
              style={{
                ...GLASS,
                position: 'relative',
                zIndex: 2,
                width: 'min(420px, 100%)',
                borderRadius: '8px',
                transform: 'rotate(-1.5deg)',
                padding: '36px 32px 32px',
                color: '#f6f5f2',
              }}
            >
              {/* Doc header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.12em', color: 'rgba(246,245,242,0.45)' }}>
                  Diagnostic / Section 04
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.10em', color: 'rgba(246,245,242,0.35)' }}>
                  Confidential · client redacted
                </span>
              </div>

              {/* Doc h1 */}
              <h1
                style={{
                  fontFamily: 'var(--font-head)',
                  fontWeight: 600,
                  fontSize: '26px',
                  lineHeight: 1.1,
                  color: '#f6f5f2',
                  marginBottom: '10px',
                  letterSpacing: '-0.02em',
                }}
              >
                Operational summary — six dimensions
              </h1>

              {/* Deck */}
              <p style={{ fontSize: '13px', lineHeight: 1.55, color: 'rgba(246,245,242,0.65)', marginBottom: '28px' }}>
                RAG-scored across the framework, with evidence weight and benchmark variance for{' '}
                <span style={{
                  background: 'rgba(246,245,242,0.30)',
                  backdropFilter: 'blur(2px)',
                  WebkitBackdropFilter: 'blur(2px)',
                  color: 'transparent',
                  borderRadius: '2px',
                  padding: '0 4px',
                  userSelect: 'none',
                }}>
                  REDACTED CLIENT
                </span>.
              </p>

              {/* RAG rows */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '28px' }}>
                {RAG_ROWS.map((row, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '24px 1fr 56px 14px', gap: '8px', alignItems: 'center' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'rgba(246,245,242,0.35)' }}>
                      {row.num}
                    </span>
                    <div>
                      <div style={{ fontSize: '11px', color: 'rgba(246,245,242,0.70)', marginBottom: '5px' }}>
                        {row.label}
                      </div>
                      <div style={{ height: '4px', background: 'rgba(246,245,242,0.15)', borderRadius: '2px', overflow: 'hidden' }}>
                        <div
                          className={`rag-bar-fill rag-bar-fill-${i}`}
                          style={{
                            height: '100%',
                            width: `${row.pct}%`,
                            background: row.color,
                            borderRadius: '2px',
                          }}
                        />
                      </div>
                    </div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'rgba(246,245,242,0.50)', textAlign: 'right' }}>
                      {row.pct}%
                    </span>
                    <div
                      className={`rag-dot rag-dot-${i}`}
                      style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        background: row.color,
                        boxShadow: `0 0 12px ${row.color}`,
                        flexShrink: 0,
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* Pull quote block */}
              <div style={{ borderTop: '1px solid rgba(246,245,242,0.15)', paddingTop: '20px', marginBottom: '20px' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.12em', color: 'rgba(246,245,242,0.35)', display: 'block', marginBottom: '10px' }}>
                  — Headline finding
                </span>
                <p style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 600, fontSize: '16px', lineHeight: 1.35, color: '#f6f5f2', marginBottom: '16px' }}>
                  Operational cost is growing faster than output. The gap is structural, not cyclical.
                </p>
                {/* Simulated paragraph lines */}
                {[90, 100, 85, 70].map((w, i) => (
                  <div key={i} style={{ height: '8px', background: 'rgba(246,245,242,0.12)', borderRadius: '2px', width: `${w}%`, marginBottom: '6px' }} />
                ))}
              </div>

              {/* Doc footer */}
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(246,245,242,0.12)', paddingTop: '14px' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'rgba(246,245,242,0.30)', letterSpacing: '0.10em' }}>
                  Shift Method — [Q3]
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'rgba(246,245,242,0.30)', letterSpacing: '0.10em' }}>
                  p. 23 / 67
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
