'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const links = [
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/team', label: 'Team' },
  { href: '/contact', label: 'Contact' },
]

export default function Nav() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      backgroundColor: 'rgba(246,245,242,0.95)',
      backdropFilter: 'blur(8px)',
      borderBottom: '1px solid #DDDDDD',
      padding: '0 56px',
      height: '64px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      fontFamily: "'Poppins', Calibri, Arial, sans-serif",
    }}>
      {/* Wordmark */}
      <Link href="/" style={{ textDecoration: 'none', fontSize: '17px' }}>
        <span style={{ fontWeight: 700, color: '#111111' }}>SHIFT</span>
        <span style={{ fontWeight: 700, color: '#00897B' }}>.</span>
        <span style={{ fontWeight: 400, color: '#111111' }}>MEDIA</span>
      </Link>

      {/* Links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '36px' }}>
        {links.map(link => (
          <Link key={link.href} href={link.href} style={{
            fontSize: '13px',
            fontWeight: pathname === link.href ? 700 : 400,
            color: pathname === link.href ? '#00897B' : '#555555',
            textDecoration: 'none',
            letterSpacing: '0.2px',
            transition: 'color 0.15s',
          }}>
            {link.label}
          </Link>
        ))}

        {/* Login CTA */}
        <Link href="/login" style={{
          fontSize: '13px', fontWeight: 700,
          backgroundColor: '#00897B', color: '#FFFFFF',
          padding: '8px 20px', borderRadius: '4px',
          textDecoration: 'none', letterSpacing: '0.3px',
          whiteSpace: 'nowrap',
        }}>
          Platform Login ›
        </Link>
      </div>
    </nav>
  )
}
