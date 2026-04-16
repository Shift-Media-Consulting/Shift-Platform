import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import AddBudgetForm from './AddBudgetForm'

export const metadata = { title: 'Add Budget — SHIFT Platform' }

export default async function AddBudgetPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ partner?: string }>
}) {
  const { id } = await params
  const { partner: preselectedPartnerId } = await searchParams
  const supabase = await createClient()

  const [{ data: project }, { data: partners }] = await Promise.all([
    supabase
      .from('projects')
      .select('id, project_id, project_name')
      .eq('id', id)
      .single(),
    supabase
      .from('production_partners')
      .select('id, company_name, contact_name')
      .eq('project_id', id)
      .order('company_name'),
  ])

  if (!project) notFound()

  // If preselected partner is SHIFT MEDIA, show a badge
  const preselected = partners?.find(p => p.id === preselectedPartnerId)
  const isShiftBid = preselected?.company_name === 'SHIFT MEDIA'

  return (
    <>
      <div style={{ marginBottom: '32px' }}>
        <p style={{ fontSize: '11px', fontWeight: 700, color: '#00897B', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '4px' }}>
          <Link href="/admin/projects" style={{ color: '#00897B', textDecoration: 'none' }}>Projects</Link>
          {' / '}<Link href={`/admin/projects/${id}`} style={{ color: '#00897B', textDecoration: 'none' }}>{project.project_id}</Link>
          {' / '}<Link href={`/admin/projects/${id}/budgets`} style={{ color: '#00897B', textDecoration: 'none' }}>Budgets</Link>
          {' / Add'}
        </p>
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#111111' }}>
          {isShiftBid ? 'Add SHIFT Internal Bid' : 'Add Budget'}
        </h1>
        <p style={{ fontSize: '13px', color: '#888888', marginTop: '4px' }}>{project.project_name}</p>
        {isShiftBid && (
          <div style={{ marginTop: '12px', display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: '#E8F5F3', border: '1px solid #B2DFDB', borderRadius: '4px', padding: '8px 14px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#00695C' }}>SHIFT MEDIA — Internal Bid</span>
            <span style={{ fontSize: '12px', color: '#00897B' }}>Enter your own budget and creative treatment for this project.</span>
          </div>
        )}
      </div>

      <AddBudgetForm
        projectId={id}
        partners={partners ?? []}
        preselectedPartnerId={preselectedPartnerId}
      />
    </>
  )
}
