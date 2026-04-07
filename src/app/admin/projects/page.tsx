import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export const metadata = { title: 'Projects — SHIFT Platform' }

const statusColour: Record<string, string> = {
  'Setup': '#888888', 'Partner Selection': '#F39C12',
  'In Production': '#00897B', 'Post Production': '#2980B9',
  'Delivered': '#27AE60', 'Archived': '#AAAAAA',
}

export default async function ProjectsPage() {
  const supabase = await createClient()
  const { data: projects } = await supabase
    .from('projects')
    .select('id, project_id, project_name, status, consultant, budget, created_at, clients(company_name)')
    .order('created_at', { ascending: false })

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <p style={{ fontSize: '11px', fontWeight: 700, color: '#00897B', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '4px' }}>Project Management</p>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#111111' }}>Projects</h1>
        </div>
        <Link href="/admin/projects/new" style={{
          backgroundColor: '#00897B', color: '#FFFFFF',
          padding: '10px 20px', borderRadius: '4px',
          fontSize: '13px', fontWeight: 700, textDecoration: 'none',
        }}>
          + New Project
        </Link>
      </div>

      <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #DDDDDD', borderRadius: '4px', overflow: 'hidden' }}>
        {!projects?.length ? (
          <div style={{ padding: '64px', textAlign: 'center', color: '#888888' }}>
            <p style={{ fontSize: '15px', marginBottom: '12px' }}>No projects yet.</p>
            <Link href="/admin/projects/new" style={{ color: '#00897B', fontWeight: 700, textDecoration: 'none', fontSize: '13px' }}>
              Create your first project ›
            </Link>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #EEEEEE', backgroundColor: '#FAFAFA' }}>
                {['ID', 'Project', 'Client', 'Consultant', 'Budget', 'Status', ''].map(h => (
                  <th key={h} style={{ padding: '12px 20px', textAlign: 'left', fontSize: '10px', fontWeight: 700, color: '#888888', letterSpacing: '0.5px', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {projects.map((p: any) => (
                <tr key={p.id} style={{ borderBottom: '1px solid #F5F5F5' }}>
                  <td style={{ padding: '14px 20px', fontSize: '11px', color: '#888888', fontWeight: 700, whiteSpace: 'nowrap' }}>{p.project_id}</td>
                  <td style={{ padding: '14px 20px' }}>
                    <Link href={`/admin/projects/${p.id}`} style={{ fontSize: '13px', fontWeight: 700, color: '#111111', textDecoration: 'none' }}>{p.project_name}</Link>
                  </td>
                  <td style={{ padding: '14px 20px', fontSize: '13px', color: '#555555' }}>{p.clients?.company_name}</td>
                  <td style={{ padding: '14px 20px', fontSize: '13px', color: '#555555' }}>{p.consultant}</td>
                  <td style={{ padding: '14px 20px', fontSize: '13px', color: '#555555' }}>
                    {p.budget ? `€${Number(p.budget).toLocaleString('de-DE')}` : '—'}
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: statusColour[p.status], backgroundColor: statusColour[p.status] + '18', padding: '3px 8px', borderRadius: '3px' }}>
                      {p.status}
                    </span>
                  </td>
                  <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                    <Link href={`/admin/projects/${p.id}`} style={{ fontSize: '12px', color: '#00897B', fontWeight: 700, textDecoration: 'none' }}>View ›</Link>
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
