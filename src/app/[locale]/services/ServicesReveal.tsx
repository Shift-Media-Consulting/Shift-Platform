'use client'

import { useEffect } from 'react'

const CSS = `
/* ── PageReveal classes ── */
[data-ab] .ab-label,
[data-ab] .ab-h,
[data-ab] .ab-p,
[data-ab] .ab-p2,
[data-ab] .ab-card,
[data-ab] .ab-btn,
[data-ab] .ab-name {
  opacity: 0;
  transform: translateY(18px);
  transition: opacity 700ms cubic-bezier(.22,.61,.36,1),
              transform 700ms cubic-bezier(.22,.61,.36,1);
}
[data-ab].is-in .ab-label { opacity: 1; transform: none; transition-delay: 0ms; }
[data-ab].is-in .ab-h     { opacity: 1; transform: none; transition-delay: 100ms; }
[data-ab].is-in .ab-p     { opacity: 1; transform: none; transition-delay: 220ms; }
[data-ab].is-in .ab-p2    { opacity: 1; transform: none; transition-delay: 360ms; }
[data-ab].is-in .ab-card:nth-child(1) { opacity: 1; transform: none; transition-delay: 200ms; }
[data-ab].is-in .ab-card:nth-child(2) { opacity: 1; transform: none; transition-delay: 360ms; }
[data-ab].is-in .ab-card:nth-child(3) { opacity: 1; transform: none; transition-delay: 520ms; }
[data-ab].is-in .ab-card:nth-child(4) { opacity: 1; transform: none; transition-delay: 680ms; }
[data-ab].is-in .ab-btn  { opacity: 1; transform: none; transition-delay: 380ms; }
[data-ab].is-in .ab-name { opacity: 1; transform: none; transition-delay: 500ms; }
@media (prefers-reduced-motion: reduce) {
  [data-ab] .ab-label, [data-ab] .ab-h, [data-ab] .ab-p, [data-ab] .ab-p2,
  [data-ab] .ab-card, [data-ab] .ab-btn, [data-ab] .ab-name {
    opacity: 1 !important; transform: none !important; transition: none !important;
  }
}

/* em.news underline draw */
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

/* ── Responsive overrides ── */
@media (max-width: 899px) {
  .svc-pillar-grid { grid-template-columns: 1fr !important; }
  .svc-pillar { border-right: none !important; padding-right: 0 !important; border-bottom: 1px solid rgba(17,17,17,0.18); }
  .svc-pillar:last-child { border-bottom: none !important; }
  .svc-header-grid { grid-template-columns: 1fr !important; }
}
`

export default function ServicesReveal() {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const cleanups: (() => void)[] = []

    // Section reveal
    const sections = Array.from(document.querySelectorAll('[data-ab]'))
    if (reduced) {
      sections.forEach(s => s.classList.add('is-in'))
    } else {
      sections.forEach(section => {
        const obs = new IntersectionObserver(
          ([e]) => { if (e.isIntersecting) { section.classList.add('is-in'); obs.disconnect() } },
          { threshold: 0.12 }
        )
        obs.observe(section)
        cleanups.push(() => obs.disconnect())
      })
    }

    // em.news underline draw
    document.querySelectorAll('em.news').forEach(em => {
      const obs = new IntersectionObserver(
        ([e]) => {
          if (e.isIntersecting) {
            setTimeout(() => em.classList.add('is-drawn'), reduced ? 0 : 200)
            obs.disconnect()
          }
        },
        { threshold: 0.6 }
      )
      obs.observe(em)
      cleanups.push(() => obs.disconnect())
    })

    return () => cleanups.forEach(fn => fn())
  }, [])

  return <style dangerouslySetInnerHTML={{ __html: CSS }} />
}
