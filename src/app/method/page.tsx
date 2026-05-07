import Nav from '@/components/marketing/Nav'
import Footer from '@/components/marketing/Footer'
import PillButton from '@/components/marketing/PillButton'
import MethodDimensions from './MethodDimensions'

export const metadata = {
  title: 'The Shift Method — shift.media',
  description: 'A diagnostic framework for brand content operations. Six dimensions. One conversation.',
}

const BODY_GRADIENT = 'linear-gradient(180deg, #004d40 0%, #00695c 12%, #00897b 22%, #b9d8d2 32%, #f6f5f2 50%)'

const deliverables = [
  {
    num: '01',
    name: 'The Diagnostic',
    desc: 'A RAG-scored report across all six dimensions, with evidence, root-cause analysis, and indicative benchmarks.',
  },
  {
    num: '02',
    name: 'The Roadmap',
    desc: 'A prioritised action plan. What to fix first, what to fix next, and what to leave alone.',
  },
  {
    num: '03',
    name: 'The Recommendation',
    desc: 'A clear view on which engagement type comes next — or whether you don\'t need one yet.',
  },
]

export default function MethodPage() {
  return (
    <>
      <Nav />
      <main style={{ background: BODY_GRADIENT }} className="min-h-screen font-[family-name:var(--font-head)]">

        {/* HERO */}
        <section
          className="flex flex-col justify-end px-[var(--margin-x)] min-h-[60vh]"
          style={{
            paddingTop: 'clamp(120px, 18vw, 180px)',
            paddingBottom: 'clamp(56px, 8vw, 80px)',
          }}
        >
          <div className="max-w-[1100px]">
            <h1
              className="font-bold text-cream leading-[0.95] tracking-[-0.025em] mb-8"
              style={{ fontSize: 'clamp(48px, 7vw, 96px)' }}
            >
              The Shift{' '}
              <em className="not-italic font-bold text-ink tracking-[-0.02em]" style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>
                Method.
              </em>
            </h1>
            <p
              className="text-cream leading-[1.55] max-w-[580px] font-medium"
              style={{ fontSize: 'clamp(16px, 1.6vw, 18px)', opacity: 0.82 }}
            >
              A diagnostic framework for brand content operations.
              Six dimensions. One clear roadmap.
            </p>
          </div>
        </section>

        {/* OPENING CLAIM */}
        <section
          className="px-[var(--margin-x)]"
          style={{ paddingTop: 'clamp(56px, 10vw, 80px)', paddingBottom: 'clamp(56px, 10vw, 80px)' }}
        >
          <div className="max-w-[860px]">
            <p
              className="font-bold text-cream leading-[1.05] tracking-[-0.02em] mb-4"
              style={{ fontSize: 'clamp(26px, 3.8vw, 46px)' }}
            >
              Most production problems are not creative problems.
            </p>
            <p
              className="font-bold text-cream/85 leading-[1.05] tracking-[-0.02em] mb-10"
              style={{
                fontFamily: 'var(--font-serif)',
                fontStyle: 'italic',
                fontSize: 'clamp(26px, 3.8vw, 46px)',
              }}
            >
              They are operational problems.
            </p>
            <p className="font-medium text-[16px] sm:text-[17px] text-cream/85 leading-[1.65] max-w-[640px]">
              The Shift Method is how we diagnose them — across six dimensions,
              ending in a clear roadmap and a defensible plan.
            </p>
          </div>
        </section>

        {/* SIX DIMENSIONS */}
        <section
          className="px-[var(--margin-x)]"
          style={{ paddingTop: 'clamp(56px, 10vw, 80px)', paddingBottom: 'clamp(56px, 10vw, 80px)' }}
        >
          <div className="max-w-[1200px]">
            <h2
              className="font-bold text-ink leading-[1.0] tracking-[-0.02em] mb-4 max-w-[900px]"
              style={{ fontSize: 'clamp(32px, 4.5vw, 60px)' }}
            >
              Six{' '}
              <em className="not-italic font-bold text-teal-mid" style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>
                dimensions.
              </em>
            </h2>
            <p className="font-medium text-[15px] text-gray-warm leading-[1.6] mb-12 sm:mb-16 max-w-[560px]">
              Each one a diagnostic lens. Select any dimension to explore what we look at and why.
            </p>

            <MethodDimensions />

          </div>
        </section>

        {/* WHAT YOU RECEIVE */}
        <section
          className="px-[var(--margin-x)]"
          style={{ paddingTop: 'clamp(56px, 10vw, 80px)', paddingBottom: 'clamp(56px, 10vw, 80px)' }}
        >
          <div className="max-w-[1000px]">
            <h2
              className="font-bold text-ink leading-[1.0] tracking-[-0.02em] mb-12 sm:mb-16"
              style={{ fontSize: 'clamp(32px, 4.5vw, 60px)' }}
            >
              Three deliverables.{' '}
              <em className="not-italic font-bold text-teal-mid" style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>
                Yours to keep.
              </em>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-12 gap-x-8">
              {deliverables.map(item => (
                <div key={item.num} className="flex flex-col">
                  <p className="text-[11px] tracking-[1px] text-gray-soft mb-5" style={{ fontFamily: 'var(--font-mono)' }}>
                    [{item.num}]
                  </p>
                  <h3 className="font-bold text-[20px] text-ink leading-[1.05] tracking-[-0.015em] mb-3.5">
                    {item.name}
                  </h3>
                  <p className="font-medium text-[14px] text-gray-warm leading-[1.65]">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CLOSING CTA */}
        <section
          className="px-[var(--margin-x)]"
          style={{ paddingTop: 'clamp(56px, 10vw, 80px)', paddingBottom: 'clamp(80px, 14vw, 120px)' }}
        >
          <div className="max-w-[760px]">
            <h2
              className="font-bold text-ink leading-[1.05] tracking-[-0.02em] mb-6"
              style={{ fontSize: 'clamp(28px, 3.8vw, 48px)' }}
            >
              Start with a{' '}
              <em className="not-italic font-bold text-teal-mid" style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>
                conversation.
              </em>
            </h2>
            <p className="font-medium text-[16px] sm:text-[17px] text-gray-warm leading-[1.65] mb-10 max-w-[520px]">
              The Shift Method begins with a conversation, not a sales pitch.
              We&apos;ll tell you whether this is the right next step — and if it
              isn&apos;t, what is.
            </p>
            <PillButton href="/contact" variant="teal" size="md">
              Get in touch
            </PillButton>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
