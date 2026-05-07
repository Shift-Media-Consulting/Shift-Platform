'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import Image from 'next/image'

const links = [
  { href: '/about',    label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/method',   label: 'The Method' },
  { href: '/team',     label: 'Team' },
]

export default function Nav() {
  const pathname = usePathname()
  const [scrolled, setScrolled]   = useState(false)
  const [introDone, setIntroDone] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    // Returning visitor — intro already played this session
    if (sessionStorage.getItem('sm-intro-v6')) {
      setIntroDone(true)
      return
    }
    // First visit — listen for the event IntroAnimation dispatches on completion
    const handler = () => setIntroDone(true)
    window.addEventListener('sm-intro-complete', handler)
    // Safety fallback in case something prevents the event firing
    const fallback = setTimeout(() => setIntroDone(true), 5000)
    return () => {
      window.removeEventListener('sm-intro-complete', handler)
      clearTimeout(fallback)
    }
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  useEffect(() => { setMobileOpen(false) }, [pathname])

  const transparent = !scrolled && !mobileOpen

  return (
    <>
      <style>{`
        /* Logo hover spin */
        .nav-logo-mark {
          transition: transform 0.85s cubic-bezier(0.65, 0, 0.35, 1);
          transform-origin: center center;
        }
        .nav-logo:hover .nav-logo-mark { transform: rotate(360deg); }

        /* Nav-link ticker animation */
        .nav-link {
          position: relative;
          display: inline-block;
          height: 24px;
          line-height: 24px;
          overflow: hidden;
          letter-spacing: -0.2px;
        }
        .nav-link__stack {
          display: flex;
          flex-direction: column;
          transition: transform 0.55s cubic-bezier(0.65, 0, 0.35, 1);
          will-change: transform;
        }
        .nav-link__row { display: block; height: 24px; }
        .nav-link:hover .nav-link__stack { transform: translateY(-24px); }
        .nav-link--active::after {
          content: '';
          position: absolute;
          left: 0; right: 0; bottom: 0;
          height: 2px;
          background-color: var(--cream);
          border-radius: 2px;
        }

        /* Burger lines */
        .burger-line {
          display: block;
          width: 24px;
          height: 2px;
          background-color: var(--cream);
          transition: transform 0.4s cubic-bezier(0.16,1,0.3,1), opacity 0.3s ease;
          border-radius: 2px;
        }
      `}</style>

      <nav
        className={[
          'fixed inset-x-0 top-0 z-[100] h-[72px] px-[var(--margin-x)]',
          'grid items-center grid-cols-[1fr_auto] md:grid-cols-[1fr_auto_1fr]',
          'transition-[background-color,backdrop-filter] duration-300',
        ].join(' ')}
        style={{
          backgroundColor: transparent ? 'transparent' : 'rgba(0,77,64,0.85)',
          backdropFilter: transparent ? 'none' : 'blur(14px)',
        }}
      >
        {/* Logo (left) */}
        <Link
          href="/"
          className="nav-logo flex items-center gap-3.5 justify-self-start no-underline"
          style={{
            opacity: introDone ? 1 : 0,
            transition: 'opacity 0.4s ease',
            pointerEvents: introDone ? 'auto' : 'none',
          }}
        >
          <span className="nav-logo-mark inline-flex">
            <Image src="/logo-mark.svg" alt="" width={29} height={26} priority />
          </span>
          <Image
            src="/wordmark-cream.svg"
            alt="shift.media"
            width={143}
            height={22}
            priority
            className="hidden sm:block"
          />
        </Link>

        {/* Desktop links (center) */}
        <div className="hidden md:flex items-center gap-11 justify-self-center">
          {links.map(link => {
            const active = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link font-bold text-[17px] text-cream no-underline pb-1${active ? ' nav-link--active' : ''}`}
                style={{ fontFamily: 'var(--font-head)' }}
              >
                <span className="nav-link__stack">
                  <span className="nav-link__row">{link.label}</span>
                  <span className="nav-link__row">{link.label}</span>
                </span>
              </Link>
            )
          })}
        </div>

        {/* Desktop CTA (right) — pill + lift */}
        <Link
          href="/contact"
          className={[
            'hidden md:inline-flex items-center gap-2 justify-self-end',
            'rounded-full bg-cream text-teal font-bold text-[15px] tracking-[0.2px]',
            'px-7 py-3.5 no-underline',
            'shadow-[0_4px_14px_rgba(0,0,0,0.14)]',
            'transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
            'hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(0,0,0,0.22)] hover:bg-cream-soft',
          ].join(' ')}
          style={{ fontFamily: 'var(--font-head)' }}
        >
          <span>Get in touch</span>
          <span aria-hidden="true" className="transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:translate-x-1">›</span>
        </Link>

        {/* Mobile burger (right) */}
        <button
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden justify-self-end flex flex-col items-end gap-1.5 p-2 -mr-2 bg-transparent border-0 cursor-pointer"
        >
          <span className="burger-line" style={{ transform: mobileOpen ? 'translateY(8px) rotate(45deg)' : 'none' }} />
          <span className="burger-line" style={{ opacity: mobileOpen ? 0 : 1 }} />
          <span className="burger-line" style={{ transform: mobileOpen ? 'translateY(-8px) rotate(-45deg)' : 'none' }} />
        </button>
      </nav>

      {/* Mobile menu overlay */}
      <div
        className="md:hidden fixed inset-0 z-[99] flex flex-col pt-[72px]"
        style={{
          background: 'linear-gradient(180deg, #004d40 0%, #00695c 35%, #00897b 75%, #b9d8d2 100%)',
          transform: mobileOpen ? 'translateY(0)' : 'translateY(-100%)',
          transition: 'transform 0.55s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <div className="flex flex-col items-start gap-8 px-8 pt-12 flex-1">
          {links.map(link => {
            const active = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className="font-bold tracking-[-1.5px] no-underline leading-[1] text-cream"
                style={{
                  fontFamily: 'var(--font-head)',
                  fontSize: 'clamp(36px, 9vw, 56px)',
                  opacity: active ? 1 : 0.85,
                }}
              >
                {link.label}
              </Link>
            )
          })}
        </div>

        <div className="px-8 pb-12 flex flex-col gap-5">
          <a
            href="mailto:hello@shift-media.io"
            className="text-ink no-underline text-[12px] tracking-[1.5px] opacity-60"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            HELLO@SHIFT-MEDIA.IO
          </a>
          <Link
            href="/contact"
            className={[
              'block text-center rounded-full bg-ink text-cream font-bold text-[16px]',
              'px-8 py-5 no-underline tracking-[0.2px]',
              'transition-transform duration-300 active:scale-95',
            ].join(' ')}
            style={{ fontFamily: 'var(--font-head)' }}
          >
            Get in touch ›
          </Link>
        </div>
      </div>
    </>
  )
}
