'use client'

import { useEffect } from 'react'

const CSS = `
/* ─── Gradient drift on .mth-main ──────────────────────────────────── */
@keyframes mth-drift {
  0%   { background-position: 0% 0%; }
  50%  { background-position: 0% 100%; }
  100% { background-position: 0% 0%; }
}
.mth-main {
  background-size: 100% 200%;
  animation: mth-drift 90s linear infinite;
}
@media (prefers-reduced-motion: reduce) {
  .mth-main { animation-duration: 180s; }
}

/* ─── Layer 1: mth-r children initial state ─────────────────────────── */
[data-mth] .mth-r {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 700ms cubic-bezier(0.22,0.61,0.36,1),
              transform 700ms cubic-bezier(0.22,0.61,0.36,1);
}
[data-mth] .mth-r.is-revealed {
  opacity: 1;
  transform: none;
}
@media (prefers-reduced-motion: reduce) {
  [data-mth] .mth-r {
    opacity: 1 !important;
    transform: none !important;
    transition: none !important;
  }
}

/* ─── em.news — italic + underline draw ────────────────────────────── */
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
`

export default function MethodReveal() {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    /* ── Layer 1: data-mth sections → stagger .mth-r children ── */
    const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-mth]'))

    if (reduced) {
      sections.forEach(s =>
        Array.from(s.querySelectorAll<HTMLElement>('.mth-r')).forEach(el =>
          el.classList.add('is-revealed')
        )
      )
    } else {
      const sectionObs = new IntersectionObserver(
        (entries) => {
          entries.forEach(e => {
            if (!e.isIntersecting) return
            const children = Array.from(
              (e.target as HTMLElement).querySelectorAll<HTMLElement>('.mth-r')
            )
            children.forEach((el, i) => {
              setTimeout(() => el.classList.add('is-revealed'), i * 90)
            })
            sectionObs.unobserve(e.target)
          })
        },
        { threshold: 0.15 }
      )
      sections.forEach(s => sectionObs.observe(s))
    }

    /* ── Layer 3: em.news underline draw ── */
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
  }, [])

  return <style dangerouslySetInnerHTML={{ __html: CSS }} />
}
