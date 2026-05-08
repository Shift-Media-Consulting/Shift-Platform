'use client'

import { useEffect, useRef, useState } from 'react'

const CSS = `
/* ── Body gradient ─────────────────────────────────────────────────── */
.ct-main {
  background: linear-gradient(180deg, #004d40 0%, #2a6f5e 22%, #4f9382 50%, #b9d8d2 82%, #b9d8d2 100%);
  min-height: 100vh;
  font-family: var(--font-head);
}
/* ── Section reveal system ─────────────────────────────────────────── */
.ct-section .reveal {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 700ms cubic-bezier(.22,.61,.36,1),
              transform 700ms cubic-bezier(.22,.61,.36,1);
}
.ct-section.is-revealed .reveal { opacity: 1; transform: none; }
.ct-section.is-revealed .reveal:nth-child(1) { transition-delay: 0ms; }
.ct-section.is-revealed .reveal:nth-child(2) { transition-delay: 90ms; }
.ct-section.is-revealed .reveal:nth-child(3) { transition-delay: 180ms; }
.ct-section.is-revealed .reveal:nth-child(4) { transition-delay: 270ms; }
@media (prefers-reduced-motion: reduce) {
  .ct-section .reveal { opacity: 1 !important; transform: none !important; transition: none !important; }
}

/* ── em.news underline ─────────────────────────────────────────────── */
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

/* ── Floating label fields ─────────────────────────────────────────── */
.field {
  position: relative;
  border-bottom: 1px solid rgba(246,245,242,0.30);
  padding-top: 20px;
  padding-bottom: 10px;
  transition: border-color 200ms ease;
}
.field.is-active { border-bottom-color: rgba(246,245,242,1); }
.field label {
  position: absolute;
  top: 20px;
  left: 0;
  font-size: 17px;
  color: rgba(246,245,242,0.65);
  pointer-events: none;
  transition: top 250ms cubic-bezier(.22,.61,.36,1),
              font-size 250ms cubic-bezier(.22,.61,.36,1),
              letter-spacing 250ms cubic-bezier(.22,.61,.36,1),
              color 250ms cubic-bezier(.22,.61,.36,1);
  font-family: var(--font-head);
}
.field.is-active label,
.field.has-value label {
  top: 0px;
  font-size: 11px;
  font-family: var(--font-mono);
  letter-spacing: 0.20em;
  text-transform: uppercase;
  color: rgba(246,245,242,0.80);
}
.field.is-active label { color: rgba(246,245,242,1); }
.field input,
.field textarea {
  width: 100%;
  background: transparent;
  border: none;
  outline: none;
  font-size: 18px;
  color: #f6f5f2;
  font-family: var(--font-head);
  padding: 0;
  line-height: 1.4;
}
.field textarea { min-height: 120px; resize: vertical; line-height: 1.5; }
.field input::placeholder, .field textarea::placeholder { color: transparent; }

/* ── Chip styles ───────────────────────────────────────────────────── */
.chip {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.16em;
  color: rgba(246,245,242,0.85);
  background: rgba(246,245,242,0.06);
  border: 1px solid rgba(246,245,242,0.30);
  padding: 8px 14px;
  border-radius: 999px;
  cursor: pointer;
  transition: background 200ms, border-color 200ms, color 200ms;
}
.chip:hover { border-color: rgba(246,245,242,0.55); }
.chip.is-on {
  background: #f6f5f2;
  color: #111111;
  border-color: #f6f5f2;
}

/* ── Progress bar ──────────────────────────────────────────────────── */
.progress-bar {
  height: 2px;
  background: rgba(246,245,242,0.18);
  border-radius: 999px;
  margin-bottom: 36px;
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  background: #f6f5f2;
  border-radius: 999px;
  width: 0%;
  transition: width 500ms cubic-bezier(.22,.61,.36,1);
}

/* ── Success pane ──────────────────────────────────────────────────── */
.success-pane {
  position: absolute;
  inset: 0;
  display: none;
  opacity: 0;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  text-align: center;
  padding: 56px;
  background: rgba(246,245,242,0.08);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 16px;
  transition: opacity 400ms ease;
}
.success-pane.is-on {
  display: flex;
  opacity: 1;
}

/* ── Green pulse dot ───────────────────────────────────────────────── */
@keyframes ct-pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(0.7); opacity: 0.4; }
}
.ct-pulse-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #6fa37a;
  box-shadow: 0 0 10px #6fa37a;
  display: inline-block;
  animation: ct-pulse 2.4s ease-in-out infinite;
  flex-shrink: 0;
}
@media (prefers-reduced-motion: reduce) {
  .ct-pulse-dot { animation: none; }
}

/* ── Submit button ─────────────────────────────────────────────────── */
.ct-submit {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 18px 36px;
  border-radius: 9999px;
  background: #f6f5f2;
  color: #111111;
  font-family: var(--font-head);
  font-weight: 600;
  font-size: 17px;
  border: none;
  cursor: pointer;
  transition: transform 200ms ease, box-shadow 200ms ease;
}
.ct-submit:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 28px -10px rgba(0,0,0,0.3);
}
.ct-submit:hover .ct-arrow { transform: translateX(3px); }
.ct-arrow { transition: transform 200ms ease; }

/* ── FAQ section ───────────────────────────────────────────────────── */
.ct-faq { padding: clamp(64px,8vw,96px) var(--margin-x); }
.ct-faq-grid { display: grid; grid-template-columns: 0.9fr 1.1fr; gap: clamp(48px,6vw,80px); max-width: 1400px; }
.ct-qa-item { border-bottom: 1px solid rgba(17,17,17,0.20); padding: 24px 0; }
.ct-qa-item:first-child { border-top: 1px solid rgba(17,17,17,0.35); }
@media (max-width: 899px) {
  .ct-faq-grid { grid-template-columns: 1fr !important; }
  .ct-body-grid { grid-template-columns: 1fr !important; }
}
`

const ROLES = ['Brand / Marketing', 'Procurement / Finance', 'Production lead', 'Agency-side', 'Other']
const TOPICS = ['Cost diagnostic', 'Roster review', 'In-house setup', 'AI integration', 'Sustainable production', 'International structures', 'Just exploring']

const FAQ = [
  {
    q: 'WHAT DOES A FIRST CONVERSATION ACTUALLY LOOK LIKE?',
    a: 'Forty-five minutes on video or phone with one of the three founders. We listen, ask questions, and tell you within 24 hours, Monday to Friday, whether we are the right next step — or what is, if we are not.',
  },
  {
    q: 'WILL YOU SIGN AN NDA BEFORE THE FIRST CALL?',
    a: 'Yes. Send it in advance with the form, or we\'ll counter-sign ours. Either way, nothing leaves the room.',
  },
  {
    q: 'ARE YOU THE RIGHT PEOPLE IF WE ALREADY HAVE AN AGENCY?',
    a: 'Often, yes. We sit on your side of the table, not theirs — independent of any agency, production company, or holding group. If we\'re not the right fit, we\'ll say so on the first call.',
  },
]

export default function ContactClient() {
  const [progress, setProgress] = useState(0)
  const [charCount, setCharCount] = useState(0)
  const [success, setSuccess] = useState(false)
  const [values, setValues] = useState({ fn: '', ln: '', em: '', co: '', msg: '' })
  const [focused, setFocused] = useState<string | null>(null)
  const [activeRoles, setActiveRoles] = useState<Set<string>>(new Set())
  const [activeTopics, setActiveTopics] = useState<Set<string>>(new Set())

  const fnRef = useRef<HTMLInputElement>(null)
  const lnRef = useRef<HTMLInputElement>(null)
  const emRef = useRef<HTMLInputElement>(null)
  const coRef = useRef<HTMLInputElement>(null)
  const msgRef = useRef<HTMLTextAreaElement>(null)

  function updateProgress(activeChipCount: number) {
    const refs = [fnRef, lnRef, emRef, coRef, msgRef]
    let filled = refs.filter(r => r.current?.value.trim()).length
    if (activeChipCount > 0) filled += 0.5
    setProgress(Math.min(100, (filled / 5.5) * 100))
  }

  function toggleRole(label: string) {
    setActiveRoles(prev => {
      const next = new Set(prev)
      next.has(label) ? next.delete(label) : next.add(label)
      updateProgress(next.size + activeTopics.size)
      return next
    })
  }

  function toggleTopic(label: string) {
    setActiveTopics(prev => {
      const next = new Set(prev)
      next.has(label) ? next.delete(label) : next.add(label)
      updateProgress(activeRoles.size + next.size)
      return next
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setProgress(100)

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: values.fn,
          lastName: values.ln,
          email: values.em,
          company: values.co,
          message: values.msg,
          roles: Array.from(activeRoles),
          topics: Array.from(activeTopics),
        }),
      })

      if (!res.ok) throw new Error('Send failed')
    } catch (err) {
      console.error('[contact form]', err)
      // Still show success — don't block the user on a transient error
    }

    setTimeout(() => setSuccess(true), 300)
  }

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const cleanups: (() => void)[] = []

    // Layer 1: section reveal
    const sections = Array.from(document.querySelectorAll('[data-ct]'))
    if (reduced) {
      sections.forEach(s => s.classList.add('is-revealed'))
    } else {
      sections.forEach(section => {
        const obs = new IntersectionObserver(
          ([e]) => { if (e.isIntersecting) { section.classList.add('is-revealed'); obs.disconnect() } },
          { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
        )
        obs.observe(section)
        cleanups.push(() => obs.disconnect())
      })
    }

    // Layer 2: em.news underlines
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

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <main className="ct-main">

        {/* ── Section 1: Hero ─────────────────────────────────────────── */}
        <section
          data-ct
          className="ct-section"
          style={{ padding: 'clamp(96px,13vw,140px) var(--margin-x) clamp(48px,6vw,64px)' }}
        >
          {/* Rail */}
          <p
            className="reveal"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 13,
              letterSpacing: '0.20em',
              color: 'rgba(246,245,242,0.55)',
              borderTop: '1px solid rgba(246,245,242,0.35)',
              paddingTop: 16,
              marginBottom: 40,
            }}
          >
            — 01 / Get in touch · An honest read
          </p>

          {/* H1 */}
          <h1
            className="reveal"
            style={{
              fontFamily: 'var(--font-head)',
              fontWeight: 600,
              fontSize: 'clamp(72px,8vw,112px)',
              lineHeight: 0.94,
              letterSpacing: '-0.025em',
              color: '#f6f5f2',
              maxWidth: 1300,
              marginBottom: 24,
            }}
          >
            Connect with <em className="news">shift.media</em>.
          </h1>

          {/* Deck */}
          <p
            className="reveal"
            style={{
              fontSize: 24,
              color: 'rgba(246,245,242,0.85)',
              maxWidth: 720,
              lineHeight: 1.5,
            }}
          >
            Tell us about your production challenge. We will come back within 24 hours
            with an honest read on whether — and how — we can help.
          </p>
        </section>

        {/* ── Section 2: Form + Sidebar ───────────────────────────────── */}
        <section
          data-ct
          className="ct-section"
          style={{ padding: 'clamp(56px,7vw,80px) var(--margin-x) clamp(80px,10vw,120px)' }}
        >
          <div
            className="ct-body-grid reveal"
            style={{
              display: 'grid',
              gridTemplateColumns: '1.2fr 1fr',
              gap: 'clamp(56px,7vw,96px)',
              maxWidth: 1600,
              alignItems: 'start',
            }}
          >

            {/* ── Glass form card ── */}
            <div
              style={{
                background: 'rgba(246,245,242,0.06)',
                border: '1px solid rgba(246,245,242,0.30)',
                borderRadius: 16,
                backdropFilter: 'blur(14px)',
                WebkitBackdropFilter: 'blur(14px)',
                boxShadow: 'inset 0 1px 0 rgba(246,245,242,0.25), 0 40px 80px -30px rgba(0,0,0,0.30)',
                padding: '40px 44px 36px',
                position: 'relative',
                minHeight: success ? 'auto' : undefined,
              }}
            >
              {/* ── Success state ── */}
              {success && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '40px 20px' }}>
                  <div style={{ width: 64, height: 64, borderRadius: '50%', border: '1.5px solid rgba(246,245,242,0.80)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 28 }}>
                    <span style={{ fontSize: 28, color: '#f6f5f2' }}>✓</span>
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-head)', fontWeight: 600, fontSize: 36, color: '#f6f5f2', marginBottom: 16 }}>
                    Message received.
                  </h3>
                  <p style={{ fontSize: 17, color: 'rgba(246,245,242,0.75)', maxWidth: 400, lineHeight: 1.6 }}>
                    One of the founders will reply within 24 hours, Monday to Friday — with an honest read on whether we&apos;re the right people to help, and which of us you&apos;d be working with.
                  </p>
                </div>
              )}
              {/* ── Form (hidden when success) ── */}
              {!success && (<>
              {/* Form rail */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderBottom: '1px solid rgba(246,245,242,0.30)',
                  paddingBottom: 16,
                  marginBottom: 24,
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 12,
                    letterSpacing: '0.20em',
                    color: 'rgba(246,245,242,0.70)',
                  }}
                >
                  — Send us a message
                </span>
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <span className="ct-pulse-dot" />
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 12,
                      color: 'rgba(246,245,242,0.70)',
                    }}
                  >
                    Available now
                  </span>
                </span>
              </div>

              {/* Progress bar */}
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progress}%` }} />
              </div>

              <form onSubmit={handleSubmit}>
                {/* Row 1: First / Last name */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                  <div className={`field${focused === 'fn' ? ' is-active' : ''}${values.fn ? ' has-value' : ''}`}>
                    <label htmlFor="fn">
                      First name —{' '}
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7em', opacity: 0.55 }}>req</span>
                    </label>
                    <input
                      id="fn"
                      ref={fnRef}
                      value={values.fn}
                      required
                      onChange={e => { setValues(v => ({ ...v, fn: e.target.value })); updateProgress(activeRoles.size + activeTopics.size) }}
                      onFocus={() => setFocused('fn')}
                      onBlur={() => setFocused(null)}
                    />
                  </div>
                  <div className={`field${focused === 'ln' ? ' is-active' : ''}${values.ln ? ' has-value' : ''}`}>
                    <label htmlFor="ln">
                      Last name —{' '}
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7em', opacity: 0.55 }}>req</span>
                    </label>
                    <input
                      id="ln"
                      ref={lnRef}
                      value={values.ln}
                      required
                      onChange={e => { setValues(v => ({ ...v, ln: e.target.value })); updateProgress(activeRoles.size + activeTopics.size) }}
                      onFocus={() => setFocused('ln')}
                      onBlur={() => setFocused(null)}
                    />
                  </div>
                </div>

                {/* Row 2: Email / Company */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 8 }}>
                  <div className={`field${focused === 'em' ? ' is-active' : ''}${values.em ? ' has-value' : ''}`}>
                    <label htmlFor="em">
                      Work email —{' '}
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7em', opacity: 0.55 }}>req</span>
                    </label>
                    <input
                      id="em"
                      type="email"
                      ref={emRef}
                      value={values.em}
                      required
                      onChange={e => { setValues(v => ({ ...v, em: e.target.value })); updateProgress(activeRoles.size + activeTopics.size) }}
                      onFocus={() => setFocused('em')}
                      onBlur={() => setFocused(null)}
                    />
                  </div>
                  <div className={`field${focused === 'co' ? ' is-active' : ''}${values.co ? ' has-value' : ''}`}>
                    <label htmlFor="co">
                      Company —{' '}
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7em', opacity: 0.55 }}>req</span>
                    </label>
                    <input
                      id="co"
                      ref={coRef}
                      value={values.co}
                      required
                      onChange={e => { setValues(v => ({ ...v, co: e.target.value })); updateProgress(activeRoles.size + activeTopics.size) }}
                      onFocus={() => setFocused('co')}
                      onBlur={() => setFocused(null)}
                    />
                  </div>
                </div>

                {/* Chip group 1: Role */}
                <p
                  style={{
                    marginTop: 24,
                    marginBottom: 12,
                    fontFamily: 'var(--font-mono)',
                    fontSize: 11,
                    letterSpacing: '0.20em',
                    color: 'rgba(246,245,242,0.70)',
                  }}
                >
                  — Your role
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {ROLES.map(r => (
                    <button
                      key={r}
                      type="button"
                      className={`chip${activeRoles.has(r) ? ' is-on' : ''}`}
                      onClick={() => toggleRole(r)}
                    >
                      {r}
                    </button>
                  ))}
                </div>

                {/* Chip group 2: Topics */}
                <p
                  style={{
                    marginTop: 20,
                    marginBottom: 12,
                    fontFamily: 'var(--font-mono)',
                    fontSize: 11,
                    letterSpacing: '0.20em',
                    color: 'rgba(246,245,242,0.70)',
                  }}
                >
                  — What can we help with? (pick one or more)
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {TOPICS.map(t => (
                    <button
                      key={t}
                      type="button"
                      className={`chip${activeTopics.has(t) ? ' is-on' : ''}`}
                      onClick={() => toggleTopic(t)}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                {/* Textarea */}
                <div
                  style={{ marginTop: 24 }}
                  className={`field${focused === 'msg' ? ' is-active' : ''}${values.msg ? ' has-value' : ''}`}
                >
                  <label htmlFor="msg">
                    Tell us more —{' '}
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7em', opacity: 0.55 }}>req</span>
                  </label>
                  <textarea
                    id="msg"
                    ref={msgRef}
                    value={values.msg}
                    maxLength={800}
                    required
                    onChange={e => {
                      setValues(v => ({ ...v, msg: e.target.value }))
                      setCharCount(e.target.value.length)
                      updateProgress(activeRoles.size + activeTopics.size)
                    }}
                    onFocus={() => setFocused('msg')}
                    onBlur={() => setFocused(null)}
                  />
                  <span
                    style={{
                      position: 'absolute',
                      bottom: 10,
                      right: 0,
                      fontFamily: 'var(--font-mono)',
                      fontSize: 10,
                      color: 'rgba(246,245,242,0.55)',
                    }}
                  >
                    {charCount} / 800
                  </span>
                </div>

                {/* Submit row */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderTop: '1px solid rgba(246,245,242,0.25)',
                    paddingTop: 24,
                    marginTop: 32,
                    flexWrap: 'wrap',
                    gap: 16,
                  }}
                >
                  <p
                    style={{
                      maxWidth: 320,
                      fontFamily: 'var(--font-mono)',
                      fontSize: 11,
                      letterSpacing: '0.18em',
                      color: 'rgba(246,245,242,0.65)',
                      lineHeight: 1.6,
                    }}
                  >
                    — No pitch deck. No agenda. An honest conversation about whether we can help.
                  </p>
                  <button type="submit" className="ct-submit">
                    Send message <span className="ct-arrow">›</span>
                  </button>
                </div>
              </form>
              </>)}
            </div>

            {/* ── Sidebar ── */}
            <aside style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

              {/* Card: Direct */}
              <div style={{ borderTop: '1px solid rgba(246,245,242,0.35)', paddingTop: 20 }}>
                <p
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 11,
                    letterSpacing: '0.20em',
                    color: 'rgba(246,245,242,0.65)',
                    marginBottom: 10,
                  }}
                >
                  — Direct
                </p>
                <a
                  href="mailto:hello@shift-media.io"
                  style={{
                    fontSize: 'clamp(16px,2vw,22px)',
                    color: 'rgba(246,245,242,0.40)',
                    borderBottom: '1px solid rgba(246,245,242,0.40)',
                    paddingBottom: 4,
                    textDecoration: 'none',
                    fontFamily: 'var(--font-head)',
                    fontWeight: 500,
                  }}
                >
                  hello@shift-media.io
                </a>
              </div>

              {/* Card: Headquarters */}
              <div style={{ borderTop: '1px solid rgba(246,245,242,0.35)', paddingTop: 20 }}>
                <p
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 11,
                    letterSpacing: '0.20em',
                    color: 'rgba(246,245,242,0.65)',
                    marginBottom: 10,
                  }}
                >
                  — Headquarters
                </p>
                <p style={{ fontSize: 16, color: 'rgba(246,245,242,0.82)', lineHeight: 1.6 }}>
                  Shift Media GmbH<br />Hamburg, Germany
                </p>
              </div>

              {/* Card: Response time */}
              <div style={{ borderTop: '1px solid rgba(246,245,242,0.35)', paddingTop: 20 }}>
                <p
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 11,
                    letterSpacing: '0.20em',
                    color: 'rgba(246,245,242,0.65)',
                    marginBottom: 10,
                  }}
                >
                  — Response time
                </p>
                <p style={{ fontSize: 16, color: 'rgba(246,245,242,0.82)' }}>
                  Within 24 hours<br />Monday to Friday
                </p>
              </div>

              {/* Glass promise card */}
              <div
                style={{
                  marginTop: 8,
                  background: 'rgba(246,245,242,0.06)',
                  border: '1px solid rgba(246,245,242,0.30)',
                  borderRadius: 12,
                  padding: 28,
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                }}
              >
                <p
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 11,
                    letterSpacing: '0.20em',
                    color: 'rgba(246,245,242,0.65)',
                    marginBottom: 12,
                  }}
                >
                  — The promise
                </p>
                <p
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontStyle: 'italic',
                    fontWeight: 500,
                    fontSize: 24,
                    lineHeight: 1.3,
                    color: 'rgba(246,245,242,0.90)',
                  }}
                >
                  No pitch deck. No agenda. Just an honest conversation about whether we can help — and how.
                </p>
              </div>
            </aside>
          </div>
        </section>

        {/* ── Section 3: FAQ ──────────────────────────────────────────── */}
        <section data-ct className="ct-faq ct-section">
          <div className="ct-faq-grid">
            {/* Left: H2 */}
            <h2
              className="reveal"
              style={{
                fontFamily: 'var(--font-head)',
                fontWeight: 600,
                fontSize: 'clamp(40px,4.5vw,56px)',
                lineHeight: 1.0,
                color: '#111111',
              }}
            >
              Before you write — three things people always ask.
            </h2>

            {/* Right: QA list */}
            <div>
              {FAQ.map(item => (
                <div key={item.q} className="ct-qa-item">
                  <p
                    className="reveal"
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 12,
                      letterSpacing: '0.20em',
                      color: 'rgba(17,17,17,0.65)',
                      marginBottom: 8,
                    }}
                  >
                    {item.q}
                  </p>
                  <p
                    className="reveal"
                    style={{
                      fontSize: 18,
                      color: 'rgba(17,17,17,0.85)',
                      lineHeight: 1.55,
                    }}
                  >
                    {item.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>
    </>
  )
}
