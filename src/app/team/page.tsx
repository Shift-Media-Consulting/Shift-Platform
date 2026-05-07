import Nav from '@/components/marketing/Nav'
import Footer from '@/components/marketing/Footer'
import PillButton from '@/components/marketing/PillButton'
import PageReveal from '@/components/marketing/PageReveal'
import TeamGrid from './TeamGrid'

export const metadata = {
  title: 'Team — shift.media',
  description: 'The team behind shift.media. Three co-founders and an independent partner network.',
}

const BODY_GRADIENT = 'linear-gradient(180deg, #004d40 0%, #00695c 8%, #00897b 20%, #4db6a0 48%, #b9d8d2 68%, #f6f5f2 82%)'

export default function TeamPage() {
  return (
    <>
      <Nav />
      <PageReveal />
      <main style={{ background: BODY_GRADIENT }} className="min-h-screen font-[family-name:var(--font-head)]">

        {/* HERO */}
        <section
          data-ab
          className="flex flex-col justify-end px-[var(--margin-x)] min-h-[60vh]"
          style={{
            paddingTop: 'clamp(120px, 18vw, 180px)',
            paddingBottom: 'clamp(56px, 8vw, 80px)',
          }}
        >
          <div className="max-w-[1100px]">
            <h1
              className="ab-h font-bold text-cream leading-[0.95] tracking-[-0.025em] mb-8"
              style={{ fontSize: 'clamp(48px, 7vw, 96px)' }}
            >
              Built by people who have{' '}
              <em className="not-italic font-bold text-ink tracking-[-0.02em]" style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>
                done this work.
              </em>
            </h1>

            <p
              className="ab-p text-cream/80 leading-[1.55] max-w-[560px] font-medium"
              style={{ fontSize: 'clamp(16px, 1.6vw, 18px)' }}
            >
              Three co-founders. One independent partner network.
              Decades of hands-on production experience — from cost control
              to creative delivery.
            </p>
          </div>
        </section>

        {/* TEAM GRID — complex client component, fades in as a unit */}
        <section data-ab>
          <div className="ab-card">
            <TeamGrid />
          </div>
        </section>

        {/* GET IN TOUCH CTA */}
        <section
          data-ab
          className="px-[var(--margin-x)]"
          style={{ paddingTop: 'clamp(56px, 10vw, 80px)', paddingBottom: 'clamp(80px, 14vw, 120px)' }}
        >
          <div className="max-w-[760px]">
            <h2
              className="ab-h font-bold text-ink leading-[1.05] tracking-[-0.02em] mb-6"
              style={{ fontSize: 'clamp(28px, 3.8vw, 48px)' }}
            >
              Ready to{' '}
              <em className="not-italic font-bold text-teal-mid" style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>
                talk?
              </em>
            </h2>
            <p className="ab-p font-medium text-[16px] sm:text-[17px] text-gray-warm leading-[1.65] mb-10 max-w-[480px]">
              No pitch deck. No agenda. Just an honest conversation about whether
              we can help — and how.
            </p>
            <div className="ab-btn flex flex-wrap gap-4">
              <PillButton href="/contact" variant="teal" size="md">Get in touch</PillButton>
              <PillButton href="/services" variant="outline-ink" size="md">See how we work</PillButton>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
