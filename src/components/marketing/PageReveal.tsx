'use client'

/**
 * PageReveal — site-wide scroll-triggered entry animation.
 *
 * Add  data-ab  to any section you want observed.
 * Tag child elements with the classes below; they transition in
 * once the section crosses the 12% threshold in the viewport.
 *
 *   ab-h      heading         100 ms delay
 *   ab-label  mono label        0 ms delay
 *   ab-p      body copy       220 ms delay
 *   ab-p2     second ¶        360 ms delay
 *   ab-card   grid card       200 / 360 / 520 / 680 ms (nth-child stagger)
 *   ab-btn    button          380 ms delay
 *   ab-name   byline          500 ms delay
 */

import { useEffect } from 'react'

const CSS = `
/* ─── Initial hidden state ──────────────────────────────────────── */
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

/* ─── Monospace label ────────────────────────────────────────────── */
[data-ab].is-in .ab-label {
  opacity: 1; transform: none;
  transition: opacity 500ms cubic-bezier(0.22,0.61,0.36,1),
              transform 500ms cubic-bezier(0.22,0.61,0.36,1);
  transition-delay: 0ms;
}

/* ─── Heading ────────────────────────────────────────────────────── */
[data-ab].is-in .ab-h {
  opacity: 1; transform: none;
  transition: opacity 700ms cubic-bezier(0.22,0.61,0.36,1),
              transform 700ms cubic-bezier(0.22,0.61,0.36,1);
  transition-delay: 100ms;
}

/* ─── Body ───────────────────────────────────────────────────────── */
[data-ab].is-in .ab-p {
  opacity: 1; transform: none;
  transition: opacity 600ms cubic-bezier(0.22,0.61,0.36,1),
              transform 600ms cubic-bezier(0.22,0.61,0.36,1);
  transition-delay: 220ms;
}
[data-ab].is-in .ab-p2 {
  opacity: 1; transform: none;
  transition: opacity 600ms cubic-bezier(0.22,0.61,0.36,1),
              transform 600ms cubic-bezier(0.22,0.61,0.36,1);
  transition-delay: 360ms;
}

/* ─── Cards — up to 4 stagger ───────────────────────────────────── */
[data-ab].is-in .ab-card {
  opacity: 1; transform: none;
  transition: opacity 700ms cubic-bezier(0.22,0.61,0.36,1),
              transform 700ms cubic-bezier(0.22,0.61,0.36,1);
  transition-delay: 200ms;
}
[data-ab].is-in .ab-card:nth-child(2) { transition-delay: 360ms; }
[data-ab].is-in .ab-card:nth-child(3) { transition-delay: 520ms; }
[data-ab].is-in .ab-card:nth-child(4) { transition-delay: 680ms; }

/* ─── Button ─────────────────────────────────────────────────────── */
[data-ab].is-in .ab-btn {
  opacity: 1; transform: none;
  transition: opacity 500ms cubic-bezier(0.22,0.61,0.36,1),
              transform 500ms cubic-bezier(0.22,0.61,0.36,1);
  transition-delay: 380ms;
}

/* ─── Byline / name ──────────────────────────────────────────────── */
[data-ab].is-in .ab-name {
  opacity: 1; transform: none;
  transition: opacity 500ms cubic-bezier(0.22,0.61,0.36,1),
              transform 500ms cubic-bezier(0.22,0.61,0.36,1);
  transition-delay: 500ms;
}

/* ─── Reduced motion: show everything immediately ───────────────── */
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

export default function PageReveal() {
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
