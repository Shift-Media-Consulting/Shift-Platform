import type { Metadata } from 'next'
import Nav from '@/components/marketing/Nav'
import Footer from '@/components/marketing/Footer'
import PageReveal from '@/components/marketing/PageReveal'
import TeamReveal from './TeamReveal'
import CtaSection from '@/components/marketing/CtaSection'

export const metadata: Metadata = {
  title: 'The Team — shift.media',
  description:
    'Three founders. An independent partner network. Built by people who have done this work.',
}

/* ── Founders data ─────────────────────────────────────────────────────── */
const founders = [
  {
    monogram: 'JS',
    index: '01',
    name: 'Justin Stiebel',
    role: '— 01 / Co-founder',
    knownForText: 'Known for ',
    knownForItalic: 'redesigning production functions at scale.',
    bio: 'Justin has spent his career inside and alongside major creative organisations, redesigning the production and operational infrastructure that large content programmes depend on. He has led transformation engagements for brands navigating the shift from agency-led to hybrid to in-house models, and knows where those transitions tend to go wrong — and why.',
    tags: ['Org design', 'Exec production', 'Transformation'],
    footerLeft: '— EU operator',
    email: 'justin@shift-media.io',
  },
  {
    monogram: 'CR',
    index: '02',
    name: 'Cornelius Rönz',
    role: '— 02 / Co-founder',
    knownForText: 'Known for ',
    knownForItalic: 'controlling the German market.',
    bio: 'Cornelius built his career in production controlling — the discipline that sits between the brief, the budget, and the final bill. He has worked across German-speaking markets for over 25 years, running cost control on campaigns from local brand work to international co-productions. He co-founded SHIFT to give brands what he rarely found in the market: an independent read, with no production-side upside.',
    tags: ['Cost control', 'DE/EU rates', 'Procurement'],
    footerLeft: '— DE specialist',
    email: 'cornelius@shift-media.io',
  },
  {
    monogram: 'JH',
    index: '03',
    name: 'Jankel Huppertz',
    role: '— 03 / Co-founder',
    knownForText: 'Known for ',
    knownForItalic: 'running complex productions cleanly.',
    bio: 'Jankel is a production operator with a long record of running complex, multi-territory campaigns to brief, on time, and without incident. His specialism is the point where creative ambition meets operational reality — making the plan that actually holds when a production gets complicated.',
    tags: ['Operations', 'Pipeline', 'Delivery'],
    footerLeft: '— Agency-side',
    email: 'jankel@shift-media.io',
  },
]

/* ── Proof cells ───────────────────────────────────────────────────────── */
const proofCells = [
  { target: '600', suffix: 'M+', label: 'Production budgets managed across the founders’ careers' },
  { target: '40',  suffix: '+',  label: 'Years of combined production leadership' },
  { target: '25',  suffix: '+',  label: 'Markets shipped into — DACH, EMEA, Americas, APAC' },
  { target: '0',   suffix: '',   label: 'Vendor affiliations, kickbacks, or holding-company parents' },
]

/* ── Working model rows ────────────────────────────────────────────────── */
const workRows = [
  {
    step: 'Step 01',
    tag: 'Always',
    heading: 'A founder takes the call',
    desc: 'First conversation, scoping, and written assessment are led by Justin, Cornelius, or Jankel — never delegated.',
  },
  {
    step: 'Step 02',
    tag: 'Always',
    heading: 'A founder leads the engagement',
    desc: 'One named founder owns delivery, sits on every working session, and signs the final document. No account-management layer between you and the work.',
  },
  {
    step: 'Step 03',
    tag: 'As needed',
    heading: 'Partners are engaged when scope demands it',
    desc: 'If the engagement crosses sustainable production, legal, post pipeline, or international structures, we name the specialist, declare the rate, and bring them in for that scope only.',
  },
  {
    step: 'Step 04',
    tag: 'Always',
    heading: 'One invoice, fully itemised',
    desc: 'No bundling. No rebates. No back-end. You see exactly who did what, for how long, at what rate.',
  },
]

/* ── Partner network ───────────────────────────────────────────────────── */
const clusters = [
  {
    label: '— Cluster 01',
    title: 'Commercial',
    desc: 'Where the money sits, who controls it, and how it is procured.',
    disciplines: [
      { num: '— 01', name: 'Finance & Treasury', role: 'Independent financial oversight, treasury structures, and procurement strategy for production-heavy organisations.' },
      { num: '— 02', name: 'Legal & Rights', role: 'Music licensing, talent buyouts, IP frameworks, and the legal architecture behind compliant, modern production.' },
      { num: '— 03', name: 'International Production', role: 'Cross-border production structures, offshore execution, and multi-market campaign delivery.' },
    ],
  },
  {
    label: '— Cluster 02',
    title: 'Creative & Strategy',
    desc: 'Senior creative and strategic counsel where the brief, the brand, or the work itself is on the line.',
    disciplines: [
      { num: '— 04', name: 'Strategy & Brand', role: 'Strategic counsel on brand positioning, content strategy, and how production serves the wider marketing system.' },
      { num: '— 05', name: 'Creative Direction', role: 'Award-winning creative leadership for projects requiring senior creative oversight from concept through delivery.' },
    ],
  },
  {
    label: '— Cluster 03',
    title: 'Craft & Delivery',
    desc: 'The technology, sustainability, and post infrastructure that production runs on top of.',
    disciplines: [
      { num: '— 06', name: 'AI & Technology', role: 'Hands-on practitioners across generative AI, production tooling, and the integration of technology into creative workflows.' },
      { num: '— 07', name: 'Sustainable Production', role: 'Carbon budgeting, sustainable supplier selection, and ESG reporting across film and content production.' },
      { num: '— 08', name: 'Post-Production & VFX', role: 'Senior post supervisors and VFX leads who advise on pipeline design, vendor evaluation, and quality control.' },
    ],
  },
]

export default function TeamPage() {
  return (
    <>
      <Nav />
      <PageReveal />
      <TeamReveal />
      <main
        className="tm-main"
        style={{
          background: 'linear-gradient(180deg, #004d40 0%, #2a6f5e 20%, #4f9382 48%, #b9d8d2 78%, #b9d8d2 100%)',
          minHeight: '100vh',
          fontFamily: 'var(--font-head)',
        }}
      >

        {/* ── Section 1: Hero ───────────────────────────────────────────── */}
        <section
          data-t
          style={{ padding: 'clamp(96px,13vw,140px) var(--margin-x) clamp(40px,5vw,60px)' }}
        >
          {/* Rail */}
          <p
            className="reveal"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '13px',
              letterSpacing: '0.2em',
              color: 'rgba(246,245,242,0.55)',
              borderTop: '1px solid rgba(246,245,242,0.35)',
              paddingTop: '16px',
              marginBottom: '40px',
              fontWeight: 400,
            }}
          >
            — 01 / Who we are · Operators, not consultants
          </p>

          {/* H1 */}
          <h1
            className="reveal"
            style={{
              fontFamily: 'var(--font-head)',
              fontWeight: 600,
              fontSize: 'clamp(72px,8vw,104px)',
              lineHeight: 0.95,
              letterSpacing: '-0.025em',
              color: '#f6f5f2',
              maxWidth: '1300px',
              marginBottom: '32px',
            }}
          >
            Built by people who have{' '}
            <em className="news">done this work.</em>
          </h1>

          {/* Deck */}
          <p
            className="reveal"
            style={{
              fontSize: '24px',
              lineHeight: 1.45,
              color: 'rgba(246,245,242,0.85)',
              maxWidth: '760px',
              marginBottom: 'clamp(48px,6vw,72px)',
            }}
          >
            Every name on this page has signed off on a budget, run a set, or been the person in the room procurement was waiting for. We are operators — three founders, plus an independent network we engage by name when a problem calls for it.
          </p>

          {/* Meta strip */}
          <div
            className="reveal tm-meta-strip"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4,1fr)',
              gap: '0',
              borderTop: '1px solid rgba(246,245,242,0.35)',
              maxWidth: '900px',
            }}
          >
            {[
              { label: 'Founders', value: 'Three operators' },
              { label: 'Network',  value: 'Eight disciplines' },
              { label: 'Base',     value: 'Hamburg, DE' },
              { label: 'Markets',  value: 'DE · EU · International' },
            ].map(cell => (
              <div
                key={cell.label}
                style={{
                  borderTop: '1px solid rgba(246,245,242,0.35)',
                  paddingTop: '20px',
                  paddingRight: '24px',
                }}
              >
                <p style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  letterSpacing: '0.14em',
                  color: 'rgba(246,245,242,0.45)',
                  marginBottom: '6px',
                }}>
                  {cell.label}
                </p>
                <p style={{
                  fontFamily: 'var(--font-head)',
                  fontSize: '22px',
                  fontWeight: 500,
                  color: '#f6f5f2',
                  lineHeight: 1.2,
                }}>
                  {cell.value}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Section 2: Proof strip ────────────────────────────────────── */}
        <section
          data-t
          style={{ padding: 'clamp(56px,7vw,88px) var(--margin-x)' }}
        >
          {/* Rail */}
          <p
            className="reveal"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '13px',
              letterSpacing: '0.2em',
              color: 'rgba(246,245,242,0.55)',
              marginBottom: '40px',
              fontWeight: 400,
            }}
          >
            — 02 / On the record · The numbers behind the names
          </p>

          {/* 4-col proof grid */}
          <div
            className="tm-proof-grid"
            style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 0 }}
          >
            {proofCells.map((cell, i) => (
              <div
                key={i}
                className="reveal tm-proof-cell"
                style={{
                  borderTop: '1px solid rgba(246,245,242,0.35)',
                  paddingTop: '24px',
                  paddingRight: '32px',
                }}
              >
                <span
                  className="counter reveal"
                  data-target={cell.target}
                  data-suffix={cell.suffix}
                  style={{
                    fontFamily: 'var(--font-head)',
                    fontWeight: 600,
                    fontSize: 'clamp(56px,7vw,88px)',
                    letterSpacing: '-0.03em',
                    color: '#f6f5f2',
                    display: 'block',
                    marginBottom: '12px',
                  }}
                >
                  {cell.target}{cell.suffix}
                </span>
                <p style={{
                  fontSize: '15px',
                  color: 'rgba(246,245,242,0.78)',
                  maxWidth: '280px',
                  lineHeight: 1.4,
                }}>
                  {cell.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Section 3: Founders ───────────────────────────────────────── */}
        <section
          data-t
          style={{ padding: 'clamp(56px,7vw,88px) var(--margin-x)' }}
        >
          {/* Rail */}
          <p
            className="reveal"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '13px',
              letterSpacing: '0.2em',
              color: 'rgba(246,245,242,0.55)',
              marginBottom: '40px',
              fontWeight: 400,
            }}
          >
            — 03 / The founders · Three operators · One independent firm
          </p>

          {/* H2 */}
          <h2
            className="reveal"
            style={{
              fontFamily: 'var(--font-head)',
              fontWeight: 600,
              fontSize: 'clamp(48px,6vw,72px)',
              letterSpacing: '-0.025em',
              color: '#f6f5f2',
              marginBottom: '16px',
            }}
          >
            Three founders. One independent firm.
          </h2>

          {/* Deck */}
          <p
            className="reveal"
            style={{
              fontSize: '21px',
              color: 'rgba(246,245,242,0.82)',
              maxWidth: '720px',
              lineHeight: 1.5,
              marginBottom: 'clamp(48px,6vw,72px)',
            }}
          >
            Each founder leads from a different angle of the production stack. Together they cover what most clients have to assemble across three or four advisors.
          </p>

          {/* 3-col founders grid */}
          <div
            className="tm-founders-grid"
            style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '56px' }}
          >
            {founders.map((f) => (
              <div key={f.index} className="tm-founder reveal">

                {/* Portrait placeholder */}
                <div style={{
                  aspectRatio: '4/5',
                  background: 'linear-gradient(135deg, rgba(246,245,242,0.10) 0%, rgba(246,245,242,0.04) 100%)',
                  border: '1px solid rgba(246,245,242,0.30)',
                  borderRadius: '6px',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  boxShadow: 'inset 0 1px 0 rgba(246,245,242,0.20)',
                  position: 'relative',
                  marginBottom: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <span style={{
                    fontFamily: 'var(--font-serif)',
                    fontStyle: 'italic',
                    fontWeight: 600,
                    fontSize: 'clamp(80px,8vw,120px)',
                    color: 'rgba(246,245,242,0.35)',
                  }}>
                    {f.monogram}
                  </span>
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    letterSpacing: '0.12em',
                    color: 'rgba(246,245,242,0.35)',
                    position: 'absolute',
                    bottom: '16px',
                    left: '16px',
                  }}>
                    {f.name}
                  </span>
                </div>

                {/* Mono row */}
                <p style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  letterSpacing: '0.15em',
                  color: 'rgba(246,245,242,0.55)',
                  borderTop: '1px solid rgba(246,245,242,0.40)',
                  paddingTop: '16px',
                  marginBottom: '12px',
                }}>
                  {f.role}
                </p>

                {/* Name */}
                <p style={{
                  fontFamily: 'var(--font-head)',
                  fontWeight: 600,
                  fontSize: '40px',
                  lineHeight: 1.0,
                  color: '#f6f5f2',
                  marginBottom: '10px',
                }}>
                  {f.name}
                </p>

                {/* Known for */}
                <p style={{
                  fontSize: '22px',
                  lineHeight: 1.3,
                  color: 'rgba(246,245,242,0.85)',
                  marginBottom: '16px',
                }}>
                  {f.knownForText}
                  <em className="news">{f.knownForItalic}</em>
                </p>

                {/* Bio */}
                <p style={{
                  fontSize: '16px',
                  color: 'rgba(246,245,242,0.75)',
                  lineHeight: 1.55,
                  marginBottom: '20px',
                }}>
                  {f.bio}
                </p>

                {/* Tag pills */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
                  {f.tags.map(tag => (
                    <span
                      key={tag}
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '11px',
                        letterSpacing: '0.16em',
                        border: '1px solid rgba(246,245,242,0.35)',
                        padding: '6px 10px',
                        borderRadius: '999px',
                        color: 'rgba(246,245,242,0.75)',
                        background: 'transparent',
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Dashed footer */}
                <div style={{
                  borderTop: '1px dashed rgba(246,245,242,0.40)',
                  paddingTop: '16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    color: 'rgba(246,245,242,0.50)',
                  }}>
                    {f.footerLeft}
                  </span>
                  <a
                    href={`mailto:${f.email}`}
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      color: 'rgba(246,245,242,0.50)',
                      textDecoration: 'underline',
                    }}
                  >
                    {f.email}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Section 4: Working model ──────────────────────────────────── */}
        <section
          data-t
          style={{ padding: 'clamp(56px,7vw,88px) var(--margin-x)' }}
        >
          {/* Rail */}
          <p
            className="reveal"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '13px',
              letterSpacing: '0.2em',
              color: 'rgba(246,245,242,0.55)',
              marginBottom: '40px',
              fontWeight: 400,
            }}
          >
            — 04 / How we work · When you get a founder, when you get a partner
          </p>

          {/* 2-col grid */}
          <div
            className="tm-work-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: '1.1fr 1fr',
              gap: 'clamp(48px,6vw,80px)',
              alignItems: 'start',
            }}
          >
            {/* Left copy */}
            <div>
              <h2
                className="reveal"
                style={{
                  fontFamily: 'var(--font-head)',
                  fontWeight: 600,
                  fontSize: 'clamp(44px,5.5vw,64px)',
                  letterSpacing: '-0.025em',
                  color: '#f6f5f2',
                  marginBottom: '28px',
                }}
              >
                A founder always leads.
              </h2>

              <p
                className="reveal"
                style={{
                  fontSize: '19px',
                  color: 'rgba(246,245,242,0.85)',
                  lineHeight: 1.6,
                  maxWidth: '480px',
                  marginBottom: '20px',
                }}
              >
                Every engagement is led by one of the three founders, named on the contract, present on every call. The partner network extends our specialism where the work calls for it — never as a substitute for the people you hired.
              </p>

              <p
                className="reveal"
                style={{
                  fontSize: '19px',
                  color: 'rgba(246,245,242,0.85)',
                  lineHeight: 1.6,
                  maxWidth: '480px',
                  marginBottom: '20px',
                }}
              >
                Partners are engaged by name, scope, and rate, with their role declared to you up front. They are not staff. They are not subcontractors. They are independent senior practitioners on a single, transparent invoice.
              </p>
            </div>

            {/* Right glass card */}
            <div
              className="reveal tm-work-card"
              style={{
                background: 'rgba(246,245,242,0.06)',
                border: '1px solid rgba(246,245,242,0.30)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                boxShadow: 'inset 0 1px 0 rgba(246,245,242,0.22), 0 28px 60px -30px rgba(0,0,0,0.30)',
                borderRadius: '8px',
                padding: '32px',
              }}
            >
              {/* Card rail */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                borderBottom: '1px solid rgba(246,245,242,0.30)',
                paddingBottom: '16px',
                marginBottom: '4px',
              }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'rgba(246,245,242,0.65)' }}>
                  — Engagement model
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'rgba(246,245,242,0.40)' }}>
                  How a project is staffed
                </span>
              </div>

              {/* Flow rows */}
              {workRows.map((row, i) => (
                <div
                  key={i}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '100px 1fr',
                    gap: '18px',
                    padding: '18px 0',
                    borderBottom: i < workRows.length - 1 ? '1px solid rgba(246,245,242,0.20)' : 'none',
                  }}
                >
                  {/* Left cell */}
                  <div>
                    <p style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '12px',
                      color: 'rgba(246,245,242,0.40)',
                      marginBottom: '8px',
                    }}>
                      {row.step}
                    </p>
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '10px',
                      letterSpacing: '0.18em',
                      background: 'rgba(246,245,242,0.16)',
                      padding: '4px 8px',
                      borderRadius: '999px',
                      color: 'rgba(246,245,242,0.75)',
                      display: 'inline-block',
                    }}>
                      {row.tag}
                    </span>
                  </div>
                  {/* Right cell */}
                  <div>
                    <p style={{
                      fontFamily: 'var(--font-head)',
                      fontWeight: 600,
                      fontSize: '15px',
                      color: '#f6f5f2',
                      marginBottom: '6px',
                    }}>
                      {row.heading}
                    </p>
                    <p style={{
                      fontSize: '13px',
                      color: 'rgba(246,245,242,0.68)',
                      lineHeight: 1.55,
                    }}>
                      {row.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Section 5: Partner network ────────────────────────────────── */}
        <section
          data-t
          style={{ padding: 'clamp(56px,7vw,88px) var(--margin-x)' }}
        >
          {/* Rail */}
          <p
            className="reveal"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '13px',
              letterSpacing: '0.2em',
              color: 'rgba(246,245,242,0.55)',
              marginBottom: '40px',
              fontWeight: 400,
            }}
          >
            — 05 / The network · A discipline map · Engaged by name
          </p>

          {/* Header 2-col */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1.2fr 1fr',
              gap: 'clamp(48px,6vw,80px)',
              marginBottom: 'clamp(48px,6vw,72px)',
            }}
          >
            <h2
              className="reveal"
              style={{
                fontFamily: 'var(--font-head)',
                fontWeight: 600,
                fontSize: 'clamp(48px,6vw,72px)',
                letterSpacing: '-0.025em',
                color: '#f6f5f2',
                marginBottom: 0,
              }}
            >
              A network, not a roster.
            </h2>
            <p
              className="reveal"
              style={{
                fontSize: '19px',
                color: 'rgba(246,245,242,0.80)',
                lineHeight: 1.6,
                alignSelf: 'end',
              }}
            >
              Eight disciplines, organised across three operating axes. We engage them by name when the scope demands a specialism the founders do not own. They are independent — not staff, not subcontractors, not on a retainer to be deployed against your budget.
            </p>
          </div>

          {/* 3-cluster grid */}
          <div
            className="tm-partner-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3,1fr)',
              borderTop: '1px solid rgba(246,245,242,0.35)',
            }}
          >
            {clusters.map((cluster, ci) => (
              <div
                key={ci}
                className="reveal tm-partner-cluster"
                style={{
                  paddingTop: '28px',
                  paddingRight: '40px',
                  borderRight: ci < clusters.length - 1 ? '1px solid rgba(246,245,242,0.25)' : 'none',
                }}
              >
                {/* Cluster header */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  marginBottom: '12px',
                }}>
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    letterSpacing: '0.2em',
                    color: 'rgba(246,245,242,0.60)',
                  }}>
                    {cluster.label}
                  </span>
                  <span style={{
                    fontFamily: 'var(--font-serif)',
                    fontStyle: 'italic',
                    fontWeight: 600,
                    fontSize: '30px',
                    color: '#f6f5f2',
                  }}>
                    {cluster.title}
                  </span>
                </div>

                {/* Cluster description */}
                <p style={{
                  fontSize: '14px',
                  color: 'rgba(246,245,242,0.75)',
                  lineHeight: 1.6,
                  maxWidth: '320px',
                  marginBottom: '24px',
                }}>
                  {cluster.desc}
                </p>

                {/* Discipline list */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {cluster.disciplines.map((d, di) => (
                    <div
                      key={di}
                      className="tm-discipline-item"
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'auto 1fr',
                        columnGap: '14px',
                        padding: '14px 0',
                        borderTop: '1px solid rgba(246,245,242,0.25)',
                      }}
                    >
                      <span style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '11px',
                        color: 'rgba(246,245,242,0.55)',
                        paddingTop: '2px',
                      }}>
                        {d.num}
                      </span>
                      <div>
                        <p style={{
                          fontFamily: 'var(--font-head)',
                          fontWeight: 500,
                          fontSize: '17px',
                          color: '#f6f5f2',
                          marginBottom: '4px',
                        }}>
                          {d.name}
                        </p>
                        <p style={{
                          fontSize: '13px',
                          color: 'rgba(246,245,242,0.72)',
                          lineHeight: 1.5,
                        }}>
                          {d.role}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Footer rule */}
          <div className="tm-partner-footer" style={{
            marginTop: '24px',
            display: 'flex',
            justifyContent: 'space-between',
            borderTop: '1px solid rgba(246,245,242,0.35)',
            paddingTop: '22px',
          }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'rgba(246,245,242,0.55)' }}>
              — Eight disciplines · three clusters · zero affiliations
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'rgba(246,245,242,0.55)' }}>
              shift.media · a network, not a roster
            </span>
          </div>
        </section>

        <CtaSection h2={<>Forty-five minutes. <em className="news">No sales pitch.</em></>} para="Tell us what you are trying to figure out. We will come back within 24 hours, Monday to Friday, with an honest read on whether we are the right people to help — and which founder you would be working with." />
      </main>
      <Footer />
    </>
  )
}
