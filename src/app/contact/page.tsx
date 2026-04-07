import Nav from '@/components/marketing/Nav'
import Footer from '@/components/marketing/Footer'

export const metadata = {
  title: 'Contact — SHIFT.MEDIA',
  description: 'Get in touch with SHIFT MEDIA.',
}

export default function ContactPage() {
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
          }}>Contact</p>
          <h1 style={{
            fontSize: 'clamp(32px, 4vw, 52px)',
            fontWeight: 700,
            color: '#FFFFFF',
            lineHeight: 1.1,
            maxWidth: '640px',
            marginBottom: '20px',
          }}>
            The first conversation is free.
          </h1>
          <p style={{ fontSize: '16px', color: '#888888', maxWidth: '480px', lineHeight: 1.7 }}>
            Tell us what you're dealing with. No commitment required.
          </p>
        </section>

        {/* Contact content */}
        <section style={{ backgroundColor: '#F6F5F2', padding: '80px 56px' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px' }}>

            {/* Left — contact details */}
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#111111', marginBottom: '32px' }}>
                Reach us directly
              </h2>

              <div style={{ marginBottom: '40px' }}>
                <div style={{ marginBottom: '24px' }}>
                  <p style={{ fontSize: '11px', fontWeight: 700, color: '#888888', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '6px' }}>
                    Justin Stiebel
                  </p>
                  <p style={{ fontSize: '13px', color: '#555555', marginBottom: '4px' }}>
                    Co-Founder · Production Controlling & Advisory
                  </p>
                  <a href="mailto:justin@shift-media.org" style={{
                    fontSize: '15px',
                    color: '#00897B',
                    fontWeight: 700,
                    textDecoration: 'none',
                    display: 'block',
                    marginTop: '8px',
                  }}>
                    justin@shift-media.org ›
                  </a>
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <p style={{ fontSize: '11px', fontWeight: 700, color: '#888888', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '6px' }}>
                    Cornelius Roenz
                  </p>
                  <p style={{ fontSize: '13px', color: '#555555', marginBottom: '4px' }}>
                    Co-Founder · Strategy & Organisational Design
                  </p>
                  <a href="mailto:cornelius@shift-media.org" style={{
                    fontSize: '15px',
                    color: '#00897B',
                    fontWeight: 700,
                    textDecoration: 'none',
                    display: 'block',
                    marginTop: '8px',
                  }}>
                    cornelius@shift-media.org ›
                  </a>
                </div>
              </div>

              <div style={{ borderTop: '1px solid #DDDDDD', paddingTop: '32px' }}>
                <p style={{ fontSize: '11px', fontWeight: 700, color: '#888888', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Location
                </p>
                <p style={{ fontSize: '15px', color: '#555555', lineHeight: 1.6 }}>
                  Hamburg, Germany<br />
                  Serving clients across Europe
                </p>
              </div>

              <div style={{ borderTop: '1px solid #DDDDDD', marginTop: '32px', paddingTop: '32px' }}>
                <p style={{ fontSize: '11px', fontWeight: 700, color: '#888888', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Website
                </p>
                <p style={{ fontSize: '15px', color: '#555555' }}>
                  www.shift-media.org
                </p>
              </div>
            </div>

            {/* Right — what to expect */}
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#111111', marginBottom: '32px' }}>
                What happens when you reach out
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {[
                  {
                    step: '01',
                    title: 'You send us a brief message',
                    body: "Tell us who you are, what you're working on, and what challenge you're trying to solve. A few sentences is enough.",
                  },
                  {
                    step: '02',
                    title: 'We respond within 24 hours',
                    body: 'We will come back to you promptly — usually on the same day — with either a direct response or a request for a short call.',
                  },
                  {
                    step: '03',
                    title: 'We have an initial conversation',
                    body: 'A 30-minute call to understand the situation properly. No pitch. No obligation. Just an honest conversation about whether and how we can help.',
                  },
                  {
                    step: '04',
                    title: 'We propose an approach',
                    body: 'If there is a fit, we will outline what an engagement could look like — scope, structure, and cost — within a few days of the call.',
                  },
                ].map(item => (
                  <div key={item.step} style={{
                    backgroundColor: '#FFFFFF',
                    padding: '24px 28px',
                    borderLeft: '3px solid #00897B',
                  }}>
                    <p style={{ fontSize: '10px', fontWeight: 700, color: '#00897B', letterSpacing: '1.5px', marginBottom: '8px' }}>
                      {item.step}
                    </p>
                    <p style={{ fontSize: '14px', fontWeight: 700, color: '#111111', marginBottom: '6px' }}>
                      {item.title}
                    </p>
                    <p style={{ fontSize: '13px', color: '#777777', lineHeight: 1.6 }}>
                      {item.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* Bottom note */}
        <section style={{ backgroundColor: '#FFFFFF', padding: '48px 56px', borderTop: '1px solid #DDDDDD' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <p style={{ fontSize: '13px', color: '#888888', lineHeight: 1.7, maxWidth: '640px' }}>
              We work with brands and agencies across Europe. We do not work with production companies
              as advisory clients — our independence depends on it. If you are a production company
              looking for a commercial relationship, we are not the right fit.
            </p>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
