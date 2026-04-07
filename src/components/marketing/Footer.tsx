import Link from 'next/link'

export default function Footer() {
  return (
    <footer style={{
      backgroundColor: '#111111',
      borderTop: '1px solid #1a1a1a',
      padding: '48px 56px',
      fontFamily: "'Poppins', Calibri, Arial, sans-serif",
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
        <div>
          <p style={{ fontSize: '17px', marginBottom: '12px' }}>
            <span style={{ fontWeight: 700, color: '#FFFFFF' }}>SHIFT</span>
            <span style={{ fontWeight: 700, color: '#00897B' }}>.</span>
            <span style={{ fontWeight: 400, color: '#FFFFFF' }}>MEDIA</span>
          </p>
          <p style={{ fontSize: '13px', color: '#555555' }}>Independent Production Advisory · Hamburg, DE</p>
        </div>
        <div style={{ display: 'flex', gap: '32px' }}>
          {[
            { href: '/about', label: 'About' },
            { href: '/services', label: 'Services' },
            { href: '/team', label: 'Team' },
            { href: '/contact', label: 'Contact' },
          ].map(link => (
            <Link key={link.href} href={link.href} style={{ fontSize: '13px', color: '#555555', textDecoration: 'none' }}>
              {link.label}
            </Link>
          ))}
        </div>
      </div>
      <div style={{ borderTop: '1px solid #1a1a1a', paddingTop: '24px', display: 'flex', justifyContent: 'space-between' }}>
        <p style={{ fontSize: '12px', color: '#333333' }}>© 2026 SHIFT MEDIA GmbH. All rights reserved.</p>
        <p style={{ fontSize: '12px', color: '#333333' }}>www.shift-media.org</p>
      </div>
    </footer>
  )
}
