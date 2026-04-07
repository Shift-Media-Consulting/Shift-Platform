import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export const metadata = { title: 'Dashboard — SHIFT Platform' }

export default async function AdminPage() {
  const supabase = await createClient()

  const [
    { count: clientCount },
    { count: projectCount },
    { data: recentProjects },
  ] = await Promise.all([
    supabase.from('clients').select('*', { count: 'exact', head: true }),
    supabase.from('projects').select('*', { count: 'exact', head: true }),
    supabase.from('projects')
      .select('id, project_id, project_name, status, created_at, clients(company_name)')
      .order('created_at', { ascending: false })
      .limit(5),
  ])

  const statusColour: Record<string, string> = {
    'Setup': '#888888',
    'Partner Selection': '#F39C12',
    'In Production': '#00897B',
    'Post Production': '#2980B9',
    'Delivered': '#27AE60',
    'Archived': '#AAAAAA',
  }

  return (
    <>
      <div style={{ marginBottom: '32px' }}>
        <p style={{ fontSize: '11px', fontWeight: 700, color: '#00897B', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '4px' }}>
          Dashboard
        </p>
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#111111' }}>Welcome back.</h1>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '40px' }}>
        {[
          { label: 'Clients', value: clientCount ?? 0, href: '/admin/clients', note: 'Total clients' },
          { label: 'Projects', value: projectCount ?? 0, href: '/admin/projects', note: 'All projects' },
          { label: 'Pending Actions', value: 0, href: '/admin', note: 'All clear' },
        ].map(card => (
          <Link key={card.label} href={card.href} style={{ textDecoration: 'none' }}>
            <div style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #DDDDDD',
              borderLeft: '4px solid #00897B',
              borderRadius: '4px',
              padding: '24px',
              cursor: 'pointer',
            }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#888888', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '12px' }}>
                {card.label}
              </div>
              <div style={{ fontSize: '36px', fontWeight: 700, color: '#111111', marginBottom: '4px' }}>
                {card.value}
              </div>
              <div style={{ fontSize: '12px', color: '#888888' }}>{card.note}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent projects */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '14px', fontWeight: 700, color: '#111111' }}>Recent Projects</h2>
          <Link href="/admin/projects" style={{ fontSize: '12px', color: '#00897B', fontWeight: 700, textDecoration: 'none' }}>
            View all ›
          </Link>
        </div>
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #DDDDDD', borderRadius: '4px', overflow: 'hidden' }}>
          {!recentProjects?.length ? (
            <div style={{ padding: '32px', textAlign: 'center', color: '#888888', fontSize: '13px' }}>
              No projects yet. <Link href="/admin/projects/new" style={{ color: '#00897B', fontWeight: 700, textDecoration: 'none' }}>Create your first project ›</Link>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #EEEEEE' }}>
                  {['Project ID', 'Name', 'Client', 'Status'].map(h => (
                    <th key={h} style={{ padding: '12px 20px', textAlign: 'left', fontSize: '10px', fontWeight: 700, color: '#888888', letterSpacing: '0.5px', textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentProjects.map((p: any) => (
                  <tr key={p.id} style={{ borderBottom: '1px solid #F5F5F5' }}>
                    <td style={{ padding: '12px 20px', fontSize: '12px', color: '#888888', fontWeight: 700 }}>{p.project_id}</td>
                    <td style={{ padding: '12px 20px' }}>
                      <Link href={`/admin/projects/${p.id}`} style={{ fontSize: '13px', color: '#111111', fontWeight: 700, textDecoration: 'none' }}>
                        {p.project_name}
                      </Link>
                    </td>
                    <td style={{ padding: '12px 20px', fontSize: '13px', color: '#555555' }}>{(p.clients as any)?.company_name}</td>
                    <td style={{ padding: '12px 20px' }}>
                      <span style={{
                        fontSize: '11px', fontWeight: 700,
                        color: statusColour[p.status] ?? '#888888',
                        backgroundColor: (statusColour[p.status] ?? '#888888') + '18',
                        padding: '3px 8px', borderRadius: '3px',
                      }}>{p.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  )
}
