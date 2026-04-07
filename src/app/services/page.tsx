import Nav from '@/components/marketing/Nav'
import Footer from '@/components/marketing/Footer'
import Link from 'next/link'

export const metadata = {
  title: 'Services — SHIFT.MEDIA',
  description: 'Production advisory, bid management, buyout consulting, and cost auditing for brands and agencies.',
}

const services = [
  {
    number: '01',
    title: 'Production Controlling',
    summary: 'Cost intelligence and real-time visibility across every production.',
    detail: 'We take ownership of the numbers so your team can focus on the work. From initial budget development through final reconciliation, we ensure costs are tracked, variance is explained, and overspend is caught early — not at wrap.',
    items: [
      'Budget development and management',
      'Cost plan review and challenge',
      'Vendor and supplier negotiation',
      'Real-time cost reporting',
      'Variance analysis and forecasting',
      'Final cost reconciliation',
      'Buyout and usage rights management',
    ],
    forWhom: 'Brands and agencies commissioning TVC, content, or campaign production.',
  },
  {
    number: '02',
    title: 'Strategic Advisory',
    summary: 'Shaping how brands and agencies commission and manage content at scale.',
    detail: 'Strategic questions need honest answers — not answers shaped by who is in the room. We provide independent counsel on production strategy, roster decisions, format planning, and international structure.',
    items: [
      'Production strategy development',
      'Director and production company roster advisory',
      'Format and channel planning',
      'Sustainable production strategy',
      'International production structures',
      'Risk assessment and mitigation',
    ],
    forWhom: 'Brands planning annual production programmes. Agencies building advisory credentials.',
  },
  {
    number: '03',
    title: 'Organisational Design & Studio Builds',
    summary: 'Building the production capability organisations need — from the ground up.',
    detail: 'Whether you are insourcing for the first time, restructuring an underperforming department, or building a new studio from scratch, we design the structure, define the roles, and support the build.',
    items: [
      'In-house production department design',
      'Agency production function builds',
      'Content studio design and launch',
      'VFX, post-production, and AI studio builds',
      'Capability audits and gap analysis',
      'Recruitment and team structure advisory',
    ],
    forWhom: 'Brands insourcing production. Agencies building or fixing production departments.',
  },
  {
    number: '04',
    title: 'AI Integration & Transformation',
    summary: 'Practical AI adoption in production — with governance and measurable results.',
    detail: 'AI is already changing how production works. We help brands and agencies understand where it creates genuine value, where it creates risk, and how to integrate it in a way that is practical, governed, and real.',
    items: [
      'AI readiness audit',
      'Tool selection and workflow integration',
      'Team training and upskilling',
      'Ethics framework and governance',
      'Pilot project design and delivery',
      'Ongoing optimisation and review',
    ],
    forWhom: 'Any organisation navigating AI adoption in creative and production workflows.',
  },
]

export default function ServicesPage() {
  return (
    <>
      <Nav />
      <main style={{ fontFamily: "'Poppins', Calibri, Arial, sans-serif", paddingTop: '64px' }}>

        {/* Page header */}
        <section style={{ backgroundColor: '#111111', padding: '80px 56px' }}>
          <p style={{
            fontSize: '11px',
            fontWeight: 700,
            color: '#00897B',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            marginBottom: '16px',
          }}>Services</p>
          <h1 style={{
            fontSize: 'clamp(32px, 4vw, 52px)',
            fontWeight: 700,
            color: '#FFFFFF',
            lineHeight: 1.1,
            maxWidth: '640px',
            marginBottom: '20px',
          }}>
            Four disciplines. One clear mandate.
          </h1>
          <p style={{ fontSize: '16px', color: '#888888', maxWidth: '480px', lineHeight: 1.7 }}>
            Independent advisory for brands and agencies — across cost, strategy, structure, and technology.
          </p>
        </section>

        {/* Services */}
        {services.map((service, i) => (
          <section key={service.number} style={{
            backgroundColor: i % 2 === 0 ? '#F6F5F2' : '#FFFFFF',
            padding: '80px 56px',
            borderBottom: '1px solid #DDDDDD',
          }}>
            <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '64px' }}>
              <div>
                <p style={{ fontSize: '11px', fontWeight: 700, color: '#00897B', letterSpacing: '2px', marginBottom: '12px' }}>{service.number}</p>
                <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#111111', lineHeight: 1.2, marginBottom: '16px' }}>{service.title}</h2>
                <p style={{ fontSize: '14px', color: '#888888', lineHeight: 1.6, marginBottom: '20px' }}>{service.summary}</p>
                <div style={{ padding: '16px 20px', backgroundColor: '#E8F5F3', borderRadius: '4px' }}>
                  <p style={{ fontSize: '11px', fontWeight: 700, color: '#00695C', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '4px' }}>For</p>
                  <p style={{ fontSize: '12px', color: '#00695C', lineHeight: 1.5 }}>{service.forWhom}</p>
                </div>
              </div>
              <div>
                <p style={{ fontSize: '15px', color: '#555555', lineHeight: 1.8, marginBottom: '32px' }}>{service.detail}</p>
                <div style={{ borderTop: '1px solid #DDDDDD', paddingTop: '24px' }}>
                  <p style={{ fontSize: '11px', fontWeight: 700, color: '#888888', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '16px' }}>
                    What this includes
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 32px' }}>
                    {service.items.map(item => (
                      <div key={item} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                        <span style={{ color: '#00897B', fontWeight: 700, flexShrink: 0, marginTop: '1px' }}>›</span>
                        <p style={{ fontSize: '13px', color: '#555555', lineHeight: 1.5 }}>{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        ))}

        {/* CTA */}
        <section style={{ backgroundColor: '#00897B', padding: '80px 56px' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '32px' }}>
            <div>
              <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#FFFFFF', marginBottom: '8px' }}>
                Not sure which service fits?
              </h2>
              <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.75)' }}>
                Most engagements start with a conversation. Tell us what you're dealing with.
              </p>
            </div>
            <Link href="/contact" style={{
              display: 'inline-block',
              backgroundColor: '#FFFFFF',
              color: '#00897B',
              padding: '14px 32px',
              borderRadius: '4px',
              fontSize: '13px',
              fontWeight: 700,
              textDecoration: 'none',
              whiteSpace: 'nowrap',
            }}>
              Start a conversation ›
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
