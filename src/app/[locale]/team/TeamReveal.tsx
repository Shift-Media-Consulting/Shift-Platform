'use client'

import { useEffect } from 'react'

const CSS = `
/* ─── Layer 1: .reveal children initial state ───────────────────────── */
[data-t] .reveal {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 700ms cubic-bezier(0.22,0.61,0.36,1),
              transform 700ms cubic-bezier(0.22,0.61,0.36,1);
}
[data-t] .reveal.is-revealed {
  opacity: 1;
  transform: none;
}
@media (prefers-reduced-motion: reduce) {
  [data-t] .reveal {
    opacity: 1 !important;
    transform: none !important;
    transition: none !important;
  }
}

/* ─── Layer 2: em.news underline draw ───────────────────────────────── */
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
  transition: transform 600ms cubic-bezier(0.65, 0, 0.35, 1);
}
em.news.is-drawn::after { transform: scaleX(1); }
@media (prefers-reduced-motion: reduce) {
  em.news::after { transition-duration: 200ms; }
}

/* ─── Responsive ─────────────────────────────────────────────────────── */
@media (max-width: 899px) {
  .tm-founders-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
  .tm-proof-grid { grid-template-columns: repeat(2, 1fr) !important; }
  .tm-work-grid { grid-template-columns: 1fr !important; }
  .tm-partner-grid { grid-template-columns: 1fr !important; }
  .tm-partner-cluster { border-right: none !important; padding-right: 0 !important; border-bottom: 1px solid rgba(246,245,242,0.25); padding-bottom: 32px !important; }
  .tm-partner-cluster:last-child { border-bottom: none !important; }
  .tm-meta-strip { grid-template-columns: repeat(2, 1fr) !important; }
  /* Hero section padding */
  [data-t]:first-child { padding-left: var(--margin-x) !important; padding-right: var(--margin-x) !important; }
  /* Founder portrait — reduce size */
  .tm-founder-portrait { min-height: 300px !important; }
  /* Working model glass card padding */
  .tm-work-card { padding: 24px !important; }
  /* Partner discipline list items */
  .tm-discipline-item { padding: 10px 0 !important; }
  /* Footer rule on partner section — stack */
  .tm-partner-footer { flex-direction: column !important; gap: 8px !important; }
}
`

export default function TeamReveal() {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    /* ── Layer 1: data-t sections → stagger .reveal children ── */
    const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-t]'))

    if (reduced) {
      sections.forEach(s =>
        Array.from(s.querySelectorAll<HTMLElement>('.reveal')).forEach(el =>
          el.classList.add('is-revealed')
        )
      )
    } else {
      const sectionObs = new IntersectionObserver(
        (entries) => {
          entries.forEach(e => {
            if (!e.isIntersecting) return
            const section = e.target as HTMLElement
            const children = Array.from(section.querySelectorAll<HTMLElement>('.reveal'))

            children.forEach((el, i) => {
              // founder cards: fixed delays
              if (el.classList.contains('tm-founder')) {
                const founderDelays = [240, 380, 520]
                const founderIndex = Array.from(section.querySelectorAll<HTMLElement>('.tm-founder')).indexOf(el)
                const delay = founderDelays[founderIndex] ?? 240 + founderIndex * 140
                setTimeout(() => el.classList.add('is-revealed'), delay)
                return
              }
              // proof cells: fixed delays
              if (el.classList.contains('tm-proof-cell')) {
                const proofDelays = [100, 220, 340, 460]
                const proofIndex = Array.from(section.querySelectorAll<HTMLElement>('.tm-proof-cell')).indexOf(el)
                const delay = proofDelays[proofIndex] ?? 100 + proofIndex * 120
                setTimeout(() => el.classList.add('is-revealed'), delay)
                return
              }
              // default 90ms stagger
              setTimeout(() => el.classList.add('is-revealed'), i * 90)
            })
            sectionObs.unobserve(e.target)
          })
        },
        { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
      )
      sections.forEach(s => sectionObs.observe(s))
    }

    /* ── Layer 2: em.news underline draw ── */
    const ems = Array.from(document.querySelectorAll<HTMLElement>('em.news'))
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
      })
    }

    /* ── Layer 3: counter animation ── */
    const counters = Array.from(document.querySelectorAll<HTMLElement>('.counter[data-target]'))
    if (reduced) {
      counters.forEach(el => {
        const target = parseInt(el.getAttribute('data-target') ?? '0', 10)
        const suffix = el.getAttribute('data-suffix') ?? ''
        el.textContent = `${target}${suffix}`
      })
    } else {
      counters.forEach((el, idx) => {
        const o = new IntersectionObserver(
          ([entry]) => {
            if (!entry.isIntersecting) return
            o.disconnect()
            const target = parseInt(el.getAttribute('data-target') ?? '0', 10)
            const suffix = el.getAttribute('data-suffix') ?? ''
            const duration = 1400
            const staggerDelay = idx * 120
            const start = performance.now() + staggerDelay

            function tick(now: number) {
              const elapsed = Math.max(0, now - start)
              if (elapsed < 0) {
                requestAnimationFrame(tick)
                return
              }
              const p = Math.min(elapsed / duration, 1)
              const eased = 1 - Math.pow(1 - p, 3)
              el.textContent = `${Math.round(eased * target)}${suffix}`
              if (p < 1) {
                requestAnimationFrame(tick)
              } else {
                el.textContent = `${target}${suffix}`
              }
            }
            requestAnimationFrame(tick)
          },
          { threshold: 0.5 }
        )
        o.observe(el)
      })
    }
  }, [])

  return <style dangerouslySetInnerHTML={{ __html: CSS }} />
}
