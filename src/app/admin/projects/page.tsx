import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { fmtDate } from '@/lib/utils/format-date'

export const metadata = { title: 'Projects — SHIFT Platform' }

const statusColour: Record<string, string> = {
  'Setup': '#888888', 'Partner Selection': '#F39C12',
  'In Production': '#00897B', 'Post Production': '#2980B9',
  'Delivered': '#27AE60', 'Archived': '#AAAAAA',
}

const PIPELINE = ['Setup', 'Partner Selection', 'In Production', 'Post Production', 'Delivered']

export default async function ProjectsPage() {
  const supabase = await createClient()
  const { data: projects } = await supabase
    .from('projects')
    .select('id, project_id, project_name, status, consultant, budget, project_type, created_at, clients(company_name), production_partners(id, bid_submitted)')
    .order('created_at', { ascending: false })

  const stageCount: Record<string, number> = {}
  PIPELINE.forEach(s => { stageCount[s] = 0 })
  ;(projects ?? []).forEach(p => { if (stageCount[p.status] !== undefined) stageCount[p.status]++ })

  const totalBudget = (projects ?? []).reduce((s, p) => s + (Number(p.budget) || 0), 0)

  return (
    <>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <p style={{ fontSize: '11px', fontWeight: 700, color: '#00897B', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '4px' }}>Project Management</p>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#111111' }}>Projects</h1>
          <p style={{ fontSize: '13px', color: '#888888', marginTop: '4px' }}>
            {projects?.length ?? 0} total · {totalBudget ? `€${totalBudget.toLocaleString('de-DE')} total budget` : 'no budget set'}
          </p>
        </div>
        <Link href="/admin/projects/new" style={{ backgroundColor: '#00897B', color: '#FFFFFF', padding: '10px 20px', borderRadius: '4px', fontSize: '13px', fontWeight: 700, textDecoration: 'none' }}>
          + New Project
        </Link>
      </div>

      {/* Pipeline summary */}
      <div style={{ display: 'flex', gap: '0', borderRadius: '4px', overflow: 'hidden', border: '1px solid #DDDDDD', marginBottom: '24px', backgroundColor: '#FFFFFF' }}>
        {PIPELINE.map((stage, i) => {
          const count = stageCount[stage] ?? 0
          const isLast = i === PIPELINE.length - 1
          return (
            <div key={stage} style={{
              flex: 1, padding: '14px 16px',
              borderRight: isLast ? 'none' : '1px solid #EEEEEE',
              backgroundColor: count > 0 ? '#F0FAF8' : '#FAFAFA',
            }}>
              <p style={{ fontSize: '22px', fontWeight: 700, color: count > 0 ? '#00897B' : '#CCCCCC', marginBottom: '2px' }}>{count}</p>
              <p style={{ fontSize: '10px', fontWeight: 700, color: count > 0 ? '#00897B' : '#CCCCCC', letterSpacing: '0.3px', textTransform: 'uppercase' }}>{stage}</p>
            </div>
          )
        })}
      </div>

      {/* Table */}
      <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #DDDDDD', borderRadius: '4px', overflow: 'hidden' }}>
        {!projects?.length ? (
          <div style={{ padding: '64px', textAlign: 'center', color: '#888888' }}>
            <p style={{ fontSize: '15px', marginBottom: '12px' }}>No projects yet.</p>
            <Link href="/admin/projects/new" style={{ color: '#00897B', fontWeight: 700, textDecoration: 'none', fontSize: '13px' }}>Create your first project ›</Link>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #EEEEEE', backgroundColor: '#FAFAFA' }}>
                {['ID', 'Project', 'Client', 'Consultant', 'Partners', 'Budget', 'Status', 'Created', ''].map(h => (
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
                    <td style={{ padding: '13px 16px', fontSize: '11px', color: '#888888', fontWeight: 700, whiteSpace: 'nowrap' }}>{p.project_id}</td>
                    <td style={{ padding: '13px 16px' }}>
                      <Link href={`/admin/projects/${p.id}`} style={{ fontSize: '13px', fontWeight: 700, color: '#111111', textDecoration: 'none' }}>{p.project_name}</Link>
                      {(p.project_type as string[])?.length > 0 && (
                        <p style={{ fontSize: '11px', color: '#AAAAAA', marginTop: '1px' }}>{(p.project_type as string[]).join(', ')}</p>
                      )}
                    </td>
                    <td style={{ padding: '13px 16px', fontSize: '13px', color: '#555555' }}>{(p.clients as any)?.company_name}</td>
                    <td style={{ padding: '13px 16px', fontSize: '12px', color: '#555555' }}>{p.consultant}</td>
                    <td style={{ padding: '13px 16px' }}>
                      <span style={{ fontSize: '12px', color: '#555555' }}>{partnerList.length}</span>
                      {bids > 0 && <span style={{ fontSize: '10px', color: '#27AE60', fontWeight: 700, marginLeft: '4px' }}>({bids} bid{bids > 1 ? 's' : ''})</span>}
                    </td>
                    <td style={{ padding: '13px 16px', fontSize: '13px', color: '#555555' }}>
                      {p.budget ? `€${Number(p.budget).toLocaleString('de-DE')}` : '—'}
                    </td>
                    <td style={{ padding: '13px 16px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: statusColour[p.status], backgroundColor: statusColour[p.status] + '18', padding: '3px 8px', borderRadius: '3px' }}>
                        {p.status}
                      </span>
                    </td>
                    <td style={{ padding: '13px 16px', fontSize: '11px', color: '#888888', whiteSpace: 'nowrap' }}>{fmtDate(p.created_at)}</td>
                    <td style={{ padding: '13px 16px', textAlign: 'right' }}>
                      <Link href={`/admin/projects/${p.id}`} style={{ fontSize: '12px', color: '#00897B', fontWeight: 700, textDecoration: 'none' }}>View ›</Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </>
  )
}
