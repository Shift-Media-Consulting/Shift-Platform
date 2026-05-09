'use client'

import { useState } from 'react'

type NodeId = 'brand' | 'agency' | 'production'

const conflicts: Record<NodeId, { label: string; body: string }> = {
  brand: {
    label: 'The Brand Problem',
    body: 'Brands rely on agencies to manage production on their behalf — but agencies are financially incentivised to recommend bigger budgets. The brand pays more. The agency earns more.',
  },
  agency: {
    label: 'The Agency Problem',
    body: 'Agencies control the only version of the budget the client ever sees. They set costs, mark up suppliers, and the incentive to inflate is structural.',
  },
  production: {
    label: 'The Production Problem',
    body: 'Production companies depend on agencies for future work. That dependency shapes every recommendation — even when they are trying to be objective.',
  },
}

export default function AboutTriangle() {
  const [active, setActive] = useState<NodeId | null>(null)

  const toggle = (id: NodeId) => setActive(p => (p === id ? null : id))

  const nodeOpacity = (id: NodeId) => {
    if (!active) return 1
    return active === id ? 1 : 0.35
  }
  const edgeOpacity = (a: NodeId, b: NodeId) => {
    if (!active) return 0.5
    return active === a || active === b ? 1 : 0.15
  }

  return (
    <div className="flex flex-col gap-8 w-full">

      {/* SVG — typographic, no pill borders */}
      <svg
        viewBox="0 0 760 260"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full"
        style={{ overflow: 'visible' }}
        aria-label="Brand–agency–production conflict triangle"
      >
        {/* Edges */}
        {/* Brand → Agency */}
        <line x1="300" y1="55" x2="130" y2="205"
          stroke="rgba(246,245,242,1)"
          strokeWidth="2" strokeDasharray="6 5"
          strokeOpacity={edgeOpacity('brand', 'agency')}
          style={{ transition: 'stroke-opacity .3s' }}
        />
        {/* Brand → Production */}
        <line x1="460" y1="55" x2="630" y2="205"
          stroke="rgba(246,245,242,1)"
          strokeWidth="2" strokeDasharray="6 5"
          strokeOpacity={edgeOpacity('brand', 'production')}
          style={{ transition: 'stroke-opacity .3s' }}
        />
        {/* Agency → Production */}
        <line x1="196" y1="228" x2="564" y2="228"
          stroke="rgba(246,245,242,1)"
          strokeWidth="2" strokeDasharray="6 5"
          strokeOpacity={edgeOpacity('agency', 'production')}
          style={{ transition: 'stroke-opacity .3s' }}
        />

        {/* CONFLICT labels on edges */}
        <text x="195" y="118" textAnchor="middle"
          fontSize="10" fontFamily="var(--font-mono),monospace"
          letterSpacing="1.5"
          fill="rgba(246,245,242,1)"
          fillOpacity={edgeOpacity('brand', 'agency')}
          transform="rotate(-44 195 118)"
          style={{ transition: 'fill-opacity .3s', userSelect: 'none', pointerEvents: 'none' }}
        >CONFLICT</text>
        <text x="565" y="118" textAnchor="middle"
          fontSize="10" fontFamily="var(--font-mono),monospace"
          letterSpacing="1.5"
          fill="rgba(246,245,242,1)"
          fillOpacity={edgeOpacity('brand', 'production')}
          transform="rotate(44 565 118)"
          style={{ transition: 'fill-opacity .3s', userSelect: 'none', pointerEvents: 'none' }}
        >CONFLICT</text>
        <text x="380" y="214" textAnchor="middle"
          fontSize="10" fontFamily="var(--font-mono),monospace"
          letterSpacing="1.5"
          fill="rgba(246,245,242,1)"
          fillOpacity={edgeOpacity('agency', 'production')}
          style={{ transition: 'fill-opacity .3s', userSelect: 'none', pointerEvents: 'none' }}
        >CONFLICT</text>

        {/* BRAND node */}
        <g onClick={() => toggle('brand')} style={{ cursor: 'pointer' }}>
          <rect x="248" y="8" width="264" height="60" rx="30"
            fill="rgba(246,245,242,0.95)"
            fillOpacity={nodeOpacity('brand')}
            style={{ transition: 'fill-opacity .3s' }}
          />
          <text x="380" y="45" textAnchor="middle"
            fontSize="20" fontWeight="800"
            fontFamily="var(--font-head),sans-serif"
            letterSpacing="-0.3"
            fill={active === 'brand' ? '#004d40' : '#111111'}
            fillOpacity={nodeOpacity('brand')}
            style={{ transition: 'fill .3s, fill-opacity .3s', userSelect: 'none' }}
          >Brand</text>
        </g>

        {/* AGENCY node */}
        <g onClick={() => toggle('agency')} style={{ cursor: 'pointer' }}>
          <rect x="54" y="198" width="192" height="60" rx="30"
            fill="rgba(246,245,242,0.95)"
            fillOpacity={nodeOpacity('agency')}
            style={{ transition: 'fill-opacity .3s' }}
          />
          <text x="150" y="234" textAnchor="middle"
            fontSize="20" fontWeight="800"
            fontFamily="var(--font-head),sans-serif"
            letterSpacing="-0.3"
            fill={active === 'agency' ? '#004d40' : '#111111'}
            fillOpacity={nodeOpacity('agency')}
            style={{ transition: 'fill .3s, fill-opacity .3s', userSelect: 'none' }}
          >Agency</text>
        </g>

        {/* PRODUCTION node */}
        <g onClick={() => toggle('production')} style={{ cursor: 'pointer' }}>
          <rect x="514" y="198" width="246" height="60" rx="30"
            fill="rgba(246,245,242,0.95)"
            fillOpacity={nodeOpacity('production')}
            style={{ transition: 'fill-opacity .3s' }}
          />
          <text x="637" y="234" textAnchor="middle"
            fontSize="20" fontWeight="800"
            fontFamily="var(--font-head),sans-serif"
            letterSpacing="-0.3"
            fill={active === 'production' ? '#004d40' : '#111111'}
            fillOpacity={nodeOpacity('production')}
            style={{ transition: 'fill .3s, fill-opacity .3s', userSelect: 'none' }}
          >Production</text>
        </g>
      </svg>

      {/* Hint / detail panel */}
      <div style={{ minHeight: '72px' }}>
        {active ? (
          <div
            className="flex flex-col gap-3"
            style={{
              borderLeft: '3px solid rgba(246,245,242,0.35)',
              paddingLeft: '24px',
            }}
          >
            <p
              className="text-[10px] tracking-[2.5px] font-medium uppercase"
              style={{ fontFamily: 'var(--font-mono)', color: 'rgba(246,245,242,0.55)' }}
            >
              {conflicts[active].label}
            </p>
            <p
              className="font-medium text-[15px] sm:text-[16px] leading-[1.65]"
              style={{ color: 'rgba(246,245,242,0.9)', maxWidth: '600px' }}
            >
              {conflicts[active].body}
            </p>
          </div>
        ) : (
          <p
            className="text-[12px]"
            style={{
              fontFamily: 'var(--font-mono)',
              color: 'rgba(246,245,242,0.35)',
              paddingLeft: '4px',
            }}
          >
            Select Brand, Agency, or Production to explore the conflict.
          </p>
        )}
      </div>
    </div>
  )
}
