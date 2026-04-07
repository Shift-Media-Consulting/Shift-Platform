import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export const metadata = { title: 'Clients — SHIFT Platform' }

const typeColour: Record<string, string> = {
  'Brand': '#00897B', 'Agency': '#2980B9', 'Other': '#888888',
}

const statusColour: Record<string, string> = {
  'Setup': '#888888', 'Partner Selection': '#F39C12',
  'In Production': '#00897B', 'Post Production': '#2980B9',
  'Delivered': '#27AE60', 'Archived': '#AAAAAA',
}

export default async function ClientsPage() {
  const supabase = await createClient()
  const { data: clients } = await supabase
    .from('clients')
    .select('id, client_id, company_name, client_type, main_contact, email, sector, logo_url, created_at, projects(id, status, budget)')
    .order('company_name')

  const brandCount = (clients ?? []).filter(c => c.client_type === 'Brand').length
  const agencyCount = (clients ?? []).filter(c => c.client_type === 'Agency').length
  const activeProjectCount = (clients ?? []).flatMap(c => (c.projects as any[]) ?? [])
    .filter(p => !['Delivered', 'Archived'].includes(p.status)).length
  const totalBudget = (clients ?? []).flatMap(c => (c.projects as any[]) ?? [])
    .reduce((sum: number, p: any) => sum + (Number(p.budget) || 0), 0)

  return (
    <>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <p style={{ fontSize: '11px', fontWeight: 700, color: '#00897B', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '4px' }}>Client Management</p>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#111111' }}>Clients</h1>
          <p style={{ fontSize: '13px', color: '#888888', marginTop: '4px' }}>{clients?.length ?? 0} clients</p>
        </div>
        <Link href="/admin/clients/new" style={{ backgroundColor: '#00897B', color: '#FFFFFF', padding: '10px 20px', borderRadius: '4px', fontSize: '13px', fontWeight: 700, textDecoration: 'none' }}>
          + New Client
        </Link>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '24px' }}>
        {[
          { label: 'Total Clients', value: String(clients?.length ?? 0), sub: 'all accounts' },
          { label: 'Brands', value: String(brandCount), sub: 'direct clients' },
          { label: 'Agencies', value: String(agencyCount), sub: 'agency partners' },
          { label: 'Active Projects', value: String(activeProjectCount), sub: totalBudget ? `€${totalBudget.toLocaleString('de-DE')} total budget` : 'across all clients' },
        ].map(card => (
          <div key={card.label} style={{ backgroundColor: '#FFFFFF', border: '1px solid #DDDDDD', borderLeft: '3px solid #00897B', borderRadius: '4px', padding: '16px 20px' }}>
            <p style={{ fontSize: '10px', fontWeight: 700, color: '#888888', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '6px' }}>{card.label}</p>
            <p style={{ fontSize: '26px', fontWeight: 700, color: '#111111', marginBottom: '2px', lineHeight: 1 }}>{card.value}</p>
            <p style={{ fontSize: '11px', color: '#AAAAAA' }}>{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Client cards / table */}
      {!clients?.length ? (
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #DDDDDD', borderRadius: '4px', padding: '64px', textAlign: 'center', color: '#888888' }}>
          <p style={{ fontSize: '15px', marginBottom: '12px' }}>No clients yet.</p>
          <Link href="/admin/clients/new" style={{ color: '#00897B', fontWeight: 700, textDecoration: 'none', fontSize: '13px' }}>Create your first client ›</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '16px' }}>
          {(clients as any[]).map(c => {
            const projects = (c.projects as any[]) ?? []
            const activeProjects = projects.filter((p: any) => !['Delivered', 'Archived'].includes(p.status))
            const latestStatus = projects[0]?.status ?? null

            return (
              <Link key={c.id} href={`/admin/clients/${c.id}`} style={{ textDecoration: 'none' }}>
                <div style={{
                  backgroundColor: '#FFFFFF', border: '1px solid #DDDDDD', borderRadius: '4px',
                  padding: '20px 24px', cursor: 'pointer',
                  transition: 'border-color 0.15s',
                }}>
                  {/* Logo + name */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                    {c.logo_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={c.logo_url} alt={c.company_name} style={{ width: '40px', height: '40px', objectFit: 'contain', borderRadius: '4px', border: '1px solid #EEEEEE', padding: '4px', backgroundColor: '#FAFAFA' }} />
                    ) : (
                      <div style={{ width: '40px', height: '40px', borderRadius: '4px', border: '1px solid #EEEEEE', backgroundColor: '#F6F5F2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: '16px', fontWeight: 700, color: '#00897B' }}>{c.company_name.charAt(0)}</span>
                      </div>
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: '14px', fontWeight: 700, color: '#111111', marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.company_name}</p>
                      <p style={{ fontSize: '11px', color: '#888888' }}>{c.client_id}</p>
                    </div>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: typeColour[c.client_type] ?? '#888888', backgroundColor: (typeColour[c.client_type] ?? '#888888') + '18', padding: '3px 8px', borderRadius: '3px', whiteSpace: 'nowrap' }}>
                      {c.client_type}
                    </span>
                  </div>

                  {/* Details */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '14px' }}>
                    <div>
                      <p style={{ fontSize: '10px', fontWeight: 700, color: '#AAAAAA', letterSpacing: '0.4px', textTransform: 'uppercase', marginBottom: '2px' }}>Sector</p>
                      <p style={{ fontSize: '12px', color: '#555555' }}>{c.sector}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '10px', fontWeight: 700, color: '#AAAAAA', letterSpacing: '0.4px', textTransform: 'uppercase', marginBottom: '2px' }}>Main Contact</p>
                      <p style={{ fontSize: '12px', color: '#555555', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.main_contact}</p>
                    </div>
                  </div>

                  {/* Project stats */}
                  <div style={{ borderTop: '1px solid #F5F5F5', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '16px' }}>
                      <span style={{ fontSize: '12px', color: '#555555' }}>
                        <span style={{ fontWeight: 700, color: '#111111' }}>{projects.length}</span> project{projects.length !== 1 ? 's' : ''}
                      </span>
                      {activeProjects.length > 0 && (
                        <span style={{ fontSize: '12px', color: '#00897B', fontWeight: 700 }}>
                          {activeProjects.length} active
                        </span>
                      )}
                    </div>
                    {latestStatus && (
                      <span style={{ fontSize: '10px', fontWeight: 700, color: statusColour[latestStatus] ?? '#888888', backgroundColor: (statusColour[latestStatus] ?? '#888888') + '18', padding: '2px 7px', borderRadius: '3px' }}>
                        {latestStatus}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </>
  )
}
