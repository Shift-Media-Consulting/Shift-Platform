import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getEffectiveClientId } from '@/lib/client-preview'

export const metadata = { title: 'Client Portal — SHIFT.MEDIA' }

const statusColour: Record<string, string> = {
  'Setup': '#888888', 'Partner Selection': '#F39C12', 'In Production': '#00897B',
  'Post Production': '#2980B9', 'Delivered': '#27AE60', 'Archived': '#AAAAAA',
}

export default async function ClientDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?to=/client')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, client_id, full_name')
    .eq('id', user.id)
    .single()

  const clientId = await getEffectiveClientId(profile?.client_id, profile?.role ?? '')

  if (!clientId) {
    return (
      <div style={{ textAlign: 'center', padding: '64px' }}>
        <p style={{ color: '#888888', fontSize: '14px' }}>Your account is not yet linked to a client. Please contact SHIFT.MEDIA.</p>
      </div>
    )
  }

  const [{ data: projects }, { data: client }] = await Promise.all([
    supabase.from('projects').select('id, project_id, project_name, status, created_at').eq('client_id', clientId).order('created_at', { ascending: false }),
    supabase.from('clients').select('company_name').eq('id', clientId).single(),
  ])

  return (
    <>
      <div style={{ marginBottom: '32px' }}>
        <p style={{ fontSize: '11px', fontWeight: 700, color: '#00897B', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '4px' }}>Client Portal</p>
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#111111' }}>{client?.company_name ?? 'Dashboard'}</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '40px' }}>
        {[
          { label: 'Active Projects', value: projects?.filter(p => !['Delivered', 'Archived'].includes(p.status)).length ?? 0 },
          { label: 'Delivered', value: projects?.filter(p => p.status === 'Delivered').length ?? 0 },
          { label: 'Total Projects', value: projects?.length ?? 0 },
        ].map(card => (
          <div key={card.label} style={{ backgroundColor: '#FFFFFF', border: '1px solid #DDDDDD', borderLeft: '4px solid #00897B', borderRadius: '4px', padding: '24px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#888888', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '8px' }}>{card.label}</div>
            <div style={{ fontSize: '32px', fontWeight: 700, color: '#111111' }}>{card.value}</div>
          </div>
        ))}
      </div>

      <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #DDDDDD', borderRadius: '4px', overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #EEEEEE', display: 'flex', justifyContent: 'space-between' }}>
          <h2 style={{ fontSize: '14px', fontWeight: 700, color: '#111111' }}>Your Projects</h2>
          <Link href="/client/projects" style={{ fontSize: '12px', color: '#00897B', fontWeight: 700, textDecoration: 'none' }}>View all ›</Link>
        </div>
        {!projects?.length ? (
          <div style={{ padding: '32px', textAlign: 'center', color: '#888888', fontSize: '13px' }}>No projects yet.</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              {projects.map(p => (
                <tr key={p.id} style={{ borderBottom: '1px solid #F5F5F5' }}>
                  <td style={{ padding: '14px 24px', fontSize: '11px', color: '#888888', fontWeight: 700 }}>{p.project_id}</td>
                  <td style={{ padding: '14px 24px' }}>
                    <Link href={`/client/projects/${p.id}`} style={{ fontSize: '13px', fontWeight: 700, color: '#111111', textDecoration: 'none' }}>{p.project_name}</Link>
                  </td>
                  <td style={{ padding: '14px 24px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: statusColour[p.status], backgroundColor: statusColour[p.status] + '18', padding: '3px 8px', borderRadius: '3px' }}>{p.status}</span>
                  </td>
                  <td style={{ padding: '14px 24px', textAlign: 'right' }}>
                    <Link href={`/client/projects/${p.id}`} style={{ fontSize: '12px', color: '#00897B', fontWeight: 700, textDecoration: 'none' }}>View ›</Link>
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
