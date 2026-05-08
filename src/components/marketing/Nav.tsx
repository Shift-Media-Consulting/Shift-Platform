'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { navItems, servicesDropdown } from '@/lib/nav'

export default function Nav() {
  const pathname = usePathname()
  const [scrolled, setScrolled]     = useState(false)
  const [introDone, setIntroDone]   = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false)
  const [dropOpen, setDropOpen]     = useState(false)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  /* ── Scroll ── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* ── Intro ── */
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (sessionStorage.getItem('sm-intro-v6')) { setIntroDone(true); return }
    const handler = () => setIntroDone(true)
    window.addEventListener('sm-intro-complete', handler)
    const fallback = setTimeout(() => setIntroDone(true), 5000)
    return () => { window.removeEventListener('sm-intro-complete', handler); clearTimeout(fallback) }
  }, [])

  /* ── Body lock ── */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  /* ── Close on route change ── */
  useEffect(() => { setMobileOpen(false); setMobileServicesOpen(false) }, [pathname])

  /*
   * isPill — true when the nav should show as a glass pill.
   * Includes dropOpen so hovering Services at the top of the page
   * collapses the nav into pill form first, then the dropdown
   * pockets beneath it as one continuous surface.
   */
  const isPill    = scrolled || (dropOpen && !mobileOpen)
  const transparent = !isPill && !mobileOpen

  /* Dropdown hover helpers — delay prevents flicker on diagonal mouse movement */
  const openDrop  = () => { if (closeTimer.current) clearTimeout(closeTimer.current); setDropOpen(true) }
  const closeDrop = () => { closeTimer.current = setTimeout(() => setDropOpen(false), 150) }

  const isServicesActive = pathname.startsWith('/services') || pathname.startsWith('/method')

  return (
    <>
      <style>{`
        .nav-logo-mark { transition: transform 0.85s cubic-bezier(0.65,0,0.35,1); transform-origin: center center; }
        .nav-logo:hover .nav-logo-mark { transform: rotate(360deg); }

        .nav-link { position: relative; display: inline-block; height: 24px; line-height: 24px; overflow: hidden; letter-spacing: -0.2px; }
        .nav-link__stack { display: flex; flex-direction: column; transition: transform 0.55s cubic-bezier(0.65,0,0.35,1); will-change: transform; }
        .nav-link__row { display: block; height: 24px; }
        .nav-link:hover .nav-link__stack { transform: translateY(-24px); }
        .nav-link--active::after { content:''; position:absolute; left:0; right:0; bottom:0; height:2px; background-color:var(--cream); border-radius:2px; }

        .burger-line { display:block; width:24px; height:2px; background-color:var(--cream); transition:transform 0.4s cubic-bezier(0.16,1,0.3,1), opacity 0.3s ease; border-radius:2px; }

        /*
         * Dropdown bubble — same glass as the nav pill.
         * In pill mode (scrolled): attaches flush to the nav bottom,
         * no top border, top corners are square → looks like the pill
         * grew a pocket just under Services (true Dynamic Island).
         * In transparent mode: floats with a gap + full rounding.
         */
        .svc-drop {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          min-width: 220px;
          display: flex;
          flex-direction: column;
          /* No backdrop-filter here — the nav's own blur context is already
             applied to this area. A second blur pass would create a denser
             seam at the junction. Slightly more opaque background compensates. */
          background: rgba(0,72,60,0.72);
          pointer-events: none;
          transition:
            clip-path 0.45s cubic-bezier(0.16,1,0.3,1),
            opacity   0.22s ease;
        }
        .svc-drop.is-open { pointer-events: auto; }
        .svc-drop-item { display:flex; flex-direction:column; gap:4px; padding:14px 20px; text-decoration:none; transition:background 200ms ease; }
        .svc-drop-item:hover { background:rgba(246,245,242,0.08); }
        .svc-drop-item__label { font-family:var(--font-head); font-weight:600; font-size:15px; color:#f6f5f2; letter-spacing:-0.2px; white-space:nowrap; }
        .svc-drop-item__desc  { font-family:var(--font-mono); font-size:10px; letter-spacing:0.10em; color:rgba(246,245,242,0.45); white-space:nowrap; }
        .svc-drop-divider { height:1px; background:rgba(246,245,242,0.08); flex-shrink:0; }
      `}</style>

      <nav
        className={[
          'fixed z-[100] h-[72px]',
          'grid items-center grid-cols-[1fr_auto] md:grid-cols-[1fr_auto_1fr]',
        ].join(' ')}
        style={{
          left:            isPill ? '16px' : '0px',
          right:           isPill ? '16px' : '0px',
          top:             isPill ? '12px' : '0px',
          borderRadius:    isPill ? '20px' : '0px',
          padding:         isPill ? '0 28px' : '0 var(--margin-x)',
          backgroundColor: transparent ? 'transparent' : 'rgba(0,77,64,0.55)',
          backdropFilter:  transparent ? 'none' : 'blur(20px)',
          WebkitBackdropFilter: transparent ? 'none' : 'blur(20px)',
          boxShadow:       isPill ? '0 8px 32px rgba(0,0,0,0.18), inset 0 1px 0 rgba(246,245,242,0.10)' : 'none',
          /* Remove bottom border when dropdown is open so the two glass
             surfaces butt flush — no visible seam line between nav and pocket */
          borderTop:       isPill ? '1px solid rgba(246,245,242,0.12)' : 'none',
          borderLeft:      isPill ? '1px solid rgba(246,245,242,0.12)' : 'none',
          borderRight:     isPill ? '1px solid rgba(246,245,242,0.12)' : 'none',
          borderBottom:    (isPill && dropOpen) ? 'none' : isPill ? '1px solid rgba(246,245,242,0.12)' : 'none',
          transition:      'left 0.5s cubic-bezier(0.16,1,0.3,1), right 0.5s cubic-bezier(0.16,1,0.3,1), top 0.5s cubic-bezier(0.16,1,0.3,1), border-radius 0.5s cubic-bezier(0.16,1,0.3,1), background-color 0.4s ease, backdrop-filter 0.4s ease, box-shadow 0.4s ease, padding 0.5s cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          className="nav-logo flex items-center gap-3.5 justify-self-start no-underline"
          style={{ opacity: introDone ? 1 : 0, transition: 'opacity 0.4s ease', pointerEvents: introDone ? 'auto' : 'none' }}
        >
          <span className="nav-logo-mark inline-flex">
            <Image src="/logo-mark.svg" alt="" width={29} height={26} priority />
          </span>
          <Image src="/wordmark-cream.svg" alt="shift.media" width={143} height={22} priority className="hidden sm:block" />
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-11 justify-self-center">
          {navItems.map(link => {
            const isServices = link.href === '/services'
            const active = isServices ? isServicesActive : pathname === link.href

            if (isServices) {
              return (
                <div
                  key={link.href}
                  className="relative inline-flex items-center"
                  onMouseEnter={openDrop}
                  onMouseLeave={closeDrop}
                >
                  <Link
                    href={link.href}
                    className={`nav-link font-bold text-[17px] text-cream no-underline pb-1${active ? ' nav-link--active' : ''}`}
                    style={{ fontFamily: 'var(--font-head)' }}
                  >
                    <span className="nav-link__stack">
                      <span className="nav-link__row">{link.label}</span>
                      <span className="nav-link__row">{link.label}</span>
                    </span>
                  </Link>

                  {/*
                    Dynamic Island bubble.

                    Pill mode (scrolled):
                      — top: 100%  → flush against nav bottom, no gap
                      — border-radius: 0 0 16px 16px  → square top corners
                        so the bubble looks like it grows from the pill
                      — border-top: none  → the pill's own bottom border
                        is the visual separator; adding another border
                        here would create a double-line seam
                      — clip-path reveals top→bottom (content pours out
                        of the pill downward)

                    Transparent mode (!scrolled):
                      — top: calc(100% + 8px)  → floating card with gap
                      — border-radius: 16px  → fully rounded card
                      — full border on all sides
                  */}
                  <div
                    className={`svc-drop${dropOpen ? ' is-open' : ''}`}
                    style={{
                      top:          isPill ? '100%' : 'calc(100% + 8px)',
                      borderRadius: isPill ? '0 0 16px 16px' : '16px',
                      border:       '1px solid rgba(246,245,242,0.12)',
                      borderTop:    isPill ? 'none' : '1px solid rgba(246,245,242,0.12)',
                      boxShadow:    isPill
                        ? '0 14px 36px rgba(0,0,0,0.24)'
                        : '0 8px 32px rgba(0,0,0,0.22), inset 0 1px 0 rgba(246,245,242,0.10)',
                      clipPath: dropOpen
                        ? (isPill ? 'inset(0 0 0% 0 round 0 0 16px 16px)' : 'inset(0 0 0% 0 round 16px)')
                        : (isPill ? 'inset(0 0 100% 0 round 0 0 16px 16px)' : 'inset(0 0 100% 0 round 16px)'),
                      opacity: dropOpen ? 1 : 0,
                    }}
                    onMouseEnter={openDrop}
                    onMouseLeave={closeDrop}
                  >
                    {servicesDropdown.map((item, i) => (
                      <div key={item.href}>
                        {i > 0 && <div className="svc-drop-divider" />}
                        <Link href={item.href} className="svc-drop-item">
                          <span className="svc-drop-item__label">{item.label}</span>
                          <span className="svc-drop-item__desc">{item.desc}</span>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              )
            }

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

        {/* Desktop CTA */}
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
          Get in touch ›
        </Link>

        {/* Mobile burger */}
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

      {/* Mobile overlay */}
      <div
        className="md:hidden fixed inset-0 z-[99] flex flex-col pt-[72px]"
        style={{
          background: 'linear-gradient(180deg, #004d40 0%, #00695c 35%, #00897b 75%, #b9d8d2 100%)',
          transform:  mobileOpen ? 'translateY(0)' : 'translateY(-100%)',
          transition: 'transform 0.55s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <div className="flex flex-col items-start gap-8 px-8 pt-12 flex-1">
          {navItems.map(link => {
            const isServices = link.href === '/services'
            const active = isServices ? isServicesActive : pathname === link.href

            if (isServices) {
              return (
                <div key={link.href} className="flex flex-col gap-5 w-full">
                  <div style={{ display: 'inline-flex', alignItems: 'baseline', gap: '14px' }}>
                    <Link
                      href={link.href}
                      className="font-bold tracking-[-1.5px] no-underline leading-[1] text-cream"
                      style={{ fontFamily: 'var(--font-head)', fontSize: 'clamp(36px,9vw,56px)', opacity: active ? 1 : 0.85 }}
                    >
                      {link.label}
                    </Link>
                    <button
                      onClick={() => setMobileServicesOpen(o => !o)}
                      aria-label="Toggle services sub-menu"
                      className="bg-transparent border-0 cursor-pointer p-0"
                      style={{
                        color: 'rgba(246,245,242,0.55)',
                        fontSize: '20px',
                        lineHeight: 1,
                        display: 'inline-block',
                        transform: mobileServicesOpen ? 'rotate(180deg)' : 'none',
                        transition: 'transform 300ms cubic-bezier(0.65,0,0.35,1)',
                      }}
                    >
                      ↓
                    </button>
                  </div>

                  {mobileServicesOpen && (
                    <div className="flex flex-col gap-4 pl-5 border-l border-white/20">
                      {servicesDropdown.map(item => (
                        <Link key={item.href} href={item.href} className="no-underline">
                          <span
                            className="font-bold no-underline text-cream"
                            style={{ fontFamily: 'var(--font-head)', fontSize: 'clamp(22px,5vw,32px)', letterSpacing: '-0.5px', opacity: 0.85 }}
                          >
                            {item.label}
                          </span>
                          <span
                            className="block"
                            style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.12em', color: 'rgba(246,245,242,0.45)', marginTop: '2px' }}
                          >
                            {item.desc}
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )
            }

            return (
              <Link
                key={link.href}
                href={link.href}
                className="font-bold tracking-[-1.5px] no-underline leading-[1] text-cream"
                style={{ fontFamily: 'var(--font-head)', fontSize: 'clamp(36px,9vw,56px)', opacity: active ? 1 : 0.85 }}
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
