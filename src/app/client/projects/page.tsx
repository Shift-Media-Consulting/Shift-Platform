import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export const metadata = { title: 'Projects — SHIFT.MEDIA Client Portal' }

const statusColour: Record<string, string> = {
  'Setup': '#888888', 'Partner Selection': '#F39C12',
  'In Production': '#00897B', 'Post Production': '#2980B9',
  'Delivered': '#27AE60', 'Archived': '#AAAAAA',
}

export default async function ClientProjectsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?to=/client')

  const { data: profile } = await supabase
    .from('profiles')
    .select('client_id')
    .eq('id', user.id)
    .single()

  if (!profile?.client_id) redirect('/client')

  const { data: projects } = await supabase
    .from('projects')
    .select('id, project_id, project_name, status, budget, project_type, created_at')
    .eq('client_id', profile.client_id)
    .order('created_at', { ascending: false })

  return (
    <>
      <div style={{ marginBottom: '32px' }}>
        <p style={{ fontSize: '11px', fontWeight: 700, color: '#00897B', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '4px' }}>
          <Link href="/client" style={{ color: '#00897B', textDecoration: 'none' }}>Dashboard</Link> / Projects
        </p>
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#111111' }}>Your Projects</h1>
        <p style={{ fontSize: '13px', color: '#888888', marginTop: '4px' }}>{projects?.length ?? 0} project{projects?.length !== 1 ? 's' : ''}</p>
      </div>

      <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #DDDDDD', borderRadius: '4px', overflow: 'hidden' }}>
        {!projects?.length ? (
          <div style={{ padding: '64px', textAlign: 'center', color: '#888888', fontSize: '13px' }}>No projects yet. Contact SHIFT.MEDIA to get started.</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #EEEEEE', backgroundColor: '#FAFAFA' }}>
                {['ID', 'Project', 'Type', 'Budget', 'Status', ''].map(h => (
                  <th key={h} style={{ padding: '12px 24px', textAlign: 'left', fontSize: '10px', fontWeight: 700, color: '#888888', letterSpacing: '0.5px', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {projects.map(p => (
                <tr key={p.id} style={{ borderBottom: '1px solid #F5F5F5' }}>
                  <td style={{ padding: '16px 24px', fontSize: '11px', color: '#888888', fontWeight: 700 }}>{p.project_id}</td>
                  <td style={{ padding: '16px 24px' }}>
                    <Link href={`/client/projects/${p.id}`} style={{ fontSize: '13px', fontWeight: 700, color: '#111111', textDecoration: 'none' }}>{p.project_name}</Link>
                    <p style={{ fontSize: '11px', color: '#AAAAAA', marginTop: '2px' }}>{new Date(p.created_at).toLocaleDateString('de-DE')}</p>
                  </td>
                  <td style={{ padding: '16px 24px', fontSize: '12px', color: '#555555' }}>
                    {(p.project_type as string[])?.join(', ') || '—'}
                  </td>
                  <td style={{ padding: '16px 24px', fontSize: '13px', color: '#111111', fontWeight: 700 }}>
                    {p.budget ? `€${Number(p.budget).toLocaleString('de-DE')}` : '—'}
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: statusColour[p.status], backgroundColor: statusColour[p.status] + '18', padding: '3px 8px', borderRadius: '3px' }}>
                      {p.status}
                    </span>
                  </td>
                  <td style={{ padding: '16px 24px', textAlign: 'right' }}>
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
