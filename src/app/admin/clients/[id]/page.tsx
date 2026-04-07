import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import ClientEditForm from './ClientEditForm'
import type { PageProps } from 'next/types'

export const metadata = { title: 'Client — SHIFT Platform' }

export default async function ClientDetailPage(props: PageProps<'/admin/clients/[id]'>) {
  const { id } = await props.params
  const supabase = await createClient()

  const [{ data: client }, { data: projects }] = await Promise.all([
    supabase.from('clients').select('*').eq('id', id).single(),
    supabase.from('projects')
      .select('id, project_id, project_name, status, created_at')
      .eq('client_id', id)
      .order('created_at', { ascending: false }),
  ])

  if (!client) notFound()

  const statusColour: Record<string, string> = {
    'Setup': '#888888', 'Partner Selection': '#F39C12',
    'In Production': '#00897B', 'Post Production': '#2980B9',
    'Delivered': '#27AE60', 'Archived': '#AAAAAA',
  }

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <p style={{ fontSize: '11px', fontWeight: 700, color: '#00897B', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '4px' }}>
            <Link href="/admin/clients" style={{ color: '#00897B', textDecoration: 'none' }}>Clients</Link> / {client.client_id}
          </p>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#111111' }}>{client.company_name}</h1>
        </div>
        <Link href={`/admin/projects/new?client_id=${client.id}`} style={{
          backgroundColor: '#00897B', color: '#FFFFFF',
          padding: '10px 20px', borderRadius: '4px',
          fontSize: '13px', fontWeight: 700, textDecoration: 'none',
        }}>
          + New Project
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* Edit form */}
        <div>
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #DDDDDD', borderRadius: '4px', padding: '32px', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '14px', fontWeight: 700, color: '#111111', marginBottom: '24px' }}>Client Details</h2>
            <ClientEditForm client={client} />
          </div>

          {/* Projects */}
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #DDDDDD', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #EEEEEE', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '14px', fontWeight: 700, color: '#111111' }}>Projects ({projects?.length ?? 0})</h2>
              <Link href={`/admin/projects/new?client_id=${client.id}`} style={{ fontSize: '12px', color: '#00897B', fontWeight: 700, textDecoration: 'none' }}>+ Add ›</Link>
            </div>
            {!projects?.length ? (
              <div style={{ padding: '32px', textAlign: 'center', color: '#888888', fontSize: '13px' }}>No projects yet.</div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  {projects.map(p => (
                    <tr key={p.id} style={{ borderBottom: '1px solid #F5F5F5' }}>
                      <td style={{ padding: '12px 24px', fontSize: '11px', color: '#888888', fontWeight: 700 }}>{p.project_id}</td>
                      <td style={{ padding: '12px 24px' }}>
                        <Link href={`/admin/projects/${p.id}`} style={{ fontSize: '13px', fontWeight: 700, color: '#111111', textDecoration: 'none' }}>{p.project_name}</Link>
                      </td>
                      <td style={{ padding: '12px 24px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 700, color: statusColour[p.status] ?? '#888888', backgroundColor: (statusColour[p.status] ?? '#888888') + '18', padding: '3px 8px', borderRadius: '3px' }}>{p.status}</span>
                      </td>
                      <td style={{ padding: '12px 24px', textAlign: 'right' }}>
                        <Link href={`/admin/projects/${p.id}`} style={{ fontSize: '12px', color: '#00897B', fontWeight: 700, textDecoration: 'none' }}>View ›</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Info panel */}
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #DDDDDD', borderRadius: '4px', padding: '24px', alignSelf: 'start' }}>
          <h2 style={{ fontSize: '14px', fontWeight: 700, color: '#111111', marginBottom: '20px' }}>Info</h2>
          {[
            { label: 'Client ID', value: client.client_id },
            { label: 'Type', value: client.client_type },
            { label: 'Sector', value: client.sector },
            { label: 'Notion', value: client.notion_id ? '✓ Synced' : '— Not synced' },
            { label: 'Created', value: new Date(client.created_at).toLocaleDateString('de-DE') },
          ].map(item => (
            <div key={item.label} style={{ marginBottom: '16px' }}>
              <p style={{ fontSize: '10px', fontWeight: 700, color: '#888888', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '2px' }}>{item.label}</p>
              <p style={{ fontSize: '13px', color: '#111111' }}>{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
