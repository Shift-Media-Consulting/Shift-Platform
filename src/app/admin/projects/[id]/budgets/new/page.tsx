import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import AddBudgetForm from './AddBudgetForm'

export const metadata = { title: 'Add Budget — SHIFT Platform' }

export default async function AddBudgetPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
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

  return (
    <>
      <div style={{ marginBottom: '32px' }}>
        <p style={{ fontSize: '11px', fontWeight: 700, color: '#00897B', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '4px' }}>
          <Link href="/admin/projects" style={{ color: '#00897B', textDecoration: 'none' }}>Projects</Link>
          {' / '}<Link href={`/admin/projects/${id}`} style={{ color: '#00897B', textDecoration: 'none' }}>{project.project_id}</Link>
          {' / '}<Link href={`/admin/projects/${id}/budgets`} style={{ color: '#00897B', textDecoration: 'none' }}>Budgets</Link>
          {' / Add'}
        </p>
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#111111' }}>Add Budget</h1>
        <p style={{ fontSize: '13px', color: '#888888', marginTop: '4px' }}>{project.project_name}</p>
      </div>

      <AddBudgetForm projectId={id} partners={partners ?? []} />
    </>
  )
}
