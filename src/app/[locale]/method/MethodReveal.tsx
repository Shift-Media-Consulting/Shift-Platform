'use client'

import { useEffect } from 'react'

const CSS = `
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

@media (max-width: 899px) {
  /* Triggers section — 3 col → 1 col */
  .mth-triggers-grid { grid-template-columns: 1fr !important; row-gap: 32px !important; }
  /* Independence section — 3 col → 1 col */
  .mth-independence-grid { grid-template-columns: 1fr !important; row-gap: 28px !important; }
  /* Framework section — handled in MethodFramework */
  /* Artifact section — handled in MethodArtifact */
  /* Meta strip — 4 col → 2 col */
  .mth-meta-strip { grid-template-columns: repeat(2, 1fr) !important; }
  /* Carousel header — 2 col → 1 col */
  .mth-carousel-header { grid-template-columns: 1fr !important; }
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
