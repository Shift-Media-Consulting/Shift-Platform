'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

const HERO_GRADIENT =
  'linear-gradient(160deg, #004d40 0%, #00695c 30%, #00897b 60%, #f6f5f2 100%)'

export default function IntroAnimation() {
  const [visible, setVisible] = useState(true)

  const bgRef         = useRef<HTMLDivElement>(null)
  const groupRef      = useRef<HTMLDivElement>(null)
  const svgRef        = useRef<SVGSVGElement>(null)
  const topPathRef    = useRef<SVGPathElement>(null)
  const bottomPathRef = useRef<SVGPathElement>(null)
  const wmWrapRef     = useRef<HTMLDivElement>(null)
  const wmImgRef      = useRef<HTMLImageElement>(null)

  useEffect(() => {
    if (sessionStorage.getItem('sm-intro-v6')) {
      setVisible(false)
      return
    }

    const isMobile = window.innerWidth < 640
    const vw       = window.innerWidth

    // Compute sizes matching the CSS clamp values
    const logoAnim  = Math.min(120, Math.max(56,  vw * 0.083))
    const wmAnim    = isMobile ? 0 : Math.min(591, Math.max(276, vw * 0.409))
    const logoNav   = 29
    const wmNav     = isMobile ? 0 : 143

    // Resolve --margin-x to pixels
    const raw    = getComputedStyle(document.documentElement).getPropertyValue('--margin-x').trim()
    const tmpEl  = document.createElement('div')
    tmpEl.style.width = raw || '40px'
    document.body.appendChild(tmpEl)
    const marginXPx = tmpEl.offsetWidth
    document.body.removeChild(tmpEl)

    document.body.style.overflow = 'hidden'

    // ── Initial state ─────────────────────────────────────
    gsap.set(topPathRef.current,    { attr: { transform: 'translate(60 -60)' } })
    gsap.set(bottomPathRef.current, { attr: { transform: 'translate(-60 60)' } })
    gsap.set(svgRef.current,        { width: logoAnim, height: 'auto', flexShrink: 0, overflow: 'visible' })
    gsap.set(wmWrapRef.current,     { width: 0, overflow: 'hidden', flexShrink: 0 })
    gsap.set(wmImgRef.current,      { opacity: 0, width: wmAnim, maxWidth: 'none', display: 'block' })
    gsap.set(groupRef.current,      { xPercent: -50, yPercent: -50, top: '50%', left: '50%', display: 'flex', alignItems: 'center', gap: '14px' })

    // ── Timeline ──────────────────────────────────────────
    const tl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = ''
        sessionStorage.setItem('sm-intro-v6', '1')
        // Signal Nav so it fades its logo in exactly as our overlay fades out
        window.dispatchEvent(new CustomEvent('sm-intro-complete'))
        setVisible(false)
      },
    })

    // [0.4s] Logo halves slide together — power4.out = fast snap, satisfying
    tl.to(topPathRef.current,    { attr: { transform: 'translate(0 0)' }, duration: 0.95, ease: 'power4.out' }, 0.4)
    tl.to(bottomPathRef.current, { attr: { transform: 'translate(0 0)' }, duration: 0.95, ease: 'power4.out' }, 0.4)

    // [1.3s] Scale punch when the halves meet
    tl.to(svgRef.current, { scale: 1.08, duration: 0.10, ease: 'none' }, 1.28)
    tl.to(svgRef.current, { scale: 1,    duration: 0.55, ease: 'elastic.out(1, 0.55)' }, 1.38)

    // [1.65s] Wordmark slides out + fades in simultaneously
    tl.to(wmWrapRef.current, { width: wmAnim, duration: 0.80, ease: 'power3.out' }, 1.65)
    tl.to(wmImgRef.current,  { opacity: 1,    duration: 0.55, ease: 'power2.out' }, 1.80)

    // [2.55s] Fly to nav ─────────────────────────────────
    // Background fades
    tl.to(bgRef.current, { opacity: 0, duration: 0.90, ease: 'power2.inOut' }, 2.55)

    // Logo shrinks to nav size
    tl.to(svgRef.current, { width: logoNav, duration: 1.05, ease: 'power3.inOut' }, 2.55)

    // Wordmark shrinks (or vanishes on mobile)
    tl.to(wmWrapRef.current, { width: wmNav,  duration: 1.05, ease: 'power3.inOut' }, 2.55)
    if (!isMobile && wmImgRef.current) {
      tl.to(wmImgRef.current, { width: wmNav, duration: 1.05, ease: 'power3.inOut' }, 2.55)
    } else {
      tl.to(wmImgRef.current, { opacity: 0, duration: 0.35, ease: 'power2.in' }, 2.55)
    }

    // Group flies to nav position
    tl.to(groupRef.current, {
      xPercent: 0,
      yPercent: -50,
      top: 36,           // px — nav centre
      left: marginXPx,
      duration: 1.05,
      ease: 'power3.inOut',
    }, 2.55)

    // Crossfade: overlay logo fades out while Nav logo (opacity 0→1 in Nav.tsx)
    // fades in simultaneously — no visible gap between the two.
    tl.to(groupRef.current, { opacity: 0, duration: 0.25, ease: 'power2.in' })

    return () => {
      tl.kill()
      document.body.style.overflow = ''
    }
  }, [])

  if (!visible) return null

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999 }}>

      {/* Background */}
      <div ref={bgRef} style={{ position: 'absolute', inset: 0, background: HERO_GRADIENT }} />

      {/* Logo + wordmark group — positioned by GSAP */}
      <div ref={groupRef} style={{ position: 'fixed' }}>

        {/* Logo mark */}
        <svg ref={svgRef} viewBox="0 0 197.4 175.54" aria-hidden="true">
          <defs>
            <linearGradient
              id="ig-grad"
              x1="1309.92" y1="1557.13" x2="1409.97" y2="1557.13"
              gradientTransform="translate(272.1512 -1956.5548) rotate(45)"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0" stopColor="#004d40" />
              <stop offset="1" stopColor="#f6f5f2" />
            </linearGradient>
          </defs>
          <path
            ref={topPathRef}
            d="M26.6,141.5L168.1,0c39.08,39.08,39.07,102.43,0,141.5-39.07,39.07-102.42,39.08-141.5,0Z"
            fill="url(#ig-grad)"
          />
          <path
            ref={bottomPathRef}
            d="M151.05,50.41L25.91,175.54c-34.55-34.55-34.55-90.58,0-125.13,34.55-34.55,90.57-34.55,125.13,0Z"
            fill="#f6f5f2"
          />
        </svg>

        {/* Wordmark */}
        <div ref={wmWrapRef}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img ref={wmImgRef} src="/wordmark-cream.svg" alt="" />
        </div>

      </div>
    </div>
  )
}
