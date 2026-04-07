import Nav from '@/components/marketing/Nav'
import Footer from '@/components/marketing/Footer'
import Link from 'next/link'

export const metadata = {
  title: 'Team — SHIFT.MEDIA',
  description: 'The people behind SHIFT MEDIA.',
}

export default function TeamPage() {
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
          }}>Team</p>
          <h1 style={{
            fontSize: 'clamp(32px, 4vw, 52px)',
            fontWeight: 700,
            color: '#FFFFFF',
            lineHeight: 1.1,
            maxWidth: '640px',
            marginBottom: '20px',
          }}>
            Built by people who have done this work.
          </h1>
          <p style={{ fontSize: '16px', color: '#888888', maxWidth: '480px', lineHeight: 1.7 }}>
            Between us, we have been inside productions — not just advising on them.
            That is the difference.
          </p>
        </section>

        {/* Founders */}
        <section style={{ backgroundColor: '#F6F5F2', padding: '80px 56px' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>

              {/* Justin */}
              <div style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #DDDDDD',
                borderRadius: '4px',
                padding: '48px 40px',
              }}>
                <div style={{ width: '48px', height: '4px', backgroundColor: '#00897B', marginBottom: '28px' }} />
                <h2 style={{ fontSize: '26px', fontWeight: 700, color: '#111111', marginBottom: '6px' }}>
                  Justin Stiebel
                </h2>
                <p style={{ fontSize: '12px', fontWeight: 700, color: '#00897B', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '28px' }}>
                  Co-Founder · Production Controlling & Advisory
                </p>
                <p style={{ fontSize: '15px', color: '#555555', lineHeight: 1.8, marginBottom: '20px' }}>
                  Production controlling and advisory specialist with deep market knowledge
                  across German and European TVC, content, and campaign production.
                </p>
                <p style={{ fontSize: '15px', color: '#555555', lineHeight: 1.8, marginBottom: '20px' }}>
                  Has built and managed production budgets across formats — from small social
                  campaigns to large-scale international shoots. Specialist in the German market:
                  its rates, its production companies, its directors, and its dynamics.
                </p>
                <p style={{ fontSize: '15px', color: '#555555', lineHeight: 1.8, marginBottom: '32px' }}>
                  Brings a rigorous, numbers-first approach to advisory work — always grounded
                  in what production actually costs, not what it's quoted at.
                </p>
                <div style={{ borderTop: '1px solid #EEEEEE', paddingTop: '24px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {['Production Controlling', 'Budget Management', 'TVC', 'German Market', 'Vendor Negotiation'].map(tag => (
                    <span key={tag} style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      color: '#888888',
                      backgroundColor: '#F6F5F2',
                      padding: '4px 10px',
                      borderRadius: '2px',
                      letterSpacing: '0.3px',
                    }}>{tag}</span>
                  ))}
                </div>
                <div style={{ marginTop: '24px' }}>
                  <a href="mailto:justin@shift-media.org" style={{
                    fontSize: '13px',
                    color: '#00897B',
                    fontWeight: 700,
                    textDecoration: 'none',
                  }}>
                    justin@shift-media.org ›
                  </a>
                </div>
              </div>

              {/* Cornelius */}
              <div style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #DDDDDD',
                borderRadius: '4px',
                padding: '48px 40px',
              }}>
                <div style={{ width: '48px', height: '4px', backgroundColor: '#00897B', marginBottom: '28px' }} />
                <h2 style={{ fontSize: '26px', fontWeight: 700, color: '#111111', marginBottom: '6px' }}>
                  Cornelius Roenz
                </h2>
                <p style={{ fontSize: '12px', fontWeight: 700, color: '#00897B', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '28px' }}>
                  Co-Founder · Strategy & Organisational Design
                </p>
                <p style={{ fontSize: '15px', color: '#555555', lineHeight: 1.8, marginBottom: '20px' }}>
                  Production leader with extensive experience building and running production
                  functions at agency and brand level across Europe.
                </p>
                <p style={{ fontSize: '15px', color: '#555555', lineHeight: 1.8, marginBottom: '20px' }}>
                  Has designed and implemented production departments, led organisational
                  transformation, and advised on international production structures.
                  Experience spans Hamburg, London, Dubai, and wider European markets.
                </p>
                <p style={{ fontSize: '15px', color: '#555555', lineHeight: 1.8, marginBottom: '32px' }}>
                  Specialist in sustainable production strategy, emerging content formats,
                  and the structural challenges facing agencies as the market shifts.
                </p>
                <div style={{ borderTop: '1px solid #EEEEEE', paddingTop: '24px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {['Strategy', 'Org Design', 'Agency Structure', 'Sustainable Production', 'AI Integration'].map(tag => (
                    <span key={tag} style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      color: '#888888',
                      backgroundColor: '#F6F5F2',
                      padding: '4px 10px',
                      borderRadius: '2px',
                      letterSpacing: '0.3px',
                    }}>{tag}</span>
                  ))}
                </div>
                <div style={{ marginTop: '24px' }}>
                  <a href="mailto:cornelius@shift-media.org" style={{
                    fontSize: '13px',
                    color: '#00897B',
                    fontWeight: 700,
                    textDecoration: 'none',
                  }}>
                    cornelius@shift-media.org ›
                  </a>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* How we work together */}
        <section style={{ backgroundColor: '#FFFFFF', padding: '80px 56px' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <p style={{
              fontSize: '11px',
              fontWeight: 700,
              color: '#00897B',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              marginBottom: '16px',
            }}>Our model</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px' }}>
              <div>
                <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#111111', marginBottom: '20px', lineHeight: 1.2 }}>
                  Small by design. Senior by default.
                </h2>
                <p style={{ fontSize: '15px', color: '#555555', lineHeight: 1.8, marginBottom: '20px' }}>
                  We are not a large consultancy with junior teams and senior oversight.
                  Every engagement is led and delivered by one of the founders.
                  You get the people you spoke to in the pitch.
                </p>
                <p style={{ fontSize: '15px', color: '#555555', lineHeight: 1.8 }}>
                  This is intentional. Our value comes from experience and judgement —
                  not from scale.
                </p>
              </div>
              <div>
                <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#111111', marginBottom: '20px', lineHeight: 1.2 }}>
                  Extended network. Vetted.
                </h2>
                <p style={{ fontSize: '15px', color: '#555555', lineHeight: 1.8, marginBottom: '20px' }}>
                  For larger programmes or specialist requirements, we draw on a curated network
                  of senior production professionals across Europe — all vetted personally,
                  all working to our standards.
                </p>
                <p style={{ fontSize: '15px', color: '#555555', lineHeight: 1.8 }}>
                  No subcontracting to unknown parties. No hand-offs without disclosure.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={{ backgroundColor: '#111111', padding: '80px 56px' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '32px' }}>
            <div>
              <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#FFFFFF', marginBottom: '8px' }}>
                Want to speak to us directly?
              </h2>
              <p style={{ fontSize: '15px', color: '#888888' }}>
                We are always open for a first conversation.
              </p>
            </div>
            <Link href="/contact" style={{
              display: 'inline-block',
              backgroundColor: '#00897B',
              color: '#FFFFFF',
              padding: '14px 32px',
              borderRadius: '4px',
              fontSize: '13px',
              fontWeight: 700,
              textDecoration: 'none',
              whiteSpace: 'nowrap',
            }}>
              Get in touch ›
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
