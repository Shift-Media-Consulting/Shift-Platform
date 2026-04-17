import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getEffectiveClientId } from '@/lib/client-preview'

export const metadata = { title: 'Buyouts — SHIFT.MEDIA Client Portal' }

const statusColour: Record<string, string> = {
  'Active': '#27AE60', 'Expired': '#C0392B', 'Pending Renewal': '#F39C12', 'Renewed': '#2980B9',
}

export default async function ClientBuyoutsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?to=/client')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, client_id')
    .eq('id', user.id)
    .single()

  const clientId = await getEffectiveClientId(profile?.client_id, profile?.role ?? '')
  if (!clientId) redirect('/client')

  const { data: buyoutProjects } = await supabase
    .from('buyout_projects')
    .select('id, buyout_project_id, projects(project_id, project_name), buyout_line_items(*)')
    .eq('client_id', clientId)

  const lineItems = (buyoutProjects ?? []).flatMap((bp: any) =>
    ((bp.buyout_line_items ?? []) as any[]).map((item: any) => ({
      ...item,
      project_id_str: bp.projects?.project_id ?? '—',
      project_name: bp.projects?.project_name ?? '—',
    }))
  ).sort((a: any, b: any) => new Date(a.rights_end).getTime() - new Date(b.rights_end).getTime())

  const expiringSoon = lineItems.filter(item => {
    const daysLeft = Math.ceil((new Date(item.rights_end).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    return daysLeft <= 90 && item.status === 'Active'
  })

  return (
    <>
      <div style={{ marginBottom: '32px' }}>
        <p style={{ fontSize: '11px', fontWeight: 700, color: '#00897B', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '4px' }}>Client Portal</p>
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#111111' }}>Talent Buyouts</h1>
        <p style={{ fontSize: '13px', color: '#888888', marginTop: '4px' }}>Usage rights for talent across your projects.</p>
      </div>

      {expiringSoon.length > 0 && (
        <div style={{ backgroundColor: '#FFF8E1', border: '1px solid #FFD54F', borderRadius: '4px', padding: '16px 20px', marginBottom: '24px' }}>
          <p style={{ fontSize: '12px', fontWeight: 700, color: '#E65100' }}>
            ⚠ {expiringSoon.length} buyout{expiringSoon.length > 1 ? 's' : ''} expiring within 90 days — contact SHIFT.MEDIA to discuss renewal.
          </p>
        </div>
      )}

      <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #DDDDDD', borderRadius: '4px', overflow: 'hidden' }}>
        {!lineItems.length ? (
          <div style={{ padding: '64px', textAlign: 'center', color: '#888888', fontSize: '13px' }}>No buyout line items yet.</div>
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
              {lineItems.map((item: any) => {
                const daysLeft = Math.ceil((new Date(item.rights_end).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
                const isExpiringSoon = daysLeft <= 90 && item.status === 'Active'
                return (
                  <tr key={item.id} style={{ borderBottom: '1px solid #F5F5F5', backgroundColor: isExpiringSoon ? '#FFFDE7' : 'transparent' }}>
                    <td style={{ padding: '12px 16px' }}>
                      <p style={{ fontSize: '13px', fontWeight: 700, color: '#111111' }}>{item.talent_name}</p>
                      {item.role && <p style={{ fontSize: '11px', color: '#888888' }}>{item.role}</p>}
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '12px', color: '#555555' }}>{item.talent_type}</td>
                    <td style={{ padding: '12px 16px', fontSize: '12px', color: '#555555' }}>{item.project_id_str}</td>
                    <td style={{ padding: '12px 16px', fontSize: '11px', color: '#555555' }}>{(item.media_types as string[])?.join(', ') || '—'}</td>
                    <td style={{ padding: '12px 16px', fontSize: '11px', color: '#555555' }}>{(item.territories as string[])?.join(', ') || '—'}</td>
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
