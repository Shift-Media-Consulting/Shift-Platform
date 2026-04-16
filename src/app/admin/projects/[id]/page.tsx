import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import ProjectEditForm from './ProjectEditForm'
import BriefAnalyzer from './BriefAnalyzer'
import { fmtDate } from '@/lib/utils/format-date'

export const metadata = { title: 'Project — SHIFT Platform' }

const statusColour: Record<string, string> = {
  'Setup': '#888888', 'Partner Selection': '#F39C12',
  'In Production': '#00897B', 'Post Production': '#2980B9',
  'Delivered': '#27AE60', 'Archived': '#AAAAAA',
}

const partnerStatusColour: Record<string, string> = {
  'Long List': '#888888', 'Short List': '#F39C12', 'Approached': '#2980B9',
  'Pitch': '#8E44AD', 'Awarded': '#27AE60', 'Not Awarded': '#C0392B',
}

const PIPELINE = ['Setup', 'Partner Selection', 'In Production', 'Post Production', 'Delivered']
const PARTNER_STAGES = ['Long List', 'Short List', 'Approached', 'Pitch', 'Awarded']

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const [
    { data: project },
    { data: clients },
    { data: partners },
  ] = await Promise.all([
    supabase.from('projects').select('*, clients(id, company_name)').eq('id', id).single(),
    supabase.from('clients').select('id, company_name').order('company_name'),
    supabase.from('production_partners').select('id, company_name, contact_name, status, bid_submitted, awarded').eq('project_id', id),
  ])

  if (!project) notFound()

  const currentStageIdx = PIPELINE.indexOf(project.status)
  const bidsReceived = (partners ?? []).filter(p => p.bid_submitted).length
  const partnersByStage: Record<string, number> = {}
  ;(partners ?? []).forEach(p => {
    partnersByStage[p.status] = (partnersByStage[p.status] || 0) + 1
  })

  return (
    <>
      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <p style={{ fontSize: '11px', fontWeight: 700, color: '#00897B', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '4px' }}>
          <Link href="/admin/projects" style={{ color: '#00897B', textDecoration: 'none' }}>Projects</Link> / {project.project_id}
        </p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#111111' }}>{project.project_name}</h1>
            <p style={{ fontSize: '13px', color: '#888888', marginTop: '2px' }}>
              {(project.clients as any)?.company_name}
              {project.consultant && ` · ${project.consultant}`}
              {project.sector && ` · ${project.sector}`}
            </p>
          </div>
          <span style={{ fontSize: '12px', fontWeight: 700, color: statusColour[project.status], backgroundColor: statusColour[project.status] + '18', padding: '6px 14px', borderRadius: '4px' }}>
            {project.status}
          </span>
        </div>
      </div>

      {/* Pipeline progress bar */}
      <div style={{ display: 'flex', borderRadius: '4px', overflow: 'hidden', border: '1px solid #DDDDDD', marginBottom: '24px' }}>
        {PIPELINE.map((stage, i) => {
          const isActive = i === currentStageIdx
          const isDone = currentStageIdx >= 0 && i < currentStageIdx
          return (
            <div key={stage} style={{
              flex: 1, padding: '10px 8px', textAlign: 'center',
              backgroundColor: isActive ? '#00897B' : isDone ? '#E8F5F3' : '#FAFAFA',
              color: isActive ? '#FFFFFF' : isDone ? '#00695C' : '#BBBBBB',
              fontSize: '10px', fontWeight: isActive || isDone ? 700 : 400,
              letterSpacing: '0.3px', textTransform: 'uppercase',
              borderRight: i < PIPELINE.length - 1 ? '1px solid #DDDDDD' : 'none',
            }}>
              {isDone ? '✓ ' : isActive ? '› ' : ''}{stage}
            </div>
          )
        })}
      </div>

      {/* Stats bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px' }}>
        {[
          { label: 'Budget', value: project.budget ? `€${Number(project.budget).toLocaleString('de-DE')}` : '—', sub: 'approved budget' },
          { label: 'Partners', value: String(partners?.length ?? 0), sub: `${bidsReceived} bid${bidsReceived !== 1 ? 's' : ''} received` },
          { label: 'Type', value: (project.project_type as string[])?.join(', ') || '—', sub: 'project type' },
          { label: 'Brief', value: project.brief_summary ? 'Analysed' : 'Pending', sub: project.brief_summary ? 'summary available' : 'no brief yet' },
        ].map(card => (
          <div key={card.label} style={{ backgroundColor: '#FFFFFF', border: '1px solid #DDDDDD', borderRadius: '4px', padding: '16px 20px' }}>
            <p style={{ fontSize: '10px', fontWeight: 700, color: '#888888', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '6px' }}>{card.label}</p>
            <p style={{ fontSize: '16px', fontWeight: 700, color: '#111111', marginBottom: '2px' }}>{card.value}</p>
            <p style={{ fontSize: '11px', color: '#AAAAAA' }}>{card.sub}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '24px' }}>

        {/* Left */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Partners overview */}
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #DDDDDD', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ padding: '18px 24px', borderBottom: '1px solid #EEEEEE', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '13px', fontWeight: 700, color: '#111111' }}>Production Partners ({partners?.length ?? 0})</h2>
              <Link href={`/admin/projects/${id}/partners`} style={{ fontSize: '12px', color: '#00897B', fontWeight: 700, textDecoration: 'none' }}>Manage ›</Link>
            </div>

            {/* Stage breakdown */}
            <div style={{ display: 'flex', borderBottom: '1px solid #EEEEEE' }}>
              {PARTNER_STAGES.map((stage, i) => {
                const count = partnersByStage[stage] ?? 0
                return (
                  <div key={stage} style={{
                    flex: 1, padding: '12px 8px', textAlign: 'center',
                    borderRight: i < PARTNER_STAGES.length - 1 ? '1px solid #EEEEEE' : 'none',
                    backgroundColor: count > 0 ? '#FAFAFA' : 'transparent',
                  }}>
                    <p style={{ fontSize: '20px', fontWeight: 700, color: count > 0 ? partnerStatusColour[stage] : '#DDDDDD' }}>{count}</p>
                    <p style={{ fontSize: '9px', fontWeight: 700, color: count > 0 ? '#888888' : '#CCCCCC', textTransform: 'uppercase', letterSpacing: '0.3px' }}>{stage}</p>
                  </div>
                )
              })}
            </div>

            {/* Partner list */}
            {!partners?.length ? (
              <div style={{ padding: '24px', textAlign: 'center', color: '#888888', fontSize: '13px' }}>
                No partners yet. <Link href={`/admin/projects/${id}/partners`} style={{ color: '#00897B', fontWeight: 700, textDecoration: 'none' }}>Add partners ›</Link>
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  {(partners as any[]).map(p => (
                    <tr key={p.id} style={{ borderBottom: '1px solid #F5F5F5' }}>
                      <td style={{ padding: '10px 20px', fontSize: '13px', fontWeight: 700, color: '#111111' }}>{p.company_name}</td>
                      <td style={{ padding: '10px 20px', fontSize: '12px', color: '#888888' }}>{p.contact_name}</td>
                      <td style={{ padding: '10px 20px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 700, color: partnerStatusColour[p.status], backgroundColor: partnerStatusColour[p.status] + '18', padding: '3px 8px', borderRadius: '3px' }}>{p.status}</span>
                      </td>
                      <td style={{ padding: '10px 20px', fontSize: '11px', color: p.bid_submitted ? '#27AE60' : '#AAAAAA', fontWeight: p.bid_submitted ? 700 : 400 }}>
                        {p.bid_submitted ? '✓ Bid received' : 'No bid'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Brief analysis */}
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #DDDDDD', borderRadius: '4px', padding: '24px' }}>
            <h2 style={{ fontSize: '13px', fontWeight: 700, color: '#111111', marginBottom: '6px' }}>Brief Analysis</h2>
            <p style={{ fontSize: '12px', color: '#888888', marginBottom: '16px' }}>Paste brief text to generate an AI summary and flag potential issues.</p>
            {project.brief_summary && (
              <div style={{ padding: '14px 16px', backgroundColor: '#E8F5F3', borderRadius: '4px', marginBottom: '16px' }}>
                <p style={{ fontSize: '10px', fontWeight: 700, color: '#00695C', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '6px' }}>Current Summary</p>
                <p style={{ fontSize: '13px', color: '#111111', lineHeight: 1.6 }}>{project.brief_summary}</p>
              </div>
            )}
            <BriefAnalyzer projectId={id} />
          </div>
        </div>

        {/* Right */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #DDDDDD', borderRadius: '4px', padding: '20px' }}>
            <h2 style={{ fontSize: '13px', fontWeight: 700, color: '#111111', marginBottom: '16px' }}>Project Info</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { label: 'Project ID', value: project.project_id },
                { label: 'Client', value: (project.clients as any)?.company_name || '—' },
                { label: 'Consultant', value: project.consultant || '—' },
                { label: 'Sector', value: project.sector || '—' },
                { label: 'Buyouts', value: project.buyouts ? 'Yes' : 'No' },
                { label: 'Agency', value: project.agency_name || '—' },
                { label: 'Notion', value: project.notion_id ? '✓ Synced' : '— Not synced' },
                { label: 'Created', value: fmtDate(project.created_at) },
              ].map(item => (
                <div key={item.label}>
                  <p style={{ fontSize: '10px', fontWeight: 700, color: '#888888', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '1px' }}>{item.label}</p>
                  <p style={{ fontSize: '13px', color: '#111111' }}>{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Link href={`/admin/projects/${id}/partners`} style={{ display: 'block', backgroundColor: '#00897B', color: '#FFFFFF', padding: '10px 16px', borderRadius: '4px', fontSize: '13px', fontWeight: 700, textDecoration: 'none', textAlign: 'center' }}>
              Manage Partners ›
            </Link>
            <Link href={`/admin/projects/${id}/budgets`} style={{ display: 'block', backgroundColor: '#FFFFFF', color: '#00897B', padding: '10px 16px', borderRadius: '4px', fontSize: '13px', fontWeight: 700, textDecoration: 'none', textAlign: 'center', border: '1px solid #00897B' }}>
              View Budgets ›
            </Link>
            {project.buyouts && (
              <Link href={`/admin/projects/${id}/buyouts`} style={{ display: 'block', backgroundColor: '#FFFFFF', color: '#111111', padding: '10px 16px', borderRadius: '4px', fontSize: '13px', fontWeight: 700, textDecoration: 'none', textAlign: 'center', border: '1px solid #DDDDDD' }}>
                Manage Buyouts ›
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Edit section */}
      <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #DDDDDD', borderRadius: '4px', padding: '32px' }}>
        <h2 style={{ fontSize: '13px', fontWeight: 700, color: '#111111', marginBottom: '24px' }}>Edit Project Details</h2>
        <ProjectEditForm project={project} clients={clients ?? []} />
      </div>
    </>
  )
}
