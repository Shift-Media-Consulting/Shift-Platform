import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import ProjectEditForm from './ProjectEditForm'
import BriefAnalyzer from './BriefAnalyzer'
import type { PageProps } from 'next/types'

export const metadata = { title: 'Project — SHIFT Platform' }

const statusColour: Record<string, string> = {
  'Setup': '#888888', 'Partner Selection': '#F39C12',
  'In Production': '#00897B', 'Post Production': '#2980B9',
  'Delivered': '#27AE60', 'Archived': '#AAAAAA',
}

export default async function ProjectDetailPage(props: PageProps<'/admin/projects/[id]'>) {
  const { id } = await props.params
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

  const partnerStatusColour: Record<string, string> = {
    'Long List': '#888888', 'Short List': '#F39C12', 'Approached': '#2980B9',
    'Pitch': '#8E44AD', 'Awarded': '#27AE60', 'Not Awarded': '#C0392B',
  }

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <p style={{ fontSize: '11px', fontWeight: 700, color: '#00897B', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '4px' }}>
            <Link href="/admin/projects" style={{ color: '#00897B', textDecoration: 'none' }}>Projects</Link> / {project.project_id}
          </p>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#111111' }}>{project.project_name}</h1>
          <p style={{ fontSize: '13px', color: '#888888', marginTop: '4px' }}>{(project.clients as any)?.company_name}</p>
        </div>
        <span style={{ fontSize: '12px', fontWeight: 700, color: statusColour[project.status], backgroundColor: statusColour[project.status] + '18', padding: '6px 14px', borderRadius: '4px' }}>
          {project.status}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Edit form */}
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #DDDDDD', borderRadius: '4px', padding: '32px' }}>
            <h2 style={{ fontSize: '14px', fontWeight: 700, color: '#111111', marginBottom: '24px' }}>Project Details</h2>
            <ProjectEditForm project={project} clients={clients ?? []} />
          </div>

          {/* Brief analysis */}
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #DDDDDD', borderRadius: '4px', padding: '32px' }}>
            <h2 style={{ fontSize: '14px', fontWeight: 700, color: '#111111', marginBottom: '8px' }}>Brief Analysis</h2>
            <p style={{ fontSize: '12px', color: '#888888', marginBottom: '20px' }}>Paste brief text to generate an AI summary and flag potential issues.</p>
            {project.brief_summary && (
              <div style={{ padding: '16px', backgroundColor: '#E8F5F3', borderRadius: '4px', marginBottom: '16px' }}>
                <p style={{ fontSize: '11px', fontWeight: 700, color: '#00695C', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '8px' }}>Current Summary</p>
                <p style={{ fontSize: '13px', color: '#111111', lineHeight: 1.6 }}>{project.brief_summary}</p>
              </div>
            )}
            <BriefAnalyzer projectId={id} />
          </div>

          {/* Partners */}
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #DDDDDD', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #EEEEEE', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '14px', fontWeight: 700, color: '#111111' }}>Production Partners ({partners?.length ?? 0})</h2>
              <Link href={`/admin/projects/${id}/partners`} style={{ fontSize: '12px', color: '#00897B', fontWeight: 700, textDecoration: 'none' }}>Manage ›</Link>
            </div>
            {!partners?.length ? (
              <div style={{ padding: '24px', textAlign: 'center', color: '#888888', fontSize: '13px' }}>
                No partners yet. <Link href={`/admin/projects/${id}/partners`} style={{ color: '#00897B', fontWeight: 700, textDecoration: 'none' }}>Add partners ›</Link>
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  {partners.map(p => (
                    <tr key={p.id} style={{ borderBottom: '1px solid #F5F5F5' }}>
                      <td style={{ padding: '12px 24px', fontSize: '13px', fontWeight: 700, color: '#111111' }}>{p.company_name}</td>
                      <td style={{ padding: '12px 24px', fontSize: '13px', color: '#555555' }}>{p.contact_name}</td>
                      <td style={{ padding: '12px 24px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 700, color: partnerStatusColour[p.status], backgroundColor: partnerStatusColour[p.status] + '18', padding: '3px 8px', borderRadius: '3px' }}>{p.status}</span>
                      </td>
                      <td style={{ padding: '12px 24px', fontSize: '11px', color: p.bid_submitted ? '#27AE60' : '#888888' }}>
                        {p.bid_submitted ? '✓ Bid received' : 'No bid'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Info panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #DDDDDD', borderRadius: '4px', padding: '24px' }}>
            <h2 style={{ fontSize: '14px', fontWeight: 700, color: '#111111', marginBottom: '20px' }}>Info</h2>
            {[
              { label: 'Project ID', value: project.project_id },
              { label: 'Consultant', value: project.consultant },
              { label: 'Budget', value: project.budget ? `€${Number(project.budget).toLocaleString('de-DE')}` : '—' },
              { label: 'Types', value: (project.project_type as string[])?.join(', ') || '—' },
              { label: 'Buyouts', value: project.buyouts ? 'Yes' : 'No' },
              { label: 'Notion', value: project.notion_id ? '✓ Synced' : '— Not synced' },
              { label: 'Created', value: new Date(project.created_at).toLocaleDateString('de-DE') },
            ].map(item => (
              <div key={item.label} style={{ marginBottom: '14px' }}>
                <p style={{ fontSize: '10px', fontWeight: 700, color: '#888888', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '2px' }}>{item.label}</p>
                <p style={{ fontSize: '13px', color: '#111111' }}>{item.value}</p>
              </div>
            ))}
          </div>
          <Link href={`/admin/projects/${id}/partners`} style={{ display: 'block', backgroundColor: '#00897B', color: '#FFFFFF', padding: '12px 20px', borderRadius: '4px', fontSize: '13px', fontWeight: 700, textDecoration: 'none', textAlign: 'center' }}>
            Manage Partners ›
          </Link>
          {project.buyouts && (
            <Link href={`/admin/projects/${id}/buyouts`} style={{ display: 'block', backgroundColor: '#FFFFFF', color: '#00897B', padding: '12px 20px', borderRadius: '4px', fontSize: '13px', fontWeight: 700, textDecoration: 'none', textAlign: 'center', border: '1px solid #00897B' }}>
              Manage Buyouts ›
            </Link>
          )}
        </div>
      </div>
    </>
  )
}
