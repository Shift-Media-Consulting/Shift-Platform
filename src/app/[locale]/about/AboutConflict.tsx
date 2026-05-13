'use client'

import { useEffect, useRef } from 'react'
import { useTranslations, useMessages } from 'next-intl'
import { Link } from '@/i18n/routing'

const CSS = `
/* ─── Section ───────────────────────────────────────────────────── */
.ab-section {
  position: relative;
  padding: clamp(72px, 8vw, 120px) var(--margin-x);
}

/* ─── Headline ──────────────────────────────────────────────────── */
.ab-headline {
  font-family: var(--font-head);
  font-weight: 600;
  font-size: clamp(48px, 7.5vw, 104px);
  line-height: 0.95;
  letter-spacing: -0.025em;
  color: #f6f5f2;
  max-width: 1300px;
  margin: 0 0 32px;
}

/* ─── em.news-serif — italic accent, no underline ──────────────── */
em.news-serif {
  font-family: var(--font-serif);
  font-style: italic;
  font-weight: 600;
  color: inherit;
}

/* ─── em.news — italic + underline draw ────────────────────────── */
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

/* ─── Deck ──────────────────────────────────────────────────────── */
.ab-deck {
  font-size: 24px;
  line-height: 1.45;
  color: rgba(246,245,242,0.80);
  max-width: 720px;
  margin: 0 0 96px;
  font-weight: 400;
}

/* ─── Grid ──────────────────────────────────────────────────────── */
.ab-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  column-gap: 56px;
}

/* ─── Column ────────────────────────────────────────────────────── */
.ab-col {
  border-top: 1px solid rgba(246,245,242,0.40);
  padding-top: 28px;
  display: flex;
  flex-direction: column;
  min-height: 540px;
}
.ab-num {
  font-family: var(--font-mono);
  font-size: 13px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(246,245,242,0.72);
  margin-bottom: 16px;
  font-weight: 400;
}
.ab-role {
  font-family: var(--font-head);
  font-weight: 600;
  font-size: clamp(56px, 5.5vw, 120px);
  line-height: 0.92;
  letter-spacing: -0.03em;
  color: #f6f5f2;
  margin: 0 0 20px;
}
.ab-role-desc {
  font-size: 19px;
  line-height: 1.5;
  max-width: 320px;
  color: rgba(246,245,242,0.85);
  margin: 0 0 40px;
  font-weight: 400;
}

/* ─── Quote block ───────────────────────────────────────────────── */
.ab-quote {
  margin-top: auto;
  border-top: 1px dashed rgba(246,245,242,0.45);
  padding-top: 20px;
}
.ab-quote-who {
  display: block;
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(246,245,242,0.72);
  margin-bottom: 12px;
  font-weight: 400;
}
.ab-quote-what {
  font-family: var(--font-serif);
  font-style: italic;
  font-weight: 600;
  font-size: 26px;
  line-height: 1.25;
  color: #f6f5f2;
  margin: 0;
}

/* ─── Footer statement ──────────────────────────────────────────── */
.ab-footer-rule {
  margin-top: 80px;
  max-width: 960px;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
  font-family: var(--font-head);
  font-weight: 600;
  line-height: 1.05;
  letter-spacing: -0.02em;
}
.ab-fr-top {
  display: block;
  font-size: clamp(18px, 2vw, 26px);
  color: rgba(246,245,242,0.72);
  margin-bottom: 8px;
}
.ab-fr-main {
  display: block;
  font-size: clamp(28px, 3.5vw, 46px);
  color: #f6f5f2;
}
.ab-footer-rule a {
  color: inherit;
  text-decoration: none;
}

/* ─── Punchline ─────────────────────────────────────────────────── */
.ab-punchline {
  margin-top: 96px;
  max-width: 1100px;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
  font-family: var(--font-head);
  font-size: clamp(32px, 4.5vw, 56px);
  font-weight: 600;
  line-height: 1.05;
  letter-spacing: -0.02em;
  color: #f6f5f2;
}

/* ─── Layer 1 · Initial (hidden) states ─────────────────────────── */
.ab-section .ab-headline,
.ab-section .ab-deck,
.ab-section .ab-col,
.ab-section .ab-quote,
.ab-section .ab-footer-rule,
.ab-section .ab-punchline {
  opacity: 0;
}
.ab-section .ab-headline  { transform: translateY(24px); }
.ab-section .ab-deck      { transform: translateY(16px); }
.ab-section .ab-col       { transform: translateY(20px); }
.ab-section .ab-footer-rule { transform: translateY(12px); }
.ab-section .ab-punchline { transform: translateY(20px); }

/* ─── Transitions ───────────────────────────────────────────────── */
.ab-section .ab-headline {
  transition: opacity 700ms cubic-bezier(0.22,0.61,0.36,1),
              transform 700ms cubic-bezier(0.22,0.61,0.36,1);
  transition-delay: 0ms;
}
.ab-section .ab-deck {
  transition: opacity 600ms cubic-bezier(0.22,0.61,0.36,1),
              transform 600ms cubic-bezier(0.22,0.61,0.36,1);
  transition-delay: 250ms;
}
.ab-section .ab-col:nth-child(1) {
  transition: opacity 700ms cubic-bezier(0.22,0.61,0.36,1),
              transform 700ms cubic-bezier(0.22,0.61,0.36,1);
  transition-delay: 500ms;
}
.ab-section .ab-col:nth-child(2) {
  transition: opacity 700ms cubic-bezier(0.22,0.61,0.36,1),
              transform 700ms cubic-bezier(0.22,0.61,0.36,1);
  transition-delay: 700ms;
}
.ab-section .ab-col:nth-child(3) {
  transition: opacity 700ms cubic-bezier(0.22,0.61,0.36,1),
              transform 700ms cubic-bezier(0.22,0.61,0.36,1);
  transition-delay: 900ms;
}
.ab-section .ab-col:nth-child(1) .ab-quote {
  transition: opacity 500ms cubic-bezier(0.22,0.61,0.36,1);
  transition-delay: 1000ms;
}
.ab-section .ab-col:nth-child(2) .ab-quote {
  transition: opacity 500ms cubic-bezier(0.22,0.61,0.36,1);
  transition-delay: 1150ms;
}
.ab-section .ab-col:nth-child(3) .ab-quote {
  transition: opacity 500ms cubic-bezier(0.22,0.61,0.36,1);
  transition-delay: 1300ms;
}
.ab-section .ab-footer-rule {
  transition: opacity 600ms cubic-bezier(0.22,0.61,0.36,1),
              transform 600ms cubic-bezier(0.22,0.61,0.36,1);
  transition-delay: 1400ms;
}
.ab-section .ab-punchline {
  transition: opacity 800ms cubic-bezier(0.22,0.61,0.36,1),
              transform 800ms cubic-bezier(0.22,0.61,0.36,1);
  transition-delay: 1700ms;
}

/* ─── Revealed state ────────────────────────────────────────────── */
.ab-section.is-revealed .ab-headline,
.ab-section.is-revealed .ab-deck,
.ab-section.is-revealed .ab-col,
.ab-section.is-revealed .ab-col .ab-quote,
.ab-section.is-revealed .ab-footer-rule,
.ab-section.is-revealed .ab-punchline {
  opacity: 1;
  transform: none;
}

/* ─── Reduced motion: skip all transitions ──────────────────────── */
@media (prefers-reduced-motion: reduce) {
  .ab-section .ab-headline,
  .ab-section .ab-deck,
  .ab-section .ab-col,
  .ab-section .ab-quote,
  .ab-section .ab-footer-rule,
  .ab-section .ab-punchline {
    opacity: 1 !important;
    transform: none !important;
    transition: none !important;
  }
}

/* ─── Mobile (<900px) ───────────────────────────────────────────── */
@media (max-width: 899px) {
  .ab-deck      { font-size: 18px; margin-bottom: 56px; }
  .ab-grid      { grid-template-columns: 1fr; column-gap: 0; row-gap: 40px; }
  .ab-col       { min-height: auto; }
  .ab-punchline { margin-top: 64px; }
}
`

export default function AboutConflict() {
  const t = useTranslations('About.Triangle')
  const messages = useMessages()
  const nodes = ((messages as any).About.Triangle.nodes as Array<{
    kicker: string; role: string; description: string; edge_to: string; quote: string
  }>)

  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const section = sectionRef.current
    if (!section) return

    const cleanups: (() => void)[] = []

    /* ── Layer 1: Section entry reveal ── */
    if (reduced) {
      section.classList.add('is-revealed')
    } else {
      const obs = new IntersectionObserver(
        ([e]) => { if (e.isIntersecting) { section.classList.add('is-revealed'); obs.disconnect() } },
        { threshold: 0.25 }
      )
      obs.observe(section)
      cleanups.push(() => obs.disconnect())
    }

    /* ── Layer 2: em.news underline draw ── */
    const ems = Array.from(section.querySelectorAll('em.news'))
    ems.forEach(em => {
      const o = new IntersectionObserver(
        ([e]) => {
          if (e.isIntersecting) {
            setTimeout(() => em.classList.add('is-drawn'), reduced ? 0 : 200)
            o.disconnect()
          }
        },
        { threshold: 0.6 }
      )
      o.observe(em)
      cleanups.push(() => o.disconnect())
    })

    return () => cleanups.forEach(fn => fn())
  }, [])

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <section ref={sectionRef} className="ab-section">

        <h1 className="ab-headline">
          {t.rich('title', { em: (c) => <em className="news-serif">{c}</em> })}
        </h1>

        <p className="ab-deck">
          {t('intro')}
        </p>

        <div className="ab-grid">
          {nodes.map((node) => (
            <div key={node.role} className="ab-col">
              <div className="ab-num">— {node.kicker}</div>
              <h2 className="ab-role">{node.role}</h2>
              <p className="ab-role-desc">{node.description}</p>
              <div className="ab-quote">
                <span className="ab-quote-who">↔ {node.edge_to}</span>
                <p className="ab-quote-what">&ldquo;{node.quote}&rdquo;</p>
              </div>
            </div>
          ))}
        </div>

        <div className="ab-footer-rule">
          <span className="ab-fr-top">{t('caption')}</span>
          <span className="ab-fr-main">
            <Link href="/">shift.media</Link>
            {' · '}
            {t.rich('fourth_seat', {
              brand: (c) => <span>{c}</span>,
              em: (c) => <em className="news">{c}</em>,
            })}
          </span>
        </div>

        <p className="ab-punchline">
          {t.rich('outro', { em: (c) => <em className="news">{c}</em> })}
        </p>

      </section>
    </>
  )
}
