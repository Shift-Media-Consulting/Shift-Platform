import Nav from '@/components/marketing/Nav'
import Footer from '@/components/marketing/Footer'
import Link from 'next/link'

export const metadata = {
  title: 'About — SHIFT.MEDIA',
  description: 'Who we are and why we built SHIFT MEDIA.',
}

export default function AboutPage() {
  return (
    <>
      <Nav />
      <main style={{ fontFamily: "'Poppins', Calibri, Arial, sans-serif", paddingTop: '64px' }}>

        {/* Page header */}
        <section style={{
          backgroundColor: '#111111',
          padding: '80px 56px',
        }}>
          <p style={{
            fontSize: '11px',
            fontWeight: 700,
            color: '#00897B',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            marginBottom: '16px',
          }}>About</p>
          <h1 style={{
            fontSize: 'clamp(32px, 4vw, 52px)',
            fontWeight: 700,
            color: '#FFFFFF',
            lineHeight: 1.1,
            maxWidth: '640px',
          }}>
            We exist because the system has a structural problem.
          </h1>
        </section>

        {/* Origin */}
        <section style={{ backgroundColor: '#F6F5F2', padding: '80px 56px' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px' }}>
            <div>
              <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#111111', marginBottom: '24px', lineHeight: 1.2 }}>
                The problem we set out to solve
              </h2>
              <p style={{ fontSize: '15px', color: '#555555', lineHeight: 1.8, marginBottom: '20px' }}>
                The brand–agency–production company triangle has built-in conflicts of interest.
                Agencies earn from the production companies they recommend.
                Production companies protect the relationships that feed them.
              </p>
              <p style={{ fontSize: '15px', color: '#555555', lineHeight: 1.8, marginBottom: '20px' }}>
                Brands are the only party with no one independently in their corner.
                They commission billions of euros of production each year — and most of them
                have no way to know whether the costs they're being shown are fair.
              </p>
              <p style={{ fontSize: '15px', color: '#555555', lineHeight: 1.8 }}>
                We built SHIFT MEDIA to change that. Our advice is structurally independent:
                no supplier relationships, no agency retainers, no referral fees.
                We are only ever paid by the client we represent.
              </p>
            </div>
            <div>
              <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#111111', marginBottom: '24px', lineHeight: 1.2 }}>
                Why now
              </h2>
              <p style={{ fontSize: '15px', color: '#555555', lineHeight: 1.8, marginBottom: '20px' }}>
                The production landscape is changing faster than the industry can adapt.
                AI is creating new workflows and eliminating others. Content volumes are rising.
                Budgets are under pressure. Teams are being restructured.
              </p>
              <p style={{ fontSize: '15px', color: '#555555', lineHeight: 1.8, marginBottom: '20px' }}>
                In this environment, independent expertise — grounded in how production
                actually works, not how it's sold — is more valuable than ever.
              </p>
              <p style={{ fontSize: '15px', color: '#555555', lineHeight: 1.8 }}>
                SHIFT MEDIA combines production advisory with a technology platform
                built for the way production is commissioned today.
              </p>
            </div>
          </div>
        </section>

        {/* Values */}
        <section style={{ backgroundColor: '#FFFFFF', padding: '80px 56px' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <p style={{
              fontSize: '11px',
              fontWeight: 700,
              color: '#00897B',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              marginBottom: '16px',
            }}>How we work</p>
            <h2 style={{ fontSize: '32px', fontWeight: 700, color: '#111111', marginBottom: '48px' }}>
              Three principles. Non-negotiable.
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2px' }}>
              {[
                {
                  title: 'Independence',
                  body: 'We hold no commercial relationships with production companies, studios, or post houses. Our advice cannot be influenced by who we benefit from recommending.',
                },
                {
                  title: 'Transparency',
                  body: 'Every recommendation we make comes with our reasoning. Every cost we challenge, we can justify. You see everything we see.',
                },
                {
                  title: 'Accountability',
                  body: 'We are measured on outcomes — cost savings achieved, decisions improved, risks avoided. Not on hours billed or reports filed.',
                },
              ].map(item => (
                <div key={item.title} style={{
                  backgroundColor: '#F6F5F2',
                  padding: '40px 32px',
                  borderTop: '3px solid #00897B',
                }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#111111', marginBottom: '16px' }}>{item.title}</h3>
                  <p style={{ fontSize: '14px', color: '#555555', lineHeight: 1.7 }}>{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={{ backgroundColor: '#111111', padding: '80px 56px' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '32px' }}>
            <div>
              <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#FFFFFF', marginBottom: '8px' }}>
                Want to know more?
              </h2>
              <p style={{ fontSize: '15px', color: '#888888' }}>Read about what we do or get in touch directly.</p>
            </div>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <Link href="/services" style={{
                display: 'inline-block',
                backgroundColor: '#00897B',
                color: '#FFFFFF',
                padding: '14px 28px',
                borderRadius: '4px',
                fontSize: '13px',
                fontWeight: 700,
                textDecoration: 'none',
              }}>Our services ›</Link>
              <Link href="/contact" style={{
                display: 'inline-block',
                backgroundColor: 'transparent',
                color: '#FFFFFF',
                padding: '14px 28px',
                borderRadius: '4px',
                fontSize: '13px',
                fontWeight: 700,
                textDecoration: 'none',
                border: '1px solid #333333',
              }}>Contact us</Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
