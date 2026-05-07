import Nav from '@/components/marketing/Nav'
import Footer from '@/components/marketing/Footer'

export const metadata = {
  title: 'Contact — shift.media',
  description: 'Get in touch with shift.media. Independent production advisory based in Hamburg, DE.',
}

const FULL_GRADIENT = 'linear-gradient(180deg, #004d40 0%, #00695c 12%, #00897b 22%, #b9d8d2 32%, #f6f5f2 50%)'

const CALENDLY_URL = '[PLACEHOLDER — founders to supply Calendly link]'

export default function ContactPage() {
  return (
    <>
      <Nav />
      <main style={{ background: FULL_GRADIENT }} className="min-h-screen font-[family-name:var(--font-head)]">

        {/* HERO */}
        <section
          className="flex flex-col justify-end px-[var(--margin-x)] min-h-[60vh]"
          style={{
            paddingTop: 'clamp(120px, 18vw, 180px)',
            paddingBottom: 'clamp(56px, 8vw, 80px)',
          }}
        >
          <div className="max-w-[1100px]">
            <h1
              className="font-bold text-cream leading-[0.95] tracking-[-0.025em] mb-8"
              style={{ fontSize: 'clamp(48px, 7vw, 96px)' }}
            >
              Connect with{' '}
              <em className="not-italic font-bold text-ink tracking-[-0.02em]" style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>
                shift.media.
              </em>
            </h1>
            <p
              className="text-cream leading-[1.55] max-w-[560px] font-medium"
              style={{ fontSize: 'clamp(16px, 1.6vw, 18px)', opacity: 0.82 }}
            >
              Tell us about your production challenge. We&apos;ll come back within
              24 hours with an honest read on whether — and how — we can help.
            </p>
          </div>
        </section>

        {/* FORM + DETAILS */}
        <section
          className="px-[var(--margin-x)]"
          style={{ paddingTop: 'clamp(24px, 5vw, 40px)', paddingBottom: 'clamp(96px, 18vw, 160px)' }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-20 items-start max-w-[1200px]">

            {/* Form */}
            <div className="flex flex-col gap-10">
              <form action="mailto:hello@shift-media.io" method="post" encType="text/plain" className="flex flex-col gap-7">
                <p className="text-[11px] tracking-[2px] text-gray-warm mb-1" style={{ fontFamily: 'var(--font-mono)' }}>
                  SEND US A MESSAGE
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Field label="First name" name="firstName" required />
                  <Field label="Last name"  name="lastName"  required />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Field label="Work email" name="email" type="email" required />
                  <Field label="Company"    name="company" required />
                </div>

                <Field label="Role" name="role" />

                {/* Self-qualification */}
                <fieldset className="border-0 p-0 m-0 flex flex-col gap-3">
                  <legend
                    className="text-[11px] tracking-[1.5px] uppercase text-gray-warm mb-2"
                    style={{ fontFamily: 'var(--font-mono)' }}
                  >
                    What kind of conversation?
                  </legend>
                  {[
                    'A specific production challenge',
                    'An audit of our current setup',
                    'AI integration / operating model',
                    'In-house production build',
                    'Just exploring — happy to chat',
                  ].map(option => (
                    <label
                      key={option}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <input
                        type="radio"
                        name="conversationType"
                        value={option}
                        className="w-4 h-4 accent-[#004d40] cursor-pointer"
                      />
                      <span
                        className="font-medium text-[14px] text-ink/75 group-hover:text-ink transition-colors"
                        style={{ fontFamily: 'var(--font-head)' }}
                      >
                        {option}
                      </span>
                    </label>
                  ))}
                </fieldset>

                <Field label="What can we help with?" name="message" multiline required />

                <button
                  type="submit"
                  className={[
                    'group inline-flex items-center justify-center gap-2 self-start mt-3',
                    'rounded-full bg-ink text-cream font-bold text-[14px] tracking-[0.2px]',
                    'px-9 py-4 border-0 cursor-pointer',
                    'shadow-[0_4px_14px_rgba(0,0,0,0.18)]',
                    'transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
                    'hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(0,0,0,0.28)]',
                  ].join(' ')}
                  style={{ fontFamily: 'var(--font-head)' }}
                >
                  <span>Send message</span>
                  <span aria-hidden="true" className="inline-block transition-transform duration-300 group-hover:translate-x-1">›</span>
                </button>
              </form>

              {/* Calendly fallback */}
              <div className="pt-6" style={{ borderTop: '1px solid rgba(17,17,17,0.1)' }}>
                <p className="font-medium text-[14px] text-gray-warm mb-4">
                  Or skip the form.
                </p>
                <a
                  href={CALENDLY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={[
                    'group inline-flex items-center gap-2',
                    'rounded-full bg-transparent text-ink border border-ink/30',
                    'font-bold text-[14px] tracking-[0.2px]',
                    'px-8 py-3.5 no-underline',
                    'shadow-[0_4px_14px_rgba(0,0,0,0.08)]',
                    'transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
                    'hover:-translate-y-0.5 hover:bg-ink hover:text-cream hover:shadow-[0_12px_28px_rgba(0,0,0,0.18)]',
                  ].join(' ')}
                  style={{ fontFamily: 'var(--font-head)' }}
                >
                  <span>Book a 30-minute call directly</span>
                  <span aria-hidden="true" className="inline-block transition-transform duration-300 group-hover:translate-x-1">›</span>
                </a>
              </div>

              {/* Direct founder contacts */}
              <div className="pt-6" style={{ borderTop: '1px solid rgba(17,17,17,0.1)' }}>
                <p className="font-medium text-[14px] text-gray-warm mb-6">
                  Or, for a specific founder:
                </p>
                <div className="flex flex-col gap-4">
                  {[
                    { name: 'Justin Stiebel',    email: 'justin@shift-media.io' },
                    { name: 'Cornelius Roenz',   email: 'cornelius@shift-media.io' },
                    { name: 'Jankel Huppertz',   email: 'jankel@shift-media.io' },
                  ].map(({ name, email }) => (
                    <div key={email} className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <span className="font-medium text-[14px] text-ink">{name}</span>
                      <span className="text-gray-soft text-[12px]" style={{ fontFamily: 'var(--font-mono)' }}>·</span>
                      <a
                        href={`mailto:${email}`}
                        className="font-medium text-[14px] text-teal-mid no-underline hover:text-ink transition-colors"
                      >
                        {email}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Details */}
            <aside className="flex flex-col gap-12">
              <div>
                <p className="text-[11px] tracking-[2px] text-gray-warm mb-3.5" style={{ fontFamily: 'var(--font-mono)' }}>
                  DIRECT
                </p>
                <a
                  href="mailto:hello@shift-media.io"
                  className="font-bold text-ink no-underline tracking-[-0.02em] inline-block border-b-2 border-teal-mid pb-1.5"
                  style={{ fontSize: 'clamp(20px, 2.5vw, 28px)' }}
                >
                  hello@shift-media.io
                </a>
              </div>

              <div>
                <p className="text-[11px] tracking-[2px] text-gray-warm mb-3.5" style={{ fontFamily: 'var(--font-mono)' }}>
                  HEADQUARTERS
                </p>
                <p className="font-medium text-[16px] text-ink leading-[1.6]">
                  shift.media GmbH<br />
                  Hamburg, Germany
                </p>
              </div>

              <div>
                <p className="text-[11px] tracking-[2px] text-gray-warm mb-3.5" style={{ fontFamily: 'var(--font-mono)' }}>
                  RESPONSE TIME
                </p>
                <p className="font-medium text-[16px] text-ink leading-[1.6]">
                  Within 24 hours, Monday to Friday.
                </p>
              </div>

              <div className="pt-8 border-t border-ink/15">
                <p className="text-[11px] tracking-[2px] text-gray-warm mb-3" style={{ fontFamily: 'var(--font-mono)' }}>
                  PROMISE
                </p>
                <p className="font-medium text-[14px] text-ink/70 leading-[1.6]">
                  No pitch deck. No agenda. Just an honest conversation about
                  whether we can help — and how.
                </p>
              </div>
            </aside>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}

/* ─── Form field ─── */

type FieldProps = {
  label: string
  name: string
  type?: string
  required?: boolean
  multiline?: boolean
}

function Field({ label, name, type = 'text', required, multiline }: FieldProps) {
  const inputClass = [
    'w-full bg-transparent border-0 border-b border-ink/25',
    'py-3 text-[15px] text-ink font-medium outline-none',
    'focus:border-ink/60 transition-colors',
    'placeholder:text-ink/30',
  ].join(' ')

  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[11px] tracking-[1.5px] uppercase text-gray-warm" style={{ fontFamily: 'var(--font-mono)' }}>
        {label}{required && ' *'}
      </span>
      {multiline
        ? <textarea name={name} required={required} rows={4} className={`${inputClass} resize-y`} style={{ fontFamily: 'var(--font-head)' }} />
        : <input    type={type} name={name} required={required} className={inputClass} style={{ fontFamily: 'var(--font-head)' }} />
      }
    </label>
  )
}
