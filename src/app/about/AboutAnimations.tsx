'use client'

import { useEffect } from 'react'

const CSS = `
/* ─── About page · Scroll reveal ───────────────────────────────────── */

/* Initial hidden state for all animated elements */
[data-ab] .ab-label,
[data-ab] .ab-h,
[data-ab] .ab-p,
[data-ab] .ab-p2,
[data-ab] .ab-card,
[data-ab] .ab-btn,
[data-ab] .ab-name {
  opacity: 0;
  transform: translateY(18px);
}

/* ─── Monospace label ───────────────────────────────────────────────── */
[data-ab].is-in .ab-label {
  opacity: 1;
  transform: none;
  transition: opacity 500ms cubic-bezier(0.22,0.61,0.36,1),
              transform 500ms cubic-bezier(0.22,0.61,0.36,1);
  transition-delay: 0ms;
}

/* ─── Heading ───────────────────────────────────────────────────────── */
[data-ab].is-in .ab-h {
  opacity: 1;
  transform: none;
  transition: opacity 700ms cubic-bezier(0.22,0.61,0.36,1),
              transform 700ms cubic-bezier(0.22,0.61,0.36,1);
  transition-delay: 100ms;
}

/* ─── Body paragraph ────────────────────────────────────────────────── */
[data-ab].is-in .ab-p {
  opacity: 1;
  transform: none;
  transition: opacity 600ms cubic-bezier(0.22,0.61,0.36,1),
              transform 600ms cubic-bezier(0.22,0.61,0.36,1);
  transition-delay: 220ms;
}

/* ─── Second body paragraph (founder note) ──────────────────────────── */
[data-ab].is-in .ab-p2 {
  opacity: 1;
  transform: none;
  transition: opacity 600ms cubic-bezier(0.22,0.61,0.36,1),
              transform 600ms cubic-bezier(0.22,0.61,0.36,1);
  transition-delay: 360ms;
}

/* ─── Cards — stagger up to 4 ──────────────────────────────────────── */
[data-ab].is-in .ab-card {
  opacity: 1;
  transform: none;
  transition: opacity 700ms cubic-bezier(0.22,0.61,0.36,1),
              transform 700ms cubic-bezier(0.22,0.61,0.36,1);
  transition-delay: 200ms;
}
[data-ab].is-in .ab-card:nth-child(2) { transition-delay: 360ms; }
[data-ab].is-in .ab-card:nth-child(3) { transition-delay: 520ms; }
[data-ab].is-in .ab-card:nth-child(4) { transition-delay: 680ms; }

/* ─── Button ────────────────────────────────────────────────────────── */
[data-ab].is-in .ab-btn {
  opacity: 1;
  transform: none;
  transition: opacity 500ms cubic-bezier(0.22,0.61,0.36,1),
              transform 500ms cubic-bezier(0.22,0.61,0.36,1);
  transition-delay: 380ms;
}

/* ─── Founder name line ─────────────────────────────────────────────── */
[data-ab].is-in .ab-name {
  opacity: 1;
  transform: none;
  transition: opacity 500ms cubic-bezier(0.22,0.61,0.36,1),
              transform 500ms cubic-bezier(0.22,0.61,0.36,1);
  transition-delay: 500ms;
}

/* ─── Reduced motion: skip all ──────────────────────────────────────── */
@media (prefers-reduced-motion: reduce) {
  [data-ab] .ab-label,
  [data-ab] .ab-h,
  [data-ab] .ab-p,
  [data-ab] .ab-p2,
  [data-ab] .ab-card,
  [data-ab] .ab-btn,
  [data-ab] .ab-name {
    opacity: 1 !important;
    transform: none !important;
    transition: none !important;
  }
}
`

export default function AboutAnimations() {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-ab]'))

    if (reduced) {
      sections.forEach(s => s.classList.add('is-in'))
      return
    }

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('is-in')
            obs.unobserve(e.target)
          }
        })
      },
      { threshold: 0.12 }
    )

    sections.forEach(s => obs.observe(s))
    return () => obs.disconnect()
  }, [])

  return <style dangerouslySetInnerHTML={{ __html: CSS }} />
}
