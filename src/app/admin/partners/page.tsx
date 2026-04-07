import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export const metadata = { title: 'Partners — SHIFT Platform' }

const statusColour: Record<string, string> = {
  'Long List': '#888888', 'Short List': '#F39C12', 'Approached': '#2980B9',
  'Pitch': '#8E44AD', 'Awarded': '#27AE60', 'Not Awarded': '#C0392B',
}

const STAGES = ['Long List', 'Short List', 'Approached', 'Pitch', 'Awarded', 'Not Awarded']

export default async function AllPartnersPage() {
  const supabase = await createClient()
  const { data: partners } = await supabase
    .from('production_partners')
    .select('*, projects(id, project_id, project_name, clients(company_name))')
    .order('created_at', { ascending: false })

  const byStage: Record<string, number> = {}
  STAGES.forEach(s => { byStage[s] = 0 })
  ;(partners ?? []).forEach(p => { if (byStage[p.status] !== undefined) byStage[p.status]++ })
  const bidsTotal = (partners ?? []).filter(p => p.bid_submitted).length

  return (
    <>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <p style={{ fontSize: '11px', fontWeight: 700, color: '#00897B', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '4px' }}>Production Partners</p>
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#111111' }}>Partners</h1>
        <p style={{ fontSize: '13px', color: '#888888', marginTop: '4px' }}>{partners?.length ?? 0} partners across all projects</p>
      </div>

      {/* Pipeline stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0', borderRadius: '4px', overflow: 'hidden', border: '1px solid #DDDDDD', marginBottom: '24px', backgroundColor: '#FFFFFF' }}>
        {STAGES.map((stage, i) => {
          const count = byStage[stage] ?? 0
          return (
            <div key={stage} style={{
              padding: '14px 12px', textAlign: 'center',
              borderRight: i < STAGES.length - 1 ? '1px solid #EEEEEE' : 'none',
              backgroundColor: count > 0 ? '#FAFAFA' : 'transparent',
            }}>
              <p style={{ fontSize: '22px', fontWeight: 700, color: count > 0 ? statusColour[stage] : '#DDDDDD', marginBottom: '4px' }}>{count}</p>
              <p style={{ fontSize: '9px', fontWeight: 700, color: count > 0 ? '#888888' : '#CCCCCC', textTransform: 'uppercase', letterSpacing: '0.3px' }}>{stage}</p>
            </div>
          )
        })}
        <div style={{ padding: '14px 12px', textAlign: 'center', backgroundColor: bidsTotal > 0 ? '#E8F5F3' : 'transparent' }}>
          <p style={{ fontSize: '22px', fontWeight: 700, color: bidsTotal > 0 ? '#27AE60' : '#DDDDDD', marginBottom: '4px' }}>{bidsTotal}</p>
          <p style={{ fontSize: '9px', fontWeight: 700, color: bidsTotal > 0 ? '#27AE60' : '#CCCCCC', textTransform: 'uppercase', letterSpacing: '0.3px' }}>Bids In</p>
        </div>
      </div>

      {/* Table */}
      <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #DDDDDD', borderRadius: '4px', overflow: 'hidden' }}>
        {!partners?.length ? (
          <div style={{ padding: '64px', textAlign: 'center', color: '#888888', fontSize: '13px' }}>
            No partners yet. Add partners from within a project.
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #EEEEEE', backgroundColor: '#FAFAFA' }}>
                {['Company', 'Contact', 'Creative', 'Project', 'Client', 'Status', 'Bid', ''].map(h => (
                  <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '10px', fontWeight: 700, color: '#888888', letterSpacing: '0.5px', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(partners as any[]).map(p => (
                <tr key={p.id} style={{ borderBottom: '1px solid #F5F5F5' }}>
                  <td style={{ padding: '13px 16px', fontSize: '13px', fontWeight: 700, color: '#111111' }}>{p.company_name}</td>
                  <td style={{ padding: '13px 16px', fontSize: '13px', color: '#555555' }}>{p.contact_name}</td>
                  <td style={{ padding: '13px 16px', fontSize: '12px', color: '#888888' }}>{p.creative_name || '—'}</td>
                  <td style={{ padding: '13px 16px' }}>
                    <Link href={`/admin/projects/${p.project_id}/partners`} style={{ fontSize: '13px', color: '#00897B', fontWeight: 700, textDecoration: 'none' }}>
                      {p.projects?.project_id}
                    </Link>
                    <p style={{ fontSize: '11px', color: '#AAAAAA', marginTop: '1px' }}>{p.projects?.project_name}</p>
                  </td>
                  <td style={{ padding: '13px 16px', fontSize: '13px', color: '#555555' }}>{p.projects?.clients?.company_name}</td>
                  <td style={{ padding: '13px 16px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: statusColour[p.status], backgroundColor: statusColour[p.status] + '18', padding: '3px 8px', borderRadius: '3px' }}>{p.status}</span>
                  </td>
                  <td style={{ padding: '13px 16px' }}>
                    {p.bid_submitted
                      ? <span style={{ fontSize: '11px', fontWeight: 700, color: '#27AE60', backgroundColor: '#27AE6018', padding: '3px 8px', borderRadius: '3px' }}>✓ Received</span>
                      : <span style={{ fontSize: '11px', color: '#AAAAAA' }}>Pending</span>
                    }
                  </td>
                  <td style={{ padding: '13px 16px', textAlign: 'right' }}>
                    <Link href={`/admin/projects/${p.project_id}/partners`} style={{ fontSize: '12px', color: '#00897B', fontWeight: 700, textDecoration: 'none' }}>View ›</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  )
}
