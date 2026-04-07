import Nav from '@/components/marketing/Nav'
import Footer from '@/components/marketing/Footer'
import Link from 'next/link'

export const metadata = {
  title: 'SHIFT.MEDIA — Independent Production Advisory',
  description: 'Independent production advisory for brands and agencies. Hamburg, DE.',
}

export default function Home() {
  return (
    <>
      <Nav />
      <main style={{ fontFamily: "'Poppins', Calibri, Arial, sans-serif" }}>

        {/* Hero */}
        <section style={{
          backgroundColor: '#111111',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          padding: '120px 56px 80px',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute',
            right: '-20px',
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: '560px',
            fontWeight: 700,
            color: '#00897B',
            opacity: 0.06,
            lineHeight: 1,
            userSelect: 'none',
            pointerEvents: 'none',
          }}>›</div>

          <div style={{ maxWidth: '720px', position: 'relative', zIndex: 1 }}>
            <p style={{
              fontSize: '11px',
              fontWeight: 700,
              color: '#00897B',
              letterSpacing: '2.5px',
              textTransform: 'uppercase',
              marginBottom: '40px',
            }}>
              Independent Production Advisory · Hamburg, DE
            </p>
            <h1 style={{
              fontSize: 'clamp(40px, 5.5vw, 72px)',
              fontWeight: 700,
              color: '#FFFFFF',
              lineHeight: 1.05,
              marginBottom: '36px',
              letterSpacing: '-1px',
            }}>
              Everyone in the room<br />
              has an agenda.<br />
              <span style={{ color: '#00897B' }}>We&nbsp;don&apos;t.</span>
            </h1>
            <p style={{
              fontSize: '17px',
              color: '#777777',
              lineHeight: 1.75,
              maxWidth: '480px',
              marginBottom: '52px',
            }}>
              SHIFT MEDIA advises brands and agencies on production —
              independently, transparently, and always on the client side.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <Link href="/services" style={{
                backgroundColor: '#00897B',
                color: '#FFFFFF',
                padding: '14px 32px',
                borderRadius: '4px',
                fontSize: '13px',
                fontWeight: 700,
                textDecoration: 'none',
                letterSpacing: '0.3px',
              }}>
                What we do ›
              </Link>
              <Link href="/contact" style={{
                backgroundColor: 'transparent',
                color: '#FFFFFF',
                padding: '14px 32px',
                borderRadius: '4px',
                fontSize: '13px',
                fontWeight: 700,
                textDecoration: 'none',
                letterSpacing: '0.3px',
                border: '1px solid #2a2a2a',
              }}>
                Get in touch
              </Link>
            </div>
          </div>
        </section>

        {/* Who / Why / What */}
        <section style={{ backgroundColor: '#F6F5F2', padding: '96px 56px' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2px' }}>
            {[
              {
                label: 'Who we are',
                body: 'An independent production advisory firm. No agency ties. No supplier relationships. We are paid only by the clients we represent.',
                link: { href: '/about', text: 'About us' },
              },
              {
                label: 'Why we exist',
                body: "The brand–agency–production triangle has built-in conflicts of interest. Brands are the only party with no one in their corner — until now.",
                link: { href: '/about', text: 'Our story' },
              },
              {
                label: 'What we do',
                body: 'Production controlling, bid management, strategic advisory, organisational design, and AI integration — across the full production lifecycle.',
                link: { href: '/services', text: 'Our services' },
              },
            ].map(item => (
              <div key={item.label} style={{
                backgroundColor: '#FFFFFF',
                padding: '40px 36px',
                borderTop: '3px solid #00897B',
              }}>
                <p style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#00897B',
                  letterSpacing: '1.5px',
                  textTransform: 'uppercase',
                  marginBottom: '20px',
                }}>{item.label}</p>
                <p style={{
                  fontSize: '14px',
                  color: '#555555',
                  lineHeight: 1.75,
                  marginBottom: '28px',
                }}>{item.body}</p>
                <Link href={item.link.href} style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#00897B',
                  textDecoration: 'none',
                  letterSpacing: '0.3px',
                }}>
                  {item.link.text} ›
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* CTA strip */}
        <section style={{ backgroundColor: '#00897B', padding: '64px 56px' }}>
          <div style={{
            maxWidth: '1100px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '24px',
          }}>
            <p style={{ fontSize: '22px', fontWeight: 700, color: '#FFFFFF' }}>
              Before you brief your next production — talk to us.
            </p>
            <Link href="/contact" style={{
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
