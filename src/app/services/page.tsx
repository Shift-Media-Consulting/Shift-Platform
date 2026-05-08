import Nav from '@/components/marketing/Nav'
import Footer from '@/components/marketing/Footer'
import CtaSection from '@/components/marketing/CtaSection'
import ServicesReveal from './ServicesReveal'
import ServicesSlider from './ServicesSlider'
import ServicesFaq from './ServicesFaq'

export const metadata = {
  title: 'Services — shift.media',
  description: 'How we work with brands. Independent advisory across the full production lifecycle.',
}

const BODY_GRADIENT = 'linear-gradient(180deg, #004d40 0%, #2a6f5e 20%, #4f9382 48%, #b9d8d2 78%, #b9d8d2 100%)'

const entryPoints = [
  {
    name: 'Audit',
    desc: 'A clear, independent read of where you stand. We assess your production setup (costs, vendors, structure, process) and surface the gaps and opportunities.',
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
    desc: 'Advisory-led design of your in-house production model. Structure, talent, process, tooling. Designed and stood up alongside your team.',
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
    label: 'Production',
    name: 'Production Controlling',
    desc: 'Cost intelligence and real-time visibility across every production.',
    details: 'Budget development & validation · Cost reporting & reconciliation · Vendor selection & negotiation · Triple bidding · Rate benchmarking · Talent buyout management · SOW & MSA review · Real-time spend visibility',
    outcome: 'Less waste, full visibility, no surprises.',
  },
  {
    num: '02',
    label: 'Strategy',
    name: 'Strategic Advisory',
    desc: 'Shaping how brands commission and plan content at scale.',
    details: 'Production strategy · Operating-model design · Roster & vendor strategy · Sustainable production & ESG reporting · Risk & compliance · International production structures · Tax-incentive strategy',
    outcome: 'A production strategy your CFO and your CMO both sign.',
  },
  {
    num: '03',
    label: 'Setup',
    name: 'Organisational Setup',
    desc: 'Building the production capability you need, from scratch or from inside.',
    details: 'In-house production department setup · Talent strategy & hiring · Production tech stack & tooling · VFX & post-production pipelines · AI studio architecture · Team upskilling & change management',
    outcome: 'An in-house team that ships.',
  },
  {
    num: '04',
    label: 'AI',
    name: 'AI Integration',
    desc: 'From AI experiments to AI-native production. Governed, calibrated, built to last.',
    details: 'AI maturity assessment · AI use-case identification & prioritisation · Tool selection & vendor evaluation · EU-compliant AI stack selection · Workflow integration · AI playbooks (Brand, Production, Governance) · Team training & certification · Ethics & policy frameworks',
    outcome: 'A working AI operating model — not a slide deck.',
  },
]

const faqs = [
  {
    q: 'How is shift.media different from a production company?',
    a: 'We do not make productions. We advise on them. We have no financial interest in any production going ahead, going bigger, or going to any particular vendor.',
  },
  {
    q: 'How is shift.media different from a consultancy?',
    a: 'We have actually run productions. On set. In the edit suite. In the negotiations. Our recommendations are grounded in what happens in production, not what a slide deck says should happen.',
  },
  {
    q: 'Do you take a cut of vendor fees?',
    a: 'No. Never. Our fees come from our clients. That is it.',
  },
  {
    q: 'What does an engagement typically cost?',
    a: 'We scope each engagement individually. Talk to us — we will tell you what is involved before you commit to anything.',
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
      <ServicesReveal />
      <main
        className="services-main min-h-screen font-[family-name:var(--font-head)]"
        style={{
          background: BODY_GRADIENT,
        }}
      >

        {/* HERO */}
        <section
          data-ab
          className="flex flex-col justify-end px-8 sm:px-10 md:px-14 lg:px-20 xl:px-24 min-h-[60vh]"
          style={{
            paddingTop: 'clamp(120px, 18vw, 180px)',
            paddingBottom: 'clamp(56px, 8vw, 80px)',
          }}
        >
          <div className="max-w-[1100px]">
            <h1
              className="ab-h font-bold text-cream leading-[0.95] tracking-[-0.025em] mb-8"
              style={{ fontSize: 'clamp(48px, 7vw, 96px)' }}
            >
              From a single brief{' '}
              <em className="news">to a full rebuild.</em>
            </h1>
            <p
              className="ab-p text-cream/80 leading-[1.65] max-w-[600px] font-medium"
              style={{ fontSize: 'clamp(16px, 1.6vw, 18px)' }}
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
        <section
          data-ab
          style={{
            paddingTop: 'clamp(64px, 10vw, 100px)',
            paddingBottom: 'clamp(64px, 10vw, 100px)',
          }}
        >
          <div className="ab-card flex flex-col gap-20">
            <ServicesSlider label={<>Where to <em className="news">start.</em></>} cards={entryPoints} />
            <ServicesSlider label={<>How we <em className="news">engage.</em></>} cards={partnerships} />
          </div>
        </section>

        {/* FOUR PILLARS */}
        <section
          data-ab
          style={{ padding: 'clamp(56px,7vw,88px) var(--margin-x)' }}
        >
          {/* Header grid */}
          <div
            className="ab-h svc-header-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: '1.2fr 1fr',
              gap: 'clamp(48px,6vw,80px)',
              marginBottom: '64px',
              alignItems: 'end',
            }}
          >
            <h2
              style={{
                fontFamily: 'var(--font-head)',
                fontWeight: 600,
                fontSize: 'clamp(48px,6.5vw,88px)',
                lineHeight: 0.96,
                letterSpacing: '-0.025em',
                color: '#111111',
                margin: 0,
              }}
            >
              Four pillars. <em className="news">One partner.</em>
            </h2>
            <p
              className="ab-p"
              style={{
                fontSize: '19px',
                lineHeight: 1.55,
                color: 'rgba(17,17,17,0.78)',
                maxWidth: '460px',
                alignSelf: 'end',
                margin: 0,
              }}
            >
              A complete operating model for brands that produce, covering the four areas where independent expertise pays for itself fastest.
            </p>
          </div>

          {/* Pillar rail */}
          <div
            className="ab-p2"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              borderTop: '1px solid rgba(17,17,17,0.40)',
              paddingTop: '18px',
              marginBottom: '32px',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                letterSpacing: '0.20em',
                color: 'rgba(17,17,17,0.65)',
              }}
            >
              — What we do
            </span>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                letterSpacing: '0.20em',
                color: 'rgba(17,17,17,0.65)',
              }}
            >
              04 capabilities
            </span>
          </div>

          {/* 4-col grid */}
          <div
            className="svc-pillar-grid"
            style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 0 }}
          >
            {pillars.map((item, idx) => (
              <div
                key={item.num}
                className="ab-card svc-pillar"
                style={{
                  borderTop: '1px solid rgba(17,17,17,0.35)',
                  borderRight: idx < 3 ? '1px solid rgba(17,17,17,0.18)' : 'none',
                  padding: '28px 24px 36px 0',
                  minHeight: '480px',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {/* Top row */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '64px',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '12px',
                      letterSpacing: '0.22em',
                      color: 'rgba(17,17,17,0.60)',
                    }}
                  >
                    [{item.num}] · {item.label}
                  </span>
                </div>

                {/* H3 */}
                <h3
                  style={{
                    fontFamily: 'var(--font-head)',
                    fontWeight: 600,
                    fontSize: '28px',
                    letterSpacing: '-0.02em',
                    lineHeight: 1.0,
                    color: '#111111',
                    marginBottom: '12px',
                  }}
                >
                  {item.name}
                </h3>

                {/* Desc */}
                <p
                  style={{
                    fontSize: '15px',
                    lineHeight: 1.5,
                    color: 'rgba(17,17,17,0.78)',
                    marginBottom: '24px',
                  }}
                >
                  {item.desc}
                </p>

                {/* List */}
                <ul
                  style={{
                    marginTop: 'auto',
                    borderTop: '1px dashed rgba(17,17,17,0.30)',
                    paddingTop: '16px',
                    listStyle: 'none',
                    padding: 0,
                    marginBottom: 0,
                  }}
                >
                  {item.details.split(' · ').map((detail, i) => (
                    <li
                      key={i}
                      style={{
                        fontSize: '13px',
                        color: 'rgba(17,17,17,0.72)',
                        lineHeight: 1.55,
                        paddingTop: '6px',
                      }}
                    >
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section data-ab style={{ padding: 'clamp(56px,7vw,88px) var(--margin-x)' }}>
          <div style={{ maxWidth: '860px' }}>
            <h2
              className="ab-h"
              style={{
                fontFamily: 'var(--font-head)',
                fontWeight: 600,
                fontSize: 'clamp(32px,4.5vw,56px)',
                lineHeight: 1.0,
                letterSpacing: '-0.02em',
                color: '#111111',
                marginBottom: 'clamp(40px,5vw,56px)',
              }}
            >
              Common <em className="news">questions.</em>
            </h2>
            <div className="ab-card">
              <ServicesFaq items={faqs} />
            </div>
          </div>
        </section>

        <CtaSection para="Tell us what you are trying to figure out. We will come back within 24 hours, Monday to Friday, with an honest read on whether we are the right people to help, and which founder you would be working with." />

      </main>
      <Footer />
    </>
  )
}
