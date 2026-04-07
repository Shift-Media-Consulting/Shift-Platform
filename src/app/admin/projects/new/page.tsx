import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import NewProjectForm from './NewProjectForm'

export const metadata = { title: 'New Project — SHIFT Platform' }

export default async function NewProjectPage() {
  const supabase = await createClient()
  const { data: clients } = await supabase
    .from('clients')
    .select('id, company_name')
    .order('company_name')

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <p style={{ fontSize: '11px', fontWeight: 700, color: '#00897B', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '4px' }}>Projects</p>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#111111' }}>New Project</h1>
        </div>
        <Link href="/admin/projects" style={{ fontSize: '13px', color: '#888888', textDecoration: 'none' }}>‹ Back to projects</Link>
      </div>
      <div style={{ maxWidth: '800px' }}>
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #DDDDDD', borderRadius: '4px', padding: '40px' }}>
          <NewProjectForm clients={clients ?? []} />
        </div>
      </div>
    </>
  )
}
