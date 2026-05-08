import Link from 'next/link'
import Image from 'next/image'
import { footerNavItems } from '@/lib/nav'

export default function Footer() {
  return (
    <footer
      className="px-8 sm:px-10 md:px-14 lg:px-20 xl:px-24 pt-12 md:pt-16 pb-8"
      style={{ backgroundColor: 'var(--teal)' }}
    >
      {/* Top row */}
      <div className="grid gap-10 md:gap-10 md:grid-cols-[1fr_auto_1fr] md:items-center mb-10 md:mb-14">
        {/* Brand */}
        <Link
          href="/"
          className="flex items-center gap-[14px] md:justify-self-start"
          style={{ textDecoration: 'none' }}
        >
          <Image src="/logo-mark.svg" alt="" width={29} height={26} />
          <Image src="/wordmark-cream.svg" alt="shift.media" width={143} height={22} />
        </Link>

        {/* Links */}
        <div className="flex flex-wrap gap-x-8 gap-y-3 md:gap-10 md:justify-self-center">
          {footerNavItems.map(link => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                fontFamily: 'var(--font-head)',
                fontWeight: 500,
                fontSize: '14px',
                color: 'rgba(246,245,242,0.7)',
                textDecoration: 'none',
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Email */}
        <a
          href="mailto:hello@shift-media.io"
          className="md:justify-self-end"
          style={{
            fontFamily: 'var(--font-head)',
            fontWeight: 500,
            fontSize: '14px',
            color: 'var(--cream)',
            textDecoration: 'none',
            letterSpacing: '0.1px',
          }}
        >
          hello@shift-media.io
        </a>
      </div>

      {/* Bottom row */}
      <div
        className="pt-6 flex flex-col md:flex-row md:justify-between gap-2"
        style={{ borderTop: '1px solid rgba(246,245,242,0.12)' }}
      >
        <p style={{
          fontFamily: 'var(--font-mono)',
          fontWeight: 400,
          fontSize: '11px',
          color: 'rgba(246,245,242,0.4)',
          letterSpacing: '0.5px',
        }}>
          © 2026 Shift Media GmbH. All rights reserved.
        </p>
        <p style={{
          fontFamily: 'var(--font-mono)',
          fontWeight: 400,
          fontSize: '11px',
          color: 'rgba(246,245,242,0.4)',
          letterSpacing: '1px',
        }}>
          INDEPENDENT PRODUCTION ADVISORY · HAMBURG, DE
        </p>
      </div>
    </footer>
  )
}
