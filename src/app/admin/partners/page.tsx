import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export const metadata = { title: 'Partners — SHIFT Platform' }

const statusColour: Record<string, string> = {
  'Long List': '#888888', 'Short List': '#F39C12', 'Approached': '#2980B9',
  'Pitch': '#8E44AD', 'Awarded': '#27AE60', 'Not Awarded': '#C0392B',
}

export default async function AllPartnersPage() {
  const supabase = await createClient()
  const { data: partners } = await supabase
    .from('production_partners')
    .select('*, projects(project_id, project_name, clients(company_name))')
    .order('created_at', { ascending: false })

  return (
    <>
      <div style={{ marginBottom: '32px' }}>
        <p style={{ fontSize: '11px', fontWeight: 700, color: '#00897B', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '4px' }}>Production Partners</p>
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#111111' }}>All Partners</h1>
      </div>

      <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #DDDDDD', borderRadius: '4px', overflow: 'hidden' }}>
        {!partners?.length ? (
          <div style={{ padding: '64px', textAlign: 'center', color: '#888888', fontSize: '13px' }}>
            No partners yet. Add partners from within a project.
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #EEEEEE', backgroundColor: '#FAFAFA' }}>
                {['Company', 'Contact', 'Project', 'Client', 'Status', 'Bid', ''].map(h => (
                  <th key={h} style={{ padding: '12px 20px', textAlign: 'left', fontSize: '10px', fontWeight: 700, color: '#888888', letterSpacing: '0.5px', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(partners as any[]).map(p => (
                <tr key={p.id} style={{ borderBottom: '1px solid #F5F5F5' }}>
                  <td style={{ padding: '14px 20px', fontSize: '13px', fontWeight: 700, color: '#111111' }}>{p.company_name}</td>
                  <td style={{ padding: '14px 20px', fontSize: '13px', color: '#555555' }}>{p.contact_name}</td>
                  <td style={{ padding: '14px 20px' }}>
                    <Link href={`/admin/projects/${p.project_id}/partners`} style={{ fontSize: '13px', color: '#00897B', fontWeight: 700, textDecoration: 'none' }}>
                      {p.projects?.project_id}
                    </Link>
                  </td>
                  <td style={{ padding: '14px 20px', fontSize: '13px', color: '#555555' }}>{p.projects?.clients?.company_name}</td>
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: statusColour[p.status], backgroundColor: statusColour[p.status] + '18', padding: '3px 8px', borderRadius: '3px' }}>{p.status}</span>
                  </td>
                  <td style={{ padding: '14px 20px', fontSize: '12px', color: p.bid_submitted ? '#27AE60' : '#888888', fontWeight: p.bid_submitted ? 700 : 400 }}>
                    {p.bid_submitted ? '✓ Received' : 'Pending'}
                  </td>
                  <td style={{ padding: '14px 20px', textAlign: 'right' }}>
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
