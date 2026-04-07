import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export const metadata = { title: 'Clients — SHIFT Platform' }

const sectorColour: Record<string, string> = {
  'Brand': '#00897B', 'Agency': '#2980B9', 'Other': '#888888',
}

export default async function ClientsPage() {
  const supabase = await createClient()
  const { data: clients } = await supabase
    .from('clients')
    .select('id, client_id, company_name, client_type, main_contact, email, sector, created_at')
    .order('created_at', { ascending: false })

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <p style={{ fontSize: '11px', fontWeight: 700, color: '#00897B', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '4px' }}>Client Management</p>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#111111' }}>Clients</h1>
        </div>
        <Link href="/admin/clients/new" style={{
          backgroundColor: '#00897B', color: '#FFFFFF',
          padding: '10px 20px', borderRadius: '4px',
          fontSize: '13px', fontWeight: 700, textDecoration: 'none',
        }}>
          + New Client
        </Link>
      </div>

      <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #DDDDDD', borderRadius: '4px', overflow: 'hidden' }}>
        {!clients?.length ? (
          <div style={{ padding: '64px', textAlign: 'center', color: '#888888' }}>
            <p style={{ fontSize: '15px', marginBottom: '12px' }}>No clients yet.</p>
            <Link href="/admin/clients/new" style={{ color: '#00897B', fontWeight: 700, textDecoration: 'none', fontSize: '13px' }}>
              Create your first client ›
            </Link>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #EEEEEE', backgroundColor: '#FAFAFA' }}>
                {['ID', 'Company', 'Type', 'Sector', 'Main Contact', 'Email', ''].map(h => (
                  <th key={h} style={{ padding: '12px 20px', textAlign: 'left', fontSize: '10px', fontWeight: 700, color: '#888888', letterSpacing: '0.5px', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {clients.map(c => (
                <tr key={c.id} style={{ borderBottom: '1px solid #F5F5F5' }}>
                  <td style={{ padding: '14px 20px', fontSize: '11px', color: '#888888', fontWeight: 700, whiteSpace: 'nowrap' }}>{c.client_id}</td>
                  <td style={{ padding: '14px 20px' }}>
                    <Link href={`/admin/clients/${c.id}`} style={{ fontSize: '13px', fontWeight: 700, color: '#111111', textDecoration: 'none' }}>
                      {c.company_name}
                    </Link>
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{
                      fontSize: '11px', fontWeight: 700,
                      color: sectorColour[c.client_type] ?? '#888888',
                      backgroundColor: (sectorColour[c.client_type] ?? '#888888') + '18',
                      padding: '3px 8px', borderRadius: '3px',
                    }}>{c.client_type}</span>
                  </td>
                  <td style={{ padding: '14px 20px', fontSize: '13px', color: '#555555' }}>{c.sector}</td>
                  <td style={{ padding: '14px 20px', fontSize: '13px', color: '#555555' }}>{c.main_contact}</td>
                  <td style={{ padding: '14px 20px', fontSize: '13px', color: '#555555' }}>{c.email}</td>
                  <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                    <Link href={`/admin/clients/${c.id}`} style={{ fontSize: '12px', color: '#00897B', fontWeight: 700, textDecoration: 'none' }}>View ›</Link>
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
