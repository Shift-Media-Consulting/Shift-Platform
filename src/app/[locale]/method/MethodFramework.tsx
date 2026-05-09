'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useMessages } from 'next-intl'

type Node = {
  index: number
  cluster: string
  clusterNum: string
  name: string
  angle: number // degrees, 0 = top
  color: string
}

const NODES: Node[] = [
  { index: 0, clusterNum: '01', cluster: 'FLOW',      name: 'Workflow & Process',  angle:   0, color: '#4db6a0' },
  { index: 1, clusterNum: '02', cluster: 'FUEL',      name: 'Technology & Systems',angle:  60, color: '#d9a25a' },
  { index: 2, clusterNum: '03', cluster: 'FUEL',      name: 'Budget & Resource',   angle: 120, color: '#d9a25a' },
  { index: 3, clusterNum: '04', cluster: 'STRUCTURE',  name: 'Team & Capability',  angle: 180, color: '#b9d8d2' },
  { index: 4, clusterNum: '05', cluster: 'FLOW',      name: 'Content Pipeline',    angle: 240, color: '#4db6a0' },
  { index: 5, clusterNum: '06', cluster: 'STRUCTURE',  name: 'Vendor & Partner',   angle: 300, color: '#b9d8d2' },
]

const CARD_DESCS: { label: string; italic: string; body: string }[] = [
  {
    label: '01 · FLOW',
    italic: 'Workflow & Process',
    body: 'Where does content get made — and where does it stall? We map every handoff, approval gate, and version loop. Most waste in content operations is not budget waste. It is time waste: work that cycles twice because the process was never designed to move cleanly the first time.',
  },
  {
    label: '02 · FUEL',
    italic: 'Technology & Systems',
    body: 'The stack underneath your content operation is either a force multiplier or a tax. We audit DAMs, project tools, production software, and the gaps between them — looking not for the newest tools, but for the ones your team will actually use and the ones quietly eating cost.',
  },
  {
    label: '03 · FUEL',
    italic: 'Budget & Resource',
    body: 'What does your content operation actually cost — fully loaded? We build the true picture: internal headcount, agency retainers, project fees, production markups, and the reinvestment rate against output. Then we benchmark. Most brands are surprised by the variance.',
  },
  {
    label: '04 · STRUCTURE',
    italic: 'Team & Capability',
    body: 'Who does what, and do the right people hold the right decisions? We assess team structure, role clarity, and capability gaps — not to reorganise for the sake of it, but to understand where the operation is over-reliant on individuals and where it is under-resourced for what it is being asked to produce.',
  },
  {
    label: '05 · FLOW',
    italic: 'Content Pipeline',
    body: 'Brief to live — how long does it take, and what happens in between? We trace the full pipeline: briefing quality, production throughput, asset delivery, and distribution readiness. The bottleneck is rarely where people assume it is, which is precisely why mapping it matters.',
  },
  {
    label: '06 · STRUCTURE',
    italic: 'Vendor & Partner',
    body: 'Who is on your roster, how were they selected, and on what terms? We review supplier relationships, rate cards, exclusivities, and the informal dependencies that have calcified over time. Independence matters here: we have no upside in any name staying or leaving your list.',
  },
]

// Orbital periods (seconds) — slightly varied for organic feel
const PERIODS = [26, 22, 30, 24, 28, 20]

function toRad(deg: number) { return (deg - 90) * (Math.PI / 180) }

// Static diagram constants
const CX = 220, CY = 220, R_OUTER = 190, R_INNER = 78

// Expanded diagram constants (centred viewBox 0 0 500 500)
const ECX = 250, ECY = 250, R_ORBIT = 182, SUN_R = 64

export default function MethodFramework() {
  const messages = useMessages()
  const dims = ((messages as any).Method?.Dimensions?.items as Array<{ number: string; title: string; description: string }> | undefined) ?? []

  const svgWrapRef     = useRef<HTMLDivElement>(null)
  const [expanded, setExpanded]   = useState(false)
  const [hovered, setHovered]     = useState<number | null>(null)
  const [visible, setVisible]     = useState(false)   // for overlay fade-in

  /* ── Draw animation on scroll-into-view ── */
  useEffect(() => {
    const wrap = svgWrapRef.current
    if (!wrap) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      wrap.classList.add('is-drawn'); return
    }
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { wrap.classList.add('is-drawn'); obs.disconnect() } },
      { threshold: 0.3 }
    )
    obs.observe(wrap)
    return () => obs.disconnect()
  }, [])

  /* ── Overlay open/close ── */
  const openOverlay = useCallback(() => {
    setExpanded(true)
    requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)))
  }, [])

  const closeOverlay = useCallback(() => {
    setVisible(false)
    setTimeout(() => { setExpanded(false); setHovered(null) }, 380)
  }, [])

  /* ── ESC key ── */
  useEffect(() => {
    if (!expanded) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') closeOverlay() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [expanded, closeOverlay])

  /* ── Body scroll lock ── */
  useEffect(() => {
    document.body.style.overflow = expanded ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [expanded])

  return (
    <>
      {/* ── CSS ── */}
      <style>{`
        /* Static diagram animations */
        .mth-diagram-ring   { opacity:0; transition: opacity 800ms cubic-bezier(.22,.61,.36,1) 100ms; }
        .mth-diagram-node   { opacity:0; transform:scale(0); transition: opacity 500ms cubic-bezier(.22,.61,.36,1), transform 500ms cubic-bezier(.22,.61,.36,1); }
        .mth-diagram-label  { opacity:0; transition: opacity 600ms cubic-bezier(.22,.61,.36,1) 600ms; }
        .mth-diagram-center { opacity:0; transition: opacity 700ms cubic-bezier(.22,.61,.36,1) 300ms; }
        .is-drawn .mth-diagram-ring   { opacity:1; }
        .is-drawn .mth-diagram-center { opacity:1; }
        .is-drawn .mth-diagram-label  { opacity:1; }
        ${NODES.map((_, i) => `
          .is-drawn .mth-diagram-node-${i} {
            opacity:1; transform:scale(1);
            transition-delay: ${400 + i * 120}ms;
          }
        `).join('')}

        /* Orbit keyframe */
        @keyframes mth-orbit { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        /* Pulse for sun */
        @keyframes mth-pulse {
          0%, 100% { opacity: 0.18; r: ${SUN_R + 14}; }
          50%       { opacity: 0.32; r: ${SUN_R + 22}; }
        }
        @keyframes mth-pulse2 {
          0%, 100% { opacity: 0.08; r: ${SUN_R + 30}; }
          50%       { opacity: 0.18; r: ${SUN_R + 44}; }
        }

        /* Overlay transitions */
        .mth-overlay {
          transition: opacity 0.38s cubic-bezier(0.16,1,0.3,1), backdrop-filter 0.38s ease;
        }

        /* Node hover ring */
        .mth-node-ring {
          opacity: 0;
          transform-box: fill-box;
          transform-origin: center;
          transition: opacity 0.25s ease;
        }
        .mth-orbital-arm:hover .mth-node-ring { opacity: 1; }

        /* Description card transition */
        .mth-desc-card {
          transition: opacity 0.28s ease, transform 0.28s cubic-bezier(0.16,1,0.3,1);
        }

        @media (prefers-reduced-motion: reduce) {
          .mth-diagram-ring, .mth-diagram-node, .mth-diagram-label, .mth-diagram-center {
            opacity:1 !important; transform:scale(1) !important; transition:none !important;
          }
          .mth-orbital-arm { animation: none !important; }
        }
        @media (max-width: 899px) {
          .mth-framework-grid { grid-template-columns: 1fr !important; }
          .mth-dim-grid { grid-template-columns: 1fr !important; }
          .mth-overlay-inner { flex-direction: column !important; gap: 0 !important; }
          .mth-overlay-svg-wrap { max-width: 100% !important; flex: 1 !important; }
          .mth-overlay-panel { position: relative !important; inset: auto !important; width: 100% !important; max-width: 100% !important; border-top: 1px solid rgba(246,245,242,0.12) !important; padding: 24px 28px !important; }
        }
      `}</style>

      {/* ── Static section ── */}
      <section
        data-mth
        style={{ padding: 'clamp(56px,7vw,88px) var(--margin-x)' }}
      >
        {/* Rail */}
        <p
          className="mth-r"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '13px',
            letterSpacing: '0.18em',
            color: 'rgba(246,245,242,0.55)',
            marginBottom: '56px',
            fontWeight: 400,
          }}
        >
          — 02 / The framework · Six dimensions
        </p>

        {/* Two-col: diagram + copy */}
        <div
          className="mth-r mth-framework-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'min(440px,45vw) 1fr',
            gap: 'clamp(48px,6vw,96px)',
            alignItems: 'center',
            marginBottom: 'clamp(48px,6vw,72px)',
          }}
        >
          {/* Clickable SVG diagram */}
          <div style={{ position: 'relative' }}>
            <div
              ref={svgWrapRef}
              onClick={openOverlay}
              style={{
                position: 'relative',
                width: '100%',
                cursor: 'pointer',
                borderRadius: '16px',
                transition: 'transform 0.3s cubic-bezier(0.16,1,0.3,1)',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'scale(1.02)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'scale(1)' }}
              title="Click to explore the six dimensions"
            >
              <svg
                viewBox="-100 -30 640 500"
                style={{ width: '100%', height: 'auto', overflow: 'visible' }}
                aria-hidden="true"
              >
                {/* Spokes */}
                {NODES.map((n) => {
                  const rad = toRad(n.angle)
                  const x2 = CX + R_OUTER * Math.cos(rad)
                  const y2 = CY + R_OUTER * Math.sin(rad)
                  return (
                    <line key={n.index} className="mth-diagram-ring"
                      x1={CX} y1={CY} x2={x2} y2={y2}
                      stroke="rgba(246,245,242,0.15)" strokeWidth="1"
                    />
                  )
                })}
                <circle className="mth-diagram-ring" cx={CX} cy={CY} r={R_INNER}
                  fill="none" stroke="rgba(246,245,242,0.20)" strokeWidth="1" />
                <circle className="mth-diagram-ring" cx={CX} cy={CY} r={R_OUTER}
                  fill="none" stroke="rgba(246,245,242,0.30)" strokeWidth="1" strokeDasharray="4 6" />
                <g className="mth-diagram-center">
                  <text x={CX} y={CY - 14} textAnchor="middle"
                    fill="rgba(246,245,242,0.50)" fontSize="11"
                    fontFamily="var(--font-mono)" letterSpacing="0.15em">
                    — The subject
                  </text>
                  <text x={CX} y={CY + 12} textAnchor="middle"
                    fill="rgba(246,245,242,0.90)" fontSize="15"
                    fontFamily="var(--font-serif)" fontStyle="italic" fontWeight="600">
                    your operation
                  </text>
                </g>
                {NODES.map((n) => {
                  const rad = toRad(n.angle)
                  const nx = CX + R_OUTER * Math.cos(rad)
                  const ny = CY + R_OUTER * Math.sin(rad)
                  const anchor = n.angle === 0 || n.angle === 180 ? 'middle' : n.angle < 180 ? 'start' : 'end'
                  const labelXOff = n.angle === 0 || n.angle === 180 ? 0 : n.angle < 180 ? 18 : -18
                  return (
                    <g key={n.index}
                      className={`mth-diagram-node mth-diagram-node-${n.index}`}
                      style={{ transformOrigin: `${nx}px ${ny}px` }}>
                      <circle cx={nx} cy={ny} r={12} fill={n.color} opacity={0.9} />
                      <g className="mth-diagram-label">
                        <text x={nx + labelXOff} y={ny - 24} textAnchor={anchor}
                          fill="rgba(246,245,242,0.50)" fontSize="10"
                          fontFamily="var(--font-mono)" letterSpacing="0.12em">
                          — {n.clusterNum} · {n.cluster}
                        </text>
                        <text x={nx + labelXOff} y={ny + 18} textAnchor={anchor}
                          fill="rgba(246,245,242,0.85)" fontSize="11"
                          fontFamily="var(--font-head)" fontWeight="500">
                          {dims[n.index]?.title ?? n.name}
                        </text>
                      </g>
                    </g>
                  )
                })}
              </svg>

              {/* Click hint */}
              <div style={{
                position: 'absolute',
                bottom: '-28px',
                left: '50%',
                transform: 'translateX(-50%)',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                letterSpacing: '0.14em',
                color: 'rgba(246,245,242,0.38)',
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
              }}>
                Click to explore ›
              </div>
            </div>
          </div>

          {/* Right copy */}
          <div>
            <h2 style={{
              fontFamily: 'var(--font-head)',
              fontWeight: 600,
              fontSize: 'clamp(36px,4vw,56px)',
              lineHeight: 1.0,
              letterSpacing: '-0.025em',
              color: '#f6f5f2',
              marginBottom: '24px',
            }}>
              A framework, not a checklist.
            </h2>
            <p style={{
              fontSize: '17px',
              lineHeight: 1.65,
              color: 'rgba(246,245,242,0.78)',
              marginBottom: '20px',
              maxWidth: '520px',
            }}>
              Six dimensions. Each one a diagnostic lens, not a deliverable.
              We use them to map your operation as it actually runs — not as the org
              chart suggests it should. The output is a picture of where you are,
              scored against what is normal for operations of your size and type.
            </p>
            <p style={{
              fontSize: '17px',
              lineHeight: 1.65,
              color: 'rgba(246,245,242,0.78)',
              marginBottom: '36px',
              maxWidth: '520px',
            }}>
              The clusters — Flow, Fuel, Structure — are lenses for reading the
              results. They tell you where the pressure is coming from, not just
              where it shows up.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { cluster: 'FLOW',      color: '#4db6a0', desc: 'How work moves through the operation' },
                { cluster: 'FUEL',      color: '#d9a25a', desc: 'What the operation runs on: money and tools' },
                { cluster: 'STRUCTURE', color: '#b9d8d2', desc: 'Who holds the operation and the relationships it depends on' },
              ].map(c => (
                <div key={c.cluster} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: c.color, flexShrink: 0 }} />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.12em', color: c.color, marginRight: '8px' }}>
                    {c.cluster}
                  </span>
                  <span style={{ fontSize: '13px', color: 'rgba(246,245,242,0.55)' }}>{c.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 6-dimension card grid */}
        <div
          className="mth-r mth-dim-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3,1fr)',
            gap: '1px',
            background: 'rgba(246,245,242,0.12)',
            borderRadius: '4px',
            overflow: 'hidden',
          }}
        >
          {CARD_DESCS.map((card, i) => (
            <div key={i} style={{
              background: 'rgba(246,245,242,0.04)',
              padding: 'clamp(24px,3vw,36px)',
              borderTop: '1px solid rgba(246,245,242,0.15)',
            }}>
              <p style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                letterSpacing: '0.15em',
                color: 'rgba(246,245,242,0.45)',
                marginBottom: '12px',
              }}>
                {card.label}
              </p>
              <h3 style={{
                fontFamily: 'var(--font-serif)',
                fontStyle: 'italic',
                fontWeight: 600,
                fontSize: '30px',
                lineHeight: 1.1,
                color: '#f6f5f2',
                marginBottom: '16px',
              }}>
                <em className="news">{dims[i]?.title ?? card.italic}</em>
              </h3>
              <p style={{ fontSize: '14px', lineHeight: 1.65, color: 'rgba(246,245,242,0.68)' }}>
                {dims[i]?.description ?? card.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Expanded Overlay ── */}
      {expanded && (
        <div
          className="mth-overlay"
          onClick={closeOverlay}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(0,18,12,0.96)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            opacity: visible ? 1 : 0,
          }}
        >
          {/* Header bar */}
          <div
            onClick={e => e.stopPropagation()}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '20px 28px',
              flexShrink: 0,
              borderBottom: '1px solid rgba(246,245,242,0.08)',
            }}
          >
            <div>
              <p style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                letterSpacing: '0.18em',
                color: 'rgba(246,245,242,0.40)',
                marginBottom: '2px',
              }}>
                — The Shift Method
              </p>
              <p style={{
                fontFamily: 'var(--font-head)',
                fontWeight: 600,
                fontSize: '17px',
                color: '#f6f5f2',
                letterSpacing: '-0.01em',
              }}>
                Six dimensions orbiting your organisation
              </p>
            </div>
            <button
              onClick={closeOverlay}
              aria-label="Close"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                border: '1px solid rgba(246,245,242,0.18)',
                background: 'rgba(246,245,242,0.06)',
                color: 'rgba(246,245,242,0.70)',
                fontSize: '20px',
                lineHeight: 1,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 0.2s ease',
                flexShrink: 0,
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(246,245,242,0.14)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(246,245,242,0.06)' }}
            >
              ×
            </button>
          </div>

          {/* Main content area */}
          <div
            className="mth-overlay-inner"
            onClick={e => e.stopPropagation()}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'stretch',
              overflow: 'hidden',
              minHeight: 0,
            }}
          >
            {/* SVG solar system */}
            <div
              className="mth-overlay-svg-wrap"
              style={{
                flex: '1 1 0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '24px',
                minWidth: 0,
              }}
            >
              <svg
                viewBox="0 0 500 500"
                style={{
                  width: 'min(85vw, calc(100vh - 180px), 560px)',
                  height: 'min(85vw, calc(100vh - 180px), 560px)',
                  overflow: 'visible',
                }}
                aria-label="Interactive solar system diagram of six operational dimensions"
              >
                {/* Orbit ring */}
                <circle
                  cx={ECX} cy={ECY} r={R_ORBIT}
                  fill="none"
                  stroke="rgba(246,245,242,0.12)"
                  strokeWidth="1"
                  strokeDasharray="3 8"
                />

                {/* Outer pulse halo 2 */}
                <circle
                  cx={ECX} cy={ECY} r={SUN_R + 30}
                  fill="rgba(77,182,160,0.06)"
                  style={{ animation: 'mth-pulse2 4s ease-in-out infinite' }}
                />
                {/* Outer pulse halo 1 */}
                <circle
                  cx={ECX} cy={ECY} r={SUN_R + 14}
                  fill="rgba(77,182,160,0.12)"
                  style={{ animation: 'mth-pulse 3s ease-in-out infinite' }}
                />

                {/* Sun */}
                <circle
                  cx={ECX} cy={ECY} r={SUN_R}
                  fill="rgba(0,77,64,0.85)"
                  stroke="rgba(246,245,242,0.22)"
                  strokeWidth="1"
                />
                <text x={ECX} y={ECY - 16} textAnchor="middle"
                  fill="rgba(246,245,242,0.45)" fontSize="10"
                  fontFamily="var(--font-mono)" letterSpacing="0.14em">
                  — The subject
                </text>
                <text x={ECX} y={ECY + 4} textAnchor="middle"
                  fill="rgba(246,245,242,0.90)" fontSize="14"
                  fontFamily="var(--font-serif)" fontStyle="italic" fontWeight="600">
                  your
                </text>
                <text x={ECX} y={ECY + 22} textAnchor="middle"
                  fill="rgba(246,245,242,0.90)" fontSize="14"
                  fontFamily="var(--font-serif)" fontStyle="italic" fontWeight="600">
                  organisation
                </text>

                {/* Orbiting nodes */}
                {NODES.map((n, i) => {
                  const period  = PERIODS[i]
                  const delay   = -((n.angle / 360) * period)
                  const isHov   = hovered === i
                  const NODE_R  = 18

                  return (
                    <g
                      key={i}
                      className="mth-orbital-arm"
                      style={{
                        transformBox:       'view-box',
                        transformOrigin:    `${ECX}px ${ECY}px`,
                        animation:          `mth-orbit ${period}s linear infinite`,
                        animationDelay:     `${delay}s`,
                        animationPlayState: isHov ? 'paused' : 'running',
                        cursor:             'pointer',
                      }}
                      onMouseEnter={() => setHovered(i)}
                      onMouseLeave={() => setHovered(null)}
                    >
                      {/* Invisible large hit target */}
                      <circle
                        cx={ECX} cy={ECY - R_ORBIT}
                        r={NODE_R + 20}
                        fill="transparent"
                        stroke="none"
                      />

                      {/* Hover ring */}
                      <circle
                        className="mth-node-ring"
                        cx={ECX} cy={ECY - R_ORBIT}
                        r={NODE_R + 10}
                        fill="none"
                        stroke={n.color}
                        strokeWidth="1"
                        opacity={isHov ? 0.55 : 0}
                        style={{ transition: 'opacity 0.25s ease' }}
                      />

                      {/* Node dot */}
                      <circle
                        cx={ECX} cy={ECY - R_ORBIT}
                        r={NODE_R}
                        fill={n.color}
                        opacity={isHov ? 1 : 0.82}
                        style={{ transition: 'opacity 0.25s ease, r 0.25s ease' }}
                      />

                      {/* Node number */}
                      <text
                        x={ECX} y={ECY - R_ORBIT + 5}
                        textAnchor="middle"
                        fill="rgba(0,18,12,0.85)"
                        fontSize="13"
                        fontFamily="var(--font-mono)"
                        fontWeight="600"
                        letterSpacing="0.05em"
                        style={{ pointerEvents: 'none', userSelect: 'none' }}
                      >
                        {n.clusterNum}
                      </text>
                    </g>
                  )
                })}
              </svg>
            </div>

            {/* Description panel */}
            <div
              className="mth-overlay-panel"
              style={{
                width: '340px',
                flexShrink: 0,
                borderLeft: '1px solid rgba(246,245,242,0.08)',
                padding: '32px 36px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                overflowY: 'auto',
              }}
            >
              {hovered === null ? (
                <div
                  className="mth-desc-card"
                  style={{ opacity: 1, transform: 'translateY(0)' }}
                >
                  {/* Default: legend */}
                  <p style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    letterSpacing: '0.14em',
                    color: 'rgba(246,245,242,0.35)',
                    marginBottom: '32px',
                  }}>
                    — Hover a dimension to explore
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {NODES.map((n, i) => (
                      <div
                        key={i}
                        style={{ display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer' }}
                        onMouseEnter={() => setHovered(i)}
                        onMouseLeave={() => setHovered(null)}
                      >
                        <div style={{
                          width: '30px', height: '30px', borderRadius: '50%',
                          background: n.color,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          flexShrink: 0,
                        }}>
                          <span style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '10px',
                            fontWeight: 600,
                            color: 'rgba(0,18,12,0.85)',
                          }}>{n.clusterNum}</span>
                        </div>
                        <div>
                          <span style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '10px',
                            letterSpacing: '0.12em',
                            color: n.color,
                            display: 'block',
                            marginBottom: '2px',
                          }}>{n.cluster}</span>
                          <span style={{
                            fontFamily: 'var(--font-head)',
                            fontSize: '14px',
                            fontWeight: 600,
                            color: 'rgba(246,245,242,0.80)',
                            letterSpacing: '-0.01em',
                          }}>{dims[i]?.title ?? n.name}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div
                  className="mth-desc-card"
                  key={hovered}
                  style={{
                    opacity: 1,
                    transform: 'translateY(0)',
                    animation: 'mth-fade-up 0.28s cubic-bezier(0.16,1,0.3,1) both',
                  }}
                >
                  <style>{`
                    @keyframes mth-fade-up {
                      from { opacity: 0; transform: translateY(10px); }
                      to   { opacity: 1; transform: translateY(0); }
                    }
                  `}</style>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                    <div style={{
                      width: '36px', height: '36px', borderRadius: '50%',
                      background: NODES[hovered].color,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <span style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '11px',
                        fontWeight: 600,
                        color: 'rgba(0,18,12,0.85)',
                      }}>{NODES[hovered].clusterNum}</span>
                    </div>
                    <div>
                      <span style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '10px',
                        letterSpacing: '0.14em',
                        color: NODES[hovered].color,
                        display: 'block',
                        marginBottom: '1px',
                      }}>{CARD_DESCS[hovered].label}</span>
                      <span style={{
                        fontFamily: 'var(--font-head)',
                        fontSize: '15px',
                        fontWeight: 600,
                        color: '#f6f5f2',
                        letterSpacing: '-0.01em',
                      }}>{dims[hovered]?.title ?? NODES[hovered].name}</span>
                    </div>
                  </div>

                  <h3 style={{
                    fontFamily: 'var(--font-serif)',
                    fontStyle: 'italic',
                    fontWeight: 600,
                    fontSize: '26px',
                    lineHeight: 1.15,
                    color: '#f6f5f2',
                    marginBottom: '18px',
                    letterSpacing: '-0.01em',
                  }}>
                    <em className="news">{dims[hovered]?.title ?? CARD_DESCS[hovered].italic}</em>
                  </h3>

                  <p style={{
                    fontSize: '15px',
                    lineHeight: 1.7,
                    color: 'rgba(246,245,242,0.72)',
                    fontWeight: 400,
                  }}>
                    {dims[hovered]?.description ?? CARD_DESCS[hovered].body}
                  </p>

                  {/* Divider + cluster badge */}
                  <div style={{
                    marginTop: '28px',
                    paddingTop: '20px',
                    borderTop: '1px solid rgba(246,245,242,0.10)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}>
                    <div style={{
                      width: '8px', height: '8px', borderRadius: '50%',
                      background: NODES[hovered].color,
                      flexShrink: 0,
                    }} />
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      letterSpacing: '0.14em',
                      color: NODES[hovered].color,
                    }}>
                      Cluster: {NODES[hovered].cluster}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer hint */}
          <div
            onClick={e => e.stopPropagation()}
            style={{
              padding: '14px 28px',
              borderTop: '1px solid rgba(246,245,242,0.06)',
              display: 'flex',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <p style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              letterSpacing: '0.14em',
              color: 'rgba(246,245,242,0.25)',
            }}>
              Press ESC or click outside to close
            </p>
          </div>
        </div>
      )}
    </>
  )
}
