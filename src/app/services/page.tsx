import Nav from '@/components/marketing/Nav'
import Footer from '@/components/marketing/Footer'
import PillButton from '@/components/marketing/PillButton'
import ServicesSlider from './ServicesSlider'
import ServicesFaq from './ServicesFaq'

export const metadata = {
  title: 'Services — shift.media',
  description: 'How we work with brands. Independent advisory across the full production lifecycle.',
}

const BODY_GRADIENT = 'linear-gradient(180deg, #004d40 0%, #00695c 8%, #00897b 20%, #4db6a0 48%, #b9d8d2 68%, #f6f5f2 82%)'

const entryPoints = [
  {
    name: 'Audit',
    desc: 'A clear, independent read of where you stand. We assess your production setup — costs, vendors, structure, process — and surface the gaps and opportunities.',
  },
  {
    name: 'Workshop',
    desc: 'Deep, focused sessions on a single topic. AI readiness, production strategy, organisational design, or anything else. Practical and built around your real briefs.',
  },
  {
    name: 'Pilot',
    desc: 'A defined project, start to finish. We embed alongside your team, run it independently, and leave you with a working blueprint.',
  },
]

const partnerships = [
  {
    name: 'Build',
    desc: 'Advisory-led design of your in-house production model. Structure, talent, process, tooling — designed and stood up alongside your team.',
  },
  {
    name: 'Engine',
    desc: 'Senior advisory on retainer. Always-on counsel across content, campaigns, and operations. Independent of any single project. Named partner ownership.',
  },
  {
    name: 'Campaign',
    desc: 'Embedded production oversight, brief to delivery. Cost control, vendor selection, quality assurance. We sit on the brand side of the table.',
  },
]

const pillars = [
  {
    num: '01',
    name: 'Production Controlling',
    desc: 'Cost intelligence and real-time visibility across every production.',
    details: 'Budget development & validation · Cost reporting & reconciliation · Vendor selection & negotiation · Triple bidding · Rate benchmarking · Talent buyout management · SOW & MSA review · Real-time spend visibility',
    outcome: 'Less waste, full visibility, no surprises.',
  },
  {
    num: '02',
    name: 'Strategic Advisory',
    desc: 'Shaping how brands commission and plan content at scale.',
    details: 'Production strategy · Operating-model design · Roster & vendor strategy · Sustainable production & ESG reporting · Risk & compliance · International production structures · Tax-incentive strategy',
    outcome: 'A production strategy your CFO and your CMO both sign.',
  },
  {
    num: '03',
    name: 'Organisational Setup',
    desc: 'Building the production capability you need — from scratch or from inside.',
    details: 'In-house production department setup · Talent strategy & hiring · Production tech stack & tooling · VFX & post-production pipelines · AI studio architecture · Team upskilling & change management',
    outcome: 'An in-house team that ships.',
  },
  {
    num: '04',
    name: 'AI Integration',
    desc: 'From AI experiments to AI-native production. Governed, calibrated, built to last.',
    details: 'AI maturity assessment · AI use-case identification & prioritisation · Tool selection & vendor evaluation · EU-compliant AI stack selection · Workflow integration · AI playbooks (Brand · Production · Governance) · Team training & certification · Ethics & policy frameworks',
    outcome: 'A working AI operating model — not a slide deck.',
  },
]

const faqs = [
  {
    q: 'How is shift.media different from a production company?',
    a: 'We don\'t make productions. We advise on them. We have no financial interest in any production going ahead, going bigger, or going to any particular vendor.',
  },
  {
    q: 'How is shift.media different from a consultancy?',
    a: 'We\'ve actually run productions. On set. In the edit suite. In the negotiations. Our recommendations are grounded in what happens in production — not what a slide deck says should happen.',
  },
  {
    q: 'Do you take a cut of vendor fees?',
    a: 'No. Never. Our fees come from our clients. That\'s it.',
  },
  {
    q: 'What does an engagement typically cost?',
    a: 'We scope each engagement individually. Talk to us — we\'ll tell you what\'s involved before you commit to anything.',
  },
  {
    q: 'Can you work alongside our existing agency?',
    a: 'Yes. We work with brands whose agencies are managing the production, brands working directly with production companies, and brands building their own in-house function. Independent oversight is the constant.',
  },
]

export default function ServicesPage() {
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
              From a single brief{' '}
              <em className="not-italic font-bold text-ink tracking-[-0.02em]" style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>
                to a full rebuild.
              </em>
            </h1>
            <p
              className="text-cream leading-[1.65] max-w-[600px] font-medium"
              style={{ fontSize: 'clamp(16px, 1.6vw, 18px)', opacity: 0.82 }}
            >
              We meet brands wherever they are.
              One project. A focused workshop. An embedded retainer.
              A complete in-house production transformation.
              <br /><br />
              The architecture is the same.
              The scope adjusts to the engagement.
            </p>
          </div>
        </section>

        {/* CAROUSELS */}
        <section style={{
          paddingTop: 'clamp(64px, 10vw, 100px)',
          paddingBottom: 'clamp(64px, 10vw, 100px)',
        }}>
          <div className="flex flex-col gap-20">
            <ServicesSlider
              label="Where to start."
              cards={entryPoints}
            />
            <ServicesSlider
              label="How we engage."
              cards={partnerships}
            />
          </div>
        </section>

        {/* CAPABILITIES */}
        <section
          className="px-[var(--margin-x)]"
          style={{ paddingTop: 'clamp(56px, 10vw, 80px)', paddingBottom: 'clamp(56px, 10vw, 80px)' }}
        >
          <div className="max-w-[1200px]">
            <h2
              className="font-bold text-ink leading-[1.0] tracking-[-0.02em] mb-12 sm:mb-16 max-w-[900px]"
              style={{ fontSize: 'clamp(32px, 4.5vw, 60px)' }}
            >
              Four pillars.{' '}
              <em className="not-italic font-bold text-teal-mid" style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>
                One partner.
              </em>
            </h2>
            <div className="grid gap-y-12 sm:gap-y-16 gap-x-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {pillars.map(item => (
                <div key={item.num} className="flex flex-col">
                  <p className="text-[11px] tracking-[1px] text-gray-soft mb-5" style={{ fontFamily: 'var(--font-mono)' }}>[{item.num}]</p>
                  <h3 className="font-bold text-[20px] text-ink leading-[1.05] tracking-[-0.015em] mb-3.5">{item.name}</h3>
                  <p className="font-medium text-[14px] text-gray-warm leading-[1.6] mb-5">{item.desc}</p>
                  <p className="text-[11px] text-gray-soft leading-[1.7] tracking-[0.3px] mb-5" style={{ fontFamily: 'var(--font-mono)' }}>{item.details}</p>
                  <p
                    className="font-bold text-teal-mid leading-[1.2] tracking-[-0.01em] mt-auto"
                    style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 'clamp(14px, 1.4vw, 16px)' }}
                  >
                    {item.outcome}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section
          className="px-[var(--margin-x)]"
          style={{ paddingTop: 'clamp(56px, 10vw, 80px)', paddingBottom: 'clamp(56px, 10vw, 80px)' }}
        >
          <div className="max-w-[860px]">
            <h2
              className="font-bold text-ink leading-[1.0] tracking-[-0.02em] mb-12 sm:mb-16"
              style={{ fontSize: 'clamp(32px, 4.5vw, 60px)' }}
            >
              Common{' '}
              <em className="not-italic font-bold text-teal-mid" style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>
                questions.
              </em>
            </h2>

            <ServicesFaq items={faqs} />
          </div>
        </section>

        {/* CLOSING CTA */}
        <section
          className="px-[var(--margin-x)]"
          style={{ paddingTop: 'clamp(24px, 4vw, 40px)', paddingBottom: 'clamp(80px, 14vw, 120px)' }}
        >
          <div className="flex flex-wrap gap-4">
            <PillButton href="/contact" variant="teal" size="md">Start a conversation</PillButton>
            <PillButton href="/method" variant="outline-ink" size="md">Read the Method</PillButton>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
