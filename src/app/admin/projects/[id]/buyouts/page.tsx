import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import AddBuyoutForm from './AddBuyoutForm'
import BuyoutLineActions from './BuyoutLineActions'

export const metadata = { title: 'Buyouts — SHIFT Platform' }

const statusColour: Record<string, string> = {
  'Active': '#27AE60', 'Expired': '#C0392B', 'Pending Renewal': '#F39C12', 'Renewed': '#2980B9',
}

export default async function ProjectBuyoutsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: project }, { data: buyoutProject }] = await Promise.all([
    supabase
      .from('projects')
      .select('id, project_id, project_name')
      .eq('id', id)
      .single(),
    supabase
      .from('buyout_projects')
      .select('id, buyout_project_id, buyout_line_items(*)')
      .eq('project_id', id)
      .maybeSingle(),
  ])

  if (!project) notFound()

  const lineItems: any[] = (buyoutProject?.buyout_line_items as any[]) ?? []
  const sorted = [...lineItems].sort((a, b) => new Date(a.rights_end).getTime() - new Date(b.rights_end).getTime())

  const expiringSoon = sorted.filter(item => {
    const daysLeft = Math.ceil((new Date(item.rights_end).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    return daysLeft <= 90 && item.status === 'Active'
  })

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <p style={{ fontSize: '11px', fontWeight: 700, color: '#00897B', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '4px' }}>
            <Link href="/admin/projects" style={{ color: '#00897B', textDecoration: 'none' }}>Projects</Link>
            {' / '}
            <Link href={`/admin/projects/${id}`} style={{ color: '#00897B', textDecoration: 'none' }}>{project.project_id}</Link>
            {' / Buyouts'}
          </p>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#111111' }}>Buyout Management</h1>
          <p style={{ fontSize: '13px', color: '#888888', marginTop: '4px' }}>{project.project_name}</p>
        </div>
        <Link
          href="/admin/buyouts"
          style={{ fontSize: '12px', color: '#888888', fontWeight: 700, textDecoration: 'none' }}
        >
          All Buyouts ›
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        <div>
          {expiringSoon.length > 0 && (
            <div style={{ backgroundColor: '#FFF8E1', border: '1px solid #FFD54F', borderRadius: '4px', padding: '14px 18px', marginBottom: '20px' }}>
              <p style={{ fontSize: '12px', fontWeight: 700, color: '#E65100' }}>
                ⚠ {expiringSoon.length} buyout{expiringSoon.length > 1 ? 's' : ''} expiring within 90 days
              </p>
            </div>
          )}

          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #DDDDDD', borderRadius: '4px', overflow: 'hidden' }}>
            {!sorted.length ? (
              <div style={{ padding: '48px', textAlign: 'center', color: '#888888', fontSize: '13px' }}>
                No buyout line items yet. Use the form to add the first one.
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #EEEEEE', backgroundColor: '#FAFAFA' }}>
                    {['Talent', 'Type', 'Media', 'Territories', 'Rights End', 'Fee', 'Status', ''].map(h => (
                      <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: '10px', fontWeight: 700, color: '#888888', letterSpacing: '0.5px', textTransform: 'uppercase' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((item: any) => {
                    const daysLeft = Math.ceil((new Date(item.rights_end).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
                    const isExpiringSoon = daysLeft <= 90 && item.status === 'Active'
                    return (
                      <tr key={item.id} style={{ borderBottom: '1px solid #F5F5F5', backgroundColor: isExpiringSoon ? '#FFFDE7' : 'transparent' }}>
                        <td style={{ padding: '12px 14px' }}>
                          <p style={{ fontSize: '13px', fontWeight: 700, color: '#111111' }}>{item.talent_name}</p>
                          {item.role && <p style={{ fontSize: '11px', color: '#888888' }}>{item.role}</p>}
                        </td>
                        <td style={{ padding: '12px 14px', fontSize: '12px', color: '#555555' }}>{item.talent_type}</td>
                        <td style={{ padding: '12px 14px', fontSize: '11px', color: '#555555' }}>
                          {(item.media_types as string[])?.join(', ') || '—'}
                        </td>
                        <td style={{ padding: '12px 14px', fontSize: '11px', color: '#555555' }}>
                          {(item.territories as string[])?.join(', ') || '—'}
                        </td>
                        <td style={{ padding: '12px 14px', fontSize: '12px', color: isExpiringSoon ? '#E65100' : '#555555', fontWeight: isExpiringSoon ? 700 : 400 }}>
                          {new Date(item.rights_end).toLocaleDateString('de-DE')}
                          {isExpiringSoon && <span style={{ fontSize: '10px', display: 'block' }}>{daysLeft}d left</span>}
                        </td>
                        <td style={{ padding: '12px 14px', fontSize: '13px', fontWeight: 700, color: '#111111' }}>
                          €{Number(item.buyout_fee).toLocaleString('de-DE')}
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <span style={{ fontSize: '11px', fontWeight: 700, color: statusColour[item.status], backgroundColor: statusColour[item.status] + '18', padding: '3px 8px', borderRadius: '3px' }}>
                            {item.status}
                          </span>
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <BuyoutLineActions item={item} projectId={id} />
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Add form */}
        <div>
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #DDDDDD', borderRadius: '4px', padding: '24px' }}>
            <h2 style={{ fontSize: '14px', fontWeight: 700, color: '#111111', marginBottom: '20px' }}>Add Line Item</h2>
            <AddBuyoutForm projectId={id} />
          </div>
        </div>
      </div>
    </>
  )
}
