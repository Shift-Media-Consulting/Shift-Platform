import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export const metadata = { title: 'Buyouts — SHIFT Platform' }

const statusColour: Record<string, string> = {
  'Active': '#27AE60', 'Expired': '#C0392B', 'Pending Renewal': '#F39C12', 'Renewed': '#2980B9',
}

export default async function BuyoutsPage() {
  const supabase = await createClient()
  const { data: lineItems } = await supabase
    .from('buyout_line_items')
    .select('*, buyout_projects(buyout_project_id, projects(project_name, project_id), clients(company_name))')
    .order('rights_end', { ascending: true })

  return (
    <>
      <div style={{ marginBottom: '32px' }}>
        <p style={{ fontSize: '11px', fontWeight: 700, color: '#00897B', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '4px' }}>Buyout Management</p>
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#111111' }}>Buyouts</h1>
        <p style={{ fontSize: '13px', color: '#888888', marginTop: '4px' }}>Talent usage rights across all active projects.</p>
      </div>

      {/* Expiry alerts */}
      {(() => {
        const soon = lineItems?.filter(item => {
          const daysLeft = Math.ceil((new Date(item.rights_end).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
          return daysLeft <= 90 && item.status === 'Active'
        }) ?? []
        if (!soon.length) return null
        return (
          <div style={{ backgroundColor: '#FFF8E1', border: '1px solid #FFD54F', borderRadius: '4px', padding: '16px 20px', marginBottom: '24px' }}>
            <p style={{ fontSize: '12px', fontWeight: 700, color: '#E65100' }}>⚠ {soon.length} buyout{soon.length > 1 ? 's' : ''} expiring within 90 days</p>
          </div>
        )
      })()}

      <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #DDDDDD', borderRadius: '4px', overflow: 'hidden' }}>
        {!lineItems?.length ? (
          <div style={{ padding: '64px', textAlign: 'center', color: '#888888', fontSize: '13px' }}>
            No buyout line items yet. Buyouts are added from within a project.
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #EEEEEE', backgroundColor: '#FAFAFA' }}>
                {['Talent', 'Type', 'Project', 'Media', 'Territories', 'Rights End', 'Fee', 'Status'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '10px', fontWeight: 700, color: '#888888', letterSpacing: '0.5px', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(lineItems as any[]).map(item => {
                const daysLeft = Math.ceil((new Date(item.rights_end).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
                const isExpiringSoon = daysLeft <= 90 && item.status === 'Active'
                return (
                  <tr key={item.id} style={{ borderBottom: '1px solid #F5F5F5', backgroundColor: isExpiringSoon ? '#FFFDE7' : 'transparent' }}>
                    <td style={{ padding: '12px 16px' }}>
                      <p style={{ fontSize: '13px', fontWeight: 700, color: '#111111' }}>{item.talent_name}</p>
                      {item.role && <p style={{ fontSize: '11px', color: '#888888' }}>{item.role}</p>}
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '12px', color: '#555555' }}>{item.talent_type}</td>
                    <td style={{ padding: '12px 16px', fontSize: '12px', color: '#555555' }}>
                      {item.buyout_projects?.projects?.project_id ?? '—'}
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '11px', color: '#555555' }}>
                      {(item.media_types as string[])?.join(', ') || '—'}
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '11px', color: '#555555' }}>
                      {(item.territories as string[])?.join(', ') || '—'}
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '12px', color: isExpiringSoon ? '#E65100' : '#555555', fontWeight: isExpiringSoon ? 700 : 400 }}>
                      {new Date(item.rights_end).toLocaleDateString('de-DE')}
                      {isExpiringSoon && <span style={{ fontSize: '10px', display: 'block' }}>{daysLeft}d left</span>}
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: 700, color: '#111111' }}>
                      €{Number(item.buyout_fee).toLocaleString('de-DE')}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: statusColour[item.status], backgroundColor: statusColour[item.status] + '18', padding: '3px 8px', borderRadius: '3px' }}>
                        {item.status}
                      </span>
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
