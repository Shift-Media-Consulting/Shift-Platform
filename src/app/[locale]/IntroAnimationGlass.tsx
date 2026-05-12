'use client'

/**
 * IntroAnimationGlass — glass-themed intro reveal.
 *
 * Concept: a frosted glass panel materialises in the deep teal field.
 * The SHIFT logo assembles inside it. When the two halves snap shut a
 * specular light-sweep crosses the glass surface. The panel then dissolves
 * and the logo flies to the nav position — same mechanic as the original
 * but with a distinctly physical, glass-like quality.
 *
 * Original animation preserved at: IntroAnimation.backup.tsx
 * Original (currently active):     IntroAnimation.tsx
 */

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

const BG = 'linear-gradient(160deg, #00332a 0%, #004d40 35%, #00695c 70%, #00897b 100%)'

export default function IntroAnimationGlass() {
  const [visible, setVisible] = useState(true)

  const bgRef         = useRef<HTMLDivElement>(null)
  const glassRef      = useRef<HTMLDivElement>(null)
  const sweepRef      = useRef<HTMLDivElement>(null)
  const glowRef       = useRef<HTMLDivElement>(null)
  const groupRef      = useRef<HTMLDivElement>(null)
  const svgRef        = useRef<SVGSVGElement>(null)
  const topPathRef    = useRef<SVGPathElement>(null)
  const bottomPathRef = useRef<SVGPathElement>(null)
  const wmWrapRef     = useRef<HTMLDivElement>(null)
  const wmImgRef      = useRef<HTMLImageElement>(null)

  useEffect(() => {
    if (sessionStorage.getItem('sm-intro-glass-v1')) {
      setVisible(false)
      return
    }

    const isMobile = window.innerWidth < 640
    const vw       = window.innerWidth

    const logoAnim = Math.min(120, Math.max(56,  vw * 0.083))
    const wmAnim   = isMobile ? 0 : Math.min(591, Math.max(276, vw * 0.409))
    const logoNav  = 29
    const wmNav    = isMobile ? 0 : 143

    const raw   = getComputedStyle(document.documentElement).getPropertyValue('--margin-x').trim()
    const tmpEl = document.createElement('div')
    tmpEl.style.width = raw || '40px'
    document.body.appendChild(tmpEl)
    const marginXPx = tmpEl.offsetWidth
    document.body.removeChild(tmpEl)

    document.body.style.overflow = 'hidden'

    // ── Initial states ────────────────────────────────────────────────
    // Glass panel — centred via GSAP so scale transform is clean
    gsap.set(glassRef.current, {
      position: 'absolute',
      xPercent: -50,
      yPercent: -50,
      top: '50%',
      left: '50%',
      scale: 0.86,
      opacity: 0,
    })
    // Sweep starts fully left, hidden
    gsap.set(sweepRef.current, { xPercent: -110, opacity: 0 })
    // Glow pulse starts invisible
    gsap.set(glowRef.current,  { opacity: 0, scale: 0.9 })

    // Logo halves split
    gsap.set(topPathRef.current,    { attr: { transform: 'translate(60 -60)' } })
    gsap.set(bottomPathRef.current, { attr: { transform: 'translate(-60 60)' } })
    gsap.set(svgRef.current,        { width: logoAnim, height: 'auto', flexShrink: 0, overflow: 'visible' })
    gsap.set(wmWrapRef.current,     { width: 0, overflow: 'hidden', flexShrink: 0 })
    gsap.set(wmImgRef.current,      { opacity: 0, width: wmAnim, maxWidth: 'none', display: 'block' })
    gsap.set(groupRef.current,      {
      xPercent: -50,
      yPercent: -50,
      top: '50%',
      left: '50%',
      display: 'flex',
      alignItems: 'center',
      gap: '14px',
    })

    // ── Timeline ──────────────────────────────────────────────────────
    const tl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = ''
        sessionStorage.setItem('sm-intro-glass-v1', '1')
        window.dispatchEvent(new CustomEvent('sm-intro-complete'))
        setVisible(false)
      },
    })

    // [0.15s] Glass panel rises in — slightly elastic so it feels physical
    tl.to(glassRef.current, {
      scale:   1,
      opacity: 1,
      duration: 0.80,
      ease: 'power3.out',
    }, 0.15)

    // [0.4s] Logo halves snap together — same as original
    tl.to(topPathRef.current,    { attr: { transform: 'translate(0 0)' }, duration: 0.95, ease: 'power4.out' }, 0.40)
    tl.to(bottomPathRef.current, { attr: { transform: 'translate(0 0)' }, duration: 0.95, ease: 'power4.out' }, 0.40)

    // [1.28s] Scale punch on snap
    tl.to(svgRef.current, { scale: 1.08, duration: 0.10, ease: 'none'                    }, 1.28)
    tl.to(svgRef.current, { scale: 1,    duration: 0.55, ease: 'elastic.out(1, 0.55)'    }, 1.38)

    // [1.30s] Specular sweep — diagonal light crossing the glass surface
    tl.to(sweepRef.current, { opacity: 1, duration: 0.08,                                }, 1.30)
    tl.to(sweepRef.current, { xPercent: 115, duration: 0.58, ease: 'power2.out'          }, 1.30)
    tl.to(sweepRef.current, { opacity: 0, duration: 0.18, ease: 'power1.in'              }, 1.75)

    // [1.42s] Subtle glow pulse on the glass panel edges (glass "reacts" to the snap)
    tl.to(glowRef.current, { opacity: 1, scale: 1, duration: 0.30, ease: 'power2.out'   }, 1.42)
    tl.to(glowRef.current, { opacity: 0, scale: 1.08, duration: 0.50, ease: 'power2.in' }, 1.72)

    // [1.65s] Wordmark slides out + fades
    tl.to(wmWrapRef.current, { width: wmAnim, duration: 0.80, ease: 'power3.out'         }, 1.65)
    tl.to(wmImgRef.current,  { opacity: 1,    duration: 0.55, ease: 'power2.out'         }, 1.80)

    // [2.55s] Fly to nav — glass dissolves, bg fades, logo travels
    tl.to(bgRef.current, {
      opacity: 0, duration: 0.90, ease: 'power2.inOut',
    }, 2.55)

    tl.to(glassRef.current, {
      opacity: 0,
      scale: 0.96,
      duration: 0.65,
      ease: 'power2.inOut',
    }, 2.55)

    tl.to(svgRef.current,    { width: logoNav, duration: 1.05, ease: 'power3.inOut'      }, 2.55)
    tl.to(wmWrapRef.current, { width: wmNav,   duration: 1.05, ease: 'power3.inOut'      }, 2.55)

    if (!isMobile && wmImgRef.current) {
      tl.to(wmImgRef.current, { width: wmNav, duration: 1.05, ease: 'power3.inOut'       }, 2.55)
    } else {
      tl.to(wmImgRef.current, { opacity: 0,   duration: 0.35, ease: 'power2.in'          }, 2.55)
    }

    tl.to(groupRef.current, {
      xPercent: 0,
      yPercent: -50,
      top:  36,
      left: marginXPx,
      duration: 1.05,
      ease: 'power3.inOut',
    }, 2.55)

    // Crossfade — overlay logo fades as Nav logo fades in
    tl.to(groupRef.current, { opacity: 0, duration: 0.25, ease: 'power2.in' })

    return () => {
      tl.kill()
      document.body.style.overflow = ''
    }
  }, [])

  if (!visible) return null

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999 }}>

      {/* ── Solid background ────────────────────────────────────────── */}
      <div ref={bgRef} style={{ position: 'absolute', inset: 0, background: BG }} />

      {/* ── Glass panel ─────────────────────────────────────────────── */}
      {/*
        Sits between background and logo.
        backdropFilter blurs the gradient behind it → true frosted glass.
        Prismatic inset box-shadows are the same treatment as the
        team founder portrait cards — warm top/left, cool bottom/right.
      */}
      <div
        ref={glassRef}
        style={{
          width:  'clamp(300px, 52vw, 760px)',
          height: 'clamp(240px, 44vh, 560px)',
          borderRadius: '14px',
          overflow: 'hidden',
          // Layered glass fill: bright top-left corner fades to deep teal
          background: `
            linear-gradient(
              128deg,
              rgba(255,255,255,0.14)   0%,
              rgba(255,255,255,0.06)  28%,
              rgba(0,70,55,0.18)      52%,
              rgba(0,50,40,0.10)      78%,
              rgba(255,255,255,0.03) 100%
            )
          `,
          backdropFilter:       'blur(18px)',
          WebkitBackdropFilter: 'blur(18px)',
          boxShadow: `
            inset 0  1.5px 0 rgba(255,240,220,0.42),
            inset 0 -1.5px 0 rgba(140,175,255,0.26),
            inset  1.5px 0 0 rgba(255,155,155,0.20),
            inset -1.5px 0 0 rgba(115,140,255,0.20),
            0 48px 120px rgba(0,0,0,0.40),
            0  8px  28px rgba(0,0,0,0.22)
          `,
          pointerEvents: 'none',
        }}
      >
        {/* Specular sweep — angled shard of reflected light */}
        <div
          ref={sweepRef}
          style={{
            position: 'absolute',
            top:    '-10%',
            left:     '8%',
            width:   '22%',
            height: '120%',
            // Wide soft gradient so it reads as diffuse light, not a line
            background: `linear-gradient(
              to right,
              transparent                      0%,
              rgba(255,255,255,0.10)          30%,
              rgba(255,255,255,0.28)          50%,
              rgba(255,255,255,0.10)          70%,
              transparent                    100%
            )`,
            transform: 'skewX(-14deg)',
            pointerEvents: 'none',
          }}
        />

        {/* Edge glow pulse — brightens the prismatic border on snap */}
        <div
          ref={glowRef}
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '14px',
            boxShadow: `
              inset 0  2px 16px rgba(255,240,200,0.18),
              inset 0 -2px 16px rgba(140,175,255,0.14),
              inset  2px 0 16px rgba(255,140,140,0.12),
              inset -2px 0 16px rgba(120,145,255,0.12)
            `,
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* ── Logo + wordmark (GSAP-positioned, sits above glass) ─────── */}
      <div ref={groupRef} style={{ position: 'fixed' }}>

        <svg ref={svgRef} viewBox="0 0 197.4 175.54" aria-hidden="true">
          <defs>
            <linearGradient
              id="ig-grad-glass"
              x1="1309.92" y1="1557.13" x2="1409.97" y2="1557.13"
              gradientTransform="translate(272.1512 -1956.5548) rotate(45)"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0"   stopColor="#004d40" />
              <stop offset="0.6" stopColor="#00897b" />
              <stop offset="1"   stopColor="#f6f5f2" />
            </linearGradient>
          </defs>

          {/* Top half — gradient fill so it reads as refracting glass */}
          <path
            ref={topPathRef}
            d="M26.6,141.5L168.1,0c39.08,39.08,39.07,102.43,0,141.5-39.07,39.07-102.42,39.08-141.5,0Z"
            fill="url(#ig-grad-glass)"
          />
          {/* Bottom half — cream, same as original */}
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
