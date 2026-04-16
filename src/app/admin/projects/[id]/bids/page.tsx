import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import BidReviewCard from './BidReviewCard'

export const metadata = { title: 'Bid Review — SHIFT Platform' }

export default async function BidReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: project }, { data: partners }, { data: bids }, { data: budgets }] = await Promise.all([
    supabase.from('projects').select('id, project_id, project_name, budget').eq('id', id).single(),
    supabase.from('production_partners').select('id, company_name, status, bid_submitted, bid_approved').eq('project_id', id).order('company_name'),
    supabase.from('bids').select('id, partner_id, creative_url, ai_summary, ai_flags, consultant_notes, shift_recommendation, approved_for_client').eq('project_id', id),
    supabase.from('budgets').select('id, partner_id, total_net, director, version, status').eq('project_id', id).order('submitted_at', { ascending: false }),
  ])

  if (!project) notFound()

  // Build lookup maps
  const bidByPartner = Object.fromEntries((bids ?? []).map(b => [b.partner_id, b]))
  const budgetByPartner = Object.fromEntries(
    (budgets ?? []).reduce<[string, any][]>((acc, b) => {
      // take only the latest budget per partner (already ordered desc)
      if (!acc.find(([pid]) => pid === b.partner_id)) acc.push([b.partner_id, b])
      return acc
    }, [])
  )

  const approvedCount = (bids ?? []).filter(b => b.approved_for_client).length
  const submittedCount = (partners ?? []).filter(p => p.bid_submitted).length

  return (
    <>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <p style={{ fontSize: '11px', fontWeight: 700, color: '#00897B', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '4px' }}>
          <Link href="/admin/projects" style={{ color: '#00897B', textDecoration: 'none' }}>Projects</Link>
          {' / '}<Link href={`/admin/projects/${id}`} style={{ color: '#00897B', textDecoration: 'none' }}>{project.project_id}</Link>
          {' / Bid Review'}
        </p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#111111' }}>Bid Review</h1>
            <p style={{ fontSize: '13px', color: '#888888', marginTop: '4px' }}>{project.project_name}</p>
          </div>
          <Link
            href={`/admin/projects/${id}/budgets`}
            style={{ fontSize: '13px', fontWeight: 700, color: '#00897B', textDecoration: 'none', padding: '9px 18px', border: '1px solid #00897B', borderRadius: '4px' }}
          >
            Budget Comparison ›
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '28px' }}>
        {[
          { label: 'Partners', value: String(partners?.length ?? 0), sub: 'on this project' },
          { label: 'Bids Received', value: String(submittedCount), sub: 'submitted via portal' },
          { label: 'Approved', value: String(approvedCount), sub: 'approved for client' },
          { label: 'Client Budget', value: project.budget ? `€${Number(project.budget).toLocaleString('de-DE', { maximumFractionDigits: 0 })}` : '—', sub: 'approved budget' },
        ].map(card => (
          <div key={card.label} style={{ backgroundColor: '#FFFFFF', border: '1px solid #DDDDDD', borderRadius: '4px', padding: '16px 20px' }}>
            <p style={{ fontSize: '10px', fontWeight: 700, color: '#888888', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '6px' }}>{card.label}</p>
            <p style={{ fontSize: '22px', fontWeight: 700, color: '#111111', marginBottom: '2px' }}>{card.value}</p>
            <p style={{ fontSize: '11px', color: '#AAAAAA' }}>{card.sub}</p>
          </div>
        ))}
      </div>

      {/* No partners yet */}
      {!partners?.length ? (
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #DDDDDD', borderRadius: '4px', padding: '64px', textAlign: 'center', color: '#888888' }}>
          <p style={{ fontSize: '14px', marginBottom: '12px' }}>No production partners on this project yet.</p>
          <Link href={`/admin/projects/${id}/partners`} style={{ color: '#00897B', fontWeight: 700, textDecoration: 'none', fontSize: '13px' }}>
            Add partners ›
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {(partners as any[]).map(partner => {
            const bid = bidByPartner[partner.id] ?? null
            const budget = budgetByPartner[partner.id] ?? null
            const isShift = partner.company_name === 'SHIFT MEDIA'
            return (
              <BidReviewCard
                key={partner.id}
                projectId={id}
                partner={partner}
                bid={bid ? {
                  ...bid,
                  ai_flags: (bid.ai_flags as string[]) ?? [],
                } : null}
                budget={budget}
                isShift={isShift}
              />
            )
          })}
        </div>
      )}
    </>
  )
}
