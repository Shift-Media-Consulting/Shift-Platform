'use client'

import { useEffect } from 'react'

const CSS = `
/* ─── Gradient drift animation on .hm-main ─────────────────────────── */
@keyframes hm-drift {
  0%, 100% { background-position: 0% 0%; }
  50% { background-position: 0% 100%; }
}
.hm-main {
  background-size: 100% 200%;
  animation: hm-drift 90s ease-in-out infinite;
}
@media (prefers-reduced-motion: reduce) {
  .hm-main { animation-duration: 180s; }
}

/* ─── Reveal system ─────────────────────────────────────────────────── */
.hm-section .reveal {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 700ms cubic-bezier(.22,.61,.36,1),
              transform 700ms cubic-bezier(.22,.61,.36,1);
}
.hm-section.is-revealed .reveal {
  opacity: 1;
  transform: none;
}
/* nth-child stagger — 90ms each */
.hm-section.is-revealed .reveal:nth-child(1) { transition-delay: 0ms; }
.hm-section.is-revealed .reveal:nth-child(2) { transition-delay: 90ms; }
.hm-section.is-revealed .reveal:nth-child(3) { transition-delay: 180ms; }
.hm-section.is-revealed .reveal:nth-child(4) { transition-delay: 270ms; }
.hm-section.is-revealed .reveal:nth-child(5) { transition-delay: 360ms; }
.hm-section.is-revealed .reveal:nth-child(6) { transition-delay: 450ms; }

/* Pillar cards: specific delays */
.hm-section.is-revealed .pillar:nth-child(1) { transition-delay: 200ms; }
.hm-section.is-revealed .pillar:nth-child(2) { transition-delay: 320ms; }
.hm-section.is-revealed .pillar:nth-child(3) { transition-delay: 440ms; }
.hm-section.is-revealed .pillar:nth-child(4) { transition-delay: 560ms; }

/* Stats cells: specific delays */
.hm-section.is-revealed .stat-cell:nth-child(1) { transition-delay: 100ms; }
.hm-section.is-revealed .stat-cell:nth-child(2) { transition-delay: 220ms; }
.hm-section.is-revealed .stat-cell:nth-child(3) { transition-delay: 340ms; }
.hm-section.is-revealed .stat-cell:nth-child(4) { transition-delay: 460ms; }

/* ─── em.news underline draw ────────────────────────────────────────── */
em.news {
  font-family: var(--font-serif);
  font-style: italic;
  font-weight: 600;
  color: inherit;
  position: relative;
}
em.news::after {
  content: "";
  position: absolute;
  left: 0; right: 0; bottom: -2px;
  height: 1.5px;
  background: currentColor;
  opacity: 0.6;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 600ms cubic-bezier(.65,0,.35,1);
}
em.news.is-drawn::after { transform: scaleX(1); }
@media (prefers-reduced-motion: reduce) {
  em.news::after { transition-duration: 0ms; }
}

/* ─── Pulse dot ─────────────────────────────────────────────────────── */
@keyframes hm-pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(0.7); opacity: 0.4; }
}
.hm-dot {
  animation: hm-pulse 2.4s ease-in-out infinite;
}
@media (prefers-reduced-motion: reduce) {
  .hm-dot { animation: none; }
}

/* ─── Marquee ───────────────────────────────────────────────────────── */
@keyframes hm-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
.hm-marquee-track {
  animation: hm-marquee 60s linear infinite;
  display: flex;
  width: max-content;
}
@media (prefers-reduced-motion: reduce) {
  .hm-marquee-track { animation: none; }
}

/* ─── Pillar hover ──────────────────────────────────────────────────── */
.pillar {
  transition: padding-left 600ms cubic-bezier(.22,.61,.36,1);
}
.pillar:hover { padding-left: 8px; }
.pillar-arrow {
  opacity: 0.6;
  transition: opacity 200ms ease, transform 200ms ease;
}
.pillar:hover .pillar-arrow { opacity: 1; transform: translate(2px, -2px); }

/* ─── Mobile ────────────────────────────────────────────────────────── */
@media (max-width: 899px) {
  .hm-pillar-grid { grid-template-columns: 1fr !important; }
  .hm-stat-grid { grid-template-columns: repeat(2,1fr) !important; }
  .hm-conviction-grid { grid-template-columns: 1fr !important; }
  .hm-pillar-header { grid-template-columns: 1fr !important; }
  .hm-meta-strip { grid-template-columns: repeat(2,1fr) !important; }
  .hm-cta-section { padding: 80px 24px 100px !important; }
}
`

export default function HomeReveal() {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    /* ── Layer 1: [data-hm] sections → add is-revealed ── */
    const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-hm]'))
    let sectionObs: IntersectionObserver | null = null

    if (reduced) {
      sections.forEach(s => s.classList.add('is-revealed'))
    } else {
      sectionObs = new IntersectionObserver(
        (entries) => {
          entries.forEach(e => {
            if (!e.isIntersecting) return
            ;(e.target as HTMLElement).classList.add('is-revealed')
            sectionObs!.unobserve(e.target)
          })
        },
        { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
      )
      sections.forEach(s => sectionObs!.observe(s))
    }

    /* ── Layer 2: em.news underline draw ── */
    const ems = Array.from(document.querySelectorAll<HTMLElement>('em.news'))
    const emObservers: IntersectionObserver[] = []

    if (reduced) {
      ems.forEach(em => em.classList.add('is-drawn'))
    } else {
      ems.forEach(em => {
        const o = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              setTimeout(() => em.classList.add('is-drawn'), 200)
              o.disconnect()
            }
          },
          { threshold: 0.6 }
        )
        o.observe(em)
        emObservers.push(o)
      })
    }

    return () => {
      sectionObs?.disconnect()
      emObservers.forEach(o => o.disconnect())
    }
  }, [])

  return <style dangerouslySetInnerHTML={{ __html: CSS }} />
}
