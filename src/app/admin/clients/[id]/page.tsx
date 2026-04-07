import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import ClientEditForm from './ClientEditForm'
import { fmtDate } from '@/lib/utils/format-date'

export const metadata = { title: 'Client — SHIFT Platform' }

const statusColour: Record<string, string> = {
  'Setup': '#888888', 'Partner Selection': '#F39C12',
  'In Production': '#00897B', 'Post Production': '#2980B9',
  'Delivered': '#27AE60', 'Archived': '#AAAAAA',
}

const typeColour: Record<string, string> = {
  'Brand': '#00897B', 'Agency': '#2980B9', 'Other': '#888888',
}

export default async function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: client }, { data: projects }] = await Promise.all([
    supabase.from('clients').select('*').eq('id', id).single(),
    supabase
      .from('projects')
      .select('id, project_id, project_name, status, budget, consultant, project_type, created_at, production_partners(id, bid_submitted)')
      .eq('client_id', id)
      .order('created_at', { ascending: false }),
  ])

  if (!client) notFound()

  const totalBudget = (projects ?? []).reduce((sum, p) => sum + (Number(p.budget) || 0), 0)
  const activeProjects = (projects ?? []).filter(p => !['Delivered', 'Archived'].includes(p.status))
  const partnerCount = (projects ?? []).reduce((sum, p) => sum + ((p.production_partners as any[])?.length ?? 0), 0)

  const infoItem = (label: string, value: string) => (
    <div key={label}>
      <p style={{ fontSize: '10px', fontWeight: 700, color: '#888888', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '2px' }}>{label}</p>
      <p style={{ fontSize: '13px', color: '#111111' }}>{value}</p>
    </div>
  )

  return (
    <>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <p style={{ fontSize: '11px', fontWeight: 700, color: '#00897B', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '4px' }}>
          <Link href="/admin/clients" style={{ color: '#00897B', textDecoration: 'none' }}>Clients</Link> / {client.client_id}
        </p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#111111' }}>{client.company_name}</h1>
            <span style={{ fontSize: '11px', fontWeight: 700, color: typeColour[client.client_type] ?? '#888888', backgroundColor: (typeColour[client.client_type] ?? '#888888') + '18', padding: '3px 10px', borderRadius: '3px' }}>
              {client.client_type}
            </span>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#555555', backgroundColor: '#F0F0F0', padding: '3px 10px', borderRadius: '3px' }}>
              {client.sector}
            </span>
          </div>
          <Link href={`/admin/projects/new?client_id=${client.id}`} style={{ backgroundColor: '#00897B', color: '#FFFFFF', padding: '9px 18px', borderRadius: '4px', fontSize: '13px', fontWeight: 700, textDecoration: 'none' }}>
            + New Project
          </Link>
        </div>
      </div>

      {/* Stats bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px' }}>
        {[
          { label: 'Total Projects', value: String(projects?.length ?? 0), sub: `${activeProjects.length} active` },
          { label: 'Total Budget', value: totalBudget ? `€${totalBudget.toLocaleString('de-DE')}` : '—', sub: 'across all projects' },
          { label: 'Active Projects', value: String(activeProjects.length), sub: 'in progress' },
          { label: 'Partners', value: String(partnerCount), sub: 'production partners' },
        ].map(card => (
          <div key={card.label} style={{ backgroundColor: '#FFFFFF', border: '1px solid #DDDDDD', borderLeft: '3px solid #00897B', borderRadius: '4px', padding: '16px 20px' }}>
            <p style={{ fontSize: '10px', fontWeight: 700, color: '#888888', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '6px' }}>{card.label}</p>
            <p style={{ fontSize: '24px', fontWeight: 700, color: '#111111', marginBottom: '2px' }}>{card.value}</p>
            <p style={{ fontSize: '11px', color: '#AAAAAA' }}>{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '24px' }}>

        {/* Left: contact + projects */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Contact info */}
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #DDDDDD', borderRadius: '4px', padding: '24px' }}>
            <h2 style={{ fontSize: '13px', fontWeight: 700, color: '#111111', marginBottom: '16px' }}>Contact Information</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              {infoItem('Main Contact', client.main_contact)}
              {infoItem('Email', client.email)}
              {infoItem('Address', client.address || '—')}
              {infoItem('Client ID', client.client_id)}
            </div>
            {client.other_contacts && (
              <div style={{ marginTop: '14px', paddingTop: '14px', borderTop: '1px solid #F5F5F5' }}>
                <p style={{ fontSize: '10px', fontWeight: 700, color: '#888888', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '6px' }}>Other Contacts</p>
                <p style={{ fontSize: '13px', color: '#555555', whiteSpace: 'pre-line', lineHeight: 1.6 }}>{client.other_contacts}</p>
              </div>
            )}
          </div>

          {/* Projects list */}
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #DDDDDD', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ padding: '18px 24px', borderBottom: '1px solid #EEEEEE', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '13px', fontWeight: 700, color: '#111111' }}>Projects ({projects?.length ?? 0})</h2>
              <Link href={`/admin/projects/new?client_id=${client.id}`} style={{ fontSize: '12px', color: '#00897B', fontWeight: 700, textDecoration: 'none' }}>+ Add ›</Link>
            </div>
            {!projects?.length ? (
              <div style={{ padding: '32px', textAlign: 'center', color: '#888888', fontSize: '13px' }}>
                No projects yet. <Link href={`/admin/projects/new?client_id=${client.id}`} style={{ color: '#00897B', fontWeight: 700, textDecoration: 'none' }}>Create one ›</Link>
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#FAFAFA', borderBottom: '1px solid #EEEEEE' }}>
                    {['ID', 'Project', 'Partners', 'Budget', 'Status', ''].map(h => (
                      <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '10px', fontWeight: 700, color: '#888888', letterSpacing: '0.5px', textTransform: 'uppercase' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(projects as any[]).map(p => (
                    <tr key={p.id} style={{ borderBottom: '1px solid #F5F5F5' }}>
                      <td style={{ padding: '12px 16px', fontSize: '11px', color: '#888888', fontWeight: 700 }}>{p.project_id}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <Link href={`/admin/projects/${p.id}`} style={{ fontSize: '13px', fontWeight: 700, color: '#111111', textDecoration: 'none' }}>{p.project_name}</Link>
                        <p style={{ fontSize: '11px', color: '#AAAAAA', marginTop: '1px' }}>{(p.project_type as string[])?.join(', ') || '—'}</p>
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: '13px', color: '#555555' }}>
                        {(p.production_partners as any[])?.length ?? 0}
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: '13px', color: '#555555' }}>
                        {p.budget ? `€${Number(p.budget).toLocaleString('de-DE')}` : '—'}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 700, color: statusColour[p.status] ?? '#888888', backgroundColor: (statusColour[p.status] ?? '#888888') + '18', padding: '3px 8px', borderRadius: '3px' }}>
                          {p.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                        <Link href={`/admin/projects/${p.id}`} style={{ fontSize: '12px', color: '#00897B', fontWeight: 700, textDecoration: 'none' }}>View ›</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Right: metadata */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #DDDDDD', borderRadius: '4px', padding: '24px' }}>
            <h2 style={{ fontSize: '13px', fontWeight: 700, color: '#111111', marginBottom: '16px' }}>Client Details</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { label: 'Client ID', value: client.client_id },
                { label: 'Type', value: client.client_type },
                { label: 'Sector', value: client.sector },
                { label: 'Notion', value: client.notion_id ? '✓ Synced' : '— Not synced' },
                { label: 'Created', value: fmtDate(client.created_at) },
              ].map(item => (
                <div key={item.label}>
                  <p style={{ fontSize: '10px', fontWeight: 700, color: '#888888', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '2px' }}>{item.label}</p>
                  <p style={{ fontSize: '13px', color: '#111111' }}>{item.value}</p>
                </div>
              ))}
            </div>
          </div>
          {client.logo_url && (
            <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #DDDDDD', borderRadius: '4px', padding: '20px', textAlign: 'center' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={client.logo_url} alt={client.company_name} style={{ maxWidth: '100%', maxHeight: '80px', objectFit: 'contain' }} />
            </div>
          )}
        </div>
      </div>

      {/* Edit section */}
      <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #DDDDDD', borderRadius: '4px', padding: '32px' }}>
        <h2 style={{ fontSize: '13px', fontWeight: 700, color: '#111111', marginBottom: '24px' }}>Edit Client Details</h2>
        <ClientEditForm client={client} />
      </div>
    </>
  )
}
