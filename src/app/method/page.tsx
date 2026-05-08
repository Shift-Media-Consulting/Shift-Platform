import type { Metadata } from 'next'
import Nav from '@/components/marketing/Nav'
import Footer from '@/components/marketing/Footer'
import PageReveal from '@/components/marketing/PageReveal'
import MethodReveal from './MethodReveal'
import MethodFramework from './MethodFramework'
import MethodArtifact from './MethodArtifact'
import MethodCarousel from './MethodCarousel'
import CtaSection from '@/components/marketing/CtaSection'

export const metadata: Metadata = {
  title: 'The Shift Method — shift.media',
  description:
    'A diagnostic, not a sales pitch. Six operational dimensions. One independent assessment. Yours to keep.',
}

const BODY_GRADIENT =
  'linear-gradient(180deg, #004d40 0%, #2a6f5e 20%, #4f9382 48%, #b9d8d2 78%, #b9d8d2 100%)'

export default function MethodPage() {
  return (
    <>
      <Nav />
      <PageReveal />
      <MethodReveal />
      <main
        className="mth-main"
        style={{
          background: BODY_GRADIENT,
          minHeight: '100vh',
          fontFamily: 'var(--font-head)',
        }}
      >

        {/* ── Section 1: Hero ──────────────────────────────────────────── */}
        <section
          data-ab
          style={{
            padding: `clamp(96px, 13vw, 140px) var(--margin-x) clamp(40px, 5vw, 60px)`,
          }}
        >
          {/* Eyebrow */}
          <p
            className="ab-label"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '13px',
              letterSpacing: '0.18em',
              color: 'rgba(246,245,242,0.55)',
              marginBottom: '28px',
              fontWeight: 400,
            }}
          >
            — The Shift Method · A diagnostic, not a sales pitch
          </p>

          {/* h1 */}
          <h1
            className="ab-h"
            style={{
              fontFamily: 'var(--font-head)',
              fontWeight: 600,
              fontSize: 'clamp(48px, 7.5vw, 104px)',
              lineHeight: 0.95,
              letterSpacing: '-0.025em',
              color: '#f6f5f2',
              maxWidth: '1300px',
              marginBottom: '32px',
            }}
          >
            The{' '}
            <em className="news">diagnosis</em>{' '}
            no one inside the room is paid to give you.
          </h1>

          {/* Deck */}
          <p
            className="ab-p"
            style={{
              fontSize: 'clamp(18px, 2vw, 26px)',
              lineHeight: 1.4,
              color: 'rgba(246,245,242,0.85)',
              fontWeight: 400,
              maxWidth: '760px',
              marginBottom: 'clamp(48px, 6vw, 72px)',
            }}
          >
            Six operational dimensions. One independent assessment. Yours to keep —
            whether or not you ever work with us again.
          </p>

          {/* Meta strip */}
          <div
            className="ab-p2 mth-meta-strip"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '0',
              borderTop: '1px solid rgba(246,245,242,0.20)',
              maxWidth: '900px',
            }}
          >
            {[
              { label: 'Format',   value: 'Diagnostic engagement' },
              { label: 'Duration', value: '4–8 weeks' },
              { label: 'Output',   value: 'Three documents' },
              { label: 'Outcome',  value: 'A defensible plan' },
            ].map((cell) => (
              <div
                key={cell.label}
                style={{
                  borderTop: '1px solid rgba(246,245,242,0.25)',
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

        {/* ── Section 2: When to use it ────────────────────────────────── */}
        <section
          data-mth
          style={{
            padding: 'clamp(56px,7vw,88px) var(--margin-x)',
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
              marginBottom: '40px',
              fontWeight: 400,
            }}
          >
            — 01 / When to use it · Three triggers
          </p>

          {/* h2 */}
          <h2
            className="mth-r"
            style={{
              fontFamily: 'var(--font-head)',
              fontWeight: 600,
              fontSize: 'clamp(32px, 4vw, 56px)',
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
              color: '#f6f5f2',
              marginBottom: '16px',
              maxWidth: '760px',
            }}
          >
            Most production problems are not creative problems.
          </h2>

          {/* Deck */}
          <p
            className="mth-r"
            style={{
              fontSize: '20px',
              lineHeight: 1.5,
              color: 'rgba(246,245,242,0.75)',
              maxWidth: '600px',
              marginBottom: 'clamp(48px, 6vw, 72px)',
            }}
          >
            They are operational problems. Here is when to reach for the Method —
            and when not to.
          </p>

          {/* 3 triggers */}
          <div
            className="mth-triggers-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              columnGap: '48px',
            }}
          >
            {[
              {
                num: 'Trigger 01',
                h3: 'Costs are climbing but output isn\'t.',
                body: 'Year-on-year content spend keeps growing. The deliverables list, the asset count, and the audience response do not. You suspect waste, but cannot point to it on a page.',
              },
              {
                num: 'Trigger 02',
                h3: 'You\'re being asked to defend fees you cannot fully explain.',
                body: 'Procurement wants line-item clarity. The CFO wants benchmarks. Your agency invoice is a single number with three sentences underneath. You need an independent read before the next renewal.',
              },
              {
                num: 'Trigger 03',
                h3: 'You\'re considering bringing production in-house.',
                body: 'A studio, a model, a hybrid. Before you build anything — or sign anything — you want a senior, vendor-free view of what your operation actually needs. Not what someone wants to sell you.',
              },
            ].map((t) => (
              <div
                key={t.num}
                className="mth-r"
                style={{
                  borderTop: '1px solid rgba(246,245,242,0.40)',
                  paddingTop: '28px',
                }}
              >
                <p style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  letterSpacing: '0.14em',
                  color: 'rgba(246,245,242,0.45)',
                  marginBottom: '20px',
                }}>
                  {t.num}
                </p>
                <h3 style={{
                  fontFamily: 'var(--font-serif)',
                  fontStyle: 'italic',
                  fontWeight: 600,
                  fontSize: 'clamp(22px, 2.2vw, 30px)',
                  lineHeight: 1.2,
                  color: '#f6f5f2',
                  maxWidth: '360px',
                  marginBottom: '20px',
                }}>
                  {t.h3}
                </h3>
                <p style={{
                  fontSize: '15px',
                  lineHeight: 1.65,
                  color: 'rgba(246,245,242,0.70)',
                }}>
                  {t.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Section 3: Framework ─────────────────────────────────────── */}
        <MethodFramework />

        {/* ── Section 4: Artifact ──────────────────────────────────────── */}
        <MethodArtifact />

        {/* ── Section 5: Carousel / Deliverables ───────────────────────── */}
        <MethodCarousel />

        {/* ── Section 6: Independence Statement ───────────────────────── */}
        <section
          data-mth
          style={{
            padding: 'clamp(56px,7vw,88px) var(--margin-x)',
            borderTop: '1px solid rgba(17,17,17,0.12)',
          }}
        >
          {/* Rail */}
          <p
            className="mth-r"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '13px',
              letterSpacing: '0.18em',
              color: 'rgba(0,77,64,0.65)',
              marginBottom: '48px',
              fontWeight: 400,
            }}
          >
            — 05 / Why this works · The independence statement
          </p>

          {/* Big statement */}
          <p
            className="mth-r"
            style={{
              fontFamily: 'var(--font-head)',
              fontWeight: 600,
              fontSize: 'clamp(40px, 6vw, 80px)',
              lineHeight: 1.0,
              letterSpacing: '-0.025em',
              color: '#111111',
              maxWidth: '1100px',
              marginBottom: 'clamp(48px, 6vw, 80px)',
            }}
          >
            <em className="news">Senior production expertise</em>{' '}
            on your side of the table.
          </p>

          {/* 3-column list */}
          <div
            className="mth-independence-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              columnGap: '48px',
            }}
          >
            {[
              {
                h4: 'Affiliations',
                body: 'We do not own, partner with, or take referral fees from any production company. Every supplier we evaluate is evaluated on the same terms. We have no upside in your spend going up — or in any specific name being kept on a roster.',
              },
              {
                h4: 'Compensation',
                body: 'We are paid by you. Once. Fixed scope, fixed fee.',
              },
              {
                h4: 'Parentage',
                body: 'We are not part of an agency holding group, nor a production network. No quarterly target to feed. No sister company to recommend.',
              },
            ].map((col) => (
              <div
                key={col.h4}
                className="mth-r"
                style={{
                  borderTop: '1px solid rgba(17,17,17,0.15)',
                  paddingTop: '24px',
                }}
              >
                <h4 style={{
                  fontFamily: 'var(--font-head)',
                  fontWeight: 600,
                  fontSize: '22px',
                  color: '#111111',
                  marginBottom: '14px',
                  letterSpacing: '-0.01em',
                }}>
                  {col.h4}
                </h4>
                <p style={{
                  fontSize: '15px',
                  lineHeight: 1.65,
                  color: 'rgba(17,17,17,0.62)',
                }}>
                  {col.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        <CtaSection h2={<>Forty-five minutes. <em className="news">No sales pitch.</em></>} para="We will tell you whether this is the right next step for your operation, and if it is not, what is." />

      </main>
      <Footer />
    </>
  )
}
