import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import AddPartnerForm from './AddPartnerForm'
import PartnerActions from './PartnerActions'

export const metadata = { title: 'Partners — SHIFT Platform' }

const statusColour: Record<string, string> = {
  'Long List': '#888888', 'Short List': '#F39C12', 'Approached': '#2980B9',
  'Pitch': '#8E44AD', 'Awarded': '#27AE60', 'Not Awarded': '#C0392B',
}

export default async function PartnersPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: project }, { data: partners }] = await Promise.all([
    supabase.from('projects').select('id, project_id, project_name').eq('id', id).single(),
    supabase.from('production_partners')
      .select('*, bids(id, ai_summary, approved_for_client)')
      .eq('project_id', id)
      .order('created_at', { ascending: true }),
  ])

  if (!project) notFound()

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <p style={{ fontSize: '11px', fontWeight: 700, color: '#00897B', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '4px' }}>
            <Link href="/admin/projects" style={{ color: '#00897B', textDecoration: 'none' }}>Projects</Link>
            {' / '}<Link href={`/admin/projects/${id}`} style={{ color: '#00897B', textDecoration: 'none' }}>{project.project_id}</Link>
            {' / Partners'}
          </p>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#111111' }}>Production Partners</h1>
          <p style={{ fontSize: '13px', color: '#888888', marginTop: '4px' }}>{project.project_name}</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        <div>
          {/* Partner list */}
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #DDDDDD', borderRadius: '4px', overflow: 'hidden', marginBottom: '24px' }}>
            {!partners?.length ? (
              <div style={{ padding: '48px', textAlign: 'center', color: '#888888', fontSize: '13px' }}>No partners added yet.</div>
            ) : (
              partners.map(p => (
                <div key={p.id} style={{ padding: '20px 24px', borderBottom: '1px solid #F5F5F5' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <p style={{ fontSize: '14px', fontWeight: 700, color: '#111111', marginBottom: '2px' }}>{p.company_name}</p>
                      <p style={{ fontSize: '12px', color: '#888888' }}>{p.contact_name} · {p.contact_email}</p>
                      {p.creative_name && <p style={{ fontSize: '12px', color: '#888888' }}>Creative: {p.creative_name}</p>}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: statusColour[p.status], backgroundColor: statusColour[p.status] + '18', padding: '3px 8px', borderRadius: '3px' }}>
                        {p.status}
                      </span>
                      {p.bid_submitted && <span style={{ fontSize: '11px', fontWeight: 700, color: '#27AE60', backgroundColor: '#27AE6018', padding: '3px 8px', borderRadius: '3px' }}>Bid ✓</span>}
                    </div>
                  </div>
                  {p.portal_token && (
                    <div style={{ marginTop: '12px', padding: '10px 12px', backgroundColor: '#F6F5F2', borderRadius: '4px' }}>
                      <p style={{ fontSize: '10px', fontWeight: 700, color: '#888888', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '4px' }}>Bid Portal Link</p>
                      <code style={{ fontSize: '11px', color: '#00897B' }}>
                        {typeof window !== 'undefined' ? window.location.origin : 'https://shift-media.org'}/bid/{p.portal_token}
                      </code>
                    </div>
                  )}
                  <div style={{ marginTop: '12px' }}>
                    <PartnerActions partner={p} projectId={id} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Add partner form */}
        <div>
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #DDDDDD', borderRadius: '4px', padding: '24px' }}>
            <h2 style={{ fontSize: '14px', fontWeight: 700, color: '#111111', marginBottom: '20px' }}>Add Partner</h2>
            <AddPartnerForm projectId={id} />
          </div>
        </div>
      </div>
    </>
  )
}
