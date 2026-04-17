'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: '▤' },
  { href: '/admin/clients', label: 'Clients', icon: '◎' },
  { href: '/admin/projects', label: 'Projects', icon: '◈' },
  { href: '/admin/partners', label: 'Partners', icon: '◇' },
  { href: '/admin/buyouts', label: 'Buyouts', icon: '◑' },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin'
    return pathname.startsWith(href)
  }

  return (
    <aside style={{
      width: '220px',
      minHeight: '100vh',
      backgroundColor: '#111111',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      fontFamily: "'Poppins', Calibri, Arial, sans-serif",
    }}>
      {/* Wordmark */}
      <div style={{
        height: '56px',
        display: 'flex',
        alignItems: 'center',
        padding: '0 24px',
        borderBottom: '1px solid #1f1f1f',
      }}>
        <Link href="/admin" style={{ textDecoration: 'none', fontSize: '15px' }}>
          <span style={{ fontWeight: 700, color: '#FFFFFF' }}>SHIFT</span>
          <span style={{ fontWeight: 700, color: '#00897B' }}>.</span>
          <span style={{ fontWeight: 400, color: '#FFFFFF' }}>MEDIA</span>
        </Link>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '16px 0' }}>
        <p style={{
          fontSize: '9px',
          fontWeight: 700,
          color: '#444444',
          letterSpacing: '1.5px',
          textTransform: 'uppercase',
          padding: '0 24px',
          marginBottom: '8px',
        }}>Platform</p>
        {navItems.map(item => (
          <Link key={item.href} href={item.href} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '9px 24px',
            fontSize: '13px',
            fontWeight: isActive(item.href) ? 700 : 400,
            color: isActive(item.href) ? '#FFFFFF' : '#777777',
            textDecoration: 'none',
            backgroundColor: isActive(item.href) ? '#1a1a1a' : 'transparent',
            borderLeft: isActive(item.href) ? '3px solid #00897B' : '3px solid transparent',
            transition: 'all 0.1s',
          }}>
            <span style={{ fontSize: '11px', color: isActive(item.href) ? '#00897B' : '#555555' }}>
              {item.icon}
            </span>
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Bottom */}
      <div style={{
        padding: '16px 24px',
        borderTop: '1px solid #1f1f1f',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
      }}>
        {/* Client view toggle */}
        <Link href="/client" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 12px',
          backgroundColor: '#003D35',
          border: '1px solid #00897B44',
          borderRadius: '4px',
          fontSize: '12px',
          fontWeight: 700,
          color: '#00897B',
          textDecoration: 'none',
        }}>
          <span style={{ fontSize: '13px' }}>◉</span>
          Client View
        </Link>
        <Link href="/" style={{
          fontSize: '11px',
          color: '#444444',
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}>
          ‹ Back to site
        </Link>
      </div>
    </aside>
  )
}
