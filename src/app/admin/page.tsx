import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { fmtDate } from '@/lib/utils/format-date'

export const metadata = { title: 'Dashboard — SHIFT Platform' }

const statusColour: Record<string, string> = {
  'Setup': '#888888', 'Partner Selection': '#F39C12',
  'In Production': '#00897B', 'Post Production': '#2980B9',
  'Delivered': '#27AE60', 'Archived': '#AAAAAA',
}

const PIPELINE_STAGES = ['Setup', 'Partner Selection', 'In Production', 'Post Production', 'Delivered']

export default async function AdminPage() {
  const supabase = await createClient()

  const [
    { count: clientCount },
    { data: projects },
    { data: partners },
  ] = await Promise.all([
    supabase.from('clients').select('*', { count: 'exact', head: true }),
    supabase
      .from('projects')
      .select('id, project_id, project_name, status, budget, consultant, created_at, clients(company_name), production_partners(id, bid_submitted, status)')
      .order('created_at', { ascending: false }),
    supabase
      .from('production_partners')
      .select('id, status, bid_submitted, project_id'),
  ])

  const activeProjects = (projects ?? []).filter(p => !['Archived', 'Delivered'].includes(p.status))
  const bidsReceived = (partners ?? []).filter(p => p.bid_submitted).length
  const approachedPartners = (partners ?? []).filter(p => ['Approached', 'Pitch', 'Awarded'].includes(p.status)).length

  const stageCount: Record<string, number> = {}
  PIPELINE_STAGES.forEach(s => { stageCount[s] = 0 })
  ;(projects ?? []).forEach(p => {
    if (PIPELINE_STAGES.includes(p.status)) stageCount[p.status]++
  })

  const today = new Date().toLocaleDateString('de-DE', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })

  return (
    <>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <p style={{ fontSize: '11px', fontWeight: 700, color: '#00897B', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '4px' }}>Dashboard</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#111111' }}>Control Centre</h1>
          <p style={{ fontSize: '12px', color: '#888888' }}>{today}</p>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '32px' }}>
        {[
          { label: 'Clients', value: clientCount ?? 0, href: '/admin/clients', sub: 'total' },
          { label: 'Active Projects', value: activeProjects.length, href: '/admin/projects', sub: 'in progress' },
          { label: 'Partners', value: (partners ?? []).length, href: '/admin/partners', sub: `${approachedPartners} approached` },
          { label: 'Bids Received', value: bidsReceived, href: '/admin/partners', sub: 'awaiting review' },
        ].map(card => (
          <Link key={card.label} href={card.href} style={{ textDecoration: 'none' }}>
            <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #DDDDDD', borderLeft: '4px solid #00897B', borderRadius: '4px', padding: '20px 24px' }}>
              <p style={{ fontSize: '10px', fontWeight: 700, color: '#888888', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '8px' }}>{card.label}</p>
              <p style={{ fontSize: '32px', fontWeight: 700, color: '#111111', marginBottom: '4px', lineHeight: 1 }}>{card.value}</p>
              <p style={{ fontSize: '11px', color: '#AAAAAA' }}>{card.sub}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Pipeline overview */}
      <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #DDDDDD', borderRadius: '4px', padding: '20px 24px', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '12px', fontWeight: 700, color: '#888888', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '16px' }}>Project Pipeline</h2>
        <div style={{ display: 'flex', gap: '0', borderRadius: '4px', overflow: 'hidden', border: '1px solid #EEEEEE' }}>
          {PIPELINE_STAGES.map((stage, i) => {
            const count = stageCount[stage] ?? 0
            const isLast = i === PIPELINE_STAGES.length - 1
            return (
              <div key={stage} style={{
                flex: 1, padding: '14px 12px', textAlign: 'center',
                borderRight: isLast ? 'none' : '1px solid #EEEEEE',
                backgroundColor: count > 0 ? '#F0FAF8' : '#FAFAFA',
              }}>
                <p style={{ fontSize: '22px', fontWeight: 700, color: count > 0 ? '#00897B' : '#CCCCCC', marginBottom: '4px' }}>{count}</p>
                <p style={{ fontSize: '10px', fontWeight: 700, color: count > 0 ? '#555555' : '#CCCCCC', letterSpacing: '0.3px', textTransform: 'uppercase' }}>{stage}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Projects table */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h2 style={{ fontSize: '14px', fontWeight: 700, color: '#111111' }}>All Projects</h2>
          <div style={{ display: 'flex', gap: '12px' }}>
            <Link href="/admin/projects/new" style={{ fontSize: '12px', color: '#FFFFFF', fontWeight: 700, textDecoration: 'none', backgroundColor: '#00897B', padding: '6px 14px', borderRadius: '4px' }}>+ New Project</Link>
            <Link href="/admin/projects" style={{ fontSize: '12px', color: '#00897B', fontWeight: 700, textDecoration: 'none' }}>View all ›</Link>
          </div>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #DDDDDD', borderRadius: '4px', overflow: 'hidden' }}>
          {!projects?.length ? (
            <div style={{ padding: '48px', textAlign: 'center', color: '#888888', fontSize: '13px' }}>
              No projects yet. <Link href="/admin/projects/new" style={{ color: '#00897B', fontWeight: 700, textDecoration: 'none' }}>Create your first ›</Link>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #EEEEEE', backgroundColor: '#FAFAFA' }}>
                  {['Project', 'Client', 'Consultant', 'Partners', 'Bids', 'Budget', 'Status', 'Created'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '10px', fontWeight: 700, color: '#888888', letterSpacing: '0.5px', textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(projects as any[]).map(p => {
                  const partnerList = (p.production_partners as any[]) ?? []
                  const bids = partnerList.filter((pp: any) => pp.bid_submitted).length
                  return (
                    <tr key={p.id} style={{ borderBottom: '1px solid #F5F5F5' }}>
                      <td style={{ padding: '12px 16px' }}>
                        <Link href={`/admin/projects/${p.id}`} style={{ fontSize: '13px', fontWeight: 700, color: '#111111', textDecoration: 'none' }}>{p.project_name}</Link>
                        <p style={{ fontSize: '10px', color: '#AAAAAA', marginTop: '1px' }}>{p.project_id}</p>
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: '13px', color: '#555555' }}>{(p.clients as any)?.company_name}</td>
                      <td style={{ padding: '12px 16px', fontSize: '12px', color: '#555555' }}>{p.consultant}</td>
                      <td style={{ padding: '12px 16px', fontSize: '13px', color: '#555555', textAlign: 'center' }}>{partnerList.length}</td>
                      <td style={{ padding: '12px 16px', fontSize: '13px', color: bids > 0 ? '#27AE60' : '#AAAAAA', fontWeight: bids > 0 ? 700 : 400, textAlign: 'center' }}>{bids}</td>
                      <td style={{ padding: '12px 16px', fontSize: '13px', color: '#555555' }}>
                        {p.budget ? `€${Number(p.budget).toLocaleString('de-DE')}` : '—'}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 700, color: statusColour[p.status] ?? '#888888', backgroundColor: (statusColour[p.status] ?? '#888888') + '18', padding: '3px 8px', borderRadius: '3px' }}>
                          {p.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: '11px', color: '#888888' }}>{fmtDate(p.created_at)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  )
}
