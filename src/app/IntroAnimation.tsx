'use client'

import { useEffect, useState } from 'react'

type Phase = 'idle' | 'forming' | 'wordmark' | 'flying' | 'done'

const HERO_GRADIENT =
  'linear-gradient(160deg, #004d40 0%, #00695c 30%, #00897b 60%, #f6f5f2 100%)'

const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)'

/*
  Logo:wordmark ratio in the nav = 29px : 143px = 1 : 4.931
  We maintain this exact ratio throughout the animation so the
  proportions don't shift when the group flies to the nav.

  Logo anim size:     clamp(56px, 8.3vw, 120px)
  Wordmark anim size: clamp(276px, 40.9vw, 591px)   ← logo × 4.931
    Verify: 56 × 4.931 = 276 ✓ | 120 × 4.931 = 592 ≈ 591 ✓
*/
const LOGO_ANIM = 'clamp(56px, 8.3vw, 120px)'
const WM_ANIM   = 'clamp(276px, 40.9vw, 591px)'
const LOGO_NAV  = '29px'
const WM_NAV    = '143px'

export default function IntroAnimation() {
  const [phase, setPhase]       = useState<Phase | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  /* Detect mobile (< 640 px) — wordmark is hidden in the nav on mobile,
     so we fade it out during the flying phase to avoid a snap-hide. */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640)
    check()
    window.addEventListener('resize', check, { passive: true })
    return () => window.removeEventListener('resize', check)
  }, [])

  /* Run the full sequence once on mount. All timers are scheduled together
     so a phase change can't cancel them via effect cleanup. */
  useEffect(() => {
    if (sessionStorage.getItem('sm-intro-v5')) {
      setPhase('done')
      return
    }

    setPhase('idle')
    document.body.style.overflow = 'hidden'

    const timers: ReturnType<typeof setTimeout>[] = []
    //              phase       delay   purpose
    timers.push(setTimeout(() => setPhase('forming'),  500))   // halves slide together
    timers.push(setTimeout(() => setPhase('wordmark'), 1700))  // wordmark slides out (+1.2 s)
    timers.push(setTimeout(() => setPhase('flying'),   2700))  // fly to nav           (+1.0 s)
    timers.push(setTimeout(() => {
      setPhase('done')
      document.body.style.overflow = ''
      sessionStorage.setItem('sm-intro-v5', '1')
    }, 3800))                                                   // animation complete   (+1.1 s)

    return () => {
      timers.forEach(clearTimeout)
      document.body.style.overflow = ''
    }
  }, [])

  if (phase === null || phase === 'done') return null

  const formed       = phase === 'forming' || phase === 'wordmark' || phase === 'flying'
  const showWordmark = phase === 'wordmark' || phase === 'flying'
  const isFlying     = phase === 'flying'

  /* Wordmark container width:
       – hidden phase  → 0  (overflow-clip hides the img)
       – wordmark/flying on mobile → 0 (nav has hidden sm:block)
       – flying on desktop → WM_NAV (143 px, proportional shrink)
       – wordmark on desktop → WM_ANIM (proportional to logo) */
  const wordmarkContainerWidth = !showWordmark
    ? '0px'
    : isFlying && isMobile
      ? '0px'
      : isFlying
        ? WM_NAV
        : WM_ANIM

  /* Wordmark image width tracks the container so the revealed image is
     always the same size as its wrapper. */
  const wordmarkImgWidth = isFlying ? WM_NAV : WM_ANIM

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      pointerEvents: isFlying ? 'none' : 'all',
    }}>

      {/* ── Gradient background ── */}
      <div style={{
        position: 'absolute', inset: 0,
        background: HERO_GRADIENT,
        opacity: isFlying ? 0 : 1,
        transition: `opacity 1s ${EASE}`,
      }} />

      {/* ── Logo + wordmark group ── */}
      <div style={{
        position: 'fixed',
        top:       isFlying ? '36px'            : '50%',
        left:      isFlying ? 'var(--margin-x)' : '50%',
        transform: isFlying ? 'translate(0, -50%)' : 'translate(-50%, -50%)',
        display: 'flex', alignItems: 'center',
        gap: '14px',   /* matches nav gap-3.5 */
        transition:
          `top 1.05s ${EASE}, ` +
          `left 1.05s ${EASE}, ` +
          `transform 1.05s ${EASE}`,
      }}>

        {/* ── Logo mark — halves slide together ── */}
        <svg
          viewBox="0 0 197.4 175.54"
          style={{
            width: isFlying ? LOGO_NAV : LOGO_ANIM,
            height: 'auto',
            overflow: 'visible',
            flexShrink: 0,
            transition: `width 1.05s ${EASE}`,
          }}
          aria-hidden="true"
        >
          <defs>
            <linearGradient
              id="ig-grad"
              x1="1309.92" y1="1557.13"
              x2="1409.97" y2="1557.13"
              gradientTransform="translate(272.1512 -1956.5548) rotate(45)"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0" stopColor="#004d40" />
              <stop offset="1" stopColor="#f6f5f2" />
            </linearGradient>
          </defs>

          {/* Teal-gradient half — slides in from upper-right */}
          <path
            d="M26.6,141.5L168.1,0c39.08,39.08,39.07,102.43,0,141.5-39.07,39.07-102.42,39.08-141.5,0Z"
            fill="url(#ig-grad)"
            transform={formed ? 'translate(0 0)' : 'translate(60 -60)'}
            style={{ transition: `transform 1s ${EASE}` }}
          />

          {/* Cream half — slides in from lower-left */}
          <path
            d="M151.05,50.41L25.91,175.54c-34.55-34.55-34.55-90.58,0-125.13,34.55-34.55,90.57-34.55,125.13,0Z"
            fill="#f6f5f2"
            transform={formed ? 'translate(0 0)' : 'translate(-60 60)'}
            style={{ transition: `transform 1s ${EASE}` }}
          />
        </svg>

        {/* ── Wordmark — overflow-clip for the slide-reveal effect ── */}
        <div style={{
          overflow: 'hidden',
          width: wordmarkContainerWidth,
          flexShrink: 0,
          transition: `width 1s ${EASE}`,
        }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/wordmark-cream.svg"
            alt=""
            style={{
              width: wordmarkImgWidth,
              height: 'auto',
              maxWidth: 'none',
              display: 'block',
              transition: `width 1.05s ${EASE}`,
            }}
          />
        </div>

      </div>
    </div>
  )
}
