import Nav from '@/components/marketing/Nav'
import Footer from '@/components/marketing/Footer'
import PillButton from '@/components/marketing/PillButton'
import AboutTriangle from './AboutTriangle'

export const metadata = {
  title: 'About — shift.media',
  description: 'shift.media exists to give brands an independent voice in production — built on expertise, not affiliation.',
}

const BODY_GRADIENT = 'linear-gradient(180deg, #004d40 0%, #00695c 12%, #00897b 22%, #b9d8d2 32%, #f6f5f2 50%)'

const differences = [
  {
    num: '01',
    name: 'Genuinely independent',
    desc: 'We are not a production company. We are not an agency. We have no financial relationships with the directors or production companies we recommend — our advice is only ever in the client\'s interest.',
  },
  {
    num: '02',
    name: 'Real production knowledge',
    desc: 'Our team has built, run, and controlled productions. We have been on set, in the edit suite, and in the negotiations. Every recommendation is grounded in what actually happens — not what a slide deck says should happen.',
  },
  {
    num: '03',
    name: 'Methodology, not opinions',
    desc: 'shift.media operates on a documented methodology — the Shift Method — proprietary tooling, and a replicable advisory framework. Every engagement runs on the same diagnostic, the same playbooks, and the same review structure. Clients get institutional quality — not individual availability.',
  },
  {
    num: '04',
    name: 'Built for where it\'s going',
    desc: 'Most production advisors were built for the industry as it was. We were built for the one that\'s coming — AI-native operating models, in-housing, budget accountability, and the unbundling of the agency model. We started there. We didn\'t bolt it on.',
  },
]

const beliefs = [
  {
    statement: 'Production budgets should be transparent.',
    emphasis: 'They almost never are.',
  },
  {
    statement: 'AI does not replace production craft.',
    emphasis: 'It removes the parts that were never craft.',
  },
  {
    statement: 'In-house is not cheaper by default.',
    emphasis: 'Done badly, it\'s more expensive than what it replaced.',
  },
  {
    statement: 'The best production decision is often a smaller one,',
    emphasis: 'sooner.',
  },
]

export default function AboutPage() {
  return (
    <>
      <Nav />
      <main style={{ background: BODY_GRADIENT }} className="min-h-screen font-[family-name:var(--font-head)]">

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
              Built on expertise.{' '}
              <em className="not-italic font-bold text-ink tracking-[-0.02em]" style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>
                Not affiliation.
              </em>
            </h1>

            <p
              className="text-cream leading-[1.55] max-w-[600px] font-medium"
              style={{ fontSize: 'clamp(16px, 1.6vw, 18px)', opacity: 0.82 }}
            >
              shift.media exists to give brands an independent voice in
              production — without the conflicts of interest built into the
              brand–agency–production system.
            </p>
          </div>
        </section>

        {/* WHY WE EXIST */}
        <section
          className="px-[var(--margin-x)]"
          style={{ paddingTop: 'clamp(56px, 10vw, 80px)', paddingBottom: 'clamp(56px, 10vw, 80px)' }}
        >
          <div className="max-w-[1100px]">
            <p className="text-[11px] tracking-[2.5px] text-teal-mid mb-5 font-medium" style={{ fontFamily: 'var(--font-mono)' }}>
              WHY
            </p>
            <h2
              className="font-bold text-cream leading-[1.05] tracking-[-0.02em] mb-10 max-w-[900px]"
              style={{ fontSize: 'clamp(28px, 3.8vw, 48px)' }}
            >
              The brand–agency–production triangle has{' '}
              <em className="not-italic font-bold text-cream/70" style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>
                built-in conflicts.
              </em>
            </h2>

            {/* Interactive Triangle */}
            <div className="mb-12 sm:mb-14">
              <AboutTriangle />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 max-w-[900px]">
              <p className="font-medium text-[16px] sm:text-[17px] text-cream/85 leading-[1.65]">
                Agencies are often financially tied to the size of production
                budgets. Production companies rely on ongoing agency
                relationships. Brands are the only party with no one
                independently in their corner.
              </p>
              <p className="font-medium text-[16px] sm:text-[17px] text-cream/85 leading-[1.65]">
                A market this complex, this unregulated, and this large does
                not need another agency. It needs an independent partner.
              </p>
            </div>
          </div>
        </section>

        {/* OUR DIFFERENCE */}
        <section
          className="px-[var(--margin-x)]"
          style={{ paddingTop: 'clamp(56px, 10vw, 80px)', paddingBottom: 'clamp(56px, 10vw, 80px)' }}
        >
          <div className="max-w-[1200px]">
            <p className="text-[11px] tracking-[2.5px] text-teal-mid mb-5 font-medium" style={{ fontFamily: 'var(--font-mono)' }}>
              WHAT
            </p>
            <h2
              className="font-bold text-ink leading-[1.0] tracking-[-0.02em] mb-12 sm:mb-16 max-w-[900px]"
              style={{ fontSize: 'clamp(32px, 4.5vw, 60px)' }}
            >
              We have no relationships{' '}
              <em className="not-italic font-bold text-teal-mid" style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>
                to protect.
              </em>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-10 sm:gap-y-14 gap-x-8">
              {differences.map(item => (
                <div key={item.num} className="flex flex-col">
                  <p className="text-[11px] tracking-[1px] text-gray-soft mb-5" style={{ fontFamily: 'var(--font-mono)' }}>
                    [{item.num}]
                  </p>
                  <h3 className="font-bold text-[20px] text-ink leading-[1.05] tracking-[-0.015em] mb-3.5">
                    {item.name}
                  </h3>
                  <p className="font-medium text-[14px] text-gray-warm leading-[1.65]">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WHAT WE BELIEVE */}
        <section
          className="px-[var(--margin-x)]"
          style={{ paddingTop: 'clamp(56px, 10vw, 80px)', paddingBottom: 'clamp(56px, 10vw, 80px)' }}
        >
          <div className="max-w-[900px]">
            <h2
              className="font-bold text-ink leading-[1.0] tracking-[-0.02em] mb-12 sm:mb-16"
              style={{ fontSize: 'clamp(32px, 4.5vw, 60px)' }}
            >
              What we{' '}
              <em className="not-italic font-bold text-teal-mid" style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>
                believe.
              </em>
            </h2>

            <div className="flex flex-col gap-10 sm:gap-12">
              {beliefs.map((b, i) => (
                <div key={i} className="border-l-2 border-teal-mid/30 pl-7 sm:pl-9">
                  <p
                    className="font-bold text-ink leading-[1.1] tracking-[-0.02em] mb-2"
                    style={{ fontSize: 'clamp(20px, 2.8vw, 30px)' }}
                  >
                    {b.statement}
                  </p>
                  <p
                    className="font-bold text-teal-mid leading-[1.1] tracking-[-0.02em]"
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontStyle: 'italic',
                      fontSize: 'clamp(20px, 2.8vw, 30px)',
                    }}
                  >
                    {b.emphasis}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FOUNDER NOTE */}
        <section
          className="px-[var(--margin-x)]"
          style={{ paddingTop: 'clamp(56px, 10vw, 80px)', paddingBottom: 'clamp(56px, 10vw, 80px)' }}
        >
          <div className="max-w-[760px]">
            <h2
              className="font-bold text-ink leading-[1.0] tracking-[-0.02em] mb-10"
              style={{ fontSize: 'clamp(32px, 4.5vw, 60px)' }}
            >
              Why we{' '}
              <em className="not-italic font-bold text-teal-mid" style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>
                built this.
              </em>
            </h2>

            <div className="flex flex-col gap-6 mb-10">
              <p className="font-medium text-[16px] sm:text-[17px] text-gray-warm leading-[1.65]">
                We started shift.media in Hamburg because the independent
                production advisor we&apos;d want to hire didn&apos;t exist in Europe —
                at least not the way we thought it should.
              </p>
              <p className="font-medium text-[16px] sm:text-[17px] text-gray-warm leading-[1.65]">
                Three founders. Decades on set. One firm built around the
                conviction that brands deserve a partner who is genuinely on
                their side.
              </p>
            </div>

            <p
              className="font-bold text-[14px] text-ink/60 tracking-[0.3px]"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              — Justin Stiebel · Cornelius Roenz · Jankel Huppertz
            </p>
          </div>
        </section>

        {/* HOW WE WORK — METHOD LINK */}
        <section
          className="px-[var(--margin-x)]"
          style={{ paddingTop: 'clamp(56px, 10vw, 80px)', paddingBottom: 'clamp(56px, 10vw, 80px)' }}
        >
          <div className="max-w-[760px]">
            <p className="text-[11px] tracking-[2.5px] text-teal-mid mb-5 font-medium" style={{ fontFamily: 'var(--font-mono)' }}>
              HOW
            </p>
            <h2
              className="font-bold text-ink leading-[1.0] tracking-[-0.02em] mb-6"
              style={{ fontSize: 'clamp(28px, 3.8vw, 48px)' }}
            >
              Read how we{' '}
              <em className="not-italic font-bold text-teal-mid" style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>
                work.
              </em>
            </h2>
            <p className="font-medium text-[16px] sm:text-[17px] text-gray-warm leading-[1.65] mb-10 max-w-[520px]">
              The Shift Method. Six dimensions. A clear diagnostic, a prioritised
              roadmap, and a defensible plan.
            </p>
            <PillButton href="/method" variant="teal" size="md">
              Read the Method
            </PillButton>
          </div>
        </section>

        {/* CLOSING CTA */}
        <section
          className="px-[var(--margin-x)]"
          style={{ paddingTop: 'clamp(24px, 4vw, 40px)', paddingBottom: 'clamp(80px, 14vw, 120px)' }}
        >
          <PillButton href="/team" variant="outline-ink" size="md">
            Meet the team
          </PillButton>
        </section>

      </main>
      <Footer />
    </>
  )
}
