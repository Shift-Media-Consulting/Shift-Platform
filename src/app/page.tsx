import Nav from '@/components/marketing/Nav'
import Footer from '@/components/marketing/Footer'
import PillButton from '@/components/marketing/PillButton'
import IntroWrapper from './IntroWrapper'

export const metadata = {
  title: 'shift.media — Independent Production Advisory',
  description: 'Independent by design. On your side by choice. Production advisory for brands. Hamburg, DE.',
}

const BODY_GRADIENT = 'linear-gradient(180deg, #004d40 0%, #00695c 12%, #00897b 22%, #b9d8d2 32%, #f6f5f2 50%)'

const capabilities = [
  {
    num: '01',
    name: 'Production Controlling',
    desc: 'Cost intelligence and real-time visibility across every production.',
    details: 'Budget development · Cost reporting · Vendor negotiation · Buyout management · The Shift Platform',
  },
  {
    num: '02',
    name: 'Strategic Advisory',
    desc: 'Shaping how brands commission and plan content at scale.',
    details: 'Production strategy · Roster advisory · Sustainable production · Risk assessment · International structures',
  },
  {
    num: '03',
    name: 'Organisational Setup',
    desc: 'Building the production capability you need — from scratch or from inside.',
    details: 'In-house dept setup · Talent advisory · Tech stack selection · VFX & post · AI studio builds',
  },
  {
    num: '04',
    name: 'AI Integration',
    desc: 'From AI experiments to AI-native production. Governed, calibrated, built to last.',
    details: 'AI readiness audit · Tool selection · Workflow integration · Training · Ethics & governance',
  },
]

const whereWeFit = [
  {
    num: '01',
    name: 'Procurement',
    desc: 'Sourcing, RFPs, vendor terms, rate benchmarking.',
  },
  {
    num: '02',
    name: 'Operating model',
    desc: 'How the team is organised. Where AI fits. How decisions get made.',
  },
  {
    num: '03',
    name: 'Live execution',
    desc: 'Embedded oversight on specific productions.',
  },
  {
    num: '04',
    name: 'Capability build',
    desc: 'In-house departments. Talent. Tech stack.',
  },
  {
    num: '05',
    name: 'Measurement',
    desc: 'Spend. Savings. Performance. Visibility.',
  },
  {
    num: '06',
    name: 'Strategy',
    desc: 'Production strategy. Sustainability. International structures.',
  },
]

export default function Home() {
  return (
    <>
      <IntroWrapper />
      <Nav />
      <main style={{ background: BODY_GRADIENT }} className="min-h-screen font-[family-name:var(--font-head)]">

        {/* HERO */}
        <section
          className="flex flex-col justify-center min-h-screen px-[var(--margin-x)]"
          style={{ paddingTop: 'clamp(96px, 18vw, 120px)', paddingBottom: 'clamp(80px, 14vw, 120px)' }}
        >
          <div className="max-w-[1100px] w-full">
            <h1
              className="font-bold text-cream leading-[0.95] tracking-[-0.02em] mb-12 sm:mb-14"
              style={{ fontSize: 'clamp(56px, 8vw, 120px)' }}
            >
              Independent<br />
              by{' '}
              <em className="not-italic font-bold tracking-[-0.025em]" style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>
                design.
              </em>
              <br />
              On your side<br />
              by{' '}
              <em className="not-italic font-bold tracking-[-0.025em] text-ink" style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>
                choice.
              </em>
            </h1>

            <p
              className="text-ink/70 leading-[1.55] mb-10 sm:mb-12 max-w-[560px] font-medium"
              style={{ fontSize: 'clamp(16px, 1.6vw, 18px)' }}
            >
              Independent production advisory for brands. We fix what the
              agency–production system can't — because we're not part of it.
            </p>

            <div className="flex flex-wrap gap-4">
              <PillButton href="/contact" variant="ink" size="lg">
                Get in touch
              </PillButton>
              <PillButton href="/services" variant="outline-cream" size="lg">
                See how we work
              </PillButton>
            </div>
          </div>
        </section>

        {/* CAPABILITIES */}
        <section
          className="px-[var(--margin-x)]"
          style={{ paddingTop: 'clamp(64px, 12vw, 120px)', paddingBottom: 'clamp(64px, 12vw, 80px)' }}
        >
          <div className="max-w-[1200px]">
            <h2
              className="font-bold text-ink leading-[1.0] tracking-[-0.02em] mb-12 sm:mb-16 max-w-[900px]"
              style={{ fontSize: 'clamp(36px, 4.5vw, 64px)' }}
            >
              Four pillars.{' '}
              <em className="not-italic font-bold text-teal-mid tracking-[-0.02em]" style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>
                One partner.
              </em>
            </h2>

            <div className="grid gap-y-12 sm:gap-y-16 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {capabilities.map(item => (
                <div key={item.num} className="flex flex-col">
                  <p className="text-[11px] tracking-[1px] text-gray-soft mb-5" style={{ fontFamily: 'var(--font-mono)' }}>
                    [{item.num}]
                  </p>
                  <h3 className="font-bold text-[20px] text-ink leading-[1.05] tracking-[-0.015em] mb-3.5">
                    {item.name}
                  </h3>
                  <p className="font-medium text-[14px] text-gray-warm leading-[1.6] mb-5">
                    {item.desc}
                  </p>
                  <p className="text-[11px] text-gray-soft leading-[1.7] tracking-[0.3px]" style={{ fontFamily: 'var(--font-mono)' }}>
                    {item.details}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WHERE WE FIT */}
        <section
          className="px-[var(--margin-x)]"
          style={{ paddingTop: 'clamp(56px, 10vw, 80px)', paddingBottom: 'clamp(56px, 10vw, 80px)' }}
        >
          <div className="max-w-[1200px]">
            <h2
              className="font-bold text-ink leading-[1.0] tracking-[-0.02em] mb-12 sm:mb-16 max-w-[900px]"
              style={{ fontSize: 'clamp(32px, 4.5vw, 60px)' }}
            >
              We work at every level{' '}
              <em className="not-italic font-bold text-teal-mid" style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>
                of the production system.
              </em>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-10 sm:gap-y-12 gap-x-8">
              {whereWeFit.map(item => (
                <div key={item.num} className="flex flex-col">
                  <p className="text-[11px] tracking-[1px] text-gray-soft mb-4" style={{ fontFamily: 'var(--font-mono)' }}>
                    [{item.num}]
                  </p>
                  <h3 className="font-bold text-[18px] text-ink leading-[1.05] tracking-[-0.015em] mb-2.5">
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

        {/* THE SHIFT METHOD — TEASER */}
        <section
          className="px-[var(--margin-x)]"
          style={{ paddingTop: 'clamp(56px, 10vw, 80px)', paddingBottom: 'clamp(80px, 14vw, 120px)' }}
        >
          <div className="max-w-[800px]">
            <h2
              className="font-bold text-ink leading-[1.05] tracking-[-0.02em] mb-8"
              style={{ fontSize: 'clamp(32px, 4.5vw, 60px)' }}
            >
              Every engagement starts with the same question.{' '}
              <em className="not-italic font-bold text-teal-mid" style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>
                Where are you, really?
              </em>
            </h2>

            <p
              className="font-medium text-[16px] sm:text-[17px] text-gray-warm leading-[1.65] mb-10 max-w-[600px]"
            >
              The Shift Method is our diagnostic framework —
              six dimensions, evidence-based, grounded in established management science.
              It&apos;s how we tell the truth about your operation before we recommend anything.
            </p>

            <div className="flex flex-wrap gap-4">
              <PillButton href="/method" variant="teal" size="md">
                Read the Method
              </PillButton>
              <PillButton href="/contact" variant="outline-ink" size="md">
                Start a conversation
              </PillButton>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
