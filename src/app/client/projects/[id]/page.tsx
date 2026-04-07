import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'

export const metadata = { title: 'Project — SHIFT.MEDIA Client Portal' }

const statusColour: Record<string, string> = {
  'Setup': '#888888', 'Partner Selection': '#F39C12',
  'In Production': '#00897B', 'Post Production': '#2980B9',
  'Delivered': '#27AE60', 'Archived': '#AAAAAA',
}

export default async function ClientProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?to=/client')

  const { data: profile } = await supabase
    .from('profiles')
    .select('client_id')
    .eq('id', user.id)
    .single()

  if (!profile?.client_id) redirect('/client')

  const [{ data: project }, { data: bids }] = await Promise.all([
    supabase
      .from('projects')
      .select('id, project_id, project_name, status, budget, consultant, project_type, brief_summary, created_at')
      .eq('id', id)
      .eq('client_id', profile.client_id)
      .single(),
    supabase
      .from('bids')
      .select('id, ai_summary, approved_for_client, production_partners(company_name, creative_name)')
      .eq('project_id', id)
      .eq('approved_for_client', true),
  ])

  if (!project) notFound()

  return (
    <>
      <div style={{ marginBottom: '32px' }}>
        <p style={{ fontSize: '11px', fontWeight: 700, color: '#00897B', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '4px' }}>
          <Link href="/client" style={{ color: '#00897B', textDecoration: 'none' }}>Dashboard</Link>
          {' / '}
          <Link href="/client/projects" style={{ color: '#00897B', textDecoration: 'none' }}>Projects</Link>
          {' / '}{project.project_id}
        </p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#111111' }}>{project.project_name}</h1>
          <span style={{ fontSize: '12px', fontWeight: 700, color: statusColour[project.status], backgroundColor: statusColour[project.status] + '18', padding: '6px 14px', borderRadius: '4px' }}>
            {project.status}
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {/* Brief summary */}
          {project.brief_summary && (
            <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #DDDDDD', borderRadius: '4px', padding: '32px' }}>
              <h2 style={{ fontSize: '14px', fontWeight: 700, color: '#111111', marginBottom: '16px' }}>Project Brief</h2>
              <p style={{ fontSize: '13px', color: '#555555', lineHeight: 1.7 }}>{project.brief_summary}</p>
            </div>
          )}

          {/* Approved bids */}
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #DDDDDD', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #EEEEEE' }}>
              <h2 style={{ fontSize: '14px', fontWeight: 700, color: '#111111' }}>Production Partner Proposals</h2>
              <p style={{ fontSize: '12px', color: '#888888', marginTop: '4px' }}>Reviewed and approved for you by SHIFT.MEDIA.</p>
            </div>
            {!bids?.length ? (
              <div style={{ padding: '40px 32px', textAlign: 'center', color: '#888888', fontSize: '13px' }}>
                No proposals ready yet. SHIFT.MEDIA will notify you when bids are available for review.
              </div>
            ) : (
              <div>
                {(bids as any[]).map((bid: any) => (
                  <div key={bid.id} style={{ padding: '24px', borderBottom: '1px solid #F5F5F5' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <div>
                        <p style={{ fontSize: '14px', fontWeight: 700, color: '#111111' }}>{bid.production_partners?.company_name}</p>
                        {bid.production_partners?.creative_name && (
                          <p style={{ fontSize: '12px', color: '#888888', marginTop: '2px' }}>Creative: {bid.production_partners.creative_name}</p>
                        )}
                      </div>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: '#27AE60', backgroundColor: '#27AE6018', padding: '3px 8px', borderRadius: '3px' }}>Approved</span>
                    </div>
                    {bid.ai_summary && (
                      <div style={{ padding: '14px 16px', backgroundColor: '#F6F5F2', borderRadius: '4px' }}>
                        <p style={{ fontSize: '10px', fontWeight: 700, color: '#888888', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>Summary</p>
                        <p style={{ fontSize: '13px', color: '#555555', lineHeight: 1.6 }}>{bid.ai_summary}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Info panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #DDDDDD', borderRadius: '4px', padding: '24px' }}>
            <h2 style={{ fontSize: '14px', fontWeight: 700, color: '#111111', marginBottom: '20px' }}>Project Info</h2>
            {[
              { label: 'Project ID', value: project.project_id },
              { label: 'Consultant', value: project.consultant || '—' },
              { label: 'Budget', value: project.budget ? `€${Number(project.budget).toLocaleString('de-DE')}` : '—' },
              { label: 'Type', value: (project.project_type as string[])?.join(', ') || '—' },
              { label: 'Started', value: new Date(project.created_at).toLocaleDateString('de-DE') },
            ].map(item => (
              <div key={item.label} style={{ marginBottom: '16px' }}>
                <p style={{ fontSize: '10px', fontWeight: 700, color: '#888888', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '2px' }}>{item.label}</p>
                <p style={{ fontSize: '13px', color: '#111111' }}>{item.value}</p>
              </div>
            ))}
          </div>
          <Link href="/client/projects" style={{ display: 'block', backgroundColor: '#FFFFFF', color: '#00897B', padding: '12px 20px', borderRadius: '4px', fontSize: '13px', fontWeight: 700, textDecoration: 'none', textAlign: 'center', border: '1px solid #00897B' }}>
            ← All Projects
          </Link>
        </div>
      </div>
    </>
  )
}
