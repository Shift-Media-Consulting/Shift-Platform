import Link from 'next/link'

export const metadata = {
  title: 'SHIFT.MEDIA — Independent Production Advisory',
  description: 'Independent production advisory for brands and agencies — without the conflicts built into the system.',
}

export default function MarketingPage() {
  return (
    <main style={{ fontFamily: "'Poppins', Calibri, Arial, sans-serif", backgroundColor: '#F6F5F2', color: '#111111' }}>

      {/* ── NAV ── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        backgroundColor: '#F6F5F2',
        borderBottom: '1px solid #DDDDDD',
        padding: '0 56px',
        height: '64px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span style={{ fontSize: '18px' }}>
          <span style={{ fontWeight: 700 }}>SHIFT</span>
          <span style={{ color: '#00897B', fontWeight: 700 }}>.</span>
          <span style={{ fontWeight: 400 }}>MEDIA</span>
        </span>
        <Link href="/login" style={{
          fontSize: '13px', fontWeight: 700,
          color: '#00897B', textDecoration: 'none',
          border: '1px solid #00897B',
          padding: '7px 18px', borderRadius: '4px',
          letterSpacing: '0.3px',
        }}>
          Login ›
        </Link>
      </nav>

      {/* ── HERO ── */}
      <section style={{
        backgroundColor: '#111111',
        padding: '120px 56px 100px',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', right: '56px', top: '50%',
          transform: 'translateY(-50%)',
          fontSize: '320px', fontWeight: 700, color: '#1a1a1a',
          lineHeight: 1, userSelect: 'none', pointerEvents: 'none',
        }}>›</div>
        <div style={{ maxWidth: '720px', position: 'relative' }}>
          <p style={{ fontSize: '11px', fontWeight: 700, color: '#00897B', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '32px' }}>
            Independent Production Advisory · Hamburg
          </p>
          <h1 style={{ fontSize: '52px', fontWeight: 700, color: '#FFFFFF', lineHeight: 1.1, marginBottom: '32px' }}>
            Everyone in the room<br />has an agenda.<br />
            <span style={{ color: '#00897B' }}>We don't.</span>
          </h1>
          <p style={{ fontSize: '18px', color: '#888888', lineHeight: 1.7, maxWidth: '540px', marginBottom: '48px' }}>
            Independent production advisory for brands and agencies — without the conflicts built into the system.
          </p>
          <a href="mailto:justin@shift-media.org" style={{
            display: 'inline-block',
            backgroundColor: '#00897B', color: '#FFFFFF',
            fontSize: '14px', fontWeight: 700,
            padding: '14px 32px', borderRadius: '4px',
            textDecoration: 'none', letterSpacing: '0.3px',
          }}>
            Get in touch ›
          </a>
        </div>
      </section>

      {/* ── THE PROBLEM ── */}
      <section style={{ padding: '100px 56px', borderBottom: '1px solid #DDDDDD' }}>
        <div style={{ maxWidth: '1330px', margin: '0 auto' }}>
          <p style={{ fontSize: '11px', fontWeight: 700, color: '#00897B', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '16px' }}>The Problem</p>
          <h2 style={{ fontSize: '38px', fontWeight: 700, color: '#111111', maxWidth: '640px', lineHeight: 1.2, marginBottom: '64px' }}>
            The industry is faster, more complex, and more exposed than ever.
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2px' }}>
            {[
              { stat: 'Up to 25%', label: 'Agency markup routinely added to production costs — often without client knowledge or contractual transparency.', source: 'TrinityP3 / ANA' },
              { stat: '"Dysfunctional and conflicted"', label: 'The ANA\'s own words for the agency–production relationship. Brands and agencies are under mounting pressure to move faster with fewer resources.', source: 'ANA, 2017' },
              { stat: '€32bn', label: 'Germany\'s advertising market — the second-largest in Europe. The volume and complexity of production has never been greater.', source: 'Statista, 2023' },
            ].map(item => (
              <div key={item.stat} style={{
                backgroundColor: '#FFFFFF', padding: '40px 36px',
                borderLeft: '4px solid #00897B',
              }}>
                <div style={{ fontSize: '28px', fontWeight: 700, color: '#111111', marginBottom: '16px', lineHeight: 1.2 }}>{item.stat}</div>
                <p style={{ fontSize: '14px', color: '#555555', lineHeight: 1.7, marginBottom: '16px' }}>{item.label}</p>
                <p style={{ fontSize: '11px', color: '#888888', fontWeight: 700, letterSpacing: '0.5px' }}>{item.source}</p>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '2px', backgroundColor: '#FFFFFF', padding: '40px 36px', borderLeft: '4px solid #00897B' }}>
            <p style={{ fontSize: '16px', fontWeight: 700, color: '#111111', marginBottom: '12px' }}>The biggest structural issue</p>
            <p style={{ fontSize: '14px', color: '#555555', lineHeight: 1.7, maxWidth: '800px' }}>
              The Brand–Agency–Production Company triangle has built-in conflicts of interest. Agencies earn from the production companies they recommend. Production companies protect the relationships that feed them. Brands are the only party with no one independently in their corner — <span style={{ color: '#00897B', fontWeight: 700 }}>until now.</span>
            </p>
          </div>
        </div>
      </section>

      {/* ── WHAT WE DO ── */}
      <section style={{ padding: '100px 56px', borderBottom: '1px solid #DDDDDD', backgroundColor: '#FFFFFF' }}>
        <div style={{ maxWidth: '1330px', margin: '0 auto' }}>
          <p style={{ fontSize: '11px', fontWeight: 700, color: '#00897B', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '16px' }}>What We Do</p>
          <h2 style={{ fontSize: '38px', fontWeight: 700, color: '#111111', marginBottom: '64px' }}>Four pillars. One partner.</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
            {[
              {
                number: '01',
                title: 'Production Controlling',
                body: 'Cost intelligence and real-time visibility across every production.',
                points: ['Budget development & management', 'Cost reporting & variance analysis', 'Vendor & supplier negotiation', 'Buyout management', 'The SHIFT Platform'],
              },
              {
                number: '02',
                title: 'Strategic Advisory',
                body: 'Shaping how brands and agencies commission and plan content at scale.',
                points: ['Production strategy', 'Roster & director advisory', 'Sustainable production', 'Risk assessment', 'International structures'],
              },
              {
                number: '03',
                title: 'Organisational Design & Studio Builds',
                body: 'Building the production capability organisations need — from scratch or from inside.',
                points: ['In-house department design', 'Agency production builds', 'VFX · Post · AI studio builds'],
              },
              {
                number: '04',
                title: 'AI Integration & Transformation',
                body: 'Practical AI adoption in production — with governance, training, and real results.',
                points: ['AI readiness audit', 'Tool selection & workflow integration', 'Training & upskilling', 'Ethics & governance'],
              },
            ].map(pillar => (
              <div key={pillar.number} style={{
                padding: '40px 36px',
                border: '1px solid #DDDDDD',
                borderRadius: '4px',
                borderTop: '4px solid #00897B',
              }}>
                <p style={{ fontSize: '11px', fontWeight: 700, color: '#00897B', letterSpacing: '2px', marginBottom: '12px' }}>{pillar.number}</p>
                <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#111111', marginBottom: '12px' }}>{pillar.title}</h3>
                <p style={{ fontSize: '14px', color: '#555555', lineHeight: 1.6, marginBottom: '24px' }}>{pillar.body}</p>
                <div style={{ borderTop: '1px solid #DDDDDD', paddingTop: '20px' }}>
                  {pillar.points.map(p => (
                    <p key={p} style={{ fontSize: '13px', color: '#555555', marginBottom: '6px' }}>
                      <span style={{ color: '#00897B', marginRight: '8px' }}>›</span>{p}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── THE PLATFORM ── */}
      <section style={{ padding: '100px 56px', borderBottom: '1px solid #DDDDDD', backgroundColor: '#00897B' }}>
        <div style={{ maxWidth: '1330px', margin: '0 auto' }}>
          <p style={{ fontSize: '11px', fontWeight: 700, color: '#E8F5F3', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '16px' }}>The SHIFT Platform</p>
          <h2 style={{ fontSize: '38px', fontWeight: 700, color: '#FFFFFF', maxWidth: '560px', lineHeight: 1.2, marginBottom: '20px' }}>
            Your production, visible in real time.
          </h2>
          <p style={{ fontSize: '16px', color: '#E8F5F3', maxWidth: '560px', lineHeight: 1.7, marginBottom: '64px' }}>
            Our proprietary AI-driven client portal. Every production, every budget, every milestone — one place.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2px' }}>
            {[
              { title: 'Real-time budget dashboards', body: 'Actuals vs. estimates, updated live throughout production.' },
              { title: 'Milestone & approval tracking', body: 'Every gate, every sign-off, visible to every stakeholder.' },
              { title: 'AI cost alert & anomaly detection', body: 'Flags overruns before they become problems.' },
              { title: 'Buyout & rights management', body: 'Automated compliance tracking across markets and media.' },
              { title: 'Bid review & comparison', body: 'AI-summarised bids weighted against your priorities.' },
              { title: 'Multi-project portfolio view', body: 'All active productions in one dashboard — at a glance.' },
            ].map(feature => (
              <div key={feature.title} style={{
                backgroundColor: '#00695C',
                padding: '32px 28px',
              }}>
                <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#FFFFFF', marginBottom: '10px' }}>{feature.title}</h4>
                <p style={{ fontSize: '13px', color: '#B2DFDB', lineHeight: 1.6 }}>{feature.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHO WE WORK WITH ── */}
      <section style={{ padding: '100px 56px', borderBottom: '1px solid #DDDDDD' }}>
        <div style={{ maxWidth: '1330px', margin: '0 auto' }}>
          <p style={{ fontSize: '11px', fontWeight: 700, color: '#00897B', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '16px' }}>Who We Work With</p>
          <h2 style={{ fontSize: '38px', fontWeight: 700, color: '#111111', marginBottom: '64px' }}>Brands and agencies. Nothing else.</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            {[
              {
                type: 'Brands',
                points: [
                  'Direct advisory — brands working without an agency layer',
                  'Independent cost oversight for agency-managed productions',
                  'Insourcing brands building an internal production function',
                  'Global brands defining a European production strategy',
                ],
              },
              {
                type: 'Agencies',
                points: [
                  'Network agencies building production functions from scratch',
                  'Mid-sized agencies fixing underperforming production departments',
                  'Small agencies creating a production function from zero',
                  'Tendering agencies building credentials that win pitches',
                ],
              },
            ].map(group => (
              <div key={group.type} style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #DDDDDD',
                borderRadius: '4px',
                padding: '40px 36px',
                borderLeft: '4px solid #00897B',
              }}>
                <h3 style={{ fontSize: '22px', fontWeight: 700, color: '#111111', marginBottom: '28px' }}>{group.type}</h3>
                {group.points.map(p => (
                  <div key={p} style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                    <span style={{ color: '#00897B', fontWeight: 700, flexShrink: 0 }}>›</span>
                    <p style={{ fontSize: '14px', color: '#555555', lineHeight: 1.6 }}>{p}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div style={{ marginTop: '24px', padding: '24px 28px', backgroundColor: '#E8F5F3', borderRadius: '4px' }}>
            <p style={{ fontSize: '13px', color: '#00695C', fontWeight: 700 }}>
              We do not work with production companies as advisory clients. Our independence depends on it.
            </p>
          </div>
        </div>
      </section>

      {/* ── THE TEAM ── */}
      <section style={{ padding: '100px 56px', borderBottom: '1px solid #DDDDDD', backgroundColor: '#FFFFFF' }}>
        <div style={{ maxWidth: '1330px', margin: '0 auto' }}>
          <p style={{ fontSize: '11px', fontWeight: 700, color: '#00897B', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '16px' }}>The Team</p>
          <h2 style={{ fontSize: '38px', fontWeight: 700, color: '#111111', marginBottom: '12px' }}>Built by people who have done this work.</h2>
          <p style={{ fontSize: '16px', color: '#888888', marginBottom: '64px' }}>Between us, we have been inside productions — not just advising on them. That is the difference.</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            {[
              {
                name: 'Justin Stiebel',
                role: 'Co-Founder · Production Controlling & Advisory',
                bio: 'Production controlling and advisory specialist with deep market knowledge across German and European TVC, content, and campaign production. Has built and managed production budgets across formats from small social campaigns to large-scale international shoots. Specialist in the German market — its rates, its production companies, its directors, and its dynamics.',
                email: 'justin@shift-media.org',
              },
              {
                name: 'Cornelius Roenz',
                role: 'Co-Founder · Strategy & Organisational Design',
                bio: 'Production leader with extensive experience building and running production functions at agency and brand level across Europe. Has designed and implemented production departments, led organisational transformation, and advised on international production structures. Specialist in sustainable production strategy, emerging content formats, and the structural challenges facing agencies as the market shifts.',
                email: 'cornelius@shift-media.org',
              },
            ].map(person => (
              <div key={person.name} style={{
                padding: '40px 36px',
                border: '1px solid #DDDDDD',
                borderRadius: '4px',
              }}>
                <div style={{ width: '48px', height: '4px', backgroundColor: '#00897B', marginBottom: '24px' }} />
                <h3 style={{ fontSize: '22px', fontWeight: 700, color: '#111111', marginBottom: '6px' }}>{person.name}</h3>
                <p style={{ fontSize: '12px', fontWeight: 700, color: '#00897B', letterSpacing: '0.5px', marginBottom: '20px' }}>{person.role}</p>
                <p style={{ fontSize: '14px', color: '#555555', lineHeight: 1.7, marginBottom: '24px' }}>{person.bio}</p>
                <a href={`mailto:${person.email}`} style={{ fontSize: '13px', color: '#00897B', textDecoration: 'none', fontWeight: 700 }}>
                  {person.email} ›
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: '100px 56px', backgroundColor: '#111111' }}>
        <div style={{ maxWidth: '1330px', margin: '0 auto', textAlign: 'center' }}>
          <span style={{ fontSize: '80px', color: '#00897B', display: 'block', marginBottom: '32px', lineHeight: 1 }}>›</span>
          <h2 style={{ fontSize: '42px', fontWeight: 700, color: '#FFFFFF', marginBottom: '20px' }}>
            Strategy without conflict of interest.
          </h2>
          <p style={{ fontSize: '16px', color: '#888888', marginBottom: '48px', maxWidth: '480px', margin: '0 auto 48px' }}>
            If you're a brand or agency that wants independent production expertise, let's talk.
          </p>
          <a href="mailto:justin@shift-media.org" style={{
            display: 'inline-block',
            backgroundColor: '#00897B', color: '#FFFFFF',
            fontSize: '15px', fontWeight: 700,
            padding: '16px 40px', borderRadius: '4px',
            textDecoration: 'none', letterSpacing: '0.3px',
          }}>
            Get in touch ›
          </a>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{
        backgroundColor: '#111111',
        borderTop: '1px solid #1a1a1a',
        padding: '32px 56px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <span style={{ fontSize: '14px', color: '#555555' }}>
          <span style={{ fontWeight: 700, color: '#FFFFFF' }}>SHIFT</span>
          <span style={{ color: '#00897B', fontWeight: 700 }}>.</span>
          <span style={{ color: '#FFFFFF' }}>MEDIA</span>
          <span style={{ marginLeft: '16px' }}>· Hamburg, DE</span>
        </span>
        <span style={{ fontSize: '12px', color: '#555555' }}>© 2026 SHIFT MEDIA. All rights reserved.</span>
      </footer>

    </main>
  )
}
