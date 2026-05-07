'use client'

import { useEffect, useRef } from 'react'

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

function toRad(deg: number) { return (deg - 90) * (Math.PI / 180) }

const CX = 220, CY = 220, R_OUTER = 190, R_INNER = 78

export default function MethodFramework() {
  const svgWrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const wrap = svgWrapRef.current
    if (!wrap) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduced) {
      wrap.classList.add('is-drawn')
      return
    }

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          wrap.classList.add('is-drawn')
          obs.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    obs.observe(wrap)
    return () => obs.disconnect()
  }, [])

  return (
    <section
      data-mth
      style={{
        padding: 'clamp(80px,10vw,120px) var(--margin-x)',
      }}
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
        className="mth-r"
        style={{
          display: 'grid',
          gridTemplateColumns: 'min(440px,45vw) 1fr',
          gap: 'clamp(48px, 6vw, 96px)',
          alignItems: 'center',
          marginBottom: 'clamp(64px, 8vw, 96px)',
        }}
      >
        {/* SVG diagram */}
        <div
          ref={svgWrapRef}
          style={{ position: 'relative', width: '100%', aspectRatio: '1' }}
        >
          <style>{`
            .mth-diagram-ring { opacity: 0; transition: opacity 800ms cubic-bezier(.22,.61,.36,1) 100ms; }
            .mth-diagram-node { opacity: 0; transform: scale(0); transition: opacity 500ms cubic-bezier(.22,.61,.36,1), transform 500ms cubic-bezier(.22,.61,.36,1); }
            .mth-diagram-label { opacity: 0; transition: opacity 600ms cubic-bezier(.22,.61,.36,1) 600ms; }
            .mth-diagram-center { opacity: 0; transition: opacity 700ms cubic-bezier(.22,.61,.36,1) 300ms; }
            .is-drawn .mth-diagram-ring { opacity: 1; }
            .is-drawn .mth-diagram-center { opacity: 1; }
            .is-drawn .mth-diagram-label { opacity: 1; }
            ${NODES.map((n, i) => `
              .is-drawn .mth-diagram-node-${i} {
                opacity: 1;
                transform: scale(1);
                transition-delay: ${400 + i * 120}ms;
              }
            `).join('')}
            @media (prefers-reduced-motion: reduce) {
              .mth-diagram-ring, .mth-diagram-node, .mth-diagram-label, .mth-diagram-center {
                opacity: 1 !important; transform: scale(1) !important; transition: none !important;
              }
            }
          `}</style>
          <svg
            viewBox="0 0 440 440"
            style={{ width: '100%', height: '100%', overflow: 'visible' }}
            aria-hidden="true"
          >
            {/* Spokes */}
            {NODES.map((n) => {
              const rad = toRad(n.angle)
              const x2 = CX + R_OUTER * Math.cos(rad)
              const y2 = CY + R_OUTER * Math.sin(rad)
              return (
                <line
                  key={n.index}
                  className="mth-diagram-ring"
                  x1={CX} y1={CY} x2={x2} y2={y2}
                  stroke="rgba(246,245,242,0.15)"
                  strokeWidth="1"
                />
              )
            })}

            {/* Inner ring */}
            <circle
              className="mth-diagram-ring"
              cx={CX} cy={CY} r={R_INNER}
              fill="none"
              stroke="rgba(246,245,242,0.20)"
              strokeWidth="1"
            />

            {/* Outer dashed ring */}
            <circle
              className="mth-diagram-ring"
              cx={CX} cy={CY} r={R_OUTER}
              fill="none"
              stroke="rgba(246,245,242,0.30)"
              strokeWidth="1"
              strokeDasharray="4 6"
            />

            {/* Center label */}
            <g className="mth-diagram-center">
              <text
                x={CX} y={CY - 14}
                textAnchor="middle"
                fill="rgba(246,245,242,0.50)"
                fontSize="11"
                fontFamily="var(--font-mono)"
                letterSpacing="0.15em"
              >
                — The subject
              </text>
              <text
                x={CX} y={CY + 12}
                textAnchor="middle"
                fill="rgba(246,245,242,0.90)"
                fontSize="15"
                fontFamily="var(--font-serif)"
                fontStyle="italic"
                fontWeight="600"
              >
                your operation
              </text>
            </g>

            {/* Nodes */}
            {NODES.map((n) => {
              const rad = toRad(n.angle)
              const nx = CX + R_OUTER * Math.cos(rad)
              const ny = CY + R_OUTER * Math.sin(rad)

              // Tag positioning: above node (toward center)
              const tagOffY = -24
              const nameOffY = 18

              // Flip text to avoid going off the SVG edges
              const anchor =
                n.angle === 0 || n.angle === 180
                  ? 'middle'
                  : n.angle < 180
                  ? 'start'
                  : 'end'

              const labelXOff =
                n.angle === 0 || n.angle === 180
                  ? 0
                  : n.angle < 180
                  ? 18
                  : -18

              return (
                <g key={n.index} className={`mth-diagram-node mth-diagram-node-${n.index}`} style={{ transformOrigin: `${nx}px ${ny}px` }}>
                  <circle
                    cx={nx} cy={ny} r={12}
                    fill={n.color}
                    opacity={0.9}
                  />
                  <g className="mth-diagram-label">
                    <text
                      x={nx + labelXOff} y={ny + tagOffY}
                      textAnchor={anchor}
                      fill="rgba(246,245,242,0.50)"
                      fontSize="10"
                      fontFamily="var(--font-mono)"
                      letterSpacing="0.12em"
                    >
                      — {n.clusterNum} · {n.cluster}
                    </text>
                    <text
                      x={nx + labelXOff} y={ny + nameOffY}
                      textAnchor={anchor}
                      fill="rgba(246,245,242,0.85)"
                      fontSize="11"
                      fontFamily="var(--font-head)"
                      fontWeight="500"
                    >
                      {n.name}
                    </text>
                  </g>
                </g>
              )
            })}
          </svg>
        </div>

        {/* Right copy */}
        <div>
          <h2
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
            A framework, not a checklist.
          </h2>
          <p
            style={{
              fontSize: '17px',
              lineHeight: 1.65,
              color: 'rgba(246,245,242,0.78)',
              marginBottom: '20px',
              maxWidth: '520px',
            }}
          >
            Six dimensions. Each one a diagnostic lens, not a deliverable.
            We use them to map your operation as it actually runs — not as the org
            chart suggests it should. The output is a picture of where you are,
            scored against what is normal for operations of your size and type.
          </p>
          <p
            style={{
              fontSize: '17px',
              lineHeight: 1.65,
              color: 'rgba(246,245,242,0.78)',
              marginBottom: '36px',
              maxWidth: '520px',
            }}
          >
            The clusters — Flow, Fuel, Structure — are lenses for reading the
            results. They tell you where the pressure is coming from, not just
            where it shows up.
          </p>

          {/* Cluster legend */}
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
                <span style={{ fontSize: '13px', color: 'rgba(246,245,242,0.55)' }}>
                  {c.desc}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 6-dimension card grid */}
      <div
        className="mth-r"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1px',
          background: 'rgba(246,245,242,0.12)',
          borderRadius: '4px',
          overflow: 'hidden',
        }}
      >
        {CARD_DESCS.map((card, i) => (
          <div
            key={i}
            style={{
              background: 'rgba(246,245,242,0.04)',
              padding: 'clamp(24px, 3vw, 36px)',
              borderTop: '1px solid rgba(246,245,242,0.15)',
            }}
          >
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                letterSpacing: '0.15em',
                color: 'rgba(246,245,242,0.45)',
                marginBottom: '12px',
              }}
            >
              {card.label}
            </p>
            <h3
              style={{
                fontFamily: 'var(--font-serif)',
                fontStyle: 'italic',
                fontWeight: 600,
                fontSize: '30px',
                lineHeight: 1.1,
                color: '#f6f5f2',
                marginBottom: '16px',
              }}
            >
              <em className="news">{card.italic}</em>
            </h3>
            <p
              style={{
                fontSize: '14px',
                lineHeight: 1.65,
                color: 'rgba(246,245,242,0.68)',
              }}
            >
              {card.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
